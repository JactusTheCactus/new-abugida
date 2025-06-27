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
with open("abugida.ufo/features.fea", "w", encoding="utf-8") as f:
	f.write("feature liga {\n")
	for c in consonants:
		for v in vowels:
			lig_name = f"{c}{v}" if v else c
			ligature = f"{lig_name}.liga"
			sub = f"    sub {c} {v} by {ligature};\n" if v else f"    sub {c} by {ligature};\n"
			f.write(sub)
	f.write("} liga;\n")