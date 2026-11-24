---
id: fonctions-plus
title: Functions, continued
subtitle: Default values, several results, scope and documentation.
duration: 12
---
## Default parameters

A parameter can have a **default value**, used when it isn't given in the call.

```py
def convert(amount, rate=655.957):
    return round(amount * rate)

print(convert(10))             # default rate
print(convert(10, 600))        # rate given
print(convert(rate=2.0, amount=5))  # by name, in any order
```

Calls **by name** (`rate=2.0`) make code easier to read when a function has many parameters. You'll see them everywhere in pandas.

+++

## Returning several values

A function can return several values at once, separated by commas. Actually, it returns a **tuple**, which you unpack on arrival.

```py
def summary(values):
    return min(values), max(values), sum(values) / len(values)

sales = [120, 95, 210, 180, 75]
lowest, highest, mean = summary(sales)
print(f"min {lowest}, max {highest}, mean {mean}")
```

+++

## Variable scope

A variable created **inside** a function only exists in that function. We say it is **local**.

```py
def calculation():
    secret = 42
    return secret * 2

print(calculation())
print(secret)
```

`NameError`: outside, `secret` doesn't exist. It's a protection: each function has its own space, and can't overwrite the rest of the program's variables. To get a value out, use `return`.

+++

## Documenting with a docstring

A **docstring** is a text between triple quotes placed just below the `def`. It explains what the function does. It's an excellent habit.

```py
def bmi(weight, height):
    """Calculates the body mass index.

    weight: in kilograms
    height: in metres
    """
    return round(weight / height ** 2, 1)

print(bmi(70, 1.75))
help(bmi)
```

+++

## Lambda functions

A **lambda** is a tiny nameless function, written on one line. It's mostly used to tell `sorted` (or pandas) **what to sort by**.

```py
products = [("Espresso", 2.5), ("Sandwich", 5.0), ("Doughnut", 1.0)]
by_price = sorted(products, key=lambda p: p[1])
print(by_price)

students = [{"name": "Awa", "grade": 15}, {"name": "Kofi", "grade": 12}, {"name": "Gloire", "grade": 17}]
ranking = sorted(students, key=lambda s: s["grade"], reverse=True)
print([s["name"] for s in ranking])
```

`lambda p: p[1]` means: "from `p`, return `p[1]`", that is, the price.

+++

## Exercises

```exercise
@title Statistics
@prompt
Write a function `statistics(values)` that returns **three values**: the minimum, the maximum and the mean **rounded to 1 decimal place**.
@starter
def statistics(values):
    ...

lowest, highest, mean = statistics([12, 18, 7, 15, 10])
print(lowest, highest, mean)
@solution
def statistics(values):
    mean = round(sum(values) / len(values), 1)
    return min(values), max(values), mean

lowest, highest, mean = statistics([12, 18, 7, 15, 10])
print(lowest, highest, mean)
@hint
return min(values), max(values), round(sum(values) / len(values), 1)
@check
r = statistics([12, 18, 7, 15, 10])
assert isinstance(r, tuple) and len(r) == 3, "The function must return three values separated by commas."
assert r == (7, 18, 12.4), f"Expected (7, 18, 12.4), got {r}."
assert statistics([1, 2]) == (1, 2, 1.5), "Test your function with other values: statistics([1, 2]) must give (1, 2, 1.5)."
```

```exercise
@title The discount
@prompt
Write a function `apply_discount(price, percent=10)` that returns the price after the discount, rounded to 2 decimal places. By default, the discount is 10%.

Examples: `apply_discount(50)` returns `45.0`; `apply_discount(80, 25)` returns `60.0`.
@starter
def apply_discount(price, percent=10):
    ...

print(apply_discount(50))
print(apply_discount(80, 25))
@solution
def apply_discount(price, percent=10):
    return round(price * (1 - percent / 100), 2)

print(apply_discount(50))
print(apply_discount(80, 25))
@hint
A 10% discount means multiplying by (1 - 10 / 100), that is 0.9.
@check
assert apply_discount(50) == 45.0, f"apply_discount(50) should be 45.0, got {apply_discount(50)}."
assert apply_discount(80, 25) == 60.0, f"apply_discount(80, 25) should be 60.0, got {apply_discount(80, 25)}."
assert apply_discount(19.99, 15) == 16.99, f"apply_discount(19.99, 15) should be 16.99, got {apply_discount(19.99, 15)}."
```
