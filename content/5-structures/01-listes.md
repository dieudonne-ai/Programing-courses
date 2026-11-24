---
id: listes
title: Les listes
subtitle: Ranger plusieurs valeurs dans une seule variable.
duration: 15
---
## Une variable, plein de valeurs

Imagine les notes de 30 élèves. Créer 30 variables `note1`, `note2`… serait absurde. On utilise une **liste** : une suite ordonnée de valeurs, entre **crochets**, séparées par des virgules.

```py
notes = [12, 15, 9, 17, 14]
villes = ["Kinshasa", "Abidjan", "Dakar"]
melange = ["Awa", 24, True, 1.75]

print(notes)
print(len(villes))
```

`len()` donne le nombre d'éléments, comme pour un texte.

+++

## Accéder aux éléments

Comme pour les textes, chaque élément a une **position** qui commence à **0**.

```py
villes = ["Kinshasa", "Abidjan", "Dakar", "Paris", "Montréal"]
print(villes[0])
print(villes[2])
print(villes[-1])
print(villes[1:3])
```

```predict
fruits = ["mangue", "ananas", "papaye", "banane"]
print(fruits[1])
???
- mangue
* ananas
- papaye
> La position 0 est « mangue », la position 1 est « ananas ». On compte toujours à partir de 0 !
```

Et si on demande une position qui n'existe pas ?

```py
villes = ["Kinshasa", "Abidjan", "Dakar"]
print(villes[3])
```

`IndexError` : la liste a 3 éléments, aux positions 0, 1 et 2. La position 3 n'existe pas.

+++

## Modifier une liste

Contrairement aux textes, les listes sont **modifiables**.

```py
courses = ["riz", "huile"]
courses.append("tomates")       # ajoute à la fin
courses.insert(0, "pain")       # insère à la position 0
courses[1] = "riz parfumé"      # remplace l'élément en position 1
courses.remove("huile")         # supprime cet élément
dernier = courses.pop()         # retire et renvoie le dernier
print(courses)
print("Retiré :", dernier)
print("riz parfumé" in courses)
```

| Méthode | Effet |
|---|---|
| `.append(x)` | ajoute x à la fin |
| `.insert(i, x)` | insère x à la position i |
| `.remove(x)` | supprime la première occurrence de x |
| `.pop()` | retire le dernier élément et le renvoie |
| `.sort()` | trie la liste |
| `.count(x)` | compte les x |

+++

## Calculer sur une liste

Python offre des fonctions toutes prêtes pour les listes de nombres :

```py
ventes = [120, 95, 210, 180, 75, 160, 230]
print("Total :", sum(ventes))
print("Minimum :", min(ventes))
print("Maximum :", max(ventes))
print("Moyenne :", round(sum(ventes) / len(ventes), 1))
print("Triées :", sorted(ventes))
print("Du plus grand au plus petit :", sorted(ventes, reverse=True))
```

`sorted(liste)` renvoie une **nouvelle** liste triée, alors que `liste.sort()` trie la liste elle-même.

+++

## Parcourir une liste

La boucle `for` parcourt une liste élément par élément. C'est l'association la plus utilisée de Python.

```py
temperatures = [28, 31, 35, 30, 27, 33, 36]
jours_chauds = 0
for t in temperatures:
    if t > 32:
        jours_chauds += 1
        print(f"{t} °C : il fait chaud !")
print(f"{jours_chauds} jours au-dessus de 32 °C")
```

On peut aussi **construire** une liste dans une boucle : on part d'une liste vide `[]` et on fait des `append`.

```py
prix_ht = [1000, 2500, 400]
prix_ttc = []
for p in prix_ht:
    prix_ttc.append(p * 1.18)
print(prix_ttc)
```

+++

## Exercice : la meilleure note, à la main

```exercise
@title L'algorithme du chapitre 1
@prompt
Au chapitre 1, tu as remis dans l'ordre l'algorithme qui trouve la meilleure note. Écris-le maintenant en Python !

Trouve la plus grande valeur de la liste `notes` **sans utiliser `max()`**, et range-la dans `meilleure`.

Rappel de l'algorithme : retiens la première note, puis parcours les notes ; si une note est plus grande que celle retenue, retiens-la à la place.
@starter
notes = [12, 15, 9, 17, 14, 11, 16]

meilleure = notes[0]

print(meilleure)
@solution
notes = [12, 15, 9, 17, 14, 11, 16]

meilleure = notes[0]
for n in notes:
    if n > meilleure:
        meilleure = n

print(meilleure)
@hint
for n in notes: puis if n > meilleure: puis meilleure = n
@check
assert "max(" not in CODE, "Pas de max() ici : le but est d'écrire l'algorithme toi-même."
assert "for" in CODE, "Parcours la liste avec une boucle for."
assert meilleure == 17, f"La meilleure note est 17, ton programme trouve {meilleure}."
```

+++

## Exercice : le bulletin

```exercise
@title Le bulletin de la classe
@prompt
À partir de la liste `notes` :

1. ajoute la note `18` d'une élève absente lors de la saisie (avec `append`) ;
2. calcule `moyenne`, la moyenne de la classe arrondie à 2 décimales ;
3. calcule `nb_admis`, le nombre de notes supérieures ou égales à 10.
@starter
notes = [12, 8, 15, 9.5, 14, 6, 17, 11]

moyenne = 
nb_admis = 0

print(moyenne, nb_admis)
@solution
notes = [12, 8, 15, 9.5, 14, 6, 17, 11]
notes.append(18)

moyenne = round(sum(notes) / len(notes), 2)
nb_admis = 0
for n in notes:
    if n >= 10:
        nb_admis += 1

print(moyenne, nb_admis)
@hint
notes.append(18) ; moyenne = round(sum(notes) / len(notes), 2) ; puis un compteur dans une boucle for.
@check
assert len(notes) == 9 and notes[-1] == 18, "Ajoute la note 18 à la fin de la liste avec notes.append(18)."
assert moyenne == round(110.5 / 9, 2), f"La moyenne attendue est {round(110.5 / 9, 2)}, tu obtiens {moyenne}."
assert nb_admis == 6, f"Il y a 6 notes supérieures ou égales à 10, tu en comptes {nb_admis}."
```
