import requests

# Define the URL of the Flask app
url = 'http://127.0.0.1:5000/predict'

# Example input data
input_data = {
    'AnimalName': 'Buffaloes',
    'symptoms1': 'Indigestion',
    'symptoms2': 'Infection',
    'symptoms3': 'Drooling',
    'symptoms4': 'Appetite',
    'symptoms5': 'Muscle stiffness'
}

# Send a POST request with JSON data to the Flask app
response = requests.post(url, json=input_data)

# Check if the request was successful
if response.status_code == 200:
    # Get the predicted class from the response
    predicted_class = response.json()['Is it dangerous']
    print('Predicted Disease:', predicted_class)
else:
    print('Error:', response.status_code)

