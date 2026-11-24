/* Exécute Python (Pyodide) dans un Web Worker, pour que la page reste fluide
   et qu'une boucle infinie puisse être arrêtée sans tout casser. */
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
importScripts(PYODIDE_URL + "pyodide.js");

let pyodide = null;
let currentId = null;
let outBuf = "";
let outTotal = 0;
let lastFlush = 0;
const OUT_LIMIT = 200000;

function flush() {
  if (outBuf && currentId !== null) {
    self.postMessage({ type: "stdout", id: currentId, text: outBuf });
  }
  outBuf = "";
  lastFlush = Date.now();
}

function jsWrite(s) {
  if (outTotal > OUT_LIMIT) return;
  outTotal += s.length;
  outBuf += s;
  if (outTotal > OUT_LIMIT) outBuf += "\n… (sortie tronquée : ton programme affiche beaucoup trop de lignes)\n";
  if (outBuf.length > 2000 || Date.now() - lastFlush > 60) flush();
}

const SETUP = String.raw`
import sys, io, os, json, base64, traceback, builtins, warnings, random, csv, datetime
os.environ["MPLBACKEND"] = "AGG"
os.makedirs("/home/pyodide/.mpl", exist_ok=True)
os.environ["MPLCONFIGDIR"] = "/home/pyodide/.mpl"
with open("/home/pyodide/.mpl/matplotlibrc", "w") as _f:
    _f.write("figure.figsize: 7, 4\nfigure.dpi: 100\nfont.size: 10\naxes.spines.top: False\naxes.spines.right: False\naxes.titleweight: bold\naxes.titlesize: 12\n")
warnings.filterwarnings("ignore", message=".*(non-interactive|non-GUI).*")
warnings.filterwarnings("ignore", category=DeprecationWarning)
from pyodide.code import eval_code_async

_NAMESPACES = {}
_inputs = []
_LANG = "fr"
_MSG = {
    "fr": {
        "eof": "input() attend une valeur : écris-la dans la case « Entrées » sous l'éditeur (une valeur par ligne).",
        "notyet": "Ce n'est pas encore tout à fait ça.",
        "runs": "Ton code tourne, mais il ne fait pas encore ce qui est demandé",
    },
    "en": {
        "eof": "input() is waiting for a value: type it in the \"Inputs\" box below the editor (one value per line).",
        "notyet": "Not quite there yet.",
        "runs": "Your code runs, but it doesn't do what is asked yet",
    },
}

def _m(key):
    return _MSG.get(_LANG, _MSG["fr"])[key]

class _Writer:
    def __init__(self):
        self.parts = []
    def write(self, s):
        s = str(s)
        self.parts.append(s)
        _js_write(s)
        return len(s)
    def flush(self):
        pass
    def isatty(self):
        return False

def _input(prompt=""):
    if prompt:
        sys.stdout.write(str(prompt))
    if not _inputs:
        raise EOFError(_m("eof"))
    value = _inputs.pop(0)
    sys.stdout.write(value + "\n")
    return value

builtins.input = _input

def _figures():
    images = []
    plt = sys.modules.get("matplotlib.pyplot")
    if plt is None:
        return images
    for n in plt.get_fignums():
        fig = plt.figure(n)
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=110, bbox_inches="tight")
        images.append(base64.b64encode(buf.getvalue()).decode())
    plt.close("all")
    return images

def _error_info(e):
    line = None
    for frame, lineno in traceback.walk_tb(e.__traceback__):
        if frame.f_code.co_filename == "<exec>":
            line = lineno
    msg = str(e)
    if isinstance(e, SyntaxError):
        msg = e.msg
        if e.filename in ("<exec>", None):
            line = e.lineno
    return {"type": type(e).__name__, "msg": msg, "line": line}

def _is_plot_object(v):
    mod = type(v).__module__ or ""
    if mod.startswith("matplotlib"):
        return True
    if isinstance(v, (list, tuple)) and v and all((type(x).__module__ or "").startswith("matplotlib") for x in v):
        return True
    return False

async def _execute(code, key, inputs, fresh, figs=True):
    global _inputs
    _inputs = list(inputs)
    if fresh:
        ns = {"__name__": "__main__"}
    else:
        ns = _NAMESPACES.setdefault(key, {"__name__": "__main__"})
    w = _Writer()
    old = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = w
    res = {"ok": True, "value": None, "error": None}
    try:
        val = await eval_code_async(code, globals=ns, filename="<exec>")
        if val is not None and not _is_plot_object(val):
            if hasattr(val, "_repr_html_") and not isinstance(val, type):
                try:
                    html = val._repr_html_()
                    if html:
                        res["value"] = {"kind": "html", "data": html}
                except Exception:
                    pass
            if res["value"] is None:
                res["value"] = {"kind": "text", "data": repr(val)}
    except BaseException as e:
        res["ok"] = False
        res["error"] = _error_info(e)
    finally:
        sys.stdout, sys.stderr = old
    res["images"] = []
    if figs:
        try:
            res["images"] = _figures()
        except Exception:
            pass
    res["stdout"] = "".join(w.parts)
    return res, ns

def _set_lang(lang):
    global _LANG
    _LANG = lang if lang in _MSG else "fr"

async def _run_json(code, key, inputs_json, fresh):
    res, _ = await _execute(code, key, json.loads(inputs_json), fresh)
    return json.dumps(res)

async def _check_json(code, check, key, inputs_json):
    res, ns = await _execute(code, key, json.loads(inputs_json), True, figs=False)
    res["passed"] = False
    if res["ok"]:
        ns["OUT"] = res["stdout"]
        ns["CODE"] = code
        old = sys.stdout, sys.stderr
        sys.stdout = sys.stderr = _Writer()
        try:
            exec(compile(check, "<check>", "exec"), ns)
            res["passed"] = True
        except AssertionError as e:
            res["checkMsg"] = str(e) or _m("notyet")
        except Exception as e:
            res["checkMsg"] = _m("runs") + " (" + type(e).__name__ + ": " + str(e) + ")."
        finally:
            sys.stdout, sys.stderr = old
    try:
        res["images"] = _figures()
    except Exception:
        pass
    return json.dumps(res)

def _reset(key):
    _NAMESPACES.pop(key, None)

# ---------- Jeux de données des leçons (mêmes chiffres en français et en anglais) ----------
def _write_csv(name, header, rows):
    with open(name, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)

def _make_datasets():
    r = random.Random(2024)
    villes = ["Kinshasa", "Abidjan", "Dakar", "Paris", "Montréal"]
    city_en = {"Montréal": "Montreal"}
    poids = [1.3, 1.1, 1.0, 0.9, 0.8]
    produits = [
        ("Espresso", "Boisson", 2.5), ("Cappuccino", "Boisson", 3.5),
        ("Thé à la menthe", "Boisson", 2.0), ("Jus de bissap", "Boisson", 2.2),
        ("Croissant", "Viennoiserie", 1.8), ("Beignet", "Viennoiserie", 1.0),
        ("Sandwich", "Snack", 5.0),
    ]
    prod_en = {"Thé à la menthe": "Mint tea", "Jus de bissap": "Bissap juice", "Beignet": "Doughnut"}
    cat_en = {"Boisson": "Drink", "Viennoiserie": "Pastry", "Snack": "Snack"}
    rows, rows_en = [], []
    d = datetime.date(2024, 1, 1)
    while d.year == 2024:
        for _ in range(r.randint(1, 3)):
            ville = r.choices(villes, weights=poids)[0]
            nom, cat, prix = r.choice(produits)
            saison = 1.4 if d.month in (6, 7, 8, 12) else 1.0
            if nom == "Jus de bissap" and 3 <= d.month <= 9:
                saison *= 1.5
            q = max(1, int(r.gauss(6, 3) * saison))
            rows.append([d.isoformat(), ville, nom, cat, q, prix])
            rows_en.append([d.isoformat(), city_en.get(ville, ville), prod_en.get(nom, nom), cat_en[cat], q, prix])
        d += datetime.timedelta(days=1)
    _write_csv("ventes.csv", ["date", "ville", "produit", "categorie", "quantite", "prix_unitaire"], rows)
    _write_csv("sales.csv", ["date", "city", "product", "category", "quantity", "unit_price"], rows_en)

    noms = ["Awa", "Moussa", "Fatou", "Kofi", "Amina", "Jean", "Marie", "Lucas", "Chloé", "Ibrahim",
            "Grace", "Patrick", "Aïcha", "Youssef", "Nadia", "Samuel", "Esther", "Olivier", "Mariam", "David",
            "Sarah", "Joël", "Ruth", "Didier", "Inès", "Hugo", "Léa", "Bakary", "Mamadou", "Kevin",
            "Christelle", "Bénédicte", "Arsène", "Fabrice", "Rachel", "Josué", "Divine", "Prince", "Gloire", "Merveille"]
    etu, etu_en = [], []
    for nom in noms:
        h = r.randint(1, 20)
        nm = round(min(20, max(0, r.gauss(11, 3.5))), 1)
        npy = round(min(20, max(0, 4 + h * 0.7 + r.gauss(0, 2))), 1)
        age = r.randint(18, 30)
        ville = r.choice(villes)
        etu.append([nom, age, ville, h, nm, npy])
        etu_en.append([nom, age, city_en.get(ville, ville), h, nm, npy])
    _write_csv("etudiants.csv", ["nom", "age", "ville", "heures_etude", "note_math", "note_python"], etu)
    _write_csv("students.csv", ["name", "age", "city", "study_hours", "math_grade", "python_grade"], etu_en)

    variantes = {"Kinshasa": ["Kinshasa", " kinshasa", "KINSHASA"], "Dakar": ["Dakar", "dakar "],
                 "Abidjan": ["Abidjan", "abidjan"], "Paris": ["Paris"], "Montréal": ["Montréal", "montréal "]}
    variants_en = {"Montréal": ["Montreal", "montreal "]}
    clients, clients_en = [], []
    for i in range(1, 61):
        ville = r.choice(list(variantes))
        age = "" if r.random() < 0.12 else r.randint(18, 70)
        dep = "" if r.random() < 0.1 else round(r.uniform(5, 400), 2)
        ins = (datetime.date(2023, 1, 1) + datetime.timedelta(days=r.randint(0, 600))).isoformat()
        nom = r.choice(noms)
        k = r.randrange(len(variantes[ville]))
        clients.append([i, nom, variantes[ville][k], age, dep, ins])
        clients_en.append([i, nom, variants_en.get(ville, variantes[ville])[k], age, dep, ins])
    for k in (4, 17, 33):
        clients.append(clients[k])
        clients_en.append(clients_en[k])
    _write_csv("clients.csv", ["id", "nom", "ville", "age", "depense", "inscription"], clients)
    _write_csv("customers.csv", ["id", "name", "city", "age", "spending", "signup_date"], clients_en)

    with open("courses.txt", "w", encoding="utf-8") as f:
        f.write("riz\nhuile\ntomates\noignons\npain\nlait\ncafé\n")
    with open("groceries.txt", "w", encoding="utf-8") as f:
        f.write("rice\noil\ntomatoes\nonions\nbread\nmilk\ncoffee\n")

_make_datasets()
`;

