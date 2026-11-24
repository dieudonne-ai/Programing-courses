---
id: projet-final
title: Projet final, le rapport du Café Baobab
subtitle: Tu es l'analyste. La direction attend tes réponses.
duration: 25
---
## Ta mission

Le **Café Baobab** possède cinq cafés : Kinshasa, Abidjan, Dakar, Paris et Montréal. La directrice prépare le budget 2025 et te confie le fichier des ventes 2024, `ventes.csv`. Elle a quatre questions :

1. Quel est le **chiffre d'affaires** total de l'année ?
2. Quelle **ville** rapporte le plus ?
3. Y a-t-il des **saisons** plus fortes que d'autres ?
4. Le **jus de bissap**, nouveau produit, a-t-il un comportement particulier ?

Tu vas suivre la démarche de l'analyste vue au chapitre 1 : question, données, nettoyage, analyse, visualisation, décision. Chaque étape est un exercice. Tu peux utiliser l'aide-mémoire (menu du haut) à tout moment.

+++

## Étape 1 : préparer les données

```exercise
@title Préparer le tableau
@prompt
Charge `ventes.csv` dans `ventes`, puis ajoute trois colonnes :

- `date` convertie en vraie date avec `pd.to_datetime` ;
- `mois` : le numéro du mois (1 à 12), extrait de la date ;
- `total` : le montant de chaque vente (quantité × prix unitaire).

Enfin, calcule `ca_total`, le chiffre d'affaires de l'année, arrondi à l'euro près.
@starter
import pandas as pd

ventes = pd.read_csv("ventes.csv")

ca_total = 
print(f"Chiffre d'affaires 2024 : {ca_total} euros")
@solution
import pandas as pd

ventes = pd.read_csv("ventes.csv")
ventes["date"] = pd.to_datetime(ventes["date"])
ventes["mois"] = ventes["date"].dt.month
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

ca_total = round(ventes["total"].sum())
print(f"Chiffre d'affaires 2024 : {ca_total} euros")
@hint
pd.to_datetime(ventes["date"]) ; ventes["date"].dt.month ; ventes["quantite"] * ventes["prix_unitaire"] ; round(ventes["total"].sum())
@check
import pandas as _pd
_v = _pd.read_csv("ventes.csv")
_v["total"] = _v["quantite"] * _v["prix_unitaire"]
for col in ("mois", "total"):
    assert col in ventes.columns, f"Il manque la colonne {col}."
assert str(ventes["date"].dtype).startswith("datetime"), "La colonne date doit être convertie avec pd.to_datetime."
assert ventes["mois"].min() == 1 and ventes["mois"].max() == 12, "La colonne mois doit contenir les numéros de mois (1 à 12)."
assert ca_total == round(_v["total"].sum()), f"Le chiffre d'affaires attendu est {round(_v['total'].sum())} euros."
```

+++

## Étape 2 : les villes

```exercise
@title Le classement des villes
@prompt
Calcule `ca_ville` : le chiffre d'affaires par ville, trié du plus grand au plus petit. Puis calcule `part_top` : la **part** (en %) de la première ville dans le chiffre d'affaires total, arrondie à 1 décimale.

Le code de l'étape 1 est déjà là pour que cet exercice fonctionne tout seul.
@starter
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

ca_ville = 
part_top = 
print(ca_ville.round(0))
print(f"La première ville représente {part_top} % des ventes")
@solution
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

ca_ville = ventes.groupby("ville")["total"].sum().sort_values(ascending=False)
part_top = round(ca_ville.iloc[0] / ca_ville.sum() * 100, 1)
print(ca_ville.round(0))
print(f"La première ville représente {part_top} % des ventes")
@hint
Un groupby("ville") sur total, trié. La part : ca_ville.iloc[0] / ca_ville.sum() * 100
@check
import pandas as _pd
_v = _pd.read_csv("ventes.csv")
_v["total"] = _v["quantite"] * _v["prix_unitaire"]
_c = _v.groupby("ville")["total"].sum().sort_values(ascending=False)
assert list(ca_ville.index) == list(_c.index), "ca_ville doit être trié du plus grand au plus petit."
assert part_top == round(_c.iloc[0] / _c.sum() * 100, 1), f"La part attendue est {round(_c.iloc[0] / _c.sum() * 100, 1)} %."
```

