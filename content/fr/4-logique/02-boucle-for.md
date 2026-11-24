---
id: boucle-for
title: Répéter avec for
subtitle: Faire travailler l'ordinateur à ta place.
duration: 14
---
## La boucle for

Une **boucle** répète un bloc de code. La boucle `for` le répète **pour chaque élément** d'une séquence.

```py
for i in range(5):
    print("Je ne dois pas bavarder en classe.")
```

Cinq lignes avec deux lignes de code. Pour en avoir 500, change juste le 5. Comme pour `if`, la ligne `for` finit par `:` et le bloc répété est indenté.

+++

## range(), le générateur de nombres

`range` produit une suite de nombres entiers :

| Écriture | Nombres produits |
|---|---|
| `range(5)` | 0, 1, 2, 3, 4 |
| `range(1, 6)` | 1, 2, 3, 4, 5 |
| `range(0, 20, 5)` | 0, 5, 10, 15 |
| `range(10, 0, -1)` | 10, 9, … 1 |

La valeur de fin est toujours **exclue**. La variable de boucle (ici `n`) prend chaque valeur à tour de rôle :

```py
for n in range(1, 6):
    print(n, "au carré =", n ** 2)
```

```predict
for i in range(2, 8, 2):
    print(i)
???
- 2 4 6 8
* 2 4 6
- 2 3 4 5 6 7
> On part de 2, on avance de 2 en 2, et on s'arrête **avant** 8 : 2, 4, 6.
```

+++

## Parcourir un texte

`for` fonctionne sur tout ce qui contient plusieurs éléments. Un texte, par exemple, contient des caractères :

```py
for lettre in "Bissap":
    print(lettre)
```

Et bientôt, tu parcourras des listes de ventes, de notes ou de clients avec exactement la même syntaxe.

+++

## Le motif de l'accumulateur

Voici le motif le plus important de toute la programmation de données : **accumuler** un résultat dans une variable.

```widget
@name stepper
@config
{"code": "ventes_semaine = 0\nfor jour in range(1, 4):\n    ventes_semaine = ventes_semaine + 100 * jour\nprint(ventes_semaine)",
 "steps": [
  {"line": 1, "vars": {}, "note": "On prépare une boîte qui démarre à 0."},
  {"line": 2, "vars": {"ventes_semaine": "0"}, "note": "Début de la boucle : jour prendra les valeurs 1, 2, 3."},
  {"line": 3, "vars": {"ventes_semaine": "0", "jour": "1"}, "note": "0 + 100 × 1 = 100"},
  {"line": 3, "vars": {"ventes_semaine": "100", "jour": "2"}, "note": "100 + 100 × 2 = 300"},
  {"line": 3, "vars": {"ventes_semaine": "300", "jour": "3"}, "note": "300 + 100 × 3 = 600"},
  {"line": 4, "vars": {"ventes_semaine": "600", "jour": "3"}, "out": "600", "note": "La boucle est finie : la boîte contient le total."}
 ]}
```

En Python, `total = total + x` s'écrit aussi `total += x`. C'est plus court et très courant.

```py
total = 0
for n in range(1, 11):
    total += n
print("La somme de 1 à 10 vaut", total)
```

+++

## Compter

Un cas particulier de l'accumulateur : le **compteur**. On ajoute 1 à chaque fois qu'une condition est vraie. Ici, on combine `for` et `if` :

```py
phrase = "les données sont partout autour de nous"
nb_o = 0
for lettre in phrase:
    if lettre == "o":
        nb_o += 1
print(f"Il y a {nb_o} fois la lettre o")
```

Remarque les **deux niveaux d'indentation** : le `if` est dans la boucle, et le `nb_o += 1` est dans le `if`.

+++

## Exercice : la table de multiplication

```exercise
@title Table de 7
@prompt
Avec une boucle `for`, affiche la table de multiplication de 7, de 1 à 10, sous cette forme :

    7 x 1 = 7
    7 x 2 = 14
    ...
    7 x 10 = 70
@starter
n = 7

@solution
n = 7

for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")
@hint
for i in range(1, 11): puis, dans la boucle, print(f"{n} x {i} = {n * i}")
@check
assert "for" in CODE, "Utilise une boucle for."
lignes = [l.strip() for l in OUT.strip().split("\n")]
attendu = [f"7 x {i} = {7 * i}" for i in range(1, 11)]
assert len(lignes) == 10, f"Il faut 10 lignes, ton programme en affiche {len(lignes)}."
assert lignes == attendu, f"Vérifie le format. Première ligne attendue : « 7 x 1 = 7 », obtenue : « {lignes[0]} »."
```

+++

## Exercice : la somme

```exercise
@title La somme des 100 premiers nombres
@prompt
On raconte qu'un élève de 9 ans, Carl Friedrich Gauss, a calculé de tête la somme 1 + 2 + 3 + … + 100. Toi, tu as Python.

Calcule cette somme avec une boucle et un accumulateur, dans une variable `somme`, puis affiche-la.
@starter
somme = 0

print(somme)
@solution
somme = 0
for n in range(1, 101):
    somme += n
print(somme)
@hint
range(1, 101) produit les nombres de 1 à 100. À chaque tour : somme += n.
@check
assert "for" in CODE, "Utilise une boucle for."
assert somme == 5050, f"La somme devrait valoir 5050, tu obtiens {somme}. Vérifie les bornes de ton range (la fin est exclue)."
assert "5050" not in CODE, "Ne tape pas le résultat à la main : calcule-le avec la boucle."
```

+++

## Exercice : compter les voyelles

```exercise
@title Compteur de voyelles
@prompt
Compte le nombre de voyelles (a, e, i, o, u, y) dans la variable `phrase` et range le résultat dans `nb_voyelles`. Affiche-le.

Astuce : `lettre in "aeiouy"` vaut `True` si la lettre est une voyelle.
@starter
phrase = "python est un langage magnifique"
nb_voyelles = 0

print(nb_voyelles)
@solution
phrase = "python est un langage magnifique"
nb_voyelles = 0
for lettre in phrase:
    if lettre in "aeiouy":
        nb_voyelles += 1
print(nb_voyelles)
@hint
for lettre in phrase: puis if lettre in "aeiouy": puis nb_voyelles += 1 (attention aux deux niveaux de décalage).
@check
attendu = sum(1 for c in "python est un langage magnifique" if c in "aeiouy")
assert nb_voyelles == attendu, f"Il y a {attendu} voyelles dans la phrase, ton programme en compte {nb_voyelles}."
assert "for" in CODE, "Utilise une boucle for."
```
