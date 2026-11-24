/* Cahier de Code — application principale (routeur, leçons, progression). */
(function () {
  "use strict";
  const el = window.el;
  const C = window.COURSE;
  const app = document.getElementById("app");

  /* ================= Markdown ================= */
  marked.use({ gfm: true, breaks: false });
  window.md = (s) => marked.parse(s || "");
  window.mdInline = (s) => marked.parseInline(s || "");

  /* ================= Données du cours ================= */
  const LESSONS = [];
  C.modules.forEach((m, mi) => m.lessons.forEach((l, li) => LESSONS.push(Object.assign(l, { module: m, mi, li, index: LESSONS.length }))));
  const byId = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

  /* ================= Sauvegarde locale ================= */
  const KEY = "cahier-de-code-v1";
  const DEFAULTS = () => ({ xp: 0, done: {}, steps: {}, badges: [], streak: { count: 0, last: null }, name: "", stats: { quizFirst: 0, runs: 0, errors: 0, charts: 0 }, playground: null, drafts: {} });
  let S = load();
  function load() {
    const base = DEFAULTS();
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      return Object.assign(base, saved, { stats: Object.assign(base.stats, saved.stats || {}), streak: Object.assign(base.streak, saved.streak || {}) });
    } catch (e) {
      return base;
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* stockage indisponible : on continue sans */ }
  }

  /* ================= Niveaux, XP, série, bons points ================= */
  const LEVELS = [[0, "Curieux"], [100, "Apprenti"], [300, "Bidouilleur"], [600, "Codeur"], [1000, "Codeur confirmé"], [1500, "Analyste en herbe"], [2100, "Analyste"], [2800, "Data scientist junior"], [3500, "Maître du cahier"]];
  function levelInfo(xp) {
    let i = 0;
    while (i < LEVELS.length - 1 && xp >= LEVELS[i + 1][0]) i++;
    const floor = LEVELS[i][0];
    const next = i < LEVELS.length - 1 ? LEVELS[i + 1][0] : null;
    return { n: i + 1, name: LEVELS[i][1], floor, next, pct: next ? (xp - floor) / (next - floor) : 1 };
  }

  const BADGES = [
    { id: "first-run", icon: "▶️", title: "Premier code", desc: "Tu as exécuté ton premier code Python." },
    { id: "first-bug", icon: "🐛", title: "Premier bug", desc: "Ta première erreur. Bienvenue au club : tous les programmeurs en font, tous les jours." },
    { id: "first-lesson", icon: "📗", title: "Première leçon", desc: "Tu as terminé ta première leçon." },
    { id: "first-exercise", icon: "✍️", title: "Premier exercice", desc: "Ton premier exercice réussi sans aide." },
    { id: "quiz-10", icon: "🎯", title: "Tireur d'élite", desc: "10 quiz réussis du premier coup." },
    { id: "streak-3", icon: "🔥", title: "Trois jours de suite", desc: "Tu as appris 3 jours d'affilée." },
    { id: "streak-7", icon: "🌟", title: "Une semaine entière", desc: "7 jours d'affilée. C'est comme ça qu'on progresse." },
    { id: "first-chart", icon: "📊", title: "Premier graphique", desc: "Tu as dessiné ton premier graphique avec Python." },
    ...C.modules.map((m) => ({ id: "mod-" + m.id, icon: m.icon, title: m.badge, desc: `Chapitre terminé : ${m.title}.` })),
    { id: "finisher", icon: "🎓", title: "Cahier terminé", desc: "Toutes les leçons sont terminées. Bravo !" },
  ];

  function award(id) {
    if (S.badges.includes(id)) return;
    const b = BADGES.find((x) => x.id === id);
    if (!b) return;
    S.badges.push(id);
    save();
    toast(`${b.icon}  Bon point gagné : ${b.title}`, b.desc);
  }

  let lessonXP = 0;
  function addXP(n, anchor) {
    S.xp += n;
    lessonXP += n;
    save();
    refreshHeader();
    if (anchor) {
      const r = anchor.getBoundingClientRect();
      const f = el("div", { class: "xp-float", "aria-hidden": "true" }, "+" + n);
      f.style.left = r.left + Math.min(r.width - 40, 60) + "px";
      f.style.top = r.top + window.scrollY - 10 + "px";
      document.body.append(f);
      setTimeout(() => f.remove(), 1200);
    }
  }

  function today(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  }
  function touchStreak() {
    const t = today();
    if (S.streak.last === t) return;
    S.streak.count = S.streak.last === today(-1) ? S.streak.count + 1 : 1;
    S.streak.last = t;
    save();
    if (S.streak.count >= 3) award("streak-3");
    if (S.streak.count >= 7) award("streak-7");
  }
  function currentStreak() {
    return S.streak.last === today() || S.streak.last === today(-1) ? S.streak.count : 0;
  }

  /* ================= Toasts ================= */
  const toasts = el("div", { class: "toasts", "aria-live": "polite" });
  document.body.append(toasts);
  function toast(title, desc) {
    const t = el("div", { class: "toast" }, el("strong", null, title), desc ? el("p", null, desc) : null);
    toasts.append(t);
    setTimeout(() => t.classList.add("out"), 4200);
    setTimeout(() => t.remove(), 4700);
  }

  /* ================= En-tête ================= */
  const hdr = {
    xp: document.getElementById("hdr-xp"),
    streak: document.getElementById("hdr-streak"),
    py: document.getElementById("hdr-py"),
  };
  function refreshHeader() {
    const lv = levelInfo(S.xp);
    hdr.xp.textContent = `Niv. ${lv.n} · ${S.xp} XP`;
    hdr.xp.title = `${lv.name}${lv.next ? ` — encore ${lv.next - S.xp} XP pour le niveau suivant` : ""}`;
    const st = currentStreak();
    hdr.streak.textContent = `🔥 ${st}`;
    hdr.streak.title = st ? `${st} jour(s) d'affilée` : "Termine une leçon aujourd'hui pour lancer ta série";
  }
  Py.onState((s) => {
    const txt = { off: "", loading: "Python se réveille…", ready: "Python prêt", error: "Python indisponible" }[s];
    hdr.py.textContent = txt;
    hdr.py.className = "py-state " + s;
    hdr.py.hidden = s === "off";
  });

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = isDark ? "light" : "dark";
    try { localStorage.setItem("cahier-theme", root.dataset.theme); } catch (e) {}
  });

  /* ================= Éditeur de code ================= */
  function makeEditor(parent, value, opts = {}) {
    const runKeys = () => opts.onRun && opts.onRun();
    const cm = CodeMirror(parent, {
      value,
      mode: "python",
      theme: "cahier",
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      indentWithTabs: false,
      readOnly: opts.readOnly || false,
      viewportMargin: Infinity,
      extraKeys: {
        "Ctrl-Enter": runKeys,
        "Cmd-Enter": runKeys,
        "Shift-Enter": runKeys,
        Tab: (c) => (c.somethingSelected() ? c.indentSelection("add") : c.replaceSelection("    ", "end")),
        "Shift-Tab": (c) => c.indentSelection("subtract"),
      },
    });
    requestAnimationFrame(() => cm.refresh());
    return cm;
  }

  function highlight(code, target) {
    target.classList.add("cm-s-cahier");
    CodeMirror.runMode(code, "python", target);
  }

  /* ================= Affichage des résultats ================= */
  const ERRORS = {
    SyntaxError: "Python n'arrive pas à lire ton code : il y a une faute de « grammaire ». Vérifie les parenthèses, les guillemets et les deux-points (:) à la fin des lignes if, for, def…",
    IndentationError: "Problème de décalage. Les lignes à l'intérieur d'un bloc (après une ligne qui finit par « : ») doivent être décalées de 4 espaces, toutes de la même façon.",
    TabError: "Tu mélanges des tabulations et des espaces pour décaler tes lignes. Utilise uniquement des espaces.",
    NameError: "Python ne connaît pas ce nom. Faute de frappe ? Variable pas encore créée ? Ou bien tu as oublié les guillemets autour d'un texte ?",
    TypeError: "Tu mélanges des types qui ne vont pas ensemble (par exemple du texte + un nombre), ou tu utilises une fonction avec les mauvais éléments. Convertis avec str(), int() ou float() si besoin.",
    ValueError: "La valeur ne convient pas pour cette opération. Par exemple, int(\"bonjour\") est impossible : « bonjour » n'est pas un nombre.",
    ZeroDivisionError: "Division par zéro ! Même Python ne sait pas faire ça.",
    IndexError: "Tu demandes une position qui n'existe pas. Rappel : on compte à partir de 0, donc le dernier élément d'une liste de 3 éléments est à la position 2.",
    KeyError: "Cette clé n'existe pas (dans un dictionnaire) ou cette colonne n'existe pas (dans un tableau pandas). Vérifie l'orthographe, les accents et les majuscules.",
    AttributeError: "Cet objet n'a pas cette méthode ou cet attribut. Vérifie l'orthographe, et le type de ta variable avec type().",
    ModuleNotFoundError: "Ce module n'existe pas ou n'est pas disponible ici. Vérifie son nom.",
    ImportError: "L'import n'a pas fonctionné. Vérifie le nom de ce que tu importes.",
    FileNotFoundError: "Fichier introuvable. Vérifie le nom du fichier (et son extension, comme .csv).",
    EOFError: "Le programme attend une saisie avec input(), mais aucune valeur n'a été fournie.",
    RecursionError: "Ta fonction s'appelle elle-même à l'infini.",
    "Temps dépassé": "Le programme a été arrêté pour ne pas bloquer ton navigateur.",
  };

  function errorBox(err) {
    return el("div", { class: "err" },
      el("div", { class: "err-head" }, el("span", { class: "err-type" }, err.type), err.line ? el("span", { class: "err-line" }, `ligne ${err.line}`) : null),
      el("p", { class: "err-help" }, ERRORS[err.type] || "Une erreur est survenue. Lis le message : il contient souvent l'indice pour corriger."),
      err.msg ? el("pre", { class: "err-msg" }, err.msg) : null
    );
  }

  function renderResult(out, res) {
    out.innerHTML = "";
    if (res.stdout) out.append(el("pre", { class: "out-text" }, res.stdout));
    if (res.value) {
      if (res.value.kind === "html") out.append(el("div", { class: "out-html", html: res.value.data }));
      else out.append(el("pre", { class: "out-text out-value" }, res.value.data));
    }
    (res.images || []).forEach((b64) => out.append(el("img", { class: "out-img", src: "data:image/png;base64," + b64, alt: "Graphique produit par ton code" })));
    if (res.error) out.append(errorBox(res.error));
    if (!out.childNodes.length) out.append(el("p", { class: "muted small" }, "Le code s'est exécuté sans rien afficher. Pour voir un résultat, utilise print()."));
  }

  function afterRun(res) {
    S.stats.runs++;
    award("first-run");
    if (res.error) { S.stats.errors++; award("first-bug"); }
    if (res.images && res.images.length) { S.stats.charts++; award("first-chart"); }
    save();
  }

  function markErrorLine(cm, res) {
    cm.eachLine((line) => cm.removeLineClass(line, "background", "cm-err-line"));
    if (res.error && res.error.line && res.error.line <= cm.lineCount()) cm.addLineClass(res.error.line - 1, "background", "cm-err-line");
  }

  /* Exécute le code d'un éditeur et affiche le résultat en direct */
  async function runInto(cm, out, btn, opts) {
    btn.disabled = true;
    out.hidden = false;
    out.innerHTML = "";
    const live = el("pre", { class: "out-text" });
    const status = el("p", { class: "muted small running" }, Py.state === "ready" ? "Exécution…" : "Python se réveille (quelques secondes la première fois)…");
    out.append(status, live);
    const res = await Py.run(cm.getValue(), {
      key: opts.key,
      fresh: opts.fresh,
      inputs: opts.inputs ? opts.inputs() : [],
      onStatus: (t) => { status.textContent = t || "Exécution…"; },
      onOut: (t) => { live.textContent += t; },
    });
    renderResult(out, res);
    markErrorLine(cm, res);
    afterRun(res);
    btn.disabled = false;
    return res;
  }

  function inputsField(initial) {
    const ta = el("textarea", { class: "inputs-box mono", rows: 2, spellcheck: "false", placeholder: "Une valeur par ligne" });
    ta.value = initial || "";
    const wrap = el("label", { class: "inputs" }, el("span", null, "Entrées pour input() — une valeur par ligne"), ta);
    return { node: wrap, get: () => (ta.value ? ta.value.split("\n") : []) };
  }

  /* ================= Blocs de leçon ================= */
  function codeBlock(b, ctx) {
    if (!b.run) {
      const pre = el("pre", { class: "static-code mono" });
      if (b.lang && b.lang !== "python") pre.textContent = b.code; else highlight(b.code, pre);
      return el("div", { class: "code-block static" }, pre);
    }
    const out = el("div", { class: "code-out", hidden: true, "aria-live": "polite" });
    const edWrap = el("div", { class: "code-editor" });
    const needsInput = /\binput\s*\(/.test(b.code);
    const inputs = needsInput ? inputsField(b.inputs || "") : null;
    const runBtn = el("button", { class: "btn btn-run", type: "button" }, "▶ Exécuter");
    const resetBtn = el("button", { class: "btn-link", type: "button", title: "Remettre le code d'origine" }, "Réinitialiser");
    const node = el("div", { class: "code-block" },
      el("div", { class: "code-head" }, el("span", { class: "code-lang" }, "Python"), el("span", { class: "code-tip" }, "Tu peux modifier ce code"), el("span", { class: "spacer" }), resetBtn, runBtn),
      edWrap, inputs && inputs.node, out);
    const cm = makeEditor(edWrap, b.code, { onRun: () => runBtn.click() });
    runBtn.addEventListener("click", () => runInto(cm, out, runBtn, { key: ctx.nsKey, inputs: inputs && inputs.get }));
    resetBtn.addEventListener("click", () => cm.setValue(b.code));
    ctx.editors.push(cm);
    return node;
  }

  function marginMark(text, good) {
    return el("div", { class: "pen-mark " + (good ? "good" : "bad"), "aria-hidden": "true" }, text);
  }

  function quizBlock(b, ctx) {
    let tries = 0;
    let solved = ctx.restored;
    const opts = el("div", { class: "quiz-opts", role: "group" });
    const explain = el("div", { class: "quiz-explain", hidden: true });
    const node = el("div", { class: "quiz" + (b.code ? " predict" : "") },
      el("p", { class: "quiz-kind" }, b.code ? "Devine le résultat" : "Question"),
      el("div", { class: "quiz-q", html: window.md(b.q) }));
    if (b.code) {
      const pre = el("pre", { class: "static-code mono" });
      highlight(b.code, pre);
      node.append(pre);
    }
    node.append(opts, explain);
    b.options.forEach((o, i) => {
      const btn = el("button", { class: "quiz-opt", type: "button" },
        el("span", { class: "quiz-letter" }, String.fromCharCode(65 + i)),
        el("span", { class: "quiz-text", html: window.mdInline(o) }));
      btn.addEventListener("click", () => {
        if (solved && !ctx.restored) return;
        if (btn.classList.contains("wrong")) return;
        tries++;
        node.querySelectorAll(".pen-mark").forEach((m) => m.remove());
        if (i === b.answer) {
          btn.classList.add("right");
          opts.querySelectorAll(".quiz-opt").forEach((x) => (x.disabled = true));
          node.append(marginMark(tries === 1 ? "Bravo !" : "Voilà !", true));
          if (b.explain) { explain.hidden = false; explain.innerHTML = window.md(b.explain); }
          if (!solved) {
            solved = true;
            if (tries === 1) { S.stats.quizFirst++; if (S.stats.quizFirst >= 10) award("quiz-10"); }
            addXP(tries === 1 ? 10 : 5, btn);
            ctx.complete();
          }
        } else {
          btn.classList.add("wrong");
          node.append(marginMark("Non…", false));
          node.classList.remove("shake");
          void node.offsetWidth;
          node.classList.add("shake");
        }
      });
      opts.append(btn);
    });
    return { node, gated: true };
  }

  function exerciseBlock(b, ctx) {
    let fails = 0;
    let usedSolution = false;
    let passed = ctx.restored;
    const out = el("div", { class: "code-out", hidden: true, "aria-live": "polite" });
    const feedback = el("div", { class: "ex-feedback", "aria-live": "polite" });
    const edWrap = el("div", { class: "code-editor" });
    const needsInput = b.inputs || /\binput\s*\(/.test(b.starter + b.solution);
    const inputs = needsInput ? inputsField(b.inputs) : null;
    const runBtn = el("button", { class: "btn btn-ghost", type: "button" }, "▶ Exécuter");
    const checkBtn = el("button", { class: "btn btn-run", type: "button" }, "Vérifier ma réponse");
    const hintBtn = b.hint ? el("button", { class: "btn-link", type: "button" }, "Un indice ?") : null;
    const solBtn = el("button", { class: "btn-link", type: "button", hidden: true }, "Voir la solution");
    const hintBox = el("div", { class: "ex-hint", hidden: true });
    const solBox = el("div", { class: "ex-solution", hidden: true });
    const node = el("div", { class: "exercise" },
      el("div", { class: "ex-head" }, el("span", { class: "ex-badge" }, "À toi de jouer"), el("h3", null, b.title)),
      el("div", { class: "ex-prompt", html: window.md(b.prompt) }),
      el("div", { class: "code-block" }, el("div", { class: "code-head" }, el("span", { class: "code-lang" }, "Python"), el("span", { class: "spacer" }), runBtn, checkBtn), edWrap, inputs && inputs.node, out),
      el("div", { class: "ex-tools" }, hintBtn, solBtn),
      hintBox, feedback, solBox);
    const starter = b.starter ? b.starter.replace(/\n*$/, "\n") : "";
    const cm = makeEditor(edWrap, S.drafts[b.id] || starter, { onRun: () => checkBtn.click() });
    cm.setCursor(cm.lineCount(), 0);
    let saveTimer;
    cm.on("change", () => { clearTimeout(saveTimer); saveTimer = setTimeout(() => { S.drafts[b.id] = cm.getValue(); save(); }, 500); });
    ctx.editors.push(cm);

    runBtn.addEventListener("click", () => runInto(cm, out, runBtn, { key: b.id, fresh: true, inputs: inputs && inputs.get }));
    if (hintBtn) hintBtn.addEventListener("click", () => { hintBox.hidden = false; hintBox.innerHTML = window.md("**Indice :** " + b.hint); });
    solBtn.addEventListener("click", () => {
      usedSolution = true;
      solBox.hidden = false;
      solBox.innerHTML = "";
      const pre = el("pre", { class: "static-code mono" });
      highlight(b.solution, pre);
      solBox.append(el("p", { class: "w-label" }, "Une solution possible"), pre,
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => cm.setValue(b.solution) }, "Copier dans l'éditeur"));
      if (!passed) { passed = true; ctx.complete(); }
    });

    checkBtn.addEventListener("click", async () => {
      checkBtn.disabled = true;
      out.hidden = false;
      out.innerHTML = "";
      feedback.innerHTML = "";
      const status = el("p", { class: "muted small running" }, Py.state === "ready" ? "Vérification…" : "Python se réveille (quelques secondes la première fois)…");
      out.append(status);
      const res = await Py.check(cm.getValue(), b.check, { key: b.id, inputs: inputs ? inputs.get() : [], onStatus: (t) => { status.textContent = t || "Vérification…"; } });
      renderResult(out, res);
      markErrorLine(cm, res);
      afterRun(res);
      checkBtn.disabled = false;
      node.querySelectorAll(".pen-mark").forEach((m) => m.remove());
      if (res.passed) {
        feedback.className = "ex-feedback good";
        feedback.innerHTML = window.md("**Exercice réussi !** " + (fails === 0 ? "Du premier coup, en plus." : "La persévérance paie."));
        node.append(marginMark("Bien !", true));
        if (!passed) {
          passed = true;
          addXP(usedSolution ? 5 : 20, checkBtn);
          if (!usedSolution) award("first-exercise");
          ctx.complete();
        }
      } else {
        fails++;
        feedback.className = "ex-feedback bad";
        const msg = res.ok ? res.checkMsg || "Ce n'est pas encore ça." : "Ton code a produit une erreur (voir ci-dessus). Corrige-la puis vérifie à nouveau.";
        feedback.innerHTML = window.md("**Pas encore.** " + msg);
        node.append(marginMark("Revois", false));
        if (fails >= 2 && b.solution) solBtn.hidden = false;
      }
    });
    if (ctx.restored && b.solution) solBtn.hidden = false;
    return { node, gated: true };
  }

  function calloutBlock(b) {
    const titles = { tip: "Astuce", info: "Bon à savoir", warn: "Attention", note: "" };
    if (b.kind === "note") return el("aside", { class: "note-hand", html: window.md(b.v) });
    return el("aside", { class: "callout " + b.kind },
      el("p", { class: "callout-title" }, b.title || titles[b.kind]),
      el("div", { html: window.md(b.v) }));
  }

  function widgetBlock(b, ctx) {
    const root = el("div", { class: "widget" });
    let gated = false;
    gated = Widgets.render(b.name, root, b.config, () => {
      if (!ctx.restored && gated) { addXP(15, root); ctx.complete(); }
    });
    return { node: root, gated: gated && !ctx.restored };
  }

  function renderBlock(b, ctx) {
    switch (b.t) {
      case "md": { const d = el("div", { class: "prose", html: window.md(b.v) }); return { node: d }; }
      case "code": return { node: codeBlock(b, ctx) };
      case "quiz": return quizBlock(b, ctx);
      case "exercise": return exerciseBlock(b, ctx);
      case "callout": return { node: calloutBlock(b) };
      case "widget": return widgetBlock(b, ctx);
      case "html": return { node: el("div", { class: "raw", html: b.v }) };
      default: return { node: el("div") };
    }
  }

  /* ================= Vues ================= */
  function setPage(name, title) {
    document.title = title ? `${title} | Cahier de Code` : "Cahier de Code : apprends à coder en Python";
    document.body.dataset.page = name;
    document.querySelectorAll(".nav a").forEach((a) => a.setAttribute("aria-current", a.dataset.nav === name ? "page" : "false"));
    app.innerHTML = "";
    window.scrollTo(0, 0);
  }

  function nextLesson() {
    return LESSONS.find((l) => !S.done[l.id]) || null;
  }
  function moduleProgress(m) {
    const d = m.lessons.filter((l) => S.done[l.id]).length;
    return { d, n: m.lessons.length };
  }
  function totalMinutes(m) { return m.lessons.reduce((a, l) => a + l.duration, 0); }

  /* ---------- Accueil ---------- */
  function viewHome() {
    setPage("home");
    const nl = nextLesson();
    const started = Object.keys(S.done).length > 0;

    // mini interpréteur pour la démo de l'accueil
    const input = el("input", { class: "demo-input mono", value: 'print("Bonjour, je m\'appelle Awa !")', spellcheck: "false", "aria-label": "Ligne de code Python à modifier" });
    const output = el("div", { class: "demo-out mono", "aria-live": "polite" }, el("span", { class: "demo-placeholder" }, "Le résultat apparaîtra ici."));
    const demoNote = el("p", { class: "demo-note" });
    function demoRun() {
      const code = input.value.trim();
      let m = code.match(/^print\s*\(\s*(["'])(.*)\1\s*\)$/);
      output.className = "demo-out mono";
      if (m) { output.textContent = m[2]; demoNote.textContent = "C'est exactement ce que fait Python : il affiche le texte entre guillemets."; return; }
      m = code.match(/^print\s*\(\s*([\d\s+\-*/().,]+)\s*\)$/);
      if (m && /\d/.test(m[1])) {
        try {
          const v = Function(`"use strict"; return (${m[1].replace(/,/g, ".")})`)();
          output.textContent = Number.isFinite(v) ? String(Math.round(v * 1e6) / 1e6).replace(".", ",").replace(",", ".") : "Erreur : division par zéro";
          demoNote.textContent = "Sans guillemets, Python calcule.";
          return;
        } catch (e) { /* on tombe sur l'erreur ci-dessous */ }
      }
      output.className = "demo-out mono error";
      if (!/^print/.test(code)) { output.textContent = "NameError"; demoNote.textContent = "Commence ta ligne par print( pour que Python affiche quelque chose."; return; }
      output.textContent = "SyntaxError";
      demoNote.textContent = "Il manque sûrement un guillemet ou une parenthèse. Les erreurs font partie du jeu : on apprend à les lire dans le cours.";
    }
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") demoRun(); });
    const tries = ['print("Bonjour le monde")', "print(2026 - 1991)", 'print("Je vais apprendre Python")'];

    const chapters = el("ol", { class: "toc-home" }, C.modules.map((m, i) => {
      const p = moduleProgress(m);
      return el("li", null, el("a", { href: "#/lecon/" + m.lessons[0].id, class: "toc-row" },
        el("span", { class: "toc-num" }, i + 1),
        el("span", { class: "toc-main" }, el("span", { class: "toc-title" }, m.title), el("span", { class: "toc-desc" }, m.desc)),
        el("span", { class: "toc-dots", "aria-hidden": "true" }),
        el("span", { class: "toc-meta" }, p.d ? `${p.d}/${p.n} leçons` : `${p.n} leçons, ${totalMinutes(m)} min`)));
    }));

    const totalLessons = LESSONS.length;
    const totalMin = LESSONS.reduce((a, l) => a + l.duration, 0);

    app.append(
      el("section", { class: "hero page-wrap" },
        el("div", { class: "hero-text" },
          el("h1", null, "Apprends à parler aux ordinateurs."),
          el("p", { class: "lead" }, "Un cours en français pour comprendre ce qu'est vraiment la programmation, apprendre Python, puis analyser de vraies données. Tu écris du code dès la première leçon, directement dans ton navigateur. Rien à installer."),
          el("div", { class: "row-gap" },
            el("a", { class: "btn btn-primary btn-lg", href: "#/lecon/" + (nl || LESSONS[0]).id }, started && nl ? `Reprendre : ${nl.title}` : "Commencer la première leçon"),
            el("a", { class: "btn btn-ghost btn-lg", href: "#/parcours" }, "Voir le parcours")),
          el("p", { class: "hero-facts" }, `${C.modules.length} chapitres, ${totalLessons} leçons, environ ${Math.max(1, Math.round(totalMin / 60))} heures de cours. Gratuit, sans compte.`)),
        el("div", { class: "hero-demo" },
          el("p", { class: "hand demo-label" }, "Ton tout premier programme. Modifie-le, puis appuie sur Exécuter."),
          el("div", { class: "demo-sheet" },
            el("div", { class: "demo-line" }, el("span", { class: "demo-prompt mono", "aria-hidden": "true" }, "1"), input),
            el("div", { class: "row-gap demo-actions" }, el("button", { class: "btn btn-run", type: "button", onclick: demoRun }, "▶ Exécuter")),
            el("p", { class: "w-label" }, "Résultat"),
            output, demoNote),
          el("div", { class: "demo-tries" }, el("span", { class: "muted small" }, "Essaie aussi :"),
            tries.map((t) => el("button", { class: "chip-btn mono", type: "button", onclick: () => { input.value = t; demoRun(); } }, t))))),

      el("section", { class: "page-wrap section" },
        el("div", { class: "section-head" }, el("h2", null, "Le programme"), el("p", { class: "muted" }, "D'abord comprendre, ensuite coder, enfin analyser. Chaque chapitre s'appuie sur le précédent.")),
        chapters),

      el("section", { class: "page-wrap section outcome" },
        el("div", null,
          el("h2", null, "À la fin du cahier, tu sauras faire ça"),
          el("p", null, "Charger un vrai fichier de ventes, le nettoyer, poser des questions et répondre avec des chiffres et des graphiques. C'est le quotidien d'un analyste de données, et c'est le projet final du cours."),
          (() => { const pre = el("pre", { class: "static-code mono" }); highlight('import pandas as pd\n\nventes = pd.read_csv("ventes.csv")\nventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]\n\npar_ville = ventes.groupby("ville")["total"].sum()\npar_ville.sort_values().plot(kind="barh")', pre); return pre; })()),
        el("figure", { class: "outcome-chart", html: outcomeChart() })),

      el("section", { class: "page-wrap section how" },
        el("h2", null, "Comment on apprend ici"),
        el("div", { class: "how-grid" },
          howItem("Une idée à la fois", "Chaque leçon avance par petites étapes. Tu cliques sur Continuer quand tu as compris, pas avant."),
          howItem("Du vrai code", "Python tourne dans ta page. Tu modifies les exemples, tu casses, tu répares : c'est comme ça qu'on apprend."),
          howItem("Le stylo rouge du prof", "Chaque exercice est corrigé immédiatement, avec des messages d'erreur expliqués en français."),
          howItem("Des bons points", "Gagne de l'XP, garde ta série de jours et collectionne les bons points jusqu'au certificat."))),
      footer()
    );
  }

  function howItem(t, d) { return el("div", { class: "how-item" }, el("h3", null, t), el("p", null, d)); }

  function outcomeChart() {
    // Chiffre d'affaires réel du fichier ventes.csv utilisé dans le cours
    const data = [["Paris", 2208], ["Montréal", 2225], ["Abidjan", 2278], ["Dakar", 2425], ["Kinshasa", 3131]];
    const max = 3131;
    const rows = data.map(([v, n], i) => {
      const y = 18 + i * 34;
      const w = (n / max) * 240;
      return `<text x="78" y="${y + 15}" text-anchor="end" class="ch-lbl">${v}</text><rect x="88" y="${y}" width="${w}" height="22" rx="3" class="ch-bar${i === 4 ? " top" : ""}"/><text x="${94 + w}" y="${y + 15}" class="ch-val">${n.toLocaleString("fr-FR")} €</text>`;
    }).join("");
    return `<svg viewBox="0 0 400 200" role="img" aria-label="Graphique en barres : chiffre d'affaires par ville, Kinshasa en tête">${rows}</svg><figcaption class="hand">Kinshasa vend le plus. Pourquoi ? C'est la question suivante !</figcaption>`;
  }

  function footer() {
    return el("footer", { class: "site-footer page-wrap" },
      el("p", null, "Cahier de Code. Un cours libre pour apprendre la programmation et l'analyse de données en Python."),
      el("p", { class: "muted small" }, "Ta progression est enregistrée dans ce navigateur uniquement."));
  }

  /* ---------- Parcours ---------- */
  function viewParcours() {
    setPage("parcours", "Mon parcours");
    const lv = levelInfo(S.xp);
    const done = Object.keys(S.done).filter((k) => byId[k]).length;
    const nl = nextLesson();
    const nameInput = el("input", { class: "name-input", placeholder: "Ton prénom", value: S.name, "aria-label": "Ton prénom", maxlength: 40 });
    nameInput.addEventListener("change", () => { S.name = nameInput.value.trim(); save(); hello.textContent = greet(); });
    const greet = () => (S.name ? `Bonjour ${S.name} !` : "Bonjour !");
    const hello = el("h1", null, greet());

    app.append(el("div", { class: "page-wrap parcours" },
      el("header", { class: "parcours-head" },
        hello,
        el("label", { class: "name-field" }, el("span", { class: "muted small" }, "Ton prénom (pour le certificat)"), nameInput)),
      el("div", { class: "stats" },
        el("div", { class: "stat" }, el("span", { class: "stat-big" }, `Niveau ${lv.n}`), el("span", { class: "stat-sub" }, lv.name),
          el("div", { class: "hl-bar", role: "progressbar", "aria-valuenow": Math.round(lv.pct * 100), "aria-valuemin": 0, "aria-valuemax": 100 }, el("span", { style: { width: lv.pct * 100 + "%" } })),
          el("span", { class: "muted small" }, lv.next ? `${S.xp} XP, encore ${lv.next - S.xp} pour le niveau ${lv.n + 1}` : `${S.xp} XP`)),
        el("div", { class: "stat" }, el("span", { class: "stat-big" }, `🔥 ${currentStreak()}`), el("span", { class: "stat-sub" }, currentStreak() > 1 ? "jours d'affilée" : "jour de suite"), el("span", { class: "muted small" }, "Une leçon par jour suffit pour garder ta série.")),
        el("div", { class: "stat" }, el("span", { class: "stat-big" }, `${done}/${LESSONS.length}`), el("span", { class: "stat-sub" }, "leçons terminées"), el("span", { class: "muted small" }, `${S.badges.length} bon(s) point(s)`))),
      nl ? el("a", { class: "resume", href: "#/lecon/" + nl.id },
        el("span", { class: "hand resume-label" }, done ? "On continue ?" : "On commence ?"),
        el("span", { class: "resume-title" }, nl.title),
        el("span", { class: "muted" }, `Chapitre ${nl.mi + 1} : ${nl.module.title}, ${nl.duration} min`),
        el("span", { class: "btn btn-primary" }, done ? "Reprendre" : "Commencer"))
        : el("a", { class: "resume", href: "#/certificat" }, el("span", { class: "hand resume-label" }, "Tout est terminé !"), el("span", { class: "resume-title" }, "Récupère ton certificat"), el("span", { class: "btn btn-primary" }, "Voir mon certificat")),
      el("h2", { class: "section-title" }, "Sommaire"),
      el("div", { class: "chapters" }, C.modules.map((m, i) => chapterBlock(m, i, nl))),
      el("h2", { class: "section-title", id: "bons-points" }, "Mes bons points"),
      el("div", { class: "badges" }, BADGES.map((b) => {
        const has = S.badges.includes(b.id);
        return el("div", { class: "badge" + (has ? " has" : ""), title: b.desc },
          el("span", { class: "badge-ico", "aria-hidden": "true" }, has ? b.icon : "?"),
          el("span", { class: "badge-title" }, b.title),
          el("span", { class: "badge-desc" }, has ? b.desc : "Pas encore gagné"));
      })),
      el("p", { class: "reset-line" }, el("button", { class: "btn-link", type: "button", onclick: () => {
        if (confirm("Effacer toute ta progression (XP, leçons terminées, bons points) ? C'est définitif.")) {
          const name = S.name; S = DEFAULTS(); S.name = name; save(); refreshHeader(); viewParcours();
        }
      } }, "Recommencer à zéro"))
    ), footer());
  }

  function chapterBlock(m, i, nl) {
    const p = moduleProgress(m);
    return el("section", { class: "chapter" },
      el("div", { class: "chapter-head" },
        el("span", { class: "chapter-num hand" }, i + 1),
        el("div", null, el("h3", null, `${m.icon} ${m.title}`), el("p", { class: "muted" }, m.desc)),
        el("span", { class: "chapter-prog" + (p.d === p.n ? " full" : "") }, `${p.d}/${p.n}`)),
      el("ol", { class: "lesson-list" }, m.lessons.map((l) => {
        const isDone = !!S.done[l.id];
        const isNext = nl && nl.id === l.id;
        return el("li", null, el("a", { href: "#/lecon/" + l.id, class: "lesson-row" + (isDone ? " done" : "") + (isNext ? " next" : "") },
          el("span", { class: "lesson-state", "aria-label": isDone ? "terminée" : isNext ? "à faire maintenant" : "à faire" }, isDone ? "✓" : isNext ? "●" : "○"),
          el("span", { class: "lesson-name" }, l.title),
          el("span", { class: "toc-dots", "aria-hidden": "true" }),
          el("span", { class: "lesson-min" }, `${l.duration} min`)));
      })));
  }

  /* ---------- Leçon ---------- */
  let cleanupLesson = null;
  function viewLesson(id) {
    const L = byId[id];
    if (!L) return viewNotFound();
    setPage("lesson", L.title);
    lessonXP = 0;
    Py.reset(L.id);
    const hasCode = L.steps.some((s) => s.some((b) => b.t === "exercise" || (b.t === "code" && b.run)));
    if (L.module.data) Py.preload(["numpy", "pandas", "matplotlib"]);
    else if (hasCode) Py.warmup();

    const alreadyDone = !!S.done[L.id];
    const saved = alreadyDone ? L.steps.length - 1 : Math.min(S.steps[L.id] || 0, L.steps.length - 1);
    const stepsEl = el("div", { class: "steps" });
    const bar = el("div", { class: "lesson-bar" }, el("span"));
    const contBtn = el("button", { class: "btn btn-primary btn-lg continue", type: "button" });
    const contHint = el("p", { class: "muted small cont-hint" });
    const skipBtn = el("button", { class: "btn-link", type: "button", hidden: true }, "Passer cette activité");
    const toc = el("aside", { class: "toc", id: "toc" },
      el("a", { href: "#/parcours", class: "toc-back" }, "Retour au sommaire"),
      el("p", { class: "toc-chapter" }, `Chapitre ${L.mi + 1}`),
      el("p", { class: "toc-chapter-title" }, `${L.module.icon} ${L.module.title}`),
      el("ol", { class: "toc-lessons" }, L.module.lessons.map((l) => el("li", null,
        el("a", { href: "#/lecon/" + l.id, class: (l.id === L.id ? "current " : "") + (S.done[l.id] ? "done" : "") , "aria-current": l.id === L.id ? "page" : "false" },
          el("span", { class: "lesson-state" }, S.done[l.id] ? "✓" : l.id === L.id ? "●" : "○"), l.title)))));
    const tocToggle = el("button", { class: "btn btn-ghost toc-toggle", type: "button", "aria-controls": "toc", "aria-expanded": "false", onclick: () => {
      const open = toc.classList.toggle("open");
      tocToggle.setAttribute("aria-expanded", open ? "true" : "false");
    } }, "Sommaire du chapitre");

    let current = -1;
    let pending = 0;
    let skipTimer = null;
    const editors = [];

    function updateFooter() {
      const last = current === L.steps.length - 1;
      contBtn.disabled = pending > 0;
      contBtn.textContent = pending > 0 ? "Continuer" : last ? (alreadyDone ? "Revoir la fin" : "Terminer la leçon") : "Continuer";
      contHint.textContent = pending > 0 ? "Réponds à la question ou termine l'activité ci-dessus pour continuer." : "Astuce : la touche Entrée fonctionne aussi.";
      bar.firstChild.style.width = ((current + 1) / L.steps.length) * 100 + "%";
      if (alreadyDone && last) contBtn.textContent = nextLessonOf(L) ? "Leçon suivante" : "Retour au sommaire";
    }

    function reveal(i, restored) {
      current = i;
      pending = 0;
      clearTimeout(skipTimer);
      skipBtn.hidden = true;
      let hasWidgetGate = false;
      const section = el("section", { class: "step", "data-step": i + 1 }, el("span", { class: "step-num hand", "aria-hidden": "true" }, i + 1));
      const ctx = { nsKey: L.id, restored, editors, complete: () => { pending = Math.max(0, pending - 1); updateFooter(); } };
      L.steps[i].forEach((b) => {
        const r = renderBlock(b, ctx);
        if (r.gated && !restored) { pending++; if (b.t === "widget") hasWidgetGate = true; }
        section.append(r.node);
      });
      stepsEl.append(section);
      editors.forEach((cm) => requestAnimationFrame(() => cm.refresh()));
      if (!restored) {
        section.classList.add("enter");
        requestAnimationFrame(() => section.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }));
        if (!alreadyDone) { S.steps[L.id] = i; save(); }
      }
      if (hasWidgetGate) skipTimer = setTimeout(() => { skipBtn.hidden = false; }, 45000);
      updateFooter();
    }

    skipBtn.addEventListener("click", () => { pending = 0; skipBtn.hidden = true; updateFooter(); });

    contBtn.addEventListener("click", () => {
      if (pending > 0) return;
      if (current < L.steps.length - 1) reveal(current + 1, false);
      else if (alreadyDone) { const n = nextLessonOf(L); location.hash = n ? "#/lecon/" + n.id : "#/parcours"; }
      else completeLesson(L);
    });

    const onKey = (e) => {
      if (e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t.closest && (t.closest(".CodeMirror") || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(t.tagName))) return;
      if (document.querySelector(".finish-overlay")) return;
      e.preventDefault();
      contBtn.click();
    };
    document.addEventListener("keydown", onKey);
    cleanupLesson = () => { document.removeEventListener("keydown", onKey); clearTimeout(skipTimer); };

    const lessonNo = `Leçon ${L.li + 1} sur ${L.module.lessons.length}`;
    app.append(
      el("div", { class: "lesson-top" }, bar),
      el("div", { class: "lesson-layout" },
        toc,
        el("main", { class: "lesson", id: "main" },
          tocToggle,
          el("header", { class: "lesson-head" },
            el("p", { class: "lesson-kicker" }, `Chapitre ${L.mi + 1} : ${L.module.title}`),
            el("h1", null, L.title),
            L.subtitle ? el("p", { class: "lead" }, L.subtitle) : null,
            el("p", { class: "muted small" }, `${lessonNo}, environ ${L.duration} minutes` + (alreadyDone ? ". Déjà terminée, tu peux la relire." : ""))),
          stepsEl,
          el("div", { class: "lesson-foot" }, contBtn, contHint, skipBtn),
          lessonNav(L)))
    );
    for (let i = 0; i <= saved; i++) reveal(i, i < saved || alreadyDone);
    if (saved > 0 && !alreadyDone) {
      // la dernière étape restaurée garde ses exigences ; on la rend visible
      requestAnimationFrame(() => stepsEl.lastChild && stepsEl.lastChild.scrollIntoView({ block: "start" }));
    }
  }

  function nextLessonOf(L) { return LESSONS[L.index + 1] || null; }
  function lessonNav(L) {
    const prev = LESSONS[L.index - 1];
    const next = LESSONS[L.index + 1];
    return el("nav", { class: "lesson-nav", "aria-label": "Leçons voisines" },
      prev ? el("a", { href: "#/lecon/" + prev.id }, el("span", { class: "muted small" }, "Leçon précédente"), el("span", null, prev.title)) : el("span"),
      next ? el("a", { href: "#/lecon/" + next.id, class: "right" }, el("span", { class: "muted small" }, "Leçon suivante"), el("span", null, next.title)) : el("span"));
  }

  function completeLesson(L) {
    const first = !S.done[L.id];
    if (first) {
      S.done[L.id] = { date: today() };
      delete S.steps[L.id];
      addXP(50);
      award("first-lesson");
    }
    touchStreak();
    save();
    refreshHeader();
    const p = moduleProgress(L.module);
    const moduleDone = p.d === p.n;
    if (moduleDone) award("mod-" + L.module.id);
    if (LESSONS.every((l) => S.done[l.id])) award("finisher");
    const next = nextLessonOf(L);

    const goNext = el("a", { class: "btn btn-primary btn-lg", href: next ? "#/lecon/" + next.id : "#/certificat" }, next ? `Leçon suivante : ${next.title}` : "Voir mon certificat");
    const overlay = el("div", { class: "finish-overlay", role: "dialog", "aria-modal": "true", "aria-labelledby": "finish-title" },
      el("div", { class: "finish-card" },
        el("div", { class: "finish-stamp" },
          el("h2", { id: "finish-title", class: "hand" }, moduleDone ? "Chapitre terminé !" : "Leçon terminée !"),
          el("span", { html: `<svg viewBox="0 0 320 120" class="circle-draw" aria-hidden="true"><path d="M30 64 C 30 18, 280 8, 296 52 C 312 98, 120 116, 52 96 C 14 84, 22 40, 80 26"/></svg>` })),
        el("div", { class: "finish-stats" },
          el("div", null, el("strong", null, `+${lessonXP} XP`), el("span", null, "gagnés dans cette leçon")),
          el("div", null, el("strong", null, `🔥 ${currentStreak()}`), el("span", null, currentStreak() > 1 ? "jours d'affilée" : "jour de suite")),
          el("div", null, el("strong", null, `${p.d}/${p.n}`), el("span", null, "leçons du chapitre"))),
        moduleDone ? el("p", { class: "finish-msg" }, `Nouveau bon point : ${L.module.icon} ${L.module.badge}`) : null,
        el("div", { class: "row-gap center" }, goNext, el("a", { class: "btn btn-ghost", href: "#/parcours" }, "Retour au sommaire"))));
    document.body.append(overlay);
    goNext.focus();
    const close = () => overlay.remove();
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    overlay.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    overlay.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    if (window.confetti && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      confetti({ particleCount: moduleDone ? 160 : 90, spread: 75, origin: { y: 0.35 }, colors: ["#2347B8", "#D23B5A", "#FFE45C", "#198754"], disableForReducedMotion: true });
    }
  }

  /* ---------- Bac à sable ---------- */
  const EXAMPLES = {
    "Bonjour": 'prenom = "Awa"\nprint(f"Bonjour {prenom} !")',
    "Table de multiplication": "n = 7\nfor i in range(1, 11):\n    print(f\"{n} x {i} = {n * i}\")",
    "Lire ventes.csv": 'import pandas as pd\n\nventes = pd.read_csv("ventes.csv")\nventes.head()',
    "Graphique des ventes": 'import pandas as pd\nimport matplotlib.pyplot as plt\n\nventes = pd.read_csv("ventes.csv")\nventes["total"] = ventes["quantite"] * ventes["prix_unitaire"]\nventes.groupby("ville")["total"].sum().sort_values().plot(kind="barh", color="#2347B8")\nplt.title("Chiffre d\'affaires par ville")\nplt.show()',
    "Étudiants : heures vs note": 'import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv("etudiants.csv")\nplt.scatter(df["heures_etude"], df["note_python"], color="#D23B5A")\nplt.xlabel("Heures d\'étude")\nplt.ylabel("Note en Python (/20)")\nplt.show()',
  };

  function viewPlayground() {
    setPage("playground", "Bac à sable");
    Py.warmup();
    const out = el("div", { class: "code-out play-out", "aria-live": "polite" }, el("p", { class: "muted small" }, "Le résultat de ton code s'affichera ici."));
    const edWrap = el("div", { class: "code-editor play-editor" });
    const runBtn = el("button", { class: "btn btn-run", type: "button" }, "▶ Exécuter");
    const inputs = inputsField("");
    const select = el("select", { class: "select", "aria-label": "Charger un exemple" }, el("option", { value: "" }, "Charger un exemple…"), Object.keys(EXAMPLES).map((k) => el("option", { value: k }, k)));
    const files = [["ventes.csv", "Ventes 2024 d'une chaîne de cafés (date, ville, produit, quantité, prix)"], ["etudiants.csv", "40 étudiants : âge, ville, heures d'étude, notes"], ["clients.csv", "Fichier clients en désordre, parfait pour s'entraîner au nettoyage"], ["courses.txt", "Une liste de courses, un article par ligne"]];
    app.append(el("div", { class: "page-wrap playground" },
      el("header", null, el("h1", null, "Bac à sable"), el("p", { class: "lead" }, "Une page blanche pour tester tout ce que tu veux. Ton code est gardé dans ce navigateur.")),
      el("div", { class: "play-grid" },
        el("div", null,
          el("div", { class: "code-block" }, el("div", { class: "code-head" }, el("span", { class: "code-lang" }, "Python"), el("span", { class: "spacer" }), select, runBtn), edWrap, inputs.node),
          el("p", { class: "muted small" }, "Raccourci : Ctrl + Entrée pour exécuter.")),
        el("div", null, el("p", { class: "w-label" }, "Résultat"), out,
          el("p", { class: "w-label" }, "Fichiers disponibles"),
          el("ul", { class: "files" }, files.map(([f, d]) => el("li", null, el("code", null, f), el("span", { class: "muted small" }, d))))))));
    const cm = makeEditor(edWrap, S.playground || EXAMPLES["Bonjour"], { onRun: () => runBtn.click() });
    cm.setSize(null, 380);
    let t;
    cm.on("change", () => { clearTimeout(t); t = setTimeout(() => { S.playground = cm.getValue(); save(); }, 400); });
    select.addEventListener("change", () => { if (select.value) cm.setValue(EXAMPLES[select.value]); select.value = ""; });
    runBtn.addEventListener("click", () => runInto(cm, out, runBtn, { key: "playground", inputs: inputs.get }));
  }

  /* ---------- Aide-mémoire ---------- */
  function viewAide() {
    setPage("aide", "Aide-mémoire");
    const body = el("div", { class: "prose aide", html: window.md(C.pages.aide || "") });
    body.querySelectorAll("pre > code").forEach((code) => {
      const src = code.textContent.replace(/\n$/, "");
      const pre = code.parentElement;
      const fresh = el("pre", { class: "static-code mono" });
      highlight(src, fresh);
      const tryBtn = el("button", { class: "btn-link try-btn", type: "button", onclick: () => { S.playground = src; save(); location.hash = "#/bac-a-sable"; } }, "Essayer dans le bac à sable");
      pre.replaceWith(el("div", { class: "aide-code" }, fresh, tryBtn));
    });
    app.append(el("div", { class: "page-wrap aide-wrap" },
      el("header", null, el("h1", null, "Aide-mémoire Python"), el("p", { class: "lead" }, "L'essentiel du cours sur une seule page. Garde-la sous la main pendant les exercices.")),
      body), footer());
  }

  /* ---------- Certificat ---------- */
  function viewCertificat() {
    setPage("certificat", "Certificat");
    const done = LESSONS.filter((l) => S.done[l.id]).length;
    const all = done === LESSONS.length;
    const nameInput = el("input", { class: "name-input", placeholder: "Ton prénom et ton nom", value: S.name, "aria-label": "Nom sur le certificat", maxlength: 60 });
    const certName = el("p", { class: "cert-name hand" }, S.name || "Ton nom ici");
    nameInput.addEventListener("input", () => { S.name = nameInput.value.trim(); save(); certName.textContent = S.name || "Ton nom ici"; });
    const dates = Object.values(S.done).map((d) => d.date).sort();
    const finishDate = all && dates.length ? new Date(dates[dates.length - 1]).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
    const cert = el("div", { class: "cert" + (all ? "" : " locked") },
      el("p", { class: "cert-kicker" }, "Cahier de Code"),
      el("h2", null, "Certificat de réussite"),
      el("p", null, "Ce certificat atteste que"),
      certName,
      el("p", null, `a terminé les ${LESSONS.length} leçons du parcours « Programmation et analyse de données avec Python » :`),
      el("ul", { class: "cert-skills" }, C.modules.map((m) => el("li", null, m.title))),
      el("p", { class: "cert-foot" }, finishDate ? `Le ${finishDate}` : "", el("span", { class: "cert-seal hand", "aria-hidden": "true" }, "20/20")));
    app.append(el("div", { class: "page-wrap certificat" },
      el("header", { class: "no-print" }, el("h1", null, "Ton certificat"),
        all ? el("p", { class: "lead" }, "Tu as tout terminé. Écris ton nom, puis imprime ton certificat ou enregistre-le en PDF.")
          : el("p", { class: "lead" }, `Termine les ${LESSONS.length - done} leçons restantes pour débloquer ton certificat. Tu en es à ${done} sur ${LESSONS.length}.`),
        all ? el("div", { class: "row-gap" }, nameInput, el("button", { class: "btn btn-primary", type: "button", onclick: () => window.print() }, "Imprimer ou enregistrer en PDF"))
          : el("a", { class: "btn btn-primary", href: "#/lecon/" + (nextLesson() || LESSONS[0]).id }, "Continuer le parcours")),
      cert));
  }

  function viewNotFound() {
    setPage("404", "Page introuvable");
    app.append(el("div", { class: "page-wrap" }, el("h1", null, "Cette page n'existe pas"), el("p", null, "Le lien est peut-être ancien. Retourne au sommaire pour retrouver ta leçon."), el("a", { class: "btn btn-primary", href: "#/parcours" }, "Aller au sommaire")));
  }

  /* ================= Routeur ================= */
  function route() {
    if (cleanupLesson) { cleanupLesson(); cleanupLesson = null; }
    document.querySelectorAll(".finish-overlay").forEach((o) => o.remove());
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/");
    switch (parts[0]) {
      case "": return viewHome();
      case "parcours": return viewParcours();
      case "lecon": return viewLesson(decodeURIComponent(parts[1] || ""));
      case "bac-a-sable": return viewPlayground();
      case "aide-memoire": return viewAide();
      case "certificat": return viewCertificat();
      default: return viewNotFound();
    }
  }
  window.addEventListener("hashchange", route);
  refreshHeader();
  route();
})();
