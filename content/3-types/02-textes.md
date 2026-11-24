---
id: textes
title: Le texte et les f-strings
subtitle: Assembler, nettoyer et découper des chaînes de caractères.
duration: 14
---
## Coller des textes

Le `+` entre deux textes les **colle** l'un à l'autre (on dit *concaténer*). Le `*` répète un texte.

```py
prenom = "Moussa"
salut = "Bonjour " + prenom + " !"
print(salut)
print("Ha" * 3)
print("-" * 20)
```

Mais attention : on ne peut pas coller du texte et un nombre avec `+`.

```py
age = 30
print("J'ai " + age + " ans")
```

Python refuse (`TypeError`) : il ne sait pas s'il doit additionner ou coller. Il faut convertir le nombre en texte avec `str(age)`. Corrige le code ci-dessus.

+++

## Les f-strings : la méthode moderne

Il existe une façon bien plus pratique : les **f-strings**. On met un `f` devant les guillemets, et on écrit les variables **entre accolades** `{ }` directement dans le texte.

```py
prenom = "Moussa"
age = 30
ville = "Kinshasa"
print(f"Je m'appelle {prenom}, j'ai {age} ans et j'habite à {ville}.")
print(f"Dans 10 ans, j'aurai {age + 10} ans.")
```

On peut même faire des calculs dans les accolades, et formater les nombres. `:.2f` affiche 2 chiffres après la virgule :

```py
prix = 7.5
quantite = 3
print(f"Total : {prix * quantite:.2f} euros")
```

```tip
Les f-strings sont la façon la plus utilisée d'afficher des résultats en Python. Tu les verras partout, surtout en analyse de données.
```

+++

## Les méthodes de texte

Un texte possède des **méthodes** : des actions qu'on lui applique avec un point. Elles renvoient un nouveau texte.

```py
nom = "  aWa diallo  "
print(nom.upper())
print(nom.lower())
print(nom.strip())
print(nom.strip().title())
print("café au lait".replace("lait", "miel"))
print("banane".count("a"))
```

| Méthode | Effet |
|---|---|
| `.upper()` | tout en majuscules |
| `.lower()` | tout en minuscules |
| `.title()` | Majuscule À Chaque Mot |
| `.strip()` | enlève les espaces au début et à la fin |
| `.replace(a, b)` | remplace a par b |
| `.count(x)` | compte les x |

Ces méthodes sont essentielles pour **nettoyer des données** : dans un vrai fichier, tu trouveras « Dakar », « dakar » et « DAKAR  » qui désignent la même ville.

+++

## Longueur, positions et découpage

`len()` donne le nombre de caractères. Chaque caractère a une **position** (un *index*), et on commence à compter à **0**.

```py
mot = "Python"
print(len(mot))
print(mot[0])
print(mot[1])
print(mot[-1])
print(mot[0:3])
print(mot[2:])
```

```html
<div class="flow" aria-label="Positions des lettres du mot Python">
  <div class="flow-step"><b>P</b><span>0 ou -6</span></div>
  <div class="flow-step"><b>y</b><span>1 ou -5</span></div>
  <div class="flow-step"><b>t</b><span>2 ou -4</span></div>
  <div class="flow-step"><b>h</b><span>3 ou -3</span></div>
  <div class="flow-step"><b>o</b><span>4 ou -2</span></div>
  <div class="flow-step"><b>n</b><span>5 ou -1</span></div>
</div>
```

`mot[0:3]` prend de la position 0 **jusqu'à 3 exclu** : `Pyt`. Les positions négatives partent de la fin.

```predict
ville = "Abidjan"
print(ville[0] + ville[-1])
???
- Ab
* An
- Aj
> `ville[0]` est le premier caractère (A), `ville[-1]` le dernier (n). Collés : « An ».
```

Pour savoir si un texte en contient un autre, on utilise `in` :

```py
print("jus" in "jus de bissap")
print("thé" in "café")
```

+++

## Exercice : le badge

```exercise
@title Le badge de conférence
@prompt
Les variables `prenom` et `entreprise` contiennent les informations d'un participant. Avec **une f-string**, affiche exactement :

`Bienvenue Grace (Orange Digital) !`
@starter
prenom = "Grace"
entreprise = "Orange Digital"

print(f"...")
@solution
prenom = "Grace"
entreprise = "Orange Digital"

print(f"Bienvenue {prenom} ({entreprise}) !")
@hint
Dans une f-string, écris les variables entre accolades : {prenom}. Les parenthèses autour de l'entreprise sont du simple texte.
@check
assert 'f"' in CODE or "f'" in CODE, "Utilise une f-string : f\"...\"."
assert OUT.strip() == "Bienvenue Grace (Orange Digital) !", f"Attendu « Bienvenue Grace (Orange Digital) ! », obtenu « {OUT.strip()} »."
assert "{prenom}" in CODE.replace(" ", ""), "Utilise la variable prenom entre accolades plutôt que d'écrire Grace à la main."
```

+++

## Exercice : nettoyer un nom

```exercise
@title Un nom tout propre
@prompt
Un formulaire a été mal rempli : `brut = "   kOFI aNNAN   "`.

Crée une variable `propre` qui contient `Kofi Annan` (sans espaces autour, avec une majuscule à chaque mot) en utilisant des méthodes de texte, puis crée `initiales` qui contient `KA` en prenant la première lettre de chaque mot.
@starter
brut = "   kOFI aNNAN   "

propre = 
print(propre)

initiales = 
print(initiales)
@solution
brut = "   kOFI aNNAN   "

propre = brut.strip().title()
print(propre)

initiales = propre[0] + propre[5]
print(initiales)
@hint
Enchaîne les méthodes : brut.strip().title(). Pour les initiales, « Kofi Annan » : le K est en position 0, le A en position 5.
@check
assert propre == "Kofi Annan", f"propre devrait valoir « Kofi Annan », il vaut « {propre} »."
assert initiales == "KA", f"initiales devrait valoir « KA », il vaut « {initiales} »."
assert "Kofi Annan" not in CODE, "Calcule propre à partir de brut avec des méthodes, sans recopier le résultat."
```
