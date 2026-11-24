---
id: fichiers
title: Files and error handling
subtitle: Reading data, and not crashing at the first surprise.
duration: 14
---
## Reading a text file

Data often lives in **files**. On this site, a few files are already there for you. Let's read `groceries.txt`, a shopping list:

```py
with open("groceries.txt", encoding="utf-8") as file:
    content = file.read()
print(content)
```

- `open(name)` opens the file;
- `with ... as file:` guarantees the file will be **closed** properly at the end of the block;
- `.read()` reads the whole content at once, as text.

+++

## Line by line

Often, we process a file **line by line**:

```py
with open("groceries.txt", encoding="utf-8") as file:
    for number, line in enumerate(file, start=1):
        item = line.strip()
        print(f"{number}. {item.capitalize()}")
```

Each line read ends with an invisible line break (`\n`). `.strip()` removes it.

+++

## Writing to a file

With the `"w"` (*write*) mode, you create (or overwrite) a file. The `"a"` (*append*) mode adds at the end.

```py
with open("log.txt", "w", encoding="utf-8") as f:
    f.write("Monday: 120 sales\n")
    f.write("Tuesday: 95 sales\n")

with open("log.txt", "a", encoding="utf-8") as f:
    f.write("Wednesday: 210 sales\n")

with open("log.txt", encoding="utf-8") as f:
    print(f.read())
```

+++

## CSV files

The **CSV** format (*Comma-Separated Values*) is the most widespread data format: a table as text, one line per record, commas between columns. You can open it in Excel.

Here's the start of the `sales.csv` file, which holds the 2024 sales of a coffee shop chain:

```py
with open("sales.csv", encoding="utf-8") as f:
    for i in range(6):
        print(f.readline().strip())
```

The `csv` module reads each line as a dictionary, with the column names as keys:

```py
import csv

total_quantity = 0
with open("sales.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        total_quantity += int(row["quantity"])
print("Items sold in 2024:", total_quantity)
```

Everything is read as text: hence the `int(...)`. In the next chapter, pandas will do all this (and much more) in one line.

+++

## Handling errors: try / except

Real data is full of surprises: an empty cell, an "N/A", a typo. Rather than letting the program crash, you can **catch** the error with `try` / `except`.

```py
values = ["12", "7", "N/A", "15", "", "9"]
total = 0
skipped = 0
for v in values:
    try:
        total += int(v)
    except ValueError:
        skipped += 1
print(f"Total: {total} ({skipped} values skipped)")
```

Python **tries** the `try` block. If a `ValueError` happens, it runs the `except` block instead of crashing, and carries on.

```warn
Only catch the errors you expect (here `ValueError`). A bare `except:` would also hide your real programming mistakes.
```

+++

## Exercise: the shopping list

```exercise
@title Counting the items
@prompt
Read the file `groceries.txt` line by line and create the list `items` holding each item **in upper case**, without the line break.

Then display the number of items.
@starter
items = []

print(len(items))
@solution
items = []
with open("groceries.txt", encoding="utf-8") as f:
    for line in f:
        items.append(line.strip().upper())

print(len(items))
@hint
with open("groceries.txt", encoding="utf-8") as f: then for line in f: then items.append(line.strip().upper())
@check
assert "open(" in CODE, "Open the file with open()."
assert items == ["RICE", "OIL", "TOMATOES", "ONIONS", "BREAD", "MILK", "COFFEE"], f"items should hold the 7 items in upper case. Got: {items}"
assert "7" in OUT, "Display the number of items."
```

+++

## Exercise: a safe conversion

```exercise
@title The careful converter
@prompt
Write a function `to_number(text)` that converts a text into a decimal number with `float()`. If the conversion fails, it returns `None` instead of crashing.

Then calculate `total`: the sum of the values in `raw` that could be converted.
@starter
def to_number(text):
    ...

raw = ["12.5", "abc", "7", "", "3.25", "N/A"]
total = 
print(total)
@solution
def to_number(text):
    try:
        return float(text)
    except ValueError:
        return None

raw = ["12.5", "abc", "7", "", "3.25", "N/A"]
total = sum(x for x in (to_number(t) for t in raw) if x is not None)
print(total)
@hint
In the function: try: return float(text), then except ValueError: return None. For the total, a loop that only adds the results that are not None.
@check
assert to_number("3.5") == 3.5, "to_number(\"3.5\") must return 3.5."
assert to_number("abc") is None, "to_number(\"abc\") must return None (and not crash)."
assert "try" in CODE and "except" in CODE, "Use try / except in your function."
assert abs(total - 22.75) < 1e-9, f"The total of the valid values is 22.75, you get {total}."
```
