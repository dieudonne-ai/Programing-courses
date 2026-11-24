---
id: selection
title: Selecting, filtering, sorting
subtitle: Ask your data precise questions.
duration: 15
---
## Choosing columns

One column: single square brackets. Several columns: a **list** of names inside the brackets (hence the double brackets).

```py
import pandas as pd
sales = pd.read_csv("sales.csv")

sales[["date", "city", "product"]].head()
```

+++

## Filtering rows

This is the **mask** technique seen with NumPy. The comparison gives a Series of `True` / `False`, and you put it between brackets to keep the `True` rows.

```py
import pandas as pd
sales = pd.read_csv("sales.csv")

in_dakar = sales[sales["city"] == "Dakar"]
print(len(in_dakar), "sales in Dakar")
in_dakar.head()
```

Read it like a sentence: "the sales **where** the city **is equal to** Dakar".

```py
import pandas as pd
sales = pd.read_csv("sales.csv")

big = sales[sales["quantity"] >= 15]
big.head()
```

+++

## Several conditions

To combine conditions, pandas uses `&` (and), `|` (or) and `~` (not), **with parentheses around each condition**.

```py
import pandas as pd
sales = pd.read_csv("sales.csv")

f = (sales["city"] == "Kinshasa") & (sales["category"] == "Pastry")
sales[f].head()
```

```warn
In pandas, you don't use `and` / `or` but `&` / `|`. And the parentheses around each condition are mandatory. Forgetting either is the most common beginner mistake.
```

To test membership in a list of values, `isin` is much handier than a chain of `|`:

```py
import pandas as pd
sales = pd.read_csv("sales.csv")

africa = sales[sales["city"].isin(["Kinshasa", "Abidjan", "Dakar"])]
print(len(africa), "sales in Africa out of", len(sales))
```

+++

## Sorting

`sort_values` sorts by one or more columns. By default, from smallest to largest; `ascending=False` reverses the order.

```py
import pandas as pd
sales = pd.read_csv("sales.csv")

sales.sort_values("quantity", ascending=False).head(5)
```

```py
import pandas as pd
sales = pd.read_csv("sales.csv")

sales.sort_values(["city", "quantity"], ascending=[True, False]).head(8)
```

`nlargest(n, column)` is a shortcut for "the n largest values".

+++

## loc: rows and columns at the same time

`df.loc[rows, columns]` selects rows (often with a filter) **and** columns in one go:

```py
import pandas as pd
sales = pd.read_csv("sales.csv")

sales.loc[sales["product"] == "Bissap juice", ["date", "city", "quantity"]].head()
```

`iloc` does the same with numeric **positions**: `sales.iloc[0:3, 0:2]` gives the first 3 rows and the first 2 columns.

```quiz
Which line selects the Paris sales of more than 10 items?
- `sales[sales["city"] == "Paris" and sales["quantity"] > 10]`
* `sales[(sales["city"] == "Paris") & (sales["quantity"] > 10)]`
- `sales["Paris", "quantity" > 10]`
> With pandas: `&` instead of `and`, and parentheses around each condition.
```

+++

## Exercises

```exercise
@title The top students
@prompt
From `students.csv`:

1. create `excellent`: the students with **at least 15** in `python_grade`, sorted from best to worst;
2. create `hardworking_abidjan`: the students from **Abidjan** who studied **more than 10 hours** (`study_hours > 10`).
@starter
import pandas as pd
df = pd.read_csv("students.csv")

excellent = 
hardworking_abidjan = 

excellent
@solution
import pandas as pd
df = pd.read_csv("students.csv")

excellent = df[df["python_grade"] >= 15].sort_values("python_grade", ascending=False)
hardworking_abidjan = df[(df["city"] == "Abidjan") & (df["study_hours"] > 10)]

excellent
@hint
df[df["python_grade"] >= 15].sort_values("python_grade", ascending=False). For the second: two conditions in parentheses, joined with &.
@check
import pandas as _pd
_d = _pd.read_csv("students.csv")
_e = _d[_d["python_grade"] >= 15].sort_values("python_grade", ascending=False)
assert isinstance(excellent, _pd.DataFrame), "excellent must be a filtered DataFrame."
assert list(excellent["name"]) == list(_e["name"]), "excellent must contain the students with python_grade >= 15, from best to worst."
_a = _d[(_d["city"] == "Abidjan") & (_d["study_hours"] > 10)]
assert set(hardworking_abidjan["name"]) == set(_a["name"]) and len(hardworking_abidjan) == len(_a), f"hardworking_abidjan should contain {len(_a)} student(s): {list(_a['name'])}."
```

```exercise
@title The biggest bissap sale
@prompt
In `sales.csv`, find the **Bissap juice** sale with the largest quantity. Store its **date** in `record_date` and its **city** in `record_city`.
@starter
import pandas as pd
sales = pd.read_csv("sales.csv")

bissap = 
best = 
record_date = 
record_city = 
print(record_date, record_city)
@solution
import pandas as pd
sales = pd.read_csv("sales.csv")

bissap = sales[sales["product"] == "Bissap juice"]
best = bissap.sort_values("quantity", ascending=False).iloc[0]
record_date = best["date"]
record_city = best["city"]
print(record_date, record_city)
@hint
Filter the product's rows, sort by quantity in descending order, then .iloc[0] gives the first row. You then read its columns with ["date"] and ["city"].
@check
import pandas as _pd
_v = _pd.read_csv("sales.csv")
_b = _v[_v["product"] == "Bissap juice"]
_max = _b["quantity"].max()
_ok = _b[_b["quantity"] == _max]
assert any((r["date"] == record_date and r["city"] == record_city) for _, r in _ok.iterrows()), f"The biggest bissap sale is {_max} units. Check your date and your city."
```
