---
id: print
title: Displaying with print()
subtitle: Every programmer's first instruction.
duration: 10
---
## Make your program talk

`print()` displays something on the screen. It's the simplest way to see what your program is doing. You'll use it all the time, even as an expert, to check your calculations.

```py
print("Welcome to chapter 2!")
print("Python reads lines from top to bottom.")
print("One line, one print, one line displayed.")
```

Three `print`s, three lines displayed, in order. Try swapping two lines, then run.

+++

## Text between quotes

The text we display must be between **quotes**. In programming, a piece of text is called a **string**.

You can use double quotes `"` or single quotes `'`. Double quotes are handier when your text contains an apostrophe.

```py
print("It's easy with double quotes")
print('Single quotes work too')
```

```warn
If you write `print('It's broken')`, Python thinks the text ends after `It`. Result: an error. When your text contains apostrophes, use double quotes.
```

+++

## Numbers, without quotes

Numbers are written **without** quotes. And here comes the magic: Python can calculate.

```py
print(12 + 30)
print("12 + 30")
```

```predict
print(7 * 6)
???
- 7 * 6
* 42
- "42"
> Without quotes, Python calculates `7 * 6` (the `*` sign means "times") and displays the result: 42.
```

```predict
print("7 * 6")
???
* 7 * 6
- 42
- An error
> With quotes, it's text: Python displays it as is, without calculating anything.
```

+++

## Several things at once

You can give `print` several items, separated by **commas**. Python displays them on the same line, separated by a space.

```py
print("I am", 25, "years old")
print("A week has", 7 * 24, "hours")
print()
print("The empty print() above displayed a blank line.")
```

```tip
The comma lets you mix text and numbers in a single `print`. Python adds the spaces for you.
```

+++

## Exercise: a receipt

```exercise
@title Your first receipt
@prompt
Write a program that displays **three lines**:

1. `Baobab Café`
2. `2 coffees: 5 euros`
3. `Thank you, see you soon!`

Match the text exactly (capital letters and punctuation included).
@starter
# One line per print
@solution
print("Baobab Café")
print("2 coffees: 5 euros")
print("Thank you, see you soon!")
@hint
You need three print instructions, one per line, with each text between quotes.
@check
lines = [l.strip() for l in OUT.strip().split("\n")]
assert len(lines) == 3, f"You need exactly 3 lines displayed, your program displays {len(lines)}."
assert lines[0] == "Baobab Café", f"The first line must be \"Baobab Café\", not \"{lines[0]}\"."
assert lines[1] == "2 coffees: 5 euros", f"The second line must be \"2 coffees: 5 euros\", not \"{lines[1]}\"."
assert lines[2] == "Thank you, see you soon!", f"The third line must be \"Thank you, see you soon!\", not \"{lines[2]}\"."
```

+++

## Exercise: let Python calculate

```exercise
@title How many minutes?
@prompt
A day has 24 hours, and an hour has 60 minutes. Display the sentence:

`A day has 1440 minutes`

But **don't calculate it yourself**: write `24 * 60` in your `print` and let Python do the maths.
@starter
print("A day has", ...)
@solution
print("A day has", 24 * 60, "minutes")
@hint
Replace the ... with the calculation, then add a comma and the text "minutes".
@check
assert "24 * 60" in CODE.replace("24*60", "24 * 60") or "60 * 24" in CODE.replace("60*24", "60 * 24"), "Write the calculation 24 * 60 in your code instead of the result."
assert OUT.strip() == "A day has 1440 minutes", f"The program must display \"A day has 1440 minutes\". It displays: \"{OUT.strip()}\""
```

```note
Well done. You can now display text, numbers and calculations. That's already half of what a program does: show results.
```
