import zipfile
import os

epub_file = "misc_stuff/openstax-osbooks-university-physics-bundle-aa8a43ef55af6aa08d279863e32cf0f6177298ca-15104-university-physics-volume-1.epub"   # Your ePub file
extract_folder = "misc_stuff/extracted_book"  # Where files will be extracted

# Unzip the ePub file
with zipfile.ZipFile(epub_file, 'r') as epub:
    epub.extractall(extract_folder)

line_to_insert = '<a href="university-physics-volume-1.toc.html">Back to table of contents</a>'

# Find HTML files
html_files = []
for root, _, files in os.walk(extract_folder):
    for file in files:
        if file.endswith(".xhtml"):
            # don't go through html files because otherwise they get double counted when they change to html
            html_files.append(os.path.join(root, file))


            ### ADD THE LINK BACK TO TOC
            file_path = os.path.join(root, file)

            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            with open(file_path, 'w', encoding='utf-8') as f:
                body_end_index = content.rfind('</body>')
                if body_end_index != -1:
                    content = content[:body_end_index] + "\n" + line_to_insert + "\n" + content[body_end_index:]
                    f.write(content)

        ## CHANGE FILES FROM XHTML TO HTML

        if file.endswith('.xhtml'):
            # Define the old and new file paths
            old_file_path = os.path.join(root, file)
            new_file_name = file[:-6] + '.html'  # Remove .xhtml and add .html
            new_file_path = os.path.join(root, new_file_name)
        
            # Rename the file
            os.rename(old_file_path, new_file_path)

### CHANGE ALL TOC LINKS FROM XHTML TO HTML

# Define the path of the file
file_path = 'misc_stuff/extracted_book/university-physics-volume-1.toc.html'

# Step 1: Open the file in read mode and read its content
with open(file_path, 'r', encoding='utf-8') as file:
    content = file.read()

# Step 2: Replace every instance of .xhtml with .html
modified_content = content.replace('.xhtml', '.html')

# Step 3: Open the file in write mode and write the modified content back
with open(file_path, 'w', encoding='utf-8') as file:
    file.write(modified_content)


