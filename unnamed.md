# Thoughts?
## Syntax
- `A: B`
	- Key-Data Pair
- `C | D`
	- `C` Or `D`
- `E & F`
	- `E` And `F`
- `H ? I > J`
	- If `H` Then `I`, Else `J`
- `K => ( L > M )`
	- Shorthand For `K & ( K ? L > M )`
		- `1 | 2 => ( 3 > 4 )` = `1 | 2 & ( 2 ? 3 > 4 )`
	- Only Allowed When `K` Is An Option Of `|`
		- Otherwise Equal To `K & L`
- `N*`
	- `N` Is Optional
- `( O )`
	- Grouping
- Extra Whitespace Is Fine
	- Multiple Lines With Equivalent Indentation Are Synonymous With A One-Line
- Comments
	- `//Inline`
	- ```
		/*
		Multiline
		*/
		```
## Data
	Type:
		Abugida
		| Alphabet
	Glyph Variants:
		Solo
		& Initial*
		& Medial
		& Final*
	Direction:
		Down |
		Right => (
			Boustrophedon
			> Uniform
		)
## Options
- Type
	- Abugida
	- Alphabet
- Glyph Variants
	- Solo, Medial
	- Solo, Initial, Medial
	- Solo, Medial, Final
	- Solo, Initial, Medial, Final
- Direction
	- Down
	- Right, Boustrophedon
	- Right, Uniform