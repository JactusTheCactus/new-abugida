import os
import re
list = []
readme = "# Unnamed Abugida"
def listDirectories(basePath):
	for root, dirs, files in os.walk(basePath):
		relativePath = os.path.relpath(root, basePath)
		if relativePath == ".":
			relativePath = basePath
		if files:
			for f in files:
				list.append([basePath, relativePath, f])
listDirectories(os.path.join("site", "png"))
readmePath = os.path.join("README.md")
last = ""
for i in list:
	for [r ,p] in [
		[r"-", " "]
	]:
		i = re.sub(r, p, i)
	with open(readmePath, "a", encoding = "utf-8") as f:
		current = f"\n## `{i[1].upper()}`"
		if last != current:
			readme += current
			last = current
		readme += f"\n![{i[1]} {i[2]}]({os.path.join(i[0], i[1], i[2])})"
with open(readmePath, "w", encoding = "utf-8") as f:
	f.write(readme)
