import cv2
import numpy as np
import pandas as pd
from tensorflow import keras
from tensorflow.keras.models import load_model

# Load the trained model
model_path = "sequence_model.h5"
sequence_model = load_model(model_path)

train_df = pd.read_csv("F:/KA Projects/zootopia/behaviordetection/train.csv")
label_processor = keras.layers.StringLookup(num_oov_indices=0, vocabulary=np.unique(train_df["Classification"]))

IMG_SIZE = 224
MAX_SEQ_LENGTH = 20
NUM_FEATURES = 2048

def crop_center_square(frame):
    y, x = frame.shape[0:2]
    min_dim = min(y, x)
    start_x = (x // 2) - (min_dim // 2)
    start_y = (y // 2) - (min_dim // 2)
    return frame[start_y: start_y + min_dim, start_x: start_x + min_dim]

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

# Function to preprocess a single frame
def preprocess_frame(frame):
    frame = crop_center_square(frame)
    frame = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
    frame = frame[:, :, [2, 1, 0]]  # Convert BGR to RGB
    frame = np.expand_dims(frame, axis=0)  # Add batch dimension
    return frame


# Function to make predictions
def make_predictions(frame):
    frame_features, frame_mask = prepare_single_video(frame)
    probabilities = sequence_model.predict([frame_features, frame_mask])[0]
    return probabilities

# Function to get the predicted class
def get_predicted_class(probabilities):
    class_labels = label_processor.get_vocabulary()
    max_probability_index = np.argmax(probabilities)
    predicted_class = class_labels[max_probability_index]
    return predicted_class

# Initialize camera
camera = cv2.VideoCapture(0)

while True:
    # Capture frame-by-frame
    ret, frame = camera.read()
    if not ret:
        break

    # Preprocess frame
    preprocessed_frame = preprocess_frame(frame)

    # Make predictions
    probabilities = make_predictions(preprocessed_frame)
    predicted_class = get_predicted_class(probabilities)

    # Display prediction on the frame
    cv2.putText(frame, predicted_class, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

    # Display the resulting frame
    cv2.imshow('Prediction', frame)

    # Exit on 'q' press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera
camera.release()
cv2.destroyAllWindows()
