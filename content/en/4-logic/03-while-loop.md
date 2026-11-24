---
id: boucle-while
title: Repeating with while
subtitle: While… and how to avoid the infinite loop.
duration: 12
---
## As long as the condition is true

`for` repeats a number of times known in advance. But sometimes, you don't know how many laps you'll need. Then you use `while`: the block is repeated **as long as** the condition stays true.

```py
savings = 0
months = 0
while savings < 100000:
    savings += 15000
    months += 1
print(f"Goal reached in {months} months, with {savings} francs")
```

We didn't know in advance it would take 7 months: the loop found out.

+++

## The infinite loop

If the condition **never** becomes false, the loop never stops. That's the **infinite loop**, the classic trap.

```py static
counter = 1
while counter <= 5:
    print(counter)
    # oops: we forgot counter += 1
```

Here, `counter` is always 1, so `counter <= 5` is always true. The program runs forever.

```info
No panic if it happens to you on this site: after a few seconds, the program is stopped automatically and Python restarts. On your own computer, you stop a stuck program with Ctrl + C.
```

```quiz
What is most often missing in an infinite loop?
- The `print`
* The line that changes the variable tested by the condition
- The colon
> For the loop to stop, each lap must bring the condition closer to "false": increase a counter, decrease a stock, etc.
```

+++

## Leaving early: break and continue

- `break` stops the loop **immediately**;
- `continue` skips **to the next lap**, without running the rest of the block.

```py
# Looking for the first multiple of 7 above 50
n = 51
while True:
    if n % 7 == 0:
        break
    n += 1
print("Found:", n)
```

`while True` is a deliberately infinite loop: only `break` gets out of it. It's a common pattern when searching for something.

```py
for n in range(1, 11):
    if n % 3 == 0:
        continue
    print(n)
```

Multiples of 3 are skipped thanks to `continue`.

+++

## A little game

Let's combine `while`, `input` and `if`. The program has picked a secret number; you get several tries. Your guesses go in the Inputs box, one per line. Run it with the suggested values, then try your own.

```py inputs=50|25|37
secret = 37
tries = 0
found = False

while not found:
    guess = int(input("Your number? "))
    tries += 1
    if guess < secret:
        print("Higher!")
    elif guess > secret:
        print("Lower!")
    else:
        found = True

print(f"Well done, found in {tries} tries!")
```

By cutting the range in half each time (50, then 25, then 37…), you find any number between 1 and 100 in at most 7 tries. It's a famous algorithm: **binary search**.

+++

## Exercise: population

```exercise
@title Doubling
@prompt
A city has `population = 500000` inhabitants. It grows by **4% a year** (each year, the population is multiplied by 1.04).

With a `while` loop, calculate how many years (`years`) it takes for the population to **exceed 1 million** (strictly more than 1,000,000). Display `years`.
@starter
population = 500000
years = 0

print(years)
@solution
population = 500000
years = 0
while population <= 1000000:
    population = population * 1.04
    years += 1
print(years)
@hint
while population <= 1000000: then, inside the loop, multiply population by 1.04 and add 1 to years.
@check
assert "while" in CODE, "Use a while loop."
assert years == 18, f"It takes 18 years to exceed 1 million, your program finds {years}."
```

+++

## Exercise: countdown

```exercise
@title Lift-off
@prompt
With a `while` loop, display a countdown from 5 to 1, one number per line, then `Lift-off!`.
@starter
count = 5

@solution
count = 5
while count > 0:
    print(count)
    count -= 1
print("Lift-off!")
@hint
while count > 0: then print(count) and count -= 1. The print("Lift-off!") goes after the loop (not indented).
@check
assert "while" in CODE, "Use a while loop."
lines = [l.strip() for l in OUT.strip().split("\n")]
assert lines == ["5", "4", "3", "2", "1", "Lift-off!"], f"Expected: 5, 4, 3, 2, 1 then Lift-off! (one value per line). Got: {lines}"
```
