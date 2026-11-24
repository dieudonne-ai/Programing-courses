---
id: pandas
title: Pandas, your spreadsheet in Python
subtitle: Load, explore and understand a data file.
duration: 15
---
## The DataFrame

**Pandas** is THE data analysis library in Python. Its main object, the **DataFrame**, is a table with named rows and columns. Like an Excel sheet, but driven by code.

```py
import pandas as pd

df = pd.DataFrame({
    "product": ["Espresso", "Croissant", "Sandwich"],
    "price": [2.5, 1.8, 5.0],
    "stock": [120, 40, 15],
})
df
```

Notice: no `print` here. When the **last line** of a block is a value, it's displayed automatically, and pandas shows it as a nice table. That's how Jupyter notebooks work, the analysts' favourite tool.

+++

## Loading a real file

In practice, you don't type data in: you **load** it. `pd.read_csv` reads a CSV file and creates a DataFrame. Here are the 2024 sales of a coffee shop chain present in five cities.

```py
import pandas as pd

sales = pd.read_csv("sales.csv")
sales.head()
```

`head()` shows the first 5 rows (`head(10)` for 10). `tail()` shows the last ones. They're the first things you look at with a new file.

+++

## The first questions to ask

With a new dataset, an analyst always checks:

```py
import pandas as pd
sales = pd.read_csv("sales.csv")

print("Shape:", sales.shape)            # (rows, columns)
print("Columns:", list(sales.columns))
print()
print(sales.dtypes)                     # type of each column
```

`shape` gives the number of rows and columns. `dtypes` gives each column's type: `int64` (integers), `float64` (decimals), `object` (text).

```py
import pandas as pd
sales = pd.read_csv("sales.csv")
sales.info()
```

`info()` sums everything up: number of rows, columns, types, and the number of **non-missing** values per column.

+++

## A column = a Series

You get a column with square brackets and its name. It's a **Series**: a NumPy array with labels. Everything you know about NumPy applies.

```py
import pandas as pd
sales = pd.read_csv("sales.csv")

q = sales["quantity"]
print("Total sold:", q.sum())
print("Average per sale:", round(q.mean(), 2))
print("Biggest sale:", q.max())
```

And `describe()` calculates the main statistics of every numeric column at once:

```py
import pandas as pd
sales = pd.read_csv("sales.csv")
sales.describe()
```

+++

## Counting values

For a text column, the natural question is: how many times does each value appear? That's what `value_counts()` is for.

```py
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["city"].value_counts()
```

```py
import pandas as pd
sales = pd.read_csv("sales.csv")
print("Different products:", sales["product"].nunique())
sales["product"].value_counts(normalize=True).round(3)
```

`nunique()` counts the distinct values. `normalize=True` gives proportions rather than counts.

```quiz
You receive a new data file. Which instruction shows its first rows?
- `df.shape`
* `df.head()`
- `df.describe()`
> `head()` shows the first rows. `shape` gives the dimensions, `describe()` the statistics.
```

+++

## Exercise: the students

```exercise
@title First exploration
@prompt
Load the file `students.csv` into a DataFrame named `df`. Then calculate:

- `n_students`: the number of rows;
- `python_mean`: the mean of the `python_grade` column, rounded to 2 decimal places;
- `top_city`: the city with the most students (tip: `value_counts()` sorts from largest to smallest, and `.index[0]` gives the first label).
@starter
import pandas as pd

df = 

n_students = 
python_mean = 
top_city = 

print(n_students, python_mean, top_city)
@solution
import pandas as pd

df = pd.read_csv("students.csv")

n_students = len(df)
python_mean = round(df["python_grade"].mean(), 2)
top_city = df["city"].value_counts().index[0]

print(n_students, python_mean, top_city)
@hint
pd.read_csv("students.csv"); len(df) or df.shape[0]; round(df["python_grade"].mean(), 2)
@check
import pandas as _pd
_ref = _pd.read_csv("students.csv")
assert isinstance(df, _pd.DataFrame), "df must be a DataFrame created with pd.read_csv(\"students.csv\")."
assert n_students == len(_ref), f"There are {len(_ref)} students, you count {n_students}."
assert python_mean == round(_ref["python_grade"].mean(), 2), f"The expected mean is {round(_ref['python_grade'].mean(), 2)}."
assert top_city == _ref["city"].value_counts().index[0], f"The most represented city is {_ref['city'].value_counts().index[0]}."
```
