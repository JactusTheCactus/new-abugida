from defcon import Font#type:ignore
import subprocess
import json
from fontTools.pens.transformPen import TransformPen#type:ignore
import os
import sys
import fontmake#type:ignore
from pathlib import Path
args = sys.argv[1:]
script = args[0] if args else ""
print(script)
dir = os.path.join(".","fonts",script) if script else "."
vEnv = os.path.join(".","fonts",script,"ENV") if script else os.path.join(".","ENV")
def jsonFile(file):
	filePath = Path(".","fonts" if script else "","data",file + ".json")
	if not os.path.exists(filePath):
		filePath.parent.mkdir(parents = True, exist_ok = True)
		filePath.write_text("{}")
	return os.path.join(filePath)
with open(jsonFile("uni"),"r",encoding="utf-8") as f:
	uni = json.load(f)
def ligName(ligs:list):
	return "_".join(ligs)
def getUni(char):
	"""
Gets the unicode variant of `char`, following the format of;
- `aacute` = &aacute;
- `eth` = &eth;
	"""
	if char in uni:
		out = uni.get(char)
	else:
		out = char
	return out
def setWidth(g,l=80,r=90):
	"""
Sets the width of a font glyph.
	"""
	bounds = g.bounds
	if bounds:
		xMin, yMin, xMax, yMax = bounds
		g.leftMargin = l
		g.rightMargin = r
		g.width = l + (xMax - xMin) + r
	else:
		g.leftMargin = l
		g.rightMargin = r
		g.width = l + r
def toTuple(obj):
	"""
	Takes an object and converts all child lists which only contain a pair of numbers into tuples.
	e.g.;
	```
	[[20,80],[1,5]] ==> [(20,80),(1,5)]
	```
	"""
	if isinstance(obj, list):
		return tuple(obj) if len(obj) == 2 and all(isinstance(i, int) for i in obj) else [toTuple(item) for item in obj]
	elif isinstance(obj, dict):
		return {k: toTuple(v) for k, v in obj.items()}
	else:
		return obj
def cmdRun(args):
	"""
Runs commands exactly as written in the console.

outputs;
```
cmdRun(args)["out"]
cmdRun(args)["err"]
```
the output and errors of the console command
	"""
	arg = args.split()
	log = subprocess.run(arg,capture_output=True,universal_newlines=True)
	output = {
		"out": log.stdout,
		"err": log.stderr
	}
	return output
with open(jsonFile("data"), "r", encoding="utf-8") as f:
	glyphList = toTuple(json.load(f))
with open(jsonFile("lig"), "r", encoding="utf-8") as f:
	symbolLigs = json.load(f)
font = Font()
with open(jsonFile("char"), "r",encoding="utf-8") as f:
	char = json.load(f)
con = char.get("consonants") or {}
vow = char.get("vowels") or {}
sym = char.get("grammar") or {}
for g in glyphList:
	glyphList[g].append([
		[0,0],
		[0,700]
	])
	glyph = font.newGlyph(g)
	if g not in [".notdef","ellipsis"]:
		glyph.unicode = ord(getUni(g))
		glyph.name = g
	pen = glyph.getPen()
	for contour in glyphList[g]:
		for i, pt in enumerate(contour):
			pen.moveTo(pt) if i == 0 else pen.lineTo(pt)
		pen.closePath()
	setWidth(glyph)
with open(jsonFile("options"), "r", encoding="utf-8") as f:
	options = json.load(f)
font.info.familyName = options.get("family") or "Unnamed"
font.info.styleMapFamilyName = f"{font.info.familyName}"
font.info.styleName = "Regular"
font.info.styleMapStyleName = f"{font.info.styleName.lower()}"
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
def save():
	"""
Saves the font at the location defined in `ufoName`
	"""
	font.save(ufoName)
ligList = []
fea = f"{ufoName}/features.fea"
with open(fea, "w", encoding="utf-8") as f:
	f.write("feature liga {\n")
	for c in con:
		for v in vow:
			lig_name = ligName([c,v])
			f.write(f"    sub {c} {v} by {lig_name}.liga;\n")
			lig_name = lig_name + ".liga"
			if lig_name not in font:
				lig = font.newGlyph(lig_name)
				lig.clear()
				c_glyph = font[c]
				pen = lig.getPen()
				c_glyph.draw(pen)
				v_glyph = font[v]
				pen = lig.getPen()
				tpen = TransformPen(pen, (1, 0, 0, 1, 0, 0))
				v_glyph.draw(tpen)
				lig.unicode = None
				setWidth(lig)
	for i in symbolLigs:
		f.write(f"    sub {i} by {symbolLigs[i]};\n")
	f.write("} liga;\n")
with open(fea) as f:
    feaText = f.read()
font.features.text = feaText
for v in vow:
    x_v_name = ligName(["x", v]) + ".liga"
    if x_v_name in font and v in font:
        v_glyph = font[v]
        x_v_glyph = font[x_v_name]
        v_glyph.clear()
        pen = v_glyph.getPen()
        x_v_glyph.draw(pen)
        setWidth(v_glyph)
font = Font(ufoName)
save()
for i in sorted(["otf","ttf"]):
	cmdRun(f"{vEnv}/bin/fontmake -u {ufoName} -o {i}")