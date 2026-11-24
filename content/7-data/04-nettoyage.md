---
id: nettoyage
title: Nettoyer les données
subtitle: Valeurs manquantes, doublons et fautes de saisie.
duration: 16
---
## 80 % du travail

On dit souvent qu'un analyste passe 80 % de son temps à **nettoyer** les données. Les fichiers réels sont saisis par des humains, et ils contiennent des trous, des doublons et des incohérences.

Voici `clients.csv`, le fichier clients d'une boutique. Regarde bien :

```py
import pandas as pd
clients = pd.read_csv("clients.csv")
clients.head(12)
```

Tu remarques des cases `NaN` (*Not a Number*) : ce sont des **valeurs manquantes**. Et la colonne `ville` a l'air… étrange.

+++

## Repérer les valeurs manquantes

```py
import pandas as pd
clients = pd.read_csv("clients.csv")

print(clients.isna().sum())
print()
print("Lignes complètes :", len(clients.dropna()), "sur", len(clients))
```

`isna()` renvoie `True` pour chaque case vide ; `.sum()` les compte par colonne. Trois stratégies possibles :

- **supprimer** les lignes incomplètes avec `dropna()` (simple, mais on perd des données) ;
- **remplir** les trous avec `fillna(valeur)`, par exemple la médiane de la colonne ;
- **garder** les trous, si l'analyse le permet (la plupart des calculs pandas les ignorent).

```py
import pandas as pd
clients = pd.read_csv("clients.csv")

mediane = clients["age"].median()
clients["age"] = clients["age"].fillna(mediane)
print("Âges manquants restants :", clients["age"].isna().sum())
```

+++

## Les doublons

Une même ligne saisie deux fois fausse tous les comptes.

```py
import pandas as pd
clients = pd.read_csv("clients.csv")

print("Doublons :", clients.duplicated().sum())
clients = clients.drop_duplicates()
print("Après nettoyage :", len(clients), "lignes")
```

+++

## Harmoniser le texte

Combien y a-t-il de villes différentes ?

```py
import pandas as pd
clients = pd.read_csv("clients.csv")
clients["ville"].value_counts()
```

Pour pandas, `"Kinshasa"`, `" kinshasa"` et `"KINSHASA"` sont trois villes différentes ! Les méthodes de texte vues au chapitre 3 s'appliquent à toute une colonne grâce à `.str` :

```py
import pandas as pd
clients = pd.read_csv("clients.csv")

clients["ville"] = clients["ville"].str.strip().str.title()
clients["ville"].value_counts()
```

Cinq villes, comme dans la réalité.

+++

## Les bons types

Les dates sont lues comme du texte. `pd.to_datetime` les convertit en vraies dates, ce qui permet d'en extraire l'année, le mois ou le jour de la semaine :

```py
import pandas as pd
clients = pd.read_csv("clients.csv")

clients["inscription"] = pd.to_datetime(clients["inscription"])
clients["annee"] = clients["inscription"].dt.year
clients["mois"] = clients["inscription"].dt.month
clients[["inscription", "annee", "mois"]].head()
```

Tu viens aussi de voir comment **créer une colonne** : `df["nouvelle"] = ...`. On peut y mettre un calcul sur d'autres colonnes, comme avec NumPy.

```quiz
Quelle instruction transforme `"  dakar "` en `"Dakar"` dans toute la colonne `ville` ?
- `clients["ville"].strip().title()`
* `clients["ville"].str.strip().str.title()`
- `clients.title("ville")`
> Sur une colonne pandas, les méthodes de texte passent par `.str`. Sans lui, Python cherche une méthode `strip` sur la Series elle-même, qui n'existe pas.
```

+++

## Exercice : le grand nettoyage

```exercise
@title Nettoyer clients.csv
@prompt
Crée un DataFrame `propre` à partir de `clients.csv`, en appliquant dans l'ordre :

1. suppression des doublons ;
2. harmonisation de la colonne `ville` (espaces retirés, majuscule au début) ;
3. remplacement des âges manquants par la **médiane** des âges (calculée après suppression des doublons) ;
4. suppression des lignes dont la `depense` est manquante.

Affiche ensuite le nombre de lignes et le nombre de villes distinctes.
@starter
import pandas as pd

propre = pd.read_csv("clients.csv")
# 1.
# 2.
# 3.
# 4.

print(len(propre), propre["ville"].nunique())
@solution
import pandas as pd

propre = pd.read_csv("clients.csv")
propre = propre.drop_duplicates()
propre["ville"] = propre["ville"].str.strip().str.title()
propre["age"] = propre["age"].fillna(propre["age"].median())
propre = propre.dropna(subset=["depense"])

print(len(propre), propre["ville"].nunique())
@hint
drop_duplicates() ; .str.strip().str.title() ; fillna(propre["age"].median()) ; dropna(subset=["depense"]) pour ne regarder que cette colonne.
@check
import pandas as _pd
_c = _pd.read_csv("clients.csv").drop_duplicates()
_c["ville"] = _c["ville"].str.strip().str.title()
_c["age"] = _c["age"].fillna(_c["age"].median())
_c = _c.dropna(subset=["depense"])
assert propre.duplicated().sum() == 0, "Il reste des doublons : utilise drop_duplicates()."
assert propre["ville"].nunique() == 5, f"Il devrait rester 5 villes distinctes, il y en a {propre['ville'].nunique()} : {sorted(propre['ville'].unique())}"
assert propre["age"].isna().sum() == 0, "Il reste des âges manquants : remplis-les avec fillna."
assert propre["depense"].isna().sum() == 0, "Il reste des dépenses manquantes : supprime ces lignes avec dropna(subset=[\"depense\"])."
assert len(propre) == len(_c), f"Le tableau nettoyé devrait avoir {len(_c)} lignes, le tien en a {len(propre)}."
assert abs(propre["age"].sum() - _c["age"].sum()) < 1e-6, "Les âges manquants doivent être remplacés par la médiane calculée après suppression des doublons."
```
