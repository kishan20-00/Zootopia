from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
import cv2
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model
model = tf.keras.models.load_model('animal_detect.h5')

# Define class labels
class_labels = ["deer", "elephant", "giraffe", "hippopotamus", "horse", "leopard", "lion", "tiger", "zebra"]

# Define route for real-time video frame classification
@app.route('/predict_frame', methods=['POST'])
def predict_frame():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if not file:
        return jsonify({'error': 'File is empty'}), 400

    # Read the image file
    file_stream = file.read()
    np_img = np.frombuffer(file_stream, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if frame is None:
        return jsonify({'error': 'Unable to decode image'}), 400

    # Preprocess the frame (resize and normalize)
    frame_resized = cv2.resize(frame, (224, 224))
    img_array = np.array(frame_resized) / 255.0  # Normalize image array

    # Predict class probabilities
    predictions = model.predict(np.expand_dims(img_array, axis=0))[0]

    # Get predicted class label
    predicted_class_index = np.argmax(predictions)
    predicted_class = class_labels[predicted_class_index]

    # Get confidence score
    confidence = predictions[predicted_class_index]

    # Prepare response
    response = {
        'predicted_class': predicted_class,
        'confidence': float(confidence)
    }

    return jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006)
