import requests

# URL of the Flask app
url = 'http://127.0.0.1:5008/predict'  # Update with the correct URL if running on a different server or port

# Video file to test
video_file = 'F:/KA Projects/zootopia/behaviordetection/Images/test/monkey_normal_014.mp4'  # Update with the path to your test video file

# Create a POST request with the video file
files = {'video': open(video_file, 'rb')}
response = requests.post(url, files=files)

# Check if the request was successful
if response.status_code == 200:
    print('Prediction results:')
    print(response.json())
else:
    print('Error:', response.status_code)
