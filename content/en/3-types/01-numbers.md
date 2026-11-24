---
id: nombres
title: Numbers and calculations
subtitle: Python, the best calculator in the world.
duration: 12
---
## Two kinds of numbers

Python has two types of numbers:

- **integers** (`int`): `7`, `-3`, `2026`;
- **decimal numbers** (`float`, for *floating-point number*): `3.5`, `-0.25`, `20.0`.

The `type()` function tells you what type a value is.

```py
print(type(42))
print(type(3.14))
print(type("42"))
```

Watch the last one: `"42"` between quotes is **text** (`str`), not a number.

+++

## Operations

| Symbol | Operation | Example | Result |
|---|---|---|---|
| `+` | addition | `7 + 2` | `9` |
| `-` | subtraction | `7 - 2` | `5` |
| `*` | multiplication | `7 * 2` | `14` |
| `/` | division | `7 / 2` | `3.5` |
| `//` | integer division | `7 // 2` | `3` |
| `%` | remainder (modulo) | `7 % 2` | `1` |
| `**` | power | `7 ** 2` | `49` |

```py
print(7 / 2)
print(7 // 2)
print(7 % 2)
print(2 ** 10)
```

`//` and `%` go together: 7 divided by 2 gives 3, **remainder** 1. Just like in primary school!

+++

## What's the remainder for?

The modulo `%` is far more useful than it looks:

- a number is **even** if `number % 2` is 0;
- converting minutes into hours: `135 // 60` gives 2 hours, `135 % 60` gives 15 minutes.

```py
minutes = 135
hours = minutes // 60
remaining = minutes % 60
print(minutes, "minutes =", hours, "h", remaining, "min")
```

```predict
print(17 % 5)
???
- 3
* 2
- 3.4
> 17 divided by 5: 3 times (15), remainder 2. `17 // 5` is 3 and `17 % 5` is 2.
```

+++

## Order of operations

Like in maths, multiplication comes before addition. **Parentheses** force the order you want.

```predict
print(2 + 3 * 4)
???
- 20
* 14
- 24
> `3 * 4` first (12), then `2 + 12` = 14. To get 20, you'd write `(2 + 3) * 4`.
```

```py
grade1 = 12
grade2 = 15
grade3 = 17
wrong_average = grade1 + grade2 + grade3 / 3
average = (grade1 + grade2 + grade3) / 3
print(wrong_average)
print(average)
```

The first calculation is wrong: only `grade3` was divided by 3. A classic!

+++

## Rounding

`round(number, digits)` rounds a number. Without the second argument, it rounds to a whole number.

```py
average = 14.666666666
print(round(average))
print(round(average, 1))
print(round(average, 2))
print(round(0.1 + 0.2, 2))
```

A few other handy functions: `abs()` gives the absolute value, `min()` and `max()` the smallest and the largest.

```py
print(abs(-12))
print(min(4, 9, 2))
print(max(4, 9, 2))
```

+++

## Exercise: the length of the film

```exercise
@title Hours and minutes
@prompt
A film lasts `duration = 158` minutes. Using `//` and `%`, calculate:

- `hours`: the number of full hours;
- `minutes`: the remaining minutes.

Then display `2 h 38 min` (with a `print` that uses your two variables).
@starter
duration = 158

hours = 
minutes = 
print(hours, "h", minutes, "min")
@solution
duration = 158

hours = duration // 60
minutes = duration % 60
print(hours, "h", minutes, "min")
@hint
An hour has 60 minutes. duration // 60 gives the hours, duration % 60 the remainder.
@check
assert hours == 2, f"hours should be 2, it is {hours}."
assert minutes == 38, f"minutes should be 38, it is {minutes}."
assert "duration" in CODE.split("hours =")[1].split("\n")[0], "Calculate hours from the duration variable (not by writing 2 directly)."
assert OUT.strip() == "2 h 38 min", f"The expected output is \"2 h 38 min\", got \"{OUT.strip()}\"."
```

+++

## Exercise: the average

```exercise
@title Term average
@prompt
Awa got three grades out of 20: `13.5`, `16` and `11`.

Calculate her average in a variable `average`, **rounded to 2 decimal places**, then display it.
@starter
grade1 = 13.5
grade2 = 16
grade3 = 11

average = 
print(average)
@solution
grade1 = 13.5
grade2 = 16
grade3 = 11

average = round((grade1 + grade2 + grade3) / 3, 2)
print(average)
@hint
Don't forget the parentheses around the sum, then wrap everything in round(..., 2).
@check
assert average == 13.5, f"The rounded average should be 13.5 (40.5 / 3), you get {average}. Did you put parentheses around the sum?"
assert "round" in CODE, "Use round(..., 2) to round."
assert "13.5" in OUT, "Display the average with print(average)."
```
