/* UT4 · Programación organizada en clases — contenido editable (formato documentado en GUIA_PROFESOR.md). */

registrarUnidad({
  id: "ut4",
  titulo: "UT4. Programación organizada en clases",
  ra: "RA4. Desarrolla programas organizados en clases analizando y aplicando los principios de la programación orientada a objetos.",
  resumen: "En la UT2 usabas clases ajenas; ahora las escribes tú. Aprenderás a diseñar clases, proteger sus datos, crear objetos válidos, reutilizar código con herencia y organizar todo en paquetes.",
  aprenderas: [
    "Reconocer y escribir la estructura de una clase: propiedades, constructores y métodos",
    "Controlar quién ve y modifica los datos con la visibilidad y la encapsulación",
    "Crear constructores (también sobrecargados) y métodos con parámetros y valor de retorno",
    "Hacer colaborar objetos de tus propias clases (composición)",
    "Reutilizar código con herencia y compartir datos con `static`",
    "Organizar las clases en paquetes y empaquetarlas en una librería `.jar`"
  ],
  testN: 20,

  /* ===================== APUNTES POR SECCIONES ===================== */
  secciones: [
    {
      id: "ut4-concepto",
      titulo: "Concepto de clase: nuestros propios tipos",
      resumen: "Por qué escribir tus clases, cómo decidir cuáles necesitas y primer contacto con un tipo propio.",
      bloques: [
        {
          t: "texto",
          md: `Hasta ahora, para guardar un producto de Náutica Bahía declarábamos **una variable por dato**:
\`\`\`
String nombre1 = "Kayak Bahía 2";   double precio1 = 249.90;   int stock1 = 5;
String nombre2 = "Chaleco";         double precio2 = 34.50;    int stock2 = 20;
// ... ¿y los otros 98 productos?
\`\`\`
Esto no escala y tiene un problema más sutil: **nada une** \`nombre1\`, \`precio1\` y \`stock1\`. Para el programa son tres variables sueltas; somos nosotros los que sabemos que pertenecen al mismo producto. Y las operaciones sobre un producto (calcular el precio con IVA, vender unidades) tampoco están unidas a sus datos.

La programación orientada a objetos lo resuelve **creando nuestros propios tipos de datos**. Una **clase** dice qué **datos** guarda (*propiedades* o *atributos*) y qué **operaciones** sabe hacer (*métodos*). En la UT2 aprendiste a **usar** clases de Java (\`String\`, \`Scanner\`, \`LocalDate\`…). En esta unidad vas a **escribir** las tuyas.`
        },
        {
          t: "texto",
          md: "La clase más sencilla posible para un producto tiene solo datos. Al declararla nace un **tipo nuevo**, `Producto`, igual que `int` o `String`: ya puedes declarar variables de ese tipo y crear objetos con `new`."
        },
        {
          t: "codigo",
          titulo: "Producto.java + App.java (juntos para poder ejecutarlos)",
          code: `class Producto {
    String nombre;
    double precio;
    int stock;
}

public class App {
    public static void main(String[] args) {
        Producto kayak = new Producto();
        kayak.nombre = "Kayak Bahía 2";
        kayak.precio = 249.90;
        kayak.stock = 5;

        Producto chaleco = new Producto();
        chaleco.nombre = "Chaleco salvavidas";
        chaleco.precio = 34.50;
        chaleco.stock = 20;

        System.out.println(kayak.nombre + ": " + kayak.precio + " euros");
        System.out.println(chaleco.nombre + ": " + chaleco.precio + " euros");
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "info",
          md: "En tu IDE, cada **clase pública** va en **su propio archivo** con el mismo nombre (`Producto.java`, `App.java`). Aquí las ponemos juntas, sin `public` salvo la que tiene el `main`, solo para que se puedan ejecutar en el navegador. En un programa típico hay **clases del modelo** (los datos de la empresa: `Producto`, `Cliente`…) y **una clase con el `main`** que las usa."
        },
        {
          t: "texto",
          md: "Cada objeto tiene **sus propios valores**: cambiar `kayak.stock` no afecta a `chaleco.stock`. Es la **identidad** de la UT2. Y recuerda que `kayak` y `chaleco` no contienen el objeto, sino una **referencia** a él."
        },
        {
          t: "memoria",
          titulo: "Dos objetos, dos conjuntos de datos independientes",
          variables: [
            { n: "kayak", tipo: "Producto", ref: "o1" },
            { n: "chaleco", tipo: "Producto", ref: "o2" }
          ],
          objetos: [
            {
              id: "o1",
              clase: "Producto",
              campos: [
                { n: "nombre", v: "\"Kayak Bahía 2\"" },
                { n: "precio", v: 249.9 },
                { n: "stock", v: 5 }
              ]
            },
            {
              id: "o2",
              clase: "Producto",
              campos: [
                { n: "nombre", v: "\"Chaleco salvavidas\"" },
                { n: "precio", v: 34.5 },
                { n: "stock", v: 20 }
              ]
            }
          ]
        },
        {
          t: "predecir",
          p: "¿Qué muestra? Piensa en cajas y flechas.",
          code: `class Producto { int stock; }

public class Main {
    public static void main(String[] args) {
        Producto a = new Producto();
        a.stock = 5;
        Producto b = new Producto();
        b.stock = 5;
        Producto c = a;
        c.stock = 9;
        System.out.println(a.stock + " " + b.stock + " " + c.stock);
    }
}`,
          salida: "9 5 9",
          e: "`c = a` copia la **referencia**: `a` y `c` apuntan al mismo objeto, y cambiarlo desde `c` se ve desde `a`. `b` es otro objeto distinto, aunque empezara igual."
        },
        {
          t: "texto",
          md: `### Cómo decidir qué clases necesito
Hay un truco muy útil para empezar a diseñar. Lee la descripción del problema y fíjate en las palabras:
- Los **sustantivos** suelen ser **clases** (producto, cliente, alquiler).
- Las **características** de esos sustantivos suelen ser **propiedades** (nombre, precio, stock).
- Los **verbos** suelen ser **métodos** (vender, alquilar, calcular el total).`
        },
        {
          t: "relacionar",
          p: "Lee el enunciado: «Un **cliente** tiene un nombre y un teléfono. Puede **alquilar** una tabla durante unas horas y la tienda **calcula el total**.» Relaciona cada palabra con su papel en el diseño.",
          pares: [
            ["cliente", "clase"],
            ["nombre y teléfono", "propiedades"],
            ["alquilar", "método"],
            ["calcular el total", "método"]
          ],
          e: "Sustantivo → clase; características → propiedades; verbos → métodos."
        },
        {
          t: "texto",
          md: "Un **diagrama de clases** resume el resultado con tres cajas: el nombre, las propiedades y los métodos. El signo `-` indica privado y `+` público (lo verás en la siguiente sección). Basta con dibujarlo a mano **antes de programar**:"
        },
        {
          t: "codigo",
          titulo: "Diagrama de clases (UML) de Producto",
          code: `+----------------------------------+
|            Producto              |
+----------------------------------+
| - codigo: String                 |
| - nombre: String                 |
| - precio: double                 |
| - stock: int                     |
+----------------------------------+
| + calcularPrecioConIva(): double |
| + vender(unidades: int): void    |
| + toString(): String             |
+----------------------------------+`
        },
        {
          t: "profundizar",
          titulo: "¿Una clase es lo mismo que un tipo?",
          bloques: [
            {
              t: "texto",
              md: `Sí, y es una buena forma de pensarlo. Un **tipo** es un conjunto de valores más las operaciones que se pueden hacer con ellos: \`int\` son los enteros más \`+\`, \`-\`, \`*\`… Una clase hace lo mismo con **tus** valores: los objetos \`Producto\` más los métodos que definas (\`vender\`, \`calcularPrecioConIva\`).

Por eso, cuando escribes una clase, estás **ampliando el lenguaje**: a partir de ahora Java «sabe» lo que es un \`Producto\`.`
            }
          ]
        },
        {
          t: "ejecuta",
          p: `**Tu primera clase.** Completa la clase \`Embarcacion\` con las propiedades \`String matricula\`, \`String nombre\` y \`double eslora\` (en metros). En el \`main\` ya está creada la primera embarcación; crea una segunda y muestra las dos con este formato:
\`\`\`
Brisa (B-101): 8.5 m
Gaviota (B-202): 12.0 m
\`\`\``,
          inicial: `class Embarcacion {
    // TODO: propiedades
}

public class App {
    public static void main(String[] args) {
        Embarcacion e1 = new Embarcacion();
        e1.matricula = "B-101";
        e1.nombre = "Brisa";
        e1.eslora = 8.5;
        System.out.println(e1.nombre + " (" + e1.matricula + "): " + e1.eslora + " m");
        // TODO: segunda embarcación: Gaviota, B-202, 12.0
    }
}`,
          tests: [
            {
              out: `Brisa (B-101): 8.5 m
Gaviota (B-202): 12.0 m`
            }
          ],
          pistas: [
            "Las propiedades se declaran como variables, dentro de la clase y fuera de cualquier método.",
            "Cada embarcación necesita su propio `new Embarcacion()`."
          ],
          solucion: `class Embarcacion {
    String matricula;
    String nombre;
    double eslora;
}

public class App {
    public static void main(String[] args) {
        Embarcacion e1 = new Embarcacion();
        e1.matricula = "B-101";
        e1.nombre = "Brisa";
        e1.eslora = 8.5;
        System.out.println(e1.nombre + " (" + e1.matricula + "): " + e1.eslora + " m");
        Embarcacion e2 = new Embarcacion();
        e2.matricula = "B-202";
        e2.nombre = "Gaviota";
        e2.eslora = 12.0;
        System.out.println(e2.nombre + " (" + e2.matricula + "): " + e2.eslora + " m");
    }
}`
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Antes de programar, dibuja el diagrama de clases **a mano**. Es la herramienta más barata para detectar un mal diseño: si no sabes qué propiedades o métodos poner en una caja, probablemente esa clase no debería existir o está mal planteada.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Empezamos con el **concepto de clase**. Tres preguntas rápidas para ver por dónde vas.",
        inicial: [
          {
            p: "¿Qué es una clase?",
            o: [
              "Un objeto concreto con sus datos",
              "La definición de un tipo: qué datos guarda y qué operaciones sabe hacer",
              "Un método especial",
              "Un paquete de Java"
            ],
            c: 1,
            e: "La clase es el molde; con `new` se crean objetos a partir de ella."
          },
          {
            p: "Con `Producto a = new Producto(); Producto b = a;` ¿cuántos objetos hay?",
            o: ["Dos", "Uno, con dos referencias", "Ninguno", "Depende de las propiedades"],
            c: 1,
            e: "`b = a` copia la referencia, no el objeto."
          },
          {
            p: "Al leer «el cliente alquila una tabla», ¿qué palabra suele ser un método?",
            o: ["cliente", "tabla", "alquila", "una"],
            c: 2,
            e: "Los verbos suelen ser métodos; los sustantivos, clases."
          }
        ],
        pasos: [
          {
            titulo: "Una clase es un tipo nuevo",
            cubre: [0],
            explica: "Una **clase** define un tipo: sus **propiedades** (datos) y sus **métodos** (operaciones). Con `new Producto()` creas un **objeto** de ese tipo, y cada objeto tiene sus propios valores.",
            ejemplo: {
              code: `class Producto {
    String nombre;
    int stock;
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();
        p.nombre = "Kayak";
        p.stock = 5;
        System.out.println(p.nombre + " " + p.stock);
    }
}`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "¿Qué crea `new Producto()`?",
              o: [
                "Una clase nueva",
                "Un objeto de la clase Producto",
                "Una variable llamada Producto",
                "Un método"
              ],
              c: 1,
              e: "`new` crea un objeto a partir del molde."
            },
            extra: "Piensa en el plano de una casa (la clase) y en las casas construidas con ese plano (los objetos). Todas siguen el mismo plano, pero cada una tiene sus muebles."
          },
          {
            titulo: "Referencias: la flecha, no el objeto",
            cubre: [1],
            explica: "Una variable de tipo `Producto` guarda una **referencia** (una flecha) al objeto. Copiar la variable copia la flecha: las dos apuntan al **mismo** objeto.",
            pregunta: {
              p: "`a` y `b` apuntan al mismo objeto y haces `b.stock = 7`. ¿Cuánto vale `a.stock`?",
              o: ["Lo que valía antes", "7", "0", "Da error"],
              c: 1,
              e: "Es el mismo objeto: el cambio se ve desde las dos variables."
            },
            profundiza: "Esto es justo lo que viste en la UT2 con `Point`. La diferencia es que ahora la clase la has escrito tú."
          },
          {
            titulo: "Del enunciado a las clases",
            cubre: [2],
            explica: "Sustantivos → clases; características → propiedades; verbos → métodos. Dibuja las tres cajas del diagrama antes de escribir código.",
            pregunta: {
              p: "«El alquiler tiene unas horas y un precio.» ¿Qué son «horas» y «precio»?",
              o: ["Clases", "Métodos", "Propiedades", "Paquetes"],
              c: 2,
              e: "Son características del alquiler: propiedades."
            }
          }
        ],
        reto: {
          p: `**Reto final.** Crea la clase \`Cliente\` con las propiedades \`String nombre\` y \`boolean socio\`, y muestra dos clientes con este formato:
\`\`\`
Laura: socio
Pedro: no socio
\`\`\``,
          inicial: `class Cliente {
    // TODO
}

public class App {
    public static void main(String[] args) {
        Cliente c1 = new Cliente();
        // TODO: Laura, socio
        // TODO: Pedro, no socio
    }
}`,
          tests: [
            {
              out: `Laura: socio
Pedro: no socio`
            }
          ],
          solucion: `class Cliente {
    String nombre;
    boolean socio;
}

public class App {
    public static void main(String[] args) {
        Cliente c1 = new Cliente();
        c1.nombre = "Laura";
        c1.socio = true;
        Cliente c2 = new Cliente();
        c2.nombre = "Pedro";
        c2.socio = false;
        System.out.println(c1.nombre + ": " + (c1.socio ? "socio" : "no socio"));
        System.out.println(c2.nombre + ": " + (c2.socio ? "socio" : "no socio"));
    }
}`,
          pistas: ["Un ternario dentro de paréntesis: `(c.socio ? \"socio\" : \"no socio\")`."]
        }
      }
    },

    {
      id: "ut4-visibilidad",
      titulo: "Estructura de una clase y visibilidad",
      resumen: "Los miembros de una clase, quién puede verlos y por qué las propiedades son privadas (encapsulación).",
      bloques: [
        {
          t: "texto",
          md: `Los elementos que se declaran dentro de una clase se llaman **miembros**. Hay tres clases de miembros y, por convención, se escriben siempre en este orden:
1. **Propiedades** (los datos).
2. **Constructores** (cómo se crea un objeto).
3. **Métodos** (lo que sabe hacer).`
        },
        {
          t: "ordenar",
          p: "Ordena los miembros de una clase según la convención.",
          items: ["Propiedades", "Constructores", "Métodos"],
          e: "Primero los datos, luego cómo se crean y al final lo que hacen."
        },
        {
          t: "texto",
          md: `### El problema: cualquiera puede romper el objeto
Con la clase de la sección anterior, cualquiera puede escribir \`kayak.precio = -500;\` y el programa lo acepta sin quejarse. Un producto con precio negativo es un dato absurdo y la clase \`Producto\` **no tiene forma de impedirlo**.

La solución es controlar **quién puede acceder** a cada miembro con un **modificador de visibilidad** escrito delante:`
        },
        {
          t: "tabla",
          titulo: "Los cuatro niveles de visibilidad",
          cab: ["Modificador", "Quién puede acceder"],
          filas: [
            ["`public`", "Cualquier clase del programa"],
            ["`private`", "Solo el código de **la propia clase**"],
            ["*(ninguno)*", "Las clases del **mismo paquete** (ver sección de paquetes)"],
            ["`protected`", "Las clases del mismo paquete y **sus subclases** (ver herencia)"]
          ]
        },
        {
          t: "aviso",
          tipo: "clave",
          md: `**Encapsulación.** Las propiedades son \`private\`; los métodos que forman la «cara pública» de la clase son \`public\`.

Los datos quedan protegidos dentro del objeto y solo se pueden leer o cambiar a través de métodos que la propia clase controla. Así la clase puede **garantizar que sus datos siempre son válidos**: «el precio nunca es negativo» deja de ser un deseo y pasa a ser una regla que el objeto hace cumplir.`
        },
        {
          t: "codigo",
          titulo: "Un acceso prohibido",
          code: `class Producto {
    private String nombre;
    private double precio;
}

public class Main {
    public static void main(String[] args) {
        Producto kayak = new Producto();
        kayak.precio = -500;      // ¿compila?
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: "Pulsa **Ejecutar**: el compilador lo rechaza con `precio has private access in Producto`. Como las propiedades ya no se pueden tocar desde fuera, necesitamos métodos que lo hagan por nosotros: es lo que verás en las dos secciones siguientes."
        },
        {
          t: "test",
          p: "Una propiedad declarada `private` se puede usar…",
          o: [
            "Desde cualquier clase",
            "Solo desde el código de su propia clase",
            "Solo desde las subclases",
            "Solo desde el `main`"
          ],
          c: 1,
          e: "`private` limita el acceso a la propia clase. `protected` añade las subclases y el paquete."
        },
        {
          t: "test",
          p: "Un miembro **sin ningún modificador** es visible desde…",
          o: ["Cualquier clase", "Solo su clase", "Las clases del mismo paquete", "Ninguna"],
          c: 2,
          e: "Es la visibilidad «de paquete»."
        },
        {
          t: "huecos",
          p: "Completa la clase con la visibilidad habitual: propiedades protegidas y método de acceso público.",
          codigo: `public class Cliente {
    {{private}} String nombre;

    {{public}} String getNombre() {
        return nombre;
    }
}`,
          e: "Propiedades `private`, métodos que forman la cara pública `public`."
        },
        {
          t: "profundizar",
          titulo: "¿Por qué no hacer todo `public` y ahorrarse getters y setters?",
          bloques: [
            {
              t: "texto",
              md: `Porque entonces **cualquier parte del programa** puede dejar el objeto en un estado absurdo, y cuando aparece un dato incorrecto no sabes **quién** lo puso. Con propiedades privadas, la única puerta de entrada son los métodos de la clase, y es ahí donde pones las comprobaciones.

Además, la clase puede **cambiar por dentro** (guardar el precio en céntimos, por ejemplo) sin que el resto del programa se entere, mientras mantenga los mismos métodos públicos.`
            }
          ]
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "También las **clases** se declaran `public` (accesibles desde cualquier sitio) o sin modificador (solo desde su paquete). Un error muy típico: olvidar el `public` de una clase del modelo y que otra clase en otro paquete no pueda usarla."
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Invariante de clase**: una condición que debe ser cierta **siempre** que el objeto está «en reposo» (por ejemplo, `precio >= 0` y `stock >= 0`). Todo el diseño de la encapsulación consiste en que el constructor la establezca y que cada método pública la **conserve**. Si puedes escribir la invariante en una frase, sabes qué debe comprobar cada setter.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos la **visibilidad y la encapsulación**.",
        inicial: [
          {
            p: "¿Qué significa `private` en una propiedad?",
            o: [
              "Que solo la ve el `main`",
              "Que solo puede usarse dentro de su propia clase",
              "Que no tiene valor",
              "Que es constante"
            ],
            c: 1,
            e: "`private`: solo la propia clase."
          },
          {
            p: "¿Qué visibilidad se recomienda para las propiedades?",
            o: ["`public`", "`private`", "Ninguna", "`static`"],
            c: 1,
            e: "Encapsulación: propiedades privadas."
          },
          {
            p: "Con `private double precio;` en `Producto`, ¿qué ocurre al escribir `kayak.precio = 5;` en el `main`?",
            o: ["Funciona", "Error de compilación", "Se ignora", "Excepción en ejecución"],
            c: 1,
            e: "El compilador lo rechaza: `precio has private access`."
          }
        ],
        pasos: [
          {
            titulo: "Los cuatro niveles",
            cubre: [0],
            explica: "`public` (todos), `protected` (paquete y subclases), sin modificador (paquete) y `private` (solo la clase). Cuanto más cerrado, más fácil es cambiar la clase sin romper nada.",
            pregunta: {
              p: "¿Qué nivel es el más restrictivo?",
              o: ["`public`", "`protected`", "Sin modificador", "`private`"],
              c: 3,
              e: "`private`."
            }
          },
          {
            titulo: "Encapsulación",
            cubre: [1],
            explica: "Datos privados + métodos públicos que validan. Así el objeto **hace cumplir** sus propias reglas.",
            pregunta: {
              p: "¿Qué ganas con propiedades privadas?",
              o: [
                "Programas más rápidos",
                "Que la clase garantice que sus datos son válidos",
                "Menos líneas de código",
                "Nada"
              ],
              c: 1,
              e: "La clase controla cómo se modifican sus datos."
            },
            extra: "Piensa en la caja fuerte de un banco: no dejas la puerta abierta; hay un mostrador (los métodos públicos) donde se comprueba quién eres y qué pides."
          },
          {
            titulo: "El error de compilación",
            cubre: [2],
            explica: "Acceder desde fuera a una propiedad privada no compila: `precio has private access in Producto`. Es un **error de compilación**, no de ejecución: ni siquiera llega a ejecutarse.",
            ejemplo: {
              code: `class Producto {
    private double precio;
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();
        p.precio = 5;
    }
}`,
              ejecutable: true,
              titulo: "Mira el error"
            },
            pregunta: {
              p: "¿Cuándo detecta Java el acceso prohibido?",
              o: ["Al compilar", "Al ejecutar", "Nunca", "Solo en Pro"],
              c: 0,
              e: "Al compilar: es un error de compilación."
            }
          }
        ],
        reto: {
          p: "**Reto final.** Esta clase deja que cualquiera cambie el stock. Hazlo **privado** y añade el método público `int getStock()`. El `main` debe seguir mostrando `5`.",
          inicial: `class Producto {
    int stock = 5;
}

public class App {
    public static void main(String[] args) {
        Producto p = new Producto();
        System.out.println(p.getStock());
    }
}`,
          tests: [
            { out: "5" }
          ],
          solucion: `class Producto {
    private int stock = 5;

    public int getStock() {
        return stock;
    }
}

public class App {
    public static void main(String[] args) {
        Producto p = new Producto();
        System.out.println(p.getStock());
    }
}`,
          pistas: [
            "Añade `private` delante de `int stock` y escribe el método `public int getStock() { return stock; }`."
          ]
        }
      }
    },

    {
      id: "ut4-propiedades",
      titulo: "Propiedades, getters y setters",
      resumen: "Valores por defecto, propiedades final, acceso controlado con getters/setters y `this`.",
      bloques: [
        {
          t: "texto",
          md: `Una **propiedad** se declara como una variable, dentro de la clase pero fuera de cualquier método, con su visibilidad delante: \`private double precio;\`. Hay cuatro cosas que conviene saber:
- **Tienen valor por defecto.** A diferencia de las variables locales (que Java no deja usar sin inicializar), las propiedades se inicializan solas: \`0\` en los números, \`false\` en los \`boolean\`, \`'\\0'\` en los \`char\` y \`null\` en los objetos, \`String\` incluido.
- **Viven mientras viva el objeto**, no solo durante un método.
- Pueden ser **constantes por objeto** con \`final\`: se asignan una sola vez, en el constructor. Es lo normal para un código o un identificador: \`private final String codigo;\`
- Si dos objetos tienen que **compartir** un dato (un contador, el IVA), la propiedad se declara \`static\` (ver sección de estáticos).`
        },
        {
          t: "predecir",
          p: "¿Qué muestra? Ninguna propiedad se ha inicializado a mano.",
          code: `class Producto {
    String nombre;
    double precio;
    int stock;
    boolean oferta;
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();
        System.out.println(p.nombre + " / " + p.precio + " / " + p.stock + " / " + p.oferta);
    }
}`,
          salida: "null / 0.0 / 0 / false",
          e: "Valores por defecto: `null` para el `String`, `0.0` para `double`, `0` para `int` y `false` para `boolean`."
        },
        {
          t: "relacionar",
          p: "Relaciona cada tipo de propiedad con su valor por defecto.",
          pares: [
            ["int", "0"],
            ["double", "0.0"],
            ["boolean", "false"],
            ["String", "null"]
          ],
          e: "Números: cero; `boolean`: `false`; objetos (incluido `String`): `null`."
        },
        {
          t: "texto",
          md: `### Acceder a las propiedades: getters y setters
Para **leer** una propiedad privada se escribe un método **getter** (\`getAlgo\`); para **modificarla**, un **setter** (\`setAlgo\`). El setter es el sitio donde se **valida**:`
        },
        {
          t: "codigo",
          titulo: "Setter que protege",
          code: `class Producto {
    private String nombre;
    private double precio;

    public String getNombre() {
        return nombre;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        if (precio < 0) {
            throw new IllegalArgumentException("El precio no puede ser negativo: " + precio);
        }
        this.precio = precio;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();
        p.setPrecio(249.9);
        System.out.println(p.getPrecio());
        try {
            p.setPrecio(-500);
        } catch (IllegalArgumentException e) {
            System.out.println("Rechazado: " + e.getMessage());
        }
        System.out.println(p.getPrecio());
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `Fíjate en \`this.precio = precio;\`. Dentro del setter hay **dos** cosas llamadas \`precio\`: el **parámetro** (el valor que llega) y la **propiedad** del objeto. \`this\` significa «**este objeto**», y \`this.precio\` es la propiedad, sin ambigüedad. Si escribieras solo \`precio = precio;\` le asignarías el parámetro a sí mismo y la propiedad **no cambiaría**: un error clásico que no da ningún aviso.

Y aquí reaparecen las excepciones de la UT3: si alguien intenta poner un precio negativo, el setter **lanza una excepción** y quien lo llamó decide qué hacer con ella.`
        },
        {
          t: "predecir",
          p: "¿Qué muestra? (Mira bien el setter.)",
          code: `class Producto {
    private int stock = 5;

    public void setStock(int stock) {
        stock = stock;
    }

    public int getStock() {
        return stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();
        p.setStock(20);
        System.out.println(p.getStock());
    }
}`,
          salida: "5",
          e: "`stock = stock;` asigna el parámetro a sí mismo; la propiedad sigue valiendo 5. Hay que escribir `this.stock = stock;`. Java no avisa de este error."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "**¿Un getter y un setter para todo?** No hace falta crear los dos para cada propiedad. Crea **solo los que haga falta**: un código que nunca cambia (`final`) no necesita setter, y un dato que solo se calcula internamente tampoco. Un setter sin ninguna comprobación equivale a hacer la propiedad `public` con más pasos: pregúntate siempre **qué regla protege**."
        },
        {
          t: "ejecuta",
          p: `**Setter que protege.** Completa \`setStock\` para que lance \`IllegalArgumentException\` con el mensaje \`El stock no puede ser negativo\` si el valor es menor que 0. El \`main\` prueba dos valores y debe mostrar:
\`\`\`
Stock: 12
Rechazado: El stock no puede ser negativo
Stock: 12
\`\`\``,
          inicial: `class Producto {
    private int stock;

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        // TODO: validar
        this.stock = stock;
    }
}

public class App {
    public static void main(String[] args) {
        Producto p = new Producto();
        p.setStock(12);
        System.out.println("Stock: " + p.getStock());
        try {
            p.setStock(-3);
        } catch (IllegalArgumentException e) {
            System.out.println("Rechazado: " + e.getMessage());
        }
        System.out.println("Stock: " + p.getStock());
    }
}`,
          tests: [
            {
              out: `Stock: 12
Rechazado: El stock no puede ser negativo
Stock: 12`
            }
          ],
          pistas: [
            "Comprueba `stock < 0` **antes** de asignar y lanza la excepción con `throw new IllegalArgumentException(\"...\")`."
          ],
          solucion: `class Producto {
    private int stock;

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        if (stock < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        this.stock = stock;
    }
}

public class App {
    public static void main(String[] args) {
        Producto p = new Producto();
        p.setStock(12);
        System.out.println("Stock: " + p.getStock());
        try {
            p.setStock(-3);
        } catch (IllegalArgumentException e) {
            System.out.println("Rechazado: " + e.getMessage());
        }
        System.out.println("Stock: " + p.getStock());
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Por qué el getter de un `boolean` se llama `isAlgo` y no `getAlgo`?",
          bloques: [
            {
              t: "texto",
              md: "Es una convención de Java (y de muchas bibliotecas): para un `boolean`, `isSocio()` se lee como una pregunta («¿es socio?»). Con el resto de tipos se usa `getNombre()`, `getPrecio()`. Los IDE y los *frameworks* esperan estos nombres, así que merece la pena seguirla."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Inmutabilidad.** Una clase con todas las propiedades `final` y sin setters crea objetos que **no cambian** nunca después de construidos (como `String`). Son más fáciles de razonar y no pueden quedar en un estado inválido. Cuando una clase no necesite cambiar, prefiere la inmutabilidad.",
          modo: "pro"
        },
        {
          t: "abierta",
          p: "Explica con tus palabras por qué un setter con una comprobación es mejor que dejar la propiedad `public`. Pon un ejemplo con el precio de un producto de Náutica Bahía.",
          modelo: "Con la propiedad `public`, cualquiera puede escribir `producto.precio = -500` y el objeto queda con un dato absurdo sin que nadie lo impida. Con un setter, la clase comprueba el valor antes de aceptarlo (`if (precio < 0) throw new IllegalArgumentException(...)`), así que el objeto **siempre** conserva datos válidos y, si algo falla, el error se detecta en el punto exacto donde se intentó el cambio.",
          rubrica: [
            "Menciona que el setter valida antes de asignar",
            "Explica que el objeto no queda con datos inválidos",
            "Pone un ejemplo con el precio"
          ],
          minPalabras: 30
        }
      ],
      tutor: {
        intro: "Veamos **propiedades, getters y setters**.",
        inicial: [
          {
            p: "¿Qué valor tiene `private int stock;` si no se inicializa?",
            o: ["No compila", "0", "null", "Un valor al azar"],
            c: 1,
            e: "Las propiedades tienen valor por defecto; en `int`, 0."
          },
          {
            p: "¿Qué hace `this.precio = precio;` en un setter?",
            o: [
              "Asigna la propiedad al parámetro",
              "Asigna el parámetro a la propiedad del objeto",
              "No hace nada",
              "Declara una variable"
            ],
            c: 1,
            e: "`this.precio` es la propiedad; `precio` es el parámetro."
          },
          {
            p: "¿Dónde se pone la comprobación de que el precio no sea negativo?",
            o: ["En el `main`", "En el setter", "En el getter", "En ninguna parte"],
            c: 1,
            e: "En el setter (y el constructor reutiliza el setter)."
          }
        ],
        pasos: [
          {
            titulo: "Valores por defecto",
            cubre: [0],
            explica: "Las **propiedades** se inicializan solas (0, `false`, `null`). Las **variables locales** no: Java no te deja usarlas sin dar valor.",
            pregunta: {
              p: "¿Cuál es el valor por defecto de una propiedad `String`?",
              o: ["`\"\"`", "`null`", "`0`", "No tiene"],
              c: 1,
              e: "Los objetos valen `null`; el texto vacío `\"\"` sería un objeto distinto."
            }
          },
          {
            titulo: "`this` y el error silencioso",
            cubre: [1],
            explica: "`this` = «este objeto». Con el parámetro y la propiedad llamándose igual, `this.stock = stock` asigna al objeto; `stock = stock` no hace nada útil y **no da error**.",
            ejemplo: {
              code: `class P {
    int stock = 5;
    void mal(int stock) { stock = stock; }
    void bien(int stock) { this.stock = stock; }
}

public class Main {
    public static void main(String[] args) {
        P p = new P();
        p.mal(20);
        System.out.println(p.stock);
        p.bien(20);
        System.out.println(p.stock);
    }
}`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "¿Qué ocurre con `stock = stock;` en un setter?",
              o: ["Error de compilación", "La propiedad no cambia", "La propiedad vale 0", "Lanza excepción"],
              c: 1,
              e: "Asigna el parámetro a sí mismo: la propiedad no cambia."
            }
          },
          {
            titulo: "El setter valida",
            cubre: [2],
            explica: "El setter es la **única puerta** de entrada de los datos: ahí compruebas la regla y lanzas `IllegalArgumentException` si no se cumple. Getters y setters solo si hacen falta.",
            pregunta: {
              p: "¿Qué excepción se lanza normalmente para un argumento incorrecto?",
              o: [
                "`ArithmeticException`",
                "`IllegalArgumentException`",
                "`NullPointerException`",
                "`IOException`"
              ],
              c: 1,
              e: "Es la excepción pensada para argumentos no válidos."
            }
          }
        ],
        reto: {
          p: `**Reto final.** Completa la clase \`CuentaSocio\` (puntos) con \`getPuntos()\` y \`ingresar(int)\`. Si se intenta ingresar una cantidad menor o igual a 0 debe lanzar \`IllegalArgumentException\` con el mensaje \`Cantidad no valida\`. El \`main\` debe mostrar:
\`\`\`
Puntos: 30
Cantidad no valida
\`\`\``,
          inicial: `class CuentaSocio {
    private int puntos;

    // TODO: getPuntos
    // TODO: ingresar
}

public class App {
    public static void main(String[] args) {
        CuentaSocio c = new CuentaSocio();
        c.ingresar(30);
        System.out.println("Puntos: " + c.getPuntos());
        try {
            c.ingresar(0);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
          tests: [
            {
              out: `Puntos: 30
Cantidad no valida`
            }
          ],
          solucion: `class CuentaSocio {
    private int puntos;

    public int getPuntos() {
        return puntos;
    }

    public void ingresar(int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("Cantidad no valida");
        }
        puntos += cantidad;
    }
}

