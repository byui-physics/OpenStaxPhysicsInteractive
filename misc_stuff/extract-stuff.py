import zipfile
import os

epub_file = "misc_stuff/openstax-osbooks-university-physics-bundle-aa8a43ef55af6aa08d279863e32cf0f6177298ca-15104-university-physics-volume-1.epub"   # Your ePub file
extract_folder = "misc_stuff/extracted_book"  # Where files will be extracted

# Unzip the ePub file
with zipfile.ZipFile(epub_file, 'r') as epub:
    epub.extractall(extract_folder)

# Find HTML files
html_files = []
for root, _, files in os.walk(extract_folder):
    for file in files:
        if file.endswith(".html") or file.endswith(".xhtml"):
            html_files.append(os.path.join(root, file))

print("Extracted HTML files:", html_files)
