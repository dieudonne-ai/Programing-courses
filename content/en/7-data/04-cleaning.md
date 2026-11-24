---
id: nettoyage
title: Cleaning data
subtitle: Missing values, duplicates and typos.
duration: 16
---
## 80% of the work

People often say an analyst spends 80% of their time **cleaning** data. Real files are typed in by humans, and they contain gaps, duplicates and inconsistencies.

Here is `customers.csv`, a shop's customer file. Look closely:

```py
import pandas as pd
customers = pd.read_csv("customers.csv")
customers.head(12)
```

You'll notice `NaN` cells (*Not a Number*): these are **missing values**. And the `city` column looks… odd.

+++

## Spotting missing values

```py
import pandas as pd
customers = pd.read_csv("customers.csv")

print(customers.isna().sum())
print()
print("Complete rows:", len(customers.dropna()), "out of", len(customers))
```

`isna()` returns `True` for each empty cell; `.sum()` counts them per column. Three possible strategies:

- **remove** incomplete rows with `dropna()` (simple, but you lose data);
- **fill** the gaps with `fillna(value)`, for example the column's median;
- **keep** the gaps, if the analysis allows it (most pandas calculations ignore them).

```py
import pandas as pd
customers = pd.read_csv("customers.csv")

median = customers["age"].median()
customers["age"] = customers["age"].fillna(median)
print("Missing ages left:", customers["age"].isna().sum())
```

+++

## Duplicates

The same row entered twice skews every count.

```py
import pandas as pd
customers = pd.read_csv("customers.csv")

print("Duplicates:", customers.duplicated().sum())
customers = customers.drop_duplicates()
print("After cleaning:", len(customers), "rows")
```

+++

## Harmonizing text

How many different cities are there?

```py
import pandas as pd
customers = pd.read_csv("customers.csv")
customers["city"].value_counts()
```

To pandas, `"Kinshasa"`, `" kinshasa"` and `"KINSHASA"` are three different cities! The string methods from chapter 3 apply to a whole column through `.str`:

```py
import pandas as pd
customers = pd.read_csv("customers.csv")

customers["city"] = customers["city"].str.strip().str.title()
customers["city"].value_counts()
```

Five cities, just like in reality.

+++

## The right types

Dates are read as text. `pd.to_datetime` turns them into real dates, which lets you extract the year, the month or the day of the week:

```py
import pandas as pd
customers = pd.read_csv("customers.csv")

customers["signup_date"] = pd.to_datetime(customers["signup_date"])
customers["year"] = customers["signup_date"].dt.year
customers["month"] = customers["signup_date"].dt.month
customers[["signup_date", "year", "month"]].head()
```

You've also just seen how to **create a column**: `df["new"] = ...`. You can put a calculation on other columns in it, just as with NumPy.

```quiz
Which instruction turns `"  dakar "` into `"Dakar"` in the whole `city` column?
- `customers["city"].strip().title()`
* `customers["city"].str.strip().str.title()`
- `customers.title("city")`
> On a pandas column, string methods go through `.str`. Without it, Python looks for a `strip` method on the Series itself, which doesn't exist.
```

+++

## Exercise: the big clean-up

```exercise
@title Cleaning customers.csv
@prompt
Create a DataFrame `clean` from `customers.csv`, applying in this order:

1. removal of duplicates;
2. harmonization of the `city` column (spaces removed, capital letter at the start);
3. replacement of missing ages with the **median** age (calculated after removing duplicates);
4. removal of the rows whose `spending` is missing.

Then display the number of rows and the number of distinct cities.
@starter
import pandas as pd

clean = pd.read_csv("customers.csv")
# 1.
# 2.
# 3.
# 4.

print(len(clean), clean["city"].nunique())
@solution
import pandas as pd

clean = pd.read_csv("customers.csv")
clean = clean.drop_duplicates()
clean["city"] = clean["city"].str.strip().str.title()
clean["age"] = clean["age"].fillna(clean["age"].median())
clean = clean.dropna(subset=["spending"])

print(len(clean), clean["city"].nunique())
@hint
drop_duplicates(); .str.strip().str.title(); fillna(clean["age"].median()); dropna(subset=["spending"]) to look at that column only.
@check
import pandas as _pd
_c = _pd.read_csv("customers.csv").drop_duplicates()
_c["city"] = _c["city"].str.strip().str.title()
_c["age"] = _c["age"].fillna(_c["age"].median())
_c = _c.dropna(subset=["spending"])
assert clean.duplicated().sum() == 0, "There are still duplicates: use drop_duplicates()."
assert clean["city"].nunique() == 5, f"There should be 5 distinct cities left, there are {clean['city'].nunique()}: {sorted(clean['city'].unique())}"
assert clean["age"].isna().sum() == 0, "There are still missing ages: fill them with fillna."
assert clean["spending"].isna().sum() == 0, "There are still missing spending values: remove those rows with dropna(subset=[\"spending\"])."
assert len(clean) == len(_c), f"The cleaned table should have {len(_c)} rows, yours has {len(clean)}."
assert abs(clean["age"].sum() - _c["age"].sum()) < 1e-6, "Missing ages must be replaced by the median calculated after removing duplicates."
```
