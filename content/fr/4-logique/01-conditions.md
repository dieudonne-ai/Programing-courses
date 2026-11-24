---
id: conditions
title: Prendre des décisions avec if
subtitle: if, elif, else et l'indentation.
duration: 14
---
## Si… alors…

Avec `if`, ton programme exécute un bloc de code **seulement si** une condition est vraie.

```py
solde = 15000
prix = 12000

if solde >= prix:
    print("Paiement accepté")
    solde = solde - prix
    print("Nouveau solde :", solde)

print("Merci de votre visite")
```

Trois détails essentiels :

1. la ligne du `if` se termine par **deux-points** `:` ;
2. les lignes du bloc sont **décalées de 4 espaces** (on dit *indentées*) ;
3. la première ligne non décalée marque la **fin du bloc** : `Merci de votre visite` s'affiche dans tous les cas.

Change le prix en `20000` et exécute à nouveau.

+++

## Sinon : else

`else` (« sinon ») indique quoi faire quand la condition est fausse.

```py
solde = 15000
prix = 20000

if solde >= prix:
    print("Paiement accepté")
else:
    manque = prix - solde
    print(f"Solde insuffisant, il manque {manque} francs")
```

```warn
L'indentation n'est pas décorative en Python : c'est elle qui dit quelles lignes font partie du bloc. Utilise toujours 4 espaces (la touche Tab le fait pour toi dans l'éditeur).
```

+++

## Plusieurs cas : elif

`elif` (contraction de *else if*, « sinon, si ») permet d'enchaîner plusieurs conditions. Python les teste **dans l'ordre** et exécute **seulement le premier** bloc dont la condition est vraie.

```widget
@name condition
@config
{"name": "note", "label": "Note sur 20 :", "min": 0, "max": 20, "value": 13,
 "branches": [
  {"code": "if note >= 16:", "gte": 16, "out": "Mention Très bien"},
  {"code": "elif note >= 14:", "gte": 14, "out": "Mention Bien"},
  {"code": "elif note >= 12:", "gte": 12, "out": "Mention Assez bien"},
  {"code": "elif note >= 10:", "gte": 10, "out": "Admis"},
  {"code": "else:", "out": "Pas encore admis"}
 ]}
```

```predict
note = 17
if note >= 10:
    print("Admis")
elif note >= 16:
    print("Très bien")
else:
    print("Pas admis")
???
* Admis
- Très bien
- Admis, puis Très bien
> 17 >= 10 est vrai : Python exécute le premier bloc et **ignore tous les autres**. L'ordre des conditions compte : il faut tester les cas les plus exigeants en premier.
```

+++

## Conditions combinées

Les `and`, `or` et `not` vus au chapitre précédent s'utilisent naturellement dans un `if`.

```py
age = 25
etudiant = True

if age < 12 or age >= 65:
    tarif = 0
elif etudiant and age < 26:
    tarif = 500
else:
    tarif = 1000

print(f"Ton billet de bus coûte {tarif} francs")
```

Teste avec différents âges et en mettant `etudiant = False`.

+++

## Exercice : pair ou impair ?

```exercise
@title Pair ou impair
@prompt
Écris un programme qui affiche `pair` si le nombre `n` est pair, et `impair` sinon.

Rappel : un nombre est pair si le reste de sa division par 2 vaut 0.
@starter
n = 42

@solution
n = 42

if n % 2 == 0:
    print("pair")
else:
    print("impair")
@hint
if n % 2 == 0: puis, en dessous et décalé, print("pair"). Ensuite else: et print("impair").
@check
assert "if" in CODE, "Utilise une condition if."
def lance(v):
    import io, contextlib
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(CODE.replace("n = 42", f"n = {v}", 1), {})
    return buf.getvalue().strip()
assert lance(42) == "pair", "Avec n = 42, le programme doit afficher « pair »."
assert lance(7) == "impair", "Avec n = 7, le programme doit afficher « impair »."
assert lance(0) == "pair", "Avec n = 0, le programme doit afficher « pair »."
```

+++

## Exercice : les frais de livraison

```exercise
@title Frais de livraison
@prompt
Une boutique en ligne calcule ses frais de livraison selon le montant du panier :

- **50 euros ou plus** : livraison gratuite (0) ;
- **entre 20 (inclus) et 50 euros** : 3 euros ;
- **moins de 20 euros** : 5 euros.

Complète le programme pour que la variable `frais` ait la bonne valeur, quel que soit `panier`.
@starter
panier = 35

# calcule frais avec if / elif / else

print(f"Frais de livraison : {frais} euros")
@solution
panier = 35

if panier >= 50:
    frais = 0
elif panier >= 20:
    frais = 3
else:
    frais = 5

print(f"Frais de livraison : {frais} euros")
@hint
Commence par le cas le plus élevé : if panier >= 50: frais = 0, puis elif panier >= 20: frais = 3, puis else: frais = 5.
@check
def frais_pour(v):
    ns = {}
    exec(CODE.replace("panier = 35", f"panier = {v}", 1).replace("print(", "(lambda *a, **k: None)("), ns)
    return ns.get("frais")
for v, attendu in [(35, 3), (50, 0), (80, 0), (20, 3), (19.99, 5), (5, 5)]:
    obtenu = frais_pour(v)
    assert obtenu == attendu, f"Pour un panier de {v} euros, les frais devraient être {attendu}, ton programme donne {obtenu}."
```
