/* ============================================================================
 *  CONFIGURACIÓN DE LA APP — este es el archivo que editas para desbloquear unidades.
 *
 *  estado de cada unidad:
 *    "repaso"    → tema ya visto: abierto, aparece con la etiqueta «Repaso».
 *    "actual"    → el tema en el que estamos: abierto y destacado en la portada.
 *    "bloqueada" → solo se ve el título; el contenido ni siquiera se carga.
 *
 *  Para desbloquear una unidad: cambia "bloqueada" por "actual" (o "repaso") y guarda.
 *  Si subes la web a GitHub Pages, haz commit del cambio y en un minuto está publicado.
 *  (Ojo: «bloqueada» oculta el contenido en la app, pero no es seguridad: si no quieres
 *   que el contenido esté en el repositorio, no subas todavía su archivo .js.)
 * ============================================================================ */
window.CONFIG = {
  asignatura: "Programación",
  curso: "1.º DAW",
  centro: "IES D. Antonio Hellín Costa",
  version: "1.1",
  unidades: [
    { id: "ut1", estado: "repaso", archivo: "contenido/ut1.js" },
    { id: "ut2", estado: "repaso", archivo: "contenido/ut2.js" },
    { id: "ut3", estado: "repaso", archivo: "contenido/ut3.js" },
    { id: "ut4", estado: "actual", archivo: "contenido/ut4.js" },
    { id: "ut5", estado: "bloqueada", titulo: "UT5. Entrada y salida de datos", archivo: "contenido/ut5.js" }
  ]
};
