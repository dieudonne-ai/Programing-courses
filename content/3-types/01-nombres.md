---
id: nombres
title: Les nombres et les calculs
subtitle: Python, la meilleure calculatrice du monde.
duration: 12
---
## Deux sortes de nombres

Python distingue deux types de nombres :

- les **entiers** (`int`, pour *integer*) : `7`, `-3`, `2026` ;
- les **nombres à virgule** (`float`, pour *nombre flottant*) : `3.5`, `-0.25`, `20.0`.

La fonction `type()` te dit de quel type est une valeur.

```py
print(type(42))
print(type(3.14))
print(type("42"))
```

Attention au dernier : `"42"` entre guillemets est du **texte** (`str`), pas un nombre.

+++

## Les opérations

| Symbole | Opération | Exemple | Résultat |
|---|---|---|---|
| `+` | addition | `7 + 2` | `9` |
| `-` | soustraction | `7 - 2` | `5` |
| `*` | multiplication | `7 * 2` | `14` |
| `/` | division | `7 / 2` | `3.5` |
| `//` | division entière | `7 // 2` | `3` |
| `%` | reste (modulo) | `7 % 2` | `1` |
| `**` | puissance | `7 ** 2` | `49` |

```py
print(7 / 2)
print(7 // 2)
print(7 % 2)
print(2 ** 10)
```

`//` et `%` vont ensemble : 7 divisé par 2, ça fait 3, **reste** 1. Comme à l'école primaire !

+++

## À quoi sert le reste ?

Le modulo `%` est bien plus utile qu'il n'y paraît :

- un nombre est **pair** si `nombre % 2` vaut 0 ;
- convertir des minutes en heures : `135 // 60` donne 2 heures, `135 % 60` donne 15 minutes.

```py
minutes = 135
heures = minutes // 60
reste = minutes % 60
print(minutes, "minutes =", heures, "h", reste, "min")
```

```predict
print(17 % 5)
???
- 3
* 2
- 3.4
> 17 divisé par 5 : 3 fois (15), il reste 2. `17 // 5` vaut 3 et `17 % 5` vaut 2.
```

+++

## L'ordre des opérations

Comme en maths, la multiplication passe avant l'addition. Les **parenthèses** imposent l'ordre que tu veux.

```predict
print(2 + 3 * 4)
???
- 20
* 14
- 24
> `3 * 4` d'abord (12), puis `2 + 12` = 14. Pour obtenir 20, il faut écrire `(2 + 3) * 4`.
```

```py
note1 = 12
note2 = 15
note3 = 17
moyenne_fausse = note1 + note2 + note3 / 3
moyenne = (note1 + note2 + note3) / 3
print(moyenne_fausse)
print(moyenne)
```

Le premier calcul est faux : seule `note3` a été divisée par 3. Un classique !

+++

## Arrondir

`round(nombre, chiffres)` arrondit un nombre. Sans le deuxième paramètre, on arrondit à l'entier.

```py
moyenne = 14.666666666
print(round(moyenne))
print(round(moyenne, 1))
print(round(moyenne, 2))
print(round(0.1 + 0.2, 2))
```

Quelques autres fonctions utiles : `abs()` donne la valeur absolue, `min()` et `max()` le plus petit et le plus grand.

```py
print(abs(-12))
print(min(4, 9, 2))
print(max(4, 9, 2))
```

+++

## Exercice : la durée du film

```exercise
@title Heures et minutes
@prompt
Un film dure `duree = 158` minutes. Calcule avec `//` et `%` :

- `heures` : le nombre d'heures complètes ;
- `minutes` : les minutes restantes.

Puis affiche `2 h 38 min` (avec un `print` qui utilise tes deux variables).
@starter
duree = 158

heures = 
minutes = 
print(heures, "h", minutes, "min")
@solution
duree = 158

heures = duree // 60
minutes = duree % 60
print(heures, "h", minutes, "min")
@hint
Une heure compte 60 minutes. duree // 60 donne les heures, duree % 60 le reste.
@check
assert heures == 2, f"heures devrait valoir 2, il vaut {heures}."
assert minutes == 38, f"minutes devrait valoir 38, il vaut {minutes}."
assert "duree" in CODE.split("heures =")[1].split("\n")[0], "Calcule heures à partir de la variable duree (pas en écrivant 2 directement)."
assert OUT.strip() == "2 h 38 min", f"L'affichage attendu est « 2 h 38 min », obtenu « {OUT.strip()} »."
```

+++

## Exercice : la moyenne

```exercise
@title Moyenne du trimestre
@prompt
Awa a eu trois notes sur 20 : `13.5`, `16` et `11`.

Calcule sa moyenne dans une variable `moyenne`, **arrondie à 2 chiffres après la virgule**, puis affiche-la.
@starter
note1 = 13.5
note2 = 16
note3 = 11

moyenne = 
print(moyenne)
@solution
note1 = 13.5
note2 = 16
note3 = 11

moyenne = round((note1 + note2 + note3) / 3, 2)
print(moyenne)
@hint
N'oublie pas les parenthèses autour de la somme, puis entoure le tout avec round(..., 2).
@check
assert moyenne == 13.5, f"La moyenne arrondie devrait être 13.5 (40.5 / 3), tu obtiens {moyenne}. As-tu mis des parenthèses autour de la somme ?"
assert "round" in CODE, "Utilise round(..., 2) pour arrondir."
assert "13.5" in OUT, "Affiche la moyenne avec print(moyenne)."
```