public class App {
    public static void main(String[] args) {
        CuentaSocio c = new CuentaSocio();
        c.ingresar(30);
        System.out.println("Puntos: " + c.getPuntos());
        try {
            c.ingresar(0);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
          pistas: ["`puntos += cantidad;` después de comprobar que `cantidad > 0`."]
        }
      }
    },

    {
      id: "ut4-metodos",
      titulo: "Creación de métodos",
      resumen: "Estructura de un método, paso de parámetros por valor, sobrecarga, `toString` y Javadoc.",
      bloques: [
        {
          t: "texto",
          md: `Un **método** es un bloque de código con nombre que realiza una tarea. Ya has usado muchos (\`length()\`, \`substring(...)\`, \`Math.sqrt(...)\`); ahora los escribes tú. La estructura es:
\`\`\`
visibilidad  tipoDeRetorno  nombre(parámetros) {
    // instrucciones
    return valor;      // si el tipo de retorno no es void
}
\`\`\`
- La **visibilidad** dice quién lo puede llamar.
- El **tipo de retorno** es el tipo del valor que devuelve (\`double\`, \`String\`, un objeto…) o \`void\` si no devuelve nada.
- El **nombre** sigue la convención *lowerCamelCase* y suele ser un verbo (\`calcularTotal\`, \`vender\`).
- Los **parámetros** son los datos que necesita, cada uno con su tipo, separados por comas. Pueden no tener ninguno.
- \`return\` termina el método y devuelve un valor. Un método \`void\` puede usar \`return;\` sin valor para salir antes.`
        },
        {
          t: "codigo",
          titulo: "Un método que devuelve y otro que modifica",
          code: `class Producto {
    private double precio = 100;
    private int stock = 5;

    public double calcularPrecioConIva() {
        return precio * 1.21;
    }

    public void vender(int unidades) {
        if (unidades > stock) {
            throw new IllegalStateException("Piden " + unidades + " y solo quedan " + stock);
        }
        stock -= unidades;
    }

    public int getStock() {
        return stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();
        System.out.println(p.calcularPrecioConIva());
        p.vender(2);
        System.out.println(p.getStock());
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: "`calcularPrecioConIva` no tiene parámetros: usa los datos del propio objeto y **devuelve** un `double`. `vender` sí tiene uno, no devuelve nada, pero **modifica el estado del objeto** (el stock). Fíjate también en `1.21`: es un **número mágico** que se arreglará en la sección de estáticos."
        },
        {
          t: "test",
          p: "Un método que no devuelve ningún valor tiene tipo de retorno…",
          o: ["`null`", "`void`", "`empty`", "Ninguno: se omite"],
          c: 1,
          e: "`void`. Se omite solo en los constructores."
        },
        {
          t: "test",
          p: "¿Qué hace `return;` dentro de un método `void`?",
          o: [
            "Error de compilación",
            "Termina el método sin devolver valor",
            "Devuelve `null`",
            "Reinicia el método"
          ],
          c: 1,
          e: "Sale del método en ese punto."
        },
        {
          t: "texto",
          md: `### Los parámetros se pasan por valor
Esta es una de las ideas más importantes (y más malentendidas) de la unidad. Cuando llamas a un método con un argumento, **Java copia el valor** en el parámetro.
- En un **primitivo**, el valor es el propio número: la copia es independiente.
- En un **objeto**, el valor es la **referencia** (la flecha): se copia la flecha, no el objeto. Las dos flechas apuntan al **mismo objeto**, así que si el método **modifica el objeto**, el cambio se ve fuera. Pero si el método **cambia a dónde apunta** su copia de la flecha (\`p = new Producto(...)\`), la variable de fuera sigue apuntando al objeto original.`
        },
        {
          t: "codigo",
          titulo: "Tres casos de paso por valor",
          code: `class Producto {
    private String nombre;
    private double precio;

    public Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }
}

public class PasoDeParametros {

    static void subirPrecio(double precio) {
        precio = precio * 1.10;                      // solo cambia la copia
    }

    static void subirPrecio(Producto p) {
        p.setPrecio(p.getPrecio() * 1.10);           // cambia el objeto original
    }

    static void sustituir(Producto p) {
        p = new Producto("Otro", 1.0);               // solo cambia la copia de la referencia
    }

    public static void main(String[] args) {
        double tarifa = 100;
        subirPrecio(tarifa);
        System.out.println(tarifa);                  // ¿100.0?

        Producto kayak = new Producto("Kayak", 100.0);
        subirPrecio(kayak);
        System.out.println(kayak.getPrecio());       // ¿cambia?

        sustituir(kayak);
        System.out.println(kayak.getNombre());       // ¿sigue siendo Kayak?
    }
}`,
          ejecutable: true
        },
        {
          t: "memoria",
          titulo: "Dentro de sustituir(): la copia de la flecha apunta a otro objeto; la de main no se ha movido",
          variables: [
            { n: "kayak (main)", tipo: "Producto", ref: "o1" },
            { n: "p (sustituir, tras p = new ...)", tipo: "Producto", ref: "o2" }
          ],
          objetos: [
            {
              id: "o1",
              clase: "Producto («Kayak»)",
              campos: [
                { n: "precio", v: 110.00000000000001 }
              ]
            },
            {
              id: "o2",
              clase: "Producto («Otro»)",
              campos: [
                { n: "precio", v: 1.0 }
              ]
            }
          ]
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "**Java siempre pasa por valor.** Con objetos, lo que se pasa por valor es la **referencia**. Decir «los objetos se pasan por referencia» es un error muy extendido: el tercer caso (`sustituir`) lo demuestra, porque con paso por referencia verdadero el objeto de fuera **sí** cambiaría."
        },
        {
          t: "predecir",
          p: "¿Qué muestra? Dibuja las cajas y las flechas antes de contestar.",
          code: `class Contador {
    int valor;
}

public class Main {
    static void cambiar(int n, Contador c) {
        n = n + 10;
        c.valor = c.valor + 10;
        c = new Contador();
        c.valor = 99;
    }

    public static void main(String[] args) {
        int numero = 5;
        Contador cont = new Contador();
        cont.valor = 5;
        cambiar(numero, cont);
        System.out.println(numero + " " + cont.valor);
    }
}`,
          salida: "5 15",
          e: "`numero` es un primitivo: la copia cambia, el original no (5). `c.valor = c.valor + 10` modifica el objeto compartido (5 → 15). Después `c = new Contador()` solo mueve la copia de la flecha: el `99` va a otro objeto que se pierde. Resultado: `5 15`."
        },
        {
          t: "texto",
          md: `### Sobrecarga de métodos
Una clase puede tener **varios métodos con el mismo nombre** si sus parámetros son diferentes (distinto número o distintos tipos). Es la **sobrecarga**, que ya conoces de \`substring(6)\` y \`substring(6, 11)\`. Java decide cuál ejecutar mirando los argumentos. **No se puede** sobrecargar cambiando solo el tipo de retorno: el compilador no sabría a cuál llamas.`
        },
        {
          t: "codigo",
          titulo: "Dos versiones del mismo método",
          code: `class Producto {
    private double precio = 100;

    public double calcularPrecioConIva() {
        return precio * 1.21;
    }

    public double calcularPrecioConIva(double porcentajeIva) {
        return precio * (1 + porcentajeIva);
    }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();
        System.out.println(p.calcularPrecioConIva());
        System.out.println(p.calcularPrecioConIva(0.10));
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `### El método \`toString\`
Si intentas mostrar un objeto, \`System.out.println(kayak)\` escribe algo ilegible como \`Producto@1b6d3586\` (el nombre de la clase y un número interno). Pero si la clase tiene un método \`toString()\`, Java lo llama **automáticamente** al mostrar o concatenar el objeto. La anotación \`@Override\` indica que estamos **sustituyendo** un método que la clase ya tiene (todas heredan un \`toString\` básico de \`Object\`; lo verás en la sección de herencia). Es opcional, pero muy útil: si te equivocas al escribir el nombre, el compilador avisa.`
        },
        {
          t: "codigo",
          titulo: "toString en acción",
          code: `class Producto {
    private String codigo = "KY-0001";
    private String nombre = "Kayak";
    private double precio = 100;
    private int stock = 5;

    @Override
    public String toString() {
        return nombre + " (" + codigo + "): " + String.format("%.2f", precio) + " euros, stock " + stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto kayak = new Producto();
        System.out.println(kayak);
        System.out.println("Producto: " + kayak);
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "clave",
          md: `**Documenta los métodos con Javadoc.** Antes de cada método público se escribe un comentario con una frase que diga *qué hace* y una etiqueta por cada dato:
\`\`\`
/**
 * Descuenta unidades del stock.
 * @param unidades número de unidades que se venden (mayor que 0)
 * @return las unidades que quedan
 * @throws IllegalStateException si hay menos unidades de las pedidas
 */
\`\`\`
Etiquetas habituales: \`@param\`, \`@return\` y \`@throws\`. El IDE las muestra al pasar el ratón y la herramienta \`javadoc\` genera con ellas la documentación en HTML.`
        },
        {
          t: "ordenar",
          p: "Ordena las partes de la cabecera de un método.",
          items: ["public", "double", "calcularTotal", "(int horas)"],
          e: "Visibilidad, tipo de retorno, nombre y parámetros."
        },
        {
          t: "ejecuta",
          p: `**Escribe los métodos.** En \`Alquiler\`, completa \`calcularTotal()\` (horas × tarifa) y la versión **sobrecargada** \`calcularTotal(double descuento)\` que aplica un descuento (0.10 = 10 %). Debe mostrar:
\`\`\`
36.0
32.4
\`\`\``,
          inicial: `class Alquiler {
    private int horas = 3;
    private double tarifa = 12;

    // TODO: calcularTotal()
    // TODO: calcularTotal(double descuento)
}

public class App {
    public static void main(String[] args) {
        Alquiler a = new Alquiler();
        System.out.println(a.calcularTotal());
        System.out.println(a.calcularTotal(0.10));
    }
}`,
          tests: [
            {
              out: `36.0
32.4`
            }
          ],
          pistas: [
            "La segunda versión puede **llamar a la primera** y multiplicar por `(1 - descuento)`: no repitas la fórmula."
          ],
          solucion: `class Alquiler {
    private int horas = 3;
    private double tarifa = 12;

    public double calcularTotal() {
        return horas * tarifa;
    }

    public double calcularTotal(double descuento) {
        return calcularTotal() * (1 - descuento);
    }
}

public class App {
    public static void main(String[] args) {
        Alquiler a = new Alquiler();
        System.out.println(a.calcularTotal());
        System.out.println(a.calcularTotal(0.10));
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Por qué el mismo código a veces muestra `110.00000000000001`?",
          bloques: [
            {
              t: "texto",
              md: "Porque `double` guarda los decimales en **binario** y números como `0.1` no se pueden representar exactamente (igual que 1/3 no se puede escribir exacto en decimal). Para mostrar dinero se usa `String.format(\"%.2f\", ...)`; para cálculos contables exactos existe `BigDecimal`, que verás más adelante."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Un método, una responsabilidad.** Si para describir lo que hace un método necesitas la palabra «y» («calcula el total **y** lo imprime **y** actualiza el stock»), probablemente son tres métodos. Métodos cortos con nombre claro se leen casi como una frase y se prueban por separado.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos los **métodos** y el **paso de parámetros**.",
        inicial: [
          {
            p: "Con `static void f(int n) { n = n + 10; }` y `int x = 5; f(x);`, ¿cuánto vale `x` después?",
            o: ["5", "15", "10", "Error"],
            c: 0,
            e: "Se pasa una copia del valor: `x` no cambia."
          },
          {
            p: "Un método recibe un `Producto p` y ejecuta `p.setPrecio(1)`. ¿Cambia el producto original?",
            o: [
              "No, p es una copia",
              "Sí: se copia la referencia y apunta al mismo objeto",
              "Solo si es `static`",
              "Depende del precio"
            ],
            c: 1,
            e: "Dos flechas, un objeto."
          },
          {
            p: "¿Qué es la sobrecarga de métodos?",
            o: [
              "Llamar a un método muchas veces",
              "Varios métodos con el mismo nombre y distintos parámetros",
              "Un método muy largo",
              "Sustituir un método de la superclase"
            ],
            c: 1,
            e: "Mismo nombre, parámetros distintos."
          }
        ],
        pasos: [
          {
            titulo: "Paso por valor",
            cubre: [0, 1],
            explica: "Java **copia el valor** de cada argumento. En un primitivo, es el número; en un objeto, es la **referencia**. Por eso un método puede **modificar** el objeto que recibe, pero no puede hacer que la variable de fuera apunte a otro.",
            ejemplo: {
              code: `public class Main {
    static void f(int n) { n = n + 10; }
    public static void main(String[] args) {
        int x = 5;
        f(x);
        System.out.println(x);
    }
}`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "Un método ejecuta `p = new Producto(...)` con su parámetro `p`. ¿Cambia la variable de fuera?",
              o: [
                "Sí",
                "No: solo cambia la copia de la referencia",
                "Solo si el producto tiene stock",
                "Da error"
              ],
              c: 1,
              e: "La variable de fuera sigue apuntando al objeto original."
            },
            extra: "Piensa que le das al método una **fotocopia de la llave** de una casa. Con la copia puede entrar y mover los muebles (modificar el objeto), pero si tira su fotocopia y se hace otra de otra casa, tu llave original sigue abriendo tu casa."
          },
          {
            titulo: "Sobrecarga",
            cubre: [2],
            explica: "Mismo nombre, **distintos parámetros** (número o tipos). Java elige según los argumentos de la llamada. No vale cambiar solo el tipo de retorno.",
            pregunta: {
              p: "¿Se pueden tener `double f(int a)` e `int f(int a)` en la misma clase?",
              o: ["Sí", "No: solo cambia el tipo de retorno", "Solo si son `static`", "Solo si son privados"],
              c: 1,
              e: "El compilador no sabría a cuál llamas."
            }
          }
        ],
        reto: {
          p: "**Reto final.** Escribe en `Producto` el método `toString` para que `System.out.println(p)` muestre `Kayak (KY-1): 100,00 euros`. Usa `String.format(\"%.2f\", ...)` para el precio.",
          inicial: `class Producto {
    private String codigo = "KY-1";
    private String nombre = "Kayak";
    private double precio = 100;

    // TODO: toString
}

public class App {
    public static void main(String[] args) {
        Producto p = new Producto();
        System.out.println(p);
    }
}`,
          tests: [
            { out: "Kayak (KY-1): 100,00 euros" }
          ],
          solucion: `class Producto {
    private String codigo = "KY-1";
    private String nombre = "Kayak";
    private double precio = 100;

    @Override
    public String toString() {
        return nombre + " (" + codigo + "): " + String.format("%.2f", precio) + " euros";
    }
}

public class App {
    public static void main(String[] args) {
        Producto p = new Producto();
        System.out.println(p);
    }
}`,
          pistas: ["La firma es `public String toString()` y devuelve el texto con `return`."]
        }
      }
    },

    {
      id: "ut4-constructores",
      titulo: "Creación de constructores",
      resumen: "El constructor deja el objeto en un estado inicial válido: sobrecarga, `this(...)` y constructor por defecto.",
      bloques: [
        {
          t: "texto",
          md: "Un **constructor** es un método especial que se ejecuta al crear un objeto con `new` y sirve para **dejarlo en un estado inicial válido**. Se distingue por dos cosas: se llama **igual que la clase** y **no tiene tipo de retorno** (ni siquiera `void`)."
        },
        {
          t: "codigo",
          titulo: "Un constructor que valida",
          code: `class Producto {
    private final String codigo;
    private String nombre;
    private double precio;
    private int stock;

    public Producto(String codigo, String nombre, double precio, int stock) {
        this.codigo = codigo;
        this.nombre = nombre;
        setPrecio(precio);        // reutilizamos el setter: así se valida igual
        this.stock = stock;
    }

    public void setPrecio(double precio) {
        if (precio < 0) {
            throw new IllegalArgumentException("El precio no puede ser negativo: " + precio);
        }
        this.precio = precio;
    }

    @Override
    public String toString() {
        return nombre + " (" + codigo + "): " + precio + " euros, stock " + stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto kayak = new Producto("KY-0001", "Kayak Bahía 2", 249.90, 5);
        System.out.println(kayak);
        try {
            Producto raro = new Producto("KY-0002", "Kayak roto", -10, 1);
        } catch (IllegalArgumentException e) {
            System.out.println("No se pudo crear: " + e.getMessage());
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: "Crear un producto es ahora **una sola línea**, y no hay forma de crear uno sin datos. Como el constructor llama a `setPrecio`, un precio negativo se rechaza también al **crear** el objeto: no hace falta repetir la comprobación. Fíjate también en `private final String codigo`: una propiedad `final` solo se asigna **una vez**, y el constructor es el sitio."
        },
        {
          t: "test",
          p: "¿Qué dos características definen a un constructor?",
          o: [
            "Es `static` y no recibe parámetros",
            "Se llama como la clase y no tiene tipo de retorno",
            "Se llama `constructor` y devuelve `void`",
            "Es `private` y devuelve el objeto"
          ],
          c: 1,
          e: "Mismo nombre que la clase y **sin** tipo de retorno (ni `void`)."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "**El constructor por defecto desaparece.** Si no escribes ningún constructor, Java crea uno invisible sin parámetros (el *constructor por defecto*), que es el que usábamos con `new Producto()` al principio. **En cuanto escribes uno tuyo, el por defecto desaparece**: si después intentas `new Producto()`, el compilador da error, salvo que lo escribas tú también."
        },
        {
          t: "codigo",
          titulo: "¿Dónde se ha ido el constructor sin parámetros?",
          code: `class Producto {
    private String nombre;

    public Producto(String nombre) {
        this.nombre = nombre;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();     // ¿compila?
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `### Sobrecarga de constructores y \`this(...)\`
También los constructores se pueden **sobrecargar**, para ofrecer varias formas de crear el objeto. Para no repetir código, uno puede llamar a otro con \`this(...)\`, que **debe ser la primera línea**:`
        },
        {
          t: "codigo",
          titulo: "this(...) reutiliza el constructor largo",
          code: `class Producto {
    private String codigo;
    private String nombre;
    private double precio;
    private int stock;

    public Producto(String codigo, String nombre, double precio, int stock) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        System.out.println("Constructor largo");
    }

    public Producto(String codigo, String nombre, double precio) {
        this(codigo, nombre, precio, 0);     // un producto nuevo empieza sin stock
        System.out.println("Constructor corto");
    }

    public int getStock() {
        return stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto("NB-1", "Neopreno", 89.95);
        System.out.println("Stock: " + p.getStock());
    }
}`,
          ejecutable: true
        },
        {
          t: "predecir",
          p: "¿Qué muestra? Fíjate en el orden en que se ejecutan los constructores.",
          code: `class Reserva {
    private int dias;

    public Reserva(int dias) {
        this.dias = dias;
        System.out.println("A: " + dias);
    }

    public Reserva() {
        this(1);
        System.out.println("B");
    }
}

public class Main {
    public static void main(String[] args) {
        new Reserva();
        new Reserva(3);
    }
}`,
          salida: `A: 1
B
A: 3`,
          e: "`new Reserva()` entra en el constructor sin parámetros, que lo primero que hace es `this(1)`: se ejecuta el otro constructor (muestra `A: 1`) y después continúa el resto (`B`). Luego `new Reserva(3)` solo muestra `A: 3`."
        },
        {
          t: "huecos",
          p: "Completa el constructor sobrecargado para que un cliente nuevo **no sea socio** por defecto.",
          codigo: `public Cliente(String nombre, String telefono) {
    {{this}}(nombre, telefono, {{false}});
}`,
          e: "`this(...)` llama al otro constructor y debe ser la primera línea; el tercer argumento es `socio = false`."
        },
        {
          t: "ejecuta",
          p: `**La clase Cliente.** Completa \`Cliente\` con: un constructor con los tres datos, otro con solo nombre y teléfono (**no socio**, usando \`this(...)\`) y \`calcularDescuento()\` (0.10 si es socio, 0 si no). Debe mostrar:
\`\`\`
Laura Martínez (600111222) [socio] -> 0.1
Pedro Ruiz (600333444) -> 0.0
\`\`\``,
          inicial: `class Cliente {
    private String nombre;
    private String telefono;
    private boolean socio;

    // TODO: constructor con los tres datos
    // TODO: constructor con nombre y teléfono (no socio)

    public double calcularDescuento() {
        return 0;
    }

    @Override
    public String toString() {
        return nombre + " (" + telefono + ")" + (socio ? " [socio]" : "");
    }
}

public class App {
    public static void main(String[] args) {
        Cliente laura = new Cliente("Laura Martínez", "600111222", true);
        Cliente pedro = new Cliente("Pedro Ruiz", "600333444");
        System.out.println(laura + " -> " + laura.calcularDescuento());
        System.out.println(pedro + " -> " + pedro.calcularDescuento());
    }
}`,
          tests: [
            {
              out: `Laura Martínez (600111222) [socio] -> 0.1
Pedro Ruiz (600333444) -> 0.0`
            }
          ],
          pistas: ["El constructor corto es una sola línea: `this(nombre, telefono, false);`."],
          solucion: `class Cliente {
    private String nombre;
    private String telefono;
    private boolean socio;

    public Cliente(String nombre, String telefono, boolean socio) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.socio = socio;
    }

    public Cliente(String nombre, String telefono) {
        this(nombre, telefono, false);
    }

    public double calcularDescuento() {
        return socio ? 0.10 : 0;
    }

    @Override
    public String toString() {
        return nombre + " (" + telefono + ")" + (socio ? " [socio]" : "");
    }
}

public class App {
    public static void main(String[] args) {
        Cliente laura = new Cliente("Laura Martínez", "600111222", true);
        Cliente pedro = new Cliente("Pedro Ruiz", "600333444");
        System.out.println(laura + " -> " + laura.calcularDescuento());
        System.out.println(pedro + " -> " + pedro.calcularDescuento());
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Puedo llamar a un método de la clase dentro del constructor?",
          bloques: [
            {
              t: "texto",
              md: "Sí, y es lo recomendable cuando ese método ya tiene la lógica de validación (`setPrecio`). Así la regla vive **en un solo sitio**. Ten cuidado solo con llamar a métodos que dependan de propiedades que **todavía no has asignado** en el constructor: verían sus valores por defecto."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Por qué una propiedad `final` solo puede asignarse en el constructor?",
          bloques: [
            {
              t: "texto",
              md: "Porque `final` significa «se asigna una sola vez». El compilador exige que, al terminar el constructor, cada propiedad `final` tenga valor exactamente una vez. Por eso no tiene setter: es la forma de decir «el código de un producto no cambia nunca»."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Objetos siempre válidos.** El objetivo del constructor es que **no pueda existir** un objeto a medio construir (sin código, con precio negativo…). Si un constructor puede dejar propiedades de tipo objeto en `null`, tarde o temprano llegará un `NullPointerException` lejos de donde estaba el error real.",
          modo: "pro"
        },
        {
          t: "abierta",
          p: "Explica con tus palabras qué ocurre con el constructor sin parámetros cuando escribes un constructor propio, y cómo se soluciona si lo necesitas.",
          modelo: "Si no escribes ningún constructor, Java genera uno invisible sin parámetros (el constructor por defecto). Pero en cuanto escribes cualquier constructor propio, ese por defecto **desaparece**, y `new Producto()` deja de compilar. Si todavía lo necesito, tengo que escribirlo yo explícitamente (sobrecargando el constructor), por ejemplo uno vacío o que llame a `this(...)` con valores por defecto.",
          rubrica: [
            "Dice que el constructor por defecto desaparece al escribir uno propio",
            "Indica que hay que escribirlo explícitamente",
            "Menciona la sobrecarga o `this(...)`"
          ],
          minPalabras: 30
        }
      ],
      tutor: {
        intro: "Veamos los **constructores**.",
        inicial: [
          {
            p: "¿Qué tipo de retorno tiene un constructor?",
            o: ["`void`", "Ninguno: no se escribe", "El de la clase", "`Object`"],
            c: 1,
            e: "Un constructor no tiene tipo de retorno, ni siquiera `void`."
          },
          {
            p: "Si escribes `public Producto(String n) { ... }` y nada más, ¿compila `new Producto()`?",
            o: ["Sí", "No: el constructor por defecto ha desaparecido", "Solo con `static`", "Depende del IDE"],
            c: 1,
            e: "Al escribir un constructor, el por defecto deja de existir."
          },
          {
            p: "¿Dónde debe estar `this(...)` dentro de un constructor?",
            o: ["Al final", "En cualquier sitio", "En la primera línea", "Dentro de un `if`"],
            c: 2,
            e: "Debe ser la primera instrucción."
          }
        ],
        pasos: [
          {
            titulo: "Qué es un constructor",
            cubre: [0],
            explica: "Se ejecuta al hacer `new` y deja el objeto **listo y válido**. Se llama como la clase y no tiene tipo de retorno. Puedes reutilizar los setters para validar.",
            pregunta: {
              p: "¿Cuál de estas cabeceras es un constructor de `Producto`?",
              o: [
                "`public void Producto()`",
                "`public Producto(String codigo)`",
                "`public int Producto()`",
                "`public crear(String codigo)`"
              ],
              c: 1,
              e: "Mismo nombre que la clase y sin tipo de retorno."
            },
            extra: "Es lo primero que se hace con un objeto recién nacido: ponerle nombre y darle sus datos. Un objeto sin constructor es como un coche que sale de fábrica sin motor."
          },
          {
            titulo: "El constructor por defecto desaparece",
            cubre: [1],
            explica: "Sin constructores, Java regala uno vacío. Con uno tuyo, se acabó: si lo necesitas, lo escribes.",
            ejemplo: {
              code: `class P {
    P(String n) { }
}

public class Main {
    public static void main(String[] args) {
        P p = new P();
    }
}`,
              ejecutable: true,
              titulo: "Mira el error"
            },
            pregunta: {
              p: "¿Qué solución hay para poder hacer `new P()` además de `new P(\"x\")`?",
              o: [
                "Ninguna",
                "Escribir también un constructor sin parámetros",
                "Quitar el constructor con parámetros siempre",
                "Añadir `static`"
              ],
              c: 1,
              e: "Sobrecargar: escribir también el constructor vacío."
            }
          },
          {
            titulo: "`this(...)`",
            cubre: [2],
            explica: "Un constructor puede delegar en otro con `this(...)` (primera línea) para no repetir código.",
            pregunta: {
              p: "Si `this(nombre, tel, false);` va en la **segunda** línea del constructor, ¿qué pasa?",
              o: ["Funciona igual", "Error de compilación", "Se ignora", "Se ejecuta dos veces"],
              c: 1,
              e: "Tiene que ser la primera instrucción."
            }
          }
        ],
        reto: {
          p: `**Reto final.** Crea el constructor de \`Embarcacion\` (matrícula, nombre, eslora) que **rechace** una eslora menor o igual que 0 lanzando \`IllegalArgumentException("Eslora no valida")\`. Debe mostrar:
\`\`\`
Brisa 8.5
Eslora no valida
\`\`\``,
          inicial: `class Embarcacion {
    private String matricula;
    private String nombre;
    private double eslora;

    // TODO: constructor con validación

    public String getNombre() { return nombre; }
    public double getEslora() { return eslora; }
}

public class App {
    public static void main(String[] args) {
        Embarcacion e = new Embarcacion("B-101", "Brisa", 8.5);
        System.out.println(e.getNombre() + " " + e.getEslora());
        try {
            new Embarcacion("B-102", "Nula", 0);
        } catch (IllegalArgumentException ex) {
            System.out.println(ex.getMessage());
        }
    }
}`,
          tests: [
            {
              out: `Brisa 8.5
Eslora no valida`
            }
          ],
          solucion: `class Embarcacion {
    private String matricula;
    private String nombre;
    private double eslora;

    public Embarcacion(String matricula, String nombre, double eslora) {
        if (eslora <= 0) {
            throw new IllegalArgumentException("Eslora no valida");
        }
        this.matricula = matricula;
        this.nombre = nombre;
        this.eslora = eslora;
    }

    public String getNombre() { return nombre; }
    public double getEslora() { return eslora; }
}

public class App {
    public static void main(String[] args) {
        Embarcacion e = new Embarcacion("B-101", "Brisa", 8.5);
        System.out.println(e.getNombre() + " " + e.getEslora());
        try {
            new Embarcacion("B-102", "Nula", 0);
        } catch (IllegalArgumentException ex) {
            System.out.println(ex.getMessage());
        }
    }
}`,
          pistas: [
            "Comprueba `eslora <= 0` en la primera línea del constructor y lanza la excepción antes de asignar nada."
          ]
        }
      }
    },

    {
      id: "ut4-uso",
      titulo: "Utilización de clases y objetos",
      resumen: "Objetos que contienen a otros (composición), comparar con `==` y `equals`, y `null`.",
      bloques: [
        {
          t: "texto",
          md: `Ya sabes crear clases. Ahora se trata de **usarlas**, que es lo que hace un programa: crear objetos de varias clases y hacerlos **colaborar**. Los objetos pueden pasarse a métodos, guardarse en variables y, sobre todo, **contener a otros objetos**.

### Un objeto dentro de otro: la composición
Un alquiler **tiene un** cliente y **tiene un** producto. Se modela con propiedades cuyo tipo es otra clase. Fíjate en que \`Alquiler\` **no necesita saber** cómo se calcula el descuento ni cómo se guarda el precio: **pregunta** al objeto correspondiente. Cada clase se ocupa de lo suyo, y eso es lo que permite mantener un programa grande.`
        },
        {
          t: "codigo",
          titulo: "Composición: un Alquiler tiene un Cliente y un Producto",
          code: `class Cliente {
    private String nombre;
    private boolean socio;

    public Cliente(String nombre, boolean socio) {
        this.nombre = nombre;
        this.socio = socio;
    }
    public String getNombre() { return nombre; }
    public double calcularDescuento() { return socio ? 0.10 : 0; }
}

class Producto {
    private String nombre;
    private double precio;

    public Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
}

class Alquiler {
    private Cliente cliente;
    private Producto producto;
    private int horas;

    public Alquiler(Cliente cliente, Producto producto, int horas) {
        this.cliente = cliente;
        this.producto = producto;
        this.horas = horas;
    }

    public double calcularTotal() {
        double bruto = horas * producto.getPrecio();
        return bruto * (1 - cliente.calcularDescuento());
    }

    @Override
    public String toString() {
        return cliente.getNombre() + " alquila " + producto.getNombre() + " durante " + horas + " h";
    }
}

public class Main {
    public static void main(String[] args) {
        Cliente laura = new Cliente("Laura Martínez", true);
        Producto tabla = new Producto("Tabla de paddle surf", 9.0);
        Alquiler alquiler = new Alquiler(laura, tabla, 3);
        System.out.println(alquiler);
        System.out.println(alquiler.calcularTotal());
    }
}`,
          ejecutable: true
        },
        {
          t: "memoria",
          titulo: "El Alquiler no copia al cliente ni al producto: guarda flechas hacia ellos",
          variables: [
            { n: "laura", tipo: "Cliente", ref: "o1" },
            { n: "tabla", tipo: "Producto", ref: "o2" },
            { n: "alquiler", tipo: "Alquiler", ref: "o3" }
          ],
          objetos: [
            {
              id: "o1",
              clase: "Cliente",
              campos: [
                { n: "nombre", v: "\"Laura Martínez\"" },
                { n: "socio", v: "true" }
              ]
            },
            {
              id: "o2",
              clase: "Producto",
              campos: [
                { n: "nombre", v: "\"Tabla de paddle surf\"" },
                { n: "precio", v: 9.0 }
              ]
            },
            {
              id: "o3",
              clase: "Alquiler",
              campos: [
                { n: "cliente", ref: "o1" },
                { n: "producto", ref: "o2" },
                { n: "horas", v: 3 }
              ]
            }
          ]
        },
        {
          t: "test",
          p: "«Un alquiler **tiene un** cliente.» ¿Qué relación es?",
          o: ["Herencia", "Composición", "Sobrecarga", "Encapsulación"],
          c: 1,
          e: "«Tiene un» → composición: una propiedad cuyo tipo es otra clase."
        },
        {
          t: "texto",
          md: `### Comparar objetos: \`==\` y \`equals\`
Ya sabes que \`==\` compara **referencias** (¿es la misma flecha?). Para decidir cuándo dos objetos de **nuestra** clase son «el mismo», hay que escribir el método \`equals\`. Para un producto es razonable que dos productos con el **mismo código** sean el mismo:`
        },
        {
          t: "codigo",
          titulo: "== frente a equals",
          code: `class Producto {
    private String codigo;
    private String nombre;

    public Producto(String codigo, String nombre) {
        this.codigo = codigo;
        this.nombre = nombre;
    }

    @Override
    public boolean equals(Object otro) {
        if (this == otro) {
            return true;
        }
        if (!(otro instanceof Producto p)) {
            return false;
        }
        return codigo.equals(p.codigo);
    }

    @Override
    public int hashCode() {
        return codigo.hashCode();
    }
}

public class Main {
    public static void main(String[] args) {
        Producto a = new Producto("KY-1", "Kayak");
        Producto b = new Producto("KY-1", "Kayak (otra ficha)");
        Producto c = a;
        System.out.println(a == b);
        System.out.println(a.equals(b));
        System.out.println(a == c);
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: "El parámetro es de tipo `Object` (el tipo más general: todo objeto es un `Object`). `instanceof` comprueba si `otro` es realmente un `Producto` y a la vez lo guarda en `p` para poder usarlo. **Si redefines `equals`, redefine también `hashCode`** (con el mismo criterio): lo exige el contrato de Java y lo necesitarás en la UT6 con las colecciones."
        },
        {
          t: "predecir",
          p: "¿Qué muestra?",
          code: `class Cliente {
    private String nombre;
    public Cliente(String nombre) { this.nombre = nombre; }
}

public class Main {
    public static void main(String[] args) {
        Cliente a = new Cliente("Laura");
        Cliente b = new Cliente("Laura");
        System.out.println(a == b);
        System.out.println(a.equals(b));
    }
}`,
          salida: `false
false`,
          e: "`Cliente` no redefine `equals`, así que usa el de `Object`, que equivale a `==`: compara referencias. Son dos objetos distintos: `false` y `false`."
        },
        {
          t: "texto",
          md: `### \`null\` y \`NullPointerException\`
Una variable de tipo objeto puede valer \`null\`: no apunta a nada. Si usas un método de un objeto que es \`null\`, el programa falla con **\`NullPointerException\`**. Es muy común cuando una propiedad de tipo objeto **no se inicializa** en el constructor. Por eso el constructor debe dejar **todas** las propiedades en un estado válido, y por eso se comprueba \`if (x != null)\` antes de usar un objeto que podría no existir.`
        },
        {
          t: "codigo",
          titulo: "Protegerse de null (y no hacerlo)",
          code: `class Alquiler {
    private double total = 24.3;
    public double calcularTotal() { return total; }
}

public class Main {
    public static void main(String[] args) {
        Alquiler pendiente = null;
        if (pendiente != null) {
            System.out.println(pendiente.calcularTotal());
        } else {
            System.out.println("No hay alquiler pendiente");
        }
        System.out.println(pendiente.calcularTotal());     // ¿qué pasa aquí?
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "consejo",
          md: "Cuando veas un `NullPointerException`, **lee la traza**: te dice la línea exacta. Busca en esa línea qué variable puede ser `null` (la que está justo antes de un punto `.`) y pregúntate **por qué** no se inicializó, en lugar de añadir un `if` sin pensar."
        },
        {
          t: "ejecuta",
          p: `**Composición en acción.** Completa \`Alquiler.calcularTotal()\` para que devuelva \`horas * precio\` del producto **menos** el descuento del cliente. Debe mostrar:
\`\`\`
Laura Martínez alquila Kayak: 21.6
Pedro Ruiz alquila Kayak: 24.0
\`\`\``,
          inicial: `class Cliente {
    private String nombre;
    private boolean socio;
    public Cliente(String nombre, boolean socio) { this.nombre = nombre; this.socio = socio; }
    public String getNombre() { return nombre; }
    public double calcularDescuento() { return socio ? 0.10 : 0; }
}

class Producto {
    private String nombre;
    private double precio;
    public Producto(String nombre, double precio) { this.nombre = nombre; this.precio = precio; }
    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
}

class Alquiler {
    private Cliente cliente;
    private Producto producto;
    private int horas;

    public Alquiler(Cliente cliente, Producto producto, int horas) {
        this.cliente = cliente;
        this.producto = producto;
        this.horas = horas;
    }

    public double calcularTotal() {
        return 0;   // TODO
    }

    @Override
    public String toString() {
        return cliente.getNombre() + " alquila " + producto.getNombre() + ": " + calcularTotal();
    }
}

public class App {
    public static void main(String[] args) {
        Producto kayak = new Producto("Kayak", 8.0);
        System.out.println(new Alquiler(new Cliente("Laura Martínez", true), kayak, 3));
        System.out.println(new Alquiler(new Cliente("Pedro Ruiz", false), kayak, 3));
    }
}`,
          tests: [
            {
              out: `Laura Martínez alquila Kayak: 21.6
Pedro Ruiz alquila Kayak: 24.0`
            }
          ],
          pistas: [
            "Pregunta a los objetos: `producto.getPrecio()` y `cliente.calcularDescuento()`. No accedas a sus propiedades privadas."
          ],
          solucion: `class Cliente {
    private String nombre;
    private boolean socio;
    public Cliente(String nombre, boolean socio) { this.nombre = nombre; this.socio = socio; }
    public String getNombre() { return nombre; }
    public double calcularDescuento() { return socio ? 0.10 : 0; }
}

class Producto {
    private String nombre;
    private double precio;
    public Producto(String nombre, double precio) { this.nombre = nombre; this.precio = precio; }
    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
}

class Alquiler {
    private Cliente cliente;
    private Producto producto;
    private int horas;

    public Alquiler(Cliente cliente, Producto producto, int horas) {
        this.cliente = cliente;
        this.producto = producto;
        this.horas = horas;
    }

    public double calcularTotal() {
        double bruto = horas * producto.getPrecio();
        return bruto * (1 - cliente.calcularDescuento());
    }

    @Override
    public String toString() {
        return cliente.getNombre() + " alquila " + producto.getNombre() + ": " + calcularTotal();
    }
}

public class App {
    public static void main(String[] args) {
        Producto kayak = new Producto("Kayak", 8.0);
        System.out.println(new Alquiler(new Cliente("Laura Martínez", true), kayak, 3));
        System.out.println(new Alquiler(new Cliente("Pedro Ruiz", false), kayak, 3));
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Y si quiero que dos clientes con el mismo nombre se consideren iguales?",
          bloques: [
            {
              t: "texto",
              md: "Entonces `equals` debe comparar el **nombre** (y `hashCode` debe calcularse con el nombre). Decidir **qué hace «igual» a dos objetos** es una decisión de diseño de cada clase: para un producto es el código; para un cliente, quizá el DNI; para un punto del mapa, sus dos coordenadas."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Contrato de `equals`.** Debe ser *reflexivo* (`a.equals(a)`), *simétrico* (`a.equals(b)` ⇔ `b.equals(a)`), *transitivo* y *consistente*, y `a.equals(null)` debe ser `false`. Y si `a.equals(b)`, entonces `a.hashCode() == b.hashCode()`. Los IDE generan ambos métodos por ti; lo importante es que sepas **qué propiedades** deben intervenir.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos cómo **usar objetos**: composición, `equals` y `null`.",
        inicial: [
          {
            p: "Con `Producto a = new Producto(\"K\"); Producto b = new Producto(\"K\");` y sin `equals`, ¿qué vale `a.equals(b)`?",
            o: ["`true`", "`false`", "Error", "Depende del código"],
            c: 1,
            e: "Sin redefinir `equals`, compara referencias: son dos objetos distintos."
          },
          {
            p: "¿Qué lanza `x.metodo()` si `x` vale `null`?",
            o: ["`ArithmeticException`", "`NullPointerException`", "`IllegalStateException`", "Nada"],
            c: 1,
            e: "`NullPointerException`."
          },
          {
            p: "Una propiedad de tipo `Cliente` dentro de `Alquiler` es un ejemplo de…",
            o: ["Herencia", "Composición", "Sobrecarga", "Polimorfismo"],
            c: 1,
            e: "«Tiene un» → composición."
          }
        ],
        pasos: [
          {
            titulo: "Composición",
            cubre: [2],
            explica: "Una clase puede tener propiedades cuyo tipo es **otra clase**. Se guardan como **referencias**, y la clase contenedora **pregunta** a esos objetos en lugar de acceder a sus datos.",
            pregunta: {
              p: "Dentro de `Alquiler`, ¿cómo obtiene el precio del producto?",
              o: ["`producto.precio`", "`producto.getPrecio()`", "`new Producto().precio`", "`Producto.precio`"],
              c: 1,
              e: "A través del método público: la propiedad es privada."
            }
          },
          {
            titulo: "`==` y `equals`",
            cubre: [0],
            explica: "`==` compara **referencias**. `equals` compara lo que **tú** decidas, pero solo si lo redefines; si no, equivale a `==`. Y si redefines `equals`, redefine también `hashCode`.",
            ejemplo: {
              code: `public class Main {
    public static void main(String[] args) {
        String a = new String("kayak");
        String b = new String("kayak");
        System.out.println(a == b);
        System.out.println(a.equals(b));
    }
}`,
              ejecutable: true,
              titulo: "Con String ya lo habías visto"
            },
            pregunta: {
              p: "¿Qué compara `==` entre dos objetos?",
              o: ["Su contenido", "Sus referencias", "Su clase", "Su tamaño"],
              c: 1,
              e: "Si apuntan al mismo objeto."
            }
          },
          {
            titulo: "`null`",
            cubre: [1],
            explica: "Una referencia puede no apuntar a nada. Llamar a un método sobre `null` lanza `NullPointerException`. Inicializa bien en el constructor y comprueba `!= null` cuando algo pueda faltar.",
            pregunta: {
              p: "¿Dónde se mira primero un `NullPointerException`?",
              o: [
                "En la línea que indica la traza, la variable antes del punto",
                "En el `main` siempre",
                "En el IDE",
                "En ninguna parte"
              ],
              c: 0,
              e: "La traza dice la línea exacta."
            }
          }
        ],
        reto: {
          p: `**Reto final.** Completa \`equals\` en \`Cliente\` para que dos clientes con el mismo \`dni\` sean iguales. Debe mostrar:
\`\`\`
true
false
\`\`\``,
          inicial: `class Cliente {
    private String dni;
    private String nombre;

    public Cliente(String dni, String nombre) {
        this.dni = dni;
        this.nombre = nombre;
    }

    @Override
    public boolean equals(Object otro) {
        // TODO
        return false;
    }

    @Override
    public int hashCode() {
        return dni.hashCode();
    }
}

public class App {
    public static void main(String[] args) {
        Cliente a = new Cliente("1234A", "Laura");
        Cliente b = new Cliente("1234A", "Laura M.");
        Cliente c = new Cliente("9999Z", "Laura");
        System.out.println(a.equals(b));
        System.out.println(a.equals(c));
    }
}`,
          tests: [
            {
              out: `true
false`
            }
          ],
          solucion: `class Cliente {
    private String dni;
    private String nombre;

    public Cliente(String dni, String nombre) {
        this.dni = dni;
        this.nombre = nombre;
    }

    @Override
    public boolean equals(Object otro) {
        if (this == otro) {
            return true;
        }
        if (!(otro instanceof Cliente c)) {
            return false;
        }
        return dni.equals(c.dni);
    }

    @Override
    public int hashCode() {
        return dni.hashCode();
    }
}

public class App {
    public static void main(String[] args) {
        Cliente a = new Cliente("1234A", "Laura");
        Cliente b = new Cliente("1234A", "Laura M.");
        Cliente c = new Cliente("9999Z", "Laura");
        System.out.println(a.equals(b));
        System.out.println(a.equals(c));
    }
}`,
          pistas: [
            "Comprueba `otro instanceof Cliente c` y compara `dni.equals(c.dni)`. Los **textos** se comparan con `equals`, no con `==`."
          ]
        }
      }
    },

    {
      id: "ut4-herencia",
      titulo: "Utilización de clases heredadas",
      resumen: "Reutilizar código con `extends`: `super`, sobrescritura, `protected`, polimorfismo y la clase `Object`.",
      bloques: [
        {
          t: "texto",
          md: `Náutica Bahía vende productos, pero algunos **también se alquilan**: un kayak tiene, además del precio de venta, una tarifa por hora. Podríamos copiar la clase \`Producto\` y añadirle una propiedad, pero entonces tendríamos el mismo código duplicado en dos sitios. La **herencia** permite crear una clase nueva **a partir de otra**, reutilizando todo lo que ya tiene y añadiendo lo propio.

Un \`ProductoAlquilable\` **es un** \`Producto\`. La clase de la que se hereda se llama **superclase** (o clase padre) y la que hereda, **subclase** (o clase hija). En Java se escribe con \`extends\`:`
        },
        {
          t: "codigo",
          titulo: "ProductoAlquilable extends Producto",
          code: `class Producto {
    private String nombre;
    private double precio;

    public Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }

    @Override
    public String toString() {
        return nombre + ": " + precio + " euros";
    }
}

class ProductoAlquilable extends Producto {
    private double tarifaHora;

    public ProductoAlquilable(String nombre, double precio, double tarifaHora) {
        super(nombre, precio);          // construye la parte de Producto
        this.tarifaHora = tarifaHora;
    }

    public double calcularAlquiler(int horas) {
        return horas * tarifaHora;
    }

    @Override
    public String toString() {
        return super.toString() + ", alquiler " + tarifaHora + " euros/hora";
    }
}

public class Main {
    public static void main(String[] args) {
        ProductoAlquilable kayak = new ProductoAlquilable("Kayak Bahía 2", 249.90, 12.0);
        System.out.println(kayak);
        System.out.println(kayak.calcularAlquiler(3));
        System.out.println(kayak.getNombre());     // heredado de Producto
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `Lo que ocurre aquí:
- **Hereda** todos los miembros públicos de \`Producto\`: un \`ProductoAlquilable\` tiene \`getNombre()\`, \`getPrecio()\`… sin escribirlos de nuevo.
- **Añade** lo suyo: \`tarifaHora\` y \`calcularAlquiler\`.
- El constructor llama primero a \`super(...)\`, que **ejecuta el constructor de la superclase**. Debe ser **la primera línea**. Si no lo escribes, Java intenta llamar a \`super()\` sin parámetros, y **falla si la superclase no lo tiene**.
- **Sobrescribe** (\`@Override\`) el método \`toString\` para ampliarlo, y reutiliza el de la superclase con \`super.toString()\`.`
        },
        {
          t: "predecir",
          p: "¿Qué muestra? Fíjate en el orden de los constructores.",
          code: `class Embarcacion {
    public Embarcacion() {
        System.out.println("Embarcación");
    }
}

class Velero extends Embarcacion {
    public Velero() {
        System.out.println("Velero");
    }
}

public class Main {
    public static void main(String[] args) {
        new Velero();
    }
}`,
          salida: `Embarcación
Velero`,
          e: "Antes de ejecutar el constructor de `Velero`, Java ejecuta el de la superclase (`super()` implícito). Primero se construye la parte de arriba, luego la de abajo."
        },
        {
          t: "texto",
          md: `### Atributos privados y \`protected\`
Los atributos \`private\` de \`Producto\` **no son visibles** ni siquiera en la subclase: dentro de \`ProductoAlquilable\` no se puede escribir \`precio\`, solo \`getPrecio()\`. Si quieres que las subclases (y las clases del mismo paquete) vean un miembro, pero no el resto del mundo, se usa \`protected\`. Lo habitual y recomendable es dejar las propiedades \`private\` y dar a las subclases métodos \`protected\` o \`public\`.`
        },
        {
          t: "texto",
          md: `### Polimorfismo: una variable, varias formas
Como un \`ProductoAlquilable\` **es un** \`Producto\`, se puede guardar en una variable de tipo \`Producto\`. Y al llamar a un método sobrescrito, Java ejecuta **la versión del objeto real**, no la del tipo de la variable.`
        },
        {
          t: "codigo",
          titulo: "Polimorfismo e instanceof",
          code: `class Producto {
    public String describir() { return "Producto"; }
}

class ProductoAlquilable extends Producto {
    @Override
    public String describir() { return "Producto alquilable"; }

    public double calcularAlquiler(int horas) { return horas * 12.0; }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new ProductoAlquilable();
        System.out.println(p.describir());          // versión del objeto real
        // p.calcularAlquiler(3);                    // ERROR: Producto no tiene ese método
        if (p instanceof ProductoAlquilable alquilable) {
            System.out.println(alquilable.calcularAlquiler(3));
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "info",
          md: "Toda clase de Java hereda, aunque no lo escribas, de la clase **`Object`**. Por eso todas tienen `toString`, `equals` y `hashCode`, y por eso al escribirlos hacemos `@Override`. El polimorfismo sacará todo su partido en las unidades 6 y 7, cuando tengas colecciones de objetos de varios tipos; de momento basta con que lo reconozcas."
        },
        {
          t: "aviso",
          tipo: "clave",
          md: `**¿Herencia o composición?** Es muy fácil confundirlas:
- **Herencia** (\`extends\`): relación «**es un**». Un kayak *es un* producto.
- **Composición** (una propiedad): relación «**tiene un**». Un alquiler *tiene un* cliente.

Prueba mental: si la frase «A es un B» suena rara, no es herencia. Un \`Alquiler\` no *es* un \`Cliente\`. **Ante la duda, usa composición.**`
        },
        {
          t: "relacionar",
          p: "Decide la relación entre cada par de clases.",
          pares: [
            ["Velero y Embarcación", "herencia (es un)"],
            ["Alquiler y Cliente", "composición (tiene un)"],
            ["Venta y Producto", "composición (tiene un)"],
            ["Lancha y Embarcación", "herencia (es un)"]
          ],
          e: "Un velero *es una* embarcación; una venta *tiene un* producto."
        },
        {
          t: "ejecuta",
          p: `**Veleros y lanchas.** Parte de \`Embarcacion\` (tarifa base 10 €/hora). Completa \`Velero\` (tarifa = 10 + 1.5 por m² de vela) y \`Lancha\` (tarifa = 10 + 0.2 por CV), sobrescribiendo \`calcularTarifaHora()\` y reutilizando la de la superclase con \`super\`. Debe mostrar:
\`\`\`
Brisa: 70.0 euros/hora
Gaviota: 40.0 euros/hora
\`\`\``,
          inicial: `class Embarcacion {
    private String nombre;

    public Embarcacion(String nombre) { this.nombre = nombre; }

    public String getNombre() { return nombre; }

    public double calcularTarifaHora() { return 10; }
}

class Velero extends Embarcacion {
    private double superficieVela;

    public Velero(String nombre, double superficieVela) {
        // TODO
    }

    // TODO: calcularTarifaHora
}

class Lancha extends Embarcacion {
    private int potencia;

    public Lancha(String nombre, int potencia) {
        // TODO
    }

    // TODO: calcularTarifaHora
}

public class App {
    public static void main(String[] args) {
        Embarcacion[] flota = { new Velero("Brisa", 40), new Lancha("Gaviota", 150) };
        for (Embarcacion e : flota) {
            System.out.println(e.getNombre() + ": " + e.calcularTarifaHora() + " euros/hora");
        }
    }
}`,
          tests: [
            {
              out: `Brisa: 70.0 euros/hora
Gaviota: 40.0 euros/hora`
            }
          ],
          pistas: [
            "Cada constructor empieza con `super(nombre);`.",
            "En `calcularTarifaHora` llama a `super.calcularTarifaHora()` y suma lo propio.",
            "El bucle recorre las dos embarcaciones con **una sola variable** de tipo `Embarcacion`: eso es polimorfismo."
          ],
          solucion: `class Embarcacion {
    private String nombre;

    public Embarcacion(String nombre) { this.nombre = nombre; }

    public String getNombre() { return nombre; }

    public double calcularTarifaHora() { return 10; }
}

class Velero extends Embarcacion {
    private double superficieVela;

    public Velero(String nombre, double superficieVela) {
        super(nombre);
        this.superficieVela = superficieVela;
    }

    @Override
    public double calcularTarifaHora() {
        return super.calcularTarifaHora() + 1.5 * superficieVela;
    }
}

class Lancha extends Embarcacion {
    private int potencia;

    public Lancha(String nombre, int potencia) {
        super(nombre);
        this.potencia = potencia;
    }

    @Override
    public double calcularTarifaHora() {
        return super.calcularTarifaHora() + 0.2 * potencia;
    }
}

public class App {
    public static void main(String[] args) {
        Embarcacion[] flota = { new Velero("Brisa", 40), new Lancha("Gaviota", 150) };
        for (Embarcacion e : flota) {
            System.out.println(e.getNombre() + ": " + e.calcularTarifaHora() + " euros/hora");
        }
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Qué diferencia hay entre sobrecargar y sobrescribir un método?",
          bloques: [
            {
              t: "texto",
              md: "**Sobrecargar** (*overload*): mismo nombre y **distintos parámetros** en la **misma clase**. **Sobrescribir** (*override*): una subclase **reemplaza** un método de la superclase con la **misma firma**. Con `@Override` el compilador comprueba que de verdad estás sobrescribiendo algo."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: `**Principio de sustitución (Liskov).** «Es un» no es solo vocabulario: todo lo que se afirma de **todos** los \`Producto\` debe seguir siendo cierto para sus subclases. El ejemplo clásico es el del **cuadrado y el rectángulo**: si \`Rectangulo\` permite cambiar el ancho sin tocar el alto, un \`Cuadrado\` que hereda de él **rompe** esa regla. Cuando una subclase rompe las reglas de la superclase, la herencia estaba mal elegida: usa composición.

Además, Java solo permite **herencia simple** (un único \`extends\`). Las interfaces (UT7) resuelven lo que necesitaría herencia múltiple.`,
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos la **herencia**.",
        inicial: [
          {
            p: "¿Qué palabra clave declara que una clase hereda de otra?",
            o: ["`implements`", "`extends`", "`inherits`", "`super`"],
            c: 1,
            e: "`class B extends A`."
          },
          {
            p: "¿Qué hace `super(nombre)` en el constructor de la subclase?",
            o: [
              "Crea un objeto nuevo",
              "Ejecuta el constructor de la superclase",
              "Llama a un método estático",
              "Nada"
            ],
            c: 1,
            e: "Construye la parte heredada."
          },
          {
            p: "`Producto p = new ProductoAlquilable(...); p.describir();` ¿Qué versión de `describir` se ejecuta?",
            o: ["La de `Producto`", "La de `ProductoAlquilable` (el objeto real)", "Ninguna: error", "Las dos"],
            c: 1,
            e: "Polimorfismo: manda el objeto real."
          }
        ],
        pasos: [
          {
            titulo: "`extends` y `super`",
            cubre: [0, 1],
            explica: "La subclase **hereda** los miembros públicos y añade los suyos. Su constructor debe llamar a `super(...)` en la **primera línea** para construir la parte heredada.",
            ejemplo: {
              code: `class A {
    A() { System.out.println("A"); }
}

class B extends A {
    B() { System.out.println("B"); }
}

public class Main {
    public static void main(String[] args) {
        new B();
    }
}`,
              ejecutable: true,
              titulo: "Orden de los constructores"
            },
            pregunta: {
              p: "¿Qué se muestra con `new B()` en el ejemplo?",
              o: ["B", "A y luego B", "B y luego A", "Nada"],
              c: 1,
              e: "Primero el constructor de la superclase."
            },
            extra: "Piensa en una muñeca rusa: para construir la muñeca de dentro hace falta la de fuera. Primero se levanta el edificio base (la superclase) y encima se construye el piso nuevo (la subclase)."
          },
          {
            titulo: "Polimorfismo",
            cubre: [2],
            explica: "Una variable de la superclase puede guardar un objeto de la subclase. Los métodos sobrescritos se ejecutan **según el objeto real**; los métodos propios de la subclase requieren `instanceof` o un tipo más específico.",
            pregunta: {
              p: "Con `Producto p = new ProductoAlquilable();`, ¿se puede escribir `p.calcularAlquiler(3)`?",
              o: ["Sí", "No: `Producto` no tiene ese método", "Solo si es `static`", "Solo con `super`"],
              c: 1,
              e: "El tipo de la **variable** decide qué métodos puedes llamar."
            }
          },
          {
            titulo: "¿Herencia o composición?",
            explica: "«A **es un** B» → herencia. «A **tiene un** B» → composición. Ante la duda, composición.",
            pregunta: {
              p: "¿Qué relación hay entre `Venta` y `Cliente`?",
              o: ["Herencia", "Composición", "Ninguna", "Sobrecarga"],
              c: 1,
              e: "Una venta *tiene un* cliente."
            }
          }
        ],
        reto: {
          p: `**Reto final.** \`Kayak\` hereda de \`Producto\`. Completa su constructor y sobrescribe \`toString\` para que muestre \`Kayak Bahía 2 (2 plazas)\`. Debe mostrar:
\`\`\`
Kayak Bahía 2 (2 plazas)
\`\`\``,
          inicial: `class Producto {
    private String nombre;

    public Producto(String nombre) { this.nombre = nombre; }

    @Override
    public String toString() { return nombre; }
}

class Kayak extends Producto {
    private int plazas;

    public Kayak(String nombre, int plazas) {
        // TODO
    }

    // TODO: toString
}

public class App {
    public static void main(String[] args) {
        System.out.println(new Kayak("Kayak Bahía 2", 2));
    }
}`,
          tests: [
            { out: "Kayak Bahía 2 (2 plazas)" }
          ],
          solucion: `class Producto {
    private String nombre;

    public Producto(String nombre) { this.nombre = nombre; }

    @Override
    public String toString() { return nombre; }
}

class Kayak extends Producto {
    private int plazas;

    public Kayak(String nombre, int plazas) {
        super(nombre);
        this.plazas = plazas;
    }

    @Override
    public String toString() {
        return super.toString() + " (" + plazas + " plazas)";
    }
}

public class App {
    public static void main(String[] args) {
        System.out.println(new Kayak("Kayak Bahía 2", 2));
    }
}`,
          pistas: [
            "`super(nombre);` en la primera línea y `super.toString()` para reutilizar el texto de la superclase."
          ]
        }
      }
    },

    {
      id: "ut4-estaticos",
      titulo: "Métodos y propiedades estáticos",
      resumen: "Miembros que pertenecen a la clase y no a cada objeto: constantes, contadores y por qué `main` es `static`.",
      bloques: [
        {
          t: "texto",
          md: `Hasta ahora todo lo que escribíamos en una clase pertenecía a **cada objeto**. Pero hay cosas que no dependen de ningún objeto concreto, como \`Math.sqrt(16)\`: no necesitas crear un \`Math\` para calcular una raíz. Esos miembros se declaran \`static\` y pertenecen a **la clase**, no a los objetos. Se usan con el nombre de la clase, un punto y el miembro.

### Métodos estáticos y constantes
Un método estático **no usa los datos de un objeto**: recibe lo que necesita por parámetros. Son típicos de las clases de utilidades. Esta clase centraliza el IVA, que antes escribíamos como número mágico:`
        },
        {
          t: "codigo",
          titulo: "Clase de utilidades Fiscal",
          code: `class Fiscal {
    public static final double IVA_GENERAL = 0.21;      // constante de clase

    public static double calcularIva(double base) {
        return base * IVA_GENERAL;
    }

    public static double conIva(double base) {
        return base + calcularIva(base);
    }
}

public class Main {
    public static void main(String[] args) {
        double total = Fiscal.conIva(100);
        System.out.println(total);
        System.out.println(Fiscal.IVA_GENERAL);
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "Una constante se declara `public static final`: `static` (una sola para todos), `final` (no cambia) y `public` (todo el mundo la ve). Se escribe en MAYÚSCULAS con guiones bajos. Es la forma de las *constantes* de la UT1 cuando se necesitan en más de una clase."
        },
        {
          t: "texto",
          md: `### Propiedades estáticas: un dato compartido
Una propiedad \`static\` existe **una sola vez**, compartida por todos los objetos de la clase. Es útil para contar cuántos objetos se han creado o para generar identificadores:`
        },
        {
          t: "codigo",
          titulo: "Un contador compartido",
          code: `class Producto {
    private static int totalProductos = 0;      // uno para toda la clase
    private final int id;                       // uno por producto
    private String nombre;

    public Producto(String nombre) {
        totalProductos++;
        this.id = totalProductos;
        this.nombre = nombre;
    }

    public int getId() { return id; }

    public static int getTotalProductos() {
        return totalProductos;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto a = new Producto("Kayak");
        Producto b = new Producto("Neopreno");
        System.out.println(a.getId() + " " + b.getId());
        System.out.println(Producto.getTotalProductos());
    }
}`,
          ejecutable: true
        },
        {
          t: "memoria",
          titulo: "`id` es de cada objeto; `totalProductos` es de la clase (uno solo)",
          variables: [
            { n: "a", tipo: "Producto", ref: "o1" },
            { n: "b", tipo: "Producto", ref: "o2" },
            { n: "Producto.totalProductos (de la clase)", tipo: "int", v: 2 }
          ],
          objetos: [
            {
              id: "o1",
              clase: "Producto",
              campos: [
                { n: "id", v: 1 },
                { n: "nombre", v: "\"Kayak\"" }
              ]
            },
            {
              id: "o2",
              clase: "Producto",
              campos: [
                { n: "id", v: 2 },
                { n: "nombre", v: "\"Neopreno\"" }
              ]
            }
          ]
        },
        {
          t: "predecir",
          p: "¿Qué muestra?",
          code: `class Pedido {
    private static int contador = 1000;
    private final int numero;

    public Pedido() {
        contador++;
        numero = contador;
    }

    public int getNumero() { return numero; }
}

public class Main {
    public static void main(String[] args) {
        Pedido a = new Pedido();
        Pedido b = new Pedido();
        Pedido c = new Pedido();
        System.out.println(a.getNumero() + " " + b.getNumero() + " " + c.getNumero());
    }
}`,
          salida: "1001 1002 1003",
          e: "El contador es **uno solo** para todos los pedidos: cada `new` lo incrementa y el pedido guarda el valor del momento: 1001, 1002 y 1003. Si `numero` fuera `static`, todos tendrían el mismo."
        },
        {
          t: "aviso",
          tipo: "clave",
          md: `**Qué puede hacer un método estático.** Un método estático **no tiene \`this\`**: no pertenece a ningún objeto. Por tanto **no puede usar propiedades ni métodos de instancia** directamente (solo \`static\`, o los de un objeto que reciba o cree). Al revés sí: un método de instancia puede llamar a los estáticos y usar propiedades estáticas.

Ahora puedes entender por fin el \`public static void main\`: \`main\` es estático **porque Java tiene que llamarlo antes de que exista ningún objeto**. Y por eso, dentro de \`main\`, los métodos auxiliares que escribías sin crear un objeto también llevaban \`static\`.`
        },
        {
          t: "test",
          p: "¿Por qué `main` es `static`?",
          o: [
            "Por tradición",
            "Porque Java lo llama antes de que exista ningún objeto",
            "Porque no tiene parámetros",
            "Para que sea más rápido"
          ],
          c: 1,
          e: "No hay ningún objeto todavía: el método debe pertenecer a la clase."
        },
        {
          t: "codigo",
          titulo: "Un método static que usa datos de objeto",
          code: `class Producto {
    private double precio = 10;

    public static double aplicarIva() {
        return precio * 1.21;       // ¿compila?
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(Producto.aplicarIva());
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "**No abuses de `static`.** Es tentador ponerlo para que el compilador deje de quejarse. Si un método usa los datos de un objeto, **no debe ser estático**. Una clase llena de métodos y datos `static` es programación estructurada disfrazada, sin ninguna de las ventajas de los objetos."
        },
        {
          t: "ejecuta",
          p: `**Conversiones náuticas.** Completa la clase de utilidades \`Conversor\` con la constante \`KMH_POR_NUDO = 1.852\` y los métodos **estáticos** \`nudosAKmh(double)\` y \`kmhANudos(double)\`. Debe mostrar:
\`\`\`
18.52
10.0
\`\`\``,
          inicial: `class Conversor {
    // TODO: constante KMH_POR_NUDO

    // TODO: nudosAKmh

    // TODO: kmhANudos
}

public class App {
    public static void main(String[] args) {
        System.out.println(Conversor.nudosAKmh(10));
        System.out.println(Conversor.kmhANudos(18.52));
    }
}`,
          tests: [
            {
              out: `18.52
10.0`
            }
          ],
          pistas: [
            "La constante: `public static final double KMH_POR_NUDO = 1.852;`",
            "`nudosAKmh` multiplica y `kmhANudos` divide."
          ],
          solucion: `class Conversor {
    public static final double KMH_POR_NUDO = 1.852;

    public static double nudosAKmh(double nudos) {
        return nudos * KMH_POR_NUDO;
    }

    public static double kmhANudos(double kmh) {
        return kmh / KMH_POR_NUDO;
    }
}

public class App {
    public static void main(String[] args) {
        System.out.println(Conversor.nudosAKmh(10));
        System.out.println(Conversor.kmhANudos(18.52));
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `Math` no se crea con `new`?",
          bloques: [
            {
              t: "texto",
              md: "Porque todos sus miembros son `static` y su constructor es privado: no tiene sentido crear un «objeto matemático». Es una **clase de utilidades**. Tú puedes hacer lo mismo con `Fiscal` o `Conversor`: no tienen datos propios de cada objeto, solo funciones."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Estado global compartido = cuidado.** Una propiedad `static` **no final** es, en la práctica, una variable global: cualquier parte del programa puede cambiarla y los fallos son difíciles de localizar (y se complican aún más con varios hilos). Úsalas para contadores sencillos y constantes; para casi todo lo demás, pasa los datos por parámetros.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos lo **estático**.",
        inicial: [
          {
            p: "¿A qué pertenece un miembro `static`?",
            o: ["A cada objeto", "A la clase", "Al paquete", "Al `main`"],
            c: 1,
            e: "A la clase: existe una sola vez."
          },
          {
            p: "¿Puede un método `static` usar `this`?",
            o: ["Sí", "No: no pertenece a ningún objeto", "Solo en `main`", "Solo con `final`"],
            c: 1,
            e: "No tiene `this`: no hay objeto."
          },
          {
            p: "¿Cómo se declara una constante de clase pública?",
            o: ["`public final int X`", "`public static final int X`", "`static int X`", "`const int X`"],
            c: 1,
            e: "`public static final`."
          }
        ],
        pasos: [
          {
            titulo: "Miembros de la clase",
            cubre: [0, 2],
            explica: "Un miembro `static` es de la clase, no de cada objeto; se usa con `NombreClase.miembro`. Sirve para constantes, utilidades y contadores.",
            ejemplo: {
              code: `class Tienda {
    public static final String NOMBRE = "Náutica Bahía";
    static int abiertos = 0;
}

public class Main {
    public static void main(String[] args) {
        Tienda.abiertos++;
        System.out.println(Tienda.NOMBRE + " " + Tienda.abiertos);
    }
}`,
              ejecutable: true,
              titulo: "Sin crear ningún objeto"
            },
            pregunta: {
              p: "¿Cómo se accede a una constante estática desde fuera?",
              o: ["`objeto.CONSTANTE`", "`NombreClase.CONSTANTE`", "`this.CONSTANTE`", "`super.CONSTANTE`"],
              c: 1,
              e: "Con el nombre de la clase."
            }
          },
          {
            titulo: "Qué puede hacer un método estático",
            cubre: [1],
            explica: "Sin `this`, un método estático no puede tocar propiedades ni métodos **de instancia**. Los de instancia sí pueden usar los estáticos.",
            pregunta: {
              p: "Un método `static` quiere usar la propiedad `precio` (no estática). ¿Qué ocurre?",
              o: ["Funciona", "Error de compilación", "Usa el precio de un objeto al azar", "Lanza excepción"],
              c: 1,
              e: "No hay objeto al que preguntar el precio."
            },
            extra: "Un método estático es como una función suelta que vive dentro de la clase. No tiene «yo» (`this`), así que no sabe de qué objeto hablas.",
            profundiza: "Por eso `main` solo puede llamar directamente a métodos `static` de su clase: para usar los de instancia tiene que crear antes un objeto."
          }
        ],
        reto: {
          p: `**Reto final.** Añade a \`Reserva\` un contador **estático** para que el código de cada reserva se genere solo: \`RES-1\`, \`RES-2\`… Debe mostrar:
\`\`\`
RES-1
RES-2
Total: 2
\`\`\``,
          inicial: `class Reserva {
    private final String codigo;

    public Reserva() {
        // TODO: código automático
        this.codigo = "";
    }

    public String getCodigo() { return codigo; }

    // TODO: getTotal estático
}

public class App {
    public static void main(String[] args) {
        Reserva a = new Reserva();
        Reserva b = new Reserva();
        System.out.println(a.getCodigo());
        System.out.println(b.getCodigo());
        System.out.println("Total: " + Reserva.getTotal());
    }
}`,
          tests: [
            {
              out: `RES-1
RES-2
Total: 2`
            }
          ],
          solucion: `class Reserva {
    private static int total = 0;
    private final String codigo;

    public Reserva() {
        total++;
        this.codigo = "RES-" + total;
    }

    public String getCodigo() { return codigo; }

    public static int getTotal() { return total; }
}

public class App {
    public static void main(String[] args) {
        Reserva a = new Reserva();
        Reserva b = new Reserva();
        System.out.println(a.getCodigo());
        System.out.println(b.getCodigo());
        System.out.println("Total: " + Reserva.getTotal());
    }
}`,
          pistas: [
            "Una propiedad `private static int total` que se incrementa en el constructor.",
            "`getTotal` debe ser `static` para poder llamarlo como `Reserva.getTotal()`."
          ]
        }
      }
    },

    {
      id: "ut4-paquetes",
      titulo: "Paquetes y librerías de clases",
      resumen: "Organizar las clases en paquetes, importarlas y empaquetarlas en un `.jar`.",
      bloques: [
        {
          t: "texto",
          md: `Un programa real puede tener cientos de clases. Para no tenerlas todas mezcladas, se agrupan en **paquetes** (*packages*), igual que los archivos se agrupan en carpetas. Ya conoces los de Java: \`java.util\` (\`Scanner\`, \`Random\`), \`java.time\` (\`LocalDate\`), \`java.lang\` (\`String\`, \`Math\`)…

Para poner una clase en un paquete se escribe, como **primera línea** del archivo, \`package\`:`
        },
        {
          t: "codigo",
          titulo: "src/es/nauticabahia/modelo/Producto.java",
          code: `package es.nauticabahia.modelo;

public class Producto {
    // ...
}`
        },
        {
          t: "texto",
          md: "El paquete se corresponde con una **estructura de carpetas**: este archivo debe estar en `src/es/nauticabahia/modelo/Producto.java`. Por convención, los nombres de paquete van en **minúsculas** y empiezan por el **dominio de la organización al revés** (`es.nauticabahia`), para que sean únicos en todo el mundo. Una organización típica para nuestro proyecto:"
        },
        {
          t: "codigo",
          titulo: "Estructura del proyecto",
          code: `src/
+-- es/nauticabahia/modelo/    Producto, Cliente, Alquiler
+-- es/nauticabahia/util/      Fiscal
+-- es/nauticabahia/app/       App (la clase con main)`
        },
        {
          t: "relacionar",
          p: "Relaciona cada clase con el paquete donde la colocarías.",
          pares: [
            ["Producto", "es.nauticabahia.modelo"],
            ["Fiscal (IVA)", "es.nauticabahia.util"],
            ["App (con el main)", "es.nauticabahia.app"],
            ["Scanner", "java.util"]
          ],
          e: "Modelo = datos de la empresa; util = herramientas; app = punto de entrada."
        },
        {
          t: "texto",
          md: "Para usar una clase de **otro** paquete hay que **importarla** (lo conoces de `Scanner`) o escribir su nombre completo:"
        },
        {
          t: "codigo",
          titulo: "App.java importa las clases que usa",
          code: `package es.nauticabahia.app;

import es.nauticabahia.modelo.Producto;
import es.nauticabahia.util.Fiscal;

public class App {
    public static void main(String[] args) {
        Producto kayak = new Producto("KY-0001", "Kayak", 249.90, 5);
        System.out.println(Fiscal.conIva(kayak.getPrecio()));
    }
}`
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "Los paquetes también afectan a la **visibilidad**: un miembro **sin modificador** (ni `public` ni `private`) es visible desde las clases del **mismo paquete** y desde ninguna otra. Por eso `Producto` y `Cliente` tienen que ser `public` para que `App`, que está en otro paquete, pueda usarlas."
        },
        {
          t: "huecos",
          p: "Completa la cabecera de `App` para que pueda usar `Producto` del paquete `modelo`.",
          codigo: `{{package}} es.nauticabahia.app;

{{import}} es.nauticabahia.modelo.Producto;`,
          e: "`package` declara el paquete propio (primera línea) e `import` trae una clase de otro."
        },
        {
          t: "test",
          p: "¿Dónde debe estar el archivo `Fiscal.java` si declara `package es.nauticabahia.util;`?",
          o: [
            "En cualquier carpeta",
            "En `src/es/nauticabahia/util/`",
            "En `src/util/`",
            "En la raíz del proyecto"
          ],
          c: 1,
          e: "La estructura de carpetas debe coincidir con el nombre del paquete."
        },
        {
          t: "texto",
          md: `### Librerías de clases
Una **librería** es un conjunto de clases ya hechas y empaquetadas para que otros programas las usen. En Java se distribuyen en archivos **\`.jar\`** (un \`.zip\` con los \`.class\`). Las tuyas se pueden empaquetar así, desde la carpeta del proyecto, con la herramienta \`jar\` del JDK:
\`\`\`
jar cf nautica.jar -C bin .
\`\`\`
Y para usar la librería de otro (un \`.jar\` descargado) basta añadirla al proyecto: en Visual Studio Code, en el panel *Java Projects*, en el apartado *Referenced Libraries*. Desde ese momento, sus paquetes se importan con \`import\` igual que los de Java.`
        },
        {
          t: "ordenar",
          p: "Ordena los pasos para compartir tus clases del modelo como librería.",
          items: [
            "Organizar las clases en paquetes",
            "Compilar el proyecto (carpeta `bin`)",
            "Generar el `.jar` con la herramienta `jar`",
            "Añadir el `.jar` a *Referenced Libraries* de otro proyecto",
            "Importar sus paquetes con `import`"
          ],
          e: "Paquetes → compilar → empaquetar → añadir al otro proyecto → importar."
        },
        {
          t: "profundizar",
          titulo: "¿Qué diferencia hay entre `import java.util.Scanner;` e `import java.util.*;`?",
          bloques: [
            {
              t: "texto",
              md: "El primero importa **una** clase concreta; el segundo, **todas** las del paquete. Funcionan igual, pero se prefiere importar clases concretas porque se ve claramente de dónde viene cada una y se evitan **conflictos de nombres** (hay dos clases `Date`, en `java.util` y en `java.sql`)."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Un proyecto sin paquete** (el «paquete por defecto») no se puede importar desde otro paquete. Cualquier clase que vaya a ser reutilizada, aunque sea en un proyecto pequeño, debe estar en un paquete con nombre. Los proyectos de verdad (Maven, Gradle) imponen además la estructura `src/main/java/...`.",
          modo: "pro"
        },
        {
          t: "practica",
          titulo: "Organiza Náutica Bahía en paquetes y crea tu librería",
          p: "Esta práctica se hace en **tu IDE**: el navegador no puede crear carpetas ni archivos `.jar`.",
          pasos: [
            {
              t: "Reorganiza el proyecto",
              md: "Crea en tu proyecto los paquetes `es.nauticabahia.modelo`, `es.nauticabahia.util` y `es.nauticabahia.app`. Mueve `Producto`, `Cliente` y `Alquiler` al primero; `Fiscal` al segundo; `App` al tercero.",
              check: "Cada archivo empieza por su `package` y el IDE no marca errores."
            },
            {
              t: "Añade los import",
              md: "En `App`, importa las clases que necesita. Comprueba que el programa funciona igual que antes.",
              check: "El programa compila y muestra lo mismo que antes del cambio.",
              pregunta: "¿Qué clases han tenido que pasar a `public` para que `App` las vea?"
            },
            {
              t: "Genera el .jar",
              md: "Con la herramienta `jar` (o el menú *Export JAR* de tu IDE) genera `nautica.jar` con las clases del modelo.",
              code: "jar cf nautica.jar -C bin .",
              check: "Existe `nautica.jar` y, al abrirlo como zip, contiene la carpeta `es/nauticabahia/modelo`."
            },
            {
              t: "Úsalo desde otro proyecto",
              md: "Crea un proyecto nuevo, añade `nautica.jar` en *Referenced Libraries* y crea un `Alquiler` importando sus clases. Ejecuta con `java -cp nautica.jar es.nauticabahia.app.App` si quieres probarlo desde consola.",
              check: "El proyecto nuevo crea un `Alquiler` sin tener el código fuente de las clases."
            }
          ],
          entrega: "Una captura de la estructura de carpetas, el contenido del `.jar` y la ejecución desde el segundo proyecto."
        }
      ],
      tutor: {
        intro: "Veamos los **paquetes y las librerías**.",
        inicial: [
          {
            p: "¿Dónde se escribe la línea `package`?",
            o: ["En cualquier sitio", "Como primera línea del archivo", "Dentro de la clase", "En el `main`"],
            c: 1,
            e: "Primera línea del archivo."
          },
          {
            p: "¿Cómo se escribe por convención un nombre de paquete?",
            o: ["MAYÚSCULAS", "minúsculas, empezando por el dominio al revés", "Con espacios", "Como una clase"],
            c: 1,
            e: "`es.nauticabahia.modelo`."
          },
          {
            p: "¿Qué es un archivo `.jar`?",
            o: [
              "Un compilador",
              "Un `.zip` con clases compiladas para reutilizar",
              "Un tipo de excepción",
              "Un paquete de Java"
            ],
            c: 1,
            e: "Una librería empaquetada."
          }
        ],
        pasos: [
          {
            titulo: "Paquetes e import",
            cubre: [0, 1],
            explica: "Un paquete agrupa clases y se corresponde con carpetas. Para usar una clase de otro paquete, `import`. Sin modificador, un miembro solo es visible dentro de su paquete.",
            pregunta: {
              p: "Una clase `public` en el paquete `modelo`, ¿puede usarse desde el paquete `app`?",
              o: ["No", "Sí, con `import`", "Solo si es `static`", "Solo si está en la misma carpeta"],
              c: 1,
              e: "`public` + `import`."
            },
            extra: "Piensa en carpetas de tu ordenador: puedes tener dos archivos con el mismo nombre si están en carpetas distintas. Los paquetes evitan choques de nombres de la misma manera."
          },
          {
            titulo: "Librerías (.jar)",
            cubre: [2],
            explica: "Un `.jar` es un `.zip` con las clases compiladas. Se genera con `jar cf` y se añade al proyecto que lo quiera usar; luego se importa como cualquier paquete de Java.",
            pregunta: {
              p: "¿Para qué sirve generar un `.jar` con las clases del modelo?",
              o: [
                "Para que se ejecuten más rápido",
                "Para reutilizarlas en otros proyectos sin copiar el código fuente",
                "Para no tener que compilar",
                "Para ocultar errores"
              ],
              c: 1,
              e: "Reutilización."
            }
          }
        ]
      }
    },

    {
      id: "ut4-integracion",
      titulo: "Todo junto: el modelo de Náutica Bahía",
      resumen: "Un programa completo que reúne clases, composición, excepciones y estáticos: productos, clientes, ventas y IVA.",
      bloques: [
        {
          t: "texto",
          md: "Un ejemplo completo que reúne la unidad: tres clases del modelo (`Producto`, `Cliente`, `Venta`), una excepción propia, una clase de utilidades (`Fiscal`) y un `main`. Una `Venta` **tiene un** cliente y **tiene un** producto (composición), calcula su total con el descuento del socio y el IVA, y descuenta el stock **lanzando una excepción** si no hay suficiente."
        },
        {
          t: "codigo",
          titulo: "El modelo completo (cada clase iría en su archivo)",
          code: `class StockInsuficienteException extends Exception {
    public StockInsuficienteException(String mensaje) {
        super(mensaje);
    }
}

class Fiscal {
    public static final double IVA_GENERAL = 0.21;
    public static double conIva(double base) { return base * (1 + IVA_GENERAL); }
}

class Cliente {
    private String nombre;
    private boolean socio;
    public Cliente(String nombre, boolean socio) { this.nombre = nombre; this.socio = socio; }
    public String getNombre() { return nombre; }
    public double calcularDescuento() { return socio ? 0.10 : 0; }
}

class Producto {
    private final String codigo;
    private String nombre;
    private double precio;
    private int stock;

    public Producto(String codigo, String nombre, double precio, int stock) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }

    public void vender(int unidades) throws StockInsuficienteException {
        if (unidades > stock) {
            throw new StockInsuficienteException("Piden " + unidades + " unidades y solo quedan " + stock);
        }
        stock -= unidades;
    }

    @Override
    public String toString() {
        return String.format("%s (%s): %.2f euros, stock %d", nombre, codigo, precio, stock);
    }
}

class Venta {
    private final Cliente cliente;
    private final Producto producto;
    private final int unidades;

    public Venta(Cliente cliente, Producto producto, int unidades) throws StockInsuficienteException {
        producto.vender(unidades);          // si no hay stock, la venta no se crea
        this.cliente = cliente;
        this.producto = producto;
        this.unidades = unidades;
    }

    public double calcularBase() {
        return unidades * producto.getPrecio() * (1 - cliente.calcularDescuento());
    }

    public double calcularTotal() {
        return Fiscal.conIva(calcularBase());
    }

    @Override
    public String toString() {
        return String.format("%s compra %d x %s: %.2f euros",
                cliente.getNombre(), unidades, producto.getNombre(), calcularTotal());
    }
}

public class App {
    public static void main(String[] args) {
        Producto chaleco = new Producto("CH-0010", "Chaleco salvavidas", 34.50, 6);
        Cliente laura = new Cliente("Laura Martínez", true);

        try {
            Venta v1 = new Venta(laura, chaleco, 4);
            System.out.println(v1);
            Venta v2 = new Venta(laura, chaleco, 4);     // solo quedan 2
            System.out.println(v2);
        } catch (StockInsuficienteException e) {
            System.out.println("Venta rechazada: " + e.getMessage());
        }
        System.out.println(chaleco);
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: "Léelo y responde: **¿qué clase tiene la responsabilidad de decidir si hay stock?** (`Producto`, porque es quien conoce su stock). **¿Por qué el constructor de `Venta` lleva `throws`?** (porque llama a `vender`, que puede lanzar una excepción comprobada). **¿Qué le pasa al stock cuando la segunda venta falla?** (nada: la excepción se lanza antes de modificarlo). **¿Cuántas veces aparece el 21 % del IVA en todo el programa?** (una sola: en `Fiscal`)."
        },
        {
          t: "abierta",
          p: "Explica con tus palabras por qué, en el programa anterior, la segunda venta no deja el stock en un estado inconsistente. ¿Qué papel juegan el orden de las instrucciones en `vender` y el `throws` del constructor de `Venta`?",
          modelo: "En `vender`, la comprobación `unidades > stock` se hace **antes** de restar: si no hay stock suficiente, se lanza la excepción y la resta (`stock -= unidades`) no llega a ejecutarse, así que el stock queda como estaba. Como el constructor de `Venta` llama primero a `producto.vender(unidades)` y la excepción se propaga, el objeto `Venta` ni siquiera llega a crearse: no existe ninguna venta a medias. El `throws` del constructor avisa de que puede fallar y obliga a quien lo llame a tratarlo.",
          rubrica: [
            "Explica que la comprobación va antes de modificar el stock",
            "Dice que la excepción impide crear la venta",
            "Relaciona el `throws` con tratar la excepción comprobada"
          ],
          minPalabras: 40
        },
        {
          t: "ejecuta",
          p: `**Completa \`Venta\`.** Escribe \`calcularBase()\` (unidades × precio × (1 − descuento)) y \`calcularTotal()\` (base con IVA usando \`Fiscal.conIva\`). Debe mostrar:
\`\`\`
Base: 124.2
Total: 150.28
\`\`\``,
          inicial: `class Fiscal {
    public static final double IVA_GENERAL = 0.21;
    public static double conIva(double base) { return base * (1 + IVA_GENERAL); }
}

class Venta {
    private double precio;
    private int unidades;
    private double descuento;

    public Venta(double precio, int unidades, double descuento) {
        this.precio = precio;
        this.unidades = unidades;
        this.descuento = descuento;
    }

    public double calcularBase() {
        return 0;      // TODO
    }

    public double calcularTotal() {
        return 0;      // TODO
    }
}

public class App {
    public static void main(String[] args) {
        Venta v = new Venta(34.50, 4, 0.10);
        System.out.println("Base: " + v.calcularBase());
        System.out.println("Total: " + String.format("%.2f", v.calcularTotal()).replace(",", "."));
    }
}`,
          tests: [
            {
              out: `Base: 124.2
Total: 150.28`
            }
          ],
          pistas: [
            "`calcularTotal` no repite la fórmula del descuento: llama a `calcularBase()` y se lo pasa a `Fiscal.conIva(...)`."
          ],
          solucion: `class Fiscal {
    public static final double IVA_GENERAL = 0.21;
    public static double conIva(double base) { return base * (1 + IVA_GENERAL); }
}

class Venta {
    private double precio;
    private int unidades;
    private double descuento;

    public Venta(double precio, int unidades, double descuento) {
        this.precio = precio;
        this.unidades = unidades;
        this.descuento = descuento;
    }

    public double calcularBase() {
        return unidades * precio * (1 - descuento);
    }

    public double calcularTotal() {
        return Fiscal.conIva(calcularBase());
    }
}

public class App {
    public static void main(String[] args) {
        Venta v = new Venta(34.50, 4, 0.10);
        System.out.println("Base: " + v.calcularBase());
        System.out.println("Total: " + String.format("%.2f", v.calcularTotal()).replace(",", "."));
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `Venta` llama a `vender` en el constructor y no en el `main`?",
          bloques: [
            {
              t: "texto",
              md: "Porque así **es imposible** tener una `Venta` que no haya descontado stock: el constructor garantiza la regla. Si lo hiciera el `main`, cualquier otro programa que cree ventas podría olvidarse del descuento. Poner las reglas **dentro de la clase** es justo lo que busca la encapsulación."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Un cambio, un sitio.** Si mañana el descuento del socio pasa al 12 %, solo cambia `Cliente.calcularDescuento()`; si el IVA sube, solo `Fiscal`. Cuando un cambio de negocio obliga a tocar muchas clases, el diseño tiene **demasiado acoplamiento**: es la señal para repartir mejor las responsabilidades.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Alquileres con herencia y composición",
          p: `La tienda alquila material. Programa estas clases (cada una en su archivo en tu IDE):
- \`Equipo\` (nombre, tarifaHora) con \`calcularCoste(int horas)\`.
- \`EquipoPremium\` **hereda** de \`Equipo\` y suma un **suplemento fijo** de 5 € por alquiler (ya incluido en \`calcularCoste\`).
- \`Alquiler\` **tiene un** \`Equipo\`, un cliente (nombre) y unas horas. \`calcularTotal()\` = coste del equipo con IVA (\`Fiscal.IVA\`, 21 %).
Debe mostrar:
\`\`\`
Ana alquila Kayak 3 h: 50.82
Ana alquila Velero 3 h: 78.65
\`\`\``,
          requisitos: [
            "Propiedades privadas",
            "Constructores con `super(...)`",
            "`calcularCoste` sobrescrito reutilizando el de la superclase",
            "Una sola definición del IVA"
          ],
          inicial: `class Fiscal {
    public static final double IVA = 0.21;
}

class Equipo {
    private String nombre;
    private double tarifaHora;

    public Equipo(String nombre, double tarifaHora) {
        this.nombre = nombre;
        this.tarifaHora = tarifaHora;
    }

    public String getNombre() { return nombre; }

    public double calcularCoste(int horas) {
        return 0;   // TODO
    }
}

// TODO: EquipoPremium extends Equipo

class Alquiler {
    // TODO: propiedades, constructor, calcularTotal y toString
}

public class App {
    public static void main(String[] args) {
        Equipo kayak = new Equipo("Kayak", 14);
        Equipo velero = new EquipoPremium("Velero", 20);
        System.out.println(new Alquiler("Ana", kayak, 3));
        System.out.println(new Alquiler("Ana", velero, 3));
    }
}`,
          tests: [
            {
              out: `Ana alquila Kayak 3 h: 50.82
Ana alquila Velero 3 h: 78.65`
            }
          ],
          pistas: [
            "El suplemento puede ser una constante `private static final` dentro de `EquipoPremium`.",
            "Con herencia, `Alquiler` no necesita saber si el equipo es premium: llama a `calcularCoste` y manda el objeto real (polimorfismo)."
          ],
          solucion: `class Fiscal {
    public static final double IVA = 0.21;
}

class Equipo {
    private String nombre;
    private double tarifaHora;

    public Equipo(String nombre, double tarifaHora) {
        this.nombre = nombre;
        this.tarifaHora = tarifaHora;
    }

    public String getNombre() { return nombre; }

    public double calcularCoste(int horas) {
        return horas * tarifaHora;
    }
}

class EquipoPremium extends Equipo {
    private static final double SUPLEMENTO = 5;

    public EquipoPremium(String nombre, double tarifaHora) {
        super(nombre, tarifaHora);
    }

    @Override
    public double calcularCoste(int horas) {
        return super.calcularCoste(horas) + SUPLEMENTO;
    }
}

class Alquiler {
    private String cliente;
    private Equipo equipo;
    private int horas;

    public Alquiler(String cliente, Equipo equipo, int horas) {
        this.cliente = cliente;
        this.equipo = equipo;
        this.horas = horas;
    }

    public double calcularTotal() {
        return equipo.calcularCoste(horas) * (1 + Fiscal.IVA);
    }

    @Override
    public String toString() {
        return cliente + " alquila " + equipo.getNombre() + " " + horas + " h: "
                + String.format("%.2f", calcularTotal()).replace(",", ".");
    }
}

public class App {
    public static void main(String[] args) {
        Equipo kayak = new Equipo("Kayak", 14);
        Equipo velero = new EquipoPremium("Velero", 20);
        System.out.println(new Alquiler("Ana", kayak, 3));
        System.out.println(new Alquiler("Ana", velero, 3));
    }
}`,
          modo: "pro"
        },
        {
          t: "practica",
          titulo: "Modelo de Náutica Bahía en tu IDE (Reto 1)",
          p: "Continúa el **Reto 1: Utilidades para la empresa** en un proyecto llamado `nautica-ut4`. Esta práctica se hace en **tu IDE**; aquí tienes la guía.",
          pasos: [
            {
              t: "Dibuja antes de programar",
              md: "Dibuja a mano el diagrama de clases: `Producto`, `Cliente`, `Venta` y `Fiscal`, con propiedades y métodos. Marca con `-` lo privado y `+` lo público.",
              check: "Cada clase tiene sus tres cajas y tus propiedades son privadas."
            },
            {
              t: "Escribe las clases del modelo",
              md: "Una por archivo. Propiedades `private`, constructor que valide, getters solo donde hagan falta y `toString` legible. Añade Javadoc a los métodos públicos.",
              check: "Ningún acceso a propiedades desde fuera de su clase; los datos inválidos lanzan excepción.",
              pregunta: "¿Qué propiedades has hecho `final` y por qué?"
            },
            {
              t: "Escribe el `main`",
              md: "En `App`, crea clientes y productos, haz ventas dentro de un `try-catch` y muestra el resultado, incluida una venta rechazada por falta de stock.",
              check: "Muestra la venta válida, el mensaje de rechazo y el stock final."
            },
            {
              t: "Tabla de casos de prueba",
              md: "Prepara una tabla (UT3) con al menos: venta normal, venta justo con el stock disponible, venta con una unidad más y cliente socio frente a no socio. Anota resultado esperado y obtenido.",
              check: "Los valores límite de stock están probados y los resultados coinciden con los esperados."
            },
            {
              t: "Revisa la encapsulación",
              md: "Cambia la regla del descuento del socio tocando **una sola clase**. Si has tenido que tocar más, repasa dónde has puesto cada responsabilidad.",
              check: "El cambio de descuento solo afecta a `Cliente`."
            }
          ],
          entrega: "Proyecto con las clases del modelo, `App`, diagrama de clases a mano y la tabla de casos de prueba."
        }
      ],
      tutor: {
        intro: "Veamos cómo se **combina todo** en un programa completo.",
        inicial: [
          {
            p: "En el modelo, ¿qué clase decide si hay stock suficiente?",
            o: ["`App`", "`Producto`", "`Fiscal`", "`Cliente`"],
            c: 1,
            e: "Quien conoce el dato (el stock) es quien debe proteger la regla."
          },
          {
            p: "¿Cuántas veces debe escribirse el 21 % del IVA en un programa bien diseñado?",
            o: ["Una por clase", "Una sola vez, en una constante", "Cada vez que se usa", "Ninguna"],
            c: 1,
            e: "Una constante en `Fiscal`."
          },
          {
            p: "Una `Venta` guarda un `Cliente` y un `Producto`. ¿Qué relación es?",
            o: ["Herencia", "Composición", "Sobrecarga", "Estática"],
            c: 1,
            e: "«Tiene un»."
          }
        ],
        pasos: [
          {
            titulo: "Reparto de responsabilidades",
            cubre: [0, 1, 2],
            explica: "Cada clase se ocupa de lo suyo: `Producto` valida y modifica su stock, `Cliente` sabe su descuento, `Fiscal` conoce el IVA y `Venta` los combina preguntándoles. Así, un cambio afecta a **una** clase.",
            pregunta: {
              p: "Si cambia el descuento del socio, ¿qué clase habría que modificar?",
              o: ["`Cliente`", "`Venta`", "`App`", "Todas"],
              c: 0,
              e: "La que sabe el descuento."
            },
            extra: "Es como una cocina: el que corta las verduras no decide la receta ni cobra la cuenta. Cada cual hace lo suyo y el pedido sale porque se coordinan."
          }
        ],
        reto: {
          p: `**Reto final.** Completa \`Producto.vender\` para que lance \`IllegalStateException("Sin stock suficiente")\` cuando \`unidades > stock\` y reste en caso contrario. Debe mostrar:
\`\`\`
Quedan 3
Sin stock suficiente
\`\`\``,
          inicial: `class Producto {
    private int stock = 5;

    public void vender(int unidades) {
        // TODO
    }

    public int getStock() { return stock; }
}

public class App {
    public static void main(String[] args) {
        Producto p = new Producto();
        p.vender(2);
        System.out.println("Quedan " + p.getStock());
        try {
            p.vender(4);
        } catch (IllegalStateException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
          tests: [
            {
              out: `Quedan 3
Sin stock suficiente`
            }
          ],
          solucion: `class Producto {
    private int stock = 5;

    public void vender(int unidades) {
        if (unidades > stock) {
            throw new IllegalStateException("Sin stock suficiente");
        }
        stock -= unidades;
    }

    public int getStock() { return stock; }
}

public class App {
    public static void main(String[] args) {
        Producto p = new Producto();
        p.vender(2);
        System.out.println("Quedan " + p.getStock());
        try {
            p.vender(4);
        } catch (IllegalStateException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
          pistas: ["Comprueba **antes** de restar: así, si falla, el stock queda intacto."]
        }
      }
    }

  ],

  /* ============ BANCO DE PREGUNTAS PARA LA AUTOEVALUACIÓN (+1 / −1/3 / 0) ============ */
  banco: [
    {
      sec: "ut4-concepto",
      p: "¿Qué es una clase?",
      o: [
        "Un objeto concreto",
        "La definición de un tipo: sus propiedades y sus métodos",
        "Un método especial",
        "Una variable global"
      ],
      c: 1,
      e: "Es el molde a partir del cual se crean objetos."
    },
    {
      sec: "ut4-concepto",
      p: "¿Qué palabra clave crea un objeto?",
      o: ["`class`", "`new`", "`this`", "`create`"],
      c: 1,
      e: "`new` crea un objeto de la clase."
    },
    {
      sec: "ut4-concepto",
      p: "Al diseñar con la descripción de un problema, los **sustantivos** suelen ser…",
      o: ["Métodos", "Clases", "Excepciones", "Paquetes"],
      c: 1,
      e: "Sustantivos → clases; características → propiedades; verbos → métodos."
    },
    {
      sec: "ut4-concepto",
      p: "Los **verbos** de la descripción de un problema suelen ser…",
      o: ["Clases", "Propiedades", "Métodos", "Constantes"],
      c: 2,
      e: "Son las operaciones: métodos."
    },
    {
      sec: "ut4-concepto",
      p: `¿Qué muestra?
\`\`\`
class Producto { int stock; }

public class Main {
    public static void main(String[] args) {
        Producto a = new Producto();
        a.stock = 5;
        Producto b = a;
        b.stock = 8;
        System.out.println(a.stock);
    }
}
\`\`\``,
      o: ["5", "8", "0", "Error"],
      c: 1,
      e: "`b = a` copia la referencia: es el mismo objeto.",
      salida: "8"
    },
    {
      sec: "ut4-concepto",
      p: `¿Qué muestra?
\`\`\`
class Producto { int stock; }

public class Main {
    public static void main(String[] args) {
        Producto a = new Producto();
        Producto b = new Producto();
        a.stock = 5;
        System.out.println(a.stock + " " + b.stock);
    }
}
\`\`\``,
      o: ["5 5", "5 0", "0 0", "Error"],
      c: 1,
      e: "Son dos objetos distintos; `b.stock` conserva su valor por defecto, 0.",
      salida: "5 0"
    },
    {
      sec: "ut4-concepto",
      p: "Una variable de tipo `Producto` contiene…",
      o: [
        "El objeto entero",
        "Una referencia al objeto",
        "Una copia de las propiedades",
        "El nombre de la clase"
      ],
      c: 1,
      e: "Una referencia (una flecha) al objeto."
    },
    {
      sec: "ut4-concepto",
      p: "En el diagrama de clases, ¿cuántos compartimentos tiene la caja de una clase?",
      o: ["Uno", "Dos", "Tres: nombre, propiedades y métodos", "Cuatro"],
      c: 2,
      e: "Nombre, propiedades y métodos."
    },
    {
      sec: "ut4-concepto",
      p: "En un diagrama de clases, `-` delante de un miembro indica…",
      o: ["Que es estático", "Que es privado", "Que es público", "Que es constante"],
      c: 1,
      e: "`-` privado, `+` público.",
      nivel: "pro"
    },
    {
      sec: "ut4-visibilidad",
      p: "¿Qué miembros puede usar el código de **otra** clase si son `private`?",
      o: ["Todos", "Ninguno", "Solo las propiedades", "Solo los métodos"],
      c: 1,
      e: "`private` limita el acceso a la propia clase."
    },
    {
      sec: "ut4-visibilidad",
      p: "¿Qué visibilidad es la más abierta?",
      o: ["`private`", "`protected`", "`public`", "Sin modificador"],
      c: 2,
      e: "`public`: cualquier clase."
    },
    {
      sec: "ut4-visibilidad",
      p: "Un miembro sin modificador de visibilidad es visible desde…",
      o: ["Cualquier clase", "Las clases de su mismo paquete", "Ninguna", "Sus subclases solamente"],
      c: 1,
      e: "Visibilidad de paquete."
    },
    {
      sec: "ut4-visibilidad",
      p: "¿Qué es la encapsulación?",
      o: [
        "Escribir todo en una clase",
        "Proteger los datos del objeto y controlar su acceso con métodos",
        "Heredar de otra clase",
        "Crear paquetes"
      ],
      c: 1,
      e: "Propiedades privadas y acceso mediante métodos que validan."
    },
    {
      sec: "ut4-visibilidad",
      p: "Con `private double precio;` en `Producto`, ¿qué ocurre al escribir `p.precio = 5;` en el `main`?",
      o: ["Funciona", "Error de compilación", "Excepción en ejecución", "Se ignora"],
      c: 1,
      e: "El compilador lo rechaza: `precio has private access in Producto`."
    },
    {
      sec: "ut4-visibilidad",
      p: "¿Qué convención se sigue normalmente en una clase?",
      o: [
        "Propiedades públicas y métodos privados",
        "Propiedades privadas y métodos que forman su cara pública, públicos",
        "Todo público",
        "Todo privado"
      ],
      c: 1,
      e: "Propiedades `private`, métodos públicos necesarios."
    },
    {
      sec: "ut4-visibilidad",
      p: "¿Qué garantiza la encapsulación bien aplicada?",
      o: [
        "Que el programa sea más rápido",
        "Que el objeto siempre conserva datos válidos",
        "Que no haya excepciones",
        "Que no se necesiten constructores"
      ],
      c: 1,
      e: "La clase hace cumplir sus propias reglas."
    },
    {
      sec: "ut4-visibilidad",
      p: "¿En qué orden se escriben normalmente los miembros de una clase?",
      o: [
        "Métodos, constructores, propiedades",
        "Propiedades, constructores, métodos",
        "Constructores, métodos, propiedades",
        "Da igual"
      ],
      c: 1,
      e: "Datos, creación y comportamiento."
    },
    {
      sec: "ut4-propiedades",
      p: `¿Qué muestra?
\`\`\`
class Producto {
    String nombre;
    int stock;
    boolean oferta;
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();
        System.out.println(p.nombre + " " + p.stock + " " + p.oferta);
    }
}
\`\`\``,
      o: ["null 0 false", "\"\" 0 true", "Error", " 0 false"],
      c: 0,
      e: "Valores por defecto de las propiedades: `null`, `0` y `false`.",
      salida: "null 0 false"
    },
    {
      sec: "ut4-propiedades",
      p: "¿Qué valor por defecto tiene una propiedad `double`?",
      o: ["`null`", "`0.0`", "`NaN`", "No tiene"],
      c: 1,
      e: "`0.0`."
    },
    {
      sec: "ut4-propiedades",
      p: "Una variable **local** sin inicializar…",
      o: ["Vale 0", "No se puede usar: error de compilación", "Vale `null`", "Vale `false`"],
      c: 1,
      e: "A diferencia de las propiedades, las locales no tienen valor por defecto."
    },
    {
      sec: "ut4-propiedades",
      p: "¿Qué hace una propiedad `final`?",
      o: ["Solo se puede asignar una vez", "Es estática", "Es pública", "Se inicializa a 0 siempre"],
      c: 0,
      e: "Se asigna una sola vez, normalmente en el constructor."
    },
    {
      sec: "ut4-propiedades",
      p: "¿Qué es un setter?",
      o: [
        "Un método que lee una propiedad",
        "Un método que modifica una propiedad, validando si hace falta",
        "Un constructor",
        "Una constante"
      ],
      c: 1,
      e: "Es el sitio donde se valida."
    },
    {
      sec: "ut4-propiedades",
      p: "El getter de una propiedad `boolean socio` se llama por convención…",
      o: ["`getSocio()`", "`isSocio()`", "`socio()`", "`hasSocio()`"],
      c: 1,
      e: "Para `boolean` se usa `isAlgo`."
    },
    {
      sec: "ut4-propiedades",
      p: `¿Qué muestra?
\`\`\`
class Producto {
    private int stock = 5;
    public void setStock(int stock) {
        stock = stock;
    }
    public int getStock() { return stock; }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();
        p.setStock(20);
        System.out.println(p.getStock());
    }
}
\`\`\``,
      o: ["5", "20", "0", "Error"],
      c: 0,
      e: "`stock = stock` asigna el parámetro a sí mismo; falta `this.`.",
      salida: "5"
    },
    {
      sec: "ut4-propiedades",
      p: "¿Qué significa `this` dentro de un método?",
      o: ["La clase", "Este objeto, sobre el que se ejecuta el método", "La superclase", "El `main`"],
      c: 1,
      e: "«Este objeto»."
    },
    {
      sec: "ut4-propiedades",
      p: "¿Qué excepción se lanza normalmente en un setter si el valor no es válido?",
      o: ["`IOException`", "`IllegalArgumentException`", "`NullPointerException`", "`ArithmeticException`"],
      c: 1,
      e: "`IllegalArgumentException`: argumento incorrecto."
    },
    {
      sec: "ut4-propiedades",
      p: "¿Hace falta un setter para una propiedad `final`?",
      o: [
        "Sí, siempre",
        "No: se asigna en el constructor y no cambia",
        "Sí, si es `String`",
        "Solo si es pública"
      ],
      c: 1,
      e: "Es precisamente la idea de `final`."
    },
    {
      sec: "ut4-propiedades",
      p: "Una clase con todas las propiedades `final` y sin setters crea objetos…",
      o: ["Mutables", "Inmutables", "Estáticos", "Abstractos"],
      c: 1,
      e: "No cambian tras construirse (como `String`).",
      nivel: "pro"
    },
    {
      sec: "ut4-metodos",
      p: "¿Qué tipo de retorno se usa si el método no devuelve nada?",
      o: ["`null`", "`void`", "`empty`", "`none`"],
      c: 1,
      e: "`void`."
    },
    {
      sec: "ut4-metodos",
      p: "¿Qué es la **sobrecarga** de métodos?",
      o: [
        "Un método muy largo",
        "Varios métodos con el mismo nombre y distintos parámetros",
        "Sustituir un método heredado",
        "Llamar a un método dos veces"
      ],
      c: 1,
      e: "Mismo nombre, parámetros distintos."
    },
    {
      sec: "ut4-metodos",
      p: "¿Se puede sobrecargar un método cambiando solo el tipo de retorno?",
      o: ["Sí", "No", "Solo con `static`", "Solo con `private`"],
      c: 1,
      e: "El compilador no sabría a cuál llamas."
    },
    {
      sec: "ut4-metodos",
      p: `¿Qué muestra?
\`\`\`
public class Main {
    static void subir(double precio) {
        precio = precio * 2;
    }
    public static void main(String[] args) {
        double p = 10;
        subir(p);
        System.out.println(p);
    }
}
\`\`\``,
      o: ["10.0", "20.0", "0.0", "Error"],
      c: 0,
      e: "Se pasa una copia del valor: `p` no cambia.",
      salida: "10.0"
    },
    {
      sec: "ut4-metodos",
      p: `¿Qué muestra?
\`\`\`
class Caja { int valor; }

public class Main {
    static void poner(Caja c) {
        c.valor = 7;
    }
    public static void main(String[] args) {
        Caja k = new Caja();
        poner(k);
        System.out.println(k.valor);
    }
}
\`\`\``,
      o: ["0", "7", "Error", "null"],
      c: 1,
      e: "Se copia la referencia: el método modifica el mismo objeto.",
      salida: "7"
    },
    {
      sec: "ut4-metodos",
      p: `¿Qué muestra?
\`\`\`
class Caja { int valor = 1; }

public class Main {
    static void sustituir(Caja c) {
        c = new Caja();
        c.valor = 99;
    }
    public static void main(String[] args) {
        Caja k = new Caja();
        sustituir(k);
        System.out.println(k.valor);
    }
}
\`\`\``,
      o: ["1", "99", "0", "Error"],
      c: 0,
      e: "Solo cambia la copia de la referencia; `k` sigue apuntando al objeto original.",
      salida: "1"
    },
    {
      sec: "ut4-metodos",
      p: "Java pasa los argumentos…",
      o: [
        "Por referencia siempre",
        "Por valor siempre (con objetos, se copia la referencia)",
        "Por valor los objetos y por referencia los primitivos",
        "Depende del tipo"
      ],
      c: 1,
      e: "Siempre por valor."
    },
    {
      sec: "ut4-metodos",
      p: "¿Qué hace `@Override` antes de un método?",
      o: [
        "Lo hace estático",
        "Indica que sustituye un método heredado y el compilador lo comprueba",
        "Lo oculta",
        "Lo hace público"
      ],
      c: 1,
      e: "Si te equivocas en el nombre, el compilador avisa."
    },
    {
      sec: "ut4-metodos",
      p: "¿Qué muestra `System.out.println(kayak)` si la clase no tiene `toString`?",
      o: ["El precio", "Algo como `Producto@1b6d3586`", "Nada", "Un error"],
      c: 1,
      e: "Muestra el nombre de la clase y un número interno."
    },
    {
      sec: "ut4-metodos",
      p: "¿Qué etiqueta Javadoc documenta un parámetro?",
      o: ["`@arg`", "`@param`", "`@in`", "`@parameter`"],
      c: 1,
      e: "`@param`."
    },
    {
      sec: "ut4-metodos",
      p: "¿Qué convención de nombres se usa para los métodos?",
      o: ["`Mayúscula inicial`", "`lowerCamelCase`, normalmente un verbo", "`SNAKE_CASE`", "Da igual"],
      c: 1,
      e: "Como `calcularTotal`."
    },
    {
      sec: "ut4-metodos",
      p: `¿Qué muestra?
\`\`\`
class Producto {
    public String describir() { return "A"; }
    public String describir(int n) { return "B" + n; }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto();
        System.out.println(p.describir() + p.describir(2));
    }
}
\`\`\``,
      o: ["AB2", "A2", "B2A", "Error"],
      c: 0,
      e: "Java elige cada versión según los argumentos.",
      salida: "AB2"
    },
    {
      sec: "ut4-constructores",
      p: "¿Qué tipo de retorno tiene un constructor?",
      o: ["`void`", "Ninguno", "El de la clase", "`Object`"],
      c: 1,
      e: "No se escribe tipo de retorno."
    },
    {
      sec: "ut4-constructores",
      p: "¿Cómo se llama un constructor?",
      o: ["`constructor`", "Igual que la clase", "Como quieras", "`new`"],
      c: 1,
      e: "Igual que la clase."
    },
    {
      sec: "ut4-constructores",
      p: "¿Cuándo se ejecuta el constructor?",
      o: ["Al compilar", "Al crear el objeto con `new`", "Al llamar a `main`", "Al cerrar el programa"],
      c: 1,
      e: "Con `new`."
    },
    {
      sec: "ut4-constructores",
      p: "Escribes `public Producto(String n) { ... }` y nada más. ¿Compila `new Producto()`?",
      o: ["Sí", "No: el constructor por defecto desaparece", "Sí, con aviso", "Solo si es `static`"],
      c: 1,
      e: "Al escribir un constructor propio, el por defecto desaparece."
    },
    {
      sec: "ut4-constructores",
      p: "¿Dónde debe ir `this(...)` en un constructor?",
      o: ["Al final", "Como primera instrucción", "En cualquier sitio", "Fuera del constructor"],
      c: 1,
      e: "Primera línea."
    },
    {
      sec: "ut4-constructores",
      p: `¿Qué muestra?
\`\`\`
class Reserva {
    public Reserva(int d) {
        System.out.println("A" + d);
    }
    public Reserva() {
        this(1);
        System.out.println("B");
    }
}

public class Main {
    public static void main(String[] args) {
        new Reserva();
    }
}
\`\`\``,
      o: ["A1 / B", "B / A1", "A1", "B"],
      c: 0,
      e: "`this(1)` ejecuta antes el otro constructor.",
      salida: `A1
B`
    },
    {
      sec: "ut4-constructores",
      p: "¿Para qué sirve un constructor sobrecargado?",
      o: [
        "Para ahorrar memoria",
        "Para ofrecer varias formas de crear el objeto",
        "Para heredar",
        "Para evitar excepciones"
      ],
      c: 1,
      e: "Distintas combinaciones de datos."
    },
    {
      sec: "ut4-constructores",
      p: "¿Qué ventaja tiene que el constructor llame al setter para asignar el precio?",
      o: ["Ninguna", "La validación se hace en un solo sitio", "Es más rápido", "Evita el `new`"],
      c: 1,
      e: "No se repite la comprobación."
    },
    {
      sec: "ut4-constructores",
      p: "¿Dónde se asigna una propiedad `final`?",
      o: ["En cualquier método", "En el constructor (o al declararla)", "En un setter", "En el `main`"],
      c: 1,
      e: "Solo una vez; el constructor es el sitio natural."
    },
    {
      sec: "ut4-constructores",
      p: "¿Cuál es el objetivo principal de un constructor?",
      o: [
        "Mostrar datos",
        "Dejar el objeto en un estado inicial válido",
        "Borrar el objeto",
        "Comparar objetos"
      ],
      c: 1,
      e: "Que no exista un objeto a medio construir."
    },
    {
      sec: "ut4-constructores",
      p: "¿Qué pasa si un constructor lanza una excepción?",
      o: [
        "El objeto se crea igualmente",
        "El objeto no llega a crearse",
        "Se crea a medias y se puede usar",
        "El programa termina siempre"
      ],
      c: 1,
      e: "La creación falla y no se obtiene ningún objeto."
    },
    {
      sec: "ut4-uso",
      p: "«Un alquiler **tiene un** cliente»: ¿qué relación es?",
      o: ["Herencia", "Composición", "Sobrecarga", "Polimorfismo"],
      c: 1,
      e: "«Tiene un» → composición."
    },
    {
      sec: "ut4-uso",
      p: `¿Qué muestra?
\`\`\`
class Cliente {
    String nombre;
    Cliente(String n) { nombre = n; }
}

public class Main {
    public static void main(String[] args) {
        Cliente a = new Cliente("Ana");
        Cliente b = new Cliente("Ana");
        System.out.println(a == b);
    }
}
\`\`\``,
      o: ["true", "false", "Error", "Ana"],
      c: 1,
      e: "`==` compara referencias: son dos objetos distintos.",
      salida: "false"
    },
    {
      sec: "ut4-uso",
      p: `¿Qué muestra? (La clase no redefine \`equals\`.)
\`\`\`
class Cliente {
    String nombre;
    Cliente(String n) { nombre = n; }
}

public class Main {
    public static void main(String[] args) {
        Cliente a = new Cliente("Ana");
        Cliente b = new Cliente("Ana");
        System.out.println(a.equals(b));
    }
}
\`\`\``,
      o: ["true", "false", "Error", "Ana"],
      c: 1,
      e: "El `equals` heredado de `Object` equivale a `==`.",
      salida: "false"
    },
    {
      sec: "ut4-uso",
      p: "Si redefines `equals`, ¿qué otro método debes redefinir?",
      o: ["`toString`", "`hashCode`", "`compareTo`", "`clone`"],
      c: 1,
      e: "Lo exige el contrato de Java."
    },
    {
      sec: "ut4-uso",
      p: "¿Qué lanza llamar a un método de un objeto que vale `null`?",
      o: ["`ArithmeticException`", "`NullPointerException`", "`IllegalStateException`", "Nada"],
      c: 1,
      e: "`NullPointerException`."
    },
    {
      sec: "ut4-uso",
      p: "Para evitar un `NullPointerException` por una propiedad sin inicializar, lo mejor es…",
      o: [
        "Capturar siempre la excepción",
        "Inicializarla en el constructor",
        "Hacerla `static`",
        "Hacerla pública"
      ],
      c: 1,
      e: "El constructor debe dejar todas las propiedades en un estado válido."
    },
    {
      sec: "ut4-uso",
      p: "En `equals(Object otro)`, ¿para qué sirve `instanceof`?",
      o: [
        "Para crear objetos",
        "Para comprobar si `otro` es realmente de esa clase",
        "Para heredar",
        "Para comparar `int`"
      ],
      c: 1,
      e: "Comprueba el tipo real del objeto."
    },
    {
      sec: "ut4-uso",
      p: "Dentro de `Alquiler`, ¿cómo se obtiene el precio del producto (propiedad privada)?",
      o: ["`producto.precio`", "`producto.getPrecio()`", "`Producto.precio`", "`this.precio`"],
      c: 1,
      e: "A través de su método público."
    },
    {
      sec: "ut4-uso",
      p: `¿Qué muestra?
\`\`\`
class Cliente {
    private String nombre;
    Cliente(String n) { nombre = n; }
    String getNombre() { return nombre; }
}

class Alquiler {
    private Cliente cliente;
    Alquiler(Cliente c) { cliente = c; }
    String getCliente() { return cliente.getNombre(); }
}

public class Main {
    public static void main(String[] args) {
        Cliente c = new Cliente("Ana");
        Alquiler a = new Alquiler(c);
        System.out.println(a.getCliente());
    }
}
\`\`\``,
      o: ["Ana", "null", "Error", "Cliente"],
      c: 0,
      e: "El alquiler guarda la referencia al mismo cliente.",
      salida: "Ana"
    },
    {
      sec: "ut4-uso",
      p: "¿Qué decide qué hace «iguales» a dos objetos de tu clase?",
      o: ["Java automáticamente", "El método `equals` que escribas", "El constructor", "El paquete"],
      c: 1,
      e: "Es una decisión de diseño de cada clase."
    },
    {
      sec: "ut4-herencia",
      p: "¿Qué palabra declara que una clase hereda de otra?",
      o: ["`implements`", "`extends`", "`inherits`", "`super`"],
      c: 1,
      e: "`class B extends A`."
    },
    {
      sec: "ut4-herencia",
      p: "«Un kayak **es un** producto»: ¿qué relación es?",
      o: ["Composición", "Herencia", "Sobrecarga", "Estática"],
      c: 1,
      e: "«Es un» → herencia."
    },
    {
      sec: "ut4-herencia",
      p: "¿Qué hace `super(...)` en un constructor?",
      o: ["Crea otro objeto", "Ejecuta el constructor de la superclase", "Llama a un método estático", "Nada"],
      c: 1,
      e: "Construye la parte heredada."
    },
    {
      sec: "ut4-herencia",
      p: `¿Qué muestra?
\`\`\`
class A {
    A() { System.out.println("A"); }
}
class B extends A {
    B() { System.out.println("B"); }
}

public class Main {
    public static void main(String[] args) {
        new B();
    }
}
\`\`\``,
      o: ["B", "A / B", "B / A", "A"],
      c: 1,
      e: "Antes del cuerpo del constructor de `B` se ejecuta el de `A`.",
      salida: `A
B`
    },
    {
      sec: "ut4-herencia",
      p: "¿Puede una subclase usar directamente una propiedad `private` de su superclase?",
      o: ["Sí", "No: debe usar métodos `protected` o `public`", "Solo con `super`", "Solo si es `final`"],
      c: 1,
      e: "Las propiedades privadas no son visibles en las subclases."
    },
    {
      sec: "ut4-herencia",
      p: "¿Quién puede usar un miembro `protected`?",
      o: ["Solo la clase", "El mismo paquete y las subclases", "Todos", "Nadie"],
      c: 1,
      e: "Paquete y subclases."
    },
    {
      sec: "ut4-herencia",
      p: `¿Qué muestra? (Polimorfismo.)
\`\`\`
class Producto {
    String describir() { return "Producto"; }
}
class Kayak extends Producto {
    @Override
    String describir() { return "Kayak"; }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Kayak();
        System.out.println(p.describir());
    }
}
\`\`\``,
      o: ["Producto", "Kayak", "Error", "null"],
      c: 1,
      e: "Se ejecuta la versión del **objeto real**.",
      salida: "Kayak"
    },
    {
      sec: "ut4-herencia",
      p: "¿De qué clase heredan, aunque no lo escribas, todas las clases?",
      o: ["`Class`", "`Object`", "`Main`", "De ninguna"],
      c: 1,
      e: "`Object`: por eso todas tienen `toString`, `equals` y `hashCode`."
    },
    {
      sec: "ut4-herencia",
      p: "¿Cuántas superclases directas puede tener una clase en Java?",
      o: ["Ninguna", "Una", "Dos", "Las que quiera"],
      c: 1,
      e: "Java solo tiene herencia simple."
    },
    {
      sec: "ut4-herencia",
      p: "¿Qué diferencia hay entre sobrecargar y sobrescribir?",
      o: [
        "Ninguna",
        "Sobrecargar: mismo nombre y otros parámetros; sobrescribir: reemplazar un método heredado",
        "Sobrescribir cambia el nombre",
        "Sobrecargar solo vale en subclases"
      ],
      c: 1,
      e: "Overload frente a override."
    },
    {
      sec: "ut4-herencia",
      p: "Ante la duda entre herencia y composición, ¿qué conviene elegir?",
      o: ["Herencia", "Composición", "Ninguna", "Estática"],
      c: 1,
      e: "Si la frase «A es un B» suena rara, no es herencia."
    },
    {
      sec: "ut4-herencia",
      p: "Con `Producto p = new Kayak();`, ¿se puede llamar a un método que solo tiene `Kayak`?",
      o: [
        "Sí",
        "No, salvo que se use un tipo `Kayak` (por ejemplo, con `instanceof`)",
        "Sí, con `super`",
        "Solo si es `static`"
      ],
      c: 1,
      e: "El tipo de la variable decide qué métodos se pueden llamar.",
      nivel: "pro"
    },
    {
      sec: "ut4-estaticos",
      p: "¿A qué pertenece un miembro `static`?",
      o: ["A cada objeto", "A la clase", "Al paquete", "Al `main`"],
      c: 1,
      e: "Existe una sola vez, en la clase."
    },
    {
      sec: "ut4-estaticos",
      p: "¿Puede un método `static` usar `this`?",
      o: ["Sí", "No", "Solo en `main`", "Solo si es `public`"],
      c: 1,
      e: "No pertenece a ningún objeto."
    },
    {
      sec: "ut4-estaticos",
      p: "¿Cómo se declara una constante pública de clase?",
      o: ["`public final int X`", "`public static final int X`", "`static int X`", "`const int X`"],
      c: 1,
      e: "`public static final`."
    },
    {
      sec: "ut4-estaticos",
      p: "¿Por qué `main` es `static`?",
      o: [
        "Por tradición",
        "Porque Java lo llama antes de que exista ningún objeto",
        "Para ir más rápido",
        "Porque no tiene parámetros"
      ],
      c: 1,
      e: "No hay objetos todavía."
    },
    {
      sec: "ut4-estaticos",
      p: `¿Qué muestra?
\`\`\`
class Pedido {
    private static int contador = 0;
    private int numero;
    Pedido() {
        contador++;
        numero = contador;
    }
    int getNumero() { return numero; }
}

public class Main {
    public static void main(String[] args) {
        new Pedido();
        new Pedido();
        Pedido c = new Pedido();
        System.out.println(c.getNumero());
    }
}
\`\`\``,
      o: ["1", "3", "0", "2"],
      c: 1,
      e: "El contador es compartido: el tercer pedido es el 3.",
      salida: "3"
    },
    {
      sec: "ut4-estaticos",
      p: "¿Cómo se llama a un método estático `conIva` de la clase `Fiscal`?",
      o: ["`new Fiscal().conIva(5)`", "`Fiscal.conIva(5)`", "`this.conIva(5)`", "`Fiscal->conIva(5)`"],
      c: 1,
      e: "Con el nombre de la clase."
    },
    {
      sec: "ut4-estaticos",
      p: "Un método `static` que usa una propiedad **no estática** de su clase…",
      o: ["Funciona", "Da error de compilación", "Usa un valor por defecto", "Lanza excepción"],
      c: 1,
      e: "No hay objeto del que leer esa propiedad."
    },
    {
      sec: "ut4-estaticos",
      p: "¿Puede un método de instancia llamar a un método `static`?",
      o: ["No", "Sí", "Solo en `main`", "Solo si es privado"],
      c: 1,
      e: "Al revés sí; lo que no se puede es que un estático use miembros de instancia."
    },
    {
      sec: "ut4-estaticos",
      p: "¿Por qué es mala idea poner `static` solo para que el compilador deje de quejarse?",
      o: [
        "Porque es más lento",
        "Porque se pierden las ventajas de los objetos",
        "Porque no compila",
        "Porque aumenta la memoria mucho"
      ],
      c: 1,
      e: "Una clase llena de `static` es programación estructurada disfrazada."
    },
    {
      sec: "ut4-estaticos",
      p: "¿Por qué `Math` no se instancia con `new`?",
      o: [
        "Por seguridad",
        "Porque todos sus miembros son estáticos",
        "Porque es abstracta",
        "Porque es una interfaz"
      ],
      c: 1,
      e: "Es una clase de utilidades."
    },
    {
      sec: "ut4-paquetes",
      p: "¿Dónde se escribe la línea `package`?",
      o: ["Donde se quiera", "Como primera línea del archivo", "Dentro de la clase", "En el `main`"],
      c: 1,
      e: "Primera línea."
    },
    {
      sec: "ut4-paquetes",
      p: "¿Cómo se escribe, por convención, un nombre de paquete?",
      o: [
        "MAYÚSCULAS",
        "minúsculas, empezando por el dominio al revés",
        "Con espacios",
        "Como el nombre de una clase"
      ],
      c: 1,
      e: "`es.nauticabahia.modelo`."
    },
    {
      sec: "ut4-paquetes",
      p: "El paquete `es.nauticabahia.modelo` se corresponde con la carpeta…",
      o: [
        "`modelo/`",
        "`es/nauticabahia/modelo/`",
        "`es.nauticabahia.modelo/`",
        "No se corresponde con ninguna"
      ],
      c: 1,
      e: "Cada punto es un nivel de carpeta."
    },
    {
      sec: "ut4-paquetes",
      p: "¿Qué es un archivo `.jar`?",
      o: [
        "Un compilador",
        "Un `.zip` con clases compiladas para reutilizar",
        "Un tipo de excepción",
        "Un paquete"
      ],
      c: 1,
      e: "Una librería empaquetada."
    },
    {
      sec: "ut4-paquetes",
      p: "Una clase sin `public` en el paquete `modelo`, ¿es visible desde el paquete `app`?",
      o: ["Sí", "No", "Solo con `import`", "Solo si hereda"],
      c: 1,
      e: "Sin modificador, solo es visible dentro de su paquete."
    },
    {
      sec: "ut4-paquetes",
      p: "¿Qué herramienta del JDK crea un `.jar`?",
      o: ["`javac`", "`jar`", "`java`", "`javadoc`"],
      c: 1,
      e: "`jar`."
    },
    {
      sec: "ut4-integracion",
      p: "En el modelo de Náutica Bahía, ¿qué clase debe decidir si hay stock suficiente?",
      o: ["`App`", "`Producto`", "`Fiscal`", "`Cliente`"],
      c: 1,
      e: "La que conoce el dato."
    },
    {
      sec: "ut4-integracion",
      p: "En un programa bien diseñado, ¿cuántas veces aparece el 21 % del IVA?",
      o: ["Una por clase", "Una, como constante", "Cada vez que se usa", "Ninguna"],
      c: 1,
      e: "Una constante en `Fiscal`."
    },
    {
      sec: "ut4-integracion",
      p: "Si la venta se rechaza por falta de stock, el stock…",
      o: [
        "Queda a medias",
        "No cambia, porque la comprobación va antes de restar",
        "Se pone a 0",
        "Se vuelve negativo"
      ],
      c: 1,
      e: "La excepción se lanza antes de modificar nada."
    },
    {
      sec: "ut4-integracion",
      p: "Una `Venta` guarda un `Cliente` y un `Producto`. Eso es…",
      o: ["Herencia", "Composición", "Sobrecarga", "Polimorfismo"],
      c: 1,
      e: "«Tiene un»."
    }
  ]
});
