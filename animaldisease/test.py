import requests

# Define the URL of the Flask app
url = 'http://127.0.0.1:5007/predict'

# Example input data
input_data = {
    'AnimalName': 'Elephant',
    'Symptoms1': 'Indigestion',
    'Symptoms2': 'Infection',
    'Symptoms3': 'Drooling',
    'Symptoms4': 'Appetite',
    'Symptoms5': 'Muscle stiffness',
    'AnimalGroup': 'Ectotherms',
    'DielActivity': 'Nocturnal',
    'MeanBodyTemperature': '41'
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

