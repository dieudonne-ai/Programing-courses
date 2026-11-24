---
id: dictionnaires
title: Les dictionnaires
subtitle: Associer une clé à une valeur, comme dans un vrai dictionnaire.
duration: 15
---
## Chercher par nom, pas par position

Dans une liste, on retrouve un élément par sa **position**. Mais pour décrire un produit, on préfère retrouver chaque information par son **nom** : le prix, le stock, la catégorie…

Un **dictionnaire** (`dict`) associe des **clés** à des **valeurs**, entre accolades :

```py
produit = {
    "nom": "Jus de bissap",
    "prix": 2.2,
    "stock": 48,
    "categorie": "Boisson",
}
print(produit["nom"])
print(produit["prix"] * 3)
```

Comme dans un vrai dictionnaire : on cherche un mot (la clé) pour trouver sa définition (la valeur).

+++

## Modifier, ajouter, vérifier

```py
produit = {"nom": "Croissant", "prix": 1.8, "stock": 30}

produit["stock"] = produit["stock"] - 5   # modifier
produit["bio"] = True                     # ajouter une clé
print(produit)

print("prix" in produit)                  # la clé existe-t-elle ?
print(produit.get("couleur", "inconnue")) # valeur par défaut si absente
```

Demander une clé qui n'existe pas avec les crochets provoque une `KeyError`. La méthode `.get(cle, defaut)` évite l'erreur.

```py
produit = {"nom": "Croissant", "prix": 1.8}
print(produit["Prix"])
```

Majuscule ! `"Prix"` et `"prix"` sont deux clés différentes.

+++

## Parcourir un dictionnaire

```py
stock = {"Espresso": 120, "Cappuccino": 80, "Thé à la menthe": 45}

for produit in stock:
    print(produit)

for produit, quantite in stock.items():
    print(f"{produit} : {quantite} unités")

print(list(stock.keys()))
print(sum(stock.values()))
```

`.items()` donne les paires (clé, valeur) : c'est la façon la plus pratique de parcourir un dictionnaire.

+++

## Compter avec un dictionnaire

Un usage très courant : compter combien de fois apparaît chaque élément. C'est exactement ce que fait un analyste quand il compte les ventes par ville.

```py
ventes = ["Dakar", "Paris", "Dakar", "Kinshasa", "Dakar", "Paris"]
compte = {}
for ville in ventes:
    if ville in compte:
        compte[ville] += 1
    else:
        compte[ville] = 1
print(compte)
```

+++

## Une liste de dictionnaires = un tableau

Voici l'idée qui fait le lien avec l'analyse de données. Une **liste de dictionnaires** ressemble exactement à un tableau Excel : chaque dictionnaire est une **ligne**, chaque clé une **colonne**.

```py
eleves = [
    {"nom": "Awa", "ville": "Dakar", "note": 15},
    {"nom": "Kofi", "ville": "Abidjan", "note": 12},
    {"nom": "Gloire", "ville": "Kinshasa", "note": 17},
]

for e in eleves:
    print(f"{e['nom']:<8} {e['ville']:<10} {e['note']}")

moyenne = sum(e["note"] for e in eleves) / len(eleves)
print("Moyenne :", round(moyenne, 2))
```

| nom | ville | note |
|---|---|---|
| Awa | Dakar | 15 |
| Kofi | Abidjan | 12 |
| Gloire | Kinshasa | 17 |

Au dernier chapitre, la bibliothèque **pandas** manipulera ce genre de tableaux avec des milliers de lignes, en une seule instruction.

```tip
Dans une f-string, `{e['nom']:<8}` aligne le texte à gauche sur 8 caractères. Pratique pour afficher des tableaux propres. Note les guillemets simples à l'intérieur des guillemets doubles.
```

+++

## Exercice : le stock

```exercise
@title Gestion de stock
@prompt
Le dictionnaire `stock` donne les quantités en réserve. Aujourd'hui :

1. on a vendu **12 croissants** (diminue le stock) ;
2. on a reçu un nouveau produit : **`"Sandwich"`** avec **20** unités (ajoute-le) ;
3. calcule `total` : le nombre total d'unités en stock (tous produits confondus).
@starter
stock = {"Croissant": 40, "Beignet": 25, "Espresso": 100}

total = 
print(stock)
print(total)
@solution
stock = {"Croissant": 40, "Beignet": 25, "Espresso": 100}
stock["Croissant"] -= 12
stock["Sandwich"] = 20

total = sum(stock.values())
print(stock)
print(total)
@hint
stock["Croissant"] -= 12, puis stock["Sandwich"] = 20, et enfin sum(stock.values()).
@check
assert stock.get("Croissant") == 28, f"Il devrait rester 28 croissants, il y en a {stock.get('Croissant')}."
assert stock.get("Sandwich") == 20, "Ajoute la clé \"Sandwich\" avec la valeur 20 (attention à la majuscule)."
assert total == 173, f"Le total devrait être 28 + 25 + 100 + 20 = 173, tu obtiens {total}."
```

+++

## Exercice : le chiffre d'affaires

```exercise
@title Les commandes du jour
@prompt
La liste `commandes` contient les commandes du jour (une par dictionnaire). Calcule :

- `chiffre_affaires` : la somme de `quantite × prix` pour toutes les commandes ;
- `par_ville` : un dictionnaire qui donne le nombre de commandes par ville, par exemple `{"Dakar": 2, ...}`.
@starter
commandes = [
    {"ville": "Dakar", "quantite": 3, "prix": 2.5},
    {"ville": "Paris", "quantite": 1, "prix": 5.0},
    {"ville": "Dakar", "quantite": 2, "prix": 1.8},
    {"ville": "Kinshasa", "quantite": 6, "prix": 1.0},
    {"ville": "Paris", "quantite": 2, "prix": 3.5},
]

chiffre_affaires = 0
par_ville = {}

print(chiffre_affaires)
print(par_ville)
@solution
commandes = [
    {"ville": "Dakar", "quantite": 3, "prix": 2.5},
    {"ville": "Paris", "quantite": 1, "prix": 5.0},
    {"ville": "Dakar", "quantite": 2, "prix": 1.8},
    {"ville": "Kinshasa", "quantite": 6, "prix": 1.0},
    {"ville": "Paris", "quantite": 2, "prix": 3.5},
]

chiffre_affaires = 0
par_ville = {}
for c in commandes:
    chiffre_affaires += c["quantite"] * c["prix"]
    if c["ville"] in par_ville:
        par_ville[c["ville"]] += 1
    else:
        par_ville[c["ville"]] = 1

print(chiffre_affaires)
print(par_ville)
@hint
Une seule boucle for c in commandes suffit. Dans la boucle : chiffre_affaires += c["quantite"] * c["prix"], puis le motif du compteur avec le dictionnaire.
@check
assert abs(chiffre_affaires - 29.1) < 1e-6, f"Le chiffre d'affaires devrait être 29.1, tu obtiens {chiffre_affaires}."
assert par_ville == {"Dakar": 2, "Paris": 2, "Kinshasa": 1}, f"par_ville devrait être {{'Dakar': 2, 'Paris': 2, 'Kinshasa': 1}}, tu obtiens {par_ville}."
```
