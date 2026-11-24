#!/usr/bin/env python3
"""Compile les leçons Markdown de `content/<langue>/` en un seul fichier `js/course-data.js`.

Usage :  python3 build.py

Le format des leçons est décrit dans README.md (section « Écrire une leçon »).
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONTENT = ROOT / "content"
OUT = ROOT / "js" / "course-data.js"

FENCE_RE = re.compile(r"^```\s*([\w-]*)\s*(.*)$")
FIELD_RE = re.compile(r"^@(\w+)\s?(.*)$")


class BuildError(Exception):
    pass


def parse_front_matter(text: str, path: Path) -> tuple[dict, str]:
    if not text.startswith("---\n"):
        raise BuildError(f"{path}: la leçon doit commencer par un bloc '---'")
    end = text.find("\n---\n", 4)
    if end == -1:
        raise BuildError(f"{path}: bloc '---' de début non fermé")
    meta = {}
    for line in text[4:end].splitlines():
        if not line.strip():
            continue
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    return meta, text[end + 5 :]


def parse_fields(lines: list[str]) -> dict:
    """Lit des lignes du type '@cle valeur' ; les lignes suivantes s'ajoutent à la clé."""
    fields: dict[str, list[str]] = {"body": []}
    current = "body"
    for line in lines:
        m = FIELD_RE.match(line)
        if m:
            current = m.group(1)
            fields[current] = [m.group(2)] if m.group(2) else []
        else:
            fields.setdefault(current, []).append(line)
    return {k: "\n".join(v).strip("\n") for k, v in fields.items()}


def parse_quiz(lines: list[str], path: Path) -> dict:
    question, options, explain = [], [], []
    answer = None
    for line in lines:
        if line.startswith(("- ", "* ")) and not explain:
            if line.startswith("* "):
                if answer is not None:
                    raise BuildError(f"{path}: un quiz ne peut avoir qu'une seule bonne réponse")
                answer = len(options)
            options.append(line[2:].strip())
        elif line.startswith(">"):
            explain.append(line[1:].strip())
        elif not options:
            question.append(line)
        elif line.strip():
            raise BuildError(f"{path}: ligne inattendue dans un quiz : {line!r}")
    if answer is None or len(options) < 2:
        raise BuildError(f"{path}: un quiz doit avoir au moins 2 options et une réponse marquée '*'")
    return {
        "q": "\n".join(question).strip(),
        "options": options,
        "answer": answer,
        "explain": "\n".join(explain).strip(),
    }


def make_block(kind: str, flags: str, lines: list[str], path: Path, lesson_id: str, counters: dict) -> dict:
    nested = [l for l in lines if l.startswith("```")]
    if nested:
        raise BuildError(f"{path}: bloc ``` imbriqué dans un bloc {kind!r} ({nested[0]!r}). Utilise un bloc indenté de 4 espaces à la place.")
    if kind == "py":
        block = {"t": "code", "code": "\n".join(lines), "run": "static" not in flags}
        m = re.search(r"inputs=(\S+)", flags)
        if m:
            block["inputs"] = m.group(1).replace("|", "\n")
        return block
    if kind == "quiz":
        return {"t": "quiz", **parse_quiz(lines, path)}
    if kind == "predict":
        if "???" not in lines:
            raise BuildError(f"{path}: un bloc predict doit contenir une ligne '???'")
        i = lines.index("???")
        quiz = parse_quiz(lines[i + 1 :], path)
        quiz["q"] = quiz["q"] or "Que va afficher ce code ?"
        return {"t": "quiz", "code": "\n".join(lines[:i]), **quiz}
    if kind == "exercise":
        f = parse_fields(lines)
        counters["ex"] += 1
        for needed in ("prompt", "check"):
            if not f.get(needed):
                raise BuildError(f"{path}: exercice sans @{needed}")
        return {
            "t": "exercise",
            "id": f"{lesson_id}-ex{counters['ex']}",
            "title": f.get("title", "Exercice"),
            "prompt": f["prompt"],
            "starter": f.get("starter", ""),
            "solution": f.get("solution", ""),
            "check": f["check"],
            "hint": f.get("hint", ""),
            "inputs": f.get("inputs", ""),
        }
    if kind == "widget":
        f = parse_fields(lines)
        try:
            config = json.loads(f.get("config") or "{}")
        except json.JSONDecodeError as e:
            raise BuildError(f"{path}: JSON invalide dans @config du widget : {e}") from e
        return {"t": "widget", "name": f.get("name", ""), "config": config}
    if kind in ("tip", "info", "warn", "note"):
        f = parse_fields(lines)
        return {"t": "callout", "kind": kind, "title": f.get("title", ""), "v": f["body"]}
    if kind == "html":
        return {"t": "html", "v": "\n".join(lines)}
    # Tout autre langage : bloc de code affiché, non exécutable.
    return {"t": "code", "code": "\n".join(lines), "run": False, "lang": kind or "text"}


