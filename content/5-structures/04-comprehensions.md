---
id: comprehensions
title: Les compréhensions de liste
subtitle: Transformer et filtrer en une seule ligne.
duration: 12
---
## Une boucle en une ligne

Tu as souvent écrit ce motif : créer une liste vide, la remplir dans une boucle.

```py
prix = [1000, 2500, 400, 1200]
prix_ttc = []
for p in prix:
    prix_ttc.append(p * 1.18)
print(prix_ttc)
```

Python propose un raccourci très élégant, la **compréhension de liste** :

```py
prix = [1000, 2500, 400, 1200]
prix_ttc = [p * 1.18 for p in prix]
print(prix_ttc)
```

Ça se lit presque comme une phrase : « `p * 1.18` **pour chaque** `p` **dans** `prix` ».

+++

## Filtrer avec if

On peut ajouter une condition à la fin pour ne garder que certains éléments.

```py
temperatures = [28, 31, 35, 30, 27, 33, 36]
chaudes = [t for t in temperatures if t > 32]
print(chaudes)

prenoms = ["Awa", "Kofi", "Amina", "Jean", "Aïcha"]
en_a = [p for p in prenoms if p.startswith("A")]
print(en_a)
```

La structure générale : `[expression for element in sequence if condition]`.

```predict
nombres = [1, 2, 3, 4, 5, 6]
print([n * 10 for n in nombres if n % 2 == 0])
???
- [10, 20, 30, 40, 50, 60]
* [20, 40, 60]
- [2, 4, 6]
> On garde seulement les nombres pairs (2, 4, 6), puis on les multiplie par 10.
```

+++

## Deux outils précieux : enumerate et zip

`enumerate` donne la position **et** l'élément. Pratique pour numéroter un classement :

```py
podium = ["Gloire", "Awa", "Kofi"]
for rang, nom in enumerate(podium, start=1):
    print(f"{rang}. {nom}")
```

`zip` parcourt deux listes **en parallèle**, élément par élément :

```py
produits = ["Espresso", "Croissant", "Sandwich"]
prix = [2.5, 1.8, 5.0]
for produit, p in zip(produits, prix):
    print(f"{produit} : {p} euros")

carte = dict(zip(produits, prix))
print(carte)
```

+++

## Les compréhensions de dictionnaire

Même principe avec des accolades et une paire `cle: valeur` :

```py
prix_euros = {"Espresso": 2.5, "Croissant": 1.8, "Sandwich": 5.0}
prix_fcfa = {produit: round(p * 655.96) for produit, p in prix_euros.items()}
print(prix_fcfa)
```

```tip
Les compréhensions sont pratiques, mais la lisibilité passe avant tout. Si ta compréhension devient trop longue, une boucle classique est souvent plus claire.
```

+++

## Exercices

```exercise
@title Conversion de températures
@prompt
La liste `celsius` contient des températures en degrés Celsius. Avec **une compréhension de liste**, crée `fahrenheit` qui contient les mêmes températures en degrés Fahrenheit, arrondies à 1 décimale.

Formule : `F = C × 9 / 5 + 32`
@starter
celsius = [0, 12.5, 25, 31, 37, 100]

fahrenheit = 
print(fahrenheit)
@solution
celsius = [0, 12.5, 25, 31, 37, 100]

fahrenheit = [round(c * 9 / 5 + 32, 1) for c in celsius]
print(fahrenheit)
@hint
[round(c * 9 / 5 + 32, 1) for c in celsius]
@check
assert "for" in CODE and "[" in CODE.split("fahrenheit =")[1], "Utilise une compréhension de liste : [... for c in celsius]."
assert fahrenheit == [32.0, 54.5, 77.0, 87.8, 98.6, 212.0], f"Résultat attendu : [32.0, 54.5, 77.0, 87.8, 98.6, 212.0]. Obtenu : {fahrenheit}"
```

```exercise
@title Les grosses commandes
@prompt
Avec une compréhension de liste et un filtre, crée `grosses` : la liste des **montants** des commandes de plus de 100 euros (strictement), **après une remise de 10 %** (multiplie par 0.9).
@starter
montants = [45, 120, 300, 80, 150, 99, 101]

grosses = 
print(grosses)
@solution
montants = [45, 120, 300, 80, 150, 99, 101]

grosses = [m * 0.9 for m in montants if m > 100]
print(grosses)
@hint
[m * 0.9 for m in montants if m > 100]
@check
attendu = [m * 0.9 for m in [45, 120, 300, 80, 150, 99, 101] if m > 100]
assert [round(x, 6) for x in grosses] == [round(x, 6) for x in attendu], f"Attendu : {attendu}. Obtenu : {grosses}"
```
