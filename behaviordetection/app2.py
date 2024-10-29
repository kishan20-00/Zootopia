from flask import Flask, request, jsonify
import numpy as np
import cv2
import pandas as pd
from tensorflow import keras
from tensorflow.keras.models import load_model
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = "sequence_model.h5"
sequence_model = load_model(model_path)

train_df = pd.read_csv("F:/KA Projects/zootopia/behaviordetection/train.csv")
label_processor = keras.layers.StringLookup(num_oov_indices=0, vocabulary=np.unique(train_df["Classification"]))

IMG_SIZE = 224
NUM_FEATURES = 2048
MAX_SEQ_LENGTH = 20

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

def prepare_frame(frame):
    # Preprocess the frame
    frame = crop_center_square(frame)
    frame = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
    frame = frame[:, :, [2, 1, 0]]  # Convert BGR to RGB
    frame = np.expand_dims(frame, axis=0)  # Add batch dimension
    return frame

@app.route('/predict_frame', methods=['POST'])
def predict_frame():
    data = request.json
    img_data = data['image']
    
    # Decode the image
    img_data = base64.b64decode(img_data)
    nparr = np.frombuffer(img_data, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Prepare the frame for prediction
    frame = prepare_frame(frame)

    # Extract features
    frame_features = feature_extractor.predict(frame)

    # Create a frame mask
    frame_mask = np.zeros(shape=(1, MAX_SEQ_LENGTH,), dtype="bool")
    frame_mask[0, 0] = 1  # Marking the first frame as valid

    # Adjust the input shape
    # Since we only have one frame, we need to repeat it to fill the sequence length
    frame_features_sequence = np.repeat(np.expand_dims(frame_features, axis=1), MAX_SEQ_LENGTH, axis=1)

    # Make predictions
    probabilities = sequence_model.predict([frame_features_sequence, frame_mask])  # Correct input shape

    # Get class labels
    class_labels = label_processor.get_vocabulary()

    # Find the class with the highest probability
    max_probability_index = np.argmax(probabilities)
    predicted_class = class_labels[max_probability_index]
    confidence = float(probabilities[0][max_probability_index])  # Convert to Python float

    return jsonify({'predicted_class': predicted_class, 'confidence': confidence})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5008)
