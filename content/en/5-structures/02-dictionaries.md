---
id: dictionnaires
title: Dictionaries
subtitle: Linking a key to a value, like a real dictionary.
duration: 15
---
## Look up by name, not by position

In a list, you find an item by its **position**. But to describe a product, you'd rather find each piece of information by its **name**: the price, the stock, the category…

A **dictionary** (`dict`) links **keys** to **values**, between curly braces:

```py
product = {
    "name": "Bissap juice",
    "price": 2.2,
    "stock": 48,
    "category": "Drink",
}
print(product["name"])
print(product["price"] * 3)
```

Like in a real dictionary: you look up a word (the key) to find its definition (the value).

+++

## Change, add, check

```py
product = {"name": "Croissant", "price": 1.8, "stock": 30}

product["stock"] = product["stock"] - 5   # change
product["organic"] = True                 # add a key
print(product)

print("price" in product)                 # does the key exist?
print(product.get("colour", "unknown"))   # default value if missing
```

Asking for a key that doesn't exist with square brackets causes a `KeyError`. The `.get(key, default)` method avoids the error.

```py
product = {"name": "Croissant", "price": 1.8}
print(product["Price"])
```

Capital letter! `"Price"` and `"price"` are two different keys.

+++

## Looping over a dictionary

```py
stock = {"Espresso": 120, "Cappuccino": 80, "Mint tea": 45}

for product in stock:
    print(product)

for product, quantity in stock.items():
    print(f"{product}: {quantity} units")

print(list(stock.keys()))
print(sum(stock.values()))
```

`.items()` gives the (key, value) pairs: it's the handiest way to loop over a dictionary.

+++

## Counting with a dictionary

A very common use: counting how many times each item appears. That's exactly what an analyst does when counting sales per city.

```py
sales = ["Dakar", "Paris", "Dakar", "Kinshasa", "Dakar", "Paris"]
count = {}
for city in sales:
    if city in count:
        count[city] += 1
    else:
        count[city] = 1
print(count)
```

+++

## A list of dictionaries = a table

Here's the idea that links to data analysis. A **list of dictionaries** looks exactly like a spreadsheet: each dictionary is a **row**, each key a **column**.

```py
students = [
    {"name": "Awa", "city": "Dakar", "grade": 15},
    {"name": "Kofi", "city": "Abidjan", "grade": 12},
    {"name": "Gloire", "city": "Kinshasa", "grade": 17},
]

for s in students:
    print(f"{s['name']:<8} {s['city']:<10} {s['grade']}")

average = sum(s["grade"] for s in students) / len(students)
print("Average:", round(average, 2))
```

| name | city | grade |
|---|---|---|
| Awa | Dakar | 15 |
| Kofi | Abidjan | 12 |
| Gloire | Kinshasa | 17 |

In the last chapter, the **pandas** library will handle tables like this with thousands of rows, in a single instruction.

```tip
In an f-string, `{s['name']:<8}` left-aligns the text on 8 characters. Handy for displaying tidy tables. Notice the single quotes inside the double quotes.
```

+++

## Exercise: the stock

```exercise
@title Stock management
@prompt
The dictionary `stock` gives the quantities in store. Today:

1. we sold **12 croissants** (decrease the stock);
2. we received a new product: **`"Sandwich"`** with **20** units (add it);
3. calculate `total`: the total number of units in stock (all products together).
@starter
stock = {"Croissant": 40, "Doughnut": 25, "Espresso": 100}

total = 
print(stock)
print(total)
@solution
stock = {"Croissant": 40, "Doughnut": 25, "Espresso": 100}
stock["Croissant"] -= 12
stock["Sandwich"] = 20

total = sum(stock.values())
print(stock)
print(total)
@hint
stock["Croissant"] -= 12, then stock["Sandwich"] = 20, and finally sum(stock.values()).
@check
assert stock.get("Croissant") == 28, f"There should be 28 croissants left, there are {stock.get('Croissant')}."
assert stock.get("Sandwich") == 20, "Add the key \"Sandwich\" with the value 20 (mind the capital letter)."
assert total == 173, f"The total should be 28 + 25 + 100 + 20 = 173, you get {total}."
```

+++

## Exercise: the revenue

```exercise
@title Today's orders
@prompt
The list `orders` holds today's orders (one per dictionary). Calculate:

- `revenue`: the sum of `quantity × price` for all orders;
- `by_city`: a dictionary giving the number of orders per city, for example `{"Dakar": 2, ...}`.
@starter
orders = [
    {"city": "Dakar", "quantity": 3, "price": 2.5},
    {"city": "Paris", "quantity": 1, "price": 5.0},
    {"city": "Dakar", "quantity": 2, "price": 1.8},
    {"city": "Kinshasa", "quantity": 6, "price": 1.0},
    {"city": "Paris", "quantity": 2, "price": 3.5},
]

revenue = 0
by_city = {}

print(revenue)
print(by_city)
@solution
orders = [
    {"city": "Dakar", "quantity": 3, "price": 2.5},
    {"city": "Paris", "quantity": 1, "price": 5.0},
    {"city": "Dakar", "quantity": 2, "price": 1.8},
    {"city": "Kinshasa", "quantity": 6, "price": 1.0},
    {"city": "Paris", "quantity": 2, "price": 3.5},
]

revenue = 0
by_city = {}
for o in orders:
    revenue += o["quantity"] * o["price"]
    if o["city"] in by_city:
        by_city[o["city"]] += 1
    else:
        by_city[o["city"]] = 1

print(revenue)
print(by_city)
@hint
A single for o in orders loop is enough. Inside: revenue += o["quantity"] * o["price"], then the counter pattern with the dictionary.
@check
assert abs(revenue - 29.1) < 1e-6, f"The revenue should be 29.1, you get {revenue}."
assert by_city == {"Dakar": 2, "Paris": 2, "Kinshasa": 1}, f"by_city should be {{'Dakar': 2, 'Paris': 2, 'Kinshasa': 1}}, you get {by_city}."
```
