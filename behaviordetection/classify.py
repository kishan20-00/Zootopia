import os
import csv

def extract_classification_from_filename(filename):
    # Extract classification from the filename until the last "_" symbol
    return '_'.join(filename.split('_')[:-1])

def create_csv_with_file_classification_mapping(source_dirs, csv_file):
    # Create CSV file and write header
    with open(csv_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Filename', 'Classification'])
        
        # Iterate through source directories and extract classification from file names
        for source_dir in source_dirs:
            # Collect all files from the source directory
            files = [f for f in os.listdir(source_dir) if f.endswith('.mp4') and os.path.isfile(os.path.join(source_dir, f))]
            
            # Extract classification from file names and write to CSV
            for file_name in files:
                # Extract classification from filename
                classification = extract_classification_from_filename(file_name)
                
                # Write to CSV
                writer.writerow([file_name, classification])

# Replace these paths with your source directories and CSV file path
source_dirs = ['F:/KA Projects/zootopia/behaviordetection/Images/test']
csv_file = 'test.csv'  # CSV file path

create_csv_with_file_classification_mapping(source_dirs, csv_file)
