---
id: langages
title: How do we talk to a computer?
subtitle: From 0s and 1s all the way to Python.
duration: 10
---
## It's all electricity

Inside a computer there are billions of tiny switches. Each one has only two states: **off** or **on**. We write them **0** and **1**.

A single 0 or 1 is called a **bit**. A group of 8 bits is called a **byte**. You already know that word: a 3 MB (megabyte) file contains about 3 million bytes.

With 8 switches, you can write every number from 0 to 255. Each switch has a value: 128, 64, 32, 16, 8, 4, 2, 1. You add up the values of the switches that are on.

```widget
@name binary
@config
{"target": 5, "showChar": false, "success": "Well done: 00000101 is 4 + 1 = 5. You can read binary!"}
```

+++

## Letters are numbers too

If the computer only knows numbers, how does it display text? Thanks to a convention: each letter matches a number. For example, **A** is 65, **B** is 66, **a** is 97.

Switch on the right switches to write the letter **A** (65).

```widget
@name binary
@config
{"target": 65, "success": "That's it: 01000001 = 64 + 1 = 65 = \"A\". When you type a message, your phone actually stores numbers like this one."}
```

It's the same for everything else: a photo is a grid of coloured dots (**pixels**), and each colour is a number. A song is a sequence of numbers that describe the sound. **To a computer, everything is a number.**

+++

## Nobody writes in binary

Writing programs with 0s and 1s would be a nightmare. So people invented **programming languages**: languages closer to human language, which are then automatically translated into binary.

Here is the same program, "display Hello", in four languages. Compare them.

```widget
@name tabs
@config
{"tabs": [
  {"label": "Assembly", "code": "section .data\n    msg db \"Hello\", 10\nsection .text\n    global _start\n_start:\n    mov rax, 1\n    mov rdi, 1\n    mov rsi, msg\n    mov rdx, 6\n    syscall\n    mov rax, 60\n    xor rdi, rdi\n    syscall", "note": "Very close to the machine: you directly handle the processor's memory slots. Powerful, but hard to read."},
  {"label": "C", "code": "#include <stdio.h>\n\nint main(void) {\n    printf(\"Hello\\n\");\n    return 0;\n}", "note": "A language from the 1970s, still used for operating systems and connected devices."},
  {"label": "JavaScript", "code": "console.log(\"Hello\");", "note": "The language of web pages: it runs in every browser."},
  {"label": "Python", "code": "print(\"Hello\")", "note": "One single line, almost plain English. That's why Python is so popular with beginners… and with data scientists."}
]}
```

+++

## High-level and low-level languages

Languages are classified by how far they are from the machine:

| | Low level | High level |
|---|---|---|
| Examples | Assembly, C | Python, JavaScript |
| Close to | the machine | humans |
| Easy to read | no | yes |
| Fine control of the hardware | yes | less |

None is "better": you choose the tool for the job. For analyzing data, Python is the number one choice in the world.

```quiz
What is the main advantage of a high-level language like Python?
- It is closer to 0s and 1s
* It is easier for a human to read and write
- It doesn't need to be translated
> A high-level language is made for humans. It still has to be translated for the machine, but that job is done automatically.
```

+++

## The translator: the Python interpreter

Who translates your Python code into machine language? A program called the **Python interpreter**.

Think of an **interpreter** at an international conference: they listen to a sentence and translate it immediately, sentence after sentence. The Python interpreter does the same: it reads your code **line by line, from top to bottom**, and runs each line.

An important consequence: if line 5 contains an error, lines 1 to 4 have already run, and Python stops at line 5.

```quiz
Your program has 10 lines. Line 7 contains an error. What happens?
- Nothing runs
* Lines 1 to 6 run, then Python stops and reports the error on line 7
- Python skips line 7 and carries on
> Python reads and runs from top to bottom. It stops at the first error and tells you its line number. Very handy to find it.
```

```tip
Good news: on this site, the Python interpreter runs right inside your web page. Nothing to install.
```
