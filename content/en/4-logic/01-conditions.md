---
id: conditions
title: Making decisions with if
subtitle: if, elif, else and indentation.
duration: 14
---
## If… then…

With `if`, your program runs a block of code **only if** a condition is true.

```py
balance = 15000
price = 12000

if balance >= price:
    print("Payment accepted")
    balance = balance - price
    print("New balance:", balance)

print("Thank you for your visit")
```

Three essential details:

1. the `if` line ends with a **colon** `:`;
2. the lines of the block are **shifted by 4 spaces** (we say *indented*);
3. the first non-indented line marks the **end of the block**: `Thank you for your visit` is displayed in every case.

Change the price to `20000` and run again.

+++

## Otherwise: else

`else` says what to do when the condition is false.

```py
balance = 15000
price = 20000

if balance >= price:
    print("Payment accepted")
else:
    missing = price - balance
    print(f"Insufficient balance, {missing} francs missing")
```

```warn
Indentation isn't decoration in Python: it's what says which lines belong to the block. Always use 4 spaces (the Tab key does it for you in the editor).
```

+++

## Several cases: elif

`elif` (short for *else if*) chains several conditions. Python tests them **in order** and runs **only the first** block whose condition is true.

```widget
@name condition
@config
{"name": "grade", "label": "Grade out of 20:", "min": 0, "max": 20, "value": 13,
 "branches": [
  {"code": "if grade >= 16:", "gte": 16, "out": "Excellent"},
  {"code": "elif grade >= 14:", "gte": 14, "out": "Very good"},
  {"code": "elif grade >= 12:", "gte": 12, "out": "Good"},
  {"code": "elif grade >= 10:", "gte": 10, "out": "Pass"},
  {"code": "else:", "out": "Not passed yet"}
 ]}
```

```predict
grade = 17
if grade >= 10:
    print("Pass")
elif grade >= 16:
    print("Excellent")
else:
    print("Fail")
???
* Pass
- Excellent
- Pass, then Excellent
> 17 >= 10 is true: Python runs the first block and **ignores all the others**. The order of conditions matters: test the most demanding cases first.
```

+++

## Combined conditions

The `and`, `or` and `not` from the previous chapter fit naturally into an `if`.

```py
age = 25
student = True

if age < 12 or age >= 65:
    fare = 0
elif student and age < 26:
    fare = 500
else:
    fare = 1000

print(f"Your bus ticket costs {fare} francs")
```

Try different ages, and `student = False`.

+++

## Exercise: even or odd?

```exercise
@title Even or odd
@prompt
Write a program that displays `even` if the number `n` is even, and `odd` otherwise.

Reminder: a number is even if the remainder of its division by 2 is 0.
@starter
n = 42

@solution
n = 42

if n % 2 == 0:
    print("even")
else:
    print("odd")
@hint
if n % 2 == 0: then, below and indented, print("even"). Then else: and print("odd").
@check
assert "if" in CODE, "Use an if condition."
def run_with(v):
    import io, contextlib
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(CODE.replace("n = 42", f"n = {v}", 1), {})
    return buf.getvalue().strip()
assert run_with(42) == "even", "With n = 42, the program must display \"even\"."
assert run_with(7) == "odd", "With n = 7, the program must display \"odd\"."
assert run_with(0) == "even", "With n = 0, the program must display \"even\"."
```

+++

## Exercise: delivery fees

```exercise
@title Delivery fees
@prompt
An online shop calculates its delivery fees from the basket amount:

- **50 euros or more**: free delivery (0);
- **between 20 (included) and 50 euros**: 3 euros;
- **less than 20 euros**: 5 euros.

Complete the program so that the variable `fee` has the right value, whatever `basket` is.
@starter
basket = 35

# calculate fee with if / elif / else

print(f"Delivery fee: {fee} euros")
@solution
basket = 35

if basket >= 50:
    fee = 0
elif basket >= 20:
    fee = 3
else:
    fee = 5

print(f"Delivery fee: {fee} euros")
@hint
Start with the highest case: if basket >= 50: fee = 0, then elif basket >= 20: fee = 3, then else: fee = 5.
@check
def fee_for(v):
    ns = {}
    exec(CODE.replace("basket = 35", f"basket = {v}", 1).replace("print(", "(lambda *a, **k: None)("), ns)
    return ns.get("fee")
for v, expected in [(35, 3), (50, 0), (80, 0), (20, 3), (19.99, 5), (5, 5)]:
    got = fee_for(v)
    assert got == expected, f"For a basket of {v} euros, the fee should be {expected}, your program gives {got}."
```
