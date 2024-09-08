from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model
model = tf.keras.models.load_model('animal_detect.h5')

# Define class labels
class_labels = ["deer", "elephant", "giraffe", "hippopotamus", "horse", "leopard", "lion", "tiger", "zebra"]

# Define route for image classification
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    try:
        img_file = request.files['image']
        img = Image.open(img_file)
        img = img.resize((224, 224))  # Resize image to match model input size
        img_array = np.array(img) / 255.0  # Normalize image array
        print(img_array)

        # Ensure image array has the correct shape
        if img_array.ndim == 2:  # grayscale image
            img_array = np.expand_dims(img_array, axis=-1)
            img_array = np.repeat(img_array, 3, axis=-1)  # Convert grayscale to RGB
        elif img_array.shape[-1] != 3:  # If not RGB, convert to RGB
            img_array = img_array[..., :3]
            
        predictions = model.predict(np.expand_dims(img_array, axis=0))[0]

        predicted_class_index = np.argmax(predictions)
        predicted_class = class_labels[predicted_class_index]
        confidence = predictions[predicted_class_index]

        response = {
            'predicted_class': predicted_class,
            'confidence': float(confidence)
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)