+++

## Étape 3 : les saisons

```exercise
@title La courbe de l'année
@prompt
Trace la **courbe** du chiffre d'affaires par **mois** (de 1 à 12), avec un titre. Range aussi dans `meilleur_mois` le numéro du mois qui rapporte le plus.
@starter
import pandas as pd
import matplotlib.pyplot as plt
ventes = pd.read_csv("ventes.csv")
ventes["date"] = pd.to_datetime(ventes["date"])
ventes["mois"] = ventes["date"].dt.month
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

ca_mois = 
meilleur_mois = 

plt.show()
print("Meilleur mois :", meilleur_mois)
@solution
import pandas as pd
import matplotlib.pyplot as plt
ventes = pd.read_csv("ventes.csv")
ventes["date"] = pd.to_datetime(ventes["date"])
ventes["mois"] = ventes["date"].dt.month
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

ca_mois = ventes.groupby("mois")["total"].sum()
meilleur_mois = ca_mois.idxmax()

plt.plot(ca_mois.index, ca_mois.values, marker="o", color="#2347B8")
plt.title("Chiffre d'affaires par mois, 2024")
plt.xlabel("Mois")
plt.ylabel("Euros")
plt.xticks(range(1, 13))
plt.show()
print("Meilleur mois :", meilleur_mois)
@hint
ca_mois = ventes.groupby("mois")["total"].sum() ; meilleur_mois = ca_mois.idxmax() (l'étiquette de la plus grande valeur) ; plt.plot(ca_mois.index, ca_mois.values)
@check
import pandas as _pd
import matplotlib.pyplot as _plt
_v = _pd.read_csv("ventes.csv")
_v["mois"] = _pd.to_datetime(_v["date"]).dt.month
_v["total"] = _v["quantite"] * _v["prix_unitaire"]
_m = _v.groupby("mois")["total"].sum()
assert int(meilleur_mois) == int(_m.idxmax()), f"Le meilleur mois est le mois {_m.idxmax()}."
assert _plt.get_fignums(), "Trace la courbe avec plt.plot(...)."
_ax = _plt.gcf().axes[0]
assert _ax.get_lines() and len(_ax.get_lines()[0].get_xdata()) == 12, "La courbe doit avoir 12 points, un par mois."
assert _ax.get_title().strip(), "Ajoute un titre à ton graphique."
```

Que vois-tu ? Les mois d'été (juin à août) et décembre se détachent. Une hypothèse : vacances et fêtes de fin d'année. Pour la directrice, c'est une information concrète : **prévoir plus de personnel et de stock** à ces périodes.

+++

## Étape 4 : le cas du bissap

