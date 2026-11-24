---
id: projet-final
title: Final project, the Baobab Café report
subtitle: You are the analyst. Management is waiting for your answers.
duration: 25
---
## Your mission

The **Baobab Café** runs five cafés: Kinshasa, Abidjan, Dakar, Paris and Montreal. The director is preparing the 2025 budget and hands you the 2024 sales file, `sales.csv`. She has four questions:

1. What is the total **revenue** for the year?
2. Which **city** brings in the most?
3. Are some **seasons** stronger than others?
4. Does **bissap juice**, a new product, behave differently?

You'll follow the analyst's method from chapter 1: question, data, cleaning, analysis, visualization, decision. Each step is an exercise. You can use the cheat sheet (top menu) at any time.

+++

## Step 1: preparing the data

```exercise
@title Preparing the table
@prompt
Load `sales.csv` into `sales`, then add three columns:

- `date` converted into a real date with `pd.to_datetime`;
- `month`: the month number (1 to 12), extracted from the date;
- `total`: the amount of each sale (quantity × unit price).

Finally, calculate `total_revenue`, the year's revenue, rounded to the nearest euro.
@starter
import pandas as pd

sales = pd.read_csv("sales.csv")

total_revenue = 
print(f"2024 revenue: {total_revenue} euros")
@solution
import pandas as pd

sales = pd.read_csv("sales.csv")
sales["date"] = pd.to_datetime(sales["date"])
sales["month"] = sales["date"].dt.month
sales["total"] = sales["quantity"] * sales["unit_price"]

total_revenue = round(sales["total"].sum())
print(f"2024 revenue: {total_revenue} euros")
@hint
pd.to_datetime(sales["date"]); sales["date"].dt.month; sales["quantity"] * sales["unit_price"]; round(sales["total"].sum())
@check
import pandas as _pd
_v = _pd.read_csv("sales.csv")
_v["total"] = _v["quantity"] * _v["unit_price"]
for col in ("month", "total"):
    assert col in sales.columns, f"The {col} column is missing."
assert str(sales["date"].dtype).startswith("datetime"), "The date column must be converted with pd.to_datetime."
assert sales["month"].min() == 1 and sales["month"].max() == 12, "The month column must contain month numbers (1 to 12)."
assert total_revenue == round(_v["total"].sum()), f"The expected revenue is {round(_v['total'].sum())} euros."
```

+++

## Step 2: the cities

```exercise
@title Ranking the cities
@prompt
Calculate `revenue_by_city`: the revenue per city, sorted from largest to smallest. Then calculate `top_share`: the **share** (in %) of the first city in the total revenue, rounded to 1 decimal place.

The step 1 code is already there so this exercise works on its own.
@starter
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["total"] = sales["quantity"] * sales["unit_price"]

revenue_by_city = 
top_share = 
print(revenue_by_city.round(0))
print(f"The first city makes up {top_share}% of sales")
@solution
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["total"] = sales["quantity"] * sales["unit_price"]

revenue_by_city = sales.groupby("city")["total"].sum().sort_values(ascending=False)
top_share = round(revenue_by_city.iloc[0] / revenue_by_city.sum() * 100, 1)
print(revenue_by_city.round(0))
print(f"The first city makes up {top_share}% of sales")
@hint
A groupby("city") on total, sorted. The share: revenue_by_city.iloc[0] / revenue_by_city.sum() * 100
@check
import pandas as _pd
_v = _pd.read_csv("sales.csv")
_v["total"] = _v["quantity"] * _v["unit_price"]
_c = _v.groupby("city")["total"].sum().sort_values(ascending=False)
assert list(revenue_by_city.index) == list(_c.index), "revenue_by_city must be sorted from largest to smallest."
assert top_share == round(_c.iloc[0] / _c.sum() * 100, 1), f"The expected share is {round(_c.iloc[0] / _c.sum() * 100, 1)}%."
```

+++

## Step 3: the seasons

```exercise
@title The year's curve
@prompt
Plot the **line** of revenue per **month** (1 to 12), with a title. Also store in `best_month` the number of the month that brings in the most.
@starter
import pandas as pd
import matplotlib.pyplot as plt
sales = pd.read_csv("sales.csv")
sales["date"] = pd.to_datetime(sales["date"])
sales["month"] = sales["date"].dt.month
sales["total"] = sales["quantity"] * sales["unit_price"]

revenue_by_month = 
best_month = 

plt.show()
print("Best month:", best_month)
@solution
import pandas as pd
import matplotlib.pyplot as plt
sales = pd.read_csv("sales.csv")
sales["date"] = pd.to_datetime(sales["date"])
sales["month"] = sales["date"].dt.month
sales["total"] = sales["quantity"] * sales["unit_price"]

revenue_by_month = sales.groupby("month")["total"].sum()
best_month = revenue_by_month.idxmax()

plt.plot(revenue_by_month.index, revenue_by_month.values, marker="o", color="#2347B8")
plt.title("Revenue per month, 2024")
plt.xlabel("Month")
plt.ylabel("Euros")
plt.xticks(range(1, 13))
plt.show()
print("Best month:", best_month)
@hint
revenue_by_month = sales.groupby("month")["total"].sum(); best_month = revenue_by_month.idxmax() (the label of the largest value); plt.plot(revenue_by_month.index, revenue_by_month.values)
@check
import pandas as _pd
import matplotlib.pyplot as _plt
_v = _pd.read_csv("sales.csv")
_v["month"] = _pd.to_datetime(_v["date"]).dt.month
_v["total"] = _v["quantity"] * _v["unit_price"]
_m = _v.groupby("month")["total"].sum()
assert int(best_month) == int(_m.idxmax()), f"The best month is month {_m.idxmax()}."
assert _plt.get_fignums(), "Plot the line with plt.plot(...)."
_ax = _plt.gcf().axes[0]
assert _ax.get_lines() and len(_ax.get_lines()[0].get_xdata()) == 12, "The line must have 12 points, one per month."
assert _ax.get_title().strip(), "Add a title to your chart."
```

