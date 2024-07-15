import os
import imghdr

def print_image_info(directory):
    """
    Print the filenames and extensions/types of all images in the specified directory.

    Args:
    - directory (str): The directory path containing the images.
    """
    # Iterate over all files in the directory
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        # Check if the file is a valid image file
        if os.path.isfile(filepath) and imghdr.what(filepath) is not None:
            # Get the file extension
            extension = filename.split('.')[-1].lower()
            # Print filename and extension
            print(f"{filename}: {extension}")

# Example usage:
directory = 'F:/KA Projects/zootopia/animaldetect/archive/animals/animals/zebra'
print("Image Info:")
print_image_info(directory)
