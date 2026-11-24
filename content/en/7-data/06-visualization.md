---
id: visualisation
title: Visualizing with Matplotlib
subtitle: A good chart beats a long table.
duration: 16
---
## Why visualize?

A table of numbers takes effort. A chart is understood in a second. **Matplotlib** is Python's reference charting library.

```py
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
sales = [120, 135, 160, 158, 190, 240]

plt.plot(months, sales, marker="o")
plt.title("First-half sales")
plt.xlabel("Month")
plt.ylabel("Number of sales")
plt.show()
```

The recipe is always the same: create the chart (`plt.plot`, `plt.bar`…), add a **title** and **axis labels**, then `plt.show()`.

+++

## Choosing the right chart

| Question | Chart | Function |
|---|---|---|
| How does it change over time? | line | `plt.plot` |
| How do categories compare? | bars | `plt.bar` / `plt.barh` |
| How are values distributed? | histogram | `plt.hist` |
| Are two variables related? | scatter plot | `plt.scatter` |

```py
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("sales.csv")
sales["total"] = sales["quantity"] * sales["unit_price"]
by_city = sales.groupby("city")["total"].sum().sort_values()

plt.barh(by_city.index, by_city.values, color="#2347B8")
plt.title("2024 revenue by city (euros)")
plt.show()
```

**Sorted horizontal** bars: the leading city jumps out, and the names are readable without tilting your head.

+++

## Distribution: the histogram

A histogram splits the values into intervals and counts how many fall into each.

```py
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("students.csv")
plt.hist(df["python_grade"], bins=8, color="#C92E50", edgecolor="white")
plt.title("Distribution of Python grades")
plt.xlabel("Grade out of 20")
plt.ylabel("Number of students")
plt.show()
```

+++

## Relationships: the scatter plot

Do students who work more get better grades? Each dot is a student.

```py
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("students.csv")
plt.scatter(df["study_hours"], df["python_grade"], color="#2347B8")
plt.title("Study hours and Python grade")
plt.xlabel("Study hours per week")
plt.ylabel("Grade out of 20")
plt.grid(alpha=0.3)
plt.show()

print("Correlation:", round(df["study_hours"].corr(df["python_grade"]), 2))
```

The dots go up to the right: more hours, better grade. **Correlation** measures this link between -1 and 1; close to 1, the link is strong and positive. Compare with `math_grade`: is there a link?

```warn
Correlation is not causation. Two things that vary together aren't necessarily cause and effect. Here it's plausible, but always stay careful with your conclusions.
```

+++

## The pandas shortcut

pandas Series and DataFrames have a `.plot()` method that calls Matplotlib for you:

```py
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("sales.csv")
sales["date"] = pd.to_datetime(sales["date"])
sales["month"] = sales["date"].dt.month
sales.groupby("month")["quantity"].sum().plot(kind="line", marker="o", title="Items sold per month")
plt.show()
```

`kind` can be `"line"`, `"bar"`, `"barh"`, `"hist"`, `"pie"`…

```quiz
You want to show how an app's number of users changed over 12 months. Which chart do you choose?
* A line chart
- A histogram
- A scatter plot
> For a change over time, the line is the natural choice: the eye follows the trend from left to right.
```

+++

## Exercise: your first chart

```exercise
@title Sales by category
@prompt
Create a **bar chart** (`plt.bar`) showing the **number of items sold** (sum of `quantity`) for each `category` in `sales.csv`.

Add a title with `plt.title(...)`.
@starter
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("sales.csv")
by_category = 

plt.show()
@solution
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("sales.csv")
by_category = sales.groupby("category")["quantity"].sum()

plt.bar(by_category.index, by_category.values, color="#2347B8")
plt.title("Items sold by category")
plt.ylabel("Quantity")
plt.show()
@hint
by_category = sales.groupby("category")["quantity"].sum(), then plt.bar(by_category.index, by_category.values)
@check
import matplotlib.pyplot as _plt
import pandas as _pd
assert _plt.get_fignums(), "No chart was created. Use plt.bar(...)."
_ax = _plt.gcf().axes[0]
_bars = [p for p in _ax.patches]
assert len(_bars) == 3, f"There are 3 categories, so 3 bars are expected. Your chart has {len(_bars)}."
_v = _pd.read_csv("sales.csv").groupby("category")["quantity"].sum()
assert sorted(round(b.get_height()) for b in _bars) == sorted(int(x) for x in _v.values), "The bar heights must be the sum of quantities per category."
assert _ax.get_title().strip(), "Add a title with plt.title(\"...\")."
```