```exercise
@title Le jus de bissap
@prompt
Le jus de bissap se vend-il différemment selon la saison ?

Calcule `bissap_mois` : la **quantité** de Jus de bissap vendue par mois, puis `ratio` : la quantité moyenne par mois **de mars à septembre** (mois 3 à 9) divisée par la quantité moyenne par mois **des autres mois**, arrondie à 2 décimales.
@starter
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["mois"] = pd.to_datetime(ventes["date"]).dt.month

bissap = ventes[ventes["produit"] == "Jus de bissap"]
bissap_mois = 

saison = bissap_mois[(bissap_mois.index >= 3) & (bissap_mois.index <= 9)]
hors_saison = 
ratio = 
print(bissap_mois)
print("Ratio saison chaude / reste de l'année :", ratio)
@solution
import pandas as pd
ventes = pd.read_csv("ventes.csv")
ventes["mois"] = pd.to_datetime(ventes["date"]).dt.month

bissap = ventes[ventes["produit"] == "Jus de bissap"]
bissap_mois = bissap.groupby("mois")["quantite"].sum()

saison = bissap_mois[(bissap_mois.index >= 3) & (bissap_mois.index <= 9)]
hors_saison = bissap_mois[(bissap_mois.index < 3) | (bissap_mois.index > 9)]
ratio = round(saison.mean() / hors_saison.mean(), 2)
print(bissap_mois)
print("Ratio saison chaude / reste de l'année :", ratio)
@hint
bissap.groupby("mois")["quantite"].sum(). Pour les autres mois : index < 3 OU index > 9 (avec |). Le ratio : saison.mean() / hors_saison.mean()
@check
import pandas as _pd
_v = _pd.read_csv("ventes.csv")
_v["mois"] = _pd.to_datetime(_v["date"]).dt.month
_b = _v[_v["produit"] == "Jus de bissap"].groupby("mois")["quantite"].sum()
_s = _b[(_b.index >= 3) & (_b.index <= 9)]
_h = _b[(_b.index < 3) | (_b.index > 9)]
assert bissap_mois.to_dict() == _b.to_dict(), "bissap_mois doit donner la somme des quantités de bissap pour chaque mois."
assert ratio == round(_s.mean() / _h.mean(), 2), f"Le ratio attendu est {round(_s.mean() / _h.mean(), 2)}."
```

Un ratio bien supérieur à 1 confirme l'intuition : le bissap est une **boisson de saison chaude**. Recommandation possible : le mettre en avant au printemps et en été, et réduire les stocks en hiver pour éviter le gaspillage.

+++

## Étape 5 : le rapport

Un analyste ne s'arrête pas aux chiffres : il **raconte** ce qu'ils signifient. Voici un modèle de conclusion que tu pourrais envoyer à la directrice.

```note
Madame la directrice,
1. Kinshasa est notre première ville, loin devant Dakar et Abidjan : un quart du chiffre d'affaires.
2. Les ventes culminent en été et en décembre : renforçons équipes et stocks à ces périodes.
3. Le jus de bissap se vend bien plus de mars à septembre : mettons-le en avant pendant la saison chaude.
```

Exécute ce dernier bloc : il produit le tableau de bord complet en un seul graphique. Modifie-le, ajoute ce qui te semble utile. C'est ton rapport.

```py
import pandas as pd
import matplotlib.pyplot as plt

ventes = pd.read_csv("ventes.csv")
ventes["date"] = pd.to_datetime(ventes["date"])
ventes["mois"] = ventes["date"].dt.month
ventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]

fig, axes = plt.subplots(1, 2, figsize=(11, 4))
ventes.groupby("ville")["total"].sum().sort_values().plot(kind="barh", ax=axes[0], color="#2347B8", title="CA par ville")
ventes.groupby("mois")["total"].sum().plot(ax=axes[1], marker="o", color="#C92E50", title="CA par mois")
plt.tight_layout()
plt.show()
```

+++

## Et maintenant ?

Félicitations. Tu as parcouru tout le chemin : comprendre ce qu'est la programmation, apprendre Python, puis analyser de vraies données jusqu'à des recommandations concrètes.

Pour continuer :

- **Installe Python sur ton ordinateur.** Le plus simple pour la data : installer **Anaconda** (qui contient Python, pandas et Jupyter), ou bien Python et l'éditeur **VS Code**.
- **Travaille dans des notebooks Jupyter.** C'est l'outil standard des analystes, et il fonctionne exactement comme les blocs de code de ce cours.
- **Analyse des données qui t'intéressent.** Le site Kaggle propose des milliers de jeux de données gratuits : football, musique, santé, climat… Choisis un sujet qui te passionne et pose-lui des questions.
- **Apprends SQL**, le langage des bases de données, souvent demandé avec Python dans les offres d'emploi d'analyste.
- **Reviens au bac à sable** de ce site quand tu veux tester une idée.

```note
Un dernier conseil : code un peu chaque jour. Dix minutes par jour valent mieux que trois heures une fois par mois.
Ton certificat t'attend. Bravo !
```
