/* Motor de la app: rutas, modo Aprobar/Pro, unidades, secciones. El contenido NO está aquí. */
(function (w) {
'use strict';
const { h, md, mdEl } = U;
w.UNIDADES = w.UNIDADES || {};
w.registrarUnidad = u => { w.UNIDADES[u.id] = u; };
const CFG = w.CONFIG || { unidades: [] };
const root = document.getElementById('app');
const ESTADOS = { repaso: { txt: 'Repaso', cls: 'e-repaso' }, actual: { txt: 'Estamos aquí', cls: 'e-actual' }, bloqueada: { txt: 'Bloqueada', cls: 'e-bloq' } };
const pct = x => Math.round(x * 100);
const modoActual = () => Estado.modo;
const cfgUnidad = id => CFG.unidades.find(u => u.id === id);

function barra(p, etq) { return h('div', { class: 'barra', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct(p), 'aria-label': etq || 'Progreso' }, h('div', { class: 'barra-i', style: 'width:' + pct(p) + '%' })); }

/* ---------------- cabecera ---------------- */
function cabecera() {
  const pro = modoActual() === 'pro';
  const sw = h('button', { type: 'button', class: 'interruptor', role: 'switch', 'aria-checked': String(pro), 'aria-label': 'Cambiar entre Aprobar módulo y Modo Pro', onclick: () => cambiarModo(pro ? 'aprobar' : 'pro') },
    h('span', { class: 'sw-op' + (!pro ? ' on' : '') }, 'Aprobar módulo'), h('span', { class: 'sw-pista', 'aria-hidden': 'true' }, h('span', { class: 'sw-bola' })), h('span', { class: 'sw-op' + (pro ? ' on' : '') }, 'Modo Pro'));
  return h('header', { class: 'cab' }, h('a', { class: 'marca', href: '#/' }, h('span', { class: 'logo', 'aria-hidden': 'true' }, pro ? '</>' : '{ }'), h('span', null, h('strong', null, CFG.asignatura || 'Programación'), h('small', null, (CFG.curso || '') + (CFG.centro ? ' · ' + CFG.centro : '')))), h('div', { class: 'cab-der' }, sw));
}
function cambiarModo(m) { Estado.setModo(m); document.body.dataset.modo = m; const y = window.scrollY; pintar(); window.scrollTo(0, y); }
let msgPie = '';
function pie() {
  const imp = h('input', { type: 'file', accept: 'application/json', hidden: true, onchange: e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { Estado.importar(r.result); msgPie = '✅ Progreso importado.'; pintar(); } catch (er) { msgPie = '❌ No se ha podido importar: ' + er.message; pintar(); } }; r.readAsText(f); } });
  return h('footer', { class: 'pie' },
    h('p', { class: 'peq' }, Estado.persiste ? '💾 Tu progreso se guarda solo en este navegador (localStorage). No hay cuentas ni se envía nada a ningún servidor.' : '⚠️ Este navegador no permite guardar el progreso: se perderá al cerrar la pestaña.'),
    h('div', { class: 'fila' },
      h('button', { type: 'button', class: 'btn mini', onclick: () => { const blob = new Blob([Estado.exportar()], { type: 'application/json' }); const a = h('a', { href: URL.createObjectURL(blob), download: 'progreso-programacion.json' }); document.body.appendChild(a); a.click(); a.remove(); } }, '⬇ Exportar progreso'),
      h('button', { type: 'button', class: 'btn mini', onclick: () => imp.click() }, '⬆ Importar progreso'), imp,
      h('button', { type: 'button', class: 'btn mini peligro', onclick: ev => { const bt = ev.currentTarget; if (bt.dataset.seguro) { Estado.reiniciar(); pintar(); return; } bt.dataset.seguro = '1'; bt.textContent = '⚠ ¿Seguro? Pulsa otra vez para borrar'; setTimeout(() => { delete bt.dataset.seguro; bt.textContent = '🗑 Borrar progreso'; }, 5000); } }, '🗑 Borrar progreso')),
    h('p', { class: 'peq', role: 'status', 'aria-live': 'polite' }, msgPie),
    h('p', { class: 'peq' }, (CFG.asignatura || 'Programación') + ' · ' + (CFG.curso || '') + (CFG.version ? ' · versión ' + CFG.version : '')));
}

