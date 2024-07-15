from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf

app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('animal_detect.h5')

# Define class labels
class_labels = ["deer", "elephant", "giraffe", "hippopotamus", "horse", "lion", "tiger", "zebra"]

# Define route for image classification
@app.route('/predict', methods=['POST'])
def predict():
    # Get image file from request
    img_file = request.files['image']
    img = Image.open(img_file)
    img = img.resize((224, 224))  # Resize image to match model input size
    img_array = np.array(img) / 255.0  # Normalize image array
    
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
