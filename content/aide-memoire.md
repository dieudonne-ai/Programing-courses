## Afficher et commenter

```python
print("Bonjour")              # affiche du texte
print("Total :", 3 * 4)       # plusieurs éléments séparés par des virgules
# Ceci est un commentaire : Python l'ignore
```

## Variables et types

```python
prenom = "Awa"       # str   (texte)
age = 24             # int   (entier)
taille = 1.68        # float (nombre à virgule)
inscrit = True       # bool  (True ou False)
print(type(age))     # <class 'int'>
age = age + 1        # ou : age += 1
```

Conversions : `int("12")`, `float("3.5")`, `str(12)`. La fonction `input()` renvoie toujours du texte.

## Calculs

```python
7 + 2, 7 - 2, 7 * 2   # 9, 5, 14
7 / 2                 # 3.5  division
7 // 2                # 3    division entière
7 % 2                 # 1    reste (modulo)
2 ** 10               # 1024 puissance
round(3.14159, 2)     # 3.14
```

## Texte

```python
nom = "  aWa diallo "
nom.strip().title()       # "Awa Diallo"
nom.upper(), nom.lower()
"café".replace("é", "e")
len("Python")             # 6
"Python"[0], "Python"[-1] # "P", "n"
"Python"[0:3]             # "Pyt"
f"{prenom} a {age} ans"   # f-string
f"{3.14159:.2f}"          # "3.14"
```

## Comparaisons et logique

```python
==  !=  <  >  <=  >=      # comparaisons
age >= 18 and inscrit     # et
age < 12 or age > 65      # ou
not inscrit               # non
```

## Conditions

```python
if note >= 16:
    print("Très bien")
elif note >= 10:
    print("Admis")
else:
    print("Ajourné")
```

## Boucles

```python
for i in range(1, 6):      # 1, 2, 3, 4, 5
    print(i)

total = 0
for x in [3, 8, 2]:
    total += x

while solde < objectif:
    solde += 1000

# break : sortir de la boucle ; continue : passer au tour suivant
```

## Listes

```python
notes = [12, 15, 9]
notes.append(17)          # ajouter
notes[0]                  # premier élément
notes[-1]                 # dernier
len(notes), sum(notes), min(notes), max(notes)
sorted(notes, reverse=True)
[n * 2 for n in notes if n >= 10]   # compréhension
for rang, n in enumerate(notes, start=1): ...
for a, b in zip(liste1, liste2): ...
```

## Dictionnaires, tuples, ensembles

```python
produit = {"nom": "Croissant", "prix": 1.8}
produit["prix"]                 # 1.8
produit["stock"] = 30           # ajouter / modifier
produit.get("couleur", "?")     # valeur par défaut
for cle, valeur in produit.items(): ...

point = (4.3, 15.3)             # tuple (non modifiable)
lat, lon = point                # déballage
villes = set(["Dakar", "Dakar", "Paris"])   # {"Dakar", "Paris"}
```

## Fonctions

```python
def prix_ttc(prix, taux=0.18):
    """Renvoie le prix toutes taxes comprises."""
    return prix * (1 + taux)

prix_ttc(1000)            # 1180.0
prix_ttc(1000, taux=0.2)  # 1200.0
sorted(eleves, key=lambda e: e["note"])
```

## Modules, fichiers, erreurs

```python
import math
from datetime import date
import random

with open("courses.txt", encoding="utf-8") as f:
    for ligne in f:
        print(ligne.strip())

try:
    n = int("abc")
except ValueError:
    n = 0
```

## NumPy

```python
import numpy as np
a = np.array([2.5, 3.5, 2.0])
a * 2, a.sum(), a.mean(), a.std()
a[a > 2.2]                # filtrer avec un masque
```

## Pandas : charger et explorer

```python
import pandas as pd
df = pd.read_csv("ventes.csv")
df.head(), df.shape, df.columns, df.dtypes
df.info()
df.describe()
df["ville"].value_counts()
df["ville"].nunique()
```

## Pandas : sélectionner et trier

```python
df["quantite"]                          # une colonne
df[["ville", "quantite"]]               # plusieurs colonnes
df[df["ville"] == "Dakar"]              # filtrer
df[(df["quantite"] > 10) & (df["ville"] == "Paris")]
df[df["ville"].isin(["Dakar", "Abidjan"])]
df.sort_values("quantite", ascending=False)
df.loc[df["quantite"] > 10, ["date", "ville"]]
```

## Pandas : nettoyer et transformer

```python
df.isna().sum()                         # valeurs manquantes
df.dropna(subset=["depense"])
df["age"].fillna(df["age"].median())
df.drop_duplicates()
df["ville"].str.strip().str.title()
df["date"] = pd.to_datetime(df["date"])
df["mois"] = df["date"].dt.month
df["total"] = df["quantite"] * df["prix_unitaire"]
```

## Pandas : regrouper

```python
df.groupby("ville")["total"].sum()
df.groupby("ville")["total"].sum().sort_values(ascending=False)
df.groupby("ville").agg(nb=("total", "count"), ca=("total", "sum"))
pd.pivot_table(df, values="total", index="ville", columns="categorie", aggfunc="sum")
```

## Graphiques

```python
import matplotlib.pyplot as plt
plt.plot(x, y, marker="o")       # courbe (évolution)
plt.bar(categories, valeurs)     # barres (comparaison)
plt.barh(categories, valeurs)    # barres horizontales
plt.hist(valeurs, bins=10)       # histogramme (répartition)
plt.scatter(x, y)                # nuage de points (relation)
plt.title("Titre"); plt.xlabel("x"); plt.ylabel("y")
plt.show()

serie.plot(kind="bar", title="Titre")   # raccourci pandas
```
