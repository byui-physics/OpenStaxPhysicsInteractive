from docx import Document

def convert_docx_to_html(input_file, output_file):
    doc = Document(input_file)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("<html><body>\n")
        for para in doc.paragraphs:
            f.write(f"<p>{para.text}</p>\n")
        f.write("</body></html>")

convert_docx_to_html("input.docx", "output.html")
