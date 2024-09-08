from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
import cv2
import io

app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('animal_species_detect.h5')

# Define class labels
class_labels = ["elephas_maximus_borneensis", "elephas_maximus_indicus", "elephas_maximus_maximus", "elephas_maximus_sumatranus", "panthera_leo_leo", "panthera_leo_melanochaita", "panthera_onca", "panthera_pardus_delacouri", "panthera_pardus_fusca", "panthera_pardus_kotiya", "panthera_pardus_melas", "panthera_pardus_pardus", "panthera_pardus_tulliana", "panthera_tigris"]

# Define route for real-time video frame classification
@app.route('/predict_frame', methods=['POST'])
def predict_frame():
    # Get video frame from the request
    file_stream = request.files['image'].read()
    np_img = np.frombuffer(file_stream, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    
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
    app.run(debug=True)
