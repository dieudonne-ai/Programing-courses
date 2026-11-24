---
id: listes
title: Lists
subtitle: Many values in a single variable.
duration: 15
---
## One variable, lots of values

Imagine the grades of 30 students. Creating 30 variables `grade1`, `grade2`… would be absurd. We use a **list**: an ordered sequence of values, between **square brackets**, separated by commas.

```py
grades = [12, 15, 9, 17, 14]
cities = ["Kinshasa", "Abidjan", "Dakar"]
mixed = ["Awa", 24, True, 1.75]

print(grades)
print(len(cities))
```

`len()` gives the number of items, just like for text.

+++

## Accessing items

As with text, each item has a **position** that starts at **0**.

```py
cities = ["Kinshasa", "Abidjan", "Dakar", "Paris", "Montreal"]
print(cities[0])
print(cities[2])
print(cities[-1])
print(cities[1:3])
```

```predict
fruits = ["mango", "pineapple", "papaya", "banana"]
print(fruits[1])
???
- mango
* pineapple
- papaya
> Position 0 is "mango", position 1 is "pineapple". Always count from 0!
```

And what if you ask for a position that doesn't exist?

```py
cities = ["Kinshasa", "Abidjan", "Dakar"]
print(cities[3])
```

`IndexError`: the list has 3 items, at positions 0, 1 and 2. Position 3 doesn't exist.

+++

## Changing a list

Unlike text, lists can be **changed**.

```py
shopping = ["rice", "oil"]
shopping.append("tomatoes")     # adds at the end
shopping.insert(0, "bread")     # inserts at position 0
shopping[1] = "basmati rice"    # replaces the item at position 1
shopping.remove("oil")          # removes this item
last = shopping.pop()           # removes and returns the last one
print(shopping)
print("Removed:", last)
print("basmati rice" in shopping)
```

| Method | Effect |
|---|---|
| `.append(x)` | adds x at the end |
| `.insert(i, x)` | inserts x at position i |
| `.remove(x)` | removes the first occurrence of x |
| `.pop()` | removes the last item and returns it |
| `.sort()` | sorts the list |
| `.count(x)` | counts the x |

+++

## Calculating on a list

Python has ready-made functions for lists of numbers:

```py
sales = [120, 95, 210, 180, 75, 160, 230]
print("Total:", sum(sales))
print("Minimum:", min(sales))
print("Maximum:", max(sales))
print("Average:", round(sum(sales) / len(sales), 1))
print("Sorted:", sorted(sales))
print("Largest to smallest:", sorted(sales, reverse=True))
```

`sorted(list)` returns a **new** sorted list, while `list.sort()` sorts the list itself.

+++

## Looping over a list

The `for` loop goes through a list item by item. It's the most used combination in Python.

```py
temperatures = [28, 31, 35, 30, 27, 33, 36]
hot_days = 0
for t in temperatures:
    if t > 32:
        hot_days += 1
        print(f"{t} °C: it's hot!")
print(f"{hot_days} days above 32 °C")
```

You can also **build** a list in a loop: start from an empty list `[]` and use `append`.

```py
prices = [1000, 2500, 400]
prices_with_tax = []
for p in prices:
    prices_with_tax.append(p * 1.18)
print(prices_with_tax)
```

+++

## Exercise: the best grade, by hand

```exercise
@title The chapter 1 algorithm
@prompt
In chapter 1, you put the algorithm that finds the best grade back in order. Now write it in Python!

Find the largest value in the list `grades` **without using `max()`**, and store it in `best`.

Reminder of the algorithm: remember the first grade, then go through the grades; if a grade is higher than the remembered one, remember it instead.
@starter
grades = [12, 15, 9, 17, 14, 11, 16]

best = grades[0]

print(best)
@solution
grades = [12, 15, 9, 17, 14, 11, 16]

best = grades[0]
for g in grades:
    if g > best:
        best = g

print(best)
@hint
for g in grades: then if g > best: then best = g
@check
assert "max(" not in CODE, "No max() here: the goal is to write the algorithm yourself."
assert "for" in CODE, "Go through the list with a for loop."
assert best == 17, f"The best grade is 17, your program finds {best}."
```

+++

## Exercise: the report card

```exercise
@title The class report card
@prompt
From the list `grades`:

1. add the grade `18` of a student who was absent when they were entered (with `append`);
2. calculate `average`, the class average rounded to 2 decimal places;
3. calculate `passed`, the number of grades greater than or equal to 10.
@starter
grades = [12, 8, 15, 9.5, 14, 6, 17, 11]

average = 
passed = 0

print(average, passed)
@solution
grades = [12, 8, 15, 9.5, 14, 6, 17, 11]
grades.append(18)

average = round(sum(grades) / len(grades), 2)
passed = 0
for g in grades:
    if g >= 10:
        passed += 1

print(average, passed)
@hint
grades.append(18); average = round(sum(grades) / len(grades), 2); then a counter in a for loop.
@check
assert len(grades) == 9 and grades[-1] == 18, "Add the grade 18 at the end of the list with grades.append(18)."
assert average == round(110.5 / 9, 2), f"The expected average is {round(110.5 / 9, 2)}, you get {average}."
assert passed == 6, f"There are 6 grades greater than or equal to 10, you count {passed}."
```
