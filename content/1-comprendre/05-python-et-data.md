---
id: python-data
title: Python, les données et ton premier code
subtitle: Pourquoi ce langage, pourquoi la data, et c'est parti.
duration: 10
---
## Pourquoi Python ?

Il existe des centaines de langages. Python est l'un des plus utilisés au monde, pour de bonnes raisons :

- **Il se lit presque comme de l'anglais.** On passe moins de temps sur la syntaxe, plus sur le problème.
- **Il sert partout** : sites web (Instagram), recherche scientifique (NASA), banques, intelligence artificielle, automatisation de tâches de bureau…
- **C'est le roi de l'analyse de données.** Les bibliothèques pandas, NumPy et Matplotlib, que tu utiliseras à la fin du cours, sont des standards mondiaux.
- **La communauté est immense.** Quelle que soit ta question, quelqu'un l'a déjà posée et quelqu'un y a répondu.

+++

## La data, c'est quoi ?

Les **données** (*data* en anglais), ce sont des informations enregistrées : les ventes d'une boutique, les transactions Mobile Money, les notes d'une classe, la météo de chaque jour, les trajets des bus…

Un **analyste de données** transforme ces données brutes en réponses utiles. Son travail suit presque toujours le même chemin :

```html
<div class="flow">
  <div class="flow-step"><b>Question</b><span>Quel produit vend le mieux le samedi ?</span></div>
  <div class="flow-step"><b>Collecte</b><span>Récupérer le fichier des ventes.</span></div>
  <div class="flow-step"><b>Nettoyage</b><span>Corriger les erreurs et les trous.</span></div>
  <div class="flow-step"><b>Analyse</b><span>Calculer, comparer, regrouper.</span></div>
  <div class="flow-step"><b>Visualisation</b><span>Un graphique clair.</span></div>
  <div class="flow-step"><b>Décision</b><span>Commander plus de ce produit.</span></div>
</div>
```

```quiz
Une pharmacie veut savoir quels médicaments commander avant la saison des pluies. Quelle est la première étape ?
* Formuler une question précise
- Faire un graphique
- Supprimer les données anciennes
> Tout commence par une **question** claire, par exemple : « Quels médicaments se sont le plus vendus pendant les saisons des pluies précédentes ? » Sans question, on se perd dans les données.
```

+++

## Ton parcours

Voici le chemin que tu vas suivre :

1. **Premiers pas** : afficher, commenter, comprendre les erreurs, utiliser des variables.
2. **Les types** : nombres, textes, vrai et faux.
3. **Décider et répéter** : conditions et boucles.
4. **Ranger ses données** : listes et dictionnaires.
5. **Fonctions, modules et fichiers** : du code réutilisable.
6. **Analyser des données** : pandas et graphiques, jusqu'au projet final.

Chaque leçon dure environ dix minutes. Une par jour suffit pour progresser vite.

+++

## Ton tout premier programme Python

Voici une ligne de vrai Python. Appuie sur **Exécuter** pour la lancer. La première fois, Python met quelques secondes à se réveiller.

```py
print("Bonjour ! Je suis en train d'apprendre Python.")
```

`print` veut dire « affiche ». Le texte entre guillemets s'affiche tel quel.

Maintenant, **modifie le texte** entre les guillemets (écris ce que tu veux) et exécute à nouveau. Tu peux casser le code, ce n'est pas grave : le bouton **Réinitialiser** remet l'original.

+++

## Ton premier exercice

Les exercices sont corrigés automatiquement, comme par un prof avec son stylo rouge, mais instantanément.

```exercise
@title Présente-toi
@prompt
Écris un programme qui affiche une phrase contenant **ton prénom**, par exemple `Je m'appelle Awa`.

N'oublie pas les guillemets autour du texte, et les parenthèses de `print`.
@starter
# Écris ta ligne sous ce commentaire

@solution
print("Je m'appelle Awa")
@hint
Copie la forme de l'exemple précédent : print("ton texte ici")
@check
assert "print" in CODE, "Utilise la fonction print() pour afficher ton texte."
assert OUT.strip() != "", "Ton programme n'affiche rien pour l'instant. Écris une ligne avec print(\"...\")."
assert len(OUT.strip()) >= 5, "Écris une vraie phrase avec ton prénom."
```

```note
Ça y est, tu es programmeur ou programmeuse.
Pas encore expert, mais tu as écrit et exécuté du code. Au prochain chapitre, on passe aux choses sérieuses.
```
