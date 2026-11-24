# Cahier de Code

Un site de cours interactif, **en français et en anglais**, pour apprendre :

1. **ce qu'est la programmation** (sans code au début : robot à programmer, algorithmes, binaire, les cinq briques de tout programme) ;
2. **Python**, pas à pas ;
3. **l'analyse de données** avec NumPy, pandas et Matplotlib, jusqu'à un projet final.

Tout se passe dans le navigateur : Python tourne directement dans la page grâce à [Pyodide](https://pyodide.org). Rien à installer pour l'élève, pas de serveur, pas de compte. La progression (XP, niveaux, série de jours, bons points) est enregistrée dans le navigateur.

## Contenu

| Chapitre | Leçons |
|---|---|
| 1. Comprendre la programmation | 5 |
| 2. Premiers pas en Python | 3 |
| 3. Nombres, textes et booléens | 3 |
| 4. Décider et répéter | 3 |
| 5. Ranger ses données | 4 |
| 6. Fonctions, modules et fichiers | 4 |
| 7. Analyser des données | 7 |

29 leçons, 47 exercices corrigés automatiquement, un bac à sable, un aide-mémoire et un certificat imprimable, dans chacune des deux langues.

Les leçons de data utilisent des fichiers générés au démarrage de Python : `ventes.csv` (ventes 2024 d'une chaîne de cafés dans 5 villes), `etudiants.csv`, `clients.csv` (volontairement mal saisi, pour le nettoyage) et `courses.txt`. La version anglaise utilise les mêmes chiffres avec des noms de colonnes en anglais : `sales.csv`, `students.csv`, `customers.csv` et `groceries.txt`.

## Langues

Le bouton **FR / EN** en haut de page change la langue ; le choix est retenu. Sans choix enregistré, le site suit la langue du navigateur. On peut aussi partager un lien direct vers une langue : `https://…/?lang=en` ou `?lang=fr`.

La progression (leçons terminées, XP, bons points) est commune aux deux langues.

## Lancer le site sur son ordinateur

Le site doit être servi par un petit serveur web (ouvrir `index.html` en double-cliquant ne suffit pas : le navigateur bloque le moteur Python dans ce cas).

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Mettre le site en ligne (GitHub Pages)

Le site est 100 % statique. Dans les paramètres du dépôt GitHub : **Settings → Pages → Deploy from a branch**, choisir la branche et le dossier `/ (root)`. Le site sera disponible quelques minutes plus tard à l'adresse indiquée par GitHub. N'importe quel hébergeur de fichiers statiques (Netlify, Vercel, Cloudflare Pages…) fonctionne aussi.

## Organisation des fichiers

```
index.html            la page unique du site
css/style.css         le thème « cahier d'écolier » (clair et sombre)
js/app.js             navigation, leçons, quiz, exercices, progression
js/i18n.js            textes de l'interface en français et en anglais
js/widgets.js         activités interactives (robot, remise en ordre, binaire…)
js/python.js          lien entre la page et Python
js/py-worker.js       Python (Pyodide) + génération des jeux de données
js/course-data.js     fichier généré par build.py, ne pas modifier à la main
content/fr/           les leçons en français (Markdown)
content/en/           les mêmes leçons en anglais
build.py              compile content/ en js/course-data.js
```

## Écrire ou modifier une leçon

Les leçons sont des fichiers Markdown dans `content/fr/<chapitre>/` et `content/en/<chapitre>/`, triés par nom. Les chapitres sont déclarés dans `content/<langue>/course.json`. Une leçon et sa traduction partagent le même `id` dans leur en-tête. Le build vérifie que les deux langues ont les mêmes chapitres, les mêmes leçons et le même nombre d'exercices par leçon. Après chaque modification :

```bash
python3 build.py
```

### En-tête

```
---
id: variables
title: Les variables
subtitle: Des boîtes avec une étiquette.
duration: 12
---
```

### Étapes

Une ligne contenant uniquement `+++` sépare deux étapes. L'élève clique sur « Continuer » pour voir l'étape suivante ; s'il y a un quiz, un exercice ou une activité, il doit d'abord le réussir.

### Blocs spéciaux

Tout le reste est du Markdown classique. Les blocs entre trois accents graves ont un rôle particulier :

- ` ```py ` : code Python exécutable et modifiable. ` ```py static ` : code affiché sans bouton Exécuter. ` ```py inputs=Awa|2001 ` : pré-remplit les réponses à `input()`.
- ` ```quiz ` : question, puis options (`- ` mauvaise réponse, `* ` bonne réponse), puis explication (`> `).
- ` ```predict ` : du code, une ligne `???`, puis les options comme un quiz (« Que va afficher ce code ? »).
- ` ```exercise ` : champs `@title`, `@prompt`, `@starter`, `@solution`, `@hint`, `@inputs` et `@check`. Le `@check` est du Python exécuté après le code de l'élève, avec les variables de l'élève, plus `OUT` (tout ce qui a été affiché) et `CODE` (le code source). Chaque `assert` qui échoue affiche son message à l'élève.
- ` ```tip `, ` ```info `, ` ```warn ` : encadrés. ` ```note ` : annotation manuscrite.
- ` ```widget ` : activité interactive, avec `@name` (`robot`, `order`, `binary`, `condition`, `stepper`, `tabs`) et `@config` (JSON). Voir les exemples dans `content/1-comprendre/`.
- ` ```html ` : HTML brut (schémas).

Pas de bloc ``` à l'intérieur d'un autre bloc : pour montrer un résultat dans un exercice, utilise un bloc indenté de 4 espaces.

Exemple d'exercice :

````
```exercise
@title Pair ou impair
@prompt
Affiche `pair` si `n` est pair, `impair` sinon.
@starter
n = 42
@solution
n = 42
print("pair" if n % 2 == 0 else "impair")
@check
assert OUT.strip() == "pair", "Avec n = 42, il faut afficher « pair »."
```
````
