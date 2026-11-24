---
id: algorithmes
title: Les algorithmes, des recettes pour machines
subtitle: Avant d'écrire du code, on écrit une méthode.
duration: 10
---
## Un mot savant pour une idée simple

Un **algorithme**, c'est une suite d'étapes précises pour résoudre un problème. Tu en utilises tous les jours sans le savoir :

- une **recette de cuisine** est un algorithme pour faire un plat ;
- un **itinéraire** (« tout droit, puis à gauche au rond-point ») est un algorithme pour arriver quelque part ;
- la **méthode de la division** apprise à l'école est un algorithme de calcul.

Un programme, c'est un algorithme traduit dans une langue que l'ordinateur comprend.

+++

## Remets la recette dans l'ordre

Voici l'algorithme pour préparer une tasse de thé. Les étapes ont été mélangées. Remets-les dans le bon ordre (avec les flèches ou en les faisant glisser).

```widget
@name order
@config
{"prompt": "Préparer une tasse de thé", "items": [
  "Remplir la bouilloire avec de l'eau",
  "Allumer la bouilloire et attendre que l'eau bouille",
  "Verser l'eau bouillante dans la tasse",
  "Plonger le sachet de thé dans l'eau chaude",
  "Attendre 3 minutes",
  "Retirer le sachet de la tasse"
]}
```

+++

## La précision avant tout

Un humain comprend « ajoute un peu de sel ». Un ordinateur, non : combien de grammes ? Quel sel ? Ajouter où ?

Il y a une vieille blague de programmeurs :

> Une personne dit à son ami programmeur : « Va acheter une baguette. S'il y a des œufs, prends-en six. »
> Il revient avec six baguettes.

```quiz
Pourquoi le programmeur revient-il avec six baguettes ?
- Il avait très faim
* La consigne était ambiguë : « en prendre six » pouvait désigner les baguettes
- Il n'y avait plus d'œufs
> Il y avait des œufs, donc il a appliqué « prends-en six »… aux baguettes, le seul objet dont on parlait. Un ordinateur aurait fait pareil. Une instruction doit avoir **un seul sens possible**.
```

+++

## Décider et répéter

Regarde bien les recettes : elles contiennent souvent deux mots magiques.

- **Si** : « *Si* tu aimes le thé sucré, ajoute un sucre. » C'est une **condition** : on fait l'action seulement dans certains cas.
- **Tant que** / **Répète** : « *Tant que* l'eau ne bout pas, attends. » C'est une **boucle** : on répète une action.

Voici un algorithme célèbre : trouver le plus grand nombre d'une liste, par exemple les notes d'une classe. Remets les étapes dans l'ordre.

```widget
@name order
@config
{"prompt": "Trouver la meilleure note de la classe", "items": [
  "Lire la première note et la retenir comme « meilleure note pour l'instant »",
  "Passer à la note suivante",
  "**Si** elle est plus grande que la note retenue, la retenir à la place",
  "**Répéter** les deux étapes précédentes jusqu'à la dernière note",
  "Annoncer la note retenue : c'est la meilleure"
], "success": "Exactement. Tu viens d'écrire un vrai algorithme avec une condition et une boucle. Dans quelques chapitres, tu l'écriras en Python."}
```

+++

## Le robot apprend à répéter

Écrire « Avancer » six fois de suite, c'est long. Les programmeurs détestent se répéter ! Dans ce nouveau défi, tu peux cliquer sur le petit bouton **×1** d'une instruction pour la répéter 2, 3, 4 ou 5 fois.

Attention : chaque niveau impose un nombre maximum de blocs.

```widget
@name robot
@config
{"loops": true, "levels": [
  {"grid": ["S.....G"], "dir": "E", "maxBlocks": 1, "hint": "Une seule instruction, répétée."},
  {"grid": ["S....", ".#.#.", "....G"], "dir": "E", "maxBlocks": 3},
  {"grid": ["S..#", "##.#", "G..#"], "dir": "E", "maxBlocks": 5, "hint": "Le robot doit faire demi-tour par le bas."}
]}
```

+++

## À retenir

- Un **algorithme** est une méthode en étapes précises, sans ambiguïté.
- L'**ordre** des étapes compte.
- Deux outils reviennent partout : la **condition** (si…) et la **boucle** (répéter…).

```quiz
« Tant qu'il reste des clients dans la file, servir le client suivant. » Qu'est-ce que c'est ?
- Une condition
* Une boucle
- Une erreur
> « Tant que » répète une action plusieurs fois : c'est une **boucle**. Elle s'arrête quand la file est vide.
```