What do you see? The summer months (June to August) and December stand out. One hypothesis: holidays and end-of-year celebrations. For the director, that's concrete information: **plan more staff and stock** for those periods.

+++

## Step 4: the bissap case

```exercise
@title Bissap juice
@prompt
Does bissap juice sell differently depending on the season?

Calculate `bissap_by_month`: the **quantity** of Bissap juice sold per month, then `ratio`: the average quantity per month **from March to September** (months 3 to 9) divided by the average quantity per month **in the other months**, rounded to 2 decimal places.
@starter
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["month"] = pd.to_datetime(sales["date"]).dt.month

bissap = sales[sales["product"] == "Bissap juice"]
bissap_by_month = 

season = bissap_by_month[(bissap_by_month.index >= 3) & (bissap_by_month.index <= 9)]
off_season = 
ratio = 
print(bissap_by_month)
print("Hot season / rest of the year ratio:", ratio)
@solution
import pandas as pd
sales = pd.read_csv("sales.csv")
sales["month"] = pd.to_datetime(sales["date"]).dt.month

bissap = sales[sales["product"] == "Bissap juice"]
bissap_by_month = bissap.groupby("month")["quantity"].sum()

season = bissap_by_month[(bissap_by_month.index >= 3) & (bissap_by_month.index <= 9)]
off_season = bissap_by_month[(bissap_by_month.index < 3) | (bissap_by_month.index > 9)]
ratio = round(season.mean() / off_season.mean(), 2)
print(bissap_by_month)
print("Hot season / rest of the year ratio:", ratio)
@hint
bissap.groupby("month")["quantity"].sum(). For the other months: index < 3 OR index > 9 (with |). The ratio: season.mean() / off_season.mean()
@check
import pandas as _pd
_v = _pd.read_csv("sales.csv")
_v["month"] = _pd.to_datetime(_v["date"]).dt.month
_b = _v[_v["product"] == "Bissap juice"].groupby("month")["quantity"].sum()
_s = _b[(_b.index >= 3) & (_b.index <= 9)]
_h = _b[(_b.index < 3) | (_b.index > 9)]
assert bissap_by_month.to_dict() == _b.to_dict(), "bissap_by_month must give the sum of bissap quantities for each month."
assert ratio == round(_s.mean() / _h.mean(), 2), f"The expected ratio is {round(_s.mean() / _h.mean(), 2)}."
```

A ratio well above 1 confirms the intuition: bissap is a **hot-season drink**. A possible recommendation: promote it in spring and summer, and reduce stock in winter to avoid waste.

+++

## Step 5: the report

An analyst doesn't stop at the numbers: they **tell** what they mean. Here's a model conclusion you could send to the director.

```note
Dear Director,
1. Kinshasa is our leading city, well ahead of Dakar and Abidjan: a quarter of our revenue.
2. Sales peak in summer and in December: let's strengthen staff and stock for those periods.
3. Bissap juice sells far more from March to September: let's promote it during the hot season.
```

Run this last block: it produces the complete dashboard in a single figure. Edit it, add whatever you find useful. It's your report.

```py
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("sales.csv")
sales["date"] = pd.to_datetime(sales["date"])
sales["month"] = sales["date"].dt.month
sales["total"] = sales["quantity"] * sales["unit_price"]

fig, axes = plt.subplots(1, 2, figsize=(11, 4))
sales.groupby("city")["total"].sum().sort_values().plot(kind="barh", ax=axes[0], color="#2347B8", title="Revenue by city")
sales.groupby("month")["total"].sum().plot(ax=axes[1], marker="o", color="#C92E50", title="Revenue by month")
plt.tight_layout()
plt.show()
```

+++

## What's next?

Congratulations. You've travelled the whole road: understanding what programming is, learning Python, then analyzing real data all the way to concrete recommendations.

To keep going:

- **Install Python on your computer.** The simplest option for data: install **Anaconda** (which includes Python, pandas and Jupyter), or Python plus the **VS Code** editor.
- **Work in Jupyter notebooks.** It's the analysts' standard tool, and it works exactly like the code blocks in this course.
- **Analyze data you care about.** The Kaggle website offers thousands of free datasets: football, music, health, climate… Pick a topic you love and ask it questions.
- **Learn SQL**, the language of databases, often asked for alongside Python in data analyst job offers.
- **Come back to the playground** on this site whenever you want to try an idea.

```note
One last piece of advice: code a little every day. Ten minutes a day beats three hours once a month.
Your certificate is waiting. Well done!
```
