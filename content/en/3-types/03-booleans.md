---
id: booleens
title: True or false, and conversions
subtitle: Booleans, comparisons and the input() function.
duration: 14
---
## Only two values

A **boolean** (`bool`) can only be one of two things: `True` or `False`. With a capital letter, without quotes.

You mostly get them by **comparing** values:

| Symbol | Meaning |
|---|---|
| `==` | is equal to |
| `!=` | is different from |
| `<` / `>` | less than / greater than |
| `<=` / `>=` | less than or equal / greater than or equal |

```py
age = 17
print(age >= 18)
print(age == 17)
print("Dakar" == "dakar")
print(10 != 3)
```

```warn
Don't confuse `=` and `==`. A single `=` **stores** a value in a variable. Two `==` **ask a question**: "is it equal?".
```

+++

## Combining: and, or, not

- `and`: true if **both** conditions are true;
- `or`: true if **at least one** is true;
- `not`: swaps true and false.

```py
age = 22
has_ticket = True
print(age >= 18 and has_ticket)
print(age < 12 or age > 65)
print(not has_ticket)
```

```quiz
A discount applies if the customer has a loyalty card **or** if their basket is over 50 euros. The customer has no card and their basket is 60 euros. Do they get the discount?
* Yes
- No
> `False or True` gives `True`: with `or`, one true condition is enough.
```

```predict
x = 5
print(x > 1 and x < 4)
???
- True
* False
- 5
> `x > 1` is true, but `x < 4` is false. With `and`, both must be true: the result is `False`.
```

+++

## Converting from one type to another

You often switch from one type to another:

- `int("25")` turns the text `"25"` into the whole number 25;
- `float("3.5")` gives the decimal number 3.5;
- `str(25)` gives the text `"25"`.

```py
text = "25"
number = int(text)
print(text * 2)
print(number * 2)
print(type(text), type(number))
```

Same value displayed, very different behaviour: the text repeats, the number multiplies. And if the conversion is impossible, Python says so:

```py
int("twenty-five")
```

+++

## Asking for a value with input()

`input()` asks the user a question and waits for the answer. **The answer is always text**, even if you type a number.

On this site, since there's no "live" keyboard while the code runs, you type your answers in advance in the **Inputs** box under the editor, one per line. Run it, then replace the values with your first name and your year of birth.

```py inputs=Awa|2001
name = input("What is your name? ")
year = input("What year were you born? ")
age = 2026 - int(year)
print(f"Nice to meet you {name}, you are (or will be) {age} this year.")
```

Without `int(year)`, the subtraction would be impossible: you can't subtract text from a number.

+++

## Exercise: can they vote?

```exercise
@title The right to vote
@prompt
From the variable `age`, create a variable `can_vote` that is `True` if the age is greater than **or equal to** 18, and `False` otherwise. Display it.

Your code must work for any age: don't write `True` by hand, use a comparison.
@starter
age = 20

can_vote = 
print(can_vote)
@solution
age = 20

can_vote = age >= 18
print(can_vote)
@hint
A comparison directly gives True or False: can_vote = age >= 18
@check
assert isinstance(can_vote, bool), "can_vote must be a boolean (True or False), obtained with a comparison."
assert ">=" in CODE or ">" in CODE, "Use a comparison with age."
ns = {}
exec(CODE.replace("age = 20", "age = 18", 1).replace("print(", "(lambda *a, **k: None)("), ns)
assert ns["can_vote"] is True, "With age = 18, can_vote should be True (18 counts as \"greater than or equal\")."
ns = {}
exec(CODE.replace("age = 20", "age = 15", 1).replace("print(", "(lambda *a, **k: None)("), ns)
assert ns["can_vote"] is False, "With age = 15, can_vote should be False."
```

+++

## Exercise: the till

```exercise
@title The cash register
@prompt
The program asks for an item's **price**, then the **quantity**, with `input()`. The answers are already in the Inputs box: `2.5` and `4`.

Convert them correctly (the price can have decimals, the quantity is a whole number), calculate the total and display:

`Total: 10.0 euros`
@inputs
2.5
4
@starter
price = input("Item price? ")
quantity = input("Quantity? ")

total = price * quantity
print(f"Total: {total} euros")
@solution
price = float(input("Item price? "))
quantity = int(input("Quantity? "))

total = price * quantity
print(f"Total: {total} euros")
@hint
input() always returns text. Wrap it in float(...) for the price and int(...) for the quantity.
@check
assert "Total: 10.0 euros" in OUT, "The program must display \"Total: 10.0 euros\" with the inputs 2.5 and 4."
assert "float(" in CODE, "The price must be converted with float()."
assert "int(" in CODE, "The quantity must be converted with int()."
```
