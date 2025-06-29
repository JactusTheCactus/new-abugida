"""
V: 800 - 1000
C: 0 - 600
"""
from defcon import Font
import subprocess
import json
def toTuple(obj):
    if isinstance(obj, list):
        if len(obj) == 2 and all(isinstance(i, int) for i in obj):
            return tuple(obj)
        else:
            return [toTuple(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: toTuple(v) for k, v in obj.items()}
    else:
        return obj
with open("data.json", "r") as f:
    data = json.load(f)
glyphList = toTuple(data)
font = Font()
consonants = [
	"b","c","d","ð","f",
	"g","h","j","k","l",
	"m","n","p","r","s",
	"ś","t","v","w","x",
	"y","z","ź","þ"
]
vowels = [
	"","a","á","e","i",
	"í","o","ó","u","ú"
]
for g in glyphList:
	glyph = font.newGlyph(g)
	if g != ".notdef":
		glyph.unicode = ord(g)
	glyph.width = 700
	pen = glyph.getPen()
	for contour in glyphList[g]:
		for i, pt in enumerate(contour):
			if i == 0:
				pen.moveTo(pt)
			else:
				pen.lineTo(pt)
		pen.closePath()
font.info.familyName = "Font"
font.info.styleName = "Regular"
font.info.fullName = f"{font.info.familyName} {font.info.styleName}"
font.info.postscriptFontName = f"{font.info.familyName}-{font.info.styleName}"
font.info.openTypeNameVersion = "Version 1.0"
font.info.unitsPerEm = 1000
font.info.ascender = 800
font.info.descender = -200
font.info.capHeight = 1000
font.info.xHeight = 500
font.info.baseline = 0
ufoName = f"{font.info.postscriptFontName}.ufo"
font.save(ufoName)
bash = f"fontmake -u {ufoName} -o otf".split()
subprocess.run(bash, check=True)
features_path = f"{ufoName}/features.fea"
with open(features_path, "w", encoding="utf-8") as f:
	f.write("feature liga {\n")
	for c in consonants:
		for v in vowels:
			if v:
				lig_name = f"{c}_{v}"
				f.write(f"    sub {c} {v} by {lig_name}.liga;\n")
			else:
				if c != "x":
					lig_name = c
					f.write(f"    sub {c} by {lig_name}.liga;\n")
	f.write("} liga;\n")