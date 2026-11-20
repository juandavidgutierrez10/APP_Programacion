/* Renderizadores de bloques de contenido. Cada tipo de bloque se documenta en GUIA_PROFESOR.md. */
(function (w) {
'use strict';
const { h, md, mdEl, hl, norm, normSp, copiar, shuffle } = U;

const hecho = (id, el) => { if (id) { Estado.marcar(id); document.dispatchEvent(new CustomEvent('progreso')); } if (el) el.classList.add('hecho'); };
const chip = (txt, cls) => h('span', { class: 'chip ' + (cls || '') }, txt);
function tarjeta(titulo, id, cls, icono) {
  const body = h('div', { class: 'tarjeta-body' });
  const el = h('section', { class: 'tarjeta ' + (cls || '') + (id && Estado.ok(id) ? ' hecho' : ''), 'aria-label': titulo }, h('header', { class: 'tarjeta-h' }, h('span', { class: 'ico', 'aria-hidden': 'true' }, icono || '✏️'), h('span', { class: 'tt' }, titulo), h('span', { class: 'ok-mark', title: 'Completado' }, '✓')), body);
  return { el, body };
}
function feedback(host, ok, html, extra) {
  let fb = host.querySelector(':scope > .fb'); if (!fb) { fb = h('div', { class: 'fb', role: 'status', 'aria-live': 'polite' }); host.appendChild(fb); }
  fb.className = 'fb ' + (ok === null ? 'info' : ok ? 'bien' : 'mal'); fb.innerHTML = '<strong>' + (ok === null ? '' : ok ? '✓ ' : '✗ ') + '</strong>' + html; return fb;
}
const boton = (txt, fn, cls) => h('button', { type: 'button', class: 'btn ' + (cls || ''), onclick: fn }, txt);

/* ---------------- prompt para IA externa ---------------- */
function construirPrompt(i) {
  const L = [];
  L.push('Actúa como un tutor de programación en Java para un alumno de 1.º de Desarrollo de Aplicaciones Web (ciclo formativo de grado superior, España). Tu objetivo es que el alumno APRENDA, no que copie una solución.');
  L.push('', 'CONTEXTO', '- Asignatura: Programación (1.º DAW)', '- Unidad y apartado: ' + i.unidad + ' · ' + i.seccion, '- Nivel de la app: ' + (i.modo === 'pro' ? 'Modo Pro (el alumno ya domina lo básico)' : 'Aprobar módulo (necesita explicaciones claras y paso a paso)'), '- Tipo de ejercicio: ' + i.tipo);
  L.push('', 'ENUNCIADO', i.enunciado.trim());
  if (i.respuesta) L.push('', i.codigo ? 'CÓDIGO / RESPUESTA DEL ALUMNO' : 'RESPUESTA DEL ALUMNO', i.codigo ? '```java\n' + i.respuesta.trim() + '\n```' : i.respuesta.trim());
  if (i.resultado) L.push('', 'RESULTADO DE LA COMPROBACIÓN AUTOMÁTICA', i.resultado.trim());
  if (i.esperado && i.esperado.length) { L.push('', 'QUÉ SE ESPERA (criterios de corrección)'); i.esperado.forEach(c => L.push('- ' + c)); }
  L.push('', 'CÓMO QUIERO QUE RESPONDAS',
    '1. Dime qué está bien y por qué.',
    '2. Señala los errores o carencias uno a uno, explicando la CAUSA, no solo la corrección.',
    '3. No me des la solución completa: dame pistas y hazme una o dos preguntas para que la encuentre yo. Solo si te la pido después, enséñamela.',
    '4. Si falta algún concepto, explícalo con un ejemplo corto en Java 21.',
    '5. Termina con una nota orientativa de 0 a 10 según los criterios y con qué debería repasar.',
    'Responde en español, de forma clara y breve.');
  return L.join('\n');
}
function panelIA(getInfo) {
  const salida = h('div', { class: 'ia-salida', hidden: true });
  const btn = boton('🤖 Generar prompt para una IA', () => {
    const txt = construirPrompt(getInfo()); vaciar(salida); salida.hidden = false;
    const ta = h('textarea', { class: 'ia-texto', readonly: true, rows: 10, 'aria-label': 'Prompt para copiar' }); ta.value = txt;
    salida.appendChild(h('div', { class: 'aviso-ia', role: 'note' }, h('strong', null, '⚠️ Antes de pegar nada en una IA externa: '), 'revisa el texto y quita cualquier ', h('strong', null, 'contraseña, clave, token o dato personal'), ' (tuyo o de otras personas). Este prompt solo debe contener tu ejercicio.'));
    salida.appendChild(ta);
    const bc = boton('📋 Copiar prompt', () => copiar(ta.value, bc), 'btn-primario'); salida.appendChild(h('div', { class: 'fila' }, bc, h('span', { class: 'peq' }, 'Pégalo en la IA que uses (ChatGPT, Claude, Gemini, Copilot…). La app no se conecta a ninguna IA.')));
  }, 'btn-ia');
  const vaciar = U.vaciar;
  return h('div', { class: 'panel-ia' }, btn, salida);
}

/* ---------------- editor / ejecución de Java ---------------- */
function editorJava(o) {
  const ta = h('textarea', { class: 'editor', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Editor de código Java', rows: Math.min(26, Math.max(6, (o.code || '').split('\n').length + 1)) });
  ta.value = o.code || '';
  ta.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); } });
  const usaScanner = /Scanner/.test(o.code || '') || o.stdin !== undefined || o.siempreEntrada;
  const stdin = h('textarea', { class: 'stdin', rows: 3, spellcheck: 'false', 'aria-label': 'Datos que escribirías por teclado', placeholder: 'Escribe aquí lo que teclearías, una línea por cada Enter' }); stdin.value = o.stdin || '';
  const ea = h('input', { type: 'checkbox', id: 'ea' + Math.random().toString(36).slice(2, 7) });
  const salida = h('pre', { class: 'salida', 'aria-live': 'polite' }, 'Pulsa «Ejecutar» para ver la salida.');
  function ejecutar(entrada) {
    if (!w.JavaSim) { salida.textContent = 'No se ha cargado el simulador.'; return null; }
    let r; try { r = JavaSim.run(ta.value, entrada !== undefined ? entrada : stdin.value, { assertions: ea.checked }); } catch (e) { salida.textContent = 'Error interno del simulador: ' + e.message; return null; }
    U.vaciar(salida);
    if (r.error && (r.error.kind === 'compile')) { salida.appendChild(h('span', { class: 'err' }, 'Error de compilación' + (r.error.line ? ' (línea ' + r.error.line + ')' : '') + ': ' + r.error.msg)); salida.classList.add('con-error'); }
    else if (r.error && r.error.kind === 'unsupported') { salida.appendChild(h('span', { class: 'aviso-sim' }, r.error.msg + (r.error.line ? ' (línea ' + r.error.line + ')' : ''))); }
    else { salida.classList.remove('con-error'); r.out.forEach(p => salida.appendChild(h('span', { class: p.err ? 'err' : '' }, p.s))); if (r.error && r.error.kind === 'limit') salida.appendChild(h('span', { class: 'err' }, '\n' + r.error.msg)); if (!r.out.length && !r.error) salida.appendChild(h('span', { class: 'tenue' }, '(el programa no ha mostrado nada)')); }
    return r;
  }
  const btnRun = boton('▶ Ejecutar', () => ejecutar(), 'btn-primario');
  const btnReset = boton('↺ Restaurar', () => { ta.value = o.code || ''; stdin.value = o.stdin || ''; U.vaciar(salida); salida.textContent = 'Pulsa «Ejecutar» para ver la salida.'; });
  const el = h('div', { class: 'editor-wrap' },
    o.titulo ? h('div', { class: 'cod-titulo' }, o.titulo) : null, ta,
    h('div', { class: 'fila barra-ed' }, btnRun, btnReset, /\bassert\b/.test(o.code || '') ? h('label', { class: 'peq', for: ea.id }, ea, ' Activar aserciones (-ea)') : null),
    usaScanner ? h('label', { class: 'peq etq-in' }, 'Entrada por teclado (la lee Scanner, en este orden):') : null, usaScanner ? stdin : null,
    salida, h('p', { class: 'nota-sim' }, 'Simulador de Java (subconjunto de lo visto en clase). Si algo no se soporta, te lo dirá: pruébalo entonces en tu IDE.'));
  return { el, ta, stdin, ejecutar, salida, getCode: () => ta.value };
}
function bloqueCodigo(b) {
  if (b.ejecutable) return editorJava(b).el;
  const pre = h('pre', { class: 'codigo' }, h('code', { html: hl(b.code) }));
  return h('figure', { class: 'cod' }, b.titulo ? h('figcaption', null, b.titulo) : null, pre,
    b.salida !== undefined ? h('div', { class: 'salida-fija' }, h('span', { class: 'etq' }, 'Salida'), h('pre', null, b.salida)) : null);
}

