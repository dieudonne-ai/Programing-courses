---
id: variables
title: Variables
subtitle: Labelled boxes to store your data.
duration: 12
---
## A box with a label

A **variable** is a name given to a value so you can remember and reuse it. Picture a box: the label is the **name**, the content is the **value**.

```py
first_name = "Awa"
age = 24
print(first_name)
print(age)
```

The `=` sign doesn't mean "equals" as in maths. It means **"store the value on the right in the box on the left"**. We say we **assign** a value to a variable.

+++

## Using a variable

Once created, the variable is used in place of its value. No quotes around the name: otherwise it's text!

```py
city = "Abidjan"
print("I live in", city)
print("city")
```

Why bother? If the city changes, you edit **a single line** and the whole program follows. Replace `"Abidjan"` with your city and run.

+++

## A variable can change

A variable can receive a new value: the old one is replaced. Watch the memory step by step.

```widget
@name stepper
@config
{"code": "score = 0\nscore = 10\nscore = score + 5\nprint(score)",
 "steps": [
  {"line": 1, "vars": {}, "note": "We create the score box."},
  {"line": 2, "vars": {"score": "0"}, "note": "score is 0. We're going to replace it with 10."},
  {"line": 3, "vars": {"score": "10"}, "note": "Python first works out the right side: score + 5, so 10 + 5 = 15…"},
  {"line": 4, "vars": {"score": "15"}, "note": "…then stores 15 in score. The old value is gone."},
  {"line": 4, "vars": {"score": "15"}, "out": "15", "note": "score = score + 5 is a very common line: \"increase score by 5\"."}
 ]}
```

```predict
coins = 3
coins = coins * 2
coins = coins - 1
print(coins)
???
- 3
- 6
* 5
> 3, then 3 × 2 = 6, then 6 − 1 = 5. Each line starts from the previous value.
```

+++

## Calculating with variables

Variables make calculations readable. Compare `print(4 * 3.5)` with this:

```py
number_of_coffees = 4
coffee_price = 3.5
total = number_of_coffees * coffee_price
print("Total to pay:", total)
```

The code almost reads like a sentence. That's what a good program is: **understandable by a human**.

```info
In Python, decimal numbers are written with a **dot**: `3.5`, never `3,5`.
```

+++

## Naming variables well

Python has a few rules:

- only letters, digits and the underscore `_`;
- no spaces, no dash `-` (Python would think it's a subtraction);
- don't start with a digit;
- upper and lower case matter: `age` and `Age` are two different variables.

And one convention: names are written in lower case, with `_` between words. This is **snake_case**. Examples: `total_price`, `number_of_students`.

```quiz
Which of these variable names is **valid** in Python?
- `total price`
- `2nd_price`
* `total_price`
- `total-price`
> `total price` contains a space, `2nd_price` starts with a digit, `total-price` contains a dash. Only `total_price` follows the rules.
```

```tip
Choose names that say what's in the box. `x` and `stuff` mean nothing; `average_grade` explains itself.
```

+++

## Exercise: your ID card

```exercise
@title Your ID card
@prompt
Create three variables:

- `first_name` holding your first name (text);
- `city` holding your city (text);
- `age` holding your age (a number, **without quotes**).

Then display a sentence that uses them, for example: `Awa lives in Dakar and is 24 years old`.
@starter
first_name = 
city = 
age = 

print(first_name, "lives in", ...)
@solution
first_name = "Awa"
city = "Dakar"
age = 24

print(first_name, "lives in", city, "and is", age, "years old")
@hint
For text, use quotes: first_name = "Awa". For the age, no quotes: age = 24. In the print, separate each piece with a comma.
@check
for name in ("first_name", "city", "age"):
    assert name in dir(), f"The variable \"{name}\" doesn't exist. Create it with {name} = ..."
assert isinstance(first_name, str) and first_name.strip(), "first_name must hold text between quotes."
assert isinstance(city, str) and city.strip(), "city must hold text between quotes."
assert isinstance(age, int), "age must be a whole number, written without quotes (for example age = 24)."
assert first_name in OUT and city in OUT and str(age) in OUT, "The sentence displayed must contain your first name, your city and your age (use the variables in the print)."
assert "..." not in CODE, "There are still ... in your code: replace them."
```

+++

## Exercise: the change

```exercise
@title Giving change
@prompt
A customer buys 3 croissants at 1.8 euros each and pays with a 10-euro note.

1. Create a variable `total` that calculates the price of the 3 croissants (with a calculation, not by writing the result yourself).
2. Create a variable `change` that calculates what we give back.
3. Display `change`.
@starter
croissant_price = 1.8
quantity = 3
note = 10

total = 
change = 
print(change)
@solution
croissant_price = 1.8
quantity = 3
note = 10

total = croissant_price * quantity
change = note - total
print(change)
@hint
total = croissant_price * quantity. Then the change is the note minus the total.
@check
assert "total" in dir() and "change" in dir(), "You need to create the variables total and change."
assert abs(total - 5.4) < 1e-9, f"total should be 3 × 1.8 = 5.4, it is {total}."
assert abs(change - 4.6) < 1e-9, f"change should be 10 − 5.4 = 4.6, it is {change}."
assert "croissant_price" in CODE.split("total =")[1] if "total =" in CODE else True, "Calculate total from the variables croissant_price and quantity."
```

```info
You may have seen `4.6` or a strange number like `4.6000000000000005`. It's not a bug in your code: computers store decimal numbers approximately. You'll see how to round in the next chapter.
```