/* ---------------- portada ---------------- */
function portada() {
  const pro = modoActual() === 'pro';
  const cont = h('main', { class: 'principal', id: 'contenido' });
  cont.appendChild(h('section', { class: 'hero' }, h('h1', null, pro ? 'Modo Pro' : 'Aprende Programación en Java'),
    h('p', { class: 'lead' }, pro ? 'Retos grandes, criterio de ingeniería y consejos de la vida profesional. Pensado para quien ya domina lo que cae en el módulo y quiere ir más lejos.' : 'Apuntes interactivos con ejercicios, un tutor que se adapta a lo que ya sabes y autoevaluaciones con el baremo del examen.'),
    h('ul', { class: 'hero-lista' }, h('li', null, h('strong', null, 'Lee'), ' los apuntes y haz los ejercicios intercalados.'), h('li', null, h('strong', null, 'Usa el tutor'), ' si no entiendes algo: te pregunta y solo explica lo que falla.'), h('li', null, h('strong', null, 'Autoevalúate'), ' al final de cada unidad: +1 / −⅓ / 0, como el examen.'))));
  const grid = h('div', { class: 'unidades' });
  CFG.unidades.forEach(c => {
    const u = w.UNIDADES[c.id]; const est = ESTADOS[c.estado] || ESTADOS.bloqueada; const bloq = c.estado === 'bloqueada'; const titulo = (u && u.titulo) || c.titulo || c.id.toUpperCase();
    const p = u && !bloq ? Estado.progresoUnidad(u, modoActual()) : 0;
    const card = h(bloq ? 'div' : 'a', { class: 'u-card ' + est.cls, href: bloq ? null : '#/u/' + c.id, 'aria-disabled': bloq ? 'true' : null },
      h('span', { class: 'u-estado' }, bloq ? '🔒 ' : c.estado === 'actual' ? '📍 ' : '↺ ', est.txt), h('h2', null, titulo),
      bloq ? h('p', { class: 'tenue' }, 'Se desbloqueará cuando lleguemos a este tema.') : h('p', null, (u && u.resumen) || (u ? '' : 'Contenido en preparación.')),
      !bloq && u ? h('div', { class: 'u-prog' }, barra(p, 'Progreso de ' + titulo), h('span', { class: 'peq' }, pct(p) + '% completado')) : null);
    grid.appendChild(card);
  });
  cont.appendChild(grid); return cont;
}

/* ---------------- unidad ---------------- */
function paginaUnidad(id) {
  const c = cfgUnidad(id), u = w.UNIDADES[id];
  if (!c || c.estado === 'bloqueada') return avisoPagina('🔒 Esta unidad todavía está bloqueada.', 'Tu profesor la abrirá cuando lleguéis a ella.');
  if (!u) return avisoPagina('🚧 Contenido en preparación', 'Esta unidad estará disponible pronto.');
  const modo = modoActual(); const cont = h('main', { class: 'principal', id: 'contenido' });
  cont.appendChild(h('nav', { class: 'migas', 'aria-label': 'Ruta' }, h('a', { href: '#/' }, 'Inicio'), ' › ', u.titulo));
  cont.appendChild(h('section', { class: 'u-cab' }, h('div', null, h('span', { class: 'chip ' + (ESTADOS[c.estado] || {}).cls }, (ESTADOS[c.estado] || {}).txt), h('h1', null, u.titulo), u.ra ? h('p', { class: 'ra' }, u.ra) : null, u.resumen ? mdEl(u.resumen) : null),
    h('div', { class: 'u-acc' }, barra(Estado.progresoUnidad(u, modo), 'Progreso de la unidad'), h('span', { class: 'peq' }, pct(Estado.progresoUnidad(u, modo)) + '% de la unidad'), h('a', { class: 'btn btn-primario', href: '#/u/' + id + '/test' }, '📝 Autoevaluación de la unidad'))));
  if (u.aprenderas && u.aprenderas.length) cont.appendChild(h('div', { class: 'aviso aviso-info' }, h('div', { class: 'aviso-t' }, '🎯 Qué vas a aprender'), h('ul', null, u.aprenderas.map(x => h('li', { html: md(x).replace(/^<p>|<\/p>$/g, '') })))));
  cont.appendChild(h('h2', { class: 'sec-tit' }, 'Apartados'));
  const lista = h('div', { class: 'secciones' });
  (u.secciones || []).forEach((s, i) => { const p = Estado.progresoSeccion(s, modo); const tut = Estado.tutor(s.id);
    lista.appendChild(h('a', { class: 's-card' + (p >= 1 ? ' completa' : ''), href: '#/u/' + id + '/s/' + s.id }, h('span', { class: 's-num' }, String(i + 1)), h('div', { class: 's-info' }, h('strong', null, s.titulo), s.resumen ? h('span', { class: 'peq' }, s.resumen) : null, barra(p, 'Progreso de ' + s.titulo)), h('div', { class: 's-chips' }, tut && tut.done ? h('span', { class: 'chip chip-ok' }, '🎓 tutor ✓') : null, p >= 1 ? h('span', { class: 'chip chip-ok' }, '✓') : h('span', { class: 'peq' }, pct(p) + '%')))); });
  cont.appendChild(lista);
  if (modo === 'pro') {
    const retos = []; (u.secciones || []).forEach(s => (s.bloques || []).forEach((b, i) => { if (b.t === 'reto' && Estado.visible(b, 'pro')) retos.push({ s, b, id: Estado.idDe(s, i, b) }); }));
    if (retos.length) { cont.appendChild(h('h2', { class: 'sec-tit' }, '🏆 Retos Pro de la unidad')); const l = h('div', { class: 'lista-retos' }); retos.forEach(r => l.appendChild(h('a', { class: 'reto-link' + (Estado.ok(r.id) ? ' completa' : ''), href: '#/u/' + id + '/s/' + r.s.id }, h('strong', null, (Estado.ok(r.id) ? '✓ ' : '') + (r.b.titulo || 'Reto')), h('span', { class: 'peq' }, r.s.titulo)))); cont.appendChild(l); }
  }
  return cont;
}
function avisoPagina(t, d) { return h('main', { class: 'principal', id: 'contenido' }, h('div', { class: 'aviso aviso-info grande' }, h('div', { class: 'aviso-t' }, t), h('p', null, d), h('a', { class: 'btn btn-primario', href: '#/' }, 'Volver al inicio'))); }

