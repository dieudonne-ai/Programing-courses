---
id: print
title: Afficher avec print()
subtitle: La première instruction de tout programmeur.
duration: 10
---
## Faire parler ton programme

`print()` affiche quelque chose à l'écran. C'est la façon la plus simple de voir ce que fait ton programme. Tu l'utiliseras tout le temps, même quand tu seras expert, pour vérifier tes calculs.

```py
print("Bienvenue dans le chapitre 2 !")
print("Python lit les lignes de haut en bas.")
print("Une ligne, un print, une ligne affichée.")
```

Trois `print`, trois lignes affichées, dans l'ordre. Essaie d'inverser deux lignes puis exécute.

+++

## Le texte entre guillemets

Le texte qu'on affiche doit être entre **guillemets**. En programmation, un texte s'appelle une **chaîne de caractères** (*string* en anglais).

Tu peux utiliser des guillemets doubles `"` ou simples `'`. Le plus pratique en français : les doubles, à cause des apostrophes.

```py
print("C'est facile avec les guillemets doubles")
print('Les guillemets simples marchent aussi')
```

```warn
Si tu écris `print('C'est cassé')`, Python croit que le texte s'arrête après le `C`. Résultat : une erreur. Avec des apostrophes dans ton texte, utilise des guillemets doubles.
```

+++

## Les nombres, sans guillemets

Les nombres s'écrivent **sans** guillemets. Et là, magie : Python peut calculer.

```py
print(12 + 30)
print("12 + 30")
```

```predict
print(7 * 6)
???
- 7 * 6
* 42
- "42"
> Sans guillemets, Python calcule `7 * 6` (le signe `*` veut dire « multiplié par ») et affiche le résultat : 42.
```

```predict
print("7 * 6")
???
* 7 * 6
- 42
- Une erreur
> Avec des guillemets, c'est du texte : Python l'affiche tel quel, sans rien calculer.
```

+++

## Plusieurs choses à la fois

Tu peux donner plusieurs éléments à `print`, séparés par des **virgules**. Python les affiche sur la même ligne, séparés par un espace.

```py
print("J'ai", 25, "ans")
print("Une semaine compte", 7 * 24, "heures")
print()
print("Le print() vide ci-dessus a affiché une ligne blanche.")
```

```tip
La virgule permet de mélanger texte et nombres dans un seul `print`. Python ajoute les espaces tout seul.
```

+++

## Exercice : un ticket de caisse

```exercise
@title Ton premier ticket
@prompt
Écris un programme qui affiche **trois lignes** :

1. `Café Baobab`
2. `2 cafés : 5 euros`
3. `Merci et à bientôt !`

Respecte exactement le texte (majuscules, accents et ponctuation compris).
@starter
# Une ligne par print
@solution
print("Café Baobab")
print("2 cafés : 5 euros")
print("Merci et à bientôt !")
@hint
Il te faut trois instructions print, une par ligne, avec chaque texte entre guillemets.
@check
lignes = [l.strip() for l in OUT.strip().split("\n")]
assert len(lignes) == 3, f"Il faut exactement 3 lignes affichées, ton programme en affiche {len(lignes)}."
assert lignes[0] == "Café Baobab", f"La première ligne doit être « Café Baobab », pas « {lignes[0]} »."
assert lignes[1] == "2 cafés : 5 euros", f"La deuxième ligne doit être « 2 cafés : 5 euros », pas « {lignes[1]} »."
assert lignes[2] == "Merci et à bientôt !", f"La troisième ligne doit être « Merci et à bientôt ! », pas « {lignes[2]} »."
```

+++

## Exercice : faire calculer Python

```exercise
@title Combien de minutes ?
@prompt
Une journée compte 24 heures, et une heure 60 minutes. Affiche la phrase :

`Une journée compte 1440 minutes`

Mais **ne calcule pas toi-même** : écris `24 * 60` dans ton `print` et laisse Python faire le calcul.
@starter
print("Une journée compte", ...)
@solution
print("Une journée compte", 24 * 60, "minutes")
@hint
Remplace les ... par le calcul, puis ajoute une virgule et le texte "minutes".
@check
assert "24 * 60" in CODE.replace("24*60", "24 * 60") or "60 * 24" in CODE.replace("60*24", "60 * 24"), "Écris le calcul 24 * 60 dans ton code au lieu du résultat."
assert OUT.strip() == "Une journée compte 1440 minutes", f"Le programme doit afficher « Une journée compte 1440 minutes ». Il affiche : « {OUT.strip()} »"
```

```note
Bien joué. Tu sais maintenant afficher du texte, des nombres et des calculs. C'est déjà la moitié de ce que fait un programme : montrer des résultats.
```
