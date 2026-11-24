/* Cahier de Code — application principale (routeur, leçons, progression). */
(function () {
  "use strict";
  const el = window.el;
  const { t, lang } = window.I18N;
  const C = window.COURSES[lang] || window.COURSES.fr;
  const app = document.getElementById("app");

  /* ================= Markdown ================= */
  marked.use({ gfm: true, breaks: false });
  window.md = (s) => marked.parse(s || "");
  window.mdInline = (s) => marked.parseInline(s || "");

  /* ================= Textes fixes de la page ================= */
  function applyStaticTexts() {
    document.title = t("siteTitle");
    document.querySelector(".skip").textContent = t("skip");
    document.querySelector(".brand").setAttribute("aria-label", t("homeLabel"));
    const nav = document.querySelector(".nav");
    nav.setAttribute("aria-label", t("navLabel"));
    nav.querySelector('[data-nav="parcours"]').textContent = t("navParcours");
    nav.querySelector('[data-nav="playground"]').textContent = t("navPlay");
    nav.querySelector('[data-nav="aide"]').textContent = t("navAide");
    document.getElementById("theme-toggle").setAttribute("aria-label", t("themeLabel"));
    const switcher = document.getElementById("lang-switch");
    switcher.setAttribute("aria-label", t("langLabel"));
    switcher.querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
      b.addEventListener("click", () => window.I18N.setLang(b.dataset.lang));
    });
  }
  applyStaticTexts();

  /* ================= Données du cours ================= */
  const LESSONS = [];
  C.modules.forEach((m, mi) => m.lessons.forEach((l, li) => LESSONS.push(Object.assign(l, { module: m, mi, li, index: LESSONS.length }))));
  const byId = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

  /* ================= Sauvegarde locale ================= */
  // La progression (leçons, XP, bons points) est commune aux deux langues ;
  // les brouillons de code et le bac à sable sont propres à chaque langue.
  const KEY = "cahier-de-code-v1";
  const DEFAULTS = () => ({ xp: 0, done: {}, steps: {}, badges: [], streak: { count: 0, last: null }, name: "", stats: { quizFirst: 0, runs: 0, errors: 0, charts: 0 }, playground: null, playground_en: null, drafts: {} });
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
  const PLAY_KEY = lang === "fr" ? "playground" : "playground_" + lang;
  const draftKey = (id) => (lang === "fr" ? id : lang + ":" + id);

  /* ================= Niveaux, XP, série, bons points ================= */
  const LEVEL_XP = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3500];
  function levelInfo(xp) {
    let i = 0;
    while (i < LEVEL_XP.length - 1 && xp >= LEVEL_XP[i + 1]) i++;
    const floor = LEVEL_XP[i];
    const next = i < LEVEL_XP.length - 1 ? LEVEL_XP[i + 1] : null;
    return { n: i + 1, name: t("levels")[i], floor, next, pct: next ? (xp - floor) / (next - floor) : 1 };
  }

  const B = t("badges");
  const badge = (id, icon) => ({ id, icon, title: B[id][0], desc: B[id][1] });
  const BADGES = [
    badge("first-run", "▶️"),
    badge("first-bug", "🐛"),
    badge("first-lesson", "📗"),
    badge("first-exercise", "✍️"),
    badge("quiz-10", "🎯"),
    badge("streak-3", "🔥"),
    badge("streak-7", "🌟"),
    badge("first-chart", "📊"),
    ...C.modules.map((m) => ({ id: "mod-" + m.id, icon: m.icon, title: m.badge, desc: t("badgeModuleDesc", { title: m.title }) })),
    badge("finisher", "🎓"),
  ];

  function award(id) {
    if (S.badges.includes(id)) return;
    const b = BADGES.find((x) => x.id === id);
    if (!b) return;
    S.badges.push(id);
    save();
    toast(`${b.icon}  ${t("badgeEarned", { title: b.title })}`, b.desc);
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
    const td = today();
    if (S.streak.last === td) return;
    S.streak.count = S.streak.last === today(-1) ? S.streak.count + 1 : 1;
    S.streak.last = td;
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
    const node = el("div", { class: "toast" }, el("strong", null, title), desc ? el("p", null, desc) : null);
    toasts.append(node);
    setTimeout(() => node.classList.add("out"), 4200);
    setTimeout(() => node.remove(), 4700);
  }

  /* ================= En-tête ================= */
  const hdr = {
    xp: document.getElementById("hdr-xp"),
    streak: document.getElementById("hdr-streak"),
    py: document.getElementById("hdr-py"),
  };
  function refreshHeader() {
    const lv = levelInfo(S.xp);
    hdr.xp.textContent = t("levelShort", { n: lv.n, xp: S.xp });
    hdr.xp.title = lv.next ? t("levelTitle", { name: lv.name, left: lv.next - S.xp }) : lv.name;
    const st = currentStreak();
    hdr.streak.textContent = `🔥 ${st}`;
    hdr.streak.title = st ? t("streakTitle", { n: st }) : t("streakNone");
  }
  Py.onState((s) => {
    const txt = { off: "", loading: t("pyLoading"), ready: t("pyReady"), error: t("pyError") }[s];
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
  const ERRORS = t("errors");

  function errorBox(err) {
    return el("div", { class: "err" },
      el("div", { class: "err-head" }, el("span", { class: "err-type" }, err.type), err.line ? el("span", { class: "err-line" }, t("errLine", { n: err.line })) : null),
      el("p", { class: "err-help" }, ERRORS[err.type] || t("errorDefault")),
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
    (res.images || []).forEach((b64) => out.append(el("img", { class: "out-img", src: "data:image/png;base64," + b64, alt: t("chartAlt") })));
    if (res.error) out.append(errorBox(res.error));
    if (!out.childNodes.length) out.append(el("p", { class: "muted small" }, t("noOutput")));
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
    const status = el("p", { class: "muted small running" }, Py.state === "ready" ? t("running") : t("waking"));
    out.append(status, live);
    const res = await Py.run(cm.getValue(), {
      key: opts.key,
      fresh: opts.fresh,
      inputs: opts.inputs ? opts.inputs() : [],
      onStatus: (s) => { status.textContent = s || t("running"); },
      onOut: (s) => { live.textContent += s; },
    });
    renderResult(out, res);
    markErrorLine(cm, res);
    afterRun(res);
    btn.disabled = false;
    return res;
  }

  function inputsField(initial) {
    const ta = el("textarea", { class: "inputs-box mono", rows: 2, spellcheck: "false", placeholder: t("inputsPlaceholder") });
    ta.value = initial || "";
    const wrap = el("label", { class: "inputs" }, el("span", null, t("inputsLabel")), ta);
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
    const runBtn = el("button", { class: "btn btn-run", type: "button" }, t("run"));
    const resetBtn = el("button", { class: "btn-link", type: "button", title: t("resetTitle") }, t("reset"));
    const node = el("div", { class: "code-block" },
      el("div", { class: "code-head" }, el("span", { class: "code-lang" }, "Python"), el("span", { class: "code-tip" }, t("editable")), el("span", { class: "spacer" }), resetBtn, runBtn),
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
      el("p", { class: "quiz-kind" }, b.code ? t("quizPredict") : t("quizQuestion")),
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
          node.append(marginMark(tries === 1 ? t("markRight") : t("markRightLate"), true));
          if (b.explain) { explain.hidden = false; explain.innerHTML = window.md(b.explain); }
          if (!solved) {
            solved = true;
            if (tries === 1) { S.stats.quizFirst++; if (S.stats.quizFirst >= 10) award("quiz-10"); }
            addXP(tries === 1 ? 10 : 5, btn);
            ctx.complete();
          }
        } else {
          btn.classList.add("wrong");
          node.append(marginMark(t("markWrong"), false));
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
    const runBtn = el("button", { class: "btn btn-ghost", type: "button" }, t("run"));
    const checkBtn = el("button", { class: "btn btn-run", type: "button" }, t("check"));
    const hintBtn = b.hint ? el("button", { class: "btn-link", type: "button" }, t("hint")) : null;
    const solBtn = el("button", { class: "btn-link", type: "button", hidden: true }, t("showSolution"));
    const hintBox = el("div", { class: "ex-hint", hidden: true });
    const solBox = el("div", { class: "ex-solution", hidden: true });
    const node = el("div", { class: "exercise" },
      el("div", { class: "ex-head" }, el("span", { class: "ex-badge" }, t("exBadge")), el("h3", null, b.title)),
      el("div", { class: "ex-prompt", html: window.md(b.prompt) }),
      el("div", { class: "code-block" }, el("div", { class: "code-head" }, el("span", { class: "code-lang" }, "Python"), el("span", { class: "spacer" }), runBtn, checkBtn), edWrap, inputs && inputs.node, out),
      el("div", { class: "ex-tools" }, hintBtn, solBtn),
      hintBox, feedback, solBox);
    const starter = b.starter ? b.starter.replace(/\n*$/, "\n") : "";
    const dk = draftKey(b.id);
    const cm = makeEditor(edWrap, S.drafts[dk] || starter, { onRun: () => checkBtn.click() });
    cm.setCursor(cm.lineCount(), 0);
    let saveTimer;
    cm.on("change", () => { clearTimeout(saveTimer); saveTimer = setTimeout(() => { S.drafts[dk] = cm.getValue(); save(); }, 500); });
    ctx.editors.push(cm);

    runBtn.addEventListener("click", () => runInto(cm, out, runBtn, { key: b.id, fresh: true, inputs: inputs && inputs.get }));
    if (hintBtn) hintBtn.addEventListener("click", () => { hintBox.hidden = false; hintBox.innerHTML = window.md(t("hintLabel") + b.hint); });
    solBtn.addEventListener("click", () => {
      usedSolution = true;
      solBox.hidden = false;
      solBox.innerHTML = "";
      const pre = el("pre", { class: "static-code mono" });
      highlight(b.solution, pre);
      solBox.append(el("p", { class: "w-label" }, t("solutionLabel")), pre,
        el("button", { class: "btn btn-ghost", type: "button", onclick: () => cm.setValue(b.solution) }, t("copyToEditor")));
      if (!passed) { passed = true; ctx.complete(); }
    });

    checkBtn.addEventListener("click", async () => {
      checkBtn.disabled = true;
      out.hidden = false;
      out.innerHTML = "";
      feedback.innerHTML = "";
      const status = el("p", { class: "muted small running" }, Py.state === "ready" ? t("checking") : t("waking"));
      out.append(status);
      const res = await Py.check(cm.getValue(), b.check, { key: b.id, inputs: inputs ? inputs.get() : [], onStatus: (s) => { status.textContent = s || t("checking"); } });
      renderResult(out, res);
      markErrorLine(cm, res);
      afterRun(res);
      checkBtn.disabled = false;
      node.querySelectorAll(".pen-mark").forEach((m) => m.remove());
      if (res.passed) {
        feedback.className = "ex-feedback good";
        feedback.innerHTML = window.md(t("exPassed") + (fails === 0 ? t("exFirstTry") : t("exPersist")));
        node.append(marginMark(t("markExOk"), true));
        if (!passed) {
          passed = true;
          addXP(usedSolution ? 5 : 20, checkBtn);
          if (!usedSolution) award("first-exercise");
          ctx.complete();
        }
      } else {
        fails++;
        feedback.className = "ex-feedback bad";
        const msg = res.ok ? res.checkMsg || t("exDefault") : t("exError");
        feedback.innerHTML = window.md(t("exNotYet") + msg);
        node.append(marginMark(t("markExBad"), false));
        if (fails >= 2 && b.solution) solBtn.hidden = false;
      }
    });
    if (ctx.restored && b.solution) solBtn.hidden = false;
    return { node, gated: true };
  }

  function calloutBlock(b) {
    const titles = { tip: t("calloutTip"), info: t("calloutInfo"), warn: t("calloutWarn"), note: "" };
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
    document.title = title ? t("pageTitle", { title }) : t("siteTitle");
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
  const dayLabel = () => (currentStreak() > 1 ? t("daysInRow") : t("dayInRow"));

  /* ---------- Accueil ---------- */
  function viewHome() {
    setPage("home");
    const nl = nextLesson();
    const started = Object.keys(S.done).length > 0;

    // mini interpréteur pour la démo de l'accueil
    const input = el("input", { class: "demo-input mono", value: t("demoCode"), spellcheck: "false", "aria-label": t("demoAria") });
    const output = el("div", { class: "demo-out mono", "aria-live": "polite" }, el("span", { class: "demo-placeholder" }, t("demoPlaceholder")));
    const demoNote = el("p", { class: "demo-note" });
    function demoRun() {
      const code = input.value.trim();
      let m = code.match(/^print\s*\(\s*(["'])(.*)\1\s*\)$/);
      output.className = "demo-out mono";
      if (m) { output.textContent = m[2]; demoNote.textContent = t("demoText"); return; }
      m = code.match(/^print\s*\(\s*([\d\s+\-*/().]+)\s*\)$/);
      if (m && /\d/.test(m[1])) {
        try {
          const v = Function(`"use strict"; return (${m[1]})`)();
          output.textContent = Number.isFinite(v) ? String(Math.round(v * 1e6) / 1e6) : t("demoDivZero");
          demoNote.textContent = t("demoCalc");
          return;
        } catch (e) { /* on tombe sur l'erreur ci-dessous */ }
      }
      output.className = "demo-out mono error";
      if (!/^print/.test(code)) { output.textContent = "NameError"; demoNote.textContent = t("demoNoPrint"); return; }
      output.textContent = "SyntaxError";
      demoNote.textContent = t("demoSyntax");
    }
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") demoRun(); });

    const chapters = el("ol", { class: "toc-home" }, C.modules.map((m, i) => {
      const p = moduleProgress(m);
      return el("li", null, el("a", { href: "#/lecon/" + m.lessons[0].id, class: "toc-row" },
        el("span", { class: "toc-num" }, i + 1),
        el("span", { class: "toc-main" }, el("span", { class: "toc-title" }, m.title), el("span", { class: "toc-desc" }, m.desc)),
        el("span", { class: "toc-dots", "aria-hidden": "true" }),
        el("span", { class: "toc-meta" }, p.d ? t("lessonsDone", { d: p.d, n: p.n }) : t("lessonsMeta", { n: p.n, min: totalMinutes(m) }))));
    }));

    const totalMin = LESSONS.reduce((a, l) => a + l.duration, 0);

    app.append(
      el("section", { class: "hero page-wrap" },
        el("div", { class: "hero-text" },
          el("h1", null, t("heroTitle")),
          el("p", { class: "lead" }, t("heroLead")),
          el("div", { class: "row-gap" },
            el("a", { class: "btn btn-primary btn-lg", href: "#/lecon/" + (nl || LESSONS[0]).id }, started && nl ? t("heroResume", { title: nl.title }) : t("heroStart")),
            el("a", { class: "btn btn-ghost btn-lg", href: "#/parcours" }, t("heroSee"))),
          el("p", { class: "hero-facts" }, t("heroFacts", { m: C.modules.length, l: LESSONS.length, h: Math.max(1, Math.round(totalMin / 60)) }))),
        el("div", { class: "hero-demo" },
          el("p", { class: "hand demo-label" }, t("demoLabel")),
          el("div", { class: "demo-sheet" },
            el("div", { class: "demo-line" }, el("span", { class: "demo-prompt mono", "aria-hidden": "true" }, "1"), input),
            el("div", { class: "row-gap demo-actions" }, el("button", { class: "btn btn-run", type: "button", onclick: demoRun }, t("run"))),
            el("p", { class: "w-label" }, t("demoResult")),
            output, demoNote),
          el("div", { class: "demo-tries" }, el("span", { class: "muted small" }, t("demoTry")),
            t("demoTries").map((s) => el("button", { class: "chip-btn mono", type: "button", onclick: () => { input.value = s; demoRun(); } }, s))))),

      el("section", { class: "page-wrap section" },
        el("div", { class: "section-head" }, el("h2", null, t("programTitle")), el("p", { class: "muted" }, t("programLead"))),
        chapters),

      el("section", { class: "page-wrap section outcome" },
        el("div", null,
          el("h2", null, t("outcomeTitle")),
          el("p", null, t("outcomeText")),
          (() => { const pre = el("pre", { class: "static-code mono" }); highlight(t("outcomeCode"), pre); return pre; })()),
        el("figure", { class: "outcome-chart", html: outcomeChart() })),

      el("section", { class: "page-wrap section how" },
        el("h2", null, t("howTitle")),
        el("div", { class: "how-grid" }, t("how").map(([a, b]) => howItem(a, b)))),
      footer()
    );
  }

  function howItem(title, d) { return el("div", { class: "how-item" }, el("h3", null, title), el("p", null, d)); }

  function outcomeChart() {
    // Chiffre d'affaires réel du fichier de ventes utilisé dans le cours
    const data = [["Paris", 2208], [lang === "fr" ? "Montréal" : "Montreal", 2225], ["Abidjan", 2278], ["Dakar", 2425], ["Kinshasa", 3131]];
    const max = 3131;
    const rows = data.map(([v, n], i) => {
      const y = 18 + i * 34;
      const w = (n / max) * 240;
      return `<text x="78" y="${y + 15}" text-anchor="end" class="ch-lbl">${v}</text><rect x="88" y="${y}" width="${w}" height="22" rx="3" class="ch-bar${i === 4 ? " top" : ""}"/><text x="${94 + w}" y="${y + 15}" class="ch-val">${lang === "fr" ? n.toLocaleString("fr-FR") + " €" : "€" + n.toLocaleString("en-US")}</text>`;
    }).join("");
    return `<svg viewBox="0 0 400 200" role="img" aria-label="${t("outcomeAria")}">${rows}</svg><figcaption class="hand">${t("outcomeCaption")}</figcaption>`;
  }

  function footer() {
    return el("footer", { class: "site-footer page-wrap" },
      el("p", null, t("footer")),
      el("p", { class: "muted small" }, t("footerSave")));
  }

  /* ---------- Parcours ---------- */
  function viewParcours() {
    setPage("parcours", t("parcoursTitle"));
    const lv = levelInfo(S.xp);
    const done = Object.keys(S.done).filter((k) => byId[k]).length;
    const nl = nextLesson();
    const nameInput = el("input", { class: "name-input", placeholder: t("namePlaceholder"), value: S.name, "aria-label": t("namePlaceholder"), maxlength: 40 });
    nameInput.addEventListener("change", () => { S.name = nameInput.value.trim(); save(); hello.textContent = greet(); });
    const greet = () => (S.name ? t("helloName", { name: S.name }) : t("hello"));
    const hello = el("h1", null, greet());

    app.append(el("div", { class: "page-wrap parcours" },
      el("header", { class: "parcours-head" },
        hello,
        el("label", { class: "name-field" }, el("span", { class: "muted small" }, t("nameLabel")), nameInput)),
      el("div", { class: "stats" },
        el("div", { class: "stat" }, el("span", { class: "stat-big" }, t("level", { n: lv.n })), el("span", { class: "stat-sub" }, lv.name),
          el("div", { class: "hl-bar", role: "progressbar", "aria-valuenow": Math.round(lv.pct * 100), "aria-valuemin": 0, "aria-valuemax": 100 }, el("span", { style: { width: lv.pct * 100 + "%" } })),
          el("span", { class: "muted small" }, lv.next ? t("xpLeft", { xp: S.xp, left: lv.next - S.xp, next: lv.n + 1 }) : t("xpOnly", { xp: S.xp }))),
        el("div", { class: "stat" }, el("span", { class: "stat-big" }, `🔥 ${currentStreak()}`), el("span", { class: "stat-sub" }, dayLabel()), el("span", { class: "muted small" }, t("streakTip"))),
        el("div", { class: "stat" }, el("span", { class: "stat-big" }, `${done}/${LESSONS.length}`), el("span", { class: "stat-sub" }, t("lessonsFinished")), el("span", { class: "muted small" }, t("badgesCount", { n: S.badges.length })))),
      nl ? el("a", { class: "resume", href: "#/lecon/" + nl.id },
        el("span", { class: "hand resume-label" }, done ? t("resumeContinue") : t("resumeStart")),
        el("span", { class: "resume-title" }, nl.title),
        el("span", { class: "muted" }, t("chapterMeta", { n: nl.mi + 1, title: nl.module.title, min: nl.duration })),
        el("span", { class: "btn btn-primary" }, done ? t("resumeBtn") : t("startBtn")))
        : el("a", { class: "resume", href: "#/certificat" }, el("span", { class: "hand resume-label" }, t("allDone")), el("span", { class: "resume-title" }, t("getCert")), el("span", { class: "btn btn-primary" }, t("seeCert"))),
      el("h2", { class: "section-title" }, t("summary")),
      el("div", { class: "chapters" }, C.modules.map((m, i) => chapterBlock(m, i, nl))),
      el("h2", { class: "section-title", id: "bons-points" }, t("myBadges")),
      el("div", { class: "badges" }, BADGES.map((b) => {
        const has = S.badges.includes(b.id);
        return el("div", { class: "badge" + (has ? " has" : ""), title: b.desc },
          el("span", { class: "badge-ico", "aria-hidden": "true" }, has ? b.icon : "?"),
          el("span", { class: "badge-title" }, b.title),
          el("span", { class: "badge-desc" }, has ? b.desc : t("notEarned")));
      })),
      el("p", { class: "reset-line" }, el("button", { class: "btn-link", type: "button", onclick: () => {
        if (confirm(t("resetConfirm"))) {
          const name = S.name; S = DEFAULTS(); S.name = name; save(); refreshHeader(); viewParcours();
        }
      } }, t("resetAll")))
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
          el("span", { class: "lesson-state", "aria-label": isDone ? t("stateDone") : isNext ? t("stateNext") : t("stateTodo") }, isDone ? "✓" : isNext ? "●" : "○"),
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
    const skipBtn = el("button", { class: "btn-link", type: "button", hidden: true }, t("skipActivity"));
    const toc = el("aside", { class: "toc", id: "toc" },
      el("a", { href: "#/parcours", class: "toc-back" }, t("backToSummary")),
      el("p", { class: "toc-chapter" }, t("chapterN", { n: L.mi + 1 })),
      el("p", { class: "toc-chapter-title" }, `${L.module.icon} ${L.module.title}`),
      el("ol", { class: "toc-lessons" }, L.module.lessons.map((l) => el("li", null,
        el("a", { href: "#/lecon/" + l.id, class: (l.id === L.id ? "current " : "") + (S.done[l.id] ? "done" : ""), "aria-current": l.id === L.id ? "page" : "false" },
          el("span", { class: "lesson-state" }, S.done[l.id] ? "✓" : l.id === L.id ? "●" : "○"), l.title)))));
    const tocToggle = el("button", { class: "btn btn-ghost toc-toggle", type: "button", "aria-controls": "toc", "aria-expanded": "false", onclick: () => {
      const open = toc.classList.toggle("open");
      tocToggle.setAttribute("aria-expanded", open ? "true" : "false");
    } }, t("chapterToc"));

    let current = -1;
    let pending = 0;
    let skipTimer = null;
    const editors = [];

    function updateFooter() {
      const last = current === L.steps.length - 1;
      contBtn.disabled = pending > 0;
      contBtn.textContent = pending > 0 ? t("continue") : last ? (alreadyDone ? t("reviewEnd") : t("finishLesson")) : t("continue");
      contHint.textContent = pending > 0 ? t("pendingHint") : t("enterHint");
      bar.firstChild.style.width = ((current + 1) / L.steps.length) * 100 + "%";
      if (alreadyDone && last) contBtn.textContent = nextLessonOf(L) ? t("nextLesson") : t("backToSummary");
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
      const target = e.target;
      if (target.closest && (target.closest(".CodeMirror") || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(target.tagName))) return;
      if (document.querySelector(".finish-overlay")) return;
      e.preventDefault();
      contBtn.click();
    };
    document.addEventListener("keydown", onKey);
    cleanupLesson = () => { document.removeEventListener("keydown", onKey); clearTimeout(skipTimer); };

    app.append(
      el("div", { class: "lesson-top" }, bar),
      el("div", { class: "lesson-layout" },
        toc,
        el("main", { class: "lesson", id: "main" },
          tocToggle,
          el("header", { class: "lesson-head" },
            el("p", { class: "lesson-kicker" }, t("chapterKicker", { n: L.mi + 1, title: L.module.title })),
            el("h1", null, L.title),
            L.subtitle ? el("p", { class: "lead" }, L.subtitle) : null,
            el("p", { class: "muted small" }, t("lessonOf", { n: L.li + 1, total: L.module.lessons.length, min: L.duration }) + (alreadyDone ? t("alreadyDone") : ""))),
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
    return el("nav", { class: "lesson-nav", "aria-label": t("neighbours") },
      prev ? el("a", { href: "#/lecon/" + prev.id }, el("span", { class: "muted small" }, t("prevLesson")), el("span", null, prev.title)) : el("span"),
      next ? el("a", { href: "#/lecon/" + next.id, class: "right" }, el("span", { class: "muted small" }, t("nextLesson")), el("span", null, next.title)) : el("span"));
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

    const goNext = el("a", { class: "btn btn-primary btn-lg", href: next ? "#/lecon/" + next.id : "#/certificat" }, next ? t("nextLessonTitle", { title: next.title }) : t("seeCert"));
    const overlay = el("div", { class: "finish-overlay", role: "dialog", "aria-modal": "true", "aria-labelledby": "finish-title" },
      el("div", { class: "finish-card" },
        el("div", { class: "finish-stamp" },
          el("h2", { id: "finish-title", class: "hand" }, moduleDone ? t("chapterDone") : t("lessonDone")),
          el("span", { html: `<svg viewBox="0 0 320 120" class="circle-draw" aria-hidden="true"><path d="M30 64 C 30 18, 280 8, 296 52 C 312 98, 120 116, 52 96 C 14 84, 22 40, 80 26"/></svg>` })),
        el("div", { class: "finish-stats" },
          el("div", null, el("strong", null, `+${lessonXP} XP`), el("span", null, t("xpEarned"))),
          el("div", null, el("strong", null, `🔥 ${currentStreak()}`), el("span", null, dayLabel())),
          el("div", null, el("strong", null, `${p.d}/${p.n}`), el("span", null, t("chapterLessons")))),
        moduleDone ? el("p", { class: "finish-msg" }, t("newBadge", { icon: L.module.icon, title: L.module.badge })) : null,
        el("div", { class: "row-gap center" }, goNext, el("a", { class: "btn btn-ghost", href: "#/parcours" }, t("backToSummary")))));
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
  function viewPlayground() {
    setPage("playground", t("playTitle"));
    Py.warmup();
    const EXAMPLES = t("examples");
    const out = el("div", { class: "code-out play-out", "aria-live": "polite" }, el("p", { class: "muted small" }, t("playOut")));
    const edWrap = el("div", { class: "code-editor play-editor" });
    const runBtn = el("button", { class: "btn btn-run", type: "button" }, t("run"));
    const inputs = inputsField("");
    const select = el("select", { class: "select", "aria-label": t("playExampleAria") }, el("option", { value: "" }, t("playExample")), Object.keys(EXAMPLES).map((k) => el("option", { value: k }, k)));
    app.append(el("div", { class: "page-wrap playground" },
      el("header", null, el("h1", null, t("playTitle")), el("p", { class: "lead" }, t("playLead"))),
      el("div", { class: "play-grid" },
        el("div", null,
          el("div", { class: "code-block" }, el("div", { class: "code-head" }, el("span", { class: "code-lang" }, "Python"), el("span", { class: "spacer" }), select, runBtn), edWrap, inputs.node),
          el("p", { class: "muted small" }, t("playShortcut"))),
        el("div", null, el("p", { class: "w-label" }, t("result")), out,
          el("p", { class: "w-label" }, t("filesAvailable")),
          el("ul", { class: "files" }, t("files").map(([f, d]) => el("li", null, el("code", null, f), el("span", { class: "muted small" }, d))))))));
    const cm = makeEditor(edWrap, S[PLAY_KEY] || Object.values(EXAMPLES)[0], { onRun: () => runBtn.click() });
    cm.setSize(null, 380);
    let timer;
    cm.on("change", () => { clearTimeout(timer); timer = setTimeout(() => { S[PLAY_KEY] = cm.getValue(); save(); }, 400); });
    select.addEventListener("change", () => { if (select.value) cm.setValue(EXAMPLES[select.value]); select.value = ""; });
    runBtn.addEventListener("click", () => runInto(cm, out, runBtn, { key: "playground", inputs: inputs.get }));
  }

  /* ---------- Aide-mémoire ---------- */
  function viewAide() {
    setPage("aide", t("navAide"));
    const body = el("div", { class: "prose aide", html: window.md(C.pages.aide || "") });
    body.querySelectorAll("pre > code").forEach((code) => {
      const src = code.textContent.replace(/\n$/, "");
      const pre = code.parentElement;
      const fresh = el("pre", { class: "static-code mono" });
      highlight(src, fresh);
      const tryBtn = el("button", { class: "btn-link try-btn", type: "button", onclick: () => { S[PLAY_KEY] = src; save(); location.hash = "#/bac-a-sable"; } }, t("tryInPlay"));
      pre.replaceWith(el("div", { class: "aide-code" }, fresh, tryBtn));
    });
    app.append(el("div", { class: "page-wrap aide-wrap" },
      el("header", null, el("h1", null, t("aideTitle")), el("p", { class: "lead" }, t("aideLead"))),
      body), footer());
  }

  /* ---------- Certificat ---------- */
  function viewCertificat() {
    setPage("certificat", t("certTitle"));
    const done = LESSONS.filter((l) => S.done[l.id]).length;
    const all = done === LESSONS.length;
    const nameInput = el("input", { class: "name-input", placeholder: t("certPlaceholder"), value: S.name, "aria-label": t("certNameAria"), maxlength: 60 });
    const certName = el("p", { class: "cert-name hand" }, S.name || t("certNameEmpty"));
    nameInput.addEventListener("input", () => { S.name = nameInput.value.trim(); save(); certName.textContent = S.name || t("certNameEmpty"); });
    const dates = Object.values(S.done).map((d) => d.date).sort();
    const finishDate = all && dates.length ? new Date(dates[dates.length - 1]).toLocaleDateString(t("numberLocale"), { day: "numeric", month: "long", year: "numeric" }) : "";
    const cert = el("div", { class: "cert" + (all ? "" : " locked") },
      el("p", { class: "cert-kicker" }, "Cahier de Code"),
      el("h2", null, t("certHeading")),
      el("p", null, t("certAttests")),
      certName,
      el("p", null, t("certCompleted", { n: LESSONS.length })),
      el("ul", { class: "cert-skills" }, C.modules.map((m) => el("li", null, m.title))),
      el("p", { class: "cert-foot" }, finishDate ? t("certOn", { date: finishDate }) : "", el("span", { class: "cert-seal hand", "aria-hidden": "true" }, "20/20")));
    app.append(el("div", { class: "page-wrap certificat" },
      el("header", { class: "no-print" }, el("h1", null, t("certYours")),
        all ? el("p", { class: "lead" }, t("certReady"))
          : el("p", { class: "lead" }, t("certLocked", { left: LESSONS.length - done, done, n: LESSONS.length })),
        all ? el("div", { class: "row-gap" }, nameInput, el("button", { class: "btn btn-primary", type: "button", onclick: () => window.print() }, t("certPrint")))
          : el("a", { class: "btn btn-primary", href: "#/lecon/" + (nextLesson() || LESSONS[0]).id }, t("continueCourse"))),
      cert));
  }

  function viewNotFound() {
    setPage("404", t("notFoundTitle"));
    app.append(el("div", { class: "page-wrap" }, el("h1", null, t("notFoundH")), el("p", null, t("notFoundP")), el("a", { class: "btn btn-primary", href: "#/parcours" }, t("goSummary"))));
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
