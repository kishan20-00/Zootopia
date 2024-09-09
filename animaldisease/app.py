from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from joblib import load
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model
model = tf.keras.models.load_model('model.h5')

# Load label encoders
label_encoder_X_classes = {}
for col in ['AnimalName', 'Symptoms1', 'Symptoms2', 'Symptoms3', 'Symptoms4', 'Symptoms5', 'AnimalGroup', 'DielActivity']:
    label_encoder_X_classes[col] = load(f'label_encoder_{col}_classes.joblib')
label_encoder_Y_classes = load('label_encoder_Y_classes.joblib')

# Preprocess the input data
def preprocess_input(input_data):
    encoded_input = []
    for col, value in input_data.items():
        if col == 'MeanBodyTemperature':
            # Convert MeanBodyTemperature to float if it's a string
            if isinstance(value, str):
                try:
                    value = float(value)  # Convert string to float
                except ValueError:
                    print(f"Could not convert {value} to float for MeanBodyTemperature")
                    value = np.nan  # Handle invalid values as NaN
            encoded_input.append(value)
        elif col in label_encoder_X_classes:
            # Use LabelEncoder for categorical columns
            label_encoder = label_encoder_X_classes[col]
            try:
                encoded_value = label_encoder.transform([value])[0]
                encoded_input.append(encoded_value)
            except KeyError:
                print(f"Unseen label '{value}' for feature '{col}'")
                encoded_input.append(-1)
        else:
            encoded_input.append(value)
    print("Encoded input:", encoded_input)
    return np.array(encoded_input).reshape(1, -1)

# Define a route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    # Get data from the request
    input_data = request.json
    print(input_data)
    
    # Preprocess the input data
    preprocessed_input = preprocess_input(input_data)
    
    # Make predictions using the trained model
    predictions = model.predict(preprocessed_input)
    
    # Get the predicted class
    predicted_class_index = np.argmax(predictions)
    predicted_class = label_encoder_Y_classes.classes_[predicted_class_index]
    
    # Return the predicted class
    return jsonify({'Is it dangerous': predicted_class})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007)