/* ---------------- renderizadores ---------------- */
const R = {};
R.texto = b => mdEl(b.md);
R.codigo = b => bloqueCodigo(b);
R.tabla = b => h('div', { class: 'tabla-w' }, h('table', { class: 'tabla' }, b.titulo ? h('caption', null, b.titulo) : null,
  h('thead', null, h('tr', null, (b.cab || []).map(c => h('th', { html: md(c).replace(/^<p>|<\/p>$/g, '') })))),
  h('tbody', null, (b.filas || []).map(f => h('tr', null, f.map(c => h('td', { html: md(String(c)).replace(/^<p>|<\/p>$/g, '') })))))));
const ICONOS = { clave: '🔑', cuidado: '⚠️', info: 'ℹ️', consejo: '💡', pro: '🧑‍💻', ejemplo: '🧪' };
const TITULOS = { clave: 'Idea clave', cuidado: 'Cuidado', info: 'Ten en cuenta', consejo: 'Consejo', pro: 'Consejo de profesional', ejemplo: 'Ejemplo' };
R.aviso = b => { const t = b.tipo || 'info'; return h('aside', { class: 'aviso aviso-' + t, role: 'note' }, h('div', { class: 'aviso-t' }, h('span', { 'aria-hidden': 'true' }, ICONOS[t] || 'ℹ️'), ' ', b.titulo || TITULOS[t] || ''), mdEl(b.md)); };
R.profundizar = (b, ctx) => { const d = h('details', { class: 'profundizar' }, h('summary', null, h('span', { class: 'mas', 'aria-hidden': 'true' }, '＋'), ' ', b.titulo)); const c = h('div', { class: 'prof-c' }); (b.bloques || [{ t: 'texto', md: b.md }]).forEach((x, i) => { const e = renderBloque(x, Object.assign({}, ctx, { idx: ctx.idx + '.' + i, anidado: true })); if (e) c.appendChild(e); }); d.appendChild(c); return d; };
R.memoria = b => {
  const wrap = h('figure', { class: 'memoria' }, b.titulo ? h('figcaption', null, b.titulo) : null);
  const cols = h('div', { class: 'mem-cols' }); const vars = h('div', { class: 'mem-col' }, h('div', { class: 'mem-h' }, 'Variables (pila)')), objs = h('div', { class: 'mem-col' }, h('div', { class: 'mem-h' }, 'Objetos (montón)'));
  const uid = 'm' + Math.random().toString(36).slice(2, 6); const links = [];
  (b.variables || []).forEach(v => { const cell = h('span', { class: 'mem-val', id: uid + 'v' + v.n }, v.ref ? '' : String(v.v)); if (v.ref) { cell.classList.add('mem-ref'); links.push([uid + 'v' + v.n, uid + 'o' + v.ref]); } vars.appendChild(h('div', { class: 'mem-var' }, h('span', { class: 'mem-n' }, (v.tipo ? v.tipo + ' ' : '') + v.n), cell)); });
  (b.objetos || []).forEach(o => objs.appendChild(h('div', { class: 'mem-obj', id: uid + 'o' + o.id }, h('div', { class: 'mem-cl' }, o.clase), (o.campos || []).map(c => h('div', { class: 'mem-campo' }, h('span', null, c.n), h('span', null, String(c.v)))))));
  cols.appendChild(vars); cols.appendChild(objs); wrap.appendChild(cols);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'mem-svg'); svg.setAttribute('aria-hidden', 'true'); wrap.appendChild(svg);
  const dibujar = () => { if (!wrap.isConnected) return; const wr = wrap.getBoundingClientRect(); svg.innerHTML = '<defs><marker id="' + uid + 'a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor"/></marker></defs>'; links.forEach(([a, bb]) => { const ea = document.getElementById(a), eb = document.getElementById(bb); if (!ea || !eb) return; const ra = ea.getBoundingClientRect(), rb = eb.getBoundingClientRect(); const x1 = ra.left + ra.width / 2 - wr.left, y1 = ra.top + ra.height / 2 - wr.top, x2 = rb.left - wr.left - 2, y2 = rb.top + Math.min(22, rb.height / 2) - wr.top; const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + (x1 + 60) + ',' + y1 + ' ' + (x2 - 60) + ',' + y2 + ' ' + x2 + ',' + y2); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '2'); p.setAttribute('marker-end', 'url(#' + uid + 'a)'); svg.appendChild(p); }); };
  requestAnimationFrame(() => requestAnimationFrame(dibujar)); window.addEventListener('resize', dibujar); document.addEventListener('mem-redraw', dibujar);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(dibujar).observe(wrap);
  if (b.nota) wrap.appendChild(h('figcaption', { class: 'peq' }, b.nota)); return wrap;
};

