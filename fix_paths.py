import os

def replace_in_html_files(root_dir):
    for foldername, subfolders, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.html'):
                filepath = os.path.join(foldername, filename)
                with open(filepath, 'r', encoding='utf-8') as file:
                    content = file.read()
                new_content = content.replace('../../', '../')
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Modified: {filepath}")

if __name__ == '__main__':
    current_directory = os.path.dirname(os.path.abspath(__file__))
    replace_in_html_files(current_directory)
