---
id: boucle-while
title: Répéter avec while
subtitle: Tant que… et comment éviter la boucle infinie.
duration: 12
---
## Tant que la condition est vraie

`for` répète un nombre de fois connu à l'avance. Mais parfois, on ne sait pas combien de tours il faudra. On utilise alors `while` (« tant que ») : le bloc est répété **tant que** la condition reste vraie.

```py
epargne = 0
mois = 0
while epargne < 100000:
    epargne += 15000
    mois += 1
print(f"Objectif atteint en {mois} mois, avec {epargne} francs")
```

On ne savait pas à l'avance qu'il faudrait 7 mois : c'est la boucle qui l'a trouvé.

+++

## La boucle infinie

Si la condition ne devient **jamais** fausse, la boucle ne s'arrête jamais. C'est la **boucle infinie**, le piège classique.

```py static
compteur = 1
while compteur <= 5:
    print(compteur)
    # oups : on a oublié compteur += 1
```

Ici, `compteur` vaut toujours 1, donc `compteur <= 5` est toujours vrai. Le programme tourne pour l'éternité.

```info
Pas de panique si ça t'arrive sur ce site : au bout de quelques secondes, le programme est arrêté automatiquement et Python redémarre. Sur ton ordinateur, on arrête un programme bloqué avec Ctrl + C.
```

```quiz
Que manque-t-il le plus souvent dans une boucle infinie ?
- Le `print`
* La ligne qui fait évoluer la variable testée par la condition
- Les deux-points
> Pour que la boucle s'arrête, il faut qu'à chaque tour quelque chose rapproche la condition du « faux » : augmenter un compteur, diminuer un stock, etc.
```

+++

## Sortir plus tôt : break et continue

- `break` arrête la boucle **immédiatement** ;
- `continue` saute **au tour suivant**, sans exécuter la fin du bloc.

```py
# On cherche le premier multiple de 7 supérieur à 50
n = 51
while True:
    if n % 7 == 0:
        break
    n += 1
print("Trouvé :", n)
```

`while True` est une boucle volontairement infinie : seul le `break` en sort. C'est un motif courant quand on cherche quelque chose.

```py
for n in range(1, 11):
    if n % 3 == 0:
        continue
    print(n)
```

Les multiples de 3 sont sautés grâce à `continue`.

+++

## Un petit jeu

Combinons `while`, `input` et `if`. Le programme a choisi un nombre secret ; tu as plusieurs essais. Tes propositions vont dans la case Entrées, une par ligne. Exécute avec les valeurs proposées, puis essaie les tiennes.

```py inputs=50|25|37
secret = 37
essais = 0
trouve = False

while not trouve:
    proposition = int(input("Ton nombre ? "))
    essais += 1
    if proposition < secret:
        print("C'est plus !")
    elif proposition > secret:
        print("C'est moins !")
    else:
        trouve = True

print(f"Bravo, trouvé en {essais} essais !")
```

En coupant l'intervalle en deux à chaque fois (50, puis 25, puis 37…), on trouve n'importe quel nombre entre 1 et 100 en 7 essais maximum. C'est un algorithme célèbre : la **recherche dichotomique**.

+++

## Exercice : la population

```exercise
@title Le doublement
@prompt
Une ville compte `population = 500000` habitants. Elle grandit de **4 % par an** (chaque année, on multiplie la population par 1.04).

Avec une boucle `while`, calcule combien d'années (`annees`) il faut pour que la population **dépasse 1 million** (strictement plus de 1 000 000). Affiche `annees`.
@starter
population = 500000
annees = 0

print(annees)
@solution
population = 500000
annees = 0
while population <= 1000000:
    population = population * 1.04
    annees += 1
print(annees)
@hint
while population <= 1000000: puis, dans la boucle, multiplie population par 1.04 et ajoute 1 à annees.
@check
assert "while" in CODE, "Utilise une boucle while."
assert annees == 18, f"Il faut 18 ans pour dépasser 1 million, ton programme trouve {annees}."
```

+++

## Exercice : le compte à rebours

```exercise
@title Décollage
@prompt
Avec une boucle `while`, affiche un compte à rebours de 5 à 1, un nombre par ligne, puis `Décollage !`.
@starter
compte = 5

@solution
compte = 5
while compte > 0:
    print(compte)
    compte -= 1
print("Décollage !")
@hint
while compte > 0: puis print(compte) et compte -= 1. Le print("Décollage !") se place après la boucle (sans décalage).
@check
assert "while" in CODE, "Utilise une boucle while."
lignes = [l.strip() for l in OUT.strip().split("\n")]
assert lignes == ["5", "4", "3", "2", "1", "Décollage !"], f"Attendu : 5, 4, 3, 2, 1 puis Décollage ! (une valeur par ligne). Obtenu : {lignes}"
```
