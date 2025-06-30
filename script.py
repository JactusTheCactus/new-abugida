from defcon import Font
import subprocess
import json
from fontTools.pens.transformPen import TransformPen
import os
with open("uni.json","r",encoding="utf-8") as f:
	uni = json.load(f)
def getUni(char):
	if char in uni:
		out = uni.get(char)
	else:
		out = char
	return out
def setWidth(g,l=80,r=90):
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
	if isinstance(obj, list):
		if len(obj) == 2 and all(isinstance(i, int) for i in obj):
			return tuple(obj)
		else:
			return [toTuple(item) for item in obj]
	elif isinstance(obj, dict):
		return {k: toTuple(v) for k, v in obj.items()}
	else:
		return obj
with open("data.json", "r", encoding="utf-8") as f:
	data = json.load(f)
glyphList = toTuple(data)
font = Font()
with open("char.json", "r",encoding="utf-8") as f:
	char = json.load(f)
consonants, vowels = char["consonants"], char["vowels"]
for g in glyphList:
	glyphList[g].append([
		[0,0],
		[0,700]
	])
	glyph = font.newGlyph(g)
	if g != ".notdef":
		glyph.unicode = ord(getUni(g))
		glyph.name = g
	pen = glyph.getPen()
	for contour in glyphList[g]:
		for i, pt in enumerate(contour):
			pen.moveTo(pt) if i == 0 else pen.lineTo(pt)
		pen.closePath()
	setWidth(glyph)
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
def save():
	font.save(ufoName)
if not os.path.exists(ufoName):
	os.mkdir(ufoName)
for c in consonants:
	if c in font:
		for v in vowels:
			if v in font:
				if v:
					lig_name = "_".join([c,v]) + ".liga"
					if lig_name in font:
						continue
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
fea = f"{ufoName}/features.fea"
with open(fea, "w", encoding="utf-8") as f:
	f.write("feature liga {\n")
	for c in consonants:
		c
		for v in vowels:
			if v:
				v
				lig_name = f"{c}_{v}"
				f.write(f"    sub {c} {v} by {lig_name}.liga;\n")
	f.write("} liga;\n")
with open(fea) as f:
    feaText = f.read()
#print(feaText)
font.features.text = feaText  # Make sure it's set
save()
font = Font(ufoName)
if 1:
	line = "=" * 50
	print("\n".join([
		"",
		line,
		"",
		subprocess.run(
			[
				"fontmake",
				"-u",
				ufoName,
				"-o",
				"otf"
			],
			capture_output = True,
			universal_newlines = True,
			check = True
		).stderr,
		line
	]))