/* Widgets interactifs utilisés dans les leçons (```widget dans le Markdown). */

/* Petit utilitaire de création d'éléments, partagé avec app.js */
window.el = function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else if (k === "style" && typeof v === "object") Object.assign(node.style, v);
      else node.setAttribute(k, v === true ? "" : v);
    }
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
};

window.Widgets = (function () {
  const el = window.el;
  const t = (k, v) => window.I18N.t(k, v);

  /* ---------------- Robot à programmer ---------------- */
  const DIRS = ["N", "E", "S", "W"];
  const DELTA = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
  const ANGLE = { N: -90, E: 0, S: 90, W: 180 };
  const CMD = {
    F: { label: t("wCmdF"), icon: "⬆" },
    L: { label: t("wCmdL"), icon: "↺" },
    R: { label: t("wCmdR"), icon: "↻" },
  };

  function robotSVG() {
    return `<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="7" y="9" width="24" height="22" rx="6" fill="var(--blue)"/><circle cx="16" cy="17" r="3" fill="#fff"/><circle cx="16" cy="25" r="3" fill="#fff"/><circle cx="17" cy="17" r="1.4" fill="#111"/><circle cx="17" cy="25" r="1.4" fill="#111"/><path d="M31 14 L38 20 L31 26 Z" fill="var(--red)"/></svg>`;
  }

  function robot(root, cfg, done) {
    const levels = cfg.levels || [];
    const loops = !!cfg.loops;
    let lv = 0;
    let program = [];
    let running = false;

    const status = el("div", { class: "w-status", role: "status" });
    const board = el("div", { class: "robot-board" });
    const prog = el("div", { class: "robot-program", "aria-label": t("wProgramAria") });
    const levelLabel = el("div", { class: "robot-level" });
    const hint = el("p", { class: "robot-hint" });
    const buttons = el("div", { class: "robot-cmds" },
      ...Object.entries(CMD).map(([k, c]) =>
        el("button", { class: "chip-btn", type: "button", onclick: () => add(k) }, el("span", { class: "cmd-ico" }, c.icon), c.label)
      )
    );
    const runBtn = el("button", { class: "btn btn-primary", type: "button", onclick: run }, t("wLaunch"));
    const clearBtn = el("button", { class: "btn btn-ghost", type: "button", onclick: () => { program = []; drawProgram(); reset(); } }, t("wClear"));

    root.append(
      el("div", { class: "robot" },
        el("div", { class: "robot-left" }, levelLabel, board, hint),
        el("div", { class: "robot-right" },
          el("p", { class: "w-label" }, t("wAvailable")),
          buttons,
          el("p", { class: "w-label" }, t("wYourProgram")),
          prog,
          el("div", { class: "row-gap" }, runBtn, clearBtn),
          status
        )
      )
    );

    let pos, dir, robotEl, goal, grid;

    function parse() {
      const L = levels[lv];
      grid = L.grid.map((r) => r.split(""));
      grid.forEach((row, y) => row.forEach((c, x) => {
        if (c === "S") pos = [x, y];
        if (c === "G") goal = [x, y];
      }));
      dir = L.dir || "E";
    }

    function drawBoard() {
      board.innerHTML = "";
      board.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`;
      board.style.maxWidth = grid[0].length * 76 + "px";
      grid.forEach((row, y) => row.forEach((c, x) => {
        const cell = el("div", { class: "cell" + (c === "#" ? " wall" : "") });
        if (c === "G") cell.append(el("span", { class: "goal", title: t("wGoal") }, "☕"));
        if (c === "#") cell.append(el("span", { class: "rock", "aria-label": t("wRock") }, "🪨"));
        board.append(cell);
      }));
      robotEl = el("div", { class: "robot-bot", html: robotSVG() });
      board.append(robotEl);
      placeRobot();
    }

    function placeRobot() {
      const cols = grid[0].length, rows = grid.length;
      robotEl.style.width = 100 / cols + "%";
      robotEl.style.height = 100 / rows + "%";
      robotEl.style.left = (pos[0] * 100) / cols + "%";
      robotEl.style.top = (pos[1] * 100) / rows + "%";
      robotEl.firstElementChild.style.transform = `rotate(${ANGLE[dir]}deg)`;
    }

    function drawProgram(active) {
      prog.innerHTML = "";
      if (!program.length) prog.append(el("span", { class: "muted" }, t("wEmptyProgram")));
      program.forEach((p, i) => {
        const chip = el("span", { class: "prog-chip" + (i === active ? " active" : "") },
          el("span", { class: "num" }, i + 1), CMD[p.cmd].icon + " " + CMD[p.cmd].label);
        if (loops) {
          chip.append(el("button", { class: "rep", type: "button", title: t("wRepeat"), onclick: () => { p.n = (p.n % 5) + 1; drawProgram(); } }, "×" + p.n));
        }
        chip.append(el("button", { class: "del", type: "button", "aria-label": t("wDelete"), onclick: () => { program.splice(i, 1); drawProgram(); } }, "✕"));
        prog.append(chip);
      });
    }

    function add(cmd) {
      if (running) return;
      program.push({ cmd, n: 1 });
      drawProgram();
    }

    function setLevel() {
      const L = levels[lv];
      parse();
      levelLabel.textContent = t("wLevel", { n: lv + 1, total: levels.length }) + (L.maxBlocks ? t("wMaxBlocks", { n: L.maxBlocks }) : "");
      hint.innerHTML = L.hint ? window.mdInline(L.hint) : "";
      program = [];
      drawBoard();
      drawProgram();
      say("");
    }

    function reset() { parse(); placeRobot(); }

    function say(t, kind) { status.className = "w-status" + (kind ? " " + kind : ""); status.textContent = t; }

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    async function run() {
      if (running || !program.length) { if (!program.length) say(t("wAddFirst"), "bad"); return; }
      const L = levels[lv];
      if (L.maxBlocks && program.length > L.maxBlocks) {
        say(t("wTooMany", { n: program.length, max: L.maxBlocks }), "bad");
        return;
      }
      running = true;
      reset();
      say(t("wRunning"));
      await wait(250);
      for (let i = 0; i < program.length; i++) {
        drawProgram(i);
        for (let k = 0; k < program[i].n; k++) {
          const c = program[i].cmd;
          if (c === "L") dir = DIRS[(DIRS.indexOf(dir) + 3) % 4];
          if (c === "R") dir = DIRS[(DIRS.indexOf(dir) + 1) % 4];
          if (c === "F") {
            const nx = pos[0] + DELTA[dir][0], ny = pos[1] + DELTA[dir][1];
            if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[0].length || grid[ny][nx] === "#") {
              robotEl.classList.add("bump");
              await wait(400);
              robotEl.classList.remove("bump");
              say(t("wBump", { i: i + 1 }), "bad");
              running = false;
              return;
            }
            pos = [nx, ny];
          }
          placeRobot();
          await wait(380);
        }
      }
      drawProgram();
      running = false;
      if (pos[0] === goal[0] && pos[1] === goal[1]) {
        robotEl.classList.add("win");
        if (lv < levels.length - 1) {
          say(t("wNextLevel"), "good");
          await wait(1300);
          lv++;
          setLevel();
        } else {
          say(t("wAllLevels"), "good");
          done && done();
        }
      } else {
        say(t("wNotThere"), "bad");
      }
    }

    setLevel();
  }

  /* ---------------- Remettre dans l'ordre ---------------- */
  function order(root, cfg, done) {
    const correct = cfg.items;
    let items = correct.map((t, i) => ({ t, i }));
    // mélange déterministe, jamais déjà dans l'ordre
    do { items.sort(() => Math.random() - 0.5); } while (items.every((it, k) => it.i === k));
    const list = el("ol", { class: "order-list" });
    const status = el("div", { class: "w-status", role: "status" });
    let solved = false;
    let dragFrom = null;

    function move(from, to) {
      if (to < 0 || to >= items.length || solved) return;
      const [it] = items.splice(from, 1);
      items.splice(to, 0, it);
      draw();
    }

    function draw(showResult) {
      list.innerHTML = "";
      items.forEach((it, k) => {
        const li = el("li", { class: "order-item" + (showResult ? (it.i === k ? " ok" : " ko") : ""), draggable: solved ? null : "true" },
          el("span", { class: "grip", "aria-hidden": "true" }, "⋮⋮"),
          el("span", { class: "order-text", html: window.mdInline(it.t) }),
          el("span", { class: "order-btns" },
            el("button", { type: "button", class: "icon-btn", "aria-label": t("wUp"), disabled: k === 0 || solved, onclick: () => move(k, k - 1) }, "↑"),
            el("button", { type: "button", class: "icon-btn", "aria-label": t("wDown"), disabled: k === items.length - 1 || solved, onclick: () => move(k, k + 1) }, "↓")
          )
        );
        li.addEventListener("dragstart", () => { dragFrom = k; li.classList.add("dragging"); });
        li.addEventListener("dragend", () => li.classList.remove("dragging"));
        li.addEventListener("dragover", (e) => e.preventDefault());
        li.addEventListener("drop", (e) => { e.preventDefault(); if (dragFrom !== null) move(dragFrom, k); dragFrom = null; });
        list.append(li);
      });
    }

    const check = el("button", { class: "btn btn-primary", type: "button", onclick: () => {
      const good = items.filter((it, k) => it.i === k).length;
      draw(true);
      if (good === items.length) {
        solved = true;
        draw(true);
        check.disabled = true;
        status.className = "w-status good";
        status.textContent = cfg.success || t("wOrderOk");
        done && done();
      } else {
        status.className = "w-status bad";
        status.textContent = t("wOrderBad", { good, n: items.length });
      }
    } }, t("wCheckOrder"));

    root.append(el("div", { class: "order" }, cfg.prompt ? el("p", { class: "w-label", html: window.mdInline(cfg.prompt) }) : null, list, el("div", { class: "row-gap" }, check), status));
    draw();
  }

  /* ---------------- Binaire ---------------- */
  function binary(root, cfg, done) {
    const n = cfg.bits || 8;
    const bits = new Array(n).fill(0);
    const target = cfg.target;
    const cells = el("div", { class: "bits" });
    const sum = el("div", { class: "bits-sum" });
    const status = el("div", { class: "w-status", role: "status" });
    let finished = false;

    function draw() {
      cells.innerHTML = "";
      bits.forEach((b, i) => {
        const value = 2 ** (n - 1 - i);
        cells.append(el("button", { type: "button", class: "bit" + (b ? " on" : ""), "aria-pressed": b ? "true" : "false", onclick: () => { bits[i] = 1 - bits[i]; draw(); } },
          el("span", { class: "bit-val" }, b), el("span", { class: "bit-weight" }, value)));
      });
      const total = bits.reduce((acc, b, i) => acc + b * 2 ** (n - 1 - i), 0);
      const parts = bits.map((b, i) => (b ? 2 ** (n - 1 - i) : null)).filter((x) => x !== null);
      const ch = total >= 33 && total <= 126 ? String.fromCharCode(total) : null;
      sum.innerHTML = "";
      sum.append(
        el("span", { class: "mono" }, bits.join("")),
        el("span", { class: "muted" }, t("wInBinary")),
        el("span", { class: "mono" }, parts.length ? parts.join(" + ") + " = " : ""),
        el("strong", { class: "big-num" }, total),
        cfg.showChar !== false && ch ? el("span", { class: "muted" }, t("wTheLetter"), el("strong", { class: "big-num" }, t("wQuote", { c: ch }))) : null
      );
      if (target !== undefined && !finished) {
        if (total === target) {
          finished = true;
          status.className = "w-status good";
          status.textContent = cfg.success || t("wBinaryOk", { bits: bits.join(""), target });
          done && done();
        } else {
          status.className = "w-status";
          status.textContent = t("wBinaryGoal", { target });
        }
      }
    }
    root.append(el("div", { class: "binary" }, cells, sum, status));
    draw();
  }

  /* ---------------- Condition interactive ---------------- */
  function condition(root, cfg) {
    let value = cfg.value;
    const code = el("div", { class: "cond-code mono" });
    const out = el("div", { class: "cond-out mono" });
    const label = el("span", { class: "mono" });
    const slider = el("input", { type: "range", min: cfg.min, max: cfg.max, value, "aria-label": cfg.name, oninput: (e) => { value = +e.target.value; draw(); } });

    function active() {
      for (let i = 0; i < cfg.branches.length; i++) {
        const b = cfg.branches[i];
        if (b.lt === undefined && b.gte === undefined) return i;
        if (b.lt !== undefined && value < b.lt) return i;
        if (b.gte !== undefined && value >= b.gte) return i;
      }
      return -1;
    }

    function draw() {
      label.textContent = `${cfg.name} = ${value}`;
      const a = active();
      code.innerHTML = "";
      code.append(el("div", { class: "cond-line" }, `${cfg.name} = ${value}`));
      cfg.branches.forEach((b, i) => {
        code.append(el("div", { class: "cond-line" + (i === a ? " hit" : "") }, b.code));
        code.append(el("div", { class: "cond-line indent" + (i === a ? " hit" : " dim") }, `print("${b.out}")`));
      });
      out.textContent = a >= 0 ? cfg.branches[a].out : "";
    }

    root.append(el("div", { class: "cond" },
      el("label", { class: "cond-slider" }, el("span", null, cfg.label || t("wChangeValue")), slider, label),
      el("div", { class: "cond-grid" }, code, el("div", null, el("p", { class: "w-label" }, t("wProgramShows")), out))
    ));
    draw();
  }

  /* ---------------- Exécution pas à pas ---------------- */
  function stepper(root, cfg) {
    const lines = cfg.code.split("\n");
    const steps = cfg.steps;
    let k = 0;
    const codeEl = el("div", { class: "step-code mono" });
    const varsEl = el("div", { class: "step-vars" });
    const outEl = el("pre", { class: "step-out mono" });
    const note = el("p", { class: "step-note" });
    const counter = el("span", { class: "muted" });
    const prev = el("button", { type: "button", class: "btn btn-ghost", onclick: () => { if (k > 0) { k--; draw(); } } }, t("wPrevStep"));
    const next = el("button", { type: "button", class: "btn btn-primary", onclick: () => { if (k < steps.length - 1) { k++; draw(true); } else { k = 0; draw(); } } }, t("wNextStep"));
    let prevVars = {};

    function draw(animate) {
      const s = steps[k];
      codeEl.innerHTML = "";
      lines.forEach((l, i) => codeEl.append(el("div", { class: "step-line" + (s.line === i + 1 ? " current" : "") }, el("span", { class: "ln" }, i + 1), el("span", null, l || " "))));
      varsEl.innerHTML = "";
      const vars = s.vars || {};
      const names = Object.keys(vars);
      if (!names.length) varsEl.append(el("span", { class: "muted" }, t("wMemoryEmpty")));
      names.forEach((name) => {
        const changed = animate && prevVars[name] !== vars[name];
        varsEl.append(el("div", { class: "var-box" + (changed ? " changed" : "") }, el("span", { class: "var-name" }, name), el("span", { class: "var-val mono" }, vars[name])));
      });
      prevVars = { ...vars };
      outEl.textContent = s.out || "";
      note.innerHTML = s.note ? window.mdInline(s.note) : "";
      counter.textContent = t("wStepOf", { k: k + 1, n: steps.length });
      prev.disabled = k === 0;
      next.textContent = k === steps.length - 1 ? t("wRestart") : t("wNextStep");
    }

    root.append(el("div", { class: "stepper" },
      el("div", { class: "stepper-grid" },
        el("div", null, el("p", { class: "w-label" }, t("wCodeLabel")), codeEl),
        el("div", null, el("p", { class: "w-label" }, t("wMemory")), varsEl, el("p", { class: "w-label" }, t("wDisplayed")), outEl)
      ),
      note,
      el("div", { class: "row-gap" }, prev, next, counter)
    ));
    draw();
  }

  /* ---------------- Onglets de code (langages) ---------------- */
  function tabs(root, cfg) {
    const body = el("div", { class: "tabs-body" });
    const bar = el("div", { class: "tabs-bar", role: "tablist" });
    function show(i) {
      [...bar.children].forEach((b, j) => b.setAttribute("aria-selected", i === j ? "true" : "false"));
      const t = cfg.tabs[i];
      body.innerHTML = "";
      body.append(el("pre", { class: "tabs-code mono" }, t.code));
      if (t.note) body.append(el("p", { class: "tabs-note", html: window.mdInline(t.note) }));
    }
    cfg.tabs.forEach((t, i) => bar.append(el("button", { type: "button", role: "tab", class: "tab", onclick: () => show(i) }, t.label)));
    root.append(el("div", { class: "tabs" }, bar, body));
    show(0);
  }

  const registry = { robot, order, binary, condition, stepper, tabs };
  const GATED = new Set(["robot", "order"]);

  return {
    render(name, root, config, done) {
      const fn = registry[name];
      if (!fn) { root.append(el("p", { class: "muted" }, t("wUnknown", { name }))); return false; }
      fn(root, config || {}, done);
      return GATED.has(name) || (name === "binary" && config && config.target !== undefined);
    },
  };
})();
