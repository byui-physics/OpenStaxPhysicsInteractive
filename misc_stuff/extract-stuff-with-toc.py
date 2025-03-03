import zipfile
import os
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

# Define file paths
epub_file = "misc_stuff/openstax-osbooks-university-physics-bundle-aa8a43ef55af6aa08d279863e32cf0f6177298ca-15104-university-physics-volume-1.epub"  # Change this to your actual ePub file
extract_folder = "misc_stuff/extracted_book_toc"

# Step 1: Extract the ePub file
with zipfile.ZipFile(epub_file, 'r') as epub:
    epub.extractall(extract_folder)

# Step 2: Locate TOC file (toc.ncx or nav.xhtml)
toc_file = None
for root, _, files in os.walk(extract_folder):
    if "toc.ncx" in files:
        toc_file = os.path.join(root, "toc.ncx")
        break
    elif "nav.xhtml" in files:
        toc_file = os.path.join(root, "nav.xhtml")
        break

# Step 3: Extract all HTML files
html_files = []
for root, _, files in os.walk(extract_folder):
    for file in files:
        if file.endswith(".html") or file.endswith(".xhtml"):
            html_files.append(os.path.relpath(os.path.join(root, file), extract_folder))

# Step 4: Parse TOC and extract chapter links
toc_entries = []

if toc_file and toc_file.endswith("toc.ncx"):
    tree = ET.parse(toc_file)
    root = tree.getroot()
    ns = {'ncx': 'http://www.daisy.org/z3986/2005/ncx/'}

    for nav_point in root.findall(".//ncx:navPoint", ns):
        title = nav_point.find("ncx:navLabel/ncx:text", ns).text
        src = nav_point.find("ncx:content", ns).get("src")
        toc_entries.append((title, src))

elif toc_file and toc_file.endswith("nav.xhtml"):
    with open(toc_file, "r", encoding="utf-8") as file:
        content = file.read()

    soup = BeautifulSoup(content, "html.parser")
    for li in soup.select("nav[epub|type='toc'] li a"):
        title = li.text.strip()
        src = li.get("href")
        toc_entries.append((title, src))

# If no TOC was found, generate one from all HTML files
if not toc_entries:
    toc_entries = [(f"Chapter {i+1}", file) for i, file in enumerate(sorted(html_files))]

# Step 5: Generate `toc.html`
toc_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table of Contents</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Table of Contents</h1>
    <ul>
"""
for title, src in toc_entries:
    toc_html += f'        <li><a href="{src}">{title}</a></li>\n'

toc_html += """    </ul>
</body>
</html>
"""

# Step 6: Save `toc.html`
toc_path = os.path.join(extract_folder, "toc.html")
with open(toc_path, "w", encoding="utf-8") as f:
    f.write(toc_html)

print(f"✅ Extraction complete! HTML files and TOC are in: {extract_folder}")
