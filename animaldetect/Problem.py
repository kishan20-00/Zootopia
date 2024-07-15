from PIL import Image
import os

def identify_problematic_images(directory):
    """
    Identify image files with problematic names in the specified directory.

    Args:
    - directory (str): The directory path containing the images.

    Returns:
    - problematic_images (list): A list of filenames of images with problematic names.
    """
    problematic_images = []

    # Iterate over all files in the directory
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        # Check if the file is a valid image file
        try:
            with Image.open(filepath) as img:
                # If the image can be opened without errors, continue to the next file
                pass
        except Exception as e:
            # If an exception occurs (e.g., IOError, UnidentifiedImageError), add the filename to the list of problematic images
            problematic_images.append(filename)

    return problematic_images

# Example usage:
directory = 'F:/KA Projects/zootopia/animaldetect/archive/animals/animals/giraffe'
problematic_images = identify_problematic_images(directory)
print("Problematic Images:", problematic_images)