/* ---------------- sección ---------------- */
function paginaSeccion(uid, sid, tab) {
  const c = cfgUnidad(uid), u = w.UNIDADES[uid];
  if (!c || c.estado === 'bloqueada' || !u) return avisoPagina('🔒 Esta unidad no está disponible.', 'Vuelve al inicio.');
  const secs = u.secciones || []; const ix = secs.findIndex(s => s.id === sid); if (ix < 0) return avisoPagina('No encuentro ese apartado', 'Puede que se haya renombrado.');
  const sec = secs[ix]; const modo = modoActual(); Estado.visto(sid);
  const side = h('nav', { class: 'lateral', 'aria-label': 'Apartados de la unidad' }, h('a', { class: 'lat-u', href: '#/u/' + uid }, '← ', u.titulo));
  const actualizarLateral = () => { U.vaciar(side); side.appendChild(h('a', { class: 'lat-u', href: '#/u/' + uid }, '← ', u.titulo)); secs.forEach((s, i) => { const p = Estado.progresoSeccion(s, modoActual()); side.appendChild(h('a', { class: 'lat-s' + (s.id === sid ? ' activa' : '') + (p >= 1 ? ' completa' : ''), href: '#/u/' + uid + '/s/' + s.id, 'aria-current': s.id === sid ? 'page' : null }, h('span', { class: 'lat-n' }, p >= 1 ? '✓' : String(i + 1)), h('span', null, s.titulo))); }); side.appendChild(h('a', { class: 'lat-s lat-test', href: '#/u/' + uid + '/test' }, h('span', { class: 'lat-n' }, '📝'), h('span', null, 'Autoevaluación'))); };
  actualizarLateral();
  const tabApuntes = h('button', { type: 'button', class: 'tab', role: 'tab', 'aria-selected': String(tab !== 'tutor'), onclick: () => ir('apuntes') }, '📖 Apuntes'), tabTutor = h('button', { type: 'button', class: 'tab', role: 'tab', 'aria-selected': String(tab === 'tutor'), onclick: () => ir('tutor') }, '🎓 Modo tutor', (Estado.tutor(sid) || {}).done ? ' ✓' : '');
  const panel = h('div', { class: 'panel', role: 'tabpanel' });
  function ir(t) { location.hash = '#/u/' + uid + '/s/' + sid + (t === 'tutor' ? '/tutor' : ''); }
  if (tab === 'tutor') Tutor.render(sec, u, panel);
  else {
    panel.appendChild(h('h1', { class: 'sec-h1' }, sec.titulo));
    (sec.bloques || []).forEach((b, i) => { const el = Bloques.renderBloque(b, { sec, unit: u, idx: i }); if (el) panel.appendChild(el); });
    const tieneTutor = !!sec.tutor; panel.appendChild(h('div', { class: 'aviso aviso-consejo cta-tutor' }, h('div', { class: 'aviso-t' }, '🎓 ¿Algo no te ha quedado claro?'), h('p', null, 'Prueba el modo tutor de este apartado: te pregunta, solo te explica lo que falla y termina con un reto.'), tieneTutor ? h('button', { type: 'button', class: 'btn btn-primario', onclick: () => ir('tutor') }, 'Abrir el tutor') : null));
  }
  const prev = secs[ix - 1], next = secs[ix + 1];
  const nav = h('div', { class: 'nav-sec' }, prev ? h('a', { class: 'btn', href: '#/u/' + uid + '/s/' + prev.id }, '← ' + prev.titulo) : h('span'), next ? h('a', { class: 'btn btn-primario', href: '#/u/' + uid + '/s/' + next.id }, next.titulo + ' →') : h('a', { class: 'btn btn-primario', href: '#/u/' + uid + '/test' }, 'Hacer la autoevaluación →'));
  const sel = h('select', { class: 'sel-movil', 'aria-label': 'Ir a otro apartado', onchange: e => { location.hash = '#/u/' + uid + '/s/' + e.target.value; } }, secs.map(s => h('option', { value: s.id, selected: s.id === sid }, s.titulo)));
  const main = h('main', { class: 'principal con-lateral', id: 'contenido' }, side, h('article', { class: 'sec' }, h('nav', { class: 'migas', 'aria-label': 'Ruta' }, h('a', { href: '#/' }, 'Inicio'), ' › ', h('a', { href: '#/u/' + uid }, u.titulo), ' › ', sec.titulo), sel, h('div', { class: 'tabs', role: 'tablist' }, tabApuntes, tabTutor), panel, nav));
  main._actualizar = actualizarLateral; return main;
}
function paginaTest(uid) {
  const c = cfgUnidad(uid), u = w.UNIDADES[uid]; if (!c || c.estado === 'bloqueada' || !u) return avisoPagina('🔒 No disponible', 'Vuelve al inicio.');
  const host = h('div', { class: 'auto' }); const main = h('main', { class: 'principal', id: 'contenido' }, h('nav', { class: 'migas', 'aria-label': 'Ruta' }, h('a', { href: '#/' }, 'Inicio'), ' › ', h('a', { href: '#/u/' + uid }, u.titulo), ' › Autoevaluación'), host);
  Autoeval.render(u, host); return main;
}

