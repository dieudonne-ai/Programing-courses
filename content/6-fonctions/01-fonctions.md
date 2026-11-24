---
id: fonctions
title: Créer tes propres fonctions
subtitle: def, paramètres et return.
duration: 15
---
## Pourquoi des fonctions ?

Tu utilises déjà des fonctions : `print()`, `len()`, `round()`, `sum()`… Quelqu'un les a écrites une fois, et tout le monde les réutilise.

Tu vas maintenant créer **les tiennes**. Une fonction, c'est un morceau de code auquel on donne un nom, pour :

- **ne pas se répéter** : on écrit le code une fois, on l'utilise cent fois ;
- **organiser** : un gros programme devient une suite de petites fonctions claires ;
- **corriger plus facilement** : une erreur se corrige à un seul endroit.

+++

## Définir et appeler

On **définit** une fonction avec `def`, son nom, des parenthèses et deux-points. Le corps est indenté.

```py
def saluer():
    print("Bonjour !")
    print("Bienvenue au Café Baobab.")

saluer()
saluer()
```

Définir une fonction ne l'exécute pas : on lui apprend un savoir-faire. Ensuite, on l'**appelle** en écrivant son nom suivi de parenthèses. Ici, deux appels, donc deux accueils.

+++

## Les paramètres

Les **paramètres** sont les entrées de la fonction : des variables qui reçoivent les valeurs données lors de l'appel.

```py
def saluer(prenom, ville):
    print(f"Bonjour {prenom}, bienvenue au café de {ville} !")

saluer("Awa", "Dakar")
saluer("Gloire", "Kinshasa")
```

Lors du premier appel, `prenom` vaut `"Awa"` et `ville` vaut `"Dakar"`. Lors du second, d'autres valeurs. Même code, résultats différents.

+++

## return : renvoyer un résultat

`print` **affiche** une valeur. `return` **renvoie** une valeur au code qui a appelé la fonction, pour qu'il puisse s'en servir : la ranger dans une variable, faire un calcul…

```py
def prix_ttc(prix_ht, taux=0.18):
    return prix_ht * (1 + taux)

a = prix_ttc(1000)
b = prix_ttc(2500)
print(a + b)
print(round(prix_ttc(99.99), 2))
```

```warn
`return` termine la fonction immédiatement : les lignes suivantes du bloc ne sont pas exécutées.
```

```quiz
Quelle est la différence entre `print` et `return` dans une fonction ?
- Aucune, c'est pareil
* `print` affiche à l'écran ; `return` renvoie une valeur réutilisable par le programme
- `return` affiche en plus gros
> Une fonction qui fait seulement `print` ne renvoie rien (en réalité, elle renvoie `None`). On ne peut pas réutiliser son résultat dans un calcul. Les fonctions utiles renvoient presque toujours leur résultat avec `return`.
```

+++

## print ou return ? La preuve

```py
def double_print(x):
    print(x * 2)

def double_return(x):
    return x * 2

resultat1 = double_print(5)
resultat2 = double_return(5)
print("resultat1 =", resultat1)
print("resultat2 =", resultat2)
```

`double_print` affiche 10, mais `resultat1` vaut `None` (rien). `double_return` n'affiche rien, mais `resultat2` vaut bien 10.

+++

## Une fonction peut contenir de la logique

Une fonction peut contenir des conditions, des boucles, et plusieurs `return`.

```py
def mention(note):
    if note >= 16:
        return "Très bien"
    elif note >= 14:
        return "Bien"
    elif note >= 12:
        return "Assez bien"
    elif note >= 10:
        return "Admis"
    return "Ajourné"

for n in [17, 13, 8, 10]:
    print(n, "→", mention(n))
```

+++

## Exercices

```exercise
@title Surface d'un terrain
@prompt
Écris une fonction `surface(longueur, largeur)` qui **renvoie** (avec `return`) la surface d'un terrain rectangulaire.

Puis affiche la surface d'un terrain de 25 m sur 18 m.
@starter
def surface(longueur, largeur):
    ...

print(surface(25, 18))
@solution
def surface(longueur, largeur):
    return longueur * largeur

print(surface(25, 18))
@hint
Remplace les ... par return longueur * largeur
@check
assert "surface" in dir() and callable(surface), "Définis une fonction nommée surface."
assert surface(25, 18) == 450, f"surface(25, 18) devrait renvoyer 450, elle renvoie {surface(25, 18)}."
assert surface(3, 4) == 12, "surface(3, 4) devrait renvoyer 12."
assert "450" in OUT, "Affiche le résultat de surface(25, 18)."
```

```exercise
@title Est-ce un nombre pair ?
@prompt
Écris une fonction `est_pair(n)` qui renvoie `True` si `n` est pair, `False` sinon.

Puis utilise-la dans une compréhension de liste pour créer `pairs`, la liste des nombres pairs de `nombres`.
@starter
def est_pair(n):
    ...

nombres = [3, 8, 15, 22, 41, 60]
pairs = 
print(pairs)
@solution
def est_pair(n):
    return n % 2 == 0

nombres = [3, 8, 15, 22, 41, 60]
pairs = [n for n in nombres if est_pair(n)]
print(pairs)
@hint
return n % 2 == 0, puis [n for n in nombres if est_pair(n)]
@check
assert est_pair(4) is True and est_pair(7) is False and est_pair(0) is True, "est_pair doit renvoyer True pour les nombres pairs et False pour les impairs."
assert pairs == [8, 22, 60], f"pairs devrait valoir [8, 22, 60], tu obtiens {pairs}."
assert "est_pair(" in CODE.split("pairs =")[1], "Utilise ta fonction est_pair dans la compréhension de liste."
```

```exercise
@title Le tarif du taxi
@prompt
Un taxi facture **500 francs de prise en charge**, plus **250 francs par kilomètre**. La nuit, le prix total est **majoré de 20 %**.

Écris une fonction `prix_course(km, nuit)` qui renvoie le prix, où `nuit` vaut `True` ou `False`.
@starter
def prix_course(km, nuit):
    ...

print(prix_course(10, False))
print(prix_course(10, True))
@solution
def prix_course(km, nuit):
    prix = 500 + 250 * km
    if nuit:
        prix = prix * 1.2
    return prix

print(prix_course(10, False))
print(prix_course(10, True))
@hint
Calcule d'abord prix = 500 + 250 * km. Puis, si nuit est vrai, multiplie par 1.2. Enfin, return prix.
@check
assert prix_course(10, False) == 3000, f"Pour 10 km de jour : 500 + 2500 = 3000. Ta fonction renvoie {prix_course(10, False)}."
assert abs(prix_course(10, True) - 3600) < 1e-6, f"Pour 10 km de nuit : 3000 × 1.2 = 3600. Ta fonction renvoie {prix_course(10, True)}."
assert prix_course(0, False) == 500, "Pour 0 km, il reste la prise en charge de 500 francs."
```
