Thoughts?
# Syntax
- **Key-Value Pair**: `1 : 2`
- **OR**: `1 | 2`
- **AND**: `1 & 2`
- **IF-THEN**: `1 ? 2`
- **IF-THEN-ELSE**: `1 ? 2 > 3`
- **Optional**: `1*`
- **Grouping**: `( 1 )`
- **Group Type**: `[1]( 2 )`
	- **AND**: `[&]( 1 )`
	- **OR**: `[|]( 1 )`
- **Inline Comments**: `// 1`
- **Block Comments**: `/* 1 */`
# Data
```
(
	Type : [|](
		Abugida
		Alphabet
	) &
	Variants : [&](
		Solo
		Initial*
		Medial
		Final*
	) &
	Direction : [|](
		Down
		[&](
			Right
			[|](
				Boustrophedon
				Uniform
			)
		)
	)
)
```
