---
id: ordinateur
title: What is a computer, really?
subtitle: The fastest machine in the world… and the most obedient.
duration: 8
---
## You use computers all day long

Your phone, the supermarket checkout, the cash machine, your internet box, your neighbour's new car… They are all **computers**.

They look smart: they recognize your face, translate sentences, suggest exactly the video you feel like watching. So, does a computer think?

```quiz
In your opinion, is a computer intelligent?
- Yes, it understands what we ask it
* No, it carries out instructions without understanding them
- Only recent computers
> A computer understands nothing. It **carries out instructions**, one by one, at an insane speed: billions per second. All the "intelligence" comes from the people who wrote those instructions: **programmers**.
```

+++

## Fast, but terribly literal

Picture a cook who can chop a thousand onions per second, but has **no imagination at all**: they do exactly what they are told, nothing more, nothing less.

If you tell them "make an omelette", they don't move. They don't know what an omelette is. You have to say:

1. Take 3 eggs from the fridge.
2. Crack each egg over the bowl.
3. Throw the shells in the bin.
4. Beat the eggs for 30 seconds.
5. …

And if you forget step 3? There will be shells in the omelette. They will never think "hmm, that's weird".

```note
A computer does what you say, not what you mean.
That's THE sentence to remember from this lesson.
```

+++

## Input, processing, output

Every program, from the simplest to the most impressive, follows the same pattern:

```html
<div class="flow">
  <div class="flow-step"><b>Input</b><span>What we give the computer: a click, typed text, a photo, a file.</span></div>
  <div class="flow-step"><b>Processing</b><span>The program's instructions transform that data.</span></div>
  <div class="flow-step"><b>Output</b><span>The result: a display, a sound, a message sent, a file.</span></div>
</div>
```

Take a calculator: you type `12 × 4` (input), it calculates (processing), it displays `48` (output).

```quiz
You send a voice message on WhatsApp. What is the **input**?
* Your voice picked up by the microphone
- The message arriving on your friend's phone
- The internet network
> The input is what the program receives: your voice recorded by the microphone. Processing compresses and sends it. The output is the sound played on your friend's phone.
```

+++

## A program is a list of instructions

A **program** is a sequence of instructions written for a computer. **Programming** means writing those instructions, in the right order, without forgetting anything.

Try it right now. This little robot wants its cup of coffee ☕. It only knows three instructions: move forward one square, turn left, turn right. Build its program, then launch it.

```widget
@name robot
@config
{"levels": [
  {"grid": ["S..G"], "dir": "E", "hint": "The robot is facing right (the red arrow). How many squares must it move?"},
  {"grid": ["S..", "#.#", "..G"], "dir": "E", "hint": "Turning doesn't move the robot: it spins on the spot."},
  {"grid": ["S.#G", "#.#.", "#..."], "dir": "E", "hint": "Take your time: follow the path with your finger and write down each instruction."}
]}
```

+++

## What you just experienced

If the robot crashed into a rock, that's normal, and valuable. You just discovered three truths about programming:

- **Order matters.** "Move then turn" is not "turn then move".
- **Nothing is guessed.** The robot never "understood" where the coffee was. It followed your instructions.
- **You make mistakes, you fix them, you try again.** Professional programmers spend a big part of their time doing exactly that. It's called **debugging**.

```quiz
Your program makes the robot run into a rock. What do you do?
- I start everything again from scratch
* I look for the instruction that causes the problem and fix it
- I switch to another robot
> You don't throw everything away: you find the mistake (the "bug"), fix it, and run again. That's every programmer's normal cycle.
```
