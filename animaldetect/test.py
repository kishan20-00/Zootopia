import requests

# Define URL of the Flask API
url = 'http://127.0.0.1:5000/predict'  # Replace with the actual URL where your Flask API is hosted

# Define path to the image file
image_path = 'G:/GitHub/Zootopia/animaldetect/species/elephas_maximus_sumatranus/101991676_a.jpg'  # Replace with the path to your image file

# Send POST request with the image file to the Flask API endpoint
with open(image_path, 'rb') as file:
    files = {'image': file}
    response = requests.post(url, files=files)

# Check if the request was successful
if response.status_code == 200:
    # Print the prediction result
    prediction = response.json()
    print("Predicted animal:", prediction['predicted_class'])
else:
    print("Error:", response.text)