/* ---------------- enrutado ---------------- */
let ultimoMain = null;
function pintar() {
  document.body.dataset.modo = modoActual(); document.title = (CFG.asignatura || 'Programación') + ' · ' + (modoActual() === 'pro' ? 'Modo Pro' : 'Aprobar módulo');
  const hash = (location.hash || '#/').replace(/^#\/?/, ''); const p = hash.split('/'); let main;
  if (p[0] === 'u' && p[1]) { if (p[2] === 's' && p[3]) main = paginaSeccion(p[1], p[3], p[4]); else if (p[2] === 'test') main = paginaTest(p[1]); else main = paginaUnidad(p[1]); } else main = portada();
  U.vaciar(root); root.appendChild(h('a', { class: 'salto', href: '#contenido', onclick: e => { e.preventDefault(); const m = document.getElementById('contenido'); m && m.focus(); } }, 'Saltar al contenido')); root.appendChild(cabecera()); main.setAttribute('tabindex', '-1'); root.appendChild(main); root.appendChild(pie()); ultimoMain = main;
}
let hashPrevio = '';
w.addEventListener('hashchange', () => { const antes = hashPrevio; hashPrevio = location.hash; pintar(); if ((location.hash.split('/s/')[0] !== antes.split('/s/')[0]) || location.hash.indexOf('/s/') < 0 || antes.split('/')[4] !== location.hash.split('/')[4] || antes !== location.hash) window.scrollTo(0, 0); });
document.addEventListener('progreso', () => { if (ultimoMain && ultimoMain._actualizar) ultimoMain._actualizar(); });
document.addEventListener('ir-apuntes', () => { const p = location.hash.split('/'); location.hash = p.slice(0, 5).join('/'); });
hashPrevio = location.hash; pintar();
})(window);
