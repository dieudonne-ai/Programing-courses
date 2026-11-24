---
id: super-pouvoirs
title: The programmer's five superpowers
subtitle: Every program in the world is built from these bricks.
duration: 12
---
## The best-kept secret

A banking app, a video game, an airline's website… They look very different. Yet they are all built from the same five basic bricks:

1. **sequence**: doing things in order;
2. **variables**: remembering things;
3. **conditions**: making decisions;
4. **loops**: repeating;
5. **functions**: giving a name to a skill so you can reuse it.

You already know the first three without realizing it. Let's discover them with real Python code. No need to understand everything: just look at the idea.

+++

## Sequence and variables

A **variable** is a box with a label. You store a value in it to remember it later. Go step by step and watch the computer's memory.

```widget
@name stepper
@config
{"code": "price = 500\nquantity = 3\ntotal = price * quantity\nprint(total)",
 "steps": [
  {"line": 1, "vars": {}, "note": "Python reads line 1: it is going to create a box called price."},
  {"line": 2, "vars": {"price": "500"}, "note": "The price box holds 500. Line 2: a second box."},
  {"line": 3, "vars": {"price": "500", "quantity": "3"}, "note": "Line 3: Python reads what is in both boxes and multiplies them (* means \"times\")."},
  {"line": 4, "vars": {"price": "500", "quantity": "3", "total": "1500"}, "note": "The result is stored in a new box, total. Line 4: we display it."},
  {"line": 4, "vars": {"price": "500", "quantity": "3", "total": "1500"}, "out": "1500", "note": "print displays what total contains. End of the program!"}
 ]}
```

Notice the **sequence**: Python runs the lines one by one, from top to bottom. Line 3 needs `price` and `quantity`: it has to come after them.

+++

## Conditions

A **condition** lets the program choose what to do depending on the situation. In Python, we write `if`, `elif` ("else if") and `else`.

Move the slider and see which part of the code runs.

```widget
@name condition
@config
{"name": "temperature", "label": "Temperature outside:", "min": -5, "max": 42, "value": 22,
 "branches": [
  {"code": "if temperature < 15:", "lt": 15, "out": "It's chilly, take a jacket!"},
  {"code": "elif temperature < 30:", "lt": 30, "out": "It's nice, enjoy!"},
  {"code": "else:", "out": "It's very hot, drink lots of water!"}
 ]}
```

The program runs **only one** of the three branches: the first one whose condition is true.

```quiz
With this program, what is displayed if `temperature` is exactly 30?
- It's chilly, take a jacket!
- It's nice, enjoy!
* It's very hot, drink lots of water!
> 30 is not less than 15, nor less than 30 (30 < 30 is false). So we end up in the `else`. "Right on the boundary" cases are classic traps!
```

+++

## Loops

A **loop** repeats instructions. Here, `for` repeats the indented line once for each number from 1 to 3. Watch the `lap` variable change on each pass.

```widget
@name stepper
@config
{"code": "for lap in range(1, 4):\n    print(\"Lap number\", lap)\nprint(\"Done!\")",
 "steps": [
  {"line": 1, "vars": {}, "note": "range(1, 4) produces the numbers 1, 2, 3 (4 is excluded)."},
  {"line": 2, "vars": {"lap": "1"}, "note": "First pass: lap is 1."},
  {"line": 1, "vars": {"lap": "1"}, "out": "Lap number 1", "note": "Back to the top of the loop for the next number."},
  {"line": 2, "vars": {"lap": "2"}, "out": "Lap number 1", "note": "Second pass: lap is 2."},
  {"line": 1, "vars": {"lap": "2"}, "out": "Lap number 1\nLap number 2"},
  {"line": 2, "vars": {"lap": "3"}, "out": "Lap number 1\nLap number 2", "note": "Third and last pass."},
  {"line": 3, "vars": {"lap": "3"}, "out": "Lap number 1\nLap number 2\nLap number 3", "note": "No more numbers: we leave the loop and carry on after it."},
  {"line": 3, "vars": {"lap": "3"}, "out": "Lap number 1\nLap number 2\nLap number 3\nDone!", "note": "To repeat 1000 times, you'd only change a single number."}
 ]}
```

+++

## Functions

A **function** is a skill you give a name to. Think of a juicer: you put fruit in (the **input**), it does its job, and it gives you juice (the **output**). You don't need to know how it works inside.

You've already seen a function: `print`. Someone wrote it once and for all, and millions of programmers use it every day.

```py static
def price_with_tax(price):
    return price * 1.18

print(price_with_tax(1000))
print(price_with_tax(2500))
```

Here, we create (with `def`) a function that adds 18% tax to a price. We can then use it as many times as we like.

+++

## Spot the superpowers

```quiz
An app sends a "Drink some water" reminder **every hour**. Which superpower is at work?
- A variable
- A condition
* A loop
> Repeating the same action at regular intervals is a **loop**.
```

```quiz
"**If** the account balance is lower than the amount, refuse the payment."
* A condition
- A loop
- A function
> The program makes a decision depending on the situation: it's a **condition**.
```

```quiz
Your delivery app remembers the address you typed so it can show it on the map. It uses…
- a loop
* a variable
- a function
> Keeping a value in memory to use it later is the job of a **variable**.
```

+++

## The real skill: breaking things down

Faced with a big problem, a programmer doesn't rush in head first. They **break it down** into small, simple problems. For example, "build a food delivery app" becomes:

- show the list of restaurants (a loop over the restaurants);
- remember the customer's basket (variables);
- check that the payment is accepted (a condition);
- calculate the total price (a function);
- …

Each small piece becomes easy. This way of thinking is called **computational thinking**, and it will help you even outside programming.

```note
Sequence, variables, conditions, loops, functions.
You now have the map of the territory. The rest of the course is the journey.
```
