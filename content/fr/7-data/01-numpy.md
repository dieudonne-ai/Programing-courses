---
id: numpy
title: NumPy, calculer sur des tableaux
subtitle: Faire un calcul sur un million de nombres en une ligne.
duration: 14
---
## Bienvenue dans la data

Tu connais maintenant les bases de Python. Place aux outils des analystes de données. Le premier s'appelle **NumPy** (*Numerical Python*). Presque toutes les bibliothèques de data reposent dessus, pandas compris.

Son objet central : le **tableau** (*array*), une sorte de liste de nombres ultra-rapide.

```py
import numpy as np

prix = np.array([2.5, 3.5, 2.0, 2.2, 1.8])
print(prix)
print(type(prix))
```

```info
La première fois, le chargement de NumPy prend quelques secondes. Ensuite, c'est instantané.
```

+++

## Calculer sur tout le tableau d'un coup

Avec une liste, pour augmenter chaque prix de 10 %, il fallait une boucle. Avec NumPy, l'opération s'applique **à chaque élément automatiquement** :

```py
import numpy as np

prix = np.array([2.5, 3.5, 2.0, 2.2, 1.8])
quantites = np.array([10, 4, 7, 12, 20])

print(prix * 1.1)
print(prix * quantites)
print("Chiffre d'affaires :", (prix * quantites).sum())
```

`prix * quantites` multiplie les éléments **deux à deux** : le premier prix par la première quantité, etc. On appelle ça la **vectorisation**. C'est plus court à écrire, et des centaines de fois plus rapide sur de gros volumes.

```py
import numpy as np

liste = list(range(1000000))
tableau = np.arange(1000000)
print(sum(x * 2 for x in liste))
print((tableau * 2).sum())
```

+++

## Les statistiques en une ligne

```py
import numpy as np

notes = np.array([12, 15, 9, 17, 14, 11, 16, 8, 13, 18])
print("Moyenne :", notes.mean())
print("Médiane :", np.median(notes))
print("Écart-type :", round(notes.std(), 2))
print("Min / max :", notes.min(), notes.max())
```

- La **moyenne** est la somme divisée par le nombre de valeurs.
- La **médiane** est la valeur du milieu quand on trie : la moitié des valeurs est en dessous, l'autre au-dessus. Elle résiste mieux aux valeurs extrêmes.
- L'**écart-type** mesure la dispersion : petit, les valeurs sont proches de la moyenne ; grand, elles sont étalées.

```quiz
Dans une entreprise, 9 salariés gagnent 400 000 francs par mois et le directeur 8 000 000. Quel indicateur décrit le mieux le salaire « typique » ?
- La moyenne
* La médiane
- Le maximum
> La moyenne (1 160 000) est tirée vers le haut par un seul salaire extrême. La médiane (400 000) reflète bien la situation de la majorité. Un réflexe essentiel d'analyste !
```

+++

## Filtrer avec un masque

Une comparaison sur un tableau donne un tableau de `True` / `False`, qu'on appelle un **masque**. On l'utilise entre crochets pour **filtrer**.

```py
import numpy as np

temperatures = np.array([28, 31, 35, 30, 27, 33, 36])
masque = temperatures > 32
print(masque)
print(temperatures[masque])
print("Jours chauds :", masque.sum())
```

`masque.sum()` compte les `True` (chaque `True` vaut 1). Cette technique de filtrage est **exactement** celle qu'utilise pandas. Retiens-la bien.

+++

## Exercice : conversion d'une semaine

```exercise
@title Les prix en francs CFA
@prompt
Le tableau `prix_eur` contient des prix en euros. Sans boucle, crée :

- `prix_fcfa` : les prix convertis en francs CFA (1 euro = 655.957 francs), arrondis à l'unité avec `np.round` ;
- `nb_chers` : le nombre de prix supérieurs à 2000 francs CFA.
@starter
import numpy as np

prix_eur = np.array([2.5, 3.5, 2.0, 2.2, 1.8, 1.0, 5.0])

prix_fcfa = 
nb_chers = 
print(prix_fcfa)
print(nb_chers)
@solution
import numpy as np

prix_eur = np.array([2.5, 3.5, 2.0, 2.2, 1.8, 1.0, 5.0])

prix_fcfa = np.round(prix_eur * 655.957)
nb_chers = (prix_fcfa > 2000).sum()
print(prix_fcfa)
print(nb_chers)
@hint
np.round(prix_eur * 655.957), puis (prix_fcfa > 2000).sum()
@check
import numpy as _np
assert "for" not in CODE, "Pas de boucle : laisse NumPy calculer sur tout le tableau."
attendu = _np.round(_np.array([2.5, 3.5, 2.0, 2.2, 1.8, 1.0, 5.0]) * 655.957)
assert _np.allclose(prix_fcfa, attendu), f"prix_fcfa attendu : {attendu}"
assert int(nb_chers) == 2, f"Il y a 2 prix au-dessus de 2000 francs CFA, tu en comptes {nb_chers}."
```