/* --- test --- */
function pintarTest(host, q, ctx, onResult) {
  const multi = Array.isArray(q.c); const correctas = multi ? q.c : [q.c];
  const orden = q.fijo ? q.o.map((t, i) => i) : shuffle(q.o.map((t, i) => i)); const name = 'q' + Math.random().toString(36).slice(2, 8);
  const lista = h('div', { class: 'opciones', role: multi ? 'group' : 'radiogroup' });
  const inputs = orden.map(i => { const inp = h('input', { type: multi ? 'checkbox' : 'radio', name, value: i, id: name + i }); lista.appendChild(h('label', { class: 'opcion', for: name + i }, inp, h('span', { html: md(q.o[i]).replace(/^<p>|<\/p>$/g, '') }))); return inp; });
  const b1 = boton('Comprobar', () => {
    const sel = inputs.filter(x => x.checked).map(x => +x.value); if (!sel.length) { feedback(host, null, 'Elige una opción antes de comprobar.'); return; }
    const ok = sel.length === correctas.length && correctas.every(c => sel.includes(c));
    inputs.forEach(x => { x.disabled = true; const l = x.parentNode; if (correctas.includes(+x.value)) l.classList.add('correcta'); else if (x.checked) l.classList.add('incorrecta'); });
    feedback(host, ok, (ok ? 'Correcto. ' : 'No exactamente. ') + (q.e ? md(q.e).replace(/^<p>|<\/p>$/g, '') : ''));
    b1.hidden = true; b2.hidden = false; if (onResult) onResult(ok);
  }, 'btn-primario');
  const b2 = boton('Intentar de nuevo', () => { inputs.forEach(x => { x.disabled = false; x.checked = false; x.parentNode.classList.remove('correcta', 'incorrecta'); }); const fb = host.querySelector('.fb'); if (fb) fb.remove(); b1.hidden = false; b2.hidden = true; }); b2.hidden = true;
  host.appendChild(lista); host.appendChild(h('div', { class: 'fila' }, b1, b2)); return { lista, inputs };
}
R.test = (b, ctx) => { const t = tarjeta('Test', ctx.id, 'tj-test', '❓'); t.body.appendChild(mdEl(b.p, 'enun')); pintarTest(t.body, b, ctx, ok => { if (ok) hecho(ctx.id, t.el); }); return t.el; };

