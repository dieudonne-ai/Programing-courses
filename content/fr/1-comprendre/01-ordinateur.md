---
id: ordinateur
title: Un ordinateur, c'est quoi vraiment ?
subtitle: La machine la plus rapide du monde… et la plus obéissante.
duration: 8
---
## Tu utilises des ordinateurs toute la journée

Ton téléphone, la caisse du supermarché, le distributeur de billets, la box internet, la voiture récente de ton voisin… Ce sont tous des **ordinateurs**.

Ils ont l'air intelligents : ils reconnaissent ton visage, traduisent des phrases, te proposent la vidéo que tu as envie de voir. Alors, un ordinateur, est-ce que ça réfléchit ?

```quiz
D'après toi, un ordinateur est-il intelligent ?
- Oui, il comprend ce qu'on lui demande
* Non, il exécute des instructions sans les comprendre
- Seulement les ordinateurs récents
> Un ordinateur ne comprend rien. Il **exécute des instructions**, une par une, à une vitesse folle : des milliards par seconde. Toute « l'intelligence » vient des personnes qui ont écrit ces instructions : les **programmeurs**.
```

+++

## Rapide, mais terriblement littéral

Imagine un cuisinier capable de couper mille oignons par seconde, mais qui n'a **aucune imagination** : il fait exactement ce qu'on lui dit, ni plus, ni moins.

Si tu lui dis « fais une omelette », il ne bouge pas. Il ne sait pas ce qu'est une omelette. Il faut lui dire :

1. Prends 3 œufs dans le frigo.
2. Casse chaque œuf au-dessus du bol.
3. Jette les coquilles à la poubelle.
4. Bats les œufs pendant 30 secondes.
5. …

Et si tu oublies l'étape 3 ? Il y aura des coquilles dans l'omelette. Il ne se dira jamais « tiens, c'est bizarre ».

```note
Un ordinateur fait ce que tu lui dis, pas ce que tu veux dire.
C'est LA phrase à retenir de cette leçon.
```

+++

## Entrée, traitement, sortie

Tous les programmes, du plus simple au plus impressionnant, suivent le même schéma :

```html
<div class="flow">
  <div class="flow-step"><b>Entrée</b><span>Ce qu'on donne à l'ordinateur : un clic, un texte tapé, une photo, un fichier.</span></div>
  <div class="flow-step"><b>Traitement</b><span>Les instructions du programme transforment ces données.</span></div>
  <div class="flow-step"><b>Sortie</b><span>Le résultat : un affichage, un son, un message envoyé, un fichier.</span></div>
</div>
```

Prends une calculatrice : tu tapes `12 × 4` (entrée), elle calcule (traitement), elle affiche `48` (sortie).

```quiz
Tu envoies un message vocal sur WhatsApp. Qu'est-ce qui est l'**entrée** ?
* Ta voix captée par le micro
- Le message qui arrive chez ton ami
- Le réseau internet
> L'entrée, c'est ce que le programme reçoit : ta voix enregistrée par le micro. Le traitement la compresse et l'envoie. La sortie, c'est le son joué sur le téléphone de ton ami.
```

+++

## Un programme, c'est une liste d'instructions

Un **programme** est une suite d'instructions écrites pour un ordinateur. **Programmer**, c'est écrire ces instructions, dans le bon ordre, sans rien oublier.

Essaie tout de suite. Ce petit robot veut sa tasse de café ☕. Il ne connaît que trois instructions : avancer d'une case, tourner à gauche, tourner à droite. Construis son programme, puis lance-le.

```widget
@name robot
@config
{"levels": [
  {"grid": ["S..G"], "dir": "E", "hint": "Le robot regarde vers la droite (la flèche rouge). Combien de cases doit-il avancer ?"},
  {"grid": ["S..", "#.#", "..G"], "dir": "E", "hint": "Tourner ne fait pas avancer : le robot pivote sur place."},
  {"grid": ["S.#G", "#.#.", "#..."], "dir": "E", "hint": "Prends ton temps : suis le chemin avec ton doigt et note chaque instruction."}
]}
```

+++

## Ce que tu viens de vivre

Si le robot s'est cogné dans un rocher, c'est normal, et c'est précieux. Tu viens de découvrir trois vérités de la programmation :

- **L'ordre compte.** « Avancer puis tourner » n'est pas « tourner puis avancer ».
- **Rien n'est deviné.** Le robot n'a jamais « compris » où était le café. Il a suivi tes instructions.
- **On se trompe, on corrige, on relance.** Les programmeurs professionnels passent une grande partie de leur temps à faire exactement ça. Ça s'appelle **déboguer**.

```quiz
Ton programme fait foncer le robot dans un rocher. Que fais-tu ?
- Je recommence tout de zéro
* Je cherche l'instruction qui pose problème et je la corrige
- Je change de robot
> On ne jette pas tout : on cherche l'erreur (le « bug »), on la corrige, et on relance. C'est le cycle normal de tout programmeur.
```
