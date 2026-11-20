/* Autoevaluación de unidad con el baremo del examen: +1 acierto, −1/3 fallo, 0 en blanco. */
(function (w) {
'use strict';
const { h, md, mdEl, shuffle } = U;
const f2 = n => n.toFixed(2).replace('.', ',');

function muestra(unit, modo) {
  const N = unit.testN || 20; const banco = (unit.banco || []).map((q, i) => Object.assign({ _i: i }, q));
  let pool;
  if (modo === 'pro') { const pro = shuffle(banco.filter(q => q.nivel === 'pro')), resto = shuffle(banco.filter(q => q.nivel !== 'pro')); const nPro = Math.min(pro.length, Math.ceil(N * 0.6)); pool = shuffle(pro.slice(0, nPro).concat(resto.slice(0, N - nPro))); if (pool.length < N) pool = pool.concat(pro.slice(nPro, nPro + N - pool.length)); }
  else pool = shuffle(banco.filter(q => q.nivel !== 'pro'));
  return pool.slice(0, N).map(q => { const orden = q.fijo ? q.o.map((t, i) => i) : shuffle(q.o.map((t, i) => i)); return Object.assign({}, q, { orden }); });
}

function render(unit, host) {
  U.vaciar(host);
  const modo = Estado.modo; const total = Math.min(unit.testN || 20, (unit.banco || []).filter(q => modo === 'pro' || q.nivel !== 'pro').length || (unit.banco || []).length);
  const hist = Estado.auto(unit.id);
  host.appendChild(h('div', { class: 'auto-intro' },
    h('h2', null, '📝 Autoevaluación · ', unit.titulo),
    h('p', null, 'Una muestra aleatoria de ', h('strong', null, String(total)), ' preguntas tipo test de un banco más amplio, con el ', h('strong', null, 'mismo baremo que los exámenes'), ':'),
    h('ul', { class: 'baremo' }, h('li', null, h('strong', null, '+1'), ' punto por acierto'), h('li', null, h('strong', null, '−1/3'), ' por fallo'), h('li', null, h('strong', null, '0'), ' si la dejas en blanco')),
    h('p', null, 'Con este baremo, ', h('strong', null, 'contestar al azar no compensa'), ': si dudas entre todas las opciones, es mejor dejarla en blanco. Al final verás qué apartados te conviene repasar.'),
    hist.length ? h('p', { class: 'peq' }, 'Último intento: ', h('strong', null, f2(hist[hist.length - 1].nota) + ' / 10'), ' · mejor: ', h('strong', null, f2(Math.max(...hist.map(x => x.nota))) + ' / 10'), ' · intentos: ' + hist.length) : null,
    h('button', { type: 'button', class: 'btn btn-primario btn-grande', onclick: () => cuestionario(unit, host) }, hist.length ? 'Hacer otra muestra' : 'Empezar')));
}
function cuestionario(unit, host) {
  const modo = Estado.modo; const qs = muestra(unit, modo); U.vaciar(host);
  if (!qs.length) { host.appendChild(h('div', { class: 'aviso aviso-info' }, 'Esta unidad aún no tiene banco de preguntas.')); return; }
  host.appendChild(h('h2', null, '📝 ', unit.titulo, ' · ', h('span', { class: 'chip' }, qs.length + ' preguntas')));
  const form = h('form', { class: 'auto-form', novalidate: true, onsubmit: e => { e.preventDefault(); corregir(); } });
  const radios = [];
  qs.forEach((q, n) => {
    const name = 'a' + n; const lst = h('div', { class: 'opciones', role: 'radiogroup', 'aria-labelledby': name + 'p' }); const rs = [];
    q.orden.forEach(i => { const inp = h('input', { type: 'radio', name, value: i, id: name + '_' + i }); rs.push(inp); lst.appendChild(h('label', { class: 'opcion', for: name + '_' + i }, inp, h('span', { html: md(q.o[i]).replace(/^<p>|<\/p>$/g, '') }))); });
    radios.push(rs);
    form.appendChild(h('fieldset', { class: 'preg', id: 'preg' + n }, h('legend', { id: name + 'p' }, h('span', { class: 'num' }, (n + 1) + '.'), ' ', h('span', { html: md(q.p).replace(/^<p>|<\/p>$/g, '') })), lst,
      h('button', { type: 'button', class: 'mini blanco', onclick: () => rs.forEach(r => { r.checked = false; }) }, 'Dejar en blanco')));
  });
  form.appendChild(h('div', { class: 'fila fin-form' }, h('button', { type: 'submit', class: 'btn btn-primario btn-grande' }, 'Corregir')));
  host.appendChild(form);
  function corregir() {
    const respuestas = radios.map(rs => { const c = rs.find(r => r.checked); return c ? +c.value : null; });
    const blancas = respuestas.filter(r => r === null).length;
    if (blancas && !form.dataset.ok) {
      const prev = form.querySelector('.aviso-blancas'); if (prev) prev.remove();
      const av = h('div', { class: 'aviso aviso-cuidado aviso-blancas', role: 'alert' }, h('div', { class: 'aviso-t' }, '⚠️ Preguntas en blanco'),
        h('p', null, 'Tienes ' + blancas + ' pregunta(s) en blanco (0 puntos). Si dudas, recuerda que un fallo resta ⅓. ¿Quieres corregir ya?'),
        h('div', { class: 'fila' }, h('button', { type: 'button', class: 'btn btn-primario', onclick: () => { form.dataset.ok = '1'; corregir(); } }, 'Sí, corregir ya'), h('button', { type: 'button', class: 'btn', onclick: () => av.remove() }, 'Seguir contestando')));
      const fin = form.querySelector('.fin-form'); form.insertBefore(av, fin); av.scrollIntoView({ block: 'center' }); return;
    }
    resultado(unit, host, qs, respuestas);
  }
}
function resultado(unit, host, qs, resp) {
  let A = 0, F = 0, Bl = 0; const repasar = {};
  qs.forEach((q, n) => { const r = resp[n]; const ok = r === q.c; if (r === null) { Bl++; (repasar[q.sec] = repasar[q.sec] || { fallos: 0, blancos: 0 }).blancos++; } else if (ok) A++; else { F++; (repasar[q.sec] = repasar[q.sec] || { fallos: 0, blancos: 0 }).fallos++; } });
  const puntos = A - F / 3; const nota = Math.max(0, puntos) / qs.length * 10;
  Estado.guardarAuto(unit.id, { fecha: new Date().toISOString().slice(0, 10), nota, aciertos: A, fallos: F, blancos: Bl, n: qs.length });
  document.dispatchEvent(new CustomEvent('progreso'));
  U.vaciar(host); window.scrollTo({ top: 0 });
  const cls = nota >= 5 ? 'aprobado' : 'suspenso';
  host.appendChild(h('div', { class: 'resultado ' + cls },
    h('h2', null, 'Resultado · ', unit.titulo),
    h('div', { class: 'nota-grande' }, f2(nota), h('span', null, ' / 10')),
    h('p', null, h('strong', null, f2(puntos) + ' puntos'), ' de ' + qs.length + ' posibles'),
    h('p', { class: 'desglose' }, h('span', { class: 'ac' }, A + ' aciertos (+' + A + ')'), ' · ', h('span', { class: 'fa' }, F + ' fallos (−' + f2(F / 3) + ')'), ' · ', h('span', { class: 'bl' }, Bl + ' en blanco (0)')),
    h('p', { class: 'peq' }, 'Nota orientativa de la autoevaluación: no es una calificación oficial.')));
  const secs = Object.keys(repasar).map(id => ({ id, n: repasar[id].fallos + repasar[id].blancos, ...repasar[id], sec: (unit.secciones || []).find(s => s.id === id) })).sort((a, b) => b.n - a.n);
  const bloque = h('div', { class: 'repasar' }, h('h3', null, '📚 Qué te conviene repasar'));
  if (!secs.length) bloque.appendChild(h('p', null, '¡Nada! Has acertado todo. Prueba otra muestra o pasa al Modo Pro.'));
  else { bloque.appendChild(h('p', null, 'Según lo que has fallado o dejado en blanco, empieza por los primeros:')); const ul = h('ul', { class: 'lista-repasar' }); secs.forEach(s => ul.appendChild(h('li', null, h('a', { href: '#/u/' + unit.id + '/s/' + s.id }, s.sec ? s.sec.titulo : s.id), h('span', { class: 'peq' }, ' — ' + (s.fallos ? s.fallos + ' fallo' + (s.fallos > 1 ? 's' : '') : '') + (s.fallos && s.blancos ? ', ' : '') + (s.blancos ? s.blancos + ' en blanco' : ''))))); bloque.appendChild(ul); }
  host.appendChild(bloque);
  host.appendChild(h('h3', null, 'Corrección pregunta a pregunta'));
  qs.forEach((q, n) => {
    const r = resp[n]; const ok = r === q.c; const estado = r === null ? 'blanco' : ok ? 'bien' : 'mal';
    host.appendChild(h('article', { class: 'corr corr-' + estado }, h('div', { class: 'corr-p' }, h('span', { class: 'num' }, (n + 1) + '.'), ' ', h('span', { html: md(q.p).replace(/^<p>|<\/p>$/g, '') }), h('span', { class: 'etq-est' }, r === null ? 'En blanco · 0' : ok ? 'Acierto · +1' : 'Fallo · −0,33')),
      h('ul', { class: 'corr-ops' }, q.orden.map(i => h('li', { class: (i === q.c ? 'es-correcta ' : '') + (i === r && !ok ? 'elegida-mal' : '') }, h('span', { html: md(q.o[i]).replace(/^<p>|<\/p>$/g, '') })))),
      q.e ? h('div', { class: 'corr-e' }, h('strong', null, 'Por qué: '), h('span', { html: md(q.e).replace(/^<p>|<\/p>$/g, '') })) : null));
  });
  host.appendChild(h('div', { class: 'fila fin-form' }, h('button', { type: 'button', class: 'btn btn-primario', onclick: () => cuestionario(unit, host) }, 'Otra muestra'), h('a', { class: 'btn', href: '#/u/' + unit.id }, 'Volver a la unidad')));
}
w.Autoeval = { render };
})(window);