/* --- ordenar --- */
R.ordenar = (b, ctx) => {
  const t = tarjeta('Ordena', ctx.id, 'tj-ordenar', '↕️'); t.body.appendChild(mdEl(b.p, 'enun'));
  let orden = shuffle(b.items.map((x, i) => i)); if (orden.every((x, i) => x === i) && orden.length > 1) orden = orden.reverse();
  const ul = h('ol', { class: 'lista-orden' });
  const pintar = () => { U.vaciar(ul); orden.forEach((ix, pos) => ul.appendChild(h('li', { class: 'item-orden' }, h('span', { class: 'ord-txt', html: b.codigo ? '<code>' + U.esc(b.items[ix]) + '</code>' : md(b.items[ix]).replace(/^<p>|<\/p>$/g, '') }), h('span', { class: 'ord-btns' },
    h('button', { type: 'button', class: 'mini', 'aria-label': 'Subir', disabled: pos === 0, onclick: () => { [orden[pos - 1], orden[pos]] = [orden[pos], orden[pos - 1]]; pintar(); } }, '↑'),
    h('button', { type: 'button', class: 'mini', 'aria-label': 'Bajar', disabled: pos === orden.length - 1, onclick: () => { [orden[pos + 1], orden[pos]] = [orden[pos], orden[pos + 1]]; pintar(); } }, '↓'))))); };
  pintar(); t.body.appendChild(ul);
  t.body.appendChild(h('div', { class: 'fila' }, boton('Comprobar', () => { const ok = orden.every((x, i) => x === i); feedback(t.body, ok, ok ? 'Orden correcto. ' + (b.e ? md(b.e).replace(/^<p>|<\/p>$/g, '') : '') : 'Todavía no está en el orden correcto. ' + (b.pista ? md(b.pista).replace(/^<p>|<\/p>$/g, '') : 'Piensa qué tiene que pasar antes de qué.')); if (ok) hecho(ctx.id, t.el); }, 'btn-primario')));
  return t.el;
};
/* --- relacionar --- */
R.relacionar = (b, ctx) => {
  const t = tarjeta('Relaciona', ctx.id, 'tj-relacionar', '🔗'); t.body.appendChild(mdEl(b.p, 'enun'));
  const der = shuffle(b.pares.map((p, i) => i)); const sels = [];
  const g = h('div', { class: 'relaciona' });
  b.pares.forEach((p, i) => { const s = h('select', { 'aria-label': 'Relación para ' + p[0] }, h('option', { value: '' }, '— elige —'), der.map(j => h('option', { value: j }, b.pares[j][1]))); sels.push(s); g.appendChild(h('div', { class: 'rel-fila' }, h('span', { class: 'rel-izq', html: b.codigo ? '<code>' + U.esc(p[0]) + '</code>' : md(p[0]).replace(/^<p>|<\/p>$/g, '') }), s)); });
  t.body.appendChild(g);
  t.body.appendChild(h('div', { class: 'fila' }, boton('Comprobar', () => { let bien = 0, vacio = 0; sels.forEach((s, i) => { s.classList.remove('s-ok', 's-mal'); if (s.value === '') vacio++; else if (+s.value === i) { bien++; s.classList.add('s-ok'); } else s.classList.add('s-mal'); }); const ok = bien === sels.length; feedback(t.body, ok, ok ? 'Todas las parejas son correctas. ' + (b.e ? md(b.e).replace(/^<p>|<\/p>$/g, '') : '') : bien + ' de ' + sels.length + ' correctas' + (vacio ? ' (' + vacio + ' sin elegir)' : '') + '. Revisa las marcadas en rojo.'); if (ok) hecho(ctx.id, t.el); }, 'btn-primario')));
  return t.el;
};
/* --- huecos --- */
R.huecos = (b, ctx) => {
  const t = tarjeta('Completa los huecos', ctx.id, 'tj-huecos', '🧩'); if (b.p) t.body.appendChild(mdEl(b.p, 'enun'));
  const pre = h('pre', { class: 'codigo huecos' }); const resp = []; const partes = b.codigo.split(/\{\{(.*?)\}\}/g);
  partes.forEach((p, i) => { if (i % 2 === 0) { const sp = h('span'); sp.innerHTML = hl(p); pre.appendChild(sp); } else { const alt = p.split('|'); const inp = h('input', { type: 'text', class: 'hueco', size: Math.max(4, Math.max(...alt.map(a => a.length)) + 1), spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off', 'aria-label': 'Hueco ' + (resp.length + 1) }); resp.push({ inp, alt }); pre.appendChild(inp); } });
  t.body.appendChild(pre);
  t.body.appendChild(h('div', { class: 'fila' }, boton('Comprobar', () => { let bien = 0; resp.forEach(r => { const v = normSp(r.inp.value); const ok = r.alt.some(a => normSp(a) === v); r.inp.classList.toggle('s-ok', ok); r.inp.classList.toggle('s-mal', !ok); if (ok) bien++; }); const ok = bien === resp.length; feedback(t.body, ok, ok ? 'Perfecto. ' + (b.e ? md(b.e).replace(/^<p>|<\/p>$/g, '') : '') : bien + ' de ' + resp.length + ' huecos bien.' + (b.pista ? ' Pista: ' + md(b.pista).replace(/^<p>|<\/p>$/g, '') : '')); if (ok) hecho(ctx.id, t.el); }, 'btn-primario'),
    boton('Ver respuestas', () => { resp.forEach(r => { r.inp.value = r.alt[0]; }); feedback(t.body, null, 'Estas son las respuestas. Intenta explicar por qué cada una es la correcta.'); })));
  return t.el;
};
/* --- predecir salida --- */
R.predecir = (b, ctx) => {
  const t = tarjeta('Predice la salida', ctx.id, 'tj-predecir', '🔮'); t.body.appendChild(mdEl(b.p || '¿Qué muestra este programa por pantalla? Escríbelo exactamente, línea a línea.', 'enun'));
  t.body.appendChild(bloqueCodigo({ code: b.code }));
  if (b.stdin !== undefined) t.body.appendChild(h('p', { class: 'peq' }, 'Entrada por teclado: ', h('code', null, b.stdin.replace(/\n/g, ' ⏎ '))));
  const ta = h('textarea', { class: 'respuesta', rows: Math.max(3, (b.salida.split('\n').length) + 1), spellcheck: 'false', 'aria-label': 'Salida que predices', placeholder: 'Escribe aquí la salida…' }); t.body.appendChild(ta);
  const real = h('div', { class: 'real', hidden: true });
  const bc = boton('Comprobar', () => { const ok = norm(ta.value) === norm(b.salida); feedback(t.body, ok, ok ? 'Exacto. ' + (b.e ? md(b.e).replace(/^<p>|<\/p>$/g, '') : '') : 'No coincide. Rellena una tabla de seguimiento a mano y vuelve a intentarlo, o ejecuta el programa para ver qué hace de verdad.'); if (ok) hecho(ctx.id, t.el); }, 'btn-primario');
  const be = boton('▶ Ejecutar y comparar', () => { const e = editorJava({ code: b.code, stdin: b.stdin }); U.vaciar(real); real.hidden = false; real.appendChild(e.el); e.ejecutar(); }, '');
  t.body.appendChild(h('div', { class: 'fila' }, bc, be)); t.body.appendChild(real);
  if (b.e) { /* explicación tras comprobar */ }
  return t.el;
};
/* --- traza --- */
R.traza = (b, ctx) => {
  const t = tarjeta('Tabla de seguimiento', ctx.id, 'tj-traza', '📋'); if (b.p) t.body.appendChild(mdEl(b.p, 'enun')); t.body.appendChild(bloqueCodigo({ code: b.code }));
  const cells = []; const tb = h('tbody');
  b.filas.forEach(f => { const tr = h('tr'); f.forEach((c, j) => { if (c === null || c === undefined) { tr.appendChild(h('td', null, '')); return; } if (typeof c === 'object' && c.dado !== undefined) { tr.appendChild(h('td', { class: 'dado' }, c.dado)); return; } const alt = String(c).split('|'); const inp = h('input', { type: 'text', class: 'celda', size: 8, spellcheck: 'false', autocomplete: 'off', 'aria-label': b.cols[j] }); cells.push({ inp, alt }); tr.appendChild(h('td', null, inp)); }); tb.appendChild(tr); });
  t.body.appendChild(h('div', { class: 'tabla-w' }, h('table', { class: 'tabla traza' }, h('thead', null, h('tr', null, b.cols.map(c => h('th', null, c)))), tb)));
  t.body.appendChild(h('div', { class: 'fila' }, boton('Comprobar', () => { let bien = 0; cells.forEach(c => { const ok = c.alt.some(a => normSp(a) === normSp(c.inp.value)); c.inp.classList.toggle('s-ok', ok); c.inp.classList.toggle('s-mal', !ok); if (ok) bien++; }); const ok = bien === cells.length; feedback(t.body, ok, ok ? 'Tabla completa y correcta. ' + (b.e ? md(b.e).replace(/^<p>|<\/p>$/g, '') : '') : bien + ' de ' + cells.length + ' celdas bien. Las rojas están mal: sigue el programa línea a línea.'); if (ok) hecho(ctx.id, t.el); }, 'btn-primario')));
  return t.el;
};
/* --- ejecuta / reto (código con pruebas automáticas) --- */
function bloqueEjecuta(b, ctx, esReto) {
  const t = tarjeta(esReto ? 'Reto Pro' : 'Ejercicio de código', ctx.id, esReto ? 'tj-reto' : 'tj-ejecuta', esReto ? '🏆' : '⌨️');
  if (b.titulo) t.body.appendChild(h('h4', { class: 'reto-t' }, b.titulo));
  t.body.appendChild(mdEl(b.p || b.enunciado, 'enun'));
  if (b.requisitos && b.requisitos.length) t.body.appendChild(h('div', { class: 'requisitos' }, h('strong', null, 'Requisitos'), h('ul', null, b.requisitos.map(r => h('li', { html: md(r).replace(/^<p>|<\/p>$/g, '') })))));
  const ed = editorJava({ code: b.inicial || '', stdin: b.stdin, siempreEntrada: (b.tests || []).some(x => x.in) }); t.body.appendChild(ed.el);
  const res = h('div', { class: 'tests-res' }); let fallos = 0; let pistaN = 0;
  const bt = boton('✔ Comprobar con las pruebas', () => {
    U.vaciar(res); const tests = b.tests || []; let pasa = 0; const resumen = [];
    if (!tests.length) { feedback(t.body, null, 'Este ejercicio no tiene pruebas automáticas: ejecútalo y revisa tú la salida con la rúbrica.'); return; }
    tests.forEach((tc, i) => {
      const r = JavaSim.run(ed.getCode(), tc.in || '', {}); let ok = false, got = r.text || '';
      if (r.error && r.error.kind !== 'runtime' && r.error.kind !== 'limit') got = (r.error.kind === 'compile' ? 'ERROR DE COMPILACIÓN: ' : '') + r.error.msg; else if (r.uncaught) got = (r.out.filter(o => !o.err).map(o => o.s).join('')) + '[Excepción] ' + r.error.msg;
      if (!r.error || r.error.kind === 'runtime' && tc.permiteExcepcion) { if (tc.contiene) ok = tc.contiene.every(s => norm(got).includes(s)); else ok = norm(got) === norm(tc.out); }
      if (ok) pasa++; resumen.push({ i, ok, got, tc });
      res.appendChild(h('div', { class: 'test-item ' + (ok ? 'bien' : 'mal') }, h('div', { class: 'test-cab' }, (ok ? '✓ ' : '✗ ') + (tc.desc || 'Prueba ' + (i + 1)), tc.in ? h('span', { class: 'peq' }, ' · entrada: ', h('code', null, tc.in.replace(/\n/g, ' ⏎ '))) : null),
        ok ? null : h('div', { class: 'test-diff' }, h('div', null, h('span', { class: 'etq' }, 'Esperado'), h('pre', null, tc.out !== undefined ? tc.out : 'Debe contener: ' + (tc.contiene || []).join(' · '))), h('div', null, h('span', { class: 'etq' }, 'Obtenido'), h('pre', null, got || '(nada)')))));
    });
    const todo = pasa === tests.length; if (!todo) fallos++;
    feedback(t.body, todo, todo ? 'Pasa todas las pruebas (' + pasa + '/' + tests.length + '). ' + (b.e ? md(b.e).replace(/^<p>|<\/p>$/g, '') : 'Ahora repasa la rúbrica y la calidad del código.') : pasa + ' de ' + tests.length + ' pruebas correctas. Compara lo esperado con lo obtenido, línea a línea.');
    ed.ultimoResultado = resumen.map(x => (x.ok ? 'OK' : 'FALLA') + ' - ' + (x.tc.desc || 'prueba ' + (x.i + 1)) + (x.ok ? '' : ' (esperado: ' + JSON.stringify((x.tc.out || '').slice(0, 160)) + ' / obtenido: ' + JSON.stringify(x.got.slice(0, 160)) + ')')).join('\n');
    if (todo) hecho(ctx.id, t.el);
  }, 'btn-primario');
  const acciones = h('div', { class: 'fila' }, bt);
  if (b.pistas && b.pistas.length) { const pistas = h('div', { class: 'pistas' }); acciones.appendChild(boton('💡 Pista', () => { if (pistaN < b.pistas.length) { pistas.appendChild(h('div', { class: 'pista', html: '<strong>Pista ' + (pistaN + 1) + ':</strong> ' + md(b.pistas[pistaN]).replace(/^<p>|<\/p>$/g, '') })); pistaN++; } })); t.body.appendChild(acciones); t.body.appendChild(pistas); } else t.body.appendChild(acciones);
  t.body.appendChild(res);
  if (b.solucion) { const sol = h('details', { class: 'solucion' }, h('summary', null, 'Ver una solución de referencia (inténtalo antes)'), h('pre', { class: 'codigo' }, h('code', { html: hl(b.solucion) })), b.explicacion ? mdEl(b.explicacion) : null); t.body.appendChild(sol); }
  if (b.rubrica && b.rubrica.length) t.body.appendChild(rubrica(b.rubrica));
  t.body.appendChild(panelIA(() => ({ unidad: ctx.unit.titulo, seccion: ctx.sec.titulo, modo: Estado.modo, tipo: esReto ? 'Reto de programación' : 'Ejercicio de código', enunciado: (b.titulo ? b.titulo + '\n' : '') + (b.p || b.enunciado) + (b.requisitos ? '\nRequisitos:\n' + b.requisitos.map(r => '- ' + r).join('\n') : ''), respuesta: ed.getCode(), codigo: true, resultado: ed.ultimoResultado || (fallos ? 'El alumno ha comprobado el ejercicio y no pasa todas las pruebas.' : ''), esperado: (b.rubrica || []).concat(b.esperado || []) })));
  return t.el;
}
function rubrica(items) {
  const bx = items.map((c, i) => { const id = 'rb' + Math.random().toString(36).slice(2, 7) + i; return h('label', { class: 'rub-item', for: id }, h('input', { type: 'checkbox', id }), h('span', { html: md(c).replace(/^<p>|<\/p>$/g, '') })); });
  return h('details', { class: 'rubrica' }, h('summary', null, '📐 Rúbrica: autoevalúa tu solución'), h('div', { class: 'rub-c' }, bx, h('p', { class: 'peq' }, 'Marca solo lo que de verdad cumple tu código. Lo que no puedas marcar es justo lo que toca mejorar.')));
}
R.ejecuta = (b, ctx) => bloqueEjecuta(b, ctx, false);
R.reto = (b, ctx) => bloqueEjecuta(b, ctx, true);
/* --- abierta --- */
R.abierta = (b, ctx) => {
  const t = tarjeta('Respuesta abierta', ctx.id, 'tj-abierta', '📝'); t.body.appendChild(mdEl(b.p, 'enun'));
  const ta = h('textarea', { class: 'respuesta', rows: b.filas || 6, 'aria-label': 'Tu respuesta', placeholder: 'Explícalo con tus palabras…' }); ta.value = Estado.nota(ctx.id); ta.addEventListener('input', () => Estado.nota(ctx.id, ta.value)); t.body.appendChild(ta);
  const min = b.minPalabras || 12; const modelo = h('div', { class: 'modelo', hidden: true }, h('strong', null, 'Respuesta modelo'), mdEl(b.modelo || ''));
  t.body.appendChild(h('div', { class: 'fila' }, boton('Comparar con la respuesta modelo', () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; if (n < min) { feedback(t.body, null, 'Escribe tu propia respuesta primero (al menos ' + min + ' palabras). Comparar sin intentarlo no enseña nada.'); return; } modelo.hidden = false; feedback(t.body, null, 'Lee el modelo y revisa la rúbrica: ¿qué te ha faltado? Si lo has entendido, marca el ejercicio como hecho.'); }, 'btn-primario'), boton('✓ Marcar como hecho', () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; if (n < min) { feedback(t.body, null, 'Escribe al menos ' + min + ' palabras antes de marcarlo.'); return; } hecho(ctx.id, t.el); feedback(t.body, true, 'Marcado como hecho.'); })));
  t.body.appendChild(modelo); if (b.rubrica) t.body.appendChild(rubrica(b.rubrica));
  t.body.appendChild(panelIA(() => ({ unidad: ctx.unit.titulo, seccion: ctx.sec.titulo, modo: Estado.modo, tipo: 'Pregunta de respuesta abierta', enunciado: b.p, respuesta: ta.value || '(el alumno aún no ha escrito nada)', esperado: (b.rubrica || []).concat(b.modelo ? ['Respuesta de referencia del profesor: ' + b.modelo] : []) })));
  return t.el;
};
/* --- práctica paso a paso --- */
R.practica = (b, ctx) => {
  const t = tarjeta(b.titulo || 'Práctica guiada', ctx.id, 'tj-practica', '🛠️'); if (b.p) t.body.appendChild(mdEl(b.p, 'enun'));
  const pasos = b.pasos || []; const cks = []; const ol = h('ol', { class: 'pasos' });
  const guardado = JSON.parse(Estado.nota(ctx.id + ':pasos') || '[]');
  pasos.forEach((p, i) => { const id = 'p' + Math.random().toString(36).slice(2, 7) + i; const ck = h('input', { type: 'checkbox', id, checked: !!guardado[i] }); cks.push(ck);
    ck.addEventListener('change', () => { Estado.nota(ctx.id + ':pasos', JSON.stringify(cks.map(c => c.checked))); if (cks.every(c => c.checked)) { hecho(ctx.id, t.el); } else { Estado.marcar(ctx.id, false); t.el.classList.remove('hecho'); document.dispatchEvent(new CustomEvent('progreso')); } li.classList.toggle('paso-ok', ck.checked); });
    const li = h('li', { class: 'paso' + (guardado[i] ? ' paso-ok' : '') }, h('div', { class: 'paso-cab' }, ck, h('label', { for: id, class: 'paso-t' }, p.t)), h('div', { class: 'paso-c' }, p.md ? mdEl(p.md) : null, p.code ? bloqueCodigo({ code: p.code, ejecutable: p.ejecutable, stdin: p.stdin }) : null, p.check ? h('div', { class: 'paso-check' }, h('strong', null, '¿Cómo sé que está bien? '), h('span', { html: md(p.check).replace(/^<p>|<\/p>$/g, '') })) : null, p.pregunta ? h('div', { class: 'paso-preg' }, h('strong', null, 'Para comprobar que lo entiendes: '), h('span', { html: md(p.pregunta).replace(/^<p>|<\/p>$/g, '') })) : null)); ol.appendChild(li); });
  t.body.appendChild(ol); if (b.entrega) t.body.appendChild(h('div', { class: 'aviso aviso-info' }, h('div', { class: 'aviso-t' }, '📦 Qué entregar'), mdEl(b.entrega)));
  return t.el;
};

/* ---------------- despachador ---------------- */
function renderBloque(b, ctx) {
  if (!Estado.visible(b, Estado.modo) && !ctx.siempre) return null;
  const f = R[b.t]; if (!f) return h('div', { class: 'aviso aviso-cuidado' }, 'Bloque desconocido: «' + b.t + '». Revisa el archivo de contenido.');
  ctx = Object.assign({}, ctx); ctx.id = b.id || (ctx.sec.id + '#' + ctx.idx);
  let el; try { el = f(b, ctx); } catch (e) { el = h('div', { class: 'aviso aviso-cuidado' }, 'Error al dibujar el bloque «' + b.t + '»: ' + e.message); }
  if (b.modo === 'pro') el.classList.add('solo-pro'); if (b.modo === 'aprobar') el.classList.add('solo-aprobar');
  return el;
}
w.Bloques = { renderBloque, pintarTest, panelIA, editorJava, tarjeta, feedback, boton, hecho, rubrica, bloqueCodigo };
})(window);
