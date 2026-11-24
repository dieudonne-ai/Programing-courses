---
id: tuples-ensembles
title: Tuples et ensembles
subtitle: Deux cousins de la liste, chacun avec son super-pouvoir.
duration: 10
---
## Le tuple : une liste figée

Un **tuple** s'écrit entre **parenthèses**. Il ressemble à une liste, mais on ne peut plus le modifier une fois créé. On l'utilise pour des valeurs qui vont ensemble et ne doivent pas changer : des coordonnées GPS, une date, une couleur…

```py
kinshasa = (-4.32, 15.31)
print(kinshasa[0])
print(len(kinshasa))
kinshasa[0] = 0
```

L'erreur est voulue : un tuple est **immuable**. Cette garantie évite des modifications accidentelles.

+++

## Le déballage

Super-pouvoir du tuple : on peut le **déballer** dans plusieurs variables d'un coup.

```py
point = (-4.32, 15.31)
latitude, longitude = point
print("Latitude :", latitude)
print("Longitude :", longitude)

# Échanger deux variables en une ligne
a, b = 1, 2
a, b = b, a
print(a, b)
```

Tu as déjà utilisé le déballage sans le savoir : dans `for produit, quantite in stock.items()`, chaque paire est un tuple déballé.

+++

## L'ensemble : zéro doublon

Un **ensemble** (`set`) s'écrit entre accolades, sans clés. Il ne garde **qu'un exemplaire** de chaque valeur, et n'a pas d'ordre.

```py
villes_clients = ["Dakar", "Paris", "Dakar", "Abidjan", "Paris", "Dakar"]
villes_uniques = set(villes_clients)
print(villes_uniques)
print("Nombre de villes différentes :", len(villes_uniques))
```

`len(set(liste))` est l'astuce classique pour compter les **valeurs distinctes**. Une question qu'un analyste pose tous les jours : combien de clients différents ? Combien de produits distincts vendus ?

+++

## Opérations d'ensembles

Les ensembles savent faire les opérations des diagrammes de Venn :

```py
clients_janvier = {"Awa", "Kofi", "Grace", "Moussa"}
clients_fevrier = {"Grace", "Moussa", "Inès", "David"}

print("Venus les deux mois :", clients_janvier & clients_fevrier)
print("Tous les clients :", clients_janvier | clients_fevrier)
print("Perdus en février :", clients_janvier - clients_fevrier)
```

```quiz
Quel type choisir pour stocker la liste des **pays différents** d'où viennent les visiteurs d'un site ?
- Une liste
- Un tuple
* Un ensemble
> Un ensemble élimine automatiquement les doublons : chaque pays n'y apparaît qu'une fois.
```

+++

## Récapitulatif des structures

| Type | Syntaxe | Ordonné | Modifiable | Doublons |
|---|---|---|---|---|
| liste | `[1, 2, 3]` | oui | oui | oui |
| tuple | `(1, 2, 3)` | oui | non | oui |
| ensemble | `{1, 2, 3}` | non | oui | non |
| dictionnaire | `{"a": 1}` | oui | oui | clés uniques |

```exercise
@title Les clients fidèles
@prompt
Deux listes contiennent les noms des clients d'un café en mai et en juin (avec des doublons, car un client peut venir plusieurs fois).

Calcule :

- `nb_mai` : le nombre de clients **différents** en mai ;
- `fideles` : l'**ensemble** des clients venus en mai **et** en juin.
@starter
mai = ["Awa", "Kofi", "Awa", "Inès", "Moussa", "Kofi", "Awa"]
juin = ["Inès", "David", "Awa", "Inès", "Rachel"]

nb_mai = 
fideles = 

print(nb_mai)
print(fideles)
@solution
mai = ["Awa", "Kofi", "Awa", "Inès", "Moussa", "Kofi", "Awa"]
juin = ["Inès", "David", "Awa", "Inès", "Rachel"]

nb_mai = len(set(mai))
fideles = set(mai) & set(juin)

print(nb_mai)
print(fideles)
@hint
Transforme chaque liste en ensemble avec set(...). len() donne le nombre d'éléments, & donne l'intersection.
@check
assert nb_mai == 4, f"Il y a 4 clients différents en mai (Awa, Kofi, Inès, Moussa), tu en comptes {nb_mai}."
assert isinstance(fideles, set), "fideles doit être un ensemble (set)."
assert fideles == {"Awa", "Inès"}, f"Les clients venus les deux mois sont Awa et Inès, tu obtiens {fideles}."
```
