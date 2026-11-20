/* Modo tutor: evaluación inicial → explicaciones solo de lo fallado → reto final.
 * No usa ninguna IA: cuando hace falta feedback "de calidad", genera un prompt listo para copiar. */
(function (w) {
'use strict';
const { h, md, mdEl, hl } = U;
const B = () => w.Bloques;

function render(sec, unit, host) {
  const T = sec.tutor; U.vaciar(host);
  if (!T) { host.appendChild(h('div', { class: 'aviso aviso-info' }, 'Esta sección aún no tiene modo tutor.')); return; }
  const pro = Estado.modo === 'pro'; const chat = h('div', { class: 'chat', 'aria-live': 'polite' });
  const prev = Estado.tutor(sec.id);
  host.appendChild(h('div', { class: 'tutor-cab' }, h('div', null, h('h3', null, '🎓 Modo tutor: ', sec.titulo), h('p', { class: 'peq' }, 'Un recorrido guiado: te pregunto primero; si lo dominas, me salto la teoría. Si no, vamos paso a paso y terminamos con un reto.')), prev && prev.done ? h('span', { class: 'chip chip-ok' }, '✓ Completado') : null));
  host.appendChild(chat);
  const bubble = (cls, ...kids) => { const b = h('div', { class: 'burbuja ' + cls }, ...kids); chat.appendChild(b); b.scrollIntoView && setTimeout(() => b.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 30); return b; };
  const say = (html) => bubble('tutor', h('div', { class: 'avatar', 'aria-hidden': 'true' }, '🎓'), h('div', { class: 'texto', html: md(html) }));
  const cont = (txt, fn) => { const b = B().boton(txt, () => { b.disabled = true; fn(); }, 'btn-primario'); const w2 = h('div', { class: 'burbuja alumno-acc' }, b); chat.appendChild(w2); return w2; };
  const state = { res: [], fallos: [], pasosHechos: 0, pasosFallados: 0 };

  say(T.intro || ('Vamos con **' + sec.titulo + '**. Primero unas preguntas rápidas para ver qué dominas.'));
  const ini = T.inicial || [];
  let qi = 0;
  function preguntaInicial() {
    if (qi >= ini.length) return resultadoInicial();
    const q = ini[qi]; const b = bubble('tutor-q', h('div', { class: 'avatar', 'aria-hidden': 'true' }, '❓'), h('div', { class: 'texto' }, h('div', { class: 'peq' }, 'Pregunta ' + (qi + 1) + ' de ' + ini.length), mdEl(q.p, 'enun')));
    const host2 = b.querySelector('.texto'); const idx = qi;
    B().pintarTest(host2, q, { sec, unit }, ok => { state.res[idx] = ok; if (!ok) state.fallos.push(idx); qi++; const next = cont(qi >= ini.length ? 'Ver resultado' : 'Siguiente pregunta', () => { next.remove(); preguntaInicial(); }); });
  }
  function resultadoInicial() {
    const total = ini.length, bien = state.res.filter(Boolean).length;
    if (!total) { say('No hay preguntas iniciales: vamos directos a los pasos.'); state.fallos = [-1]; }
    else if (!state.fallos.length) { say('**' + bien + '/' + total + ': ¡lo dominas!** Me salto las explicaciones y vamos directos al reto final.'); return reto(); }
    else say('**' + bien + '/' + total + '.** Repasamos solo lo que ha fallado, sin repetir lo que ya sabes.');
    const pasos = (T.pasos || []).filter(p => !p.cubre || p.cubre.some(i => state.fallos.includes(i)) || state.fallos.includes(-1));
    if (!pasos.length) return reto(); paso(pasos, 0);
  }
  function paso(pasos, i) {
    if (i >= pasos.length) { say('Hecho el repaso. Ahora **demuestra lo que has aprendido**.'); return reto(); }
    const p = pasos[i]; const cuerpo = h('div', { class: 'texto' }, h('div', { class: 'peq' }, 'Paso ' + (i + 1) + ' de ' + pasos.length), h('h4', null, p.titulo), mdEl(p.explica));
    if (p.ejemplo) cuerpo.appendChild(B().bloqueCodigo(p.ejemplo));
    const b = bubble('tutor', h('div', { class: 'avatar', 'aria-hidden': 'true' }, '🎓'), cuerpo);
    const extra = h('div', { class: 'extra' });
    const acc = h('div', { class: 'fila acc-paso' });
    if (p.extra) acc.appendChild(B().boton('🤔 Sigo sin entenderlo', () => { extra.appendChild(h('div', { class: 'aviso aviso-info' }, h('div', { class: 'aviso-t' }, 'Otra forma de verlo'), mdEl(p.extra))); }));
    if (p.profundiza) acc.appendChild(B().boton('🔎 Quiero profundizar', () => { extra.appendChild(h('div', { class: 'aviso aviso-consejo' }, h('div', { class: 'aviso-t' }, 'Para ir más lejos'), mdEl(p.profundiza))); }));
    cuerpo.appendChild(acc); cuerpo.appendChild(extra);
    cuerpo.appendChild(B().panelIA(() => ({ unidad: unit.titulo, seccion: sec.titulo, modo: Estado.modo, tipo: 'Duda sobre un concepto (modo tutor)', enunciado: 'No termino de entender este concepto: «' + p.titulo + '». Explicación que me han dado:\n' + p.explica, respuesta: 'Lo que no entiendo es: (escribe aquí tu duda concreta antes de enviar)', esperado: ['Explícamelo de otra manera, con un ejemplo distinto al de los apuntes', 'Después hazme 2 preguntas cortas para comprobar que lo he entendido'] })));
    if (!p.pregunta) { const n = cont('Entendido, sigamos', () => { n.remove(); paso(pasos, i + 1); }); return; }
    const q = p.pregunta; let intentos = 0;
    const qb = bubble('tutor-q', h('div', { class: 'avatar', 'aria-hidden': 'true' }, '❓'), h('div', { class: 'texto' }, mdEl(q.p, 'enun')));
    B().pintarTest(qb.querySelector('.texto'), q, { sec, unit }, ok => {
      intentos++; state.pasosHechos++;
      if (!ok) { state.pasosFallados++; if (q.pista) say('💡 **Pista:** ' + q.pista); }
      const n = cont(i + 1 >= pasos.length ? 'Ir al reto final' : 'Siguiente paso', () => { n.remove(); paso(pasos, i + 1); });
    });
  }
  function reto() {
    const r = (pro && T.retoPro) || T.reto;
    if (!r) return fin(true);
    say(pro ? '🏆 **Reto final (modo Pro).** Es más grande: planifica antes de escribir.' : '🏁 **Reto final.** Hazlo tú; las pruebas te dirán si va bien.');
    const id = 'tutor:' + sec.id + ':reto' + (pro ? ':pro' : ''); const blk = Object.assign({ t: 'ejecuta', id }, r);
    const el = B().renderBloque(blk, { sec, unit, idx: 'tutor', siempre: true });
    chat.appendChild(h('div', { class: 'burbuja reto-b' }, el));
    const finBtn = cont('Terminar el tutor', () => { if (!Estado.ok(id) && r.tests) { finBtn.querySelector('button').disabled = false; B().feedback(el.querySelector('.tarjeta-body') || el, null, 'Todavía no pasa las pruebas. Resuélvelo (o pide pistas) y vuelve a pulsar «Terminar».'); return; } fin(false); });
  }
  function fin(sinReto) {
    const total = ini.length, bien = state.res.filter(Boolean).length;
    Estado.tutor(sec.id, { done: true, inicial: bien + '/' + total, fecha: new Date().toISOString().slice(0, 10) });
    document.dispatchEvent(new CustomEvent('progreso'));
    say('🎉 **Sección completada.** Evaluación inicial: ' + bien + '/' + total + (state.pasosHechos ? '; preguntas de repaso con fallo: ' + state.pasosFallados + '/' + state.pasosHechos : '') + '. ' + (pro ? 'Si quieres más, mira los retos Pro de los apuntes.' : 'Si te ha costado, vuelve a leer los apuntes de esta sección y repite el tutor mañana: se aprende mejor repartido en el tiempo.'));
    const b = h('div', { class: 'burbuja alumno-acc fila' }, B().boton('↺ Repetir el tutor', () => render(sec, unit, host)), B().boton('📖 Volver a los apuntes', () => { document.dispatchEvent(new CustomEvent('ir-apuntes')); }));
    chat.appendChild(b);
  }
  cont('Empezar la evaluación inicial', () => preguntaInicial());
}
w.Tutor = { render };
})(window);
