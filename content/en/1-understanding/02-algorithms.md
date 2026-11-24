---
id: algorithmes
title: Algorithms, recipes for machines
subtitle: Before writing code, you write a method.
duration: 10
---
## A fancy word for a simple idea

An **algorithm** is a sequence of precise steps to solve a problem. You use them every day without knowing it:

- a **cooking recipe** is an algorithm to make a dish;
- **directions** ("straight on, then left at the roundabout") are an algorithm to get somewhere;
- the **long division method** you learned at school is a calculation algorithm.

A program is an algorithm translated into a language the computer understands.

+++

## Put the recipe back in order

Here is the algorithm to make a cup of tea. The steps have been shuffled. Put them back in the right order (with the arrows, or by dragging them).

```widget
@name order
@config
{"prompt": "Making a cup of tea", "items": [
  "Fill the kettle with water",
  "Switch the kettle on and wait for the water to boil",
  "Pour the boiling water into the cup",
  "Dip the tea bag into the hot water",
  "Wait 3 minutes",
  "Take the tea bag out of the cup"
]}
```

+++

## Precision above all

A human understands "add a pinch of salt". A computer doesn't: how many grams? Which salt? Added where?

There's an old programmer joke:

> Someone tells their programmer friend: "Go buy a loaf of bread. If they have eggs, get six."
> The programmer comes back with six loaves of bread.

```quiz
Why does the programmer come back with six loaves?
- They were very hungry
* The instruction was ambiguous: "get six" could refer to the loaves
- There were no eggs
> They had eggs, so the programmer applied "get six"… to the bread, the only item mentioned. A computer would have done the same. An instruction must have **only one possible meaning**.
```

+++

## Deciding and repeating

Look closely at recipes: they often contain two magic words.

- **If**: "*If* you like sweet tea, add a sugar." This is a **condition**: the action is done only in certain cases.
- **While** / **Repeat**: "*While* the water isn't boiling, wait." This is a **loop**: an action is repeated.

Here is a famous algorithm: finding the largest number in a list, for example the grades of a class. Put the steps in order.

```widget
@name order
@config
{"prompt": "Finding the best grade in the class", "items": [
  "Read the first grade and remember it as the \"best grade so far\"",
  "Move on to the next grade",
  "**If** it is higher than the remembered grade, remember it instead",
  "**Repeat** the two previous steps until the last grade",
  "Announce the remembered grade: it's the best one"
], "success": "Exactly. You just wrote a real algorithm with a condition and a loop. In a few chapters, you'll write it in Python."}
```

+++

## The robot learns to repeat

Writing "Move forward" six times in a row is tedious. Programmers hate repeating themselves! In this new challenge, you can click the small **×1** button on an instruction to repeat it 2, 3, 4 or 5 times.

Careful: each level sets a maximum number of blocks.

```widget
@name robot
@config
{"loops": true, "levels": [
  {"grid": ["S.....G"], "dir": "E", "maxBlocks": 1, "hint": "A single instruction, repeated."},
  {"grid": ["S....", ".#.#.", "....G"], "dir": "E", "maxBlocks": 3},
  {"grid": ["S..#", "##.#", "G..#"], "dir": "E", "maxBlocks": 5, "hint": "The robot has to turn back along the bottom."}
]}
```

+++

## Key takeaways

- An **algorithm** is a method made of precise, unambiguous steps.
- The **order** of the steps matters.
- Two tools come up everywhere: the **condition** (if…) and the **loop** (repeat…).

```quiz
"While there are customers in the queue, serve the next customer." What is this?
- A condition
* A loop
- A mistake
> "While" repeats an action several times: it's a **loop**. It stops when the queue is empty.
```
