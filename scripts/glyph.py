import os
import uuid
consonants = [
	"b","c","d","ð","f",
	"g","h","j","k","l",
	"m","n","p","r","s",
	"ś","t","þ","v","w",
	"x","y","z","ź"
]
vowels = [
	"","a","á","e","i",
	"í","o","ó","u","ú"
]
os.makedirs("abugida.ufo/glyphs", exist_ok=True)
lig_template = """<?xml version="1.0" encoding="UTF-8"?>
<glyph name="{glyph_name}" format="2">
	<advance width="900"/>
	<outline>
		<component base="{consonant}" x="0" y="0"/>
		{vowel_component}
	</outline>
	<lib>
		<dict>
			<key>public.uniqueID</key>
			<string>{unique_id}</string>
		</dict>
	</lib>
</glyph>
"""
for c in consonants:
	for v in vowels:
		lig_name = f"{c}{v}" if v else c
		vowel_component = f'<component base="{v}" x="500" y="0"/>' if v else ""
		uid = str(uuid.uuid4())
		glif_content = lig_template.format(
			glyph_name=lig_name + ".liga",
			consonant=c,
			vowel_component=vowel_component,
			unique_id=uid
		)
		path = f"abugida.ufo/glyphs/{lig_name}.liga.glif"
		with open(path, "w", encoding="utf-8") as f:
			f.write(glif_content)