---
id: python-data
title: Python, data and your first code
subtitle: Why this language, why data, and off we go.
duration: 10
---
## Why Python?

There are hundreds of languages. Python is one of the most used in the world, for good reasons:

- **It reads almost like English.** Less time on syntax, more time on the problem.
- **It's used everywhere**: websites (Instagram), scientific research (NASA), banks, artificial intelligence, automating office tasks…
- **It's the king of data analysis.** The pandas, NumPy and Matplotlib libraries, which you'll use at the end of the course, are world standards.
- **The community is huge.** Whatever your question, someone has already asked it and someone has answered it.

+++

## What is data?

**Data** is recorded information: a shop's sales, mobile money transactions, a class's grades, each day's weather, bus journeys…

A **data analyst** turns that raw data into useful answers. Their work almost always follows the same path:

```html
<div class="flow">
  <div class="flow-step"><b>Question</b><span>Which product sells best on Saturdays?</span></div>
  <div class="flow-step"><b>Collection</b><span>Get the sales file.</span></div>
  <div class="flow-step"><b>Cleaning</b><span>Fix errors and gaps.</span></div>
  <div class="flow-step"><b>Analysis</b><span>Calculate, compare, group.</span></div>
  <div class="flow-step"><b>Visualization</b><span>A clear chart.</span></div>
  <div class="flow-step"><b>Decision</b><span>Order more of that product.</span></div>
</div>
```

```quiz
A pharmacy wants to know which medicines to order before the rainy season. What is the first step?
* Ask a precise question
- Make a chart
- Delete the old data
> Everything starts with a clear **question**, for example: "Which medicines sold the most during previous rainy seasons?" Without a question, you get lost in the data.
```

+++

## Your journey

Here's the path you'll follow:

1. **First steps**: display, comment, understand errors, use variables.
2. **Types**: numbers, text, true and false.
3. **Deciding and repeating**: conditions and loops.
4. **Organizing your data**: lists and dictionaries.
5. **Functions, modules and files**: reusable code.
6. **Analyzing data**: pandas and charts, all the way to the final project.

Each lesson takes about ten minutes. One a day is enough to make fast progress.

+++

## Your very first Python program

Here is a line of real Python. Press **Run** to launch it. The first time, Python takes a few seconds to wake up.

```py
print("Hello! I am learning Python.")
```

`print` means "display". The text between quotes is displayed as is.

Now **edit the text** between the quotes (write whatever you like) and run it again. You can break the code, it doesn't matter: the **Reset** button brings back the original.

+++

## Your first exercise

Exercises are checked automatically, as if by a teacher with a red pen, but instantly.

```exercise
@title Introduce yourself
@prompt
Write a program that displays a sentence containing **your first name**, for example `My name is Awa`.

Don't forget the quotes around the text, and the parentheses of `print`.
@starter
# Write your line below this comment

@solution
print("My name is Awa")
@hint
Copy the shape of the previous example: print("your text here")
@check
assert "print" in CODE, "Use the print() function to display your text."
assert OUT.strip() != "", "Your program doesn't display anything yet. Write a line with print(\"...\")."
assert len(OUT.strip()) >= 5, "Write a real sentence with your first name."
```

```note
That's it, you are a programmer.
Not an expert yet, but you've written and run code. In the next chapter, things get serious.
```
