/* Utilidades: DOM, markdown mínimo, resaltado de Java, comparación de salidas. Sin dependencias. */
(function (w) {
'use strict';

function h(tag, attrs) {
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k]; if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v; else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(el.dataset, v); else if (v === true) el.setAttribute(k, ''); else el.setAttribute(k, v);
  }
  for (let i = 2; i < arguments.length; i++) add(el, arguments[i]);
  return el;
}
function add(el, c) { if (c === null || c === undefined || c === false) return; if (Array.isArray(c)) c.forEach(x => add(el, x)); else if (c instanceof Node) el.appendChild(c); else el.appendChild(document.createTextNode(String(c))); }
function vaciar(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---- markdown mínimo: **negrita**, *cursiva*, `código`, [texto](https://...), listas, citas, #### títulos ---- */
function inline(s) {
  return s.split(/(`[^`]+`)/g).map((part, i) => {
    if (i % 2 === 1) return '<code>' + esc(part.slice(1, -1)) + '</code>';
    let t = esc(part);
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|#[^)\s]*)\)/g, (m, a, u) => '<a href="' + u + '" target="' + (u[0] === '#' ? '_self' : '_blank') + '" rel="noopener noreferrer">' + a + '</a>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*([^*\s][^*]*)\*(?!\w)/g, '$1<em>$2</em>');
    return t;
  }).join('');
}
function md(src) {
  if (src === undefined || src === null) return '';
  const lines = String(src).replace(/\r/g, '').split('\n'); const out = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (/^\s*```/.test(l)) { const code = []; i++; while (i < lines.length && !/^\s*```/.test(lines[i])) { code.push(lines[i]); i++; } i++; out.push('<pre class="codigo"><code>' + hl(code.join('\n')) + '</code></pre>'); continue; }
    if (/^#{3,4}\s/.test(l)) { out.push('<h4>' + inline(l.replace(/^#+\s/, '')) + '</h4>'); i++; continue; }
    if (/^\s*[-*]\s+/.test(l)) { const it = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { let t = lines[i].replace(/^\s*[-*]\s+/, ''); i++; while (i < lines.length && /^\s{2,}\S/.test(lines[i])) { t += ' ' + lines[i].trim(); i++; } it.push('<li>' + inline(t) + '</li>'); } out.push('<ul>' + it.join('') + '</ul>'); continue; }
    if (/^\s*\d+[.)]\s+/.test(l)) { const it = []; while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { let t = lines[i].replace(/^\s*\d+[.)]\s+/, ''); i++; while (i < lines.length && /^\s{2,}\S/.test(lines[i])) { t += ' ' + lines[i].trim(); i++; } it.push('<li>' + inline(t) + '</li>'); } out.push('<ol>' + it.join('') + '</ol>'); continue; }
    if (/^>\s?/.test(l)) { const q = []; while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, '')); i++; } out.push('<blockquote>' + inline(q.join(' ')) + '</blockquote>'); continue; }
    const p = []; while (i < lines.length && lines[i].trim() && !/^(#{3,4}\s|\s*[-*]\s+|\s*\d+[.)]\s+|>\s?|\s*```)/.test(lines[i])) { p.push(lines[i].trim()); i++; }
    out.push('<p>' + inline(p.join(' ')) + '</p>');
  }
  return out.join('\n');
}
const mdEl = (src, cls) => h('div', { class: 'md ' + (cls || ''), html: md(src) });

/* ---- resaltado de Java ---- */
const KW = new Set('abstract assert boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long new null package private protected public return short static super switch this throw throws try void while var true false yield'.split(' '));
function hl(code) {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)')|(\b\d[\d_]*\.?\d*(?:[eE][+-]?\d+)?[LlFfDd]?\b)|(\b[A-Za-z_$][\w$]*\b)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index)); last = re.lastIndex;
    if (m[1]) out += '<span class="hc">' + esc(m[1]) + '</span>';
    else if (m[2]) out += '<span class="hs">' + esc(m[2]) + '</span>';
    else if (m[3]) out += '<span class="hn">' + esc(m[3]) + '</span>';
    else { const id = m[4]; const next = code[re.lastIndex]; if (KW.has(id)) out += '<span class="hk">' + id + '</span>'; else if (/^[A-Z]/.test(id)) out += '<span class="ht">' + id + '</span>'; else if (next === '(') out += '<span class="hf">' + id + '</span>'; else out += id; }
  }
  return out + esc(code.slice(last));
}

/* ---- comparación de textos de salida ---- */
const norm = s => String(s).replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
const normSp = s => String(s).trim().replace(/\s+/g, ' ');

function copiar(text, btn) {
  const ok = () => { if (btn) { const t = btn.textContent; btn.textContent = '✓ Copiado'; setTimeout(() => { btn.textContent = t; }, 1600); } };
  if (navigator.clipboard && window.isSecureContext !== false) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
  function fallback() { const ta = h('textarea', { style: 'position:fixed;opacity:0' }); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) { if (btn) btn.textContent = 'Selecciona y copia a mano'; } ta.remove(); }
}
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

w.U = { h, add, vaciar, esc, md, mdEl, hl, norm, normSp, copiar, shuffle, slug };
})(window);
