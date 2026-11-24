---
id: fonctions
title: Creating your own functions
subtitle: def, parameters and return.
duration: 15
---
## Why functions?

You already use functions: `print()`, `len()`, `round()`, `sum()`… Someone wrote them once, and everyone reuses them.

Now you'll create **your own**. A function is a piece of code given a name, so that you can:

- **avoid repeating yourself**: write the code once, use it a hundred times;
- **organize**: a big program becomes a series of small, clear functions;
- **fix things more easily**: a bug is fixed in one single place.

+++

## Defining and calling

You **define** a function with `def`, its name, parentheses and a colon. The body is indented.

```py
def welcome():
    print("Hello!")
    print("Welcome to the Baobab Café.")

welcome()
welcome()
```

Defining a function doesn't run it: you're teaching it a skill. Then you **call** it by writing its name followed by parentheses. Here, two calls, so two welcomes.

+++

## Parameters

**Parameters** are the function's inputs: variables that receive the values given when it's called.

```py
def welcome(name, city):
    print(f"Hello {name}, welcome to the {city} café!")

welcome("Awa", "Dakar")
welcome("Gloire", "Kinshasa")
```

In the first call, `name` is `"Awa"` and `city` is `"Dakar"`. In the second, other values. Same code, different results.

+++

## return: giving back a result

`print` **displays** a value. `return` **gives back** a value to the code that called the function, so it can use it: store it in a variable, do a calculation…

```py
def price_with_tax(price, rate=0.18):
    return price * (1 + rate)

a = price_with_tax(1000)
b = price_with_tax(2500)
print(a + b)
print(round(price_with_tax(99.99), 2))
```

```warn
`return` ends the function immediately: the following lines of the block don't run.
```

```quiz
What is the difference between `print` and `return` in a function?
- None, it's the same
* `print` displays on screen; `return` gives back a value the program can reuse
- `return` displays in bigger letters
> A function that only does `print` returns nothing (actually, it returns `None`). You can't reuse its result in a calculation. Useful functions almost always give back their result with `return`.
```

+++

## print or return? The proof

```py
def double_print(x):
    print(x * 2)

def double_return(x):
    return x * 2

result1 = double_print(5)
result2 = double_return(5)
print("result1 =", result1)
print("result2 =", result2)
```

`double_print` displays 10, but `result1` is `None` (nothing). `double_return` displays nothing, but `result2` is indeed 10.

+++

## A function can contain logic

A function can contain conditions, loops, and several `return`s.

```py
def grade_label(grade):
    if grade >= 16:
        return "Excellent"
    elif grade >= 14:
        return "Very good"
    elif grade >= 12:
        return "Good"
    elif grade >= 10:
        return "Pass"
    return "Fail"

for g in [17, 13, 8, 10]:
    print(g, "→", grade_label(g))
```

+++

## Exercises

```exercise
@title Area of a plot
@prompt
Write a function `area(length, width)` that **returns** (with `return`) the area of a rectangular plot of land.

Then display the area of a 25 m by 18 m plot.
@starter
def area(length, width):
    ...

print(area(25, 18))
@solution
def area(length, width):
    return length * width

print(area(25, 18))
@hint
Replace the ... with return length * width
@check
assert "area" in dir() and callable(area), "Define a function named area."
assert area(25, 18) == 450, f"area(25, 18) should return 450, it returns {area(25, 18)}."
assert area(3, 4) == 12, "area(3, 4) should return 12."
assert "450" in OUT, "Display the result of area(25, 18)."
```

```exercise
@title Is it an even number?
@prompt
Write a function `is_even(n)` that returns `True` if `n` is even, `False` otherwise.

Then use it in a list comprehension to create `evens`, the list of even numbers in `numbers`.
@starter
def is_even(n):
    ...

numbers = [3, 8, 15, 22, 41, 60]
evens = 
print(evens)
@solution
def is_even(n):
    return n % 2 == 0

numbers = [3, 8, 15, 22, 41, 60]
evens = [n for n in numbers if is_even(n)]
print(evens)
@hint
return n % 2 == 0, then [n for n in numbers if is_even(n)]
@check
assert is_even(4) is True and is_even(7) is False and is_even(0) is True, "is_even must return True for even numbers and False for odd ones."
assert evens == [8, 22, 60], f"evens should be [8, 22, 60], you get {evens}."
assert "is_even(" in CODE.split("evens =")[1], "Use your is_even function in the list comprehension."
```

```exercise
@title The taxi fare
@prompt
A taxi charges **500 francs pick-up fee**, plus **250 francs per kilometre**. At night, the total price is **increased by 20%**.

Write a function `fare(km, night)` that returns the price, where `night` is `True` or `False`.
@starter
def fare(km, night):
    ...

print(fare(10, False))
print(fare(10, True))
@solution
def fare(km, night):
    price = 500 + 250 * km
    if night:
        price = price * 1.2
    return price

print(fare(10, False))
print(fare(10, True))
@hint
First calculate price = 500 + 250 * km. Then, if night is true, multiply by 1.2. Finally, return price.
@check
assert fare(10, False) == 3000, f"For 10 km by day: 500 + 2500 = 3000. Your function returns {fare(10, False)}."
assert abs(fare(10, True) - 3600) < 1e-6, f"For 10 km at night: 3000 × 1.2 = 3600. Your function returns {fare(10, True)}."
assert fare(0, False) == 500, "For 0 km, the 500-franc pick-up fee remains."
```
