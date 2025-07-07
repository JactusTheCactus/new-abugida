import os
list = []
def listDirectories(basePath):
    for root, dirs, files in os.walk(basePath):
        relativePath = os.path.relpath(root, basePath)
        if relativePath == ".":
            relativePath = basePath
        if files:
            for f in files:
                list.append([basePath, relativePath, f])
listDirectories(os.path.join("site", "png"))
print(list)
readmePath = os.path.join("README.md")
with open(readmePath, "w", encoding = "utf-8") as f:
    f.write("")
for i in list:
    last = ""
    with open(readmePath, "a", encoding = "utf-8") as f:
        current = f"\n# {i[1]}"
        if last != current:
            f.write(current)
            last = current