import os
list = []
def listDirectories(basePath):
    for root, dirs, files in os.walk(basePath):
        relativePath = os.path.relpath(root, basePath)
        if relativePath == ".":
            relativePath = basePath
        if files:
            for f in files:
                list.append(os.path.join(basePath, relativePath, f))
listDirectories(os.path.join("site", "png"))
print(list)