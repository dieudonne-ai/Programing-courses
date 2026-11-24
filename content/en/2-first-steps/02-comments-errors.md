---
id: erreurs
title: Comments and errors
subtitle: Writing notes, and no longer fearing red messages.
duration: 12
---
## Comments

Everything after a `#` on a line is a **comment**: Python ignores it completely. It's a note for humans, including you in three months' time.

```py
# This program calculates the price of an order
unit_price = 3      # in euros
print(unit_price * 4)   # 4 cappuccinos
# print("This line doesn't run, it is commented out")
```

Commenting out a line (putting a `#` in front of it) is also a handy way to **disable** code temporarily, without deleting it.

```quiz
What does Python do with the line `# print("Hello")`?
- It displays Hello
* Nothing at all: it's a comment
- It displays an error
> The `#` turns the whole line into a comment. Python doesn't run it.
```

+++

## Errors are your friends

You will make errors. Lots of them. Everyone does, every day, including Google's developers. The difference between a beginner and a pro: the pro **reads the error message**.

Run this code. It contains a deliberate error.

```py
print("Hello)
```

Look at the message. It tells you three things:

1. **The error type**: `SyntaxError`, a "grammar" mistake.
2. **The line** where Python got stuck.
3. **An explanation**: here, a string that is never closed.

Fix the code (add the missing quote) and run it again.

+++

## The three most common errors

**1. NameError: an unknown name.** Python doesn't know this word. Often a typo, or an extra capital letter: to Python, `print` and `Print` are two different words.

```py
Print("Python tells upper and lower case apart")
```

**2. Forgetting the quotes.** Without quotes, Python thinks `Hello` is the name of something.

```py
print(Hello)
```

**3. IndentationError: an extra shift.** In Python, spaces at the start of a line have a meaning. A line must not be shifted for no reason.

```py
print("Line 1")
  print("Line 2")
```

Fix these three examples one by one.

+++

## Guess the output

```predict
print("A")
print("B")
prnt("C")
print("D")
???
- Nothing is displayed
* A and B are displayed, then a NameError
- A, B and D are displayed
> Python runs from top to bottom. Lines 1 and 2 work. On line 3, `prnt` is unknown: error, and the program stops. Line 4 never runs.
```

```quiz
To Python, `Print("x")` and `print("x")` are…
- the same thing
* not the same: Python tells upper and lower case apart
- both errors
> Python is **case sensitive**: `Print`, `PRINT` and `print` are three different names. Only `print` exists.
```

+++

## The detective method

When you hit an error, always follow these steps:

1. **Read the error type** and the explanation.
2. **Go to the line shown** (and also look at the line just before: the error often comes from there).
3. **Compare** with an example that works.
4. **Change one thing** at a time, then run again.

```exercise
@title The broken code
@prompt
This program contains **three errors**. Fix them so that it displays:

    I debug
    like a pro
    3 errors fixed

Run it first to read the error messages, one by one.
@starter
print("I debug)
Print("like a pro")
 print(3, "errors fixed")
@solution
print("I debug")
print("like a pro")
print(3, "errors fixed")
@hint
A missing quote, an extra capital letter, a space at the start of a line.
@check
expected = ["I debug", "like a pro", "3 errors fixed"]
lines = [l.strip() for l in OUT.strip().split("\n")]
assert lines == expected, "The output isn't exactly the one asked for yet. Compare line by line."
```
