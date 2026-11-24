## Display and comment

```python
print("Hello")               # displays text
print("Total:", 3 * 4)       # several items separated by commas
# This is a comment: Python ignores it
```

## Variables and types

```python
first_name = "Awa"   # str   (text)
age = 24             # int   (integer)
height = 1.68        # float (decimal number)
registered = True    # bool  (True or False)
print(type(age))     # <class 'int'>
age = age + 1        # or: age += 1
```

Conversions: `int("12")`, `float("3.5")`, `str(12)`. The `input()` function always returns text.

## Calculations

```python
7 + 2, 7 - 2, 7 * 2   # 9, 5, 14
7 / 2                 # 3.5  division
7 // 2                # 3    integer division
7 % 2                 # 1    remainder (modulo)
2 ** 10               # 1024 power
round(3.14159, 2)     # 3.14
```

## Text

```python
name = "  aWa diallo "
name.strip().title()      # "Awa Diallo"
name.upper(), name.lower()
"café".replace("é", "e")
len("Python")             # 6
"Python"[0], "Python"[-1] # "P", "n"
"Python"[0:3]             # "Pyt"
f"{first_name} is {age}"  # f-string
f"{3.14159:.2f}"          # "3.14"
```

## Comparisons and logic

```python
==  !=  <  >  <=  >=      # comparisons
age >= 18 and registered  # and
age < 12 or age > 65      # or
not registered            # not
```

## Conditions

```python
if grade >= 16:
    print("Excellent")
elif grade >= 10:
    print("Pass")
else:
    print("Fail")
```

## Loops

```python
for i in range(1, 6):      # 1, 2, 3, 4, 5
    print(i)

total = 0
for x in [3, 8, 2]:
    total += x

while balance < goal:
    balance += 1000

# break: leave the loop; continue: skip to the next lap
```

## Lists

```python
grades = [12, 15, 9]
grades.append(17)         # add
grades[0]                 # first item
grades[-1]                # last
len(grades), sum(grades), min(grades), max(grades)
sorted(grades, reverse=True)
[g * 2 for g in grades if g >= 10]   # comprehension
for rank, g in enumerate(grades, start=1): ...
for a, b in zip(list1, list2): ...
```

## Dictionaries, tuples, sets

```python
product = {"name": "Croissant", "price": 1.8}
product["price"]                # 1.8
product["stock"] = 30           # add / change
product.get("colour", "?")      # default value
for key, value in product.items(): ...

point = (4.3, 15.3)             # tuple (can't be changed)
lat, lon = point                # unpacking
cities = set(["Dakar", "Dakar", "Paris"])   # {"Dakar", "Paris"}
```

## Functions

```python
def price_with_tax(price, rate=0.18):
    """Returns the price including tax."""
    return price * (1 + rate)

price_with_tax(1000)            # 1180.0
price_with_tax(1000, rate=0.2)  # 1200.0
sorted(students, key=lambda s: s["grade"])
```

## Modules, files, errors

```python
import math
from datetime import date
import random

with open("groceries.txt", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

try:
    n = int("abc")
except ValueError:
    n = 0
```

## NumPy

```python
import numpy as np
a = np.array([2.5, 3.5, 2.0])
a * 2, a.sum(), a.mean(), a.std()
a[a > 2.2]                # filter with a mask
```

## Pandas: load and explore

```python
import pandas as pd
df = pd.read_csv("sales.csv")
df.head(), df.shape, df.columns, df.dtypes
df.info()
df.describe()
df["city"].value_counts()
df["city"].nunique()
```

## Pandas: select and sort

```python
df["quantity"]                          # one column
df[["city", "quantity"]]                # several columns
df[df["city"] == "Dakar"]               # filter
df[(df["quantity"] > 10) & (df["city"] == "Paris")]
df[df["city"].isin(["Dakar", "Abidjan"])]
df.sort_values("quantity", ascending=False)
df.loc[df["quantity"] > 10, ["date", "city"]]
```

## Pandas: clean and transform

```python
df.isna().sum()                         # missing values
df.dropna(subset=["spending"])
df["age"].fillna(df["age"].median())
df.drop_duplicates()
df["city"].str.strip().str.title()
df["date"] = pd.to_datetime(df["date"])
df["month"] = df["date"].dt.month
df["total"] = df["quantity"] * df["unit_price"]
```

## Pandas: group

```python
df.groupby("city")["total"].sum()
df.groupby("city")["total"].sum().sort_values(ascending=False)
df.groupby("city").agg(n=("total", "count"), revenue=("total", "sum"))
pd.pivot_table(df, values="total", index="city", columns="category", aggfunc="sum")
```

## Charts

```python
import matplotlib.pyplot as plt
plt.plot(x, y, marker="o")       # line (change over time)
plt.bar(categories, values)      # bars (comparison)
plt.barh(categories, values)     # horizontal bars
plt.hist(values, bins=10)        # histogram (distribution)
plt.scatter(x, y)                # scatter plot (relationship)
plt.title("Title"); plt.xlabel("x"); plt.ylabel("y")
plt.show()

series.plot(kind="bar", title="Title")   # pandas shortcut
```
