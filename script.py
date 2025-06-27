import os
import uuid

# Define consonants and vowels
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

# Prepare folder structure
base_path = "abugida.ufo"
glyphs_path = f"{base_path}/glyphs"
os.makedirs(glyphs_path, exist_ok=True)

# Base glyph template (simple square placeholder)
base_glyph_template = """<?xml version="1.0" encoding="UTF-8"?>
<glyph name="{glyph_name}" format="2">
  <advance width="600"/>
  <outline>
	<contour>
	  <point x="100" y="100" type="move"/>
	  <point x="500" y="100" type="line"/>
	  <point x="500" y="500" type="line"/>
	  <point x="100" y="500" type="line"/>
	</contour>
  </outline>
  <lib>
	<dict>
	  <key>public.uniqueID</key>
	  <string>{unique_id}</string>
	</dict>
  </lib>
</glyph>
"""

# Ligature glyph template using components
ligature_glyph_template = """<?xml version="1.0" encoding="UTF-8"?>
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

# Write base glyphs for consonants and vowels (ignore empty vowel)
for glyph in consonants + [v for v in vowels if v]:
	uid = str(uuid.uuid4())
	with open(f"{glyphs_path}/{glyph}.glif", "w", encoding="utf-8") as f:
		f.write(base_glyph_template.format(glyph_name=glyph, unique_id=uid))

# Write ligature glyphs
for c in consonants:
	for v in vowels:
		lig_name = f"{c}{v}" if v else c
		vowel_component = f'<component base="{v}" x="500" y="0"/>' if v else ""
		uid = str(uuid.uuid4())
		content = ligature_glyph_template.format(
			glyph_name=f"{lig_name}.liga",
			consonant=c,
			vowel_component=vowel_component,
			unique_id=uid
		)
		with open(f"{glyphs_path}/{lig_name}.liga.glif", "w", encoding="utf-8") as f:
			f.write(content)

# Write minimal plist files required by UFO spec (fontinfo.plist, kerning.plist, groups.plist, lib.plist)
fontinfo_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>familyName</key>
  <string>AbugidaTestFont</string>
  <key>unitsPerEm</key>
  <integer>1000</integer>
  <key>ascent</key>
  <integer>800</integer>
  <key>descent</key>
  <integer>200</integer>
  <key>versionMajor</key>
  <integer>1</integer>
  <key>versionMinor</key>
  <integer>0</integer>
</dict>
</plist>
"""

kerning_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict/>
</plist>
"""

groups_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict/>
</plist>
"""

lib_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict/>
</plist>
"""

meta_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict/>
</plist>
"""

with open(f"{base_path}/fontinfo.plist", "w", encoding="utf-8") as f:
	f.write(fontinfo_content)

with open(f"{base_path}/kerning.plist", "w", encoding="utf-8") as f:
	f.write(kerning_content)

with open(f"{base_path}/groups.plist", "w", encoding="utf-8") as f:
	f.write(groups_content)

with open(f"{base_path}/lib.plist", "w", encoding="utf-8") as f:
	f.write(lib_content)

with open(f"{base_path}/metainfo.plist", "w", encoding="utf-8") as f:
	f.write(meta_content)

# Write features.fea with liga feature
features_path = f"{base_path}/features.fea"
with open(features_path, "w", encoding="utf-8") as f:
	f.write("feature liga {\n")
	for c in consonants:
		for v in vowels:
			lig_name = f"{c}{v}" if v else c
			if v:
				f.write(f"    sub {c} {v} by {lig_name}.liga;\n")
			else:
				f.write(f"    sub {c} by {lig_name}.liga;\n")
	f.write("} liga;\n")

base_path
