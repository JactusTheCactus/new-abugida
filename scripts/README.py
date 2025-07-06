import os

def list_directories_and_contents(base_path):
    for root, dirs, files in os.walk(base_path):
        relative_path = os.path.relpath(root, base_path)
        if relative_path == ".":
            relative_path = base_path
        if files:
            for f in files:
                print(os.path.join(relative_path, f))
path = os.path.join("site","png")
if os.path.isdir(path):
        list_directories_and_contents(path)
else:
        print("⚠️ Invalid directory path. Please try again.")