async function init() {
  pyodide = await loadPyodide({ indexURL: PYODIDE_URL });
  pyodide.globals.set("_js_write", jsWrite);
  await pyodide.runPythonAsync(SETUP);
}

const ready = init()
  .then(() => self.postMessage({ type: "ready" }))
  .catch((err) => self.postMessage({ type: "fatal", message: String(err) }));

let lang = "fr";

async function loadPackages(code, id) {
  const imports = pyodide.pyimport("pyodide.code").find_imports(code).toJs();
  const needed = imports.filter((m) => ["numpy", "pandas", "matplotlib"].includes(m) && !pyodide.loadedPackages[m]);
  if (needed.length) {
    const text = lang === "en"
      ? "Loading " + needed.join(", ") + " (the first time takes a few seconds)…"
      : "Chargement de " + needed.join(", ") + " (la première fois prend quelques secondes)…";
    self.postMessage({ type: "status", id, text });
    await pyodide.loadPackagesFromImports(code);
  }
}

self.onmessage = async (event) => {
  const m = event.data;
  await ready;
  if (!pyodide) return;
  try {
    if (m.type === "preload") {
      await pyodide.loadPackage(m.packages);
      self.postMessage({ type: "preloaded", packages: m.packages });
      return;
    }
    if (m.type === "reset") {
      pyodide.globals.get("_reset")(m.key);
      return;
    }
    if (m.type === "run" || m.type === "check") {
      lang = m.lang || "fr";
      pyodide.globals.get("_set_lang")(lang);
      await loadPackages(m.code + "\n" + (m.check || ""), m.id);
      currentId = m.id;
      outBuf = "";
      outTotal = 0;
      lastFlush = Date.now();
      self.postMessage({ type: "start", id: m.id });
      const inputs = JSON.stringify(m.inputs || []);
      let json;
      if (m.type === "run") {
        json = await pyodide.globals.get("_run_json")(m.code, m.key || "default", inputs, !!m.fresh);
      } else {
        json = await pyodide.globals.get("_check_json")(m.code, m.check, m.key || "check", inputs);
      }
      outBuf = ""; // la sortie complète est renvoyée dans le résultat
      currentId = null;
      self.postMessage({ type: "done", id: m.id, result: JSON.parse(json) });
    }
  } catch (err) {
    currentId = null;
    self.postMessage({ type: "done", id: m.id, result: { ok: false, stdout: "", images: [], error: { type: lang === "en" ? "Internal error" : "Erreur interne", msg: String(err), line: null } } });
  }
};
