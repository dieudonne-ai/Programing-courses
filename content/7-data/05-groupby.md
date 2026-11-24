---
id: groupby
title: Regrouper et résumer
subtitle: groupby, la question « par ville », « par mois », « par produit ».
duration: 16
---
## La question la plus fréquente

« Quel est le chiffre d'affaires **par ville** ? » « Combien de ventes **par mois** ? » « Quelle note moyenne **par classe** ? »

Toutes ces questions ont la même forme : **découper** les données en groupes, **calculer** quelque chose dans chaque groupe, puis **rassembler** les résultats. En pandas, c'est `groupby`.

Commençons par ajouter une colonne `total` (le montant de chaque vente) :

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]
ventes.head()
```

+++

## Un premier groupby

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

ventes.groupby("ville")["total"].sum()
```

Lis-le de gauche à droite : « dans `ventes`, **regroupe par** ville, prends la colonne `total`, et fais la **somme** ». Le résultat est une Series avec une valeur par ville.

```html
<div class="flow">
  <div class="flow-step"><b>Découper</b><span>Une pile de lignes par ville.</span></div>
  <div class="flow-step"><b>Calculer</b><span>La somme des totaux dans chaque pile.</span></div>
  <div class="flow-step"><b>Rassembler</b><span>Un tableau : une ligne par ville.</span></div>
</div>
```

On peut ensuite trier le résultat :

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

ventes.groupby("produit")["total"].sum().sort_values(ascending=False).round(2)
```

+++

## Les fonctions d'agrégation

À la place de `sum()`, on peut utiliser toutes les fonctions de résumé :

| Fonction | Calcule |
|---|---|
| `sum()` | la somme |
| `mean()` | la moyenne |
| `median()` | la médiane |
| `count()` | le nombre de lignes |
| `min()` / `max()` | le minimum / maximum |
| `nunique()` | le nombre de valeurs distinctes |

Et `agg` en calcule plusieurs d'un coup :

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

ventes.groupby("ville").agg(
    nb_ventes=("total", "count"),
    chiffre_affaires=("total", "sum"),
    panier_moyen=("total", "mean"),
).round(2)
```

+++

## Regrouper par mois

Pour regrouper dans le temps, on convertit d'abord la date, puis on en extrait le mois avec `.dt.month` :

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]
ventes["date"] = pd.to_datetime(ventes["date"])
ventes["mois"] = ventes["date"].dt.month

ventes.groupby("mois")["total"].sum().round(0)
```

Observe les chiffres : certains mois vendent nettement plus. On creusera ça dans le projet final.

+++

## Plusieurs critères : le tableau croisé

On peut regrouper selon **deux** colonnes à la fois. `pivot_table` présente le résultat sous forme de tableau croisé, lignes × colonnes, comme dans Excel :

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

pd.pivot_table(ventes, values="total", index="ville", columns="categorie", aggfunc="sum").round(0)
```

```quiz
Quelle instruction donne la **quantité moyenne** vendue pour chaque produit ?
- `ventes.groupby("quantite")["produit"].mean()`
* `ventes.groupby("produit")["quantite"].mean()`
- `ventes["produit"].mean("quantite")`
> On regroupe par ce qui définit les groupes (le produit), puis on choisit la colonne à résumer (la quantité) et la fonction (la moyenne).
```

+++

## Exercices

```exercise
@title Le produit star
@prompt
À partir de `ventes.csv` :

1. crée la colonne `total` (quantité × prix unitaire) ;
2. crée `ca_produit` : le chiffre d'affaires par produit, trié du plus grand au plus petit ;
3. range dans `produit_star` le nom du produit qui rapporte le plus.
@starter
import pandas as pd
ventes = pd.read_csv("ventes.csv")

ca_produit = 
produit_star = 
print(produit_star)
ca_produit
@solution
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

ca_produit = ventes.groupby("produit")["total"].sum().sort_values(ascending=False)
produit_star = ca_produit.index[0]
print(produit_star)
ca_produit
@hint
ventes.groupby("produit")["total"].sum().sort_values(ascending=False), puis .index[0] pour le premier nom.
@check
import pandas as _pd
_v = _pd.read_csv("ventes.csv")
_v["total"] = _v["quantite"] * _v["prix_unitaire"]
_r = _v.groupby("produit")["total"].sum().sort_values(ascending=False)
assert "total" in ventes.columns, "Crée la colonne total dans ventes."
assert list(ca_produit.index) == list(_r.index), "ca_produit doit être trié du plus grand au plus petit chiffre d'affaires."
assert abs(ca_produit.iloc[0] - _r.iloc[0]) < 1e-6, "Vérifie le calcul du chiffre d'affaires par produit."
assert produit_star == _r.index[0], f"Le produit qui rapporte le plus est {_r.index[0]}."
```

```exercise
@title Travail et réussite
@prompt
Dans `etudiants.csv`, on veut savoir si les heures d'étude comptent.

1. crée une colonne `groupe` qui vaut `"plus de 10 h"` si `heures_etude > 10`, et `"10 h ou moins"` sinon (astuce : `np.where(condition, valeur_si_vrai, valeur_si_faux)`) ;
2. crée `moyennes` : la moyenne de `note_python` par groupe, arrondie à 1 décimale.
@starter
import pandas as pd
import numpy as np
df = pd.read_csv("etudiants.csv")

df["groupe"] = 
moyennes = 
moyennes
@solution
import pandas as pd
import numpy as np
df = pd.read_csv("etudiants.csv")

df["groupe"] = np.where(df["heures_etude"] > 10, "plus de 10 h", "10 h ou moins")
moyennes = df.groupby("groupe")["note_python"].mean().round(1)
moyennes
@hint
np.where(df["heures_etude"] > 10, "plus de 10 h", "10 h ou moins"), puis un groupby("groupe") sur note_python.
@check
import pandas as _pd, numpy as _np
_d = _pd.read_csv("etudiants.csv")
_d["groupe"] = _np.where(_d["heures_etude"] > 10, "plus de 10 h", "10 h ou moins")
_m = _d.groupby("groupe")["note_python"].mean().round(1)
assert set(df["groupe"]) == {"plus de 10 h", "10 h ou moins"}, "La colonne groupe doit contenir exactement \"plus de 10 h\" et \"10 h ou moins\"."
assert (df["groupe"] == _d["groupe"]).all(), "Vérifie la condition : heures_etude > 10."
assert moyennes.to_dict() == _m.to_dict(), f"Moyennes attendues : {_m.to_dict()}"
```
