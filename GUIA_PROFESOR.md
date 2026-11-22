# Guía del profesor · App de Programación 1.º DAW

Web estática (HTML + CSS + JS, sin frameworks ni servidor). Funciona de dos formas:

- **Offline:** doble clic en `index.html`.
- **GitHub Pages:** súbela a un repositorio → *Settings → Pages → Deploy from a branch → main / (root)*. El archivo `.nojekyll` ya está incluido.

El progreso del alumno se guarda **solo en su navegador** (`localStorage`). No hay cuentas, servidor ni envío de datos. Cada alumno puede exportar/importar su progreso desde el pie de la página.

## 1. Estructura

```
index.html          carga todo
config.js           ← LO QUE EDITAS PARA DESBLOQUEAR UNIDADES
contenido/utN.js    contenido de cada unidad (apuntes, ejercicios, tutor, banco de preguntas)
css/estilos.css     aspecto (modo "Aprobar" y modo "Pro")
js/                 motor (no hace falta tocarlo)
  java-sim.js, java-run.js   mini intérprete de Java
tests/              validadores y pruebas (opcionales)
```

## 2. Desbloquear una unidad (`config.js`)

Cada unidad tiene un `estado`:

| estado | efecto |
|---|---|
| `"repaso"` | abierta, con etiqueta «Repaso» |
| `"actual"` | abierta y destacada en portada |
| `"bloqueada"` | solo se ve el título; **el archivo ni se carga** |

### Ir desbloqueando unidades, paso a paso

Hay un único cambio por unidad: la línea de esa unidad en `config.js`. El fichero `contenido/utN.js` ya existe para UT1-UT5.

1. **Al empezar un tema:** pon ese tema en `"actual"` y el anterior en `"repaso"`. Ejemplo para trabajar la UT5:
   ```js
   { id: "ut4", estado: "repaso", archivo: "contenido/ut4.js" },
   { id: "ut5", estado: "actual", archivo: "contenido/ut5.js" }
   ```
2. **Si quieres adelantar un tema pero no destacarlo:** `"repaso"` lo abre sin destacarlo.
3. **Para volver a cerrarlo:** `"bloqueada"` (necesita un `titulo` en la línea para mostrarlo en la portada; ya está puesto en UT5).
4. Guarda, haz commit y push (o, sin GitHub, vuelve a copiar la carpeta). En GitHub Pages tarda ~1 minuto; el alumno recarga la página con Ctrl+F5.
5. El progreso de los alumnos **no se pierde** al cambiar estados.

Estado actual de esta versión: UT1 y UT2 «repaso», UT3 «repaso», **UT4 «actual»**, UT5 «bloqueada».

**UT6-UT9:** todavía no existen (no hay apuntes ni contenido). Cuando los tengas: crea `contenido/ut6.js` (copiando el formato de `ut4.js`), añade la línea `{ id: "ut6", estado: "bloqueada", titulo: "UT6. ...", archivo: "contenido/ut6.js" }` en `config.js`, y desbloquéala cuando toque.

> **Ojo:** «bloqueada» no es seguridad. Si no quieres que el contenido sea visible, **no subas todavía su `.js`** al repositorio.

## 3. Modos

Interruptor único arriba: **Aprobar módulo** (esencial, claro, sin ruido) / **Modo Pro** (más profundidad, bloques extra y retos grandes). Cualquier bloque con `modo:'pro'` solo se muestra en Pro. Los bloques `profundizar` salen cerrados por defecto.

## 4. Formato de una unidad

`contenido/utN.js` llama a `registrarUnidad({...})`:

```js
registrarUnidad({
  id: "ut3", titulo: "UT3. …", ra: "RA3. …", resumen: "…",
  aprenderas: ["…", "…"],
  testN: 20,                       // preguntas de cada autoevaluación
  secciones: [ { id, titulo, resumen, bloques: [...], tutor: {...} } ],
  banco: [ { sec, p, o, c, e } ]   // banco de preguntas (mín. 1,5 × testN)
});
```

### Bloques (`t` = tipo)

