# Thoughts?
## Syntax
- `1: 2`
	- Key-Data Pair
- `1 | 2`
	- `1` Or `2`
- `1 & 2`
	- `1` And `2`
- `1 ? 2 > 3`
	- If `1` Then `2`, Else `3`
- `1 => ( 2 > 3 )`
	- Shorthand For `1 & ( 1 ? 2 > 3 )`
		- `1 | 2 => ( 3 > 4 )` = `1 | 2 & ( 2 ? 3 > 4 )`
	- Only Allowed When `1` Is An Option Of `|`
		- Otherwise Equal To `1 & 2`
- `1*`
	- `1` Is Optional
- `( 1 )`
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
