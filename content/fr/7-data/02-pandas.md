---
id: pandas
title: Pandas, ton tableur en Python
subtitle: Charger, explorer et comprendre un fichier de données.
duration: 15
---
## Le DataFrame

**Pandas** est LA bibliothèque d'analyse de données en Python. Son objet principal, le **DataFrame**, est un tableau avec des lignes et des colonnes nommées. Comme une feuille Excel, mais pilotée par du code.

```py
import pandas as pd

df = pd.DataFrame({
    "produit": ["Espresso", "Croissant", "Sandwich"],
    "prix": [2.5, 1.8, 5.0],
    "stock": [120, 40, 15],
})
df
```

Remarque : ici, pas de `print`. Quand la **dernière ligne** d'un bloc est une valeur, elle s'affiche automatiquement, et pandas la présente sous forme de joli tableau. C'est le fonctionnement des notebooks Jupyter, l'outil préféré des analystes.

+++

## Charger un vrai fichier

En pratique, on ne tape pas les données : on les **charge**. `pd.read_csv` lit un fichier CSV et crée un DataFrame. Voici les ventes 2024 d'une chaîne de cafés présente dans cinq villes.

```py
import pandas as pd

ventes = pd.read_csv("ventes.csv")
ventes.head()
```

`head()` affiche les 5 premières lignes (`head(10)` pour 10). `tail()` affiche les dernières. Ce sont les premières choses qu'on regarde avec un nouveau fichier.

+++

## Les premières questions à poser

Face à un nouveau jeu de données, un analyste vérifie toujours :

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")

print("Dimensions :", ventes.shape)       # (lignes, colonnes)
print("Colonnes :", list(ventes.columns))
print()
print(ventes.dtypes)                      # type de chaque colonne
```

`shape` donne le nombre de lignes et de colonnes. `dtypes` donne le type de chaque colonne : `int64` (entiers), `float64` (nombres à virgule), `object` (texte).

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes.info()
```

`info()` résume tout : nombre de lignes, colonnes, types, et nombre de valeurs **non manquantes** par colonne.

+++

## Une colonne = une Series

Une colonne s'obtient avec des crochets et son nom. Elle est de type **Series** : un tableau NumPy avec des étiquettes. Tout ce que tu sais de NumPy s'applique.

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")

q = ventes["quantite"]
print("Total vendu :", q.sum())
print("Moyenne par vente :", round(q.mean(), 2))
print("Plus grosse vente :", q.max())
```

Et `describe()` calcule d'un coup les statistiques principales de toutes les colonnes numériques :

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes.describe()
```

+++

## Compter les valeurs

Pour une colonne de texte, la question naturelle est : combien de fois apparaît chaque valeur ? C'est le rôle de `value_counts()`.

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["ville"].value_counts()
```

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")
print("Produits différents :", ventes["produit"].nunique())
ventes["produit"].value_counts(normalize=True).round(3)
```

`nunique()` compte les valeurs distinctes. `normalize=True` donne des proportions plutôt que des nombres.

```quiz
Tu reçois un nouveau fichier de données. Quelle instruction montre ses premières lignes ?
- `df.shape`
* `df.head()`
- `df.describe()`
> `head()` affiche les premières lignes. `shape` donne les dimensions, `describe()` les statistiques.
```

+++

## Exercice : les étudiants

```exercise
@title Première exploration
@prompt
Charge le fichier `etudiants.csv` dans un DataFrame nommé `df`. Puis calcule :

- `nb_etudiants` : le nombre de lignes ;
- `moyenne_python` : la moyenne de la colonne `note_python`, arrondie à 2 décimales ;
- `ville_top` : la ville qui compte le plus d'étudiants (astuce : `value_counts()` trie du plus grand au plus petit, et `.index[0]` donne la première étiquette).
@starter
import pandas as pd

df = 

nb_etudiants = 
moyenne_python = 
ville_top = 

print(nb_etudiants, moyenne_python, ville_top)
@solution
import pandas as pd

df = pd.read_csv("etudiants.csv")

nb_etudiants = len(df)
moyenne_python = round(df["note_python"].mean(), 2)
ville_top = df["ville"].value_counts().index[0]

print(nb_etudiants, moyenne_python, ville_top)
@hint
pd.read_csv("etudiants.csv") ; len(df) ou df.shape[0] ; round(df["note_python"].mean(), 2)
@check
import pandas as _pd
_ref = _pd.read_csv("etudiants.csv")
assert isinstance(df, _pd.DataFrame), "df doit être un DataFrame créé avec pd.read_csv(\"etudiants.csv\")."
assert nb_etudiants == len(_ref), f"Il y a {len(_ref)} étudiants, tu en comptes {nb_etudiants}."
assert moyenne_python == round(_ref["note_python"].mean(), 2), f"La moyenne attendue est {round(_ref['note_python'].mean(), 2)}."
assert ville_top == _ref["ville"].value_counts().index[0], f"La ville la plus représentée est {_ref['ville'].value_counts().index[0]}."
```
