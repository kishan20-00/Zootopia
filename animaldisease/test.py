import requests

# Define the URL of the Flask app
url = 'http://127.0.0.1:5000/predict'

# Example input data
input_data = {
    'Animal': 'buffalo',
    'Age': 5,
    'Temperature': 102,
    'Symptom 1': 'difficulty walking',
    'Symptom 2': 'chest discomfort',
    'Symptom 3': 'chills'
}

# Send a POST request with JSON data to the Flask app
response = requests.post(url, json=input_data)

# Check if the request was successful
if response.status_code == 200:
    # Get the predicted class from the response
    predicted_class = response.json()['predicted_disease']
    print('Predicted Disease:', predicted_class)
else:
    print('Error:', response.status_code)

