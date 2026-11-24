---
id: selection
title: Sélectionner, filtrer, trier
subtitle: Poser des questions précises à tes données.
duration: 15
---
## Choisir des colonnes

Une colonne : des crochets simples. Plusieurs colonnes : une **liste** de noms entre les crochets (d'où les doubles crochets).

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")

ventes[["date", "ville", "produit"]].head()
```

+++

## Filtrer des lignes

C'est la technique du **masque** vue avec NumPy. La comparaison donne une Series de `True` / `False`, et on la met entre crochets pour garder les lignes `True`.

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")

a_dakar = ventes[ventes["ville"] == "Dakar"]
print(len(a_dakar), "ventes à Dakar")
a_dakar.head()
```

Lis-le comme une phrase : « les ventes **où** la ville **est égale à** Dakar ».

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")

grosses = ventes[ventes["quantite"] >= 15]
grosses.head()
```

+++

## Plusieurs conditions

Pour combiner des conditions, pandas utilise `&` (et), `|` (ou) et `~` (non), **avec des parenthèses autour de chaque condition**.

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")

filtre = (ventes["ville"] == "Kinshasa") & (ventes["categorie"] == "Viennoiserie")
ventes[filtre].head()
```

```warn
En pandas, on n'utilise pas `and` / `or` mais `&` / `|`. Et les parenthèses autour de chaque condition sont obligatoires. Oublier l'un ou l'autre est l'erreur la plus fréquente des débutants.
```

Pour tester l'appartenance à une liste de valeurs, `isin` est bien plus pratique qu'une série de `|` :

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")

afrique = ventes[ventes["ville"].isin(["Kinshasa", "Abidjan", "Dakar"])]
print(len(afrique), "ventes en Afrique sur", len(ventes))
```

+++

## Trier

`sort_values` trie selon une ou plusieurs colonnes. Par défaut, du plus petit au plus grand ; `ascending=False` inverse l'ordre.

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")

ventes.sort_values("quantite", ascending=False).head(5)
```

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")

ventes.sort_values(["ville", "quantite"], ascending=[True, False]).head(8)
```

`nlargest(n, colonne)` est un raccourci pour « les n plus grandes valeurs ».

+++

## loc : lignes et colonnes en même temps

`df.loc[lignes, colonnes]` sélectionne des lignes (souvent avec un filtre) **et** des colonnes en une fois :

```py
import pandas as pd
ventes = pd.read_csv("ventes.csv")

ventes.loc[ventes["produit"] == "Jus de bissap", ["date", "ville", "quantite"]].head()
```

`iloc` fait la même chose avec des **positions** numériques : `ventes.iloc[0:3, 0:2]` donne les 3 premières lignes et les 2 premières colonnes.

```quiz
Quelle ligne sélectionne les ventes de Paris de plus de 10 articles ?
- `ventes[ventes["ville"] == "Paris" and ventes["quantite"] > 10]`
* `ventes[(ventes["ville"] == "Paris") & (ventes["quantite"] > 10)]`
- `ventes["Paris", "quantite" > 10]`
> Avec pandas : `&` à la place de `and`, et des parenthèses autour de chaque condition.
```

+++

## Exercices

```exercise
@title Les bons élèves
@prompt
À partir de `etudiants.csv` :

1. crée `excellents` : les étudiants qui ont **au moins 15** en `note_python`, triés du meilleur au moins bon ;
2. crée `abidjan_travailleurs` : les étudiants d'**Abidjan** qui ont étudié **plus de 10 heures** (`heures_etude > 10`).
@starter
import pandas as pd
df = pd.read_csv("etudiants.csv")

excellents = 
abidjan_travailleurs = 

excellents
@solution
import pandas as pd
df = pd.read_csv("etudiants.csv")

excellents = df[df["note_python"] >= 15].sort_values("note_python", ascending=False)
abidjan_travailleurs = df[(df["ville"] == "Abidjan") & (df["heures_etude"] > 10)]

excellents
@hint
df[df["note_python"] >= 15].sort_values("note_python", ascending=False). Pour le second : deux conditions entre parenthèses, reliées par &.
@check
import pandas as _pd
_d = _pd.read_csv("etudiants.csv")
_e = _d[_d["note_python"] >= 15].sort_values("note_python", ascending=False)
assert isinstance(excellents, _pd.DataFrame), "excellents doit être un DataFrame filtré."
assert list(excellents["nom"]) == list(_e["nom"]), "excellents doit contenir les étudiants avec note_python >= 15, du meilleur au moins bon."
_a = _d[(_d["ville"] == "Abidjan") & (_d["heures_etude"] > 10)]
assert set(abidjan_travailleurs["nom"]) == set(_a["nom"]) and len(abidjan_travailleurs) == len(_a), f"abidjan_travailleurs devrait contenir {len(_a)} étudiant(s) : {list(_a['nom'])}."
```

```exercise
@title La plus grosse vente de bissap
@prompt
Dans `ventes.csv`, trouve la vente de **Jus de bissap** avec la plus grande quantité. Range sa **date** dans `date_record` et sa **ville** dans `ville_record`.
@starter
import pandas as pd
ventes = pd.read_csv("ventes.csv")

bissap = 
meilleure = 
date_record = 
ville_record = 
print(date_record, ville_record)
@solution
import pandas as pd
ventes = pd.read_csv("ventes.csv")

bissap = ventes[ventes["produit"] == "Jus de bissap"]
meilleure = bissap.sort_values("quantite", ascending=False).iloc[0]
date_record = meilleure["date"]
ville_record = meilleure["ville"]
print(date_record, ville_record)
@hint
Filtre les lignes du produit, trie par quantité décroissante, puis .iloc[0] donne la première ligne. On lit ensuite ses colonnes avec ["date"] et ["ville"].
@check
import pandas as _pd
_v = _pd.read_csv("ventes.csv")
_b = _v[_v["produit"] == "Jus de bissap"]
_max = _b["quantite"].max()
_ok = _b[_b["quantite"] == _max]
assert any((r["date"] == date_record and r["ville"] == ville_record) for _, r in _ok.iterrows()), f"La plus grosse vente de bissap fait {_max} unités. Vérifie ta date et ta ville."
```
