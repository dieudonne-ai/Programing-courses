---
id: erreurs
title: Commentaires et erreurs
subtitle: Écrire des notes, et ne plus avoir peur des messages rouges.
duration: 12
---
## Les commentaires

Tout ce qui suit un `#` sur une ligne est un **commentaire** : Python l'ignore complètement. C'est une note pour les humains, y compris pour toi dans trois mois.

```py
# Ce programme calcule le prix d'une commande
prix_unitaire = 3      # en euros
print(prix_unitaire * 4)   # 4 cappuccinos
# print("Cette ligne ne s'exécute pas, elle est commentée")
```

Commenter une ligne (mettre un `#` devant) est aussi un réflexe pour **désactiver** du code temporairement, sans l'effacer.

```quiz
Que fait Python avec la ligne `# print("Bonjour")` ?
- Il affiche Bonjour
* Rien du tout : c'est un commentaire
- Il affiche une erreur
> Le `#` transforme toute la ligne en commentaire. Python ne l'exécute pas.
```

+++

## Les erreurs sont tes alliées

Tu vas faire des erreurs. Beaucoup. Tout le monde en fait, tous les jours, y compris les développeurs de Google. La différence entre un débutant et un pro : le pro **lit le message d'erreur**.

Exécute ce code. Il contient une erreur volontaire.

```py
print("Bonjour)
```

Regarde le message. Il te dit trois choses :

1. **Le type d'erreur** : `SyntaxError`, une faute de « grammaire ».
2. **La ligne** où Python a bloqué.
3. **Une explication** : ici, une chaîne de caractères qui n'est jamais fermée.

Corrige le code (ajoute le guillemet manquant) et exécute à nouveau.

+++

## Les trois erreurs les plus fréquentes

**1. NameError : un nom inconnu.** Python ne connaît pas ce mot. Souvent une faute de frappe, ou une majuscule en trop : pour Python, `print` et `Print` sont deux mots différents.

```py
Print("Python fait la différence entre majuscules et minuscules")
```

**2. Oublier les guillemets.** Sans guillemets, Python croit que `Bonjour` est le nom de quelque chose.

```py
print(Bonjour)
```

**3. IndentationError : un décalage en trop.** En Python, les espaces en début de ligne ont un sens. Une ligne ne doit pas être décalée sans raison.

```py
print("Ligne 1")
  print("Ligne 2")
```

Corrige ces trois exemples un par un.

+++

## Devine le résultat

```predict
print("A")
print("B")
prnt("C")
print("D")
???
- Rien ne s'affiche
* A et B s'affichent, puis une erreur NameError
- A, B et D s'affichent
> Python exécute de haut en bas. Les lignes 1 et 2 fonctionnent. À la ligne 3, `prnt` est inconnu : erreur, et le programme s'arrête. La ligne 4 n'est jamais exécutée.
```

```quiz
Pour Python, `Print("x")` et `print("x")`…
- c'est pareil
* ce n'est pas pareil : Python distingue majuscules et minuscules
- les deux donnent une erreur
> Python est **sensible à la casse** : `Print`, `PRINT` et `print` sont trois noms différents. Seul `print` existe.
```

+++

## La méthode du détective

Face à une erreur, suis toujours ces étapes :

1. **Lis le type d'erreur** et l'explication.
2. **Va à la ligne indiquée** (et regarde aussi la ligne juste avant : l'erreur vient souvent de là).
3. **Compare** avec un exemple qui marche.
4. **Change une seule chose** à la fois, puis relance.

```exercise
@title Le code cassé
@prompt
Ce programme contient **trois erreurs**. Corrige-les pour qu'il affiche :

    Je débogue
    comme un pro
    3 erreurs corrigées

Exécute-le d'abord pour lire les messages d'erreur, un par un.
@starter
print("Je débogue)
Print("comme un pro")
 print(3, "erreurs corrigées")
@solution
print("Je débogue")
print("comme un pro")
print(3, "erreurs corrigées")
@hint
Un guillemet manquant, une majuscule en trop, un espace au début d'une ligne.
@check
attendu = ["Je débogue", "comme un pro", "3 erreurs corrigées"]
lignes = [l.strip() for l in OUT.strip().split("\n")]
assert lignes == attendu, "Le résultat n'est pas encore exactement celui demandé. Compare ligne par ligne."
```
