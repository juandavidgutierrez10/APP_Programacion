/* Simulador de Java — intérprete (ver java-sim.js para el analizador). */
(function (root) {
'use strict';
const { parse, SimError, cerr, unsup } = root.__JavaSimParse;

/* ---------- valores ---------- */
const I = v => ({ t: 'int', v: v | 0 });
const D = v => ({ t: 'double', v });
const F = v => ({ t: 'float', v: Math.fround(v) });
const L = v => ({ t: 'long', v: BigInt.asIntN(64, BigInt(v)) });
const B = v => ({ t: 'boolean', v });
const C = v => ({ t: 'char', v: v & 0xFFFF });
const NULL = { t: 'null', v: null };
const ST = v => ({ t: 'String', v });
const RANK = { int: 0, long: 1, float: 2, double: 3 };
const kindOf = v => (v.t === 'int' || v.t === 'short' || v.t === 'byte' || v.t === 'char') ? 'int' : (v.t === 'long' || v.t === 'float' || v.t === 'double') ? v.t : null;
const isNumV = v => kindOf(v) !== null;
const tname = v => v.t === 'obj' ? (v.cls ? v.cls.name : v.nat) : v.t === 'array' ? v.et + '[]'.repeat(v.dims || 1) : v.t === 'null' ? '<null>' : v.t;

/* ---------- jerarquía de excepciones ---------- */
const THROW = {
  Throwable: null, Exception: 'Throwable', Error: 'Throwable', RuntimeException: 'Exception', IOException: 'Exception', FileNotFoundException: 'IOException',
  ArithmeticException: 'RuntimeException', NullPointerException: 'RuntimeException', IllegalArgumentException: 'RuntimeException', IllegalStateException: 'RuntimeException',
  NumberFormatException: 'IllegalArgumentException', IndexOutOfBoundsException: 'RuntimeException', StringIndexOutOfBoundsException: 'IndexOutOfBoundsException',
  ArrayIndexOutOfBoundsException: 'IndexOutOfBoundsException', NoSuchElementException: 'RuntimeException', InputMismatchException: 'NoSuchElementException',
  ClassCastException: 'RuntimeException', UnsupportedOperationException: 'RuntimeException', NegativeArraySizeException: 'RuntimeException', DateTimeException: 'RuntimeException',
  DateTimeParseException: 'DateTimeException', InterruptedException: 'Exception', CloneNotSupportedException: 'Exception',
  AssertionError: 'Error', StackOverflowError: 'Error', OutOfMemoryError: 'Error'
};
const PKG = { InputMismatchException: 'java.util', NoSuchElementException: 'java.util', DateTimeException: 'java.time', DateTimeParseException: 'java.time.format', IOException: 'java.io', FileNotFoundException: 'java.io' };
const qual = n => (PKG[n] || 'java.lang') + '.' + n;
const builtinCls = {};
function bcls(name) { return builtinCls[name] || (builtinCls[name] = { name, builtin: true, sup: THROW[name] ? bcls(THROW[name]) : null, methods: [], fields: [], ctors: [] }); }
Object.keys(THROW).forEach(bcls);

/* ---------- formato de números (como Java) ---------- */
function dstr(x) {
  if (Number.isNaN(x)) return 'NaN'; if (x === Infinity) return 'Infinity'; if (x === -Infinity) return '-Infinity';
  if (x === 0) return (1 / x < 0) ? '-0.0' : '0.0';
  const ax = Math.abs(x);
  if (ax >= 1e-3 && ax < 1e7) { let s = String(x); if (!s.includes('.')) s += '.0'; return s; }
  let [m, e] = x.toExponential().split('e'); if (!m.includes('.')) m += '.0'; return m + 'E' + parseInt(e, 10);
}
function fstr(f) { if (!isFinite(f) || f === 0) return dstr(f); let s; for (let p = 1; p <= 9; p++) { s = f.toPrecision(p); if (Math.fround(Number(s)) === f) break; } return dstr(Number(s)); }
function plainDigits(x) { // dígitos más cortos que identifican al double, sin exponente: devuelve [signo, enteros, decimales]
  const neg = x < 0 || (x === 0 && 1 / x < 0); const [m, e] = Math.abs(x).toExponential().split('e'); const ex = parseInt(e, 10);
  let digs = m.replace('.', ''); let ip, fp;
  if (ex >= 0) { if (digs.length <= ex + 1) { ip = digs + '0'.repeat(ex + 1 - digs.length); fp = ''; } else { ip = digs.slice(0, ex + 1); fp = digs.slice(ex + 1); } }
  else { ip = '0'; fp = '0'.repeat(-ex - 1) + digs; }
  return [neg, ip, fp];
}
function fixedHalfUp(x, prec) {
  let [neg, ip, fp] = plainDigits(x);
  if (fp.length <= prec) fp = fp + '0'.repeat(prec - fp.length);
  else {
    const up = fp.charCodeAt(prec) >= 53; fp = fp.slice(0, prec);
    if (up) { let all = (ip + fp).split(''); let i = all.length - 1; while (i >= 0) { if (all[i] === '9') { all[i] = '0'; i--; } else { all[i] = String(+all[i] + 1); break; } } let s = all.join(''); if (i < 0) s = '1' + s; ip = s.slice(0, s.length - prec); fp = s.slice(s.length - prec); if (prec === 0) { ip = s; fp = ''; } }
  }
  return { neg, ip, fp };
}
function group(ip, sep) { return ip.replace(/\B(?=(\d{3})+(?!\d))/g, sep); }
const javaClassName = v => ({ int: 'java.lang.Integer', double: 'java.lang.Double', float: 'java.lang.Float', long: 'java.lang.Long', char: 'java.lang.Character', boolean: 'java.lang.Boolean', String: 'java.lang.String', short: 'java.lang.Short', byte: 'java.lang.Byte' }[v.t] || 'java.lang.Object');

function formatJava(rt, fmt, args, loc) {
  const dec = loc === 'US' ? '.' : ',', grp = loc === 'US' ? ',' : '.'; let ai = 0;
  return fmt.replace(/%(\d+\$)?([-#+ 0,(]*)(\d+)?(\.\d+)?([a-zA-Z%])/g, (m, pos, flags, width, prec, conv) => {
    if (conv === 'n') return '\n'; if (conv === '%') return '%';
    let a;
    if (pos) a = args[parseInt(pos, 10) - 1]; else a = args[ai++];
    if (a === undefined) throw rt.jex('MissingFormatArgumentException', "Format specifier '" + m + "'");
    let s; const w = width ? parseInt(width, 10) : 0; const pr = prec ? parseInt(prec.slice(1), 10) : null;
    const lc = conv.toLowerCase();
    if (lc === 's') { s = rt.toStr(a); if (pr !== null) s = s.slice(0, pr); if (conv === 'S') s = s.toUpperCase(); }
    else if (lc === 'd') {
      if (!(a.t === 'int' || a.t === 'long' || a.t === 'short' || a.t === 'byte')) throw rt.jex('IllegalFormatConversionException', 'd != ' + javaClassName(a));
      let n = BigInt(a.v); const neg = n < 0n; if (neg) n = -n; let ds = n.toString(); if (flags.includes(',')) ds = group(ds, grp);
      const sign = neg ? '-' : flags.includes('+') ? '+' : flags.includes(' ') ? ' ' : '';
      if (flags.includes('0') && w > sign.length + ds.length) ds = '0'.repeat(w - sign.length - ds.length) + ds; s = sign + ds;
    } else if (lc === 'f') {
      if (!(a.t === 'double' || a.t === 'float')) throw rt.jex('IllegalFormatConversionException', 'f != ' + javaClassName(a));
      const x = a.t === 'float' ? Number(fstr(a.v)) : a.v;
      if (!isFinite(x)) s = Number.isNaN(x) ? 'NaN' : (x < 0 ? '-Infinity' : (flags.includes('+') ? '+Infinity' : 'Infinity'));
      else {
        const r = fixedHalfUp(x, pr === null ? 6 : pr); let ip = r.ip; if (flags.includes(',')) ip = group(ip, grp);
        const isZero = /^0*$/.test(r.ip + r.fp); const neg = r.neg && !(isZero && false);
        const sign = neg ? '-' : flags.includes('+') ? '+' : flags.includes(' ') ? ' ' : '';
        let body = ip + (r.fp.length ? dec + r.fp : (flags.includes('#') ? dec : ''));
        if (flags.includes('0') && w > sign.length + body.length) body = '0'.repeat(w - sign.length - body.length) + body; s = sign + body;
      }
    } else if (lc === 'c') { s = a.t === 'char' ? String.fromCharCode(a.v) : (a.t === 'int' ? String.fromCodePoint(a.v) : (() => { throw rt.jex('IllegalFormatConversionException', 'c != ' + javaClassName(a)); })()); if (conv === 'C') s = s.toUpperCase(); }
    else if (lc === 'b') { s = a.t === 'boolean' ? String(a.v) : (a.t === 'null' ? 'false' : 'true'); }
    else if (lc === 'x') { if (a.t === 'long') s = BigInt.asUintN(64, a.v).toString(16); else if (a.t === 'int' || a.t === 'short' || a.t === 'byte' || a.t === 'char') s = (a.v >>> 0).toString(16); else throw rt.jex('IllegalFormatConversionException', 'x != ' + javaClassName(a)); if (conv === 'X') s = s.toUpperCase(); if (flags.includes('0') && w > s.length) s = '0'.repeat(w - s.length) + s; }
    else if (lc === 'o') { s = (a.t === 'long' ? BigInt.asUintN(64, a.v) : BigInt(a.v >>> 0)).toString(8); }
    else if (lc === 'e') throw unsup('el formato %e');
    else throw rt.jex('UnknownFormatConversionException', "Conversion = '" + conv + "'");
    if (w > s.length) s = flags.includes('-') ? s + ' '.repeat(w - s.length) : ' '.repeat(w - s.length) + s;
    return s;
  });
}

/* ---------- fechas ---------- */
const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const DOWS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const leap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const mlen = (y, m) => [31, leap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
const toEpoch = (y, m, d) => Math.round(Date.UTC(y, m - 1, d) / 864e5) + (y >= 0 && y < 100 ? Math.round((Date.UTC(2000, 0, 1) - Date.UTC(2000, 0, 1)) / 864e5) : 0);
function ymd(ep) { const dt = new Date(ep * 864e5); return [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()]; }
const p2 = n => String(n).padStart(2, '0');
const DIAS = { ES: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'], US: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] };
const DIAS3 = { ES: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'], US: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };
const MESES = { ES: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'], US: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
const MESES3 = { ES: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'], US: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
function fmtDate(ep, pat, loc) {
  loc = loc || 'ES'; const [y, m, d] = ymd(ep); let out = '', i = 0;
  while (i < pat.length) {
    const c = pat[i];
    if (c === "'") { // texto literal entre comillas simples ('' = una comilla)
      if (pat[i + 1] === "'") { out += "'"; i += 2; continue; }
      let j = i + 1, s = ''; while (j < pat.length) { if (pat[j] === "'") { if (pat[j + 1] === "'") { s += "'"; j += 2; continue; } break; } s += pat[j++]; }
      out += s; i = j + 1; continue;
    }
    let j = i; while (j < pat.length && pat[j] === c) j++; const n = j - i;
    if (c === 'd') out += n >= 2 ? p2(d) : d;
    else if (c === 'M' || c === 'L') out += n === 1 ? m : n === 2 ? p2(m) : n === 3 ? MESES3[loc][m - 1] : MESES[loc][m - 1];
    else if (c === 'y' || c === 'u') out += n === 2 ? p2(y % 100) : String(y).padStart(n, '0');
    else if (c === 'E') { const wd = (((ep + 3) % 7) + 7) % 7; out += n <= 3 ? DIAS3[loc][wd] : DIAS[loc][wd]; }
    else if (/[A-Za-z]/.test(c)) throw unsup("el patrón de fecha '" + c + "'");
    else out += pat.slice(i, j);
    i = j;
  }
  return out;
}
function parseDate(rt, text, pat) {
  let y, m, d;
  if (!pat) { const mm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text); if (!mm) throw rt.jex('DateTimeParseException', "Text '" + text + "' could not be parsed at index 0"); [y, m, d] = [+mm[1], +mm[2], +mm[3]]; }
  else {
    let re = '', keys = []; for (let i = 0; i < pat.length;) { const c = pat[i]; let j = i; while (j < pat.length && pat[j] === c) j++; const n = j - i;
      if (c === 'd') { re += n >= 2 ? '(\\d{2})' : '(\\d{1,2})'; keys.push('d'); } else if (c === 'M') { re += n >= 2 ? '(\\d{2})' : '(\\d{1,2})'; keys.push('M'); } else if (c === 'y' || c === 'u') { re += n === 2 ? '(\\d{2})' : '(\\d{4})'; keys.push(n === 2 ? 'y2' : 'y'); } else re += pat.slice(i, j).replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&'); i = j; }
    const mm = new RegExp('^' + re + '$').exec(text); if (!mm) throw rt.jex('DateTimeParseException', "Text '" + text + "' could not be parsed at index 0");
    keys.forEach((k, ix) => { const v = +mm[ix + 1]; if (k === 'd') d = v; else if (k === 'M') m = v; else if (k === 'y') y = v; else y = 2000 + v; });
  }
  if (m < 1 || m > 12 || d < 1 || d > mlen(y, m)) throw rt.jex('DateTimeParseException', "Text '" + text + "' could not be parsed: Invalid date");
  return [y, m, d];
}

/* ============================ INTÉRPRETE ============================ */
class Scope { constructor(p) { this.m = new Map(); this.p = p; } get(n) { for (let s = this; s; s = s.p) { const v = s.m.get(n); if (v) return v; } return null; } }
class JThrow { constructor(obj) { this.obj = obj; } }

function run(src, stdin, opts) {
  opts = opts || {}; if (!/\b(class|interface|enum|record)\s+\w+/.test(src)) { const L = src.split('\n'); src = L.filter(l => /^import /.test(l)).map(l => l.trim() + ' ').join('') + 'public class Main { public static void main(String[] args) { ' + L.filter(l => !/^import /.test(l)).join('\n') + '\n} }'; } const out = []; let outLen = 0, steps = 0, depth = 0, curLine = 0; let hashCtr = 0x1b6d3586;
  { // comprobación de import: clases fuera de java.lang usadas sin importar
    const PK = { Scanner: 'java.util', Random: 'java.util', ArrayList: 'java.util', List: 'java.util', Arrays: 'java.util', Locale: 'java.util', Point: 'java.awt', LocalDate: 'java.time', LocalDateTime: 'java.time', DateTimeFormatter: 'java.time.format', ChronoUnit: 'java.time.temporal' };
    const clean = src.replace(/"(?:\\.|[^"\\\n])*"/g, '""').replace(/'(?:\\.|[^'\\\n])*'/g, "''").replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' ')).replace(/\/\/.*/g, '');
    const imps = [...clean.matchAll(/import\s+([\w.]+?)(\.\*)?\s*;/g)].map(m => ({ n: m[1], w: !!m[2] }));
    const declared = new Set([...clean.matchAll(/\b(?:class|interface|enum|record)\s+(\w+)/g)].map(m => m[1]));
    for (const [cn, pkg] of Object.entries(PK)) {
      if (declared.has(cn)) continue;
      const re = new RegExp('(^|[^.\\w])' + cn + '\\b', 'g'); const m = re.exec(clean); if (!m) continue;
      const found = clean.slice(0, m.index + m[1].length).split('\n').length;
      if (!imps.some(x => (x.w ? x.n === pkg : x.n === pkg + '.' + cn))) return { out: [], error: { kind: 'compile', msg: 'cannot find symbol\n  symbol:   class ' + cn, line: found }, ok: false };
    }
  }

  const MAXSTEPS = opts.maxSteps || 4000000;
  const write = (s, err) => { outLen += s.length; if (outLen > 60000) throw new SimError('limit', 'La salida es demasiado larga: ejecución detenida.', curLine); if (out.length && out[out.length - 1].err === !!err) out[out.length - 1].s += s; else out.push({ s, err: !!err }); };
  let classes;
  try { classes = parse(src); } catch (e) { if (e instanceof SimError) return { out: [], error: { kind: e.kind, msg: e.message, line: e.line }, ok: false }; throw e; }
  const userCls = new Map();
  for (const c of classes) { if (userCls.has(c.name)) return { out: [], error: { kind: 'compile', msg: 'duplicate class: ' + c.name, line: c.line }, ok: false }; userCls.set(c.name, { name: c.name, decl: c, sup: null, statics: new Map(), methods: new Map(), fields: c.fields.filter(f => !f.static), ctors: c.ctors, supName: c.sup, init: false }); }
  for (const ci of userCls.values()) {
    if (ci.supName) { ci.sup = userCls.get(ci.supName) || (THROW[ci.supName] !== undefined ? bcls(ci.supName) : null); if (!ci.sup && ci.supName !== 'Object') throw cerr('cannot find symbol: class ' + ci.supName, ci.decl.line); }
    for (const m of ci.decl.methods) { if (!ci.methods.has(m.name)) ci.methods.set(m.name, []); ci.methods.get(m.name).push(m); }
  }
  const chainHas = (cls, name) => { for (let c = cls; c; c = c.sup) if (c.name === name) return true; return false; };
  const isThrowable = cls => chainHas(cls, 'Throwable');

  const rt = {};
  rt.jex = (name, msg) => { const o = { t: 'obj', cls: bcls(THROW[name] !== undefined ? name : 'RuntimeException'), f: {}, line: curLine }; if (THROW[name] === undefined) { o.cls = Object.assign({}, bcls('RuntimeException'), { name }); } o.f.__msg = msg === undefined ? NULL : ST(msg); return new JThrow(o); };
  const jex = rt.jex;
  const mkStr = s => ST(s);
  const pool = new Map(); const intern = s => { let v = pool.get(s); if (!v) { v = ST(s); pool.set(s, v); } return v; };
  const enums = new Map(); const mkEnum = (kind, name, extra) => { const k = kind + name; let e = enums.get(k); if (!e) { e = Object.assign({ t: 'obj', nat: 'Enum', kind, name }, extra || {}); enums.set(k, e); } return e; };

  /* ---- conversión a texto ---- */
  function toStr(v) {
    switch (v.t) {
      case 'int': case 'short': case 'byte': return String(v.v);
      case 'long': return v.v.toString(); case 'double': return dstr(v.v); case 'float': return fstr(v.v);
      case 'char': return String.fromCharCode(v.v); case 'boolean': return String(v.v); case 'String': return v.v; case 'null': return 'null';
      case 'array': return '[' + ({ int: 'I', double: 'D', char: 'C', long: 'J', boolean: 'Z', byte: 'B', short: 'S', float: 'F' }[v.et] || 'L' + (v.et === 'String' ? 'java.lang.String;' : v.et + ';')) + '@' + (v.h || (v.h = (hashCtr += 0x1337).toString(16)));
      case 'obj':
        if (v.cls) {
          const m = findMethod(v.cls, 'toString', []); if (m) return toStr(invoke(m.m, m.cls, v, []));
          if (isThrowable(v.cls)) { const msg = v.f.__msg; const n = v.cls.builtin || THROW[v.cls.name] !== undefined && v.cls.builtin ? qual(v.cls.name) : v.cls.name; return n + (msg && msg.t !== 'null' ? ': ' + msg.v : ''); }
          return v.cls.name + '@' + (v.h || (v.h = (hashCtr += 0x1337).toString(16)));
        }
        switch (v.nat) {
          case 'SB': return v.s; case 'Enum': return v.name; case 'Date': { const [y, m, d] = ymd(v.d); return String(y).padStart(4, '0') + '-' + p2(m) + '-' + p2(d); }
          case 'Point': return 'java.awt.Point[x=' + toStr(v.x) + ',y=' + toStr(v.y) + ']';
          case 'List': return '[' + v.a.map(toStr).join(', ') + ']';
          case 'Object': return 'java.lang.Object@' + (v.h || (v.h = (hashCtr += 0x1337).toString(16)));
          default: return 'java.lang.Object@' + (v.h || (v.h = (hashCtr += 0x1337).toString(16)));
        }
    }
    return String(v.v);
  }
  rt.toStr = toStr;

  /* ---- tipos y conversiones ---- */
  const WRAP = { Integer: 'int', Long: 'long', Double: 'double', Float: 'float', Character: 'char', Boolean: 'boolean', Short: 'short', Byte: 'byte' };
  function defaultVal(ty, dims) { if (dims > 0) return NULL; switch (ty) { case 'int': return I(0); case 'long': return L(0); case 'double': return D(0); case 'float': return F(0); case 'boolean': return B(false); case 'char': return C(0); case 'byte': return { t: 'byte', v: 0 }; case 'short': return { t: 'short', v: 0 }; default: return NULL; } }
  const lossy = (from, to) => cerr('incompatible types: possible lossy conversion from ' + from + ' to ' + to);
  const incompat = (v, to) => cerr('incompatible types: ' + (v.t === 'null' ? '<null>' : tname(v)) + ' cannot be converted to ' + to);
  function coerce(ty, dims, v) {
    if (dims > 0) { if (v.t === 'array' || v.t === 'null') return v; throw incompat(v, ty + '[]'.repeat(dims)); }
    const base = WRAP[ty] || ty; const wrapped = !!WRAP[ty];
    if (v.t === 'null') { if (PRIMSET.has(ty)) throw incompat(v, ty); return v; }
    switch (base) {
      case 'int': if (kindOf(v) === 'int') return I(v.v); if (isNumV(v)) throw lossy(v.t, 'int'); throw incompat(v, ty);
      case 'long': if (kindOf(v) === 'int') return L(v.v); if (v.t === 'long') return v; if (isNumV(v)) throw lossy(v.t, 'long'); throw incompat(v, ty);
      case 'double': if (isNumV(v)) return D(Number(v.v)); throw incompat(v, ty);
      case 'float': if (v.t === 'double') throw lossy('double', 'float'); if (isNumV(v)) return F(Number(v.v)); throw incompat(v, ty);
      case 'char': if (v.t === 'char') return v; if (kindOf(v) === 'int' && v.t !== 'char' && v.v >= 0 && v.v <= 65535) return C(v.v); if (isNumV(v)) throw lossy(v.t, 'char'); throw incompat(v, ty);
      case 'byte': if (v.t === 'byte') return v; if (kindOf(v) === 'int' && v.v >= -128 && v.v <= 127) return { t: 'byte', v: v.v }; if (isNumV(v)) throw lossy(v.t, 'byte'); throw incompat(v, ty);
      case 'short': if (v.t === 'short' || v.t === 'byte') return { t: 'short', v: v.v }; if (kindOf(v) === 'int' && v.v >= -32768 && v.v <= 32767) return { t: 'short', v: v.v }; if (isNumV(v)) throw lossy(v.t, 'short'); throw incompat(v, ty);
      case 'boolean': if (v.t === 'boolean') return v; throw incompat(v, ty);
      case 'String': if (v.t === 'String') return v; throw incompat(v, 'String');
      default: return v;
    }
  }
  const PRIMSET = new Set(['int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short']);
  function castTo(ty, v) {
    if (!PRIMSET.has(ty)) return v;
    if (ty === 'boolean') { if (v.t === 'boolean') return v; throw incompat(v, 'boolean'); }
    if (!isNumV(v)) throw incompat(v, ty);
    const k = kindOf(v), x = v.v;
    const toInt = () => { if (k === 'long') return Number(BigInt.asIntN(32, x)); if (k === 'int') return x; if (Number.isNaN(x)) return 0; if (x >= 2147483647) return 2147483647; if (x <= -2147483648) return -2147483648; return Math.trunc(x); };
    switch (ty) {
      case 'int': return I(toInt());
      case 'long': if (k === 'long') return v; if (k === 'int') return L(x); if (Number.isNaN(x)) return L(0); if (x >= 9223372036854775807) return L(9223372036854775807n); if (x <= -9223372036854775808) return L(-9223372036854775808n); return L(BigInt(Math.trunc(x)));
      case 'double': return D(Number(x)); case 'float': return F(Number(x));
      case 'char': return C(k === 'int' ? x : toInt()); case 'byte': return { t: 'byte', v: (toInt() << 24) >> 24 }; case 'short': return { t: 'short', v: (toInt() << 16) >> 16 };
    }
  }
  const cond = (v) => { if (v.t !== 'boolean') throw incompat(v, 'boolean'); return v.v; };

  /* ---- aritmética ---- */
  function arith(op, a, b) {
    const ka = kindOf(a), kb = kindOf(b);
    if (!ka || !kb) { if ((op === '&' || op === '|' || op === '^') && a.t === 'boolean' && b.t === 'boolean') return B(op === '&' ? a.v && b.v : op === '|' ? a.v || b.v : a.v !== b.v); throw cerr("bad operand types for binary operator '" + op + "'"); }
    if (op === '<<' || op === '>>' || op === '>>>') {
      if (ka === 'long') { const s = BigInt(Number(b.v) & 63); return L(op === '<<' ? a.v << s : op === '>>' ? a.v >> s : BigInt.asUintN(64, a.v) >> s); }
      const s = Number(b.v) & 31; return I(op === '<<' ? a.v << s : op === '>>' ? a.v >> s : a.v >>> s);
    }
    const k = RANK[ka] >= RANK[kb] ? ka : kb;
    if (k === 'double' || k === 'float') {
      const x = Number(a.v), y = Number(b.v); let r;
      switch (op) { case '+': r = x + y; break; case '-': r = x - y; break; case '*': r = x * y; break; case '/': r = x / y; break; case '%': r = x % y; break; default: throw cerr("bad operand types for binary operator '" + op + "'"); }
      return k === 'float' ? F(r) : D(r);
    }
    if (k === 'long') {
      const x = BigInt(a.v), y = BigInt(b.v); let r;
      switch (op) { case '+': r = x + y; break; case '-': r = x - y; break; case '*': r = x * y; break; case '/': if (y === 0n) throw jex('ArithmeticException', '/ by zero'); r = x / y; break; case '%': if (y === 0n) throw jex('ArithmeticException', '/ by zero'); r = x % y; break; case '&': r = x & y; break; case '|': r = x | y; break; case '^': r = x ^ y; break; }
      return L(r);
    }
    const x = a.v, y = b.v; let r;
    switch (op) { case '+': r = x + y; break; case '-': r = x - y; break; case '*': r = Math.imul(x, y); break; case '/': if (y === 0) throw jex('ArithmeticException', '/ by zero'); r = Math.trunc(x / y); break; case '%': if (y === 0) throw jex('ArithmeticException', '/ by zero'); r = x % y; break; case '&': r = x & y; break; case '|': r = x | y; break; case '^': r = x ^ y; break; }
    return I(r);
  }
  function compare(op, a, b) {
    const ka = kindOf(a), kb = kindOf(b);
    if (!ka || !kb) throw cerr("bad operand types for binary operator '" + op + "'");
    let x, y; if (ka === 'long' && kb !== 'double' && kb !== 'float') { x = a.v; y = BigInt(b.v); } else if (kb === 'long' && ka !== 'double' && ka !== 'float') { x = BigInt(a.v); y = b.v; } else { x = Number(a.v); y = Number(b.v); }
    switch (op) { case '<': return B(x < y); case '>': return B(x > y); case '<=': return B(x <= y); default: return B(x >= y); }
  }
  function equalsOp(a, b) {
    if (isNumV(a) && isNumV(b)) { const ka = kindOf(a), kb = kindOf(b); if (ka === 'long' && kb === 'long') return a.v === b.v; if (ka === 'long' && kb === 'int') return a.v === BigInt(b.v); if (kb === 'long' && ka === 'int') return b.v === BigInt(a.v); return Number(a.v) === Number(b.v); }
    if (a.t === 'boolean' && b.t === 'boolean') return a.v === b.v;
    if (a.t === 'null' || b.t === 'null') return a.t === b.t;
    if (isNumV(a) !== isNumV(b) && (a.t === 'boolean' || b.t === 'boolean' || isNumV(a) || isNumV(b))) throw cerr("incomparable types: " + tname(a) + " and " + tname(b));
    return a === b;
  }
  function valEquals(a, b) { // equals() de Java
    if (a.t === 'String') return b.t === 'String' && a.v === b.v;
    if (a.t === 'obj' && a.cls) { const m = findMethod(a.cls, 'equals', [b]); if (m) return cond(invoke(m.m, m.cls, a, [b])); return a === b; }
    if (a.t === 'obj') { if (a.nat === 'Date') return b.t === 'obj' && b.nat === 'Date' && a.d === b.d; if (a.nat === 'Point') return b.nat === 'Point' && a.x.v === b.x.v && a.y.v === b.y.v; return a === b; }
    if (isNumV(a) || a.t === 'boolean') return a.t === b.t && (a.t === 'long' ? a.v === b.v : a.v === b.v);
    return a === b;
  }

  /* ---- búsqueda de métodos ---- */
  const assignable = (p, v) => { if (p.dims > 0) return v.t === 'array' || v.t === 'null'; const b = WRAP[p.type] || p.type; if (PRIMSET.has(b)) { if (b === 'boolean') return v.t === 'boolean'; if (!isNumV(v)) return false; if (b === 'double') return true; if (b === 'float') return v.t !== 'double'; if (b === 'long') return kindOf(v) === 'int' || v.t === 'long'; if (b === 'int') return kindOf(v) === 'int'; return v.t === b; } if (b === 'String') return v.t === 'String' || v.t === 'null'; if (v.t === 'obj' && v.cls) { return chainHas(v.cls, b) || b === 'Object' || userIface(v.cls, b); } return true; };
  const userIface = (cls, name) => { for (let c = cls; c; c = c.sup) if (c.decl && c.decl.ifaces.includes(name)) return true; return false; };
  const exact = (p, v) => { const b = WRAP[p.type] || p.type; return !p.dims && ((PRIMSET.has(b) && v.t === b) || (b === 'String' && v.t === 'String')); };
  function pickBest(list, args) { const c = list.filter(m => m.params.length === args.length && m.params.every((p, i) => assignable(p, args[i]))); if (!c.length) return null; let best = c[0], bs = -1; for (const m of c) { const s = m.params.reduce((a, p, i) => a + (exact(p, args[i]) ? 1 : 0), 0); if (s > bs) { bs = s; best = m; } } return best; }
  function findMethod(cls, name, args) { for (let c = cls; c; c = c.sup) { const l = c.methods && c.methods.get && c.methods.get(name); if (l) { const m = pickBest(l.filter(x => x.body), args); if (m) return { m, cls: c }; } } return null; }
  function hasMethodName(cls, name) { for (let c = cls; c; c = c.sup) if (c.methods && c.methods.get && c.methods.get(name)) return true; return false; }

  function staticInit(ci) {
    if (ci.init) return; ci.init = true;
    const fr = { sc: new Scope(null), cls: ci, self: null };
    for (const f of ci.decl.fields) if (f.static) ci.statics.set(f.name, { ty: f.type, dims: f.dims, v: defaultVal(f.type, f.dims), final: false });
    for (const f of ci.decl.fields) if (f.static && f.init) { curLine = f.line; const s = ci.statics.get(f.name); s.v = coerce(f.type, f.dims, f.init.k === 'arrinit' ? evalArrInit(f.init, fr, f.type, f.dims) : ev(f.init, fr)); s.final = f.final; }
    for (const f of ci.decl.fields) if (f.static && f.final) ci.statics.get(f.name).final = true;
  }
  function findStatic(cls, name) { for (let c = cls; c; c = c.sup) { if (c.decl) { staticInit(c); if (c.statics.has(name)) return c.statics.get(name); } } return null; }

  /* ---- invocación ---- */
  function invoke(m, cls, self, args) {
    if (++depth > 280) { depth--; throw jex('StackOverflowError', undefined); }
    const fr = { sc: new Scope(null), cls, self, method: m };
    try {
      m.params.forEach((p, i) => fr.sc.m.set(p.name, { ty: p.type, dims: p.dims, v: coerce(p.type, p.dims, args[i]), final: false }));
      const sig = execBlock(m.body.body, fr, true);
      if (sig && sig.t === 'return') return sig.v ? (m.ret.name === 'void' ? NULL : coerce(m.ret.name, m.ret.dims, sig.v)) : NULL;
      return NULL;
    } finally { depth--; }
  }
  function instantiate(ci, args) {
    if (ci.decl && (ci.decl.abstract || ci.decl.iface)) throw cerr(ci.name + ' is abstract; cannot be instantiated');
    const o = { t: 'obj', cls: ci, f: {}, line: curLine }; allocFields(ci, o); runCtor(ci, o, args); return o;
  }
  function allocFields(ci, o) { if (ci.sup) allocFields(ci.sup, o); if (ci.decl) for (const f of ci.fields) o.f[f.name] = defaultVal(f.type, f.dims); if (ci.builtin) o.f.__msg = NULL; }
  function runCtor(ci, o, args) {
    if (ci.builtin) { if (args.length && args[0].t === 'String') o.f.__msg = args[0]; else if (args.length && args[0].t === 'obj' && args[0].cls && isThrowable(args[0].cls)) o.f.__msg = ST(toStr(args[0])); return; }
    let ctor = null;
    if (ci.ctors.length) { ctor = pickBest(ci.ctors, args); if (!ctor) throw cerr('constructor ' + ci.name + ' cannot be applied to given types'); }
    else if (args.length) throw cerr('constructor ' + ci.name + ' in class ' + ci.name + ' cannot be applied to given types');
    const fr = { sc: new Scope(null), cls: ci, self: o, method: ctor };
    let body = ctor ? ctor.body.body : [];
    if (ctor) ctor.params.forEach((p, i) => fr.sc.m.set(p.name, { ty: p.type, dims: p.dims, v: coerce(p.type, p.dims, args[i]), final: false }));
    let first = body[0] && body[0].k === 'expr' && body[0].e.k === 'ctorcall' ? body[0].e : null; if (first) body = body.slice(1);
    let initDone = false;
    if (first && first.which === 'this') { runCtor(ci, o, first.args.map(a => ev(a, fr))); initDone = true; }
    else { if (ci.sup) runCtor(ci.sup, o, first ? first.args.map(a => ev(a, fr)) : []); }
    if (!initDone) for (const f of ci.fields) if (f.init) { curLine = f.line; o.f[f.name] = coerce(f.type, f.dims, f.init.k === 'arrinit' ? evalArrInit(f.init, fr, f.type, f.dims) : ev(f.init, fr)); }
    if (++depth > 280) { depth--; throw jex('StackOverflowError'); }
    try { execBlock(body, fr, true); } finally { depth--; }
  }

  /* ---- arrays ---- */
  function newArray(et, dims, sizes, level) {
    const n = sizes[level]; if (n < 0) throw jex('NegativeArraySizeException', String(n));
    const remaining = dims - level - 1; const a = [];
    for (let i = 0; i < n; i++) a.push(level + 1 < sizes.length ? newArray(et, dims, sizes, level + 1) : defaultVal(et, remaining));
    return { t: 'array', et, dims: dims - level, a };
  }
  function evalArrInit(n, fr, et, dims) {
    const items = n.items.map(it => it.k === 'arrinit' ? evalArrInit(it, fr, et, dims - 1) : coerce(et, dims - 1, ev(it, fr)));
    return { t: 'array', et, dims, a: items };
  }
  const idx = (arr, i) => { if (arr.t === 'null') throw jex('NullPointerException', 'Cannot load from array because value is null'); if (!(i.t === 'int' || i.t === 'short' || i.t === 'byte' || i.t === 'char')) throw lossy(i.t, 'int'); if (i.v < 0 || i.v >= arr.a.length) throw jex('ArrayIndexOutOfBoundsException', 'Index ' + i.v + ' out of bounds for length ' + arr.a.length); return i.v; };

  /* ---- lectura/escritura de variables ---- */
  function lookupName(name, fr) {
    const s = fr.sc.get(name); if (s) return { kind: 'local', s };
    if (fr.self && fr.self.f && Object.prototype.hasOwnProperty.call(fr.self.f, name)) return { kind: 'field', o: fr.self, name };
    const st = findStatic(fr.cls, name); if (st) return { kind: 'static', s: st };
    return null;
  }
  function readName(n, fr) {
    const r = lookupName(n.name, fr);
    if (r) { if (r.kind === 'local' || r.kind === 'static') { if (r.s.v === undefined) throw cerr('variable ' + n.name + ' might not have been initialized', n.line); return r.s.v; } return r.o.f[r.name]; }
    throw cerr('cannot find symbol: variable ' + n.name, n.line);
  }
  function writeTarget(left, fr) { // devuelve {get, set(v), ty}
    if (left.k === 'name') {
      const r = lookupName(left.name, fr); if (!r) throw cerr('cannot find symbol: variable ' + left.name, left.line);
      if (r.kind === 'field') { const f = fieldDecl(fr.cls, left.name, fr.self); return { get: () => r.o.f[r.name], set: v => { r.o.f[r.name] = coerce(f.type, f.dims, v); }, cur: () => r.o.f[r.name] }; }
      const s = r.s;
      return { get: () => { if (s.v === undefined) throw cerr('variable ' + left.name + ' might not have been initialized', left.line); return s.v; }, set: v => { if (s.final && (s.assigned || s.v !== undefined)) throw cerr('cannot assign a value to final variable ' + left.name, left.line); s.v = coerce(s.ty, s.dims, v); s.assigned = true; }, cur: () => s.v };
    }
    if (left.k === 'index') {
      const arr = ev(left.obj, fr), i = ev(left.idx, fr); const k = idx(arr, i);
      return { get: () => arr.a[k], set: v => { const et = arr.et; arr.a[k] = coerce(et, arr.dims - 1, v); }, cur: () => arr.a[k] };
    }
    if (left.k === 'field') {
      if (left.obj.k === 'name' && !lookupName(left.obj.name, fr)) { const ci = userCls.get(left.obj.name); if (ci) { const s = findStatic(ci, left.name); if (s) return { get: () => s.v, set: v => { if (s.final) throw cerr('cannot assign a value to final variable ' + left.name, left.line); s.v = coerce(s.ty, s.dims, v); }, cur: () => s.v }; } }
      const o = ev(left.obj, fr);
      if (o.t === 'null') throw jex('NullPointerException', 'Cannot assign field "' + left.name + '" because ' + describe(left.obj) + ' is null');
      if (o.t === 'obj' && o.nat === 'Point' && (left.name === 'x' || left.name === 'y')) return { get: () => o[left.name], set: v => { o[left.name] = coerce('int', 0, v); }, cur: () => o[left.name] };
      if (o.t === 'obj' && o.f) { const f = fieldDecl(o.cls, left.name, o); if (!f) throw cerr('cannot find symbol: variable ' + left.name, left.line); if (o.cls && o.cls.decl) checkPriv(o.cls, left.name, fr, left.line); return { get: () => o.f[left.name], set: v => { o.f[left.name] = coerce(f.type, f.dims, v); }, cur: () => o.f[left.name] }; }
      if (o.t === 'array' && left.name === 'length') throw cerr('cannot assign a value to final variable length', left.line);
    }
    throw cerr('unexpected type', left.line);
  }
  function fieldOwner(cls, name) { for (let c = cls; c; c = c.sup) if (c.decl) { const f = c.decl.fields.find(x => x.name === name && !x.static); if (f) return { f, cls: c }; } return null; }
  const checkPriv = (cls, name, fr, line) => { const fo = fieldOwner(cls, name); if (fo && fo.f.priv && fr && fr.cls !== fo.cls) throw cerr(name + ' has private access in ' + fo.cls.name, line); };
  function fieldDecl(cls, name) { for (let c = cls; c; c = c.sup) if (c.decl) { const f = c.decl.fields.find(x => x.name === name && !x.static); if (f) return f; } return null; }
  const describe = n => n && n.k === 'name' ? '"' + n.name + '"' : n && n.k === 'call' ? 'the return value of "' + n.name + '()"' : n && n.k === 'field' ? '"' + (n.obj.k === 'name' ? n.obj.name + '.' : '') + n.name + '"' : '"<expr>"';

  /* ---- evaluación de expresiones ---- */
  function tick(line) { if (++steps > MAXSTEPS) throw new SimError('limit', 'Se ha detenido la ejecución: demasiadas operaciones. ¿Hay un bucle infinito?', line || curLine); }
  function ev(n, fr) {
    switch (n.k) {
      case 'lit': switch (n.t) { case 'int': return I(n.v); case 'long': return L(n.v); case 'double': return D(n.v); case 'float': return F(n.v); case 'char': return C(n.v); case 'boolean': return B(n.v); case 'String': return intern(n.v); default: return NULL; }
      case 'paren': return ev(n.e, fr);
      case 'name': return readName(n, fr);
      case 'this': return fr.self || (() => { throw cerr('non-static variable this cannot be referenced from a static context', n.line); })();
      case 'bin': return evBin(n, fr);
      case 'unary': {
        const v = ev(n.e, fr);
        if (n.op === '!') { if (v.t !== 'boolean') throw cerr("bad operand type " + tname(v) + " for unary operator '!'", n.line); return B(!v.v); }
        if (!isNumV(v)) throw cerr("bad operand type " + tname(v) + " for unary operator '" + n.op + "'", n.line);
        if (n.op === '~') return v.t === 'long' ? L(~v.v) : I(~v.v);
        const k = kindOf(v);
        if (n.op === '+') return k === 'int' ? I(v.v) : v;
        if (k === 'int') return I(-v.v); if (k === 'long') return L(-v.v); return k === 'float' ? F(-v.v) : D(-v.v);
      }
      case 'cond': { const c = cond(ev(n.c, fr)); const a = ev(c ? n.a : n.b, fr); if (isNumV(a)) { const o = c ? n.b : n.a; const ok = o.k === 'lit' ? o.t : null; if (ok && RANK[ok] !== undefined && RANK[ok] > RANK[kindOf(a)]) return castTo(ok, a); const pk = kindOf(a); if (o.k === 'lit' && o.t === 'char' && a.t === 'int') return a; } return a; }
      case 'cast': { const v = ev(n.e, fr); if (n.type.dims) return v; if (PRIMSET.has(n.type.name)) return castTo(n.type.name, v); if (WRAP[n.type.name]) { if (v.t === 'null') return v; if (v.t === 'obj' || v.t === 'String' || v.t === 'array' || (v.t !== WRAP[n.type.name] && !(isNumV(v) && fr.castPrim))) { if (!isNumV(v) && v.t !== 'boolean' || v.t !== WRAP[n.type.name]) throw jex('ClassCastException', 'class ' + (v.t === 'obj' && v.cls ? v.cls.name : javaClassName(v)) + ' cannot be cast to class java.lang.' + n.type.name); } return v; } if (v.t === 'obj' && v.cls && userCls.has(n.type.name) && !chainHas(v.cls, n.type.name) && !userIface(v.cls, n.type.name)) throw jex('ClassCastException', 'class ' + v.cls.name + ' cannot be cast to class ' + n.type.name); if (v.t === 'String' && userCls.has(n.type.name)) throw jex('ClassCastException', 'class java.lang.String cannot be cast to class ' + n.type.name); return v; }
      case 'instanceof': { const v = ev(n.e, fr); let r = false; if (v.t !== 'null') { const tn = n.type; if (tn === 'Object') r = true; else if (tn === 'String') r = v.t === 'String'; else if (WRAP[tn]) r = v.t === WRAP[tn]; else if (v.t === 'obj' && v.cls) r = chainHas(v.cls, tn) || userIface(v.cls, tn); } if (r && n.bind) fr.sc.m.set(n.bind, { ty: 'var', dims: 0, v, final: false }); return B(r); }
      case 'assign': return evAssign(n, fr);
      case 'incdec': {
        const tg = writeTarget(n.e, fr); const old = tg.get(); if (!isNumV(old)) throw cerr("bad operand type " + tname(old) + " for unary operator '" + n.op + "'", n.line);
        const one = I(1); const nv = castTo(old.t === 'char' || old.t === 'byte' || old.t === 'short' || old.t === 'int' || old.t === 'long' || old.t === 'float' || old.t === 'double' ? (old.t === 'int' ? 'int' : old.t) : 'int', arith(n.op === '++' ? '+' : '-', old, one));
        tg.set(nv); return n.prefix ? nv : old;
      }
      case 'field': return evField(n, fr);
      case 'index': { const arr = ev(n.obj, fr); const i = ev(n.idx, fr); return arr.a[idx(arr, i)]; }
      case 'call': return evCall(n, fr);
      case 'new': return evNew(n, fr);
      case 'newarr': {
        if (n.init) return evalArrInit(n.init, fr, n.et, n.total);
        const sizes = n.dimsE.map(e => { const v = ev(e, fr); if (kindOf(v) !== 'int') throw lossy(v.t, 'int'); return v.v; });
        return newArray(n.et, n.total, sizes, 0);
      }
      case 'arrinit': throw cerr('illegal initializer', n.line);
      case 'switchx': return execSwitch(n, fr, true);
      case 'ctorcall': throw cerr('call to ' + n.which + ' must be first statement in constructor', n.line);
    }
    throw unsup('esta construcción (' + n.k + ')', n.line);
  }
  function evBin(n, fr) {
    const op = n.op;
    if (op === '&&') { const a = ev(n.l, fr); if (a.t !== 'boolean') throw cerr("bad operand types for binary operator '&&'", n.line); if (!a.v) return B(false); const b = ev(n.r, fr); if (b.t !== 'boolean') throw cerr("bad operand types for binary operator '&&'", n.line); return B(b.v); }
    if (op === '||') { const a = ev(n.l, fr); if (a.t !== 'boolean') throw cerr("bad operand types for binary operator '||'", n.line); if (a.v) return B(true); const b = ev(n.r, fr); if (b.t !== 'boolean') throw cerr("bad operand types for binary operator '||'", n.line); return B(b.v); }
    const a = ev(n.l, fr), b = ev(n.r, fr); curLine = n.line; tick(n.line);
    switch (op) {
      case '+': if (a.t === 'String' || b.t === 'String') return ST(toStr(a) + toStr(b)); return arith('+', a, b);
      case '==': return B(equalsOp(a, b)); case '!=': return B(!equalsOp(a, b));
      case '<': case '>': case '<=': case '>=': return compare(op, a, b);
      default: return arith(op, a, b);
    }
  }
  function evAssign(n, fr) {
    const tg = writeTarget(n.left, fr);
    if (n.op === '=') { let v; if (n.right.k === 'arrinit') throw cerr('illegal start of expression', n.line); v = ev(n.right, fr); curLine = n.line; tg.set(v); return tg.cur(); }
    const old = tg.get(); const r = ev(n.right, fr); curLine = n.line; const op = n.op.slice(0, -1);
    let nv;
    if (op === '+' && old.t === 'String') nv = ST(toStr(old) + toStr(r));
    else { const res = arith(op, old, r); nv = old.t === 'String' ? res : castTo(old.t === 'boolean' ? 'boolean' : old.t, res); }
    tg.set(nv); return nv;
  }
  function evField(n, fr) {
    if (n.obj.k === 'name' && !lookupName(n.obj.name, fr)) {
      const cn = n.obj.name; const ci = userCls.get(cn);
      if (ci) { const s = findStatic(ci, n.name); if (s) return s.v; throw cerr('cannot find symbol: variable ' + n.name, n.line); }
      const sf = staticField(cn, n.name, n.line); if (sf) return sf;
      throw cerr('cannot find symbol: variable ' + cn, n.line);
    }
    const o = ev(n.obj, fr);
    if (o.t === 'obj' && o.cls && o.cls.decl) checkPriv(o.cls, n.name, fr, n.line);
    if (o.t === 'array' && n.name === 'length') return I(o.a.length);
    if (o.t === 'null') throw jex('NullPointerException', 'Cannot read field "' + n.name + '" because ' + describe(n.obj) + ' is null');
    if (o.t === 'obj' && o.nat === 'Point' && (n.name === 'x' || n.name === 'y')) return o[n.name];
    if (o.t === 'obj' && o.f && Object.prototype.hasOwnProperty.call(o.f, n.name)) return o.f[n.name];
    if (o.t === 'obj' && o.nat === 'Enum' && o.kind === 'ChronoUnit') return o;
    throw cerr('cannot find symbol: variable ' + n.name, n.line);
  }
  function staticField(cn, name, line) {
    switch (cn + '.' + name) {
      case 'Math.PI': return D(Math.PI); case 'Math.E': return D(Math.E);
      case 'Integer.MAX_VALUE': return I(2147483647); case 'Integer.MIN_VALUE': return I(-2147483648);
      case 'Long.MAX_VALUE': return L(9223372036854775807n); case 'Long.MIN_VALUE': return L(-9223372036854775808n);
      case 'Double.MAX_VALUE': return D(Number.MAX_VALUE); case 'Double.MIN_VALUE': return D(5e-324); case 'Double.POSITIVE_INFINITY': return D(Infinity); case 'Double.NEGATIVE_INFINITY': return D(-Infinity); case 'Double.NaN': return D(NaN);
      case 'Float.MAX_VALUE': return F(3.4028234663852886e38); case 'Byte.MAX_VALUE': return { t: 'byte', v: 127 }; case 'Byte.MIN_VALUE': return { t: 'byte', v: -128 }; case 'Short.MAX_VALUE': return { t: 'short', v: 32767 }; case 'Short.MIN_VALUE': return { t: 'short', v: -32768 };
      case 'Character.MAX_VALUE': return C(65535); case 'Character.MIN_VALUE': return C(0);
      case 'System.in': return { t: 'obj', nat: 'InStream' };
      case 'Locale.US': return mkEnum('Locale', 'US'); case 'Locale.ENGLISH': return mkEnum('Locale', 'US'); case 'Locale.ROOT': return mkEnum('Locale', 'US'); case 'Locale.UK': return mkEnum('Locale', 'US'); case 'Locale.GERMANY': return mkEnum('Locale', 'ES'); case 'Locale.FRANCE': return mkEnum('Locale', 'ES');
      case 'ChronoUnit.DAYS': return mkEnum('ChronoUnit', 'DAYS'); case 'ChronoUnit.MONTHS': return mkEnum('ChronoUnit', 'MONTHS'); case 'ChronoUnit.YEARS': return mkEnum('ChronoUnit', 'YEARS'); case 'ChronoUnit.WEEKS': return mkEnum('ChronoUnit', 'WEEKS');
      case 'System.out': case 'System.err': return { t: 'obj', nat: 'PrintStream', err: name === 'err' };
    }
    if (cn === 'DayOfWeek' && DOWS.includes(name)) return mkEnum('DayOfWeek', name, { n: DOWS.indexOf(name) + 1 });
    if (cn === 'Month' && MONTHS.includes(name)) return mkEnum('Month', name, { n: MONTHS.indexOf(name) + 1 });
    if (KNOWN_CLASSES.has(cn)) throw cerr('cannot find symbol: variable ' + name + ' en ' + cn, line);
    return null;
  }
  const KNOWN_CLASSES = new Set(['Math', 'Integer', 'Long', 'Double', 'Float', 'Boolean', 'Character', 'String', 'System', 'Arrays', 'Objects', 'LocalDate', 'Locale', 'DateTimeFormatter', 'ChronoUnit', 'Thread', 'Byte', 'Short', 'DayOfWeek', 'Month', 'StringBuilder', 'Scanner', 'Random']);

  function evNew(n, fr) {
    const args = n.args.map(a => ev(a, fr)); curLine = n.line;
    const ci = userCls.get(n.cls); if (ci) return instantiate(ci, args);
    if (THROW[n.cls] !== undefined) { const o = { t: 'obj', cls: bcls(n.cls), f: { __msg: NULL }, line: curLine }; runCtor(o.cls, o, args); return o; }
    switch (n.cls) {
      case 'String': if (!args.length) return ST(''); if (args[0].t === 'String') return ST(args[0].v); if (args[0].t === 'array') return ST(args[0].a.map(c => String.fromCharCode(c.v)).join('')); if (args[0].t === 'obj' && args[0].nat === 'SB') return ST(args[0].s); break;
      case 'StringBuilder': case 'StringBuffer': return { t: 'obj', nat: 'SB', s: args.length && args[0].t === 'String' ? args[0].v : '' };
      case 'Scanner': { const a = args[0]; return { t: 'obj', nat: 'Scanner', buf: a && a.t === 'String' ? a.v : (stdin || ''), pos: 0, loc: 'ES', closed: false }; }
      case 'Random': return { t: 'obj', nat: 'Random', seed: BigInt.asUintN(48, (args.length ? BigInt(args[0].v) : BigInt(Math.floor(Math.random() * 2 ** 48))) ^ 0x5DEECE66Dn) };
      case 'Point': return { t: 'obj', nat: 'Point', x: args.length >= 2 ? I(args[0].v) : args.length === 1 && args[0].nat === 'Point' ? args[0].x : I(0), y: args.length >= 2 ? I(args[1].v) : args.length === 1 && args[0].nat === 'Point' ? args[0].y : I(0) };
      case 'ArrayList': case 'LinkedList': return { t: 'obj', nat: 'List', a: args.length && args[0].nat === 'List' ? args[0].a.slice() : [] };
      case 'Object': return { t: 'obj', nat: 'Object' };
      case 'Integer': case 'Double': case 'Long': case 'Boolean': case 'Character': return coerce(n.cls, 0, args[0]);
    }
    throw unsup('la clase ' + n.cls, n.line);
  }

  /* ---- llamadas ---- */
  function evCall(n, fr) {
    curLine = n.line; tick(n.line);
    const args = n.args.map(a => ev(a, fr)); curLine = n.line;
    if (n.obj === null) {
      const f = findMethod(fr.cls, n.name, args);
      if (f) { if (!f.m.static && !fr.self) throw cerr('non-static method ' + n.name + '(' + f.m.params.map(p => p.type).join(',') + ') cannot be referenced from a static context', n.line); return invoke(f.m, f.cls, f.m.static ? null : fr.self, args); }
      if (hasMethodName(fr.cls, n.name)) throw cerr('method ' + n.name + ' cannot be applied to given types', n.line);
      throw cerr('cannot find symbol: method ' + n.name, n.line);
    }
    if (n.obj.k === 'super') { for (let c = fr.cls.sup; c; c = c.sup) { const l = c.methods && c.methods.get && c.methods.get(n.name); if (l) { const m = pickBest(l.filter(x => x.body), args); if (m) return invoke(m, c, fr.self, args); } } return objMethod(fr.self, n.name, args, n, true); }
    if (n.obj.k === 'field' && n.obj.obj.k === 'name' && n.obj.obj.name === 'System' && (n.obj.name === 'out' || n.obj.name === 'err') && !lookupName('System', fr)) return printCall(n.obj.name === 'err', n.name, args, n);
    if (n.obj.k === 'name' && !lookupName(n.obj.name, fr)) {
      const ci = userCls.get(n.obj.name);
      if (ci) { const f = findMethod(ci, n.name, args); if (!f) throw cerr('cannot find symbol: method ' + n.name, n.line); if (!f.m.static) throw cerr('non-static method ' + n.name + '() cannot be referenced from a static context', n.line); if (f.m.priv && f.cls !== fr.cls) throw cerr(n.name + '(' + f.m.params.map(p => p.type).join(',') + ') has private access in ' + f.cls.name, n.line); return invoke(f.m, f.cls, null, args); }
      return staticCall(n.obj.name, n.name, args, n);
    }
    const target = ev(n.obj, fr); curLine = n.line;
    if (target.t === 'null') throw jex('NullPointerException', 'Cannot invoke "' + (n.obj.k === 'name' && lookupName(n.obj.name, fr) && lookupName(n.obj.name, fr).s ? lookupName(n.obj.name, fr).s.ty : 'Object') + '.' + n.name + '()" because ' + describe(n.obj) + ' is null');
    if (target.t === 'obj' && target.cls && target.cls.decl) { const f = findMethod(target.cls, n.name, args); if (f && f.m.priv && f.cls !== fr.cls) throw cerr(n.name + '(' + f.m.params.map(p => p.type).join(',') + ') has private access in ' + f.cls.name, n.line); }
    return objMethod(target, n.name, args, n);
  }
  function printCall(err, name, args, n) {
    const s = a => (a.t === 'array' && a.et === 'char') ? a.a.map(c => String.fromCharCode(c.v)).join('') : toStr(a);
    switch (name) {
      case 'println': write((args.length ? s(args[0]) : '') + '\n', err); return NULL;
      case 'print': if (!args.length) throw cerr('no suitable method found for print(no arguments)', n.line); write(s(args[0]), err); return NULL;
      case 'printf': case 'format': { let loc = 'ES', a = args; if (a[0] && a[0].t === 'obj' && a[0].kind === 'Locale') { loc = a[0].name; a = a.slice(1); } write(formatJava(rt, a[0].v, a.slice(1), loc), err); return NULL; }
      case 'flush': return NULL;
    }
    throw cerr('cannot find symbol: method ' + name, n.line);
  }
  const ci2s = v => (v.t === 'char' || v.t === 'int') ? String.fromCharCode(v.v) : v.v;
  const needInt = (v) => { if (kindOf(v) !== 'int') throw lossy(v.t, 'int'); return v.v; };
  function strMethod(s, name, a, n) {
    const str = s.v, len = str.length;
    const bad = (i) => jex('StringIndexOutOfBoundsException', 'Index ' + i + ' out of bounds for length ' + len);
    switch (name) {
      case 'length': return I(len);
      case 'charAt': { const i = needInt(a[0]); if (i < 0 || i >= len) throw jex('StringIndexOutOfBoundsException', 'Index ' + i + ' out of bounds for length ' + len); return C(str.charCodeAt(i)); }
      case 'isEmpty': return B(len === 0); case 'isBlank': return B(str.trim() === '');
      case 'substring': { const b = needInt(a[0]), e = a.length > 1 ? needInt(a[1]) : len; if (b < 0 || e > len || b > e) throw jex('StringIndexOutOfBoundsException', a.length > 1 ? 'Range [' + b + ', ' + e + ') out of bounds for length ' + len : 'begin ' + b + ', end ' + e + ', length ' + len); return b === 0 && e === len ? s : ST(str.slice(b, e)); }
      case 'indexOf': return I(str.indexOf(ci2s(a[0]), a.length > 1 ? Math.max(0, a[1].v) : 0));
      case 'lastIndexOf': return I(a.length > 1 ? str.lastIndexOf(ci2s(a[0]), a[1].v) : str.lastIndexOf(ci2s(a[0])));
      case 'contains': return B(str.includes(toStr(a[0])));
      case 'startsWith': return B(str.startsWith(a[0].v, a.length > 1 ? a[1].v : 0)); case 'endsWith': return B(str.endsWith(a[0].v));
      case 'equals': return B(a[0].t === 'String' && a[0].v === str);
      case 'equalsIgnoreCase': return B(a[0].t === 'String' && a[0].v.toLowerCase() === str.toLowerCase());
      case 'compareTo': { const o = a[0].v; let i = 0; while (i < len && i < o.length && str[i] === o[i]) i++; return I(i < len && i < o.length ? str.charCodeAt(i) - o.charCodeAt(i) : len - o.length); }
      case 'compareToIgnoreCase': { const x = str.toLowerCase(), o = a[0].v.toLowerCase(); let i = 0; while (i < x.length && i < o.length && x[i] === o[i]) i++; return I(i < x.length && i < o.length ? x.charCodeAt(i) - o.charCodeAt(i) : x.length - o.length); }
      case 'toUpperCase': { const r = str.toUpperCase(); return r === str ? s : ST(r); } case 'toLowerCase': { const r = str.toLowerCase(); return r === str ? s : ST(r); }
      case 'trim': { const r = str.replace(/^[\u0000- ]+|[\u0000- ]+$/g, ''); return r === str ? s : ST(r); }
      case 'strip': { const r = str.trim(); return r === str ? s : ST(r); } case 'stripLeading': return ST(str.trimStart()); case 'stripTrailing': return ST(str.trimEnd());
      case 'replace': { const x = ci2s(a[0]) === undefined ? toStr(a[0]) : toStr(a[0]), y = toStr(a[1]); if (!str.includes(x)) return s; return ST(str.split(x).join(y)); }
      case 'replaceAll': return ST(str.replace(new RegExp(a[0].v, 'g'), a[1].v.replace(/\$(\d)/g, '$$$1')));
      case 'matches': return B(new RegExp('^(?:' + a[0].v + ')$').test(str));
      case 'concat': return ST(str + a[0].v); case 'repeat': { const k = needInt(a[0]); if (k < 0) throw jex('IllegalArgumentException', 'count is negative: ' + k); return ST(str.repeat(k)); }
      case 'toCharArray': return { t: 'array', et: 'char', dims: 1, a: [...str].map(c => C(c.charCodeAt(0))) };
      case 'split': { let parts = str.split(new RegExp(a[0].v)); if (a.length > 1 && a[1].v > 0) { const lim = a[1].v; const re = new RegExp(a[0].v, 'g'); parts = []; let last = 0, m; while (parts.length < lim - 1 && (m = re.exec(str))) { if (m[0] === '') { re.lastIndex++; continue; } parts.push(str.slice(last, m.index)); last = m.index + m[0].length; } parts.push(str.slice(last)); } else { if (parts.length > 1 && parts[0] === '' && a[0].v === '') parts.shift(); while (parts.length > 1 && parts[parts.length - 1] === '') parts.pop(); if (str === '') parts = ['']; } return { t: 'array', et: 'String', dims: 1, a: parts.map(ST) }; }
      case 'hashCode': { let h = 0; for (let i = 0; i < len; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0; return I(h); }
      case 'intern': return intern(str); case 'toString': return s;
      case 'formatted': return ST(formatJava(rt, str, a, 'ES'));
      case 'codePointAt': return I(str.codePointAt(needInt(a[0])));
    }
    throw cerr('cannot find symbol: method ' + name + ' en String', n.line);
  }
  function objMethod(t, name, a, n, viaSuper) {
    if (t.t === 'String') return strMethod(t, name, a, n);
    if (isNumV(t) || t.t === 'boolean') { // métodos de envoltorios
      switch (name) { case 'equals': return B(valEquals(t, a[0])); case 'toString': return ST(toStr(t)); case 'intValue': return castTo('int', t); case 'doubleValue': return castTo('double', t); case 'longValue': return castTo('long', t); case 'compareTo': return I(t.v < a[0].v ? -1 : t.v > a[0].v ? 1 : 0); case 'hashCode': return I(Number(t.v) | 0); case 'isNaN': return B(Number.isNaN(t.v)); case 'charValue': return t; case 'booleanValue': return t; }
      throw cerr(t.t + ' cannot be dereferenced', n.line);
    }
    if (t.t === 'array') { if (name === 'clone') return { t: 'array', et: t.et, dims: t.dims, a: t.a.slice() }; if (name === 'equals') return B(t === a[0]); if (name === 'length') throw cerr('cannot find symbol: method length()', n.line); if (name === 'getClass') return mkEnum('Class', t.et + '[]'); }
    if (t.t === 'obj' && t.cls) {
      if (!viaSuper) { const f = findMethod(t.cls, name, a); if (f) return invoke(f.m, f.cls, t, a); }
      if (isThrowable(t.cls)) switch (name) {
        case 'getMessage': case 'getLocalizedMessage': return t.f.__msg || NULL; case 'toString': { const msg = t.f.__msg; return ST(((t.cls.builtin) ? qual(t.cls.name) : t.cls.name) + (msg && msg.t !== 'null' ? ': ' + msg.v : '')); }
        case 'printStackTrace': write(toStr(t) + '\n\tat ' + mainName + '.main(' + mainName + '.java:' + t.line + ')\n', true); return NULL;
        case 'getCause': return NULL; case 'getStackTrace': return { t: 'array', et: 'StackTraceElement', dims: 1, a: [] }; case 'addSuppressed': return NULL;
      }
      switch (name) { case 'equals': return B(t === a[0]); case 'hashCode': return I(parseInt(toStr(t).split('@')[1] || '0', 16)); case 'toString': return ST(toStr(t)); case 'getClass': return mkEnum('Class', t.cls.name); }
      if (hasMethodName(t.cls, name)) throw cerr('method ' + name + ' cannot be applied to given types', n.line);
      throw cerr('cannot find symbol: method ' + name, n.line);
    }
    switch (t.nat) {
      case 'SB': return sbMethod(t, name, a, n);
      case 'Scanner': return scanMethod(t, name, a, n);
      case 'Random': return rndMethod(t, name, a, n);
      case 'Date': return dateMethod(t, name, a, n);
      case 'Fmt': throw cerr('cannot find symbol: method ' + name, n.line);
      case 'Point': switch (name) { case 'getX': return D(t.x.v); case 'getY': return D(t.y.v); case 'translate': t.x = I(t.x.v + a[0].v); t.y = I(t.y.v + a[1].v); return NULL; case 'setLocation': t.x = I(Math.trunc(Number(a[0].v))); t.y = I(Math.trunc(Number(a[1].v))); return NULL; case 'equals': return B(valEquals(t, a[0])); case 'toString': return ST(toStr(t)); case 'distance': { const dx = t.x.v - (a.length === 1 ? a[0].x.v : a[0].v), dy = t.y.v - (a.length === 1 ? a[0].y.v : a[1].v); return D(Math.sqrt(dx * dx + dy * dy)); } } break;
      case 'List': return listMethod(t, name, a, n);
      case 'Enum': switch (name) { case 'name': case 'toString': return ST(t.name); case 'getValue': return I(t.n); case 'equals': return B(t === a[0]); case 'between': { const x = a[0].d, y = a[1].d; if (t.name === 'DAYS') return L(y - x); if (t.name === 'WEEKS') return L(Math.trunc((y - x) / 7)); const [y1, m1, d1] = ymd(x), [y2, m2, d2] = ymd(y); let months = (y2 - y1) * 12 + (m2 - m1); if (months > 0 && d2 < d1) months--; else if (months < 0 && d2 > d1) months++; return L(t.name === 'MONTHS' ? months : Math.trunc(months / 12)); } case 'getSimpleName': case 'getName': return ST(t.name); case 'ordinal': return I((t.n || 1) - 1); case 'plus': { const k = (t.n - 1 + Number(a[0].v)) % 7; return mkEnum('DayOfWeek', DOWS[(k + 7) % 7], { n: ((k + 7) % 7) + 1 }); } } break;
      case 'PrintStream': return printCall(t.err, name, a, n);
      case 'Object': if (name === 'toString') return ST(toStr(t)); if (name === 'equals') return B(t === a[0]); if (name === 'hashCode') return I(7); break;
      case 'InStream': break;
    }
    throw cerr('cannot find symbol: method ' + name, n.line);
  }
  function sbMethod(t, name, a, n) {
    switch (name) {
      case 'append': t.s += (a[0].t === 'array' && a[0].et === 'char') ? a[0].a.map(c => String.fromCharCode(c.v)).join('') : toStr(a[0]); return t;
      case 'toString': return ST(t.s); case 'length': return I(t.s.length);
      case 'charAt': { const i = needInt(a[0]); if (i < 0 || i >= t.s.length) throw jex('StringIndexOutOfBoundsException', 'index ' + i + ',length ' + t.s.length); return C(t.s.charCodeAt(i)); }
      case 'insert': { const i = needInt(a[0]); if (i < 0 || i > t.s.length) throw jex('StringIndexOutOfBoundsException', 'offset ' + i + ', length ' + t.s.length); t.s = t.s.slice(0, i) + toStr(a[1]) + t.s.slice(i); return t; }
      case 'reverse': t.s = [...t.s].reverse().join(''); return t;
      case 'deleteCharAt': { const i = needInt(a[0]); if (i < 0 || i >= t.s.length) throw jex('StringIndexOutOfBoundsException', 'index ' + i + ',length ' + t.s.length); t.s = t.s.slice(0, i) + t.s.slice(i + 1); return t; }
      case 'delete': { const b = needInt(a[0]); let e = Math.min(needInt(a[1]), t.s.length); if (b < 0 || b > e) throw jex('StringIndexOutOfBoundsException', 'start ' + b + ', end ' + e + ', length ' + t.s.length); t.s = t.s.slice(0, b) + t.s.slice(e); return t; }
      case 'replace': { const b = needInt(a[0]); const e = Math.min(needInt(a[1]), t.s.length); t.s = t.s.slice(0, b) + a[2].v + t.s.slice(e); return t; }
      case 'setLength': t.s = t.s.slice(0, needInt(a[0])); return NULL; case 'isEmpty': return B(!t.s.length);
      case 'indexOf': return I(t.s.indexOf(a[0].v)); case 'substring': return ST(t.s.slice(needInt(a[0]), a.length > 1 ? needInt(a[1]) : undefined));
      case 'setCharAt': { const i = needInt(a[0]); t.s = t.s.slice(0, i) + String.fromCharCode(a[1].v) + t.s.slice(i + 1); return NULL; }
      case 'equals': return B(t === a[0]);
    }
    throw cerr('cannot find symbol: method ' + name + ' en StringBuilder', n.line);
  }
  function tokenAt(sc) { let p = sc.pos; const b = sc.buf; while (p < b.length && /\s/.test(b[p])) p++; if (p >= b.length) return null; let e = p; while (e < b.length && !/\s/.test(b[e])) e++; return { tok: b.slice(p, e), end: e }; }
  const intRe = /^[+-]?\d+$/;
  const dblRe = (loc) => loc === 'US' ? /^[+-]?(\d{1,3}(,\d{3})+|\d+)(\.\d*)?$|^[+-]?\.\d+$/ : /^[+-]?(\d{1,3}(\.\d{3})+|\d+)(,\d*)?$|^[+-]?,\d+$/;
  function scanMethod(sc, name, a, n) {
    if (sc.closed && name !== 'close') throw jex('IllegalStateException', 'Scanner closed');
    switch (name) {
      case 'nextLine': { if (sc.pos >= sc.buf.length) throw jex('NoSuchElementException', 'No line found'); let e = sc.buf.indexOf('\n', sc.pos); let line; if (e < 0) { line = sc.buf.slice(sc.pos); sc.pos = sc.buf.length; } else { line = sc.buf.slice(sc.pos, e); sc.pos = e + 1; } return ST(line.replace(/\r$/, '')); }
      case 'hasNextLine': return B(sc.pos < sc.buf.length);
      case 'hasNext': return B(!!tokenAt(sc));
      case 'next': { const t = tokenAt(sc); if (!t) throw jex('NoSuchElementException'); sc.pos = t.end; return ST(t.tok); }
      case 'hasNextInt': { const t = tokenAt(sc); return B(!!t && intRe.test(t.tok) && Math.abs(Number(t.tok)) <= 2147483648); }
      case 'hasNextDouble': { const t = tokenAt(sc); return B(!!t && dblRe(sc.loc).test(t.tok)); }
      case 'nextInt': case 'nextLong': { const t = tokenAt(sc); if (!t) throw jex('NoSuchElementException'); if (!intRe.test(t.tok)) throw jex('InputMismatchException'); const v = BigInt(t.tok); if (name === 'nextInt' && (v > 2147483647n || v < -2147483648n)) throw jex('InputMismatchException', 'For input string: "' + t.tok + '"'); sc.pos = t.end; return name === 'nextInt' ? I(Number(v)) : L(v); }
      case 'nextDouble': { const t = tokenAt(sc); if (!t) throw jex('NoSuchElementException'); if (!dblRe(sc.loc).test(t.tok)) throw jex('InputMismatchException'); sc.pos = t.end; const txt = sc.loc === 'US' ? t.tok.replace(/,/g, '') : t.tok.replace(/\./g, '').replace(',', '.'); return D(parseFloat(txt)); }
      case 'nextBoolean': { const t = tokenAt(sc); if (!t) throw jex('NoSuchElementException'); if (!/^(true|false)$/i.test(t.tok)) throw jex('InputMismatchException'); sc.pos = t.end; return B(t.tok.toLowerCase() === 'true'); }
      case 'useLocale': sc.loc = a[0].name; return sc;
      case 'close': sc.closed = true; return NULL;
    }
    throw cerr('cannot find symbol: method ' + name + ' en Scanner', n.line);
  }
  function rndNext(r, bits) { r.seed = (r.seed * 0x5DEECE66Dn + 0xBn) & ((1n << 48n) - 1n); return Number(BigInt.asIntN(32, r.seed >> BigInt(48 - bits))); }
  function rndMethod(r, name, a, n) {
    switch (name) {
      case 'nextInt': {
        if (a.length === 0) return I(rndNext(r, 32));
        if (a.length === 1) { const bound = needInt(a[0]); if (bound <= 0) throw jex('IllegalArgumentException', 'bound must be positive'); let x = rndNext(r, 31); const m = bound - 1; if ((bound & m) === 0) return I(Number((BigInt(bound) * BigInt(x)) >> 31n)); for (let u = x; u - (x = u % bound) + m > 2147483647; u = rndNext(r, 31)); return I(x); }
        const org = needInt(a[0]), bnd = needInt(a[1]); if (org >= bnd) throw jex('IllegalArgumentException', 'bound must be greater than origin'); let x = rndNext(r, 32); const nn = (bnd - org) | 0, m = (nn - 1) | 0;
        if (nn > 0) { if ((nn & m) === 0) x = ((x & m) + org) | 0; else { for (let u = x >>> 1; u + m - (x = u % nn) > 2147483647; u = rndNext(r, 32) >>> 1); x = (x + org) | 0; } return I(x); }
        while (x < org || x >= bnd) x = rndNext(r, 32); return I(x);
      }
      case 'nextDouble': { const hi = BigInt(rndNext(r, 26)), lo = BigInt(rndNext(r, 27)); return D(Number((hi << 27n) + lo) * 2 ** -53); }
      case 'nextBoolean': return B(rndNext(r, 1) !== 0);
      case 'nextLong': { const hi = BigInt(rndNext(r, 32)), lo = BigInt(rndNext(r, 32)); return L((hi << 32n) + lo); }
    }
    throw cerr('cannot find symbol: method ' + name + ' en Random', n.line);
  }
  const mkDate = ep => ({ t: 'obj', nat: 'Date', d: ep });
  function dateMethod(t, name, a, n) {
    const [y, m, d] = ymd(t.d);
    const addMonths = k => { const tot = y * 12 + (m - 1) + k; const ny = Math.floor(tot / 12), nm = (tot % 12 + 12) % 12 + 1; return mkDate(toEpoch(ny, nm, Math.min(d, mlen(ny, nm)))); };
    switch (name) {
      case 'plusDays': return mkDate(t.d + Number(a[0].v)); case 'minusDays': return mkDate(t.d - Number(a[0].v));
      case 'plusWeeks': return mkDate(t.d + 7 * Number(a[0].v)); case 'minusWeeks': return mkDate(t.d - 7 * Number(a[0].v));
      case 'plusMonths': return addMonths(Number(a[0].v)); case 'minusMonths': return addMonths(-Number(a[0].v));
      case 'plusYears': return addMonths(12 * Number(a[0].v)); case 'minusYears': return addMonths(-12 * Number(a[0].v));
      case 'getYear': return I(y); case 'getMonthValue': return I(m); case 'getDayOfMonth': return I(d);
      case 'getMonth': return mkEnum('Month', MONTHS[m - 1], { n: m });
      case 'getDayOfWeek': { const k = (((t.d + 3) % 7) + 7) % 7; return mkEnum('DayOfWeek', DOWS[k], { n: k + 1 }); }
      case 'getDayOfYear': return I(t.d - toEpoch(y, 1, 1) + 1);
      case 'isLeapYear': return B(leap(y)); case 'lengthOfMonth': return I(mlen(y, m)); case 'lengthOfYear': return I(leap(y) ? 366 : 365);
      case 'isBefore': return B(t.d < a[0].d); case 'isAfter': return B(t.d > a[0].d); case 'isEqual': return B(t.d === a[0].d);
      case 'equals': return B(a[0].t === 'obj' && a[0].nat === 'Date' && a[0].d === t.d);
      case 'compareTo': return I(t.d - a[0].d); case 'toString': return ST(toStr(t)); case 'withDayOfMonth': return mkDate(toEpoch(y, m, Number(a[0].v)));
      case 'toEpochDay': return L(t.d); case 'hashCode': return I(t.d);
      case 'format': return ST(fmtDate(t.d, a[0].pat, a[0].loc));
    }
    throw cerr('cannot find symbol: method ' + name + ' en LocalDate', n.line);
  }
  function listMethod(t, name, a, n) {
    const chk = i => { if (i < 0 || i >= t.a.length) throw jex('IndexOutOfBoundsException', 'Index ' + i + ' out of bounds for length ' + t.a.length); return i; };
    switch (name) {
      case 'add': if (a.length === 2) { const i = needInt(a[0]); if (i < 0 || i > t.a.length) throw jex('IndexOutOfBoundsException', 'Index: ' + i + ', Size: ' + t.a.length); t.a.splice(i, 0, a[1]); return NULL; } t.a.push(a[0]); return B(true);
      case 'get': return t.a[chk(needInt(a[0]))]; case 'set': { const i = chk(needInt(a[0])); const o = t.a[i]; t.a[i] = a[1]; return o; }
      case 'size': return I(t.a.length); case 'isEmpty': return B(!t.a.length); case 'clear': t.a = []; return NULL;
      case 'remove': if (a[0].t === 'int') return t.a.splice(chk(a[0].v), 1)[0]; { const i = t.a.findIndex(x => valEquals(x, a[0])); if (i >= 0) t.a.splice(i, 1); return B(i >= 0); }
      case 'contains': return B(t.a.some(x => valEquals(x, a[0]))); case 'indexOf': return I(t.a.findIndex(x => valEquals(x, a[0])));
      case 'toString': return ST(toStr(t));
    }
    throw cerr('cannot find symbol: method ' + name + ' en ArrayList', n.line);
  }
  const num1 = (a) => a[0];
  function staticCall(cn, name, a, n) {
    const arg = i => a[i];
    switch (cn) {
      case 'Math': {
        const f = (fn) => D(fn(Number(a[0].v)));
        switch (name) {
          case 'abs': { const k = kindOf(a[0]); if (k === 'int') return I(a[0].v < 0 ? -a[0].v : a[0].v); if (k === 'long') return L(a[0].v < 0n ? -a[0].v : a[0].v); return k === 'float' ? F(Math.abs(a[0].v)) : D(Math.abs(a[0].v)); }
          case 'max': case 'min': { const r = compare('>', a[0], a[1]).v; const pickFirst = name === 'max' ? (r || equalsOp(a[0], a[1])) : (!r); const k1 = kindOf(a[0]), k2 = kindOf(a[1]); const k = RANK[k1] >= RANK[k2] ? k1 : k2; const w = pickFirst ? a[0] : a[1]; return castTo(k === 'int' ? 'int' : k, w); }
          case 'pow': return D(Math.pow(Number(a[0].v), Number(a[1].v))); case 'sqrt': return f(Math.sqrt); case 'cbrt': return f(Math.cbrt);
          case 'round': { const x = Number(a[0].v); if (a[0].t === 'float') return I(Math.floor(x + 0.5)); if (Number.isNaN(x)) return L(0); return castTo('long', D(Math.floor(x + 0.5))); }
          case 'floor': return f(Math.floor); case 'ceil': return f(Math.ceil); case 'rint': return f(x => { const r = Math.round(x); return (Math.abs(x % 1) === 0.5 && r % 2 !== 0) ? r - 1 : r; });
          case 'random': return D(Math.random()); case 'signum': return f(Math.sign); case 'sin': return f(Math.sin); case 'cos': return f(Math.cos); case 'tan': return f(Math.tan); case 'log': return f(Math.log); case 'log10': return f(Math.log10); case 'exp': return f(Math.exp); case 'atan': return f(Math.atan); case 'toRadians': return f(x => x / 180 * Math.PI); case 'toDegrees': return f(x => x * 180 / Math.PI);
          case 'hypot': return D(Math.hypot(Number(a[0].v), Number(a[1].v)));
          case 'floorDiv': { const k = kindOf(a[0]) === 'long' || kindOf(a[1]) === 'long'; const x = BigInt(a[0].v), y = BigInt(a[1].v); if (y === 0n) throw jex('ArithmeticException', '/ by zero'); let q = x / y; if ((x % y !== 0n) && ((x < 0n) !== (y < 0n))) q -= 1n; return k ? L(q) : I(Number(q)); }
          case 'floorMod': { const k = kindOf(a[0]) === 'long' || kindOf(a[1]) === 'long'; const x = BigInt(a[0].v), y = BigInt(a[1].v); if (y === 0n) throw jex('ArithmeticException', '/ by zero'); let r = x % y; if (r !== 0n && ((r < 0n) !== (y < 0n))) r += y; return k ? L(r) : I(Number(r)); }
          case 'addExact': case 'subtractExact': case 'multiplyExact': { const isL = kindOf(a[0]) === 'long' || kindOf(a[1]) === 'long'; const x = BigInt(a[0].v), y = BigInt(a[1].v); const r = name === 'addExact' ? x + y : name === 'subtractExact' ? x - y : x * y; const lim = isL ? 63n : 31n; if (r >= (1n << lim) || r < -(1n << lim)) throw jex('ArithmeticException', (isL ? 'long' : 'integer') + ' overflow'); return isL ? L(r) : I(Number(r)); }
          case 'toIntExact': { const r = BigInt(a[0].v); if (r > 2147483647n || r < -2147483648n) throw jex('ArithmeticException', 'integer overflow'); return I(Number(r)); }
        } break;
      }
      case 'Integer': case 'Long': case 'Double': case 'Float': case 'Short': case 'Byte': {
        const big = cn === 'Long', isD = cn === 'Double' || cn === 'Float';
        switch (name) {
          case 'parseInt': case 'parseLong': case 'valueOf': case 'parseDouble': case 'parseFloat': case 'parseShort': case 'parseByte': {
            const x = a[0]; if (x.t !== 'String' && x.t !== 'null') return coerce(cn, 0, isNumV(x) ? castTo(WRAP[cn], x) : x); if (x.t === 'null') throw jex('NumberFormatException', isD ? 'null' : 'Cannot parse null string: null');
            const s = x.v, radix = a.length > 1 ? a[1].v : 10;
            if (isD) { const tt = s.trim(); if (tt === '') throw jex('NumberFormatException', s.length ? 'empty String' : 'empty String'); if (!/^[+-]?(NaN|Infinity|(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[fFdD]?)$/.test(tt)) throw jex('NumberFormatException', 'For input string: "' + s + '"'); const v = parseFloat(tt.replace(/[fFdD]$/, '')); return cn === 'Float' ? F(v) : D(v); }
            const re = radix === 10 ? /^[+-]?\d+$/ : /^[+-]?[0-9a-zA-Z]+$/; const suffix = radix === 10 ? '' : ' under radix ' + radix;
            if (!re.test(s)) throw jex('NumberFormatException', 'For input string: "' + s + '"' + suffix);
            let v; if (radix === 10) v = BigInt(s); else { const neg = s[0] === '-'; const body = s.replace(/^[+-]/, ''); v = 0n; for (const ch of body) { const dgt = parseInt(ch, radix); if (Number.isNaN(dgt)) throw jex('NumberFormatException', 'For input string: "' + s + '"' + suffix); v = v * BigInt(radix) + BigInt(dgt); } if (neg) v = -v; }
            const lim = big ? 63n : cn === 'Short' ? 15n : cn === 'Byte' ? 7n : 31n;
            if (v >= (1n << lim) || v < -(1n << lim)) throw jex('NumberFormatException', (cn === 'Short' || cn === 'Byte') ? 'Value out of range. Value:"' + s + '" Radix:10' : 'For input string: "' + s + '"' + suffix);
            return big ? L(v) : I(Number(v));
          }
          case 'toString': return ST(toStr(a[0])); case 'compare': return I(Number(a[0].v) < Number(a[1].v) ? -1 : Number(a[0].v) > Number(a[1].v) ? 1 : 0);
          case 'sum': return arith('+', a[0], a[1]); case 'max': return staticCall('Math', 'max', a, n); case 'min': return staticCall('Math', 'min', a, n);
          case 'isNaN': return B(Number.isNaN(a[0].v)); case 'isInfinite': return B(!isFinite(a[0].v) && !Number.isNaN(a[0].v));
          case 'toBinaryString': return ST((a[0].t === 'long' ? BigInt.asUintN(64, a[0].v) : BigInt(a[0].v >>> 0)).toString(2)); case 'toHexString': return ST((a[0].t === 'long' ? BigInt.asUintN(64, a[0].v) : BigInt(a[0].v >>> 0)).toString(16));
          case 'signum': return I(Math.sign(a[0].v));
        } break;
      }
      case 'Boolean': if (name === 'parseBoolean' || name === 'valueOf') return B(a[0].t === 'String' && a[0].v.toLowerCase() === 'true'); if (name === 'toString') return ST(toStr(a[0])); break;
      case 'Character': { const ch = String.fromCharCode(a[0].v);
        switch (name) { case 'isDigit': return B(/\d/.test(ch)); case 'isLetter': return B(/\p{L}/u.test(ch)); case 'isLetterOrDigit': return B(/[\p{L}\d]/u.test(ch)); case 'isUpperCase': return B(/\p{Lu}/u.test(ch)); case 'isLowerCase': return B(/\p{Ll}/u.test(ch)); case 'isWhitespace': case 'isSpaceChar': return B(/\s/.test(ch)); case 'toUpperCase': return a[0].t === 'char' ? C(ch.toUpperCase().charCodeAt(0)) : I(ch.toUpperCase().charCodeAt(0)); case 'toLowerCase': return a[0].t === 'char' ? C(ch.toLowerCase().charCodeAt(0)) : I(ch.toLowerCase().charCodeAt(0)); case 'getNumericValue': return I(/\d/.test(ch) ? +ch : /[a-zA-Z]/.test(ch) ? parseInt(ch, 36) : -1); case 'toString': case 'valueOf': return name === 'valueOf' ? a[0] : ST(ch); case 'compare': return I(a[0].v - a[1].v); } break; }
      case 'String': switch (name) {
        case 'valueOf': case 'copyValueOf': return a[0].t === 'array' ? ST(a[0].a.map(c => String.fromCharCode(c.v)).join('')) : ST(toStr(a[0]));
        case 'format': { let loc = 'ES', x = a; if (x[0].t === 'obj' && x[0].kind === 'Locale') { loc = x[0].name; x = x.slice(1); } return ST(formatJava(rt, x[0].v, x.slice(1), loc)); }
        case 'join': { const parts = a.length === 2 && a[1].t === 'array' ? a[1].a : a.length === 2 && a[1].nat === 'List' ? a[1].a : a.slice(1); return ST(parts.map(toStr).join(a[0].v)); }
      } break;
      case 'System': switch (name) { case 'currentTimeMillis': return L(Date.now()); case 'nanoTime': return L(BigInt(Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) * 1e6))); case 'exit': throw { exit: a[0].v }; case 'lineSeparator': return ST('\n'); case 'identityHashCode': return I(7); case 'gc': return NULL; case 'getProperty': return NULL; } break;
      case 'Thread': if (name === 'sleep') return NULL; break;
      case 'Objects': switch (name) { case 'equals': return B(a[0].t === 'null' ? a[1].t === 'null' : valEquals(a[0], a[1])); case 'isNull': return B(a[0].t === 'null'); case 'nonNull': return B(a[0].t !== 'null'); case 'toString': return ST(toStr(a[0])); case 'requireNonNull': if (a[0].t === 'null') throw jex('NullPointerException', a[1] ? a[1].v : undefined); return a[0]; case 'hash': return I(a.reduce((h, x) => (Math.imul(h, 31) + (x.t === 'null' ? 0 : (x.t === 'String' ? strMethod(x, 'hashCode', [], n).v : Number(x.v) | 0))) | 0, 1)); } break;
      case 'Arrays': switch (name) {
        case 'toString': { if (a[0].t === 'null') return ST('null'); return ST('[' + a[0].a.map(toStr).join(', ') + ']'); }
        case 'deepToString': { const f = x => x.t === 'array' ? '[' + x.a.map(f).join(', ') + ']' : toStr(x); return ST(f(a[0])); }
        case 'sort': { const arr = a[0]; const cmp = arr.et === 'String' ? (x, y) => (x.v < y.v ? -1 : x.v > y.v ? 1 : 0) : (x, y) => (Number(x.v) < Number(y.v) ? -1 : Number(x.v) > Number(y.v) ? 1 : 0); arr.a.sort(cmp); return NULL; }
        case 'fill': a[0].a.fill(null).forEach((_, i) => { a[0].a[i] = coerce(a[0].et, a[0].dims - 1, a[1]); }); return NULL;
        case 'equals': return B(a[0].a.length === a[1].a.length && a[0].a.every((x, i) => valEquals(x, a[1].a[i])));
        case 'copyOf': { const k = needInt(a[1]); const r = a[0].a.slice(0, k); while (r.length < k) r.push(defaultVal(a[0].et, a[0].dims - 1)); return { t: 'array', et: a[0].et, dims: a[0].dims, a: r }; }
        case 'asList': return { t: 'obj', nat: 'List', a: a.length === 1 && a[0].t === 'array' ? a[0].a.slice() : a.slice() };
      } break;
      case 'LocalDate': switch (name) {
        case 'of': { const y = needInt(a[0]), m = a[1].t === 'obj' ? a[1].n : needInt(a[1]), d = needInt(a[2]); if (m < 1 || m > 12) throw jex('DateTimeException', 'Invalid value for MonthOfYear (valid values 1 - 12): ' + m); if (d < 1 || d > 31) throw jex('DateTimeException', 'Invalid value for DayOfMonth (valid values 1 - 28/31): ' + d); if (d > mlen(y, m)) throw jex('DateTimeException', d === 29 ? "Invalid date 'February 29' as '" + y + "' is not a leap year" : "Invalid date '" + MONTHS[m - 1] + ' ' + d + "'"); return mkDate(toEpoch(y, m, d)); }
        case 'now': { const dt = new Date(); return mkDate(toEpoch(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())); }
        case 'parse': { const [y, m, d] = parseDate(rt, a[0].v, a[1] ? a[1].pat : null); return mkDate(toEpoch(y, m, d)); }
        case 'ofEpochDay': return mkDate(Number(a[0].v));
      } break;
      case 'DateTimeFormatter': if (name === 'ofPattern') return { t: 'obj', nat: 'Fmt', pat: a[0].v, loc: a[1] && a[1].kind === 'Locale' ? a[1].name : 'ES' }; break;
      case 'Locale': if (name === 'forLanguageTag') return mkEnum('Locale', /^es/i.test(a[0].v) ? 'ES' : 'US'); break;
      case 'List': case 'Map': case 'Set': case 'Optional': case 'Files': case 'Paths': throw unsup('la clase ' + cn, n.line);
    }
    if (!KNOWN_CLASSES.has(cn) && !userCls.has(cn)) throw cerr('cannot find symbol: variable ' + cn, n.line);
    throw cerr('cannot find symbol: method ' + name + ' en ' + cn, n.line);
  }

  /* ---- sentencias ---- */
  function execBlock(list, fr, noScope) {
    const old = fr.sc; if (!noScope) fr.sc = new Scope(old);
    try { for (const s of list) { const sig = exec(s, fr); if (sig) return sig; } return null; } finally { fr.sc = old; }
  }
  function declare(fr, name, ty, dims, final, v, line) {
    for (let s = fr.sc; s; s = s.p) if (s.m.has(name) && (s === fr.sc || !s.isMethodRoot)) { if (s.m.has(name)) throw cerr('variable ' + name + ' is already defined in method ' + (fr.method ? fr.method.name : 'main') + '(...)', line); }
    fr.sc.m.set(name, { ty, dims, v, final, assigned: v !== undefined });
  }
  function exec(s, fr) {
    curLine = s.line; tick(s.line);
    switch (s.k) {
      case 'decl':
        for (const d of s.decls) {
          let v;
          if (d.init) { v = d.init.k === 'arrinit' ? evalArrInit(d.init, fr, s.type, d.dims) : ev(d.init, fr); curLine = s.line; if (s.type === 'var') { v = v; s.type = 'var'; } else v = coerce(s.type, d.dims, v); }
          declare(fr, d.name, s.type === 'var' ? (v ? tname(v) : 'var') : s.type, d.dims, s.final, v, d.line);
        } return null;
      case 'expr': ev(s.e, fr); return null;
      case 'block': return labeled(s, fr, () => execBlock(s.body, fr));
      case 'seq': return execBlock(s.body, fr, true);
      case 'empty': return null;
      case 'if': { if (cond(ev(s.c, fr))) return exec(s.a, fr); else if (s.b) return exec(s.b, fr); return null; }
      case 'while': return labeled(s, fr, () => { while (cond(ev(s.c, fr))) { tick(s.line); const sig = exec(s.body, fr); if (sig) { if (sig.t === 'break' && (!sig.label || sig.label === s.label)) break; if (sig.t === 'continue' && (!sig.label || sig.label === s.label)) continue; return sig; } } return null; });
      case 'dowhile': return labeled(s, fr, () => { do { tick(s.line); const sig = exec(s.body, fr); if (sig) { if (sig.t === 'break' && (!sig.label || sig.label === s.label)) break; if (sig.t === 'continue' && (!sig.label || sig.label === s.label)) continue; return sig; } } while (cond(ev(s.c, fr))); return null; });
      case 'for': {
        const old = fr.sc; fr.sc = new Scope(old);
        try {
          for (const i of s.init) exec(i, fr);
          while (s.c ? cond(ev(s.c, fr)) : true) {
            tick(s.line); const sig = exec(s.body, fr);
            if (sig) { if (sig.t === 'break' && (!sig.label || sig.label === s.label)) break; if (!(sig.t === 'continue' && (!sig.label || sig.label === s.label))) return sig; }
            for (const u of s.upd) ev(u, fr);
          }
          return null;
        } finally { fr.sc = old; }
      }
      case 'foreach': {
        const it = ev(s.it, fr); if (it.t === 'null') throw jex('NullPointerException', 'Cannot iterate because ' + describe(s.it) + ' is null');
        const items = it.t === 'array' ? it.a.slice() : it.nat === 'List' ? it.a.slice() : (() => { throw cerr('for-each not applicable to expression type', s.line); })();
        const old = fr.sc;
        try { for (const x of items) { tick(s.line); fr.sc = new Scope(old); declare(fr, s.name, s.type, 0, false, coerce(s.type, 0, x), s.line); const sig = exec(s.body, fr); if (sig) { if (sig.t === 'break' && (!sig.label || sig.label === s.label)) break; if (sig.t === 'continue' && (!sig.label || sig.label === s.label)) continue; return sig; } } return null; } finally { fr.sc = old; }
      }
      case 'switch': return execSwitch(s, fr, false);
      case 'break': return { t: 'break', label: s.label }; case 'continue': return { t: 'continue', label: s.label };
      case 'return': { if (fr.method && fr.method.ret && fr.method.ret.name === 'void' && s.e) throw cerr('incompatible types: unexpected return value', s.line); return { t: 'return', v: s.e ? ev(s.e, fr) : null }; }
      case 'yieldx': return { t: 'yield', v: ev(s.e, fr) };
      case 'throw': { const v = ev(s.e, fr); if (v.t === 'null') throw jex('NullPointerException', 'Cannot throw exception because value is null'); if (!(v.t === 'obj' && v.cls && isThrowable(v.cls))) throw cerr('incompatible types: ' + tname(v) + ' cannot be converted to Throwable', s.line); curLine = s.line; v.line = s.line; throw new JThrow(v); }
      case 'assert': { if (opts.assertions) { if (!cond(ev(s.c, fr))) { const o = { t: 'obj', cls: bcls('AssertionError'), f: { __msg: s.m ? ST(toStr(ev(s.m, fr))) : NULL }, line: s.line }; throw new JThrow(o); } } return null; }
      case 'try': return execTry(s, fr);
    }
    throw unsup('la sentencia ' + s.k, s.line);
  }
  function labeled(s, fr, f) { const sig = f(); if (sig && sig.t === 'break' && sig.label && sig.label === s.label) return null; return sig; }
  function execTry(s, fr) {
    const old = fr.sc; fr.sc = new Scope(old); let sig = null, pending = null; const opened = [];
    try {
      try {
        for (const d of s.res) { exec(d, fr); opened.push(fr.sc.get(d.decls[0].name).v); }
        sig = execBlock(s.body.body, fr);
      } finally { for (let i = opened.length - 1; i >= 0; i--) if (opened[i].nat === 'Scanner') opened[i].closed = true; }
    } catch (e) {
      if (!(e instanceof JThrow)) { if (e instanceof RangeError) e = jex('StackOverflowError'); else throw e; }
      const exc = e.obj; let handled = false;
      for (const c of s.catches) {
        if (c.types.some(tn => chainHas(exc.cls, tn) || tn === 'Throwable')) {
          handled = true; fr.sc = new Scope(old);
          try { fr.sc.m.set(c.name, { ty: 'Exception', dims: 0, v: exc, final: false, assigned: true }); sig = execBlock(c.body.body, fr); } catch (e2) { pending = e2; }
          break;
        }
      }
      if (!handled) pending = e;
    } finally { fr.sc = old; }
    if (s.fin) { const fs = execBlock(s.fin.body, fr); if (fs) return fs; }
    if (pending) throw pending;
    return sig;
  }
  function matchLabel(sel, v) { if (sel.t === 'String') return v.t === 'String' && v.v === sel.v; if (sel.t === 'obj') return false; return isNumV(v) && Number(v.v) === Number(sel.v); }
  function execSwitch(s, fr, isExpr) {
    const sel = ev(s.sel, fr); if (sel.t === 'null') throw jex('NullPointerException', 'Cannot invoke "String.hashCode()" because ' + describe(s.sel) + ' is null');
    if (sel.t === 'double' || sel.t === 'float' || sel.t === 'boolean' || sel.t === 'long') throw cerr('constant label of type ' + sel.t + ' is not allowed in switch', s.line);
    const cases = s.sw.cases; let start = -1, def = -1;
    for (let i = 0; i < cases.length && start < 0; i++) { if (cases[i].isDefault) def = i; for (const l of cases[i].labels) { const lv = ev(l, fr); if (matchLabel(sel, lv)) { start = i; break; } } }
    if (start < 0) start = def;
    const old = fr.sc; fr.sc = new Scope(old);
    try {
      if (start < 0) { if (isExpr) throw jex('MatchException', null); return null; }
      if (s.sw.arrow) {
        const body = cases[start].body; const sig = exec(body, fr);
        if (isExpr) { if (sig && sig.t === 'yield') return sig.v; if (sig) return sig; throw cerr('switch rule completes without providing a value', s.line); }
        if (sig && sig.t === 'yield') return null; if (sig && sig.t === 'break' && !sig.label) return null; return sig;
      }
      for (let i = start; i < cases.length; i++) { const sig = exec(cases[i].body, fr); if (sig) { if (isExpr && sig.t === 'yield') return sig.v; if (sig.t === 'break' && !sig.label && !isExpr) return null; return sig; } }
      return null;
    } finally { fr.sc = old; }
  }

  /* ---- arranque ---- */
  let mainName = 'Main'; let error = null, uncaught = false;
  try {
    let mainCls = null, mainM = null;
    for (const c of classes) { const m = c.methods.find(x => x.name === 'main' && x.static && x.params.length === 1); if (m && (!mainCls || c.name !== 'Main')) { mainCls = userCls.get(c.name); mainM = m; if (!c.abstract) break; } }
    if (!mainCls) { const c0 = classes[0]; const m0 = c0.methods.find(x => x.name === 'main'); if (m0 && !m0.static) throw cerr('non-static method main cannot be referenced: falta "static" en main', m0.line); throw new SimError('compile', 'error: no se encuentra el método main: public static void main(String[] args)', 1); }
    mainName = mainCls.name; staticInit(mainCls);
    try { invoke(mainM, mainCls, null, [{ t: 'array', et: 'String', dims: 1, a: [] }]); }
    catch (e) { if (e instanceof RangeError) e = jex('StackOverflowError'); throw e; }
  } catch (e) {
    if (e instanceof JThrow) { uncaught = true; const o = e.obj; write('Exception in thread "main" ' + toStr(o) + '\n\tat ' + mainName + '.main(' + mainName + '.java:' + o.line + ')\n', true); error = { kind: 'runtime', msg: toStr(o), line: o.line }; }
    else if (e && e.exit !== undefined) { /* System.exit */ }
    else if (e instanceof SimError) { if (e.kind === 'compile' || e.kind === 'unsupported') out.length = 0; error = { kind: e.kind, msg: e.message, line: e.line }; }
    else throw e;
  }
  return { out, error, ok: !error && !uncaught, uncaught, text: out.map(o => o.s).join('') };
}

root.JavaSim = { run };
if (typeof module !== 'undefined' && module.exports) module.exports = root.JavaSim;
})(typeof window !== 'undefined' ? window : globalThis);
