from defcon import Font
import subprocess
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
glyphList = {
	".notdef": [
		[
			(50,0),
			(450,0),
			(450,700),
			(50,700)
		]
	],
	"a": [
		[
			(100, 0),
			(300, 700),
			(500, 0)
		]
	]
}
for g in glyphList:
	glyph = font.newGlyph(g)
	if g != ".notdef":
		glyph.unicode = ord(g)
	glyph.width = 600
	pen = glyph.getPen()
	for contour in glyphList[g]:
		for i, pt in enumerate(contour):
			if i == 0:
				pen.moveTo(pt)
			else:
				pen.lineTo(pt)
		pen.closePath()
"""
for g in glyphList:
	glyph = font.newGlyph(g[0])
	if g != glyphList[0]:
		glyph.unicode = ord(g[0])
	glyph.width = 600
	pen = glyph.getPen()
	for contour in g[1]:
		for i, pt in enumerate(contour):
			if i == 0:
				pen.moveTo(pt)
			else:
				pen.lineTo(pt)
		pen.closePath()
"""

# REQUIRED FONT INFO FIELDS
font.info.familyName = "Abugida"
font.info.styleName = "Regular"
font.info.fullName = "Abugida Regular"
font.info.postscriptFontName = "Abugida-Regular"
font.info.openTypeNameVersion = "Version 1.000"
font.info.unitsPerEm = 1000
font.info.ascender = 800
font.info.descender = -200
font.info.capHeight = 700
font.info.xHeight = 500
font.info.baseline = 0

ufoName = f"{font.info.familyName}-{font.info.styleName}.ufo"
font.save(ufoName)
bash = f"fontmake -u {ufoName} -o otf".split()
subprocess.run(bash, check=True)
features_path = f"{ufoName}/features.fea"
with open(features_path, "w", encoding="utf-8") as f:
	f.write("feature liga {\n")
	for c in consonants:
		for v in vowels:
			if v:
				lig_name = c + v
				f.write(f"    sub {c} {v} by {lig_name}.liga;\n")
			else:
				if c != "x":
					lig_name = c
					f.write(f"    sub {c} by {lig_name}.liga;\n")
	f.write("} liga;\n")