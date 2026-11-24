---
id: visualisation
title: Visualiser avec Matplotlib
subtitle: Un bon graphique vaut mieux qu'un long tableau.
duration: 16
---
## Pourquoi visualiser ?

Un tableau de chiffres demande un effort. Un graphique se comprend en une seconde. **Matplotlib** est la bibliothèque de graphiques de référence en Python.

```py
import matplotlib.pyplot as plt

mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"]
ventes = [120, 135, 160, 158, 190, 240]

plt.plot(mois, ventes, marker="o")
plt.title("Ventes du premier semestre")
plt.xlabel("Mois")
plt.ylabel("Nombre de ventes")
plt.show()
```

La recette est toujours la même : créer le graphique (`plt.plot`, `plt.bar`…), ajouter un **titre** et des **étiquettes d'axes**, puis `plt.show()`.

+++

## Choisir le bon graphique

| Question | Graphique | Fonction |
|---|---|---|
| Comment ça évolue dans le temps ? | courbe | `plt.plot` |
| Comment se comparent des catégories ? | barres | `plt.bar` / `plt.barh` |
| Comment se répartissent les valeurs ? | histogramme | `plt.hist` |
| Deux variables sont-elles liées ? | nuage de points | `plt.scatter` |

```py
import pandas as pd
import matplotlib.pyplot as plt

ventes = pd.read_csv("ventes.csv")
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]
par_ville = ventes.groupby("ville")["total"].sum().sort_values()

plt.barh(par_ville.index, par_ville.values, color="#2347B8")
plt.title("Chiffre d'affaires 2024 par ville (euros)")
plt.show()
```

Des barres **horizontales triées** : la ville en tête saute aux yeux, et les noms se lisent sans pencher la tête.

+++

## La répartition : l'histogramme

Un histogramme découpe les valeurs en intervalles et compte combien tombent dans chacun.

```py
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("etudiants.csv")
plt.hist(df["note_python"], bins=8, color="#C92E50", edgecolor="white")
plt.title("Répartition des notes de Python")
plt.xlabel("Note sur 20")
plt.ylabel("Nombre d'étudiants")
plt.show()
```

+++

## La relation : le nuage de points

Les étudiants qui travaillent plus ont-ils de meilleures notes ? Chaque point est un étudiant.

```py
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("etudiants.csv")
plt.scatter(df["heures_etude"], df["note_python"], color="#2347B8")
plt.title("Heures d'étude et note de Python")
plt.xlabel("Heures d'étude par semaine")
plt.ylabel("Note sur 20")
plt.grid(alpha=0.3)
plt.show()

print("Corrélation :", round(df["heures_etude"].corr(df["note_python"]), 2))
```

Les points montent vers la droite : plus d'heures, meilleure note. La **corrélation** mesure ce lien entre -1 et 1 ; proche de 1, le lien est fort et positif. Compare avec `note_math` : y a-t-il un lien ?

```warn
Corrélation n'est pas causalité. Deux choses qui varient ensemble n'ont pas forcément de lien de cause à effet. Ici, c'est plausible, mais il faut toujours rester prudent dans ses conclusions.
```

+++

## Le raccourci pandas

Les Series et DataFrames de pandas ont une méthode `.plot()` qui appelle Matplotlib pour toi :

```py
import pandas as pd
import matplotlib.pyplot as plt

ventes = pd.read_csv("ventes.csv")
ventes["date"] = pd.to_datetime(ventes["date"])
ventes["mois"] = ventes["date"].dt.month
ventes.groupby("mois")["quantite"].sum().plot(kind="line", marker="o", title="Articles vendus par mois")
plt.show()
```

`kind` peut valoir `"line"`, `"bar"`, `"barh"`, `"hist"`, `"pie"`…

```quiz
Tu veux montrer l'évolution du nombre d'utilisateurs d'une application sur 12 mois. Quel graphique choisis-tu ?
* Une courbe
- Un histogramme
- Un nuage de points
> Pour une évolution dans le temps, la courbe est le choix naturel : l'œil suit la tendance de gauche à droite.
```

+++

## Exercice : ton premier graphique

```exercise
@title Les ventes par catégorie
@prompt
Crée un **graphique en barres** (`plt.bar`) qui montre le **nombre d'articles vendus** (somme de `quantite`) pour chaque `categorie` de `ventes.csv`.

Ajoute un titre avec `plt.title(...)`.
@starter
import pandas as pd
import matplotlib.pyplot as plt

ventes = pd.read_csv("ventes.csv")
par_categorie = 

plt.show()
@solution
import pandas as pd
import matplotlib.pyplot as plt

ventes = pd.read_csv("ventes.csv")
par_categorie = ventes.groupby("categorie")["quantite"].sum()

plt.bar(par_categorie.index, par_categorie.values, color="#2347B8")
plt.title("Articles vendus par catégorie")
plt.ylabel("Quantité")
plt.show()
@hint
par_categorie = ventes.groupby("categorie")["quantite"].sum(), puis plt.bar(par_categorie.index, par_categorie.values)
@check
import matplotlib.pyplot as _plt
import pandas as _pd
assert _plt.get_fignums(), "Aucun graphique n'a été créé. Utilise plt.bar(...)."
_ax = _plt.gcf().axes[0]
_bars = [p for p in _ax.patches]
assert len(_bars) == 3, f"Il y a 3 catégories, donc 3 barres attendues. Ton graphique en a {len(_bars)}."
_v = _pd.read_csv("ventes.csv").groupby("categorie")["quantite"].sum()
assert sorted(round(b.get_height()) for b in _bars) == sorted(int(x) for x in _v.values), "La hauteur des barres doit être la somme des quantités par catégorie."
assert _ax.get_title().strip(), "Ajoute un titre avec plt.title(\"...\")."
```