def parse_step(text: str, path: Path, lesson_id: str, counters: dict) -> list[dict]:
    blocks: list[dict] = []
    md: list[str] = []
    lines = text.split("\n")
    i = 0

    def flush_md():
        content = "\n".join(md).strip()
        if content:
            blocks.append({"t": "md", "v": content})
        md.clear()

    while i < len(lines):
        m = FENCE_RE.match(lines[i])
        if m and lines[i].startswith("```"):
            flush_md()
            kind, flags = m.group(1), m.group(2)
            j = i + 1
            while j < len(lines) and lines[j].rstrip() != "```":
                j += 1
            if j >= len(lines):
                raise BuildError(f"{path}: bloc ``` non fermé (ligne {i + 1})")
            blocks.append(make_block(kind, flags, lines[i + 1 : j], path, lesson_id, counters))
            i = j + 1
        else:
            md.append(lines[i])
            i += 1
    flush_md()
    return blocks


def parse_lesson(path: Path) -> dict:
    meta, body = parse_front_matter(path.read_text(encoding="utf-8"), path)
    for key in ("id", "title"):
        if key not in meta:
            raise BuildError(f"{path}: champ '{key}' manquant dans l'en-tête")
    counters = {"ex": 0}
    steps = [
        parse_step(chunk, path, meta["id"], counters)
        for chunk in re.split(r"^\+\+\+\s*$", body, flags=re.M)
        if chunk.strip()
    ]
    return {
        "id": meta["id"],
        "title": meta["title"],
        "subtitle": meta.get("subtitle", ""),
        "duration": int(meta.get("duration", 10)),
        "steps": steps,
    }


LANGS = ("fr", "en")  # le français est la langue de référence


def build_course(lang: str) -> dict:
    root = CONTENT / lang
    course = json.loads((root / "course.json").read_text(encoding="utf-8"))
    seen: set[str] = set()
    kept = []
    for module in course["modules"]:
        folder = root / module.pop("dir")
        files = sorted(folder.glob("*.md"))
        if not files:
            print(f"Attention [{lang}] : {folder.name} ne contient aucune leçon, chapitre ignoré.", file=sys.stderr)
            continue
        kept.append(module)
        module["lessons"] = []
        for f in files:
            lesson = parse_lesson(f)
            if lesson["id"] in seen:
                raise BuildError(f"{f}: identifiant de leçon en double '{lesson['id']}'")
            seen.add(lesson["id"])
            module["lessons"].append(lesson)
    course["modules"] = kept
    course["pages"] = {name: (root / file).read_text(encoding="utf-8") for name, file in course.get("pages", {}).items()}
    return course


def structure(course: dict) -> list:
    """Squelette comparable entre langues : chapitres, leçons, nombre d'exercices."""
    return [
        (m["id"], [(l["id"], sum(1 for s in l["steps"] for b in s if b["t"] == "exercise")) for l in m["lessons"]])
        for m in course["modules"]
    ]


def main() -> int:
    courses = {lang: build_course(lang) for lang in LANGS if (CONTENT / lang / "course.json").exists()}
    ref = structure(courses["fr"])
    for lang, course in courses.items():
        if lang != "fr" and structure(course) != ref:
            raise BuildError(
                f"La version '{lang}' n'a pas la même structure que la version française "
                "(mêmes chapitres, mêmes identifiants de leçons, même nombre d'exercices par leçon)."
            )

    payload = json.dumps(courses, ensure_ascii=False, indent=None, separators=(",", ":"))
    OUT.write_text(
        "// Fichier généré par build.py — ne pas modifier à la main.\n"
        f"window.COURSES = {payload};\n",
        encoding="utf-8",
    )
    for lang, course in courses.items():
        n = sum(len(m["lessons"]) for m in course["modules"])
        print(f"OK [{lang}] : {len(course['modules'])} modules, {n} leçons")
    print(f"-> {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except BuildError as e:
        print(f"Erreur : {e}", file=sys.stderr)
        sys.exit(1)
