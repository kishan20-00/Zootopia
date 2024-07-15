import os
import random
import shutil

def move_random_files(source_dirs, destination_dir, num_files_to_move):
    # Create the destination directory if it doesn't exist
    os.makedirs(destination_dir, exist_ok=True)
    
    # Iterate through source directories and move files
    for source_dir, num_files in zip(source_dirs, num_files_to_move):
        # Collect all files from the source directory
        files = [f for f in os.listdir(source_dir) if os.path.isfile(os.path.join(source_dir, f))]
        
        # Check if there are enough files to move
        if len(files) < num_files:
            print(f"Not enough files in {source_dir} to move.")
            continue
        
        # Randomly select files to move
        files_to_move = random.sample(files, num_files)
        
        # Move the selected files to the destination directory
        for file_name in files_to_move:
            source_path = os.path.join(source_dir, file_name)
            destination_path = os.path.join(destination_dir, file_name)
            shutil.move(source_path, destination_path)
            print(f"Moved {file_name} from {source_dir} to {destination_dir}")

# Replace these paths with your source directories and destination directory
source_dirs = ['F:/KA Projects/zootopia/behaviordetection/Elephant/Elephant/Normal Behavior of Elephant', 'F:/KA Projects/zootopia/behaviordetection/Elephant/Elephant/Abnormal Behavior of Elephant']
destination_dir = 'F:/KA Projects/zootopia/behaviordetection/Images/test'
num_files_to_move = [3, 3]  # Number of files to move from each source directory

move_random_files(source_dirs, destination_dir, num_files_to_move)
