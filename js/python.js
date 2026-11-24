/* Pont entre la page et le Web Worker Python. */
(function () {
  const RUN_TIMEOUT = 12000; // ms d'exécution avant de considérer une boucle infinie
  let worker = null;
  let readyPromise = null;
  let resolveReady = null;
  let state = "off"; // off | loading | ready | error
  let nextId = 1;
  const pending = new Map();
  const listeners = new Set();

  function setState(s, detail) {
    state = s;
    listeners.forEach((fn) => fn(s, detail));
  }

  function start() {
    worker = new Worker("js/py-worker.js");
    readyPromise = new Promise((res) => (resolveReady = res));
    setState("loading");
    worker.onmessage = (e) => {
      const m = e.data;
      if (m.type === "ready") {
        setState("ready");
        resolveReady(true);
        return;
      }
      if (m.type === "fatal") {
        setState("error", m.message);
        resolveReady(false);
        return;
      }
      const job = pending.get(m.id);
      if (!job) return;
      if (m.type === "status") job.onStatus && job.onStatus(m.text);
      if (m.type === "start") {
        job.onStatus && job.onStatus(null);
        job.timer = setTimeout(() => timeout(m.id), job.timeout);
      }
      if (m.type === "stdout") job.onOut && job.onOut(m.text);
      if (m.type === "done") {
        clearTimeout(job.timer);
        pending.delete(m.id);
        job.resolve(m.result);
      }
    };
    worker.onerror = () => {
      setState("error", "Le moteur Python n'a pas pu démarrer.");
      resolveReady(false);
    };
  }

  function timeout(id) {
    const job = pending.get(id);
    if (!job) return;
    // On arrête tout et on relance un Python neuf.
    worker.terminate();
    pending.forEach((j) => {
      clearTimeout(j.timer);
      j.resolve({
        ok: false,
        timeout: true,
        stdout: "",
        images: [],
        error: { type: I18N.t("pyTimeoutType"), msg: I18N.t("pyTimeout", { s: RUN_TIMEOUT / 1000 }), line: null },
      });
    });
    pending.clear();
    start();
  }

  function ensure() {
    if (!worker) start();
    return readyPromise;
  }

  function send(msg, opts) {
    return ensure().then((ok) => {
      if (!ok) {
        return { ok: false, stdout: "", images: [], error: { type: I18N.t("pyUnavailableType"), msg: I18N.t("pyUnavailable"), line: null } };
      }
      const id = nextId++;
      return new Promise((resolve) => {
        pending.set(id, { resolve, onOut: opts.onOut, onStatus: opts.onStatus, timeout: opts.timeout || RUN_TIMEOUT });
        worker.postMessage({ ...msg, id, lang: I18N.lang });
      });
    });
  }

  window.Py = {
    get state() { return state; },
    onState(fn) { listeners.add(fn); fn(state); return () => listeners.delete(fn); },
    warmup() { ensure(); },
    run(code, opts = {}) {
      return send({ type: "run", code, key: opts.key, inputs: opts.inputs || [], fresh: !!opts.fresh }, opts);
    },
    check(code, check, opts = {}) {
      return send({ type: "check", code, check, key: opts.key, inputs: opts.inputs || [] }, opts);
    },
    reset(key) { if (worker) worker.postMessage({ type: "reset", key }); },
    preload(packages) { ensure().then((ok) => ok && worker.postMessage({ type: "preload", packages })); },
  };
})();
