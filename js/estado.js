/* Progreso del alumno: SOLO localStorage del navegador. Sin cuentas, sin servidor, sin datos personales. */
(function (w) {
'use strict';
const KEY = 'daw1_programacion_v1';
const base = () => ({ v: 1, modo: 'aprobar', ok: {}, vistos: {}, tutor: {}, auto: {}, notas: {} });
let S = base(); let persiste = true;
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(base(), JSON.parse(raw)); } catch (e) { persiste = false; }
function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); persiste = true; } catch (e) { persiste = false; } }

const TIPOS_INTERACTIVOS = new Set(['test', 'ordenar', 'relacionar', 'huecos', 'predecir', 'ejecuta', 'reto', 'abierta', 'practica', 'traza']);
const visible = (b, modo) => !b.modo || b.modo === modo;
const idDe = (sec, i, b) => b.id || (sec.id + '#' + i);

w.Estado = {
  get modo() { return S.modo; },
  setModo(m) { S.modo = m === 'pro' ? 'pro' : 'aprobar'; guardar(); },
  get persiste() { return persiste; },
  ok(id) { return !!S.ok[id]; },
  marcar(id, val) { if (val === false) delete S.ok[id]; else S.ok[id] = 1; guardar(); },
  nota(id, texto) { if (texto === undefined) return S.notas[id] || ''; S.notas[id] = texto; guardar(); },
  visto(secId) { if (!S.vistos[secId]) { S.vistos[secId] = 1; guardar(); } },
  esVisto(secId) { return !!S.vistos[secId]; },
  tutor(secId, val) { if (val === undefined) return S.tutor[secId] || null; S.tutor[secId] = val; guardar(); },
  auto(utId) { return S.auto[utId] || []; },
  guardarAuto(utId, res) { (S.auto[utId] = S.auto[utId] || []).push(res); S.auto[utId] = S.auto[utId].slice(-10); guardar(); },
  idDe, visible,
  bloquesInteractivos(sec, modo) { const r = []; (sec.bloques || []).forEach((b, i) => { if (TIPOS_INTERACTIVOS.has(b.t) && visible(b, modo)) r.push(idDe(sec, i, b)); }); return r; },
  progresoSeccion(sec, modo) { const ids = this.bloquesInteractivos(sec, modo); if (!ids.length) return this.esVisto(sec.id) ? 1 : 0; return ids.filter(id => S.ok[id]).length / ids.length; },
  progresoUnidad(u, modo) { if (!u.secciones || !u.secciones.length) return 0; return u.secciones.reduce((a, s) => a + this.progresoSeccion(s, modo), 0) / u.secciones.length; },
  exportar() { return JSON.stringify(S); },
  importar(texto) { const o = JSON.parse(texto); if (!o || typeof o !== 'object' || o.v !== 1) throw new Error('Archivo no válido'); S = Object.assign(base(), o); guardar(); },
  reiniciar() { S = base(); guardar(); }
};
})(window);
