from flask import Flask, request, jsonify
import numpy as np
import cv2
import pandas as pd
import os
from tensorflow import keras
from tensorflow.keras.models import load_model
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = "sequence_model.h5"
sequence_model = load_model(model_path)

train_df = pd.read_csv("F:/KA Projects/zootopia/behaviordetection/train.csv")
label_processor = keras.layers.StringLookup(num_oov_indices=0, vocabulary=np.unique(train_df["Classification"]))

IMG_SIZE = 224
BATCH_SIZE = 64
EPOCHS = 10

MAX_SEQ_LENGTH = 20
NUM_FEATURES = 2048

def crop_center_square(frame):
    y, x = frame.shape[0:2]
    min_dim = min(y, x)
    start_x = (x // 2) - (min_dim // 2)
    start_y = (y // 2) - (min_dim // 2)
    return frame[start_y : start_y + min_dim, start_x : start_x + min_dim]

def build_feature_extractor():
    feature_extractor = keras.applications.InceptionV3(
        weights="imagenet",
        include_top=False,
        pooling="avg",
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
    )
    preprocess_input = keras.applications.inception_v3.preprocess_input

    inputs = keras.Input((IMG_SIZE, IMG_SIZE, 3))
    preprocessed = preprocess_input(inputs)

    outputs = feature_extractor(preprocessed)
    return keras.Model(inputs, outputs, name="feature_extractor")

feature_extractor = build_feature_extractor()

def prepare_single_video(frames):
    frames = frames[None, ...]
    frame_mask = np.zeros(shape=(1, MAX_SEQ_LENGTH,), dtype="bool")
    frame_features = np.zeros(shape=(1, MAX_SEQ_LENGTH, NUM_FEATURES), dtype="float32")

    for i, batch in enumerate(frames):
        video_length = batch.shape[0]
        length = min(MAX_SEQ_LENGTH, video_length)
        for j in range(length):
            frame_features[i, j, :] = feature_extractor.predict(batch[None, j, :])
        frame_mask[i, :length] = 1  # 1 = not masked, 0 = masked

    return frame_features, frame_mask

# Function to preprocess video frames
def load_video_frames(path, max_frames=0, resize=(224, 224)):
    cap = cv2.VideoCapture(path)
    frames = []
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame = crop_center_square(frame)
            frame = cv2.resize(frame, resize)
            frame = frame[:, :, [2, 1, 0]]  # Convert BGR to RGB
            frames.append(frame)

            if len(frames) == max_frames:
                break
    finally:
        cap.release()
    return np.array(frames)

# Function to preprocess a single video
def preprocess_video(video_path):
    frames = load_video_frames(video_path)
    return frames

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    # Get video file from request
    video_file = request.files['video']
    video_path = 'temp_video.mp4'
    video_file.save(video_path)

    # Preprocess video
    video_frames = preprocess_video(video_path)

    # Make predictions
    probabilities = make_predictions(video_frames)

    # Get class labels
    class_labels = label_processor.get_vocabulary()

    # Find the class with the highest probability
    max_probability_index = np.argmax(probabilities)
    predicted_class = class_labels[max_probability_index]

    # Remove temporary video file
    os.remove(video_path)

    return jsonify({'prediction': predicted_class})


# Function to make predictions
def make_predictions(video_frames):
    frame_features, frame_mask = prepare_single_video(video_frames)
    probabilities = sequence_model.predict([frame_features, frame_mask])[0]
    return probabilities

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5008)
