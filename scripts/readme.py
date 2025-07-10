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
list = sorted(list, key = lambda x: (x[1], x[2]))
for i in list:
	root, name, page = i
	path = os.path.join(root, name, page)
	for [r ,p] in [[r"-", " "]]:
		name = re.sub(r, p, name)
	with open(readmePath, "a", encoding = "utf-8") as f:
		current = f"\n## `{name.upper()}`"
		if last != current:
			readme += current
			last = current
		readme += f"\n![{name} {page}]({path})"
with open(readmePath, "w", encoding = "utf-8") as f:
	f.write(readme)