---
id: super-pouvoirs
title: Les cinq super-pouvoirs du programmeur
subtitle: Tous les programmes du monde sont construits avec ces briques.
duration: 12
---
## Le secret le mieux gardé

Une application bancaire, un jeu vidéo, le site d'une compagnie aérienne… Ils semblent très différents. Pourtant, ils sont tous fabriqués avec les mêmes cinq briques de base :

1. la **séquence** : faire les choses dans l'ordre ;
2. les **variables** : se souvenir de choses ;
3. les **conditions** : prendre des décisions ;
4. les **boucles** : répéter ;
5. les **fonctions** : donner un nom à un savoir-faire pour le réutiliser.

Tu connais déjà les trois premières sans le savoir. Découvrons-les avec du vrai code Python. Pas besoin de tout comprendre : regarde surtout l'idée.

+++

## Séquence et variables

Une **variable** est une boîte avec une étiquette. On y range une valeur pour s'en souvenir plus tard. Avance pas à pas et observe la mémoire de l'ordinateur.

```widget
@name stepper
@config
{"code": "prix = 500\nquantite = 3\ntotal = prix * quantite\nprint(total)",
 "steps": [
  {"line": 1, "vars": {}, "note": "Python lit la ligne 1 : il va créer une boîte appelée prix."},
  {"line": 2, "vars": {"prix": "500"}, "note": "La boîte prix contient 500. Ligne 2 : une deuxième boîte."},
  {"line": 3, "vars": {"prix": "500", "quantite": "3"}, "note": "Ligne 3 : Python lit le contenu des deux boîtes et les multiplie (* veut dire « fois »)."},
  {"line": 4, "vars": {"prix": "500", "quantite": "3", "total": "1500"}, "note": "Le résultat est rangé dans une nouvelle boîte, total. Ligne 4 : on l'affiche."},
  {"line": 4, "vars": {"prix": "500", "quantite": "3", "total": "1500"}, "out": "1500", "note": "print affiche le contenu de total. Fin du programme !"}
 ]}
```

Remarque la **séquence** : Python exécute les lignes une par une, de haut en bas. La ligne 3 a besoin de `prix` et `quantite` : elle doit venir après eux.

+++

## Les conditions

Une **condition** permet au programme de choisir ce qu'il fait selon la situation. En Python, on écrit `if` (« si »), `elif` (« sinon, si ») et `else` (« sinon »).

Fais glisser le curseur et regarde quelle partie du code est exécutée.

```widget
@name condition
@config
{"name": "temperature", "label": "Température dehors :", "min": -5, "max": 42, "value": 22,
 "branches": [
  {"code": "if temperature < 15:", "lt": 15, "out": "Il fait frais, prends une veste !"},
  {"code": "elif temperature < 30:", "lt": 30, "out": "Il fait bon, profite !"},
  {"code": "else:", "out": "Il fait très chaud, bois beaucoup d'eau !"}
 ]}
```

Le programme n'exécute **qu'une seule** des trois branches : la première dont la condition est vraie.

```quiz
Avec ce programme, qu'affiche-t-on si `temperature` vaut exactement 30 ?
- Il fait frais, prends une veste !
- Il fait bon, profite !
* Il fait très chaud, bois beaucoup d'eau !
> 30 n'est pas plus petit que 15, ni plus petit que 30 (30 < 30 est faux). On arrive donc dans le `else`. Les cas « pile sur la limite » sont des pièges classiques !
```

+++

## Les boucles

Une **boucle** répète des instructions. Ici, `for` répète la ligne décalée une fois pour chaque nombre de 1 à 3. Observe la variable `tour` changer à chaque passage.

```widget
@name stepper
@config
{"code": "for tour in range(1, 4):\n    print(\"Tour numéro\", tour)\nprint(\"Fini !\")",
 "steps": [
  {"line": 1, "vars": {}, "note": "range(1, 4) produit les nombres 1, 2, 3 (le 4 est exclu)."},
  {"line": 2, "vars": {"tour": "1"}, "note": "Premier passage : tour vaut 1."},
  {"line": 1, "vars": {"tour": "1"}, "out": "Tour numéro 1", "note": "On remonte en haut de la boucle pour le nombre suivant."},
  {"line": 2, "vars": {"tour": "2"}, "out": "Tour numéro 1", "note": "Deuxième passage : tour vaut 2."},
  {"line": 1, "vars": {"tour": "2"}, "out": "Tour numéro 1\nTour numéro 2"},
  {"line": 2, "vars": {"tour": "3"}, "out": "Tour numéro 1\nTour numéro 2", "note": "Troisième et dernier passage."},
  {"line": 3, "vars": {"tour": "3"}, "out": "Tour numéro 1\nTour numéro 2\nTour numéro 3", "note": "Plus de nombres : on sort de la boucle et on continue après."},
  {"line": 3, "vars": {"tour": "3"}, "out": "Tour numéro 1\nTour numéro 2\nTour numéro 3\nFini !", "note": "Pour répéter 1000 fois, il suffirait de changer un seul nombre."}
 ]}
```

+++

## Les fonctions

Une **fonction** est un savoir-faire auquel on donne un nom. Pense à une machine à jus : tu mets des fruits (l'**entrée**), elle fait son travail, et elle te rend du jus (la **sortie**). Tu n'as pas besoin de savoir comment elle marche à l'intérieur.

Tu as déjà vu une fonction : `print`. Quelqu'un l'a écrite une fois pour toutes, et des millions de programmeurs l'utilisent chaque jour.

```py static
def prix_ttc(prix_ht):
    return prix_ht * 1.18

print(prix_ttc(1000))
print(prix_ttc(2500))
```

Ici, on crée (avec `def`) une fonction qui ajoute 18 % de taxe à un prix. On l'utilise ensuite autant de fois qu'on veut.

+++

## Reconnais les super-pouvoirs

```quiz
Une application envoie un rappel « Bois de l'eau » **toutes les heures**. Quel super-pouvoir est en jeu ?
- Une variable
- Une condition
* Une boucle
> Répéter la même action à intervalle régulier, c'est une **boucle**.
```

```quiz
« **Si** le solde du compte est inférieur au montant, refuser le paiement. »
* Une condition
- Une boucle
- Une fonction
> Le programme prend une décision selon la situation : c'est une **condition**.
```

```quiz
Ton application de livraison retient l'adresse que tu as tapée pour l'afficher sur la carte. Elle utilise…
- une boucle
* une variable
- une fonction
> Garder une valeur en mémoire pour s'en servir plus tard, c'est le rôle d'une **variable**.
```

+++

## La vraie compétence : découper

Face à un gros problème, un programmeur ne se lance pas tête baissée. Il le **découpe** en petits problèmes simples. Par exemple, « créer une application de livraison de repas » devient :

- afficher la liste des restaurants (une boucle sur les restaurants) ;
- retenir le panier du client (des variables) ;
- vérifier que le paiement est accepté (une condition) ;
- calculer le prix total (une fonction) ;
- …

Chaque petit morceau devient facile. Cette façon de penser s'appelle la **pensée informatique**, et elle te servira même en dehors de la programmation.

```note
Séquence, variables, conditions, boucles, fonctions.
Tu as maintenant la carte du territoire. Le reste du cours, c'est le voyage.
```
