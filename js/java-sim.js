/* Simulador de Java (subconjunto) — sin dependencias. Se ejecuta en el navegador y en Node.
 * Cubre lo que se usa en UT1-UT3: tipos, operadores, String, Math, Scanner, Random, LocalDate,
 * if/switch/bucles, excepciones, aserciones, arrays, ArrayList y clases sencillas.
 * Lo que no soporta lo dice con un mensaje claro: no inventa resultados. */
(function (root) {
'use strict';

class SimError extends Error { constructor(kind, msg, line) { super(msg); this.kind = kind; this.line = line || 0; } }
const cerr = (msg, line) => new SimError('compile', msg, line);
const unsup = (what, line) => new SimError('unsupported', 'El simulador no soporta ' + what + '. Pruébalo en tu IDE.', line);

/* ============================ TOKENIZADOR ============================ */
const OPS = ['>>>=', '<<=', '>>=', '>>>', '...', '->', '::', '++', '--', '&&', '||', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<', '>>'];
function tokenize(src) {
  const toks = []; let i = 0, line = 1; const n = src.length;
  const push = (k, v, extra) => toks.push(Object.assign({ k, v, line }, extra || {}));
  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') line++; i++; } i += 2; continue; }
    if (/[A-Za-z_$À-￿]/.test(c)) { let j = i + 1; while (j < n && /[\w$À-￿]/.test(src[j])) j++; push('id', src.slice(i, j)); i = j; continue; }
    if (/\d/.test(c) || (c === '.' && /\d/.test(src[i + 1] || ''))) {
      const m = /^(0[xX][0-9a-fA-F_]+|0[bB][01_]+|(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?)([lLfFdD]?)/.exec(src.slice(i));
      let body = m[1].replace(/_/g, ''), suf = m[2].toLowerCase(), t;
      const hex = /^0[xXbB]/.test(body);
      if (suf === 'l') t = 'long'; else if (suf === 'f') t = 'float'; else if (suf === 'd' || (!hex && /[.eE]/.test(body))) t = 'double'; else t = 'int';
      let v;
      if (t === 'int' || t === 'long') {
        v = hex ? BigInt(body) : BigInt(body);
        if (t === 'int') { if (v > 2147483648n || (hex && v > 0xFFFFFFFFn)) throw cerr('integer number too large', line); if (hex && v > 2147483647n) v = BigInt.asIntN(32, v); v = Number(v); }
      } else v = parseFloat(body);
      push('num', v, { nt: t }); i += m[0].length; continue;
    }
    if (c === '"') {
      if (src.startsWith('"""', i)) throw unsup('los bloques de texto """', line);
      let j = i + 1, s = '';
      while (j < n && src[j] !== '"') {
        if (src[j] === '\n') throw cerr('unclosed string literal', line);
        if (src[j] === '\\') { const e = src[j + 1]; j += 2;
          if (e === 'n') s += '\n'; else if (e === 't') s += '\t'; else if (e === 'r') s += '\r'; else if (e === '0') s += '\0'; else if (e === 'b') s += '\b'; else if (e === 'f') s += '\f';
          else if (e === 'u') { s += String.fromCharCode(parseInt(src.substr(j, 4), 16)); j += 4; }
          else if (e === '"' || e === '\\' || e === "'") s += e; else throw cerr('illegal escape character', line);
        } else s += src[j++];
      }
      if (j >= n) throw cerr('unclosed string literal', line);
      push('str', s); i = j + 1; continue;
    }
    if (c === "'") {
      let j = i + 1, ch;
      if (src[j] === '\\') { const e = src[j + 1]; j += 2; ch = e === 'n' ? '\n' : e === 't' ? '\t' : e === 'r' ? '\r' : e === '0' ? '\0' : e === 'u' ? (j += 4, String.fromCharCode(parseInt(src.substr(j - 4, 4), 16))) : e; }
      else { ch = src[j]; j++; }
      if (src[j] !== "'") throw cerr('unclosed character literal', line);
      push('chr', ch.charCodeAt(0)); i = j + 1; continue;
    }
    let op = OPS.find(o => src.startsWith(o, i));
    if (!op) op = c;
    push('op', op); i += op.length;
  }
  toks.push({ k: 'eof', v: '<EOF>', line });
  return toks;
}

/* ============================== PARSER ============================== */
const PRIM = new Set(['int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short']);
const MODS = new Set(['public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized', 'native', 'transient', 'volatile']);
const KEYW = new Set(['if', 'else', 'while', 'do', 'for', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'throws', 'new', 'class', 'interface', 'extends', 'implements', 'import', 'package', 'this', 'super', 'null', 'true', 'false', 'assert', 'void', 'instanceof', 'enum', 'static', 'final']);

function parse(src) {
  const T = tokenize(src); let p = 0;
  const peek = (o = 0) => T[Math.min(p + o, T.length - 1)];
  const is = (v, o = 0) => { const t = peek(o); return (t.k === 'op' || t.k === 'id') && t.v === v; };
  const isOp = (v, o = 0) => { const t = peek(o); return t.k === 'op' && t.v === v; };
  const err = (msg, t) => cerr(msg, (t || peek()).line);
  const prevLine = () => (p > 0 ? T[p - 1].line : 1);
  const expect = (v) => {
    if (is(v)) return T[p++];
    if (v === ';' || v === ')' || v === ']' || v === '}' || v === '(' || v === '{') throw cerr("'" + v + "' expected", v === ';' || v === ')' ? prevLine() : peek().line);
    throw err("'" + v + "' expected");
  };
  const accept = (v) => { if (is(v)) { p++; return true; } return false; };
  const ident = () => { const t = peek(); if (t.k !== 'id' || (KEYW.has(t.v) && t.v !== 'var')) throw err('<identifier> expected', t.k === 'id' ? t : { line: prevLine() }); p++; return t.v; };

  function skipGenerics() {
    if (!isOp('<')) return; let d = 0;
    do { const t = peek(); if (t.k === 'eof') throw err('> expected'); if (isOp('<')) d++; else if (isOp('>')) d--; else if (isOp('>>')) d -= 2; p++; } while (d > 0);
  }
  function parseType() {
    const t = peek(); if (t.k !== 'id') throw err('<identifier> expected');
    let name;
    if (PRIM.has(t.v) || t.v === 'void' || t.v === 'var') { p++; name = t.v; }
    else { if (KEYW.has(t.v)) throw err('illegal start of type'); name = ident(); while (isOp('.') && peek(1).k === 'id' && !KEYW.has(peek(1).v)) { p++; name = ident(); } skipGenerics(); }
    let dims = 0; while (isOp('[') && isOp(']', 1)) { p += 2; dims++; }
    return { name, dims };
  }
  function tryDeclStart() {
    const t = peek(); if (t.k !== 'id') return false;
    if (t.v === 'final' || PRIM.has(t.v) || (t.v === 'var' && peek(1).k === 'id')) return true;
    if (KEYW.has(t.v)) return false;
    const save = p;
    try { parseType(); const ok = peek().k === 'id' && !KEYW.has(peek().v) && (isOp('=', 1) || isOp(';', 1) || isOp(',', 1) || isOp(':', 1) || isOp('[', 1) || peek(1).k === 'eof' || peek(1).line > peek().line || (peek(1).k === 'id' && false)); p = save; return ok; }
    catch (e) { p = save; return false; }
  }

  /* ---------- expresiones ---------- */
  function parseExpr() { return parseAssign(); }
  const ASSIGN = new Set(['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>>=']);
  function parseAssign() {
    const left = parseTernary();
    const t = peek();
    if (t.k === 'op' && ASSIGN.has(t.v)) {
      if (!['name', 'field', 'index'].includes(left.k)) throw err('unexpected type', t);
      p++; const right = parseAssign();
      return { k: 'assign', op: t.v, left, right, line: t.line };
    }
    return left;
  }
  function parseTernary() {
    const c = parseBin(0);
    if (isOp('?')) { const line = peek().line; p++; const a = parseTernary(); expect(':'); const b = parseTernary(); return { k: 'cond', c, a, b, line }; }
    return c;
  }
  const LEVELS = [['||'], ['&&'], ['|'], ['^'], ['&'], ['==', '!='], ['<', '>', '<=', '>=', 'instanceof'], ['<<', '>>', '>>>'], ['+', '-'], ['*', '/', '%']];
  function parseBin(lv) {
    if (lv >= LEVELS.length) return parseUnary();
    let left = parseBin(lv + 1);
    for (;;) {
      const t = peek();
      if (!((t.k === 'op' || (t.k === 'id' && t.v === 'instanceof')) && LEVELS[lv].includes(t.v))) return left;
      p++;
      if (t.v === 'instanceof') { const ty = parseType(); let bind = null; if (peek().k === 'id' && !KEYW.has(peek().v)) bind = ident(); left = { k: 'instanceof', e: left, type: ty.name, bind, line: t.line }; continue; }
      const right = parseBin(lv + 1);
      left = { k: 'bin', op: t.v, l: left, r: right, line: t.line };
    }
  }
  function isCast() {
    if (!isOp('(')) return false;
    const t1 = peek(1);
    if (t1.k !== 'id') return false;
    if (PRIM.has(t1.v)) { let o = 2; while (isOp('[', o) && isOp(']', o + 1)) o += 2; return isOp(')', o); }
    if (!/^[A-Z]/.test(t1.v)) return false;
    const save = p; p++;
    try { parseType(); if (!isOp(')')) { p = save; return false; } p++; const t = peek(); const ok = t.k === 'str' || t.k === 'num' || t.k === 'chr' || (t.k === 'id' && !['instanceof'].includes(t.v)) || (t.k === 'op' && (t.v === '(' || t.v === '!' || t.v === '~')); p = save; return ok; }
    catch (e) { p = save; return false; }
  }
  function parseUnary() {
    const t = peek();
    if (t.k === 'op') {
      if (t.v === '-' || t.v === '+') {
        p++;
        if (t.v === '-' && peek().k === 'num' && peek().nt === 'int' && peek().v === 2147483648) { const n = peek(); p++; return { k: 'lit', t: 'int', v: -2147483648, line: n.line }; }
        const e = parseUnary(); return { k: 'unary', op: t.v, e, line: t.line };
      }
      if (t.v === '!' || t.v === '~') { p++; return { k: 'unary', op: t.v, e: parseUnary(), line: t.line }; }
      if (t.v === '++' || t.v === '--') { p++; const e = parseUnary(); return { k: 'incdec', op: t.v, prefix: true, e, line: t.line }; }
      if (isCast()) {
        p++; const ty = parseType(); expect(')'); const e = parseUnary(); return { k: 'cast', type: ty, e, line: t.line };
      }
    }
    return parsePostfix(parsePrimary());
  }
  function parseArgs() {
    expect('('); const a = [];
    if (!isOp(')')) { do { a.push(parseExpr()); } while (accept(',')); }
    expect(')'); return a;
  }
  function parsePostfix(e) {
    for (;;) {
      const t = peek();
      if (isOp('.')) {
        p++; const nameTok = peek(); if (nameTok.k !== 'id') throw err('<identifier> expected');
        const name = ident();
        if (isOp('(')) e = { k: 'call', obj: e, name, args: parseArgs(), line: nameTok.line };
        else e = { k: 'field', obj: e, name, line: nameTok.line };
      } else if (isOp('[')) { p++; const idx = parseExpr(); expect(']'); e = { k: 'index', obj: e, idx, line: t.line }; }
      else if (isOp('++') || isOp('--')) { p++; e = { k: 'incdec', op: t.v, prefix: false, e, line: t.line }; }
      else if (isOp('::')) throw unsup('las referencias a métodos (::)', t.line);
      else return e;
    }
  }
  function parseArrayInit(elemType) {
    const line = peek().line; expect('{'); const items = [];
    while (!isOp('}')) { items.push(isOp('{') ? parseArrayInit(elemType && elemType.dims > 1 ? { name: elemType.name, dims: elemType.dims - 1 } : elemType) : parseExpr()); if (!accept(',')) break; }
    expect('}'); return { k: 'arrinit', items, et: elemType, line };
  }
  function parseSwitchBody(isExpr) {
    expect('{'); const cases = []; let arrow = null;
    while (!isOp('}')) {
      const line = peek().line; const labels = []; let isDefault = false;
      if (accept('default')) isDefault = true;
      else { expect('case'); do { if (is('default')) { p++; isDefault = true; } else labels.push(parseTernary()); } while (accept(',')); }
      let body;
      if (isOp('->')) {
        p++; arrow = true;
        if (isOp('{')) body = { k: 'block', body: parseBlock().body, line };
        else if (is('throw')) body = parseStatement();
        else { const e = parseExpr(); expect(';'); body = { k: 'yieldx', e, line }; }
        cases.push({ labels, isDefault, body, line });
      } else {
        expect(':'); arrow = false; const stmts = [];
        while (!is('case') && !is('default') && !isOp('}')) stmts.push(parseStatement());
        cases.push({ labels, isDefault, body: { k: 'seq', body: stmts }, line });
      }
    }
    expect('}'); return { cases, arrow: !!arrow };
  }
  function parsePrimary() {
    const t = peek();
    if (t.k === 'num') { p++; return { k: 'lit', t: t.nt, v: t.v, line: t.line }; }
    if (t.k === 'str') { p++; return { k: 'lit', t: 'String', v: t.v, line: t.line }; }
    if (t.k === 'chr') { p++; return { k: 'lit', t: 'char', v: t.v, line: t.line }; }
    if (isOp('(')) { p++; const e = parseExpr(); expect(')'); return { k: 'paren', e, line: t.line }; }
    if (t.k === 'id') {
      if ((t.v === 'java' || t.v === 'javax') && isOp('.', 1)) { while (peek().k === 'id' && /^[a-z]/.test(peek().v) && isOp('.', 1)) p += 2; }
      if (peek().k === 'id' && peek().v !== t.v) return parsePrimary();
      if (t.v === 'true' || t.v === 'false') { p++; return { k: 'lit', t: 'boolean', v: t.v === 'true', line: t.line }; }
      if (t.v === 'null') { p++; return { k: 'lit', t: 'null', v: null, line: t.line }; }
      if (t.v === 'this') { p++; if (isOp('(')) return { k: 'ctorcall', which: 'this', args: parseArgs(), line: t.line }; return { k: 'this', line: t.line }; }
      if (t.v === 'super') { p++; if (isOp('(')) return { k: 'ctorcall', which: 'super', args: parseArgs(), line: t.line }; expect('.'); const name = ident(); if (isOp('(')) return { k: 'call', obj: { k: 'super' }, name, args: parseArgs(), line: t.line }; return { k: 'field', obj: { k: 'this' }, name, line: t.line }; }
      if (t.v === 'switch') { p++; expect('('); const sel = parseExpr(); expect(')'); const sw = parseSwitchBody(true); return { k: 'switchx', sel, sw, line: t.line }; }
      if (t.v === 'new') {
        p++; const ty = peek(); let name;
        if (PRIM.has(ty.v)) { p++; name = ty.v; } else { name = ident(); while (isOp('.')) { p++; name = ident(); } skipGenerics(); }
        if (isOp('[')) {
          const dimsE = []; let extra = 0;
          while (isOp('[')) { p++; if (isOp(']')) { p++; extra++; } else { dimsE.push(parseExpr()); expect(']'); } }
          const total = dimsE.length + extra;
          let init = null; if (isOp('{')) init = parseArrayInit({ name, dims: total });
          return { k: 'newarr', et: name, dimsE, total, init, line: t.line };
        }
        const args = parseArgs();
        if (isOp('{')) throw unsup('las clases anónimas', t.line);
        return { k: 'new', cls: name, args, line: t.line };
      }
      if (KEYW.has(t.v) && !['var'].includes(t.v)) throw err('illegal start of expression');
      p++;
      if (isOp('(')) return { k: 'call', obj: null, name: t.v, args: parseArgs(), line: t.line };
      return { k: 'name', name: t.v, line: t.line };
    }
    if (isOp('{')) throw err('illegal start of expression');
    if (t.k === 'eof') throw cerr('reached end of file while parsing', prevLine());
    throw err('illegal start of expression');
  }

  /* ---------- sentencias ---------- */
  function parseBlock() {
    const line = peek().line; expect('{'); const body = [];
    while (!isOp('}')) { if (peek().k === 'eof') throw cerr('reached end of file while parsing', prevLine()); body.push(parseStatement()); }
    expect('}'); return { k: 'block', body, line };
  }
  function parseVarDecl(noSemi) {
    const line = peek().line; let isFinal = false;
    while (is('final')) { p++; isFinal = true; }
    const ty = parseType(); const decls = [];
    do {
      const name = ident(); let dims = ty.dims; while (isOp('[') && isOp(']', 1)) { p += 2; dims++; }
      let init = null;
      if (accept('=')) init = isOp('{') ? parseArrayInit({ name: ty.name, dims }) : parseExpr();
      decls.push({ name, dims, init, line });
    } while (accept(','));
    if (!noSemi) expect(';');
    return { k: 'decl', type: ty.name, final: isFinal, decls, line };
  }
  function parseStatement() {
    const t = peek(); const line = t.line;
    if (isOp('{')) return parseBlock();
    if (isOp(';')) { p++; return { k: 'empty', line }; }
    if (t.k === 'id') {
      const v = t.v;
      if (isOp(':', 1) && !KEYW.has(v)) { p += 2; const st = parseStatement(); st.label = v; return st; }
      if (v === 'if') { p++; expect('('); const c = parseExpr(); expect(')'); const a = parseStatement(); let b = null; if (accept('else')) b = parseStatement(); return { k: 'if', c, a, b, line }; }
      if (v === 'while') { p++; expect('('); const c = parseExpr(); expect(')'); return { k: 'while', c, body: parseStatement(), line }; }
      if (v === 'do') { p++; const body = parseStatement(); expect('while'); expect('('); const c = parseExpr(); expect(')'); expect(';'); return { k: 'dowhile', c, body, line }; }
      if (v === 'for') {
        p++; expect('(');
        if (tryDeclStart()) {
          const save = p; let isFinal = false; while (is('final')) { p++; isFinal = true; }
          const ty = parseType();
          if (peek().k === 'id' && isOp(':', 1)) { const name = ident(); p++; const it = parseExpr(); expect(')'); return { k: 'foreach', type: ty.name, name, it, body: parseStatement(), line }; }
          p = save;
        }
        let init = [];
        if (!isOp(';')) { if (tryDeclStart()) init = [parseVarDecl(true)]; else { do { init.push({ k: 'expr', e: parseExpr(), line }); } while (accept(',')); } }
        expect(';'); const c = isOp(';') ? null : parseExpr(); expect(';');
        const upd = []; if (!isOp(')')) { do { upd.push(parseExpr()); } while (accept(',')); }
        expect(')'); return { k: 'for', init, c, upd, body: parseStatement(), line };
      }
      if (v === 'switch') { p++; expect('('); const sel = parseExpr(); expect(')'); const sw = parseSwitchBody(false); return { k: 'switch', sel, sw, line }; }
      if (v === 'break' || v === 'continue') { p++; let label = null; if (peek().k === 'id' && !isOp(';')) label = ident(); expect(';'); return { k: v, label, line }; }
      if (v === 'return') { p++; let e = null; if (!isOp(';')) e = parseExpr(); expect(';'); return { k: 'return', e, line }; }
      if (v === 'yield' && !isOp('=', 1) && !isOp('.', 1) && !isOp('(', 1)) { p++; const e = parseExpr(); expect(';'); return { k: 'yieldx', e, line }; }
      if (v === 'throw') { p++; const e = parseExpr(); expect(';'); return { k: 'throw', e, line }; }
      if (v === 'assert') { p++; const c = parseExpr(); let m = null; if (accept(':')) m = parseExpr(); expect(';'); return { k: 'assert', c, m, line }; }
      if (v === 'try') {
        p++; const res = [];
        if (accept('(')) { while (!isOp(')')) { const d = parseVarDecl(true); res.push(d); if (!accept(';')) break; } expect(')'); }
        const body = parseBlock(); const catches = []; let fin = null;
        while (is('catch')) { p++; expect('('); while (is('final')) p++; const types = [parseType().name]; while (accept('|')) types.push(parseType().name); const name = ident(); expect(')'); catches.push({ types, name, body: parseBlock() }); }
        if (accept('finally')) fin = parseBlock();
        if (!catches.length && !fin && !res.length) throw cerr("'try' without 'catch', 'finally' or resource declarations", line);
        return { k: 'try', res, body, catches, fin, line };
      }
      if (v === 'class' || v === 'interface' || v === 'enum') throw unsup('las clases locales', line);
      if (v === 'else') throw cerr("illegal start of expression", line);
      if (v === 'case' || v === 'default') throw cerr("orphaned " + v, line);
      if (tryDeclStart()) return parseVarDecl();
    }
    const e = parseExpr();
    if (!['assign', 'incdec', 'call', 'new', 'ctorcall'].includes(e.k)) throw cerr('not a statement', line);
    expect(';');
    return { k: 'expr', e, line };
  }

  /* ---------- clases ---------- */
  function parseModifiers() { const m = new Set(); for (;;) { const t = peek(); if (t.k === 'id' && MODS.has(t.v)) { m.add(t.v); p++; } else if (isOp('@') && peek(1).k === 'id') { p += 2; if (isOp('(')) { let d = 0; do { if (isOp('(')) d++; if (isOp(')')) d--; p++; } while (d > 0); } } else return m; } }
  function parseClass(isIface) {
    const mods = parseModifiers(); const line = peek().line;
    if (is('class')) p++; else if (is('interface')) { p++; isIface = true; } else if (is('enum')) throw unsup('los enum', line); else if (is('record')) throw unsup('los record', line); else throw err('class, interface, enum, or record expected');
    const name = ident(); skipGenerics(); let sup = null; const ifaces = [];
    if (accept('extends')) { sup = parseType().name; }
    if (accept('implements')) { do { ifaces.push(parseType().name); } while (accept(',')); }
    expect('{');
    const cls = { k: 'class', name, sup, ifaces, iface: !!isIface, fields: [], methods: [], ctors: [], line, abstract: mods.has('abstract') };
    while (!isOp('}')) {
      if (peek().k === 'eof') throw cerr('reached end of file while parsing', prevLine());
      if (isOp(';')) { p++; continue; }
      const m = parseModifiers(); const mline = peek().line;
      if (is('class') || is('interface')) throw unsup('las clases anidadas', mline);
      if (isOp('{')) throw unsup('los bloques de inicialización', mline);
      if (peek().k === 'id' && peek().v === name && isOp('(', 1)) {
        p++; const params = parseParams(); skipThrows(); const body = parseBlock(); cls.ctors.push({ params, body, line: mline }); continue;
      }
      skipGenerics();
      const ty = parseType(); const nameTok = peek(); const mname = ident();
      if (isOp('(')) {
        const params = parseParams(); skipThrows(); let body = null;
        if (isOp('{')) body = parseBlock(); else expect(';');
        cls.methods.push({ name: mname, params, body, static: m.has('static'), abstract: !body, ret: ty, line: nameTok.line });
      } else {
        let dims = ty.dims; while (isOp('[') && isOp(']', 1)) { p += 2; dims++; }
        let init = null; const decls = [];
        const one = () => { init = null; if (accept('=')) init = isOp('{') ? parseArrayInit({ name: ty.name, dims }) : parseExpr(); };
        one(); cls.fields.push({ name: mname, type: ty.name, dims, init, static: m.has('static') || cls.iface, final: m.has('final') || cls.iface, line: nameTok.line });
        while (accept(',')) { const n2 = ident(); one(); cls.fields.push({ name: n2, type: ty.name, dims, init, static: m.has('static'), final: m.has('final'), line: nameTok.line }); }
        expect(';');
      }
    }
    expect('}'); return cls;
  }
  function skipThrows() { if (accept('throws')) { do { parseType(); } while (accept(',')); } }
  function parseParams() {
    expect('('); const ps = [];
    if (!isOp(')')) { do { while (is('final')) p++; const ty = parseType(); let name = ident(); let dims = ty.dims; while (isOp('[') && isOp(']', 1)) { p += 2; dims++; } ps.push({ type: ty.name, dims, name }); } while (accept(',')); }
    expect(')'); return ps;
  }
  const classes = [];
  while (peek().k !== 'eof') {
    if (is('package') || is('import')) { while (!isOp(';')) { if (peek().k === 'eof') throw err("';' expected"); p++; } p++; continue; }
    if (isOp(';')) { p++; continue; }
    classes.push(parseClass());
  }
  if (!classes.length) throw cerr('class, interface, enum, or record expected', 1);
  return classes;
}

root.__JavaSimParse = { tokenize, parse, SimError, cerr, unsup };
})(typeof window !== 'undefined' ? window : globalThis);
