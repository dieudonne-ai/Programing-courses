---
id: langages
title: Comment parle-t-on à un ordinateur ?
subtitle: Des 0 et des 1 jusqu'à Python.
duration: 10
---
## Tout est électricité

À l'intérieur d'un ordinateur, il y a des milliards de minuscules interrupteurs. Chacun n'a que deux états : **éteint** ou **allumé**. On les note **0** et **1**.

Un seul 0 ou 1 s'appelle un **bit**. Un groupe de 8 bits s'appelle un **octet**. Tu connais déjà ce mot : un fichier de 3 Mo (mégaoctets) contient environ 3 millions d'octets.

Avec 8 interrupteurs, on peut écrire tous les nombres de 0 à 255. Chaque interrupteur a une valeur : 128, 64, 32, 16, 8, 4, 2, 1. On additionne les valeurs des interrupteurs allumés.

```widget
@name binary
@config
{"target": 5, "showChar": false, "success": "Bravo : 00000101, c'est 4 + 1 = 5. Tu sais lire le binaire !"}
```

+++

## Les lettres aussi sont des nombres

Si l'ordinateur ne connaît que des nombres, comment affiche-t-il du texte ? Grâce à une convention : chaque lettre correspond à un nombre. Par exemple, **A** vaut 65, **B** vaut 66, **a** vaut 97.

Allume les bons interrupteurs pour écrire la lettre **A** (65).

```widget
@name binary
@config
{"target": 65, "success": "C'est ça : 01000001 = 64 + 1 = 65 = « A ». Quand tu tapes un message, ton téléphone stocke en réalité des nombres comme celui-ci."}
```

C'est pareil pour tout le reste : une photo est une grille de points de couleur (des **pixels**), et chaque couleur est un nombre. Une musique est une suite de nombres qui décrivent le son. **Pour un ordinateur, tout est nombre.**

+++

## Personne n'écrit en binaire

Écrire des programmes avec des 0 et des 1 serait un cauchemar. Alors on a inventé des **langages de programmation** : des langues plus proches de l'humain, que l'on traduit ensuite automatiquement en binaire.

Voici le même programme, « afficher Bonjour », dans quatre langages. Compare-les.

```widget
@name tabs
@config
{"tabs": [
  {"label": "Assembleur", "code": "section .data\n    msg db \"Bonjour\", 10\nsection .text\n    global _start\n_start:\n    mov rax, 1\n    mov rdi, 1\n    mov rsi, msg\n    mov rdx, 8\n    syscall\n    mov rax, 60\n    xor rdi, rdi\n    syscall", "note": "Très proche de la machine : on manipule directement les cases mémoire du processeur. Puissant, mais difficile à lire."},
  {"label": "C", "code": "#include <stdio.h>\n\nint main(void) {\n    printf(\"Bonjour\\n\");\n    return 0;\n}", "note": "Un langage des années 1970, toujours utilisé pour les systèmes d'exploitation et les objets connectés."},
  {"label": "JavaScript", "code": "console.log(\"Bonjour\");", "note": "Le langage des pages web : il tourne dans tous les navigateurs."},
  {"label": "Python", "code": "print(\"Bonjour\")", "note": "Une seule ligne, presque de l'anglais. C'est pour ça que Python est si populaire chez les débutants… et chez les scientifiques des données."}
]}
```

+++

## Langage de haut niveau, de bas niveau

On classe les langages selon leur distance avec la machine :

| | Bas niveau | Haut niveau |
|---|---|---|
| Exemples | Assembleur, C | Python, JavaScript |
| Proche de | la machine | l'humain |
| Facile à lire | non | oui |
| Contrôle fin du matériel | oui | moins |

Aucun n'est « meilleur » : on choisit l'outil selon le travail. Pour analyser des données, Python est le choix numéro un dans le monde.

```quiz
Quel est l'avantage principal d'un langage de haut niveau comme Python ?
- Il est plus proche des 0 et des 1
* Il est plus facile à lire et à écrire pour un humain
- Il n'a pas besoin d'être traduit
> Un langage de haut niveau est fait pour les humains. Il doit quand même être traduit pour la machine, mais ce travail est fait automatiquement.
```

+++

## Le traducteur : l'interpréteur Python

Qui traduit ton code Python en langage machine ? Un programme appelé l'**interpréteur Python**.

Pense à un **interprète** dans une conférence internationale : il écoute une phrase et la traduit aussitôt, phrase après phrase. L'interpréteur Python fait pareil : il lit ton code **ligne par ligne, de haut en bas**, et exécute chaque ligne.

Conséquence importante : si la ligne 5 contient une erreur, les lignes 1 à 4 ont déjà été exécutées, et Python s'arrête à la ligne 5.

```quiz
Ton programme fait 10 lignes. La ligne 7 contient une erreur. Que se passe-t-il ?
- Rien ne s'exécute
* Les lignes 1 à 6 s'exécutent, puis Python s'arrête et signale l'erreur ligne 7
- Python saute la ligne 7 et continue
> Python lit et exécute de haut en bas. Il s'arrête à la première erreur et t'indique son numéro de ligne. Très pratique pour la retrouver.
```

```tip
Bonne nouvelle : sur ce site, l'interpréteur Python tourne directement dans ta page web. Tu n'as rien à installer.
```
