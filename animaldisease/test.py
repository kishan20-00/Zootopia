import requests

# Define the URL of the Flask app
url = 'http://127.0.0.1:5007/predict'  # Change the IP and port if necessary

# Define the input data for prediction
input_data = {
    'AnimalName': 'Elephant',
    'AnimalGroup': 'Ectotherms',
    'DielActivity': 'Nocturnal',
    'MeanBodyTemperature': 41.5
}

# Send a POST request to the Flask app
response = requests.post(url, json=input_data)

# Check the response
if response.status_code == 200:
    # Print the predictions
    predictions = response.json()
    print("Predictions:", predictions)
else:
    print("Error:", response.status_code, response.text)
