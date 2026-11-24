---
id: tuples-ensembles
title: Tuples and sets
subtitle: Two cousins of the list, each with its own superpower.
duration: 10
---
## The tuple: a frozen list

A **tuple** is written between **parentheses**. It looks like a list, but it can't be changed once created. It's used for values that belong together and must not change: GPS coordinates, a date, a colour…

```py
kinshasa = (-4.32, 15.31)
print(kinshasa[0])
print(len(kinshasa))
kinshasa[0] = 0
```

The error is deliberate: a tuple is **immutable**. That guarantee prevents accidental changes.

+++

## Unpacking

The tuple's superpower: you can **unpack** it into several variables at once.

```py
point = (-4.32, 15.31)
latitude, longitude = point
print("Latitude:", latitude)
print("Longitude:", longitude)

# Swap two variables in one line
a, b = 1, 2
a, b = b, a
print(a, b)
```

You've already used unpacking without knowing it: in `for product, quantity in stock.items()`, each pair is an unpacked tuple.

+++

## The set: zero duplicates

A **set** is written between curly braces, without keys. It keeps **only one copy** of each value, and has no order.

```py
customer_cities = ["Dakar", "Paris", "Dakar", "Abidjan", "Paris", "Dakar"]
unique_cities = set(customer_cities)
print(unique_cities)
print("Number of different cities:", len(unique_cities))
```

`len(set(list))` is the classic trick to count **distinct values**. A question an analyst asks every day: how many different customers? How many distinct products sold?

+++

## Set operations

Sets can do the operations of Venn diagrams:

```py
january_customers = {"Awa", "Kofi", "Grace", "Moussa"}
february_customers = {"Grace", "Moussa", "Inès", "David"}

print("Came both months:", january_customers & february_customers)
print("All customers:", january_customers | february_customers)
print("Lost in February:", january_customers - february_customers)
```

```quiz
Which type would you choose to store the **different countries** a website's visitors come from?
- A list
- A tuple
* A set
> A set automatically removes duplicates: each country appears only once.
```

+++

## Summary of structures

| Type | Syntax | Ordered | Changeable | Duplicates |
|---|---|---|---|---|
| list | `[1, 2, 3]` | yes | yes | yes |
| tuple | `(1, 2, 3)` | yes | no | yes |
| set | `{1, 2, 3}` | no | yes | no |
| dictionary | `{"a": 1}` | yes | yes | unique keys |

```exercise
@title Loyal customers
@prompt
Two lists hold the names of a café's customers in May and in June (with duplicates, since a customer can come several times).

Calculate:

- `may_count`: the number of **different** customers in May;
- `loyal`: the **set** of customers who came in May **and** in June.
@starter
may = ["Awa", "Kofi", "Awa", "Inès", "Moussa", "Kofi", "Awa"]
june = ["Inès", "David", "Awa", "Inès", "Rachel"]

may_count = 
loyal = 

print(may_count)
print(loyal)
@solution
may = ["Awa", "Kofi", "Awa", "Inès", "Moussa", "Kofi", "Awa"]
june = ["Inès", "David", "Awa", "Inès", "Rachel"]

may_count = len(set(may))
loyal = set(may) & set(june)

print(may_count)
print(loyal)
@hint
Turn each list into a set with set(...). len() gives the number of items, & gives the intersection.
@check
assert may_count == 4, f"There are 4 different customers in May (Awa, Kofi, Inès, Moussa), you count {may_count}."
assert isinstance(loyal, set), "loyal must be a set."
assert loyal == {"Awa", "Inès"}, f"The customers who came both months are Awa and Inès, you get {loyal}."
```