```js
{ t:'texto',  md:"Markdown con `código` y **negrita**" }
{ t:'codigo', titulo:"Ejemplo", code:"int x = 3;", ejecutable:true, stdin:"5\n", salida:"3" }
{ t:'aviso',  tipo:'clave'|'cuidado'|'consejo'|'pro'|'info', titulo:"…", md:"…" }
{ t:'profundizar', titulo:"¿Por qué …?", bloques:[ ...otros bloques ] }   // cerrado por defecto
{ t:'tabla',  cab:["A","B"], filas:[["1","2"]] }
{ t:'memoria', variables:[…], objetos:[…] }                                // diagrama pila/montón con flechas
{ t:'test',   p:"Pregunta", o:["a","b","c"], c:1, e:"Explicación" }          // c puede ser array (varias correctas)
{ t:'ordenar', p:"…", items:["orden correcto 1","2","3"], codigo:true }     // se barajan solos
{ t:'relacionar', p:"…", pares:[["izq","der"],["izq","der"]] }
{ t:'huecos', p:"…", codigo:"for (int i={{0}}; i<{{n}}; i++)" }             // {{respuesta}}
{ t:'predecir', p:"¿Qué imprime?", code:"…", salida:"…" }
{ t:'traza',  code:"…", cols:["i","suma"], filas:[["0","0"],["1","1"]] }
{ t:'ejecuta', p:"Enunciado", inicial:"código", solucion:"código",
  tests:[{ in:"1\n", out:"Lunes" }], pistas:["…"] }                  // pasa las pruebas en el simulador
{ t:'reto', titulo:"…", p:"…", requisitos:[…], inicial, tests, solucion }    // por defecto solo en Pro
{ t:'abierta', p:"…", modelo:"respuesta modelo", rubrica:["criterio 1","criterio 2"] }
{ t:'practica', titulo:"…", p:"…", pasos:[{ t:"Paso 1", md:"…", code:"…", check:"…" }] }
```

Todos aceptan `id` (para guardar progreso) y `modo:'pro'`. Mira `contenido/ut3.js` para ver ejemplos reales de cada uno.

### Tutor por sección

```js
tutor: { intro, inicial:[ {p,o,c,e} … ],           // preguntas de diagnóstico
         pasos:[ { titulo, cubre:[0,2], explica, ejemplo, pregunta:{p,o,c,e,pista},
                   extra, profundiza } ],
         reto:{ p, inicial, tests, solucion }, retoPro:{…} }
```

El tutor solo explica los pasos cuyo `cubre` incluye alguna pregunta inicial fallada. Si el alumno no entiende, pulsa «Sigo sin entenderlo» (`extra`) o «Quiero profundizar» (`profundiza`). Cada paso tiene además un **prompt para copiar a una IA externa**, con aviso de no pegar contraseñas, claves ni datos personales.

### Autoevaluación

Por unidad: +1 acierto, −1/3 fallo, 0 en blanco. Saca `testN` preguntas al azar del `banco` y al final lista las secciones que conviene repasar. Nota orientativa, no oficial.

## 5. Límites del simulador de Java

Es un subconjunto escrito desde cero y contrastado con Java 21 real (`tests/diff.js`).

- Sí: tipos primitivos, String, arrays (también 2D), `Scanner`, `Math`, `Random` (semilla), `ArrayList`/`List`, `Arrays`, `printf`/`String.format` (con coma decimal, locale es_ES), clases simples, excepciones, `switch` clásico y con flechas.
- Desde la v1.1: bloques de texto `"""`, `LocalDate`/`LocalDateTime` con `DateTimeFormatter` (incluidos `EEEE`/`MMMM` y `Locale`), y error de **acceso a miembros `private`** desde otra clase.
- **No:** comprobación de *checked exceptions*, `BigDecimal`, `Map`, `Set`, `enum`, `record`, lambdas/streams, clases internas, hilos, `List.of`, **ficheros** (`File`, `Files`, `FileReader`…) ni **Swing**.
- **UT5:** el código de ficheros y de Swing no se ejecuta en la app (hay que probarlo en el IDE): se estudia con tests, ordenar, huecos, relacionar, preguntas abiertas y prácticas guiadas. Todo ese código está compilado con `javac` al generar el contenido.
- Si usas `Scanner`, `Random`, `ArrayList`, etc. **sin `import`**, da error de compilación (como en Java). Esa comprobación cubre una lista fija de clases.
- Si algo no está soportado, la app lo dice y sugiere probarlo en el IDE.

## 6. Comprobar el contenido antes de publicar

Requiere Node.js (y `java` solo para `--java`):

```
node tests/validar_contenido.js            # todas las unidades
node tests/validar_contenido.js ut3        # una
node tests/validar_contenido.js ut3 --java # además contrasta salidas con Java real
node tests/ejecutables.js ut5              # ejecuta todo el código «ejecutable» de la unidad en el simulador y en Java real
node tests/diff.js                         # contrasta el simulador con Java real
```

Revisa: índices de respuesta, nº de opciones, filas de traza, cobertura del tutor (`cubre`), `sec` del banco, tamaño mínimo del banco, que cada solución pase sus pruebas y que el código inicial no las pase ya.

## 7. Añadir una unidad nueva (UT6 en adelante)

1. Copia `contenido/ut4.js` como `contenido/ut6.js` y sustituye el contenido manteniendo el formato (sección 4).
2. En `config.js`, añade su línea (empieza en `"bloqueada"` con `titulo`).
3. Ejecuta `node tests/validar_contenido.js ut6` y, si hay código ejecutable, `node tests/ejecutables.js ut6`.
4. Commit y push; cuando toque, cámbiala a `"actual"`.
