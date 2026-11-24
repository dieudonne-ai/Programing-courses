---
id: comprehensions
title: List comprehensions
subtitle: Transform and filter in a single line.
duration: 12
---
## A loop in one line

You've often written this pattern: create an empty list, fill it in a loop.

```py
prices = [1000, 2500, 400, 1200]
with_tax = []
for p in prices:
    with_tax.append(p * 1.18)
print(with_tax)
```

Python offers a very elegant shortcut, the **list comprehension**:

```py
prices = [1000, 2500, 400, 1200]
with_tax = [p * 1.18 for p in prices]
print(with_tax)
```

It reads almost like a sentence: "`p * 1.18` **for each** `p` **in** `prices`".

+++

## Filtering with if

You can add a condition at the end to keep only some items.

```py
temperatures = [28, 31, 35, 30, 27, 33, 36]
hot = [t for t in temperatures if t > 32]
print(hot)

names = ["Awa", "Kofi", "Amina", "Jean", "Aïcha"]
starts_with_a = [n for n in names if n.startswith("A")]
print(starts_with_a)
```

The general structure: `[expression for item in sequence if condition]`.

```predict
numbers = [1, 2, 3, 4, 5, 6]
print([n * 10 for n in numbers if n % 2 == 0])
???
- [10, 20, 30, 40, 50, 60]
* [20, 40, 60]
- [2, 4, 6]
> We keep only the even numbers (2, 4, 6), then multiply them by 10.
```

+++

## Two precious tools: enumerate and zip

`enumerate` gives the position **and** the item. Handy for numbering a ranking:

```py
podium = ["Gloire", "Awa", "Kofi"]
for rank, name in enumerate(podium, start=1):
    print(f"{rank}. {name}")
```

`zip` goes through two lists **side by side**, item by item:

```py
products = ["Espresso", "Croissant", "Sandwich"]
prices = [2.5, 1.8, 5.0]
for product, p in zip(products, prices):
    print(f"{product}: {p} euros")

menu = dict(zip(products, prices))
print(menu)
```

+++

## Dictionary comprehensions

Same principle with curly braces and a `key: value` pair:

```py
prices_eur = {"Espresso": 2.5, "Croissant": 1.8, "Sandwich": 5.0}
prices_cfa = {product: round(p * 655.96) for product, p in prices_eur.items()}
print(prices_cfa)
```

```tip
Comprehensions are handy, but readability comes first. If your comprehension gets too long, a classic loop is often clearer.
```

+++

## Exercises

```exercise
@title Converting temperatures
@prompt
The list `celsius` holds temperatures in degrees Celsius. With **a list comprehension**, create `fahrenheit` holding the same temperatures in degrees Fahrenheit, rounded to 1 decimal place.

Formula: `F = C × 9 / 5 + 32`
@starter
celsius = [0, 12.5, 25, 31, 37, 100]

fahrenheit = 
print(fahrenheit)
@solution
celsius = [0, 12.5, 25, 31, 37, 100]

fahrenheit = [round(c * 9 / 5 + 32, 1) for c in celsius]
print(fahrenheit)
@hint
[round(c * 9 / 5 + 32, 1) for c in celsius]
@check
assert "for" in CODE and "[" in CODE.split("fahrenheit =")[1], "Use a list comprehension: [... for c in celsius]."
assert fahrenheit == [32.0, 54.5, 77.0, 87.8, 98.6, 212.0], f"Expected result: [32.0, 54.5, 77.0, 87.8, 98.6, 212.0]. Got: {fahrenheit}"
```

```exercise
@title Big orders
@prompt
With a list comprehension and a filter, create `big`: the list of **amounts** of the orders over 100 euros (strictly), **after a 10% discount** (multiply by 0.9).
@starter
amounts = [45, 120, 300, 80, 150, 99, 101]

big = 
print(big)
@solution
amounts = [45, 120, 300, 80, 150, 99, 101]

big = [a * 0.9 for a in amounts if a > 100]
print(big)
@hint
[a * 0.9 for a in amounts if a > 100]
@check
expected = [a * 0.9 for a in [45, 120, 300, 80, 150, 99, 101] if a > 100]
assert [round(x, 6) for x in big] == [round(x, 6) for x in expected], f"Expected: {expected}. Got: {big}"
```
