---
id: groupby
title: Grouping and summarizing
subtitle: groupby, for questions "by city", "by month", "by product".
duration: 16
---
## The most frequent question

"What is the revenue **by city**?" "How many sales **per month**?" "What's the average grade **per class**?"

All these questions have the same shape: **split** the data into groups, **calculate** something in each group, then **combine** the results. In pandas, that's `groupby`.

Let's start by adding a `total` column (the amount of each sale):

```py
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["total"] = sales["quantity"] * sales["unit_price"]
sales.head()
```

+++

## A first groupby

```py
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["total"] = sales["quantity"] * sales["unit_price"]

sales.groupby("city")["total"].sum()
```

Read it left to right: "in `sales`, **group by** city, take the `total` column, and compute the **sum**". The result is a Series with one value per city.

```html
<div class="flow">
  <div class="flow-step"><b>Split</b><span>One pile of rows per city.</span></div>
  <div class="flow-step"><b>Calculate</b><span>The sum of the totals in each pile.</span></div>
  <div class="flow-step"><b>Combine</b><span>A table: one row per city.</span></div>
</div>
```

You can then sort the result:

```py
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["total"] = sales["quantity"] * sales["unit_price"]

sales.groupby("product")["total"].sum().sort_values(ascending=False).round(2)
```

+++

## Aggregation functions

Instead of `sum()`, you can use any summary function:

| Function | Calculates |
|---|---|
| `sum()` | the sum |
| `mean()` | the mean |
| `median()` | the median |
| `count()` | the number of rows |
| `min()` / `max()` | the minimum / maximum |
| `nunique()` | the number of distinct values |

And `agg` calculates several at once:

```py
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["total"] = sales["quantity"] * sales["unit_price"]

sales.groupby("city").agg(
    n_sales=("total", "count"),
    revenue=("total", "sum"),
    average_basket=("total", "mean"),
).round(2)
```

+++

## Grouping by month

To group over time, first convert the date, then extract the month with `.dt.month`:

```py
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["total"] = sales["quantity"] * sales["unit_price"]
sales["date"] = pd.to_datetime(sales["date"])
sales["month"] = sales["date"].dt.month

sales.groupby("month")["total"].sum().round(0)
```

Look at the numbers: some months sell clearly more. We'll dig into that in the final project.

+++

## Several criteria: the pivot table

You can group by **two** columns at once. `pivot_table` presents the result as a cross table, rows × columns, as in Excel:

```py
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["total"] = sales["quantity"] * sales["unit_price"]

pd.pivot_table(sales, values="total", index="city", columns="category", aggfunc="sum").round(0)
```

```quiz
Which instruction gives the **average quantity** sold for each product?
- `sales.groupby("quantity")["product"].mean()`
* `sales.groupby("product")["quantity"].mean()`
- `sales["product"].mean("quantity")`
> You group by what defines the groups (the product), then pick the column to summarize (the quantity) and the function (the mean).
```

+++

## Exercises

```exercise
@title The star product
@prompt
From `sales.csv`:

1. create the `total` column (quantity × unit price);
2. create `revenue_by_product`: the revenue per product, sorted from largest to smallest;
3. store in `star_product` the name of the product that brings in the most.
@starter
import pandas as pd
sales = pd.read_csv("sales.csv")

revenue_by_product = 
star_product = 
print(star_product)
revenue_by_product
@solution
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["total"] = sales["quantity"] * sales["unit_price"]

revenue_by_product = sales.groupby("product")["total"].sum().sort_values(ascending=False)
star_product = revenue_by_product.index[0]
print(star_product)
revenue_by_product
@hint
sales.groupby("product")["total"].sum().sort_values(ascending=False), then .index[0] for the first name.
@check
import pandas as _pd
_v = _pd.read_csv("sales.csv")
_v["total"] = _v["quantity"] * _v["unit_price"]
_r = _v.groupby("product")["total"].sum().sort_values(ascending=False)
assert "total" in sales.columns, "Create the total column in sales."
assert list(revenue_by_product.index) == list(_r.index), "revenue_by_product must be sorted from largest to smallest revenue."
assert abs(revenue_by_product.iloc[0] - _r.iloc[0]) < 1e-6, "Check the revenue-per-product calculation."
assert star_product == _r.index[0], f"The product that brings in the most is {_r.index[0]}."
```

```exercise
@title Work and success
@prompt
In `students.csv`, we want to know whether study hours matter.

1. create a `group` column equal to `"over 10 h"` if `study_hours > 10`, and `"10 h or less"` otherwise (tip: `np.where(condition, value_if_true, value_if_false)`);
2. create `means`: the mean of `python_grade` per group, rounded to 1 decimal place.
@starter
import pandas as pd
import numpy as np
df = pd.read_csv("students.csv")

df["group"] = 
means = 
means
@solution
import pandas as pd
import numpy as np
df = pd.read_csv("students.csv")

df["group"] = np.where(df["study_hours"] > 10, "over 10 h", "10 h or less")
means = df.groupby("group")["python_grade"].mean().round(1)
means
@hint
np.where(df["study_hours"] > 10, "over 10 h", "10 h or less"), then a groupby("group") on python_grade.
@check
import pandas as _pd, numpy as _np
_d = _pd.read_csv("students.csv")
_d["group"] = _np.where(_d["study_hours"] > 10, "over 10 h", "10 h or less")
_m = _d.groupby("group")["python_grade"].mean().round(1)
assert set(df["group"]) == {"over 10 h", "10 h or less"}, "The group column must contain exactly \"over 10 h\" and \"10 h or less\"."
assert (df["group"] == _d["group"]).all(), "Check the condition: study_hours > 10."
assert means.to_dict() == _m.to_dict(), f"Expected means: {_m.to_dict()}"
```
