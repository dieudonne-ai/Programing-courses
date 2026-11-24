---
id: modules
title: Modules et bibliothèques
subtitle: Utiliser le code des autres pour aller beaucoup plus vite.
duration: 12
---
## Ne réinvente pas la roue

Python est livré avec des centaines de **modules** : des fichiers de fonctions toutes prêtes, rangées par thème. On les charge avec `import`.

```py
import math

print(math.sqrt(144))      # racine carrée
print(math.pi)
print(math.ceil(4.1))      # arrondi au-dessus
print(math.floor(4.9))     # arrondi en dessous
```

On écrit le nom du module, un point, puis la fonction : `math.sqrt`. Comme une adresse : « dans le module math, la fonction sqrt ».

+++

## Trois façons d'importer

```py
import statistics
print(statistics.mean([12, 15, 9]))

from statistics import median
print(median([12, 15, 9, 20]))

import statistics as st
print(st.stdev([12, 15, 9, 20]))
```

- `import module` : on écrit `module.fonction` ;
- `from module import fonction` : on écrit directement `fonction` ;
- `import module as alias` : un surnom plus court.

La troisième forme est celle que tu verras partout en data : `import pandas as pd`, `import numpy as np`.

+++

## Le hasard avec random

```py
import random

random.seed(7)  # rend le hasard reproductible
print(random.randint(1, 6))            # un dé
print(random.choice(["pile", "face"]))  # un choix au hasard
equipe = ["Awa", "Kofi", "Inès", "David"]
random.shuffle(equipe)
print(equipe)
```

`random.seed()` fixe le point de départ du hasard : avec la même graine, on obtient toujours les mêmes tirages. Indispensable pour qu'une analyse soit **reproductible**.

+++

## Les dates avec datetime

```py
from datetime import date

aujourdhui = date.today()
print(aujourdhui)
independance = date(1960, 6, 30)
print(independance.year)
ecart = aujourdhui - independance
print(f"{ecart.days} jours depuis le 30 juin 1960")
print(independance.strftime("%d/%m/%Y"))
```

Soustraire deux dates donne une durée, dont on lit le nombre de jours avec `.days`.

+++

## Et les bibliothèques externes ?

Au-delà des modules fournis avec Python, il existe des centaines de milliers de **bibliothèques** créées par la communauté. On les installe avec l'outil **pip**. Sur ton ordinateur, dans un terminal :

```bash
pip install pandas matplotlib
```

Sur ce site, pandas, NumPy et Matplotlib sont déjà disponibles : tu les utiliseras au prochain chapitre.

```quiz
Que fait `import pandas as pd` ?
- Il installe pandas
* Il charge la bibliothèque pandas et lui donne le surnom `pd`
- Il crée une variable pd qui vaut "pandas"
> `import` charge une bibliothèque déjà installée (l'installation se fait avec pip). `as pd` permet ensuite d'écrire `pd.read_csv(...)` au lieu de `pandas.read_csv(...)`.
```

+++

## Exercice : simuler des dés

```exercise
@title 1000 lancers de dé
@prompt
Simule **1000 lancers** d'un dé à 6 faces avec `random.randint(1, 6)`, après avoir fixé la graine avec `random.seed(42)`.

Compte dans `nb_six` le nombre de fois où le dé tombe sur 6, puis calcule `pourcentage` (le pourcentage de 6, arrondi à 1 décimale).

En théorie, on attend environ 16,7 %.
@starter
import random

random.seed(42)
nb_six = 0

print(nb_six, pourcentage)
@solution
import random

random.seed(42)
nb_six = 0
for i in range(1000):
    if random.randint(1, 6) == 6:
        nb_six += 1
pourcentage = round(nb_six / 1000 * 100, 1)

print(nb_six, pourcentage)
@hint
Une boucle for i in range(1000), un if random.randint(1, 6) == 6, et un compteur. Le pourcentage : nb_six / 1000 * 100.
@check
import random as _r
_r.seed(42)
attendu = sum(1 for _ in range(1000) if _r.randint(1, 6) == 6)
assert nb_six == attendu, f"Avec la graine 42 et 1000 lancers, on obtient {attendu} six. Tu en comptes {nb_six}. As-tu bien appelé random.seed(42) avant la boucle, et une seule fois randint par tour ?"
assert pourcentage == round(attendu / 10, 1), f"Le pourcentage devrait être {round(attendu / 10, 1)}."
```

+++

## Exercice : jours restants

```exercise
@title Compte à rebours
@prompt
Avec le module `datetime`, calcule `jours` : le nombre de jours entre le **1er janvier 2026** et le **14 juillet 2026**.
@starter
from datetime import date

jours = 
print(jours)
@solution
from datetime import date

jours = (date(2026, 7, 14) - date(2026, 1, 1)).days
print(jours)
@hint
Crée les deux dates avec date(année, mois, jour), soustrais-les, puis prends .days
@check
assert jours == 194, f"Il y a 194 jours entre ces deux dates, tu obtiens {jours}."
assert "date(" in CODE, "Utilise date(...) du module datetime."
```
