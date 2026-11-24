---
id: boucle-for
title: Repeating with for
subtitle: Make the computer work for you.
duration: 14
---
## The for loop

A **loop** repeats a block of code. The `for` loop repeats it **for each item** of a sequence.

```py
for i in range(5):
    print("I must not chat in class.")
```

Five lines from two lines of code. For 500, just change the 5. Like `if`, the `for` line ends with `:` and the repeated block is indented.

+++

## range(), the number generator

`range` produces a sequence of whole numbers:

| Written | Numbers produced |
|---|---|
| `range(5)` | 0, 1, 2, 3, 4 |
| `range(1, 6)` | 1, 2, 3, 4, 5 |
| `range(0, 20, 5)` | 0, 5, 10, 15 |
| `range(10, 0, -1)` | 10, 9, … 1 |

The end value is always **excluded**. The loop variable (here `n`) takes each value in turn:

```py
for n in range(1, 6):
    print(n, "squared =", n ** 2)
```

```predict
for i in range(2, 8, 2):
    print(i)
???
- 2 4 6 8
* 2 4 6
- 2 3 4 5 6 7
> We start at 2, go up in steps of 2, and stop **before** 8: 2, 4, 6.
```

+++

## Looping over text

`for` works on anything that contains several items. A text, for example, contains characters:

```py
for letter in "Bissap":
    print(letter)
```

And soon you'll loop over lists of sales, grades or customers with exactly the same syntax.

+++

## The accumulator pattern

Here is the most important pattern in all of data programming: **accumulating** a result in a variable.

```widget
@name stepper
@config
{"code": "weekly_sales = 0\nfor day in range(1, 4):\n    weekly_sales = weekly_sales + 100 * day\nprint(weekly_sales)",
 "steps": [
  {"line": 1, "vars": {}, "note": "We prepare a box that starts at 0."},
  {"line": 2, "vars": {"weekly_sales": "0"}, "note": "Start of the loop: day will take the values 1, 2, 3."},
  {"line": 3, "vars": {"weekly_sales": "0", "day": "1"}, "note": "0 + 100 × 1 = 100"},
  {"line": 3, "vars": {"weekly_sales": "100", "day": "2"}, "note": "100 + 100 × 2 = 300"},
  {"line": 3, "vars": {"weekly_sales": "300", "day": "3"}, "note": "300 + 100 × 3 = 600"},
  {"line": 4, "vars": {"weekly_sales": "600", "day": "3"}, "out": "600", "note": "The loop is over: the box holds the total."}
 ]}
```

In Python, `total = total + x` can also be written `total += x`. It's shorter and very common.

```py
total = 0
for n in range(1, 11):
    total += n
print("The sum from 1 to 10 is", total)
```

+++

## Counting

A special case of the accumulator: the **counter**. You add 1 each time a condition is true. Here we combine `for` and `if`:

```py
sentence = "data is all around us every day"
count_a = 0
for letter in sentence:
    if letter == "a":
        count_a += 1
print(f"The letter a appears {count_a} times")
```

Notice the **two levels of indentation**: the `if` is inside the loop, and `count_a += 1` is inside the `if`.

+++

## Exercise: the times table

```exercise
@title The 7 times table
@prompt
With a `for` loop, display the 7 times table, from 1 to 10, in this form:

    7 x 1 = 7
    7 x 2 = 14
    ...
    7 x 10 = 70
@starter
n = 7

@solution
n = 7

for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")
@hint
for i in range(1, 11): then, inside the loop, print(f"{n} x {i} = {n * i}")
@check
assert "for" in CODE, "Use a for loop."
lines = [l.strip() for l in OUT.strip().split("\n")]
expected = [f"7 x {i} = {7 * i}" for i in range(1, 11)]
assert len(lines) == 10, f"You need 10 lines, your program displays {len(lines)}."
assert lines == expected, f"Check the format. Expected first line: \"7 x 1 = 7\", got: \"{lines[0]}\"."
```

+++

## Exercise: the sum

```exercise
@title The sum of the first 100 numbers
@prompt
The story goes that a 9-year-old pupil, Carl Friedrich Gauss, worked out 1 + 2 + 3 + … + 100 in his head. You have Python.

Calculate this sum with a loop and an accumulator, in a variable `total`, then display it.
@starter
total = 0

print(total)
@solution
total = 0
for n in range(1, 101):
    total += n
print(total)
@hint
range(1, 101) produces the numbers from 1 to 100. On each lap: total += n.
@check
assert "for" in CODE, "Use a for loop."
assert total == 5050, f"The sum should be 5050, you get {total}. Check your range bounds (the end is excluded)."
assert "5050" not in CODE, "Don't type the result by hand: calculate it with the loop."
```

+++

## Exercise: counting vowels

```exercise
@title Vowel counter
@prompt
Count the vowels (a, e, i, o, u, y) in the variable `sentence` and store the result in `vowels`. Display it.

Tip: `letter in "aeiouy"` is `True` if the letter is a vowel.
@starter
sentence = "python is a wonderful language"
vowels = 0

print(vowels)
@solution
sentence = "python is a wonderful language"
vowels = 0
for letter in sentence:
    if letter in "aeiouy":
        vowels += 1
print(vowels)
@hint
for letter in sentence: then if letter in "aeiouy": then vowels += 1 (watch the two levels of indentation).
@check
expected = sum(1 for c in "python is a wonderful language" if c in "aeiouy")
assert vowels == expected, f"There are {expected} vowels in the sentence, your program counts {vowels}."
assert "for" in CODE, "Use a for loop."
```
