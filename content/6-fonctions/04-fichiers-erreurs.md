---
id: fichiers
title: Fichiers et gestion des erreurs
subtitle: Lire des données et ne pas planter au premier imprévu.
duration: 14
---
## Lire un fichier texte

Les données vivent souvent dans des **fichiers**. Sur ce site, quelques fichiers sont déjà là pour toi. Lisons `courses.txt`, une liste de courses :

```py
with open("courses.txt", encoding="utf-8") as fichier:
    contenu = fichier.read()
print(contenu)
```

- `open(nom)` ouvre le fichier ;
- `with ... as fichier:` garantit que le fichier sera **refermé** proprement à la fin du bloc ;
- `.read()` lit tout le contenu d'un coup, sous forme de texte.

+++

## Ligne par ligne

Souvent, on traite un fichier **ligne par ligne** :

```py
with open("courses.txt", encoding="utf-8") as fichier:
    for numero, ligne in enumerate(fichier, start=1):
        article = ligne.strip()
        print(f"{numero}. {article.capitalize()}")
```

Chaque ligne lue se termine par un retour à la ligne invisible (`\n`). `.strip()` l'enlève.

+++

## Écrire dans un fichier

Avec le mode `"w"` (*write*), on crée (ou on écrase) un fichier. Le mode `"a"` (*append*) ajoute à la fin.

```py
with open("journal.txt", "w", encoding="utf-8") as f:
    f.write("Lundi : 120 ventes\n")
    f.write("Mardi : 95 ventes\n")

with open("journal.txt", "a", encoding="utf-8") as f:
    f.write("Mercredi : 210 ventes\n")

with open("journal.txt", encoding="utf-8") as f:
    print(f.read())
```

+++

## Les fichiers CSV

Le format **CSV** (*Comma-Separated Values*) est le format de données le plus répandu : un tableau en texte, une ligne par enregistrement, des virgules entre les colonnes. Tu peux l'ouvrir avec Excel.

Voici le début du fichier `ventes.csv`, qui contient les ventes 2024 d'une chaîne de cafés :

```py
with open("ventes.csv", encoding="utf-8") as f:
    for i in range(6):
        print(f.readline().strip())
```

Le module `csv` lit chaque ligne comme un dictionnaire, avec les noms de colonnes comme clés :

```py
import csv

total_quantite = 0
with open("ventes.csv", encoding="utf-8") as f:
    for ligne in csv.DictReader(f):
        total_quantite += int(ligne["quantite"])
print("Articles vendus en 2024 :", total_quantite)
```

Tout est lu comme du texte : d'où le `int(...)`. Au prochain chapitre, pandas fera tout ça (et bien plus) en une ligne.

+++

## Gérer les erreurs : try / except

Les données réelles sont pleines de surprises : une case vide, un « N/A », une faute de frappe. Plutôt que de laisser le programme planter, on peut **attraper** l'erreur avec `try` / `except`.

```py
valeurs = ["12", "7", "N/A", "15", "", "9"]
total = 0
ignorees = 0
for v in valeurs:
    try:
        total += int(v)
    except ValueError:
        ignorees += 1
print(f"Total : {total} ({ignorees} valeurs ignorées)")
```

Python **essaie** le bloc `try`. Si une `ValueError` survient, il exécute le bloc `except` au lieu de planter, et continue.

```warn
N'attrape que les erreurs que tu attends (ici `ValueError`). Un `except:` tout seul cacherait aussi tes vraies fautes de programmation.
```

+++

## Exercice : la liste de courses

```exercise
@title Compter les articles
@prompt
Lis le fichier `courses.txt` ligne par ligne et crée la liste `articles` qui contient chaque article **en majuscules**, sans le retour à la ligne.

Puis affiche le nombre d'articles.
@starter
articles = []

print(len(articles))
@solution
articles = []
with open("courses.txt", encoding="utf-8") as f:
    for ligne in f:
        articles.append(ligne.strip().upper())

print(len(articles))
@hint
with open("courses.txt", encoding="utf-8") as f: puis for ligne in f: puis articles.append(ligne.strip().upper())
@check
assert "open(" in CODE, "Ouvre le fichier avec open()."
assert articles == ["RIZ", "HUILE", "TOMATES", "OIGNONS", "PAIN", "LAIT", "CAFÉ"], f"articles devrait contenir les 7 articles en majuscules. Obtenu : {articles}"
assert "7" in OUT, "Affiche le nombre d'articles."
```

+++

## Exercice : une conversion sans risque

```exercise
@title Le convertisseur prudent
@prompt
Écris une fonction `en_nombre(texte)` qui convertit un texte en nombre à virgule avec `float()`. Si la conversion échoue, elle renvoie `None` au lieu de planter.

Ensuite, calcule `total` : la somme des valeurs de `brut` qui ont pu être converties.
@starter
def en_nombre(texte):
    ...

brut = ["12.5", "abc", "7", "", "3.25", "N/A"]
total = 
print(total)
@solution
def en_nombre(texte):
    try:
        return float(texte)
    except ValueError:
        return None

brut = ["12.5", "abc", "7", "", "3.25", "N/A"]
total = sum(x for x in (en_nombre(t) for t in brut) if x is not None)
print(total)
@hint
Dans la fonction : try: return float(texte), puis except ValueError: return None. Pour le total, une boucle qui ajoute seulement les résultats différents de None.
@check
assert en_nombre("3.5") == 3.5, "en_nombre(\"3.5\") doit renvoyer 3.5."
assert en_nombre("abc") is None, "en_nombre(\"abc\") doit renvoyer None (et ne pas planter)."
assert "try" in CODE and "except" in CODE, "Utilise try / except dans ta fonction."
assert abs(total - 22.75) < 1e-9, f"Le total des valeurs valides est 22.75, tu obtiens {total}."
```
