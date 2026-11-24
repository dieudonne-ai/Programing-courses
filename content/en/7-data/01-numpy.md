---
id: numpy
title: NumPy, calculating on arrays
subtitle: A calculation on a million numbers, in one line.
duration: 14
---
## Welcome to data

You now know the basics of Python. Time for the data analyst's tools. The first one is called **NumPy** (*Numerical Python*). Almost every data library is built on it, pandas included.

Its central object: the **array**, a sort of ultra-fast list of numbers.

```py
import numpy as np

prices = np.array([2.5, 3.5, 2.0, 2.2, 1.8])
print(prices)
print(type(prices))
```

```info
The first time, loading NumPy takes a few seconds. After that, it's instant.
```

+++

## Calculating on the whole array at once

With a list, raising every price by 10% needed a loop. With NumPy, the operation applies **to every item automatically**:

```py
import numpy as np

prices = np.array([2.5, 3.5, 2.0, 2.2, 1.8])
quantities = np.array([10, 4, 7, 12, 20])

print(prices * 1.1)
print(prices * quantities)
print("Revenue:", (prices * quantities).sum())
```

`prices * quantities` multiplies the items **pair by pair**: the first price by the first quantity, and so on. This is called **vectorization**. It's shorter to write, and hundreds of times faster on large volumes.

```py
import numpy as np

numbers = list(range(1000000))
array = np.arange(1000000)
print(sum(x * 2 for x in numbers))
print((array * 2).sum())
```

+++

## Statistics in one line

```py
import numpy as np

grades = np.array([12, 15, 9, 17, 14, 11, 16, 8, 13, 18])
print("Mean:", grades.mean())
print("Median:", np.median(grades))
print("Standard deviation:", round(grades.std(), 2))
print("Min / max:", grades.min(), grades.max())
```

- The **mean** is the sum divided by the number of values.
- The **median** is the middle value once sorted: half the values are below, half above. It resists extreme values better.
- The **standard deviation** measures spread: small, the values are close to the mean; large, they are spread out.

```quiz
In a company, 9 employees earn 400,000 francs a month and the director earns 8,000,000. Which indicator best describes the "typical" salary?
- The mean
* The median
- The maximum
> The mean (1,160,000) is pulled up by one extreme salary. The median (400,000) reflects the situation of the majority well. An essential analyst reflex!
```

+++

## Filtering with a mask

A comparison on an array gives an array of `True` / `False`, called a **mask**. You put it between square brackets to **filter**.

```py
import numpy as np

temperatures = np.array([28, 31, 35, 30, 27, 33, 36])
mask = temperatures > 32
print(mask)
print(temperatures[mask])
print("Hot days:", mask.sum())
```

`mask.sum()` counts the `True`s (each `True` counts as 1). This filtering technique is **exactly** the one pandas uses. Remember it well.

+++

## Exercise: converting prices

```exercise
@title Prices in CFA francs
@prompt
The array `prices_eur` holds prices in euros. Without a loop, create:

- `prices_cfa`: the prices converted into CFA francs (1 euro = 655.957 francs), rounded to the unit with `np.round`;
- `expensive`: the number of prices above 2000 CFA francs.
@starter
import numpy as np

prices_eur = np.array([2.5, 3.5, 2.0, 2.2, 1.8, 1.0, 5.0])

prices_cfa = 
expensive = 
print(prices_cfa)
print(expensive)
@solution
import numpy as np

prices_eur = np.array([2.5, 3.5, 2.0, 2.2, 1.8, 1.0, 5.0])

prices_cfa = np.round(prices_eur * 655.957)
expensive = (prices_cfa > 2000).sum()
print(prices_cfa)
print(expensive)
@hint
np.round(prices_eur * 655.957), then (prices_cfa > 2000).sum()
@check
import numpy as _np
assert "for" not in CODE, "No loop: let NumPy calculate on the whole array."
expected = _np.round(_np.array([2.5, 3.5, 2.0, 2.2, 1.8, 1.0, 5.0]) * 655.957)
assert _np.allclose(prices_cfa, expected), f"Expected prices_cfa: {expected}"
assert int(expensive) == 2, f"There are 2 prices above 2000 CFA francs, you count {expensive}."
```
