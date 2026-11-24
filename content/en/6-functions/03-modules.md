---
id: modules
title: Modules and libraries
subtitle: Use other people's code to go much faster.
duration: 12
---
## Don't reinvent the wheel

Python comes with hundreds of **modules**: files full of ready-made functions, organized by theme. You load them with `import`.

```py
import math

print(math.sqrt(144))      # square root
print(math.pi)
print(math.ceil(4.1))      # round up
print(math.floor(4.9))     # round down
```

You write the module name, a dot, then the function: `math.sqrt`. Like an address: "in the math module, the sqrt function".

+++

## Three ways to import

```py
import statistics
print(statistics.mean([12, 15, 9]))

from statistics import median
print(median([12, 15, 9, 20]))

import statistics as st
print(st.stdev([12, 15, 9, 20]))
```

- `import module`: you write `module.function`;
- `from module import function`: you write `function` directly;
- `import module as alias`: a shorter nickname.

The third form is the one you'll see everywhere in data: `import pandas as pd`, `import numpy as np`.

+++

## Randomness with random

```py
import random

random.seed(7)  # makes randomness reproducible
print(random.randint(1, 6))               # a die
print(random.choice(["heads", "tails"]))  # a random choice
team = ["Awa", "Kofi", "Inès", "David"]
random.shuffle(team)
print(team)
```

`random.seed()` sets the starting point of the randomness: with the same seed, you always get the same draws. Essential for an analysis to be **reproducible**.

+++

## Dates with datetime

```py
from datetime import date

today = date.today()
print(today)
independence = date(1960, 6, 30)
print(independence.year)
gap = today - independence
print(f"{gap.days} days since 30 June 1960")
print(independence.strftime("%d/%m/%Y"))
```

Subtracting two dates gives a duration, whose number of days you read with `.days`.

+++

## What about external libraries?

Beyond the modules shipped with Python, there are hundreds of thousands of **libraries** created by the community. You install them with the **pip** tool. On your computer, in a terminal:

```bash
pip install pandas matplotlib
```

On this site, pandas, NumPy and Matplotlib are already available: you'll use them in the next chapter.

```quiz
What does `import pandas as pd` do?
- It installs pandas
* It loads the pandas library and gives it the nickname `pd`
- It creates a variable pd equal to "pandas"
> `import` loads an already installed library (installing is done with pip). `as pd` then lets you write `pd.read_csv(...)` instead of `pandas.read_csv(...)`.
```

+++

## Exercise: rolling dice

```exercise
@title 1000 dice rolls
@prompt
Simulate **1000 rolls** of a 6-sided die with `random.randint(1, 6)`, after setting the seed with `random.seed(42)`.

Count in `sixes` the number of times the die lands on 6, then calculate `percentage` (the percentage of sixes, rounded to 1 decimal place).

In theory, you'd expect about 16.7%.
@starter
import random

random.seed(42)
sixes = 0

print(sixes, percentage)
@solution
import random

random.seed(42)
sixes = 0
for i in range(1000):
    if random.randint(1, 6) == 6:
        sixes += 1
percentage = round(sixes / 1000 * 100, 1)

print(sixes, percentage)
@hint
A for i in range(1000) loop, an if random.randint(1, 6) == 6, and a counter. The percentage: sixes / 1000 * 100.
@check
import random as _r
_r.seed(42)
expected = sum(1 for _ in range(1000) if _r.randint(1, 6) == 6)
assert sixes == expected, f"With seed 42 and 1000 rolls, you get {expected} sixes. You count {sixes}. Did you call random.seed(42) before the loop, and randint only once per lap?"
assert percentage == round(expected / 10, 1), f"The percentage should be {round(expected / 10, 1)}."
```

+++

## Exercise: days to go

```exercise
@title Countdown
@prompt
With the `datetime` module, calculate `days`: the number of days between **1 January 2026** and **14 July 2026**.
@starter
from datetime import date

days = 
print(days)
@solution
from datetime import date

days = (date(2026, 7, 14) - date(2026, 1, 1)).days
print(days)
@hint
Create both dates with date(year, month, day), subtract them, then take .days
@check
assert days == 194, f"There are 194 days between these two dates, you get {days}."
assert "date(" in CODE, "Use date(...) from the datetime module."
```
