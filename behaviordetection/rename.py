import os

def rename_mp4_files(directory, prefix):
    # List all files in the directory
    files = os.listdir(directory)
    
    # Filter only .mp4 files
    mp4_files = [file for file in files if file.endswith('.mp4')]
    
    # Sort the files alphabetically
    mp4_files.sort()
    
    # Rename the files in order
    for i, file in enumerate(mp4_files, start=1):
        old_path = os.path.join(directory, file)
        new_name = f"{prefix}_{i:03d}.mp4"  # Add prefix before the numbers
        new_path = os.path.join(directory, new_name)
        os.rename(old_path, new_path)
        print(f"Renamed {file} to {new_name}")

# Replace 'directory_path' with the path to the directory containing your .mp4 files
directory_path = 'F:/KA Projects/zootopia/behaviordetection/Elephant/Elephant/Normal Behavior of Elephant'
prefix = "elephant_normal"  # Specify the prefix you want to add
rename_mp4_files(directory_path, prefix)
