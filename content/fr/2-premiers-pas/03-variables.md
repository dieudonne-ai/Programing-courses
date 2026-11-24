---
id: variables
title: Les variables
subtitle: Des boîtes avec une étiquette pour ranger tes données.
duration: 12
---
## Une boîte avec une étiquette

Une **variable** est un nom qu'on donne à une valeur pour s'en souvenir et la réutiliser. Imagine une boîte : l'étiquette est le **nom**, le contenu est la **valeur**.

```py
prenom = "Awa"
age = 24
print(prenom)
print(age)
```

Le signe `=` ne veut pas dire « égal » comme en maths. Il veut dire **« range la valeur de droite dans la boîte de gauche »**. On dit qu'on **affecte** une valeur à une variable.

+++

## Utiliser une variable

Une fois créée, la variable s'utilise à la place de sa valeur. Pas de guillemets autour du nom : sinon c'est du texte !

```py
ville = "Abidjan"
print("J'habite à", ville)
print("ville")
```

L'intérêt ? Si la ville change, tu modifies **une seule ligne** et tout le programme suit. Change `"Abidjan"` par ta ville et exécute.

+++

## Une variable peut changer

Une variable peut recevoir une nouvelle valeur : l'ancienne est remplacée. Observe la mémoire pas à pas.

```widget
@name stepper
@config
{"code": "score = 0\nscore = 10\nscore = score + 5\nprint(score)",
 "steps": [
  {"line": 1, "vars": {}, "note": "On crée la boîte score."},
  {"line": 2, "vars": {"score": "0"}, "note": "score vaut 0. On va le remplacer par 10."},
  {"line": 3, "vars": {"score": "10"}, "note": "Python calcule d'abord la droite : score + 5, soit 10 + 5 = 15…"},
  {"line": 4, "vars": {"score": "15"}, "note": "…puis range 15 dans score. L'ancienne valeur a disparu."},
  {"line": 4, "vars": {"score": "15"}, "out": "15", "note": "score = score + 5 est une ligne très courante : « augmente score de 5 »."}
 ]}
```

```predict
pieces = 3
pieces = pieces * 2
pieces = pieces - 1
print(pieces)
???
- 3
- 6
* 5
> 3, puis 3 × 2 = 6, puis 6 − 1 = 5. Chaque ligne part de la valeur précédente.
```

+++

## Calculer avec des variables

Les variables rendent les calculs lisibles. Compare `print(4 * 3.5)` avec ceci :

```py
nombre_de_cafes = 4
prix_du_cafe = 3.5
total = nombre_de_cafes * prix_du_cafe
print("Total à payer :", total)
```

Le code se lit presque comme une phrase. C'est ça, un bon programme : **compréhensible par un humain**.

```info
En Python, les nombres à virgule s'écrivent avec un **point** : `3.5` et pas `3,5`. C'est la notation anglaise.
```

+++

## Bien nommer ses variables

Python impose quelques règles :

- uniquement des lettres, des chiffres et le tiret bas `_` ;
- pas d'espace, pas de tiret `-` (Python croirait à une soustraction) ;
- ne pas commencer par un chiffre ;
- majuscules et minuscules comptent : `age` et `Age` sont deux variables différentes.

Et une convention : on écrit les noms en minuscules, avec des `_` entre les mots. C'est le style **snake_case** (« serpent »). Exemple : `prix_total`, `nombre_eleves`.

```quiz
Lequel de ces noms de variable est **valide** en Python ?
- `prix total`
- `2eme_prix`
* `prix_total`
- `prix-total`
> `prix total` contient un espace, `2eme_prix` commence par un chiffre, `prix-total` contient un tiret. Seul `prix_total` respecte les règles.
```

```tip
Choisis des noms qui disent ce que contient la boîte. `x` et `truc` ne veulent rien dire ; `note_moyenne` se comprend tout seul.
```

+++

## Exercice : ta fiche

```exercise
@title Ta fiche d'identité
@prompt
Crée trois variables :

- `prenom` qui contient ton prénom (du texte) ;
- `ville` qui contient ta ville (du texte) ;
- `age` qui contient ton âge (un nombre, **sans guillemets**).

Puis affiche une phrase qui les utilise, par exemple : `Awa habite à Dakar et a 24 ans`.
@starter
prenom = 
ville = 
age = 

print(prenom, "habite à", ...)
@solution
prenom = "Awa"
ville = "Dakar"
age = 24

print(prenom, "habite à", ville, "et a", age, "ans")
@hint
Pour le texte, mets des guillemets : prenom = "Awa". Pour l'âge, pas de guillemets : age = 24. Dans le print, sépare chaque morceau par une virgule.
@check
for nom in ("prenom", "ville", "age"):
    assert nom in dir(), f"La variable « {nom} » n'existe pas. Crée-la avec {nom} = ..."
assert isinstance(prenom, str) and prenom.strip(), "prenom doit contenir du texte entre guillemets."
assert isinstance(ville, str) and ville.strip(), "ville doit contenir du texte entre guillemets."
assert isinstance(age, int), "age doit être un nombre entier, écrit sans guillemets (par exemple age = 24)."
assert prenom in OUT and ville in OUT and str(age) in OUT, "La phrase affichée doit contenir ton prénom, ta ville et ton âge (utilise les variables dans le print)."
assert "..." not in CODE, "Il reste des ... dans ton code : remplace-les."
```

+++

## Exercice : la monnaie

```exercise
@title Rendre la monnaie
@prompt
Une cliente achète 3 croissants à 1.8 euro pièce et paie avec un billet de 10 euros.

1. Crée une variable `total` qui calcule le prix des 3 croissants (avec un calcul, pas en l'écrivant à la main).
2. Crée une variable `monnaie` qui calcule ce qu'on doit lui rendre.
3. Affiche `monnaie`.
@starter
prix_croissant = 1.8
quantite = 3
billet = 10

total = 
monnaie = 
print(monnaie)
@solution
prix_croissant = 1.8
quantite = 3
billet = 10

total = prix_croissant * quantite
monnaie = billet - total
print(monnaie)
@hint
total = prix_croissant * quantite. Ensuite, la monnaie, c'est le billet moins le total.
@check
assert "total" in dir() and "monnaie" in dir(), "Il faut créer les variables total et monnaie."
assert abs(total - 5.4) < 1e-9, f"total devrait valoir 3 × 1.8 = 5.4, il vaut {total}."
assert abs(monnaie - 4.6) < 1e-9, f"monnaie devrait valoir 10 − 5.4 = 4.6, elle vaut {monnaie}."
assert "prix_croissant" in CODE.split("total =")[1] if "total =" in CODE else True, "Calcule total à partir des variables prix_croissant et quantite."
```

```info
Tu as peut-être vu s'afficher `4.6` ou un nombre bizarre comme `4.6000000000000005`. Ce n'est pas un bug de ton code : les ordinateurs stockent les nombres à virgule de façon approximative. On verra comment arrondir au prochain chapitre.
```
