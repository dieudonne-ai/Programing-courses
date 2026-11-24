---
id: booleens
title: Vrai ou faux, et conversions
subtitle: Les booléens, les comparaisons et la fonction input().
duration: 14
---
## Seulement deux valeurs

Un **booléen** (`bool`) ne peut valoir que deux choses : `True` (vrai) ou `False` (faux). Avec une majuscule, sans guillemets.

On les obtient surtout en **comparant** des valeurs :

| Symbole | Signification |
|---|---|
| `==` | est égal à |
| `!=` | est différent de |
| `<` / `>` | plus petit / plus grand |
| `<=` / `>=` | plus petit ou égal / plus grand ou égal |

```py
age = 17
print(age >= 18)
print(age == 17)
print("Dakar" == "dakar")
print(10 != 3)
```

```warn
Ne confonds pas `=` et `==`. Un seul `=` **range** une valeur dans une variable. Deux `==` **posent une question** : « est-ce égal ? ».
```

+++

## Combiner : and, or, not

- `and` (et) : vrai si **les deux** conditions sont vraies ;
- `or` (ou) : vrai si **au moins une** est vraie ;
- `not` (non) : inverse vrai et faux.

```py
age = 22
a_un_billet = True
print(age >= 18 and a_un_billet)
print(age < 12 or age > 65)
print(not a_un_billet)
```

```quiz
Une promo s'applique si le client a une carte de fidélité **ou** si son panier dépasse 50 euros. Le client n'a pas de carte et son panier fait 60 euros. A-t-il la promo ?
* Oui
- Non
> `False or True` donne `True` : avec `or`, une seule condition vraie suffit.
```

```predict
x = 5
print(x > 1 and x < 4)
???
- True
* False
- 5
> `x > 1` est vrai, mais `x < 4` est faux. Avec `and`, il faut que les deux soient vraies : le résultat est `False`.
```

+++

## Convertir d'un type à l'autre

On passe souvent d'un type à un autre :

- `int("25")` transforme le texte `"25"` en nombre entier 25 ;
- `float("3.5")` donne le nombre à virgule 3.5 ;
- `str(25)` donne le texte `"25"`.

```py
texte = "25"
nombre = int(texte)
print(texte * 2)
print(nombre * 2)
print(type(texte), type(nombre))
```

Même valeur affichée, comportements très différents : le texte se répète, le nombre se multiplie. Et si la conversion est impossible, Python le dit :

```py
int("vingt-cinq")
```

+++

## Demander une valeur avec input()

`input()` pose une question à l'utilisateur et attend sa réponse. **La réponse est toujours du texte**, même si on tape un nombre.

Sur ce site, comme il n'y a pas de clavier « en direct » pendant l'exécution, tu tapes tes réponses à l'avance dans la case **Entrées** sous l'éditeur, une par ligne. Exécute, puis remplace les valeurs par ton prénom et ton année de naissance.

```py inputs=Awa|2001
prenom = input("Comment t'appelles-tu ? ")
annee = input("En quelle année es-tu né(e) ? ")
age = 2026 - int(annee)
print(f"Enchanté {prenom}, tu as (ou vas avoir) {age} ans cette année.")
```

Sans le `int(annee)`, la soustraction serait impossible : on ne soustrait pas un texte à un nombre.

+++

## Exercice : peut-il voter ?

```exercise
@title Le droit de vote
@prompt
À partir de la variable `age`, crée une variable `peut_voter` qui vaut `True` si l'âge est supérieur **ou égal** à 18, et `False` sinon. Affiche-la.

Ton code doit fonctionner pour n'importe quel âge : n'écris pas `True` à la main, utilise une comparaison.
@starter
age = 20

peut_voter = 
print(peut_voter)
@solution
age = 20

peut_voter = age >= 18
print(peut_voter)
@hint
Une comparaison donne directement True ou False : peut_voter = age >= 18
@check
assert isinstance(peut_voter, bool), "peut_voter doit être un booléen (True ou False), obtenu avec une comparaison."
assert ">=" in CODE or ">" in CODE, "Utilise une comparaison avec age."
code_test = CODE.replace("age = 20", "age = 18", 1)
ns = {}
exec(code_test.replace("print(", "(lambda *a, **k: None)("), ns)
assert ns["peut_voter"] is True, "Avec age = 18, peut_voter devrait être True (18 ans, c'est « supérieur ou égal »)."
ns = {}
exec(CODE.replace("age = 20", "age = 15", 1).replace("print(", "(lambda *a, **k: None)("), ns)
assert ns["peut_voter"] is False, "Avec age = 15, peut_voter devrait être False."
```

+++

## Exercice : la caisse

```exercise
@title La caisse enregistreuse
@prompt
Le programme demande le **prix** d'un article puis la **quantité** avec `input()`. Les réponses sont déjà dans la case Entrées : `2.5` et `4`.

Convertis-les correctement (le prix peut avoir une virgule, la quantité est un entier), calcule le total et affiche :

`Total : 10.0 euros`
@inputs
2.5
4
@starter
prix = input("Prix de l'article ? ")
quantite = input("Quantité ? ")

total = prix * quantite
print(f"Total : {total} euros")
@solution
prix = float(input("Prix de l'article ? "))
quantite = int(input("Quantité ? "))

total = prix * quantite
print(f"Total : {total} euros")
@hint
input() renvoie toujours du texte. Entoure-le de float(...) pour le prix et de int(...) pour la quantité.
@check
assert "Total : 10.0 euros" in OUT, "Le programme doit afficher « Total : 10.0 euros » avec les entrées 2.5 et 4."
assert "float(" in CODE, "Le prix doit être converti avec float()."
assert "int(" in CODE, "La quantité doit être convertie avec int()."
```
