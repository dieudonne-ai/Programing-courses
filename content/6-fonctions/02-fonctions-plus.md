---
id: fonctions-plus
title: Fonctions, la suite
subtitle: Valeurs par défaut, plusieurs résultats, portée et documentation.
duration: 12
---
## Les paramètres par défaut

Un paramètre peut avoir une **valeur par défaut**, utilisée si on ne la précise pas à l'appel.

```py
def convertir(montant, taux=655.957):
    return round(montant * taux)

print(convertir(10))           # taux par défaut
print(convertir(10, 600))      # taux précisé
print(convertir(taux=2.0, montant=5))  # par nom, dans n'importe quel ordre
```

Les appels **par nom** (`taux=2.0`) rendent le code plus lisible quand une fonction a beaucoup de paramètres. Tu en croiseras partout dans pandas.

+++

## Renvoyer plusieurs valeurs

Une fonction peut renvoyer plusieurs valeurs d'un coup, séparées par des virgules. En réalité, elle renvoie un **tuple**, qu'on déballe à l'arrivée.

```py
def resume(valeurs):
    return min(valeurs), max(valeurs), sum(valeurs) / len(valeurs)

ventes = [120, 95, 210, 180, 75]
mini, maxi, moyenne = resume(ventes)
print(f"min {mini}, max {maxi}, moyenne {moyenne}")
```

+++

## La portée des variables

Une variable créée **dans** une fonction n'existe que dans cette fonction. On dit qu'elle est **locale**.

```py
def calcul():
    secret = 42
    return secret * 2

print(calcul())
print(secret)
```

`NameError` : à l'extérieur, `secret` n'existe pas. C'est une protection : chaque fonction a son espace à elle, et ne risque pas d'écraser les variables du reste du programme. Pour faire sortir une valeur, on utilise `return`.

+++

## Documenter avec une docstring

Une **docstring** est un texte entre triples guillemets placé juste sous le `def`. Elle explique ce que fait la fonction. C'est une excellente habitude.

```py
def imc(poids, taille):
    """Calcule l'indice de masse corporelle.

    poids : en kilogrammes
    taille : en mètres
    """
    return round(poids / taille ** 2, 1)

print(imc(70, 1.75))
help(imc)
```

+++

## Les fonctions lambda

Une **lambda** est une mini-fonction sans nom, écrite sur une ligne. On l'utilise surtout pour dire à `sorted` (ou à pandas) **selon quoi** trier.

```py
produits = [("Espresso", 2.5), ("Sandwich", 5.0), ("Beignet", 1.0)]
par_prix = sorted(produits, key=lambda p: p[1])
print(par_prix)

eleves = [{"nom": "Awa", "note": 15}, {"nom": "Kofi", "note": 12}, {"nom": "Gloire", "note": 17}]
classement = sorted(eleves, key=lambda e: e["note"], reverse=True)
print([e["nom"] for e in classement])
```

`lambda p: p[1]` signifie : « à partir de `p`, renvoie `p[1]` », c'est-à-dire le prix.

+++

## Exercices

```exercise
@title Les statistiques
@prompt
Écris une fonction `statistiques(valeurs)` qui renvoie **trois valeurs** : le minimum, le maximum et la moyenne **arrondie à 1 décimale**.
@starter
def statistiques(valeurs):
    ...

mini, maxi, moy = statistiques([12, 18, 7, 15, 10])
print(mini, maxi, moy)
@solution
def statistiques(valeurs):
    moyenne = round(sum(valeurs) / len(valeurs), 1)
    return min(valeurs), max(valeurs), moyenne

mini, maxi, moy = statistiques([12, 18, 7, 15, 10])
print(mini, maxi, moy)
@hint
return min(valeurs), max(valeurs), round(sum(valeurs) / len(valeurs), 1)
@check
r = statistiques([12, 18, 7, 15, 10])
assert isinstance(r, tuple) and len(r) == 3, "La fonction doit renvoyer trois valeurs séparées par des virgules."
assert r == (7, 18, 12.4), f"Attendu (7, 18, 12.4), obtenu {r}."
assert statistiques([1, 2]) == (1, 2, 1.5), "Teste ta fonction avec d'autres valeurs : statistiques([1, 2]) doit donner (1, 2, 1.5)."
```

```exercise
@title La remise
@prompt
Écris une fonction `appliquer_remise(prix, pourcentage=10)` qui renvoie le prix après remise, arrondi à 2 décimales. Par défaut, la remise est de 10 %.

Exemples : `appliquer_remise(50)` renvoie `45.0` ; `appliquer_remise(80, 25)` renvoie `60.0`.
@starter
def appliquer_remise(prix, pourcentage=10):
    ...

print(appliquer_remise(50))
print(appliquer_remise(80, 25))
@solution
def appliquer_remise(prix, pourcentage=10):
    return round(prix * (1 - pourcentage / 100), 2)

print(appliquer_remise(50))
print(appliquer_remise(80, 25))
@hint
Une remise de 10 % revient à multiplier par (1 - 10 / 100), soit 0.9.
@check
assert appliquer_remise(50) == 45.0, f"appliquer_remise(50) devrait valoir 45.0, obtenu {appliquer_remise(50)}."
assert appliquer_remise(80, 25) == 60.0, f"appliquer_remise(80, 25) devrait valoir 60.0, obtenu {appliquer_remise(80, 25)}."
assert appliquer_remise(19.99, 15) == 16.99, f"appliquer_remise(19.99, 15) devrait valoir 16.99, obtenu {appliquer_remise(19.99, 15)}."
```
