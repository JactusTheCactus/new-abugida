# Thoughts?
## Syntax
- **Key-Value Pair**: `1 : 2`
- **OR**: `1 | 2`
- **AND**: `1 & 2`
- **IF-THEN**: `1 ? 2`
- **IF-THEN-ELSE**: `1 ? 2 > 3`
- **Optional**: `*`
- **Grouping**: `( )`
- **Inline Comments**: `//	Inline`
- **Block Comments**: `/* Multiline */`
## Data
```
Type : (
	Abugida |
	Alphabet
)
Glyph Variants : (
	Solo &
	Initial* &
	Medial &
	Final*
)
Direction : (
	Down |
	Right &
	(
		Boustrophedon |
		Uniform
	)
)
```
