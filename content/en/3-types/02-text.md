---
id: textes
title: Text and f-strings
subtitle: Joining, cleaning and slicing strings.
duration: 14
---
## Joining texts

`+` between two texts **sticks** them together (we say *concatenate*). `*` repeats a text.

```py
name = "Moussa"
greeting = "Hello " + name + "!"
print(greeting)
print("Ha" * 3)
print("-" * 20)
```

But careful: you can't join text and a number with `+`.

```py
age = 30
print("I am " + age + " years old")
```

Python refuses (`TypeError`): it doesn't know whether to add or to join. You need to convert the number to text with `str(age)`. Fix the code above.

+++

## f-strings: the modern way

There's a much handier way: **f-strings**. You put an `f` before the quotes, and write the variables **between curly braces** `{ }` directly in the text.

```py
name = "Moussa"
age = 30
city = "Kinshasa"
print(f"My name is {name}, I am {age} and I live in {city}.")
print(f"In 10 years, I'll be {age + 10}.")
```

You can even calculate inside the braces, and format numbers. `:.2f` shows 2 digits after the decimal point:

```py
price = 7.5
quantity = 3
print(f"Total: {price * quantity:.2f} euros")
```

```tip
f-strings are the most common way to display results in Python. You'll see them everywhere, especially in data analysis.
```

+++

## String methods

A piece of text has **methods**: actions you apply to it with a dot. They return a new text.

```py
name = "  aWa diallo  "
print(name.upper())
print(name.lower())
print(name.strip())
print(name.strip().title())
print("coffee with milk".replace("milk", "honey"))
print("banana".count("a"))
```

| Method | Effect |
|---|---|
| `.upper()` | all upper case |
| `.lower()` | all lower case |
| `.title()` | Capital At Each Word |
| `.strip()` | removes spaces at the start and end |
| `.replace(a, b)` | replaces a with b |
| `.count(x)` | counts the x |

These methods are essential to **clean data**: in a real file, you'll find "Dakar", "dakar" and "DAKAR  " all meaning the same city.

+++

## Length, positions and slicing

`len()` gives the number of characters. Each character has a **position** (an *index*), and counting starts at **0**.

```py
word = "Python"
print(len(word))
print(word[0])
print(word[1])
print(word[-1])
print(word[0:3])
print(word[2:])
```

```html
<div class="flow" aria-label="Positions of the letters in the word Python">
  <div class="flow-step"><b>P</b><span>0 or -6</span></div>
  <div class="flow-step"><b>y</b><span>1 or -5</span></div>
  <div class="flow-step"><b>t</b><span>2 or -4</span></div>
  <div class="flow-step"><b>h</b><span>3 or -3</span></div>
  <div class="flow-step"><b>o</b><span>4 or -2</span></div>
  <div class="flow-step"><b>n</b><span>5 or -1</span></div>
</div>
```

`word[0:3]` takes from position 0 **up to 3, excluded**: `Pyt`. Negative positions count from the end.

```predict
city = "Abidjan"
print(city[0] + city[-1])
???
- Ab
* An
- Aj
> `city[0]` is the first character (A), `city[-1]` the last (n). Joined: "An".
```

To find out whether a text contains another, use `in`:

```py
print("juice" in "bissap juice")
print("tea" in "coffee")
```

+++

## Exercise: the badge

```exercise
@title The conference badge
@prompt
The variables `name` and `company` hold a participant's details. With **an f-string**, display exactly:

`Welcome Grace (Orange Digital)!`
@starter
name = "Grace"
company = "Orange Digital"

print(f"...")
@solution
name = "Grace"
company = "Orange Digital"

print(f"Welcome {name} ({company})!")
@hint
In an f-string, write the variables between curly braces: {name}. The parentheses around the company are plain text.
@check
assert 'f"' in CODE or "f'" in CODE, "Use an f-string: f\"...\"."
assert OUT.strip() == "Welcome Grace (Orange Digital)!", f"Expected \"Welcome Grace (Orange Digital)!\", got \"{OUT.strip()}\"."
assert "{name}" in CODE.replace(" ", ""), "Use the name variable between braces rather than typing Grace by hand."
```

+++

## Exercise: cleaning a name

```exercise
@title A nice clean name
@prompt
A form was badly filled in: `raw = "   kOFI aNNAN   "`.

Create a variable `clean` that holds `Kofi Annan` (no spaces around it, a capital at each word) using string methods, then create `initials` holding `KA` by taking the first letter of each word.
@starter
raw = "   kOFI aNNAN   "

clean = 
print(clean)

initials = 
print(initials)
@solution
raw = "   kOFI aNNAN   "

clean = raw.strip().title()
print(clean)

initials = clean[0] + clean[5]
print(initials)
@hint
Chain the methods: raw.strip().title(). For the initials, in "Kofi Annan" the K is at position 0, the A at position 5.
@check
assert clean == "Kofi Annan", f"clean should be \"Kofi Annan\", it is \"{clean}\"."
assert initials == "KA", f"initials should be \"KA\", it is \"{initials}\"."
assert "Kofi Annan" not in CODE, "Compute clean from raw with methods, without copying the result."
```
