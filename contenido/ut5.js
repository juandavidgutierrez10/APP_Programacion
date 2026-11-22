/* UT5 · Entrada y salida de datos — contenido editable (formato documentado en GUIA_PROFESOR.md). */

registrarUnidad({
  id: "ut5",
  titulo: "UT5. Entrada y salida de datos",
  ra: "RA5. Escribe programas que manipulan información leyendo y almacenando datos en ficheros y desarrolla interfaces gráficas sencillas con eventos.",
  resumen: "Hasta ahora tus programas olvidaban todo al terminar. Aprenderás a guardar y recuperar datos con ficheros, a controlar cómo se muestran en pantalla y a construir ventanas que reaccionan al usuario.",
  aprenderas: [
    "Entender los flujos y distinguir bytes de caracteres",
    "Representar datos como registros y guardarlos en ficheros de texto (CSV)",
    "Abrir, leer, escribir y cerrar ficheros con seguridad (`try-with-resources`)",
    "Usar ficheros binarios, acceso aleatorio y serialización",
    "Manejar rutas, carpetas, copiar, mover y borrar",
    "Dar formato a la salida (`printf`, `Locale`, fechas, bloques de texto)",
    "Construir ventanas con Swing y atender eventos",
    "Reunir todo en un gestor de productos con menú, objetos y ficheros"
  ],
  testN: 20,

  /* ===================== APUNTES POR SECCIONES ===================== */
  secciones: [
    {
      id: "ut5-flujos",
      titulo: "Flujos: bytes y caracteres",
      resumen: "Cómo ve Java la comunicación con el exterior: flujos de entrada y salida, bytes frente a caracteres, y por qué todo puede fallar.",
      bloques: [
        {
          t: "texto",
          md: `Todos los programas que has escrito tienen un defecto: **cuando terminan, lo olvidan todo**. El catálogo de productos, las ventas del día, el stock… desaparecen al cerrar el programa, porque viven solo en la memoria RAM. Y la forma de comunicarse con el usuario es muy limitada: una consola en la que hay que escribir cada dato.

Esta unidad resuelve las dos cosas:
- Para que los datos **sobrevivan** al programa los guardaremos en **ficheros** y los recuperaremos la próxima vez que se ejecute.
- Para que el programa sea **cómodo de usar** mejoraremos la salida con **formatos** y crearemos **ventanas** con botones y cuadros de texto que reaccionan a lo que hace el usuario.`
        },
        {
          t: "texto",
          md: `### Flujos
Para Java, cualquier comunicación de datos con el exterior (teclado, pantalla, un fichero, la red) es un **flujo** (*stream*): una secuencia de datos que **van pasando de uno en uno**, como el agua por una tubería. Un programa no sabe de dónde viene el agua ni adónde va: solo **lee** de un flujo de entrada o **escribe** en uno de salida. Esa idea es potentísima: el mismo código sirve para leer del teclado o de un fichero cambiando solo el origen.`
        },
        {
          t: "codigo",
          titulo: "El programa solo ve un flujo",
          code: "Origen (teclado, fichero)  ---flujo de entrada--->  PROGRAMA JAVA  ---flujo de salida--->  Destino (pantalla, fichero)"
        },
        {
          t: "texto",
          md: `### Dos familias: bytes y caracteres
Es la distinción más importante de la unidad:`
        },
        {
          t: "tabla",
          titulo: "Bytes frente a caracteres",
          cab: ["", "Flujos de bytes", "Flujos de caracteres"],
          filas: [
            ["Trabajan con", "Bytes (números de 0 a 255)", "Caracteres de texto"],
            ["Clases base", "`InputStream`, `OutputStream`", "`Reader`, `Writer`"],
            [
              "Sirven para",
              "Cualquier dato: imágenes, sonido, comprimidos, datos numéricos",
              "Texto legible: `.txt`, `.csv`, `.html`"
            ],
            [
              "Ejemplos",
              "`FileInputStream`, `FileOutputStream`, `DataInputStream`, `ObjectOutputStream`",
              "`FileReader`, `FileWriter`, `BufferedReader`, `PrintWriter`"
            ]
          ]
        },
        {
          t: "texto",
          md: "Un fichero de texto es, en realidad, una secuencia de bytes; los flujos de caracteres se encargan de **convertir** entre bytes y letras usando una **codificación** (*charset*). Si abres un fichero con una codificación distinta de la que se usó al guardarlo, las tildes se rompen («NÃ¡utica»). Para evitarlo, usa siempre **UTF-8**, indicándolo expresamente: `StandardCharsets.UTF_8` (paquete `java.nio.charset`)."
        },
        {
          t: "relacionar",
          p: "Relaciona cada clase con la familia de flujos a la que pertenece.",
          pares: [
            ["FileReader", "caracteres"],
            ["FileInputStream", "bytes"],
            ["BufferedReader", "caracteres"],
            ["DataOutputStream", "bytes"]
          ],
          e: "Las que terminan en `Reader`/`Writer` son de caracteres; en `Stream`, de bytes."
        },
        {
          t: "test",
          p: "Quieres copiar una **imagen** de un sitio a otro. ¿Qué flujos usas?",
          o: [
            "`FileReader` y `FileWriter`",
            "`FileInputStream` y `FileOutputStream`",
            "`Scanner`",
            "`PrintWriter`"
          ],
          c: 1,
          e: "Una imagen no es texto: son bytes. Los flujos de caracteres la estropearían al intentar interpretarla como texto."
        },
        {
          t: "texto",
          md: `### Tres flujos que ya conocías
Java abre tres flujos por ti, en la clase \`System\`:
- \`System.in\`: **entrada estándar** (el teclado), un flujo de bytes. Por eso se envuelve en un \`Scanner\` (\`new Scanner(System.in)\`), que lo convierte en texto con comodidad.
- \`System.out\`: **salida estándar** (la pantalla), con \`print\`, \`println\` y \`printf\`.
- \`System.err\`: **salida de errores**, también en pantalla pero por un canal aparte (en el IDE sale en rojo). Se usa para los mensajes de error.`
        },
        {
          t: "codigo",
          titulo: "System.out y System.err",
          code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Esto va a la salida estándar");
        System.err.println("Esto va a la salida de errores");
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `### Flujos que se encadenan
Los flujos se **combinan como piezas**: uno básico que habla con el origen (un fichero) y otros que añaden capacidades por encima. Es como poner un grifo (\`BufferedReader\`, que permite leer línea a línea y es más rápido porque lee por bloques) encima de una tubería (\`FileReader\`, que lee caracteres de un fichero):`
        },
        {
          t: "codigo",
          titulo: "Un BufferedReader sobre un FileReader",
          code: `import java.io.*;
import java.nio.charset.StandardCharsets;

public class Encadenar {
    public static void main(String[] args) throws IOException {
        BufferedReader lector = new BufferedReader(new FileReader("productos.csv", StandardCharsets.UTF_8));
        lector.close();
    }
}`
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "**Toda operación de ficheros puede fallar.** Un fichero puede no existir, estar bloqueado, estar en un disco lleno o sin permisos. Por eso casi todas las operaciones de esta unidad lanzan `IOException`, una excepción **comprobada** (la que el compilador obliga a tratar, de la UT3). Y todo flujo abierto se debe **cerrar**: se hace con **`try-with-resources`**, que lo cierra solo aunque haya un error. Todos los ejemplos de esta unidad usan esa forma."
        },
        {
          t: "test",
          p: "¿Qué tipo de excepción es `IOException`?",
          o: [
            "No comprobada",
            "Comprobada: el compilador obliga a tratarla o declararla",
            "Un `Error`",
            "Una subclase de `RuntimeException`"
          ],
          c: 1,
          e: "Cuelga de `Exception` sin pasar por `RuntimeException`: es comprobada."
        },
        {
          t: "ordenar",
          p: "Ordena el ciclo de vida de un flujo.",
          items: ["Abrir el flujo", "Leer o escribir datos", "Cerrar el flujo (automático con try-with-resources)"],
          e: "Abrir, usar y cerrar. Con `try-with-resources` el cierre es automático."
        },
        {
          t: "profundizar",
          titulo: "¿Qué pasa si no cierro un fichero?",
          bloques: [
            {
              t: "texto",
              md: "Puedes perder datos (lo escrito a medias puede no haberse vaciado al disco), mantener el fichero **bloqueado** para otros programas y agotar los **recursos** del sistema operativo (hay un límite de ficheros abiertos). `try-with-resources` evita el problema: cierra el recurso al salir del bloque, haya o no excepción."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Serializar** es convertir un objeto en una secuencia de bytes o de texto y **deserializar** es el camino inverso. Todo lo que se hace en esta unidad es eso con distintos formatos (CSV, binario, objetos). Piensa siempre en el **formato** como un contrato: quien escribe y quien lee deben estar de acuerdo.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos los **flujos**.",
        inicial: [
          {
            p: "¿Qué es un flujo en Java?",
            o: [
              "Un tipo de bucle",
              "Una secuencia de datos que se leen o escriben uno a uno",
              "Un método estático",
              "Un tipo de excepción"
            ],
            c: 1,
            e: "Una «tubería» por la que van pasando los datos."
          },
          {
            p: "¿Qué familia de flujos usarías para leer un `.txt`?",
            o: ["Bytes", "Caracteres", "Ninguna", "Solo `Scanner(System.in)`"],
            c: 1,
            e: "Texto legible: flujos de caracteres."
          },
          {
            p: "¿Qué excepción lanzan casi todas las operaciones de ficheros?",
            o: ["`ArithmeticException`", "`IOException`", "`NumberFormatException`", "`NullPointerException`"],
            c: 1,
            e: "`IOException`, comprobada."
          }
        ],
        pasos: [
          {
            titulo: "Flujos de entrada y de salida",
            cubre: [0],
            explica: "Un flujo es una secuencia de datos que fluye. El programa **lee** de un flujo de entrada y **escribe** en uno de salida sin saber de dónde viene o adónde va: por eso el mismo código vale para teclado o fichero.",
            pregunta: {
              p: "`System.in` es…",
              o: ["La pantalla", "El flujo de entrada estándar (teclado)", "Un fichero", "Una excepción"],
              c: 1,
              e: "El teclado."
            },
            extra: "Es como una manguera: no te importa si el agua viene del grifo o de un depósito; tú solo la ves pasar. El flujo te esconde el origen."
          },
          {
            titulo: "Bytes y caracteres",
            cubre: [1],
            explica: "Los flujos de **bytes** (`...Stream`) sirven para cualquier dato; los de **caracteres** (`Reader`/`Writer`) para texto, y convierten con una codificación. Usa siempre UTF-8.",
            pregunta: {
              p: "¿Qué codificación conviene usar siempre?",
              o: ["ISO-8859-1", "UTF-8", "ASCII", "Cualquiera"],
              c: 1,
              e: "UTF-8 evita que las tildes se rompan."
            }
          },
          {
            titulo: "Todo puede fallar",
            cubre: [2],
            explica: "Un fichero puede no existir o estar bloqueado, por eso hay `IOException` (comprobada) y siempre se usa `try-with-resources` para cerrar los flujos.",
            pregunta: {
              p: "¿Qué ventaja tiene `try-with-resources`?",
              o: [
                "Es más rápido",
                "Cierra el recurso automáticamente aunque haya error",
                "Evita todas las excepciones",
                "Permite no usar `catch`"
              ],
              c: 1,
              e: "Cierra el flujo siempre."
            }
          }
        ]
      }
    },

    {
      id: "ut5-registros",
      titulo: "Ficheros de datos y registros",
      resumen: "Ficheros de texto frente a binarios, registros y campos, y cómo convertir un objeto en una línea de CSV y viceversa.",
      bloques: [
        {
          t: "texto",
          md: "Un **fichero** es una colección de datos con un nombre, guardada en un dispositivo de almacenamiento. En programación se distinguen dos grandes formas de guardar la información:"
        },
        {
          t: "tabla",
          titulo: "Texto frente a binario",
          cab: ["", "Ficheros de texto", "Ficheros binarios"],
          filas: [
            ["Contenido", "Caracteres legibles", "Bytes con el formato interno de los datos"],
            ["Se abren con", "Cualquier editor de texto", "Solo un programa que conozca el formato"],
            [
              "Ventajas",
              "Se pueden leer y arreglar a mano; portables",
              "Más compactos y rápidos; permiten acceso directo"
            ],
            [
              "Inconvenientes",
              "Ocupan más; hay que convertir números a texto y viceversa",
              "Ilegibles; si cambia el formato, se rompen"
            ],
            ["Ejemplos", "`.txt`, `.csv`, `.json`", "`.dat`, `.jpg`, `.zip`"]
          ]
        },
        {
          t: "relacionar",
          p: "¿Texto o binario?",
          pares: [
            ["Un .csv que abre Excel", "texto"],
            ["Una foto .jpg", "binario"],
            ["Un .zip", "binario"],
            ["Un .json", "texto"]
          ],
          e: "Si una persona puede leerlo en un editor de texto, es texto."
        },
        {
          t: "texto",
          md: `### Registros
Normalmente un fichero de datos guarda **muchos elementos del mismo tipo**: los productos de la tienda, los clientes… Cada elemento es un **registro**, formado por **campos** (el código, el nombre, el precio…). Es justo el equivalente en un fichero de lo que, en un programa, es un **objeto** de una clase con sus propiedades.

En un fichero de texto, el formato más sencillo es **una línea por registro, con los campos separados por un delimitador**. Si el delimitador es la coma o el punto y coma, se llama **CSV** (*comma-separated values*), y lo abre cualquier hoja de cálculo. Usaremos el punto y coma, porque los nombres pueden llevar comas:`
        },
        {
          t: "codigo",
          titulo: "productos.csv: un registro por línea, cuatro campos",
          code: `KY-0001;Kayak Bahía 2;249.9;5
CH-0010;Chaleco salvavidas;34.5;20
NB-0042;Neopreno corto 3mm;89.95;12`
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "Hay que decidir **antes** de programar: qué campos tiene el registro, en qué orden, qué separa los campos y cómo se escriben los números (el **punto** decimal, nunca la coma, para no confundirla con otro separador). Ese diseño es el **formato del fichero**: quien escribe y quien lee deben estar de acuerdo."
        },
        {
          t: "test",
          p: "En un CSV con `;` como separador, ¿cómo se escribe el precio 34,5?",
          o: ["`34,5`", "`34.5`", "`\"34,5\"`", "Da igual"],
          c: 1,
          e: "Con punto, para no mezclar el decimal con otros separadores y que cualquier programa lo entienda."
        },
        {
          t: "texto",
          md: `### Del objeto a la línea y de la línea al objeto
Añadimos a la clase \`Producto\` un método que **convierte un objeto en una línea** (\`aCsv\`) y otro que **construye un objeto a partir de una línea** (\`desdeCsv\`). \`split(";")\` trocea un texto por el separador y devuelve un **array**: \`campos.length\` es cuántos trozos hay y se accede a cada uno con \`campos[0]\`, \`campos[1]\`… (empezando en 0). \`desdeCsv\` es **estático**, porque *crea* el objeto: no puede pertenecer a un objeto que todavía no existe (UT4).

Con ello, cargar es un bucle sencillo y las excepciones de la UT3 protegen cada paso. Aquí simulamos el fichero con un array de líneas (en el IDE, las leerías de verdad; el bucle es el mismo):`
        },
        {
          t: "codigo",
          titulo: "aCsv y desdeCsv con líneas buenas y defectuosas",
          code: `class Producto {
    private String codigo;
    private String nombre;
    private double precio;
    private int stock;

    public Producto(String codigo, String nombre, double precio, int stock) {
        this.codigo = codigo;
        this.nombre = nombre;
        if (precio < 0) {
            throw new IllegalArgumentException("Precio negativo: " + precio);
        }
        this.precio = precio;
        this.stock = stock;
    }

    public String aCsv() {
        return codigo + ";" + nombre + ";" + precio + ";" + stock;
    }

    public static Producto desdeCsv(String linea) {
        String[] campos = linea.split(";");
        if (campos.length != 4) {
            throw new IllegalArgumentException("Se esperaban 4 campos y hay " + campos.length + ": " + linea);
        }
        return new Producto(campos[0], campos[1],
                Double.parseDouble(campos[2]), Integer.parseInt(campos[3]));
    }

    @Override
    public String toString() {
        return nombre + " (" + codigo + "): " + stock + " uds";
    }
}

public class Main {
    public static void main(String[] args) {
        String[] lineas = {
            "KY-0001;Kayak Bahía 2;249.9;5",
            "CH-0010;Chaleco salvavidas;34.5",
            "NB-0042;Neopreno corto 3mm;mucho;12",
            "GB-0007;Gafas de buceo;-3;4",
            "TB-0011;Tabla paddle surf;499.0;3"
        };
        for (int i = 0; i < lineas.length; i++) {
            try {
                Producto p = Producto.desdeCsv(lineas[i]);
                System.out.println(p);
            } catch (IllegalArgumentException e) {
                System.out.println("Línea " + (i + 1) + " ignorada: " + e.getMessage());
            }
        }
        System.out.println(new Producto("X-1", "Prueba", 1.5, 2).aCsv());
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: "Un solo `catch (IllegalArgumentException)` recoge tres problemas distintos: un campo de menos (lo lanza `desdeCsv`), un número mal escrito (`NumberFormatException` es **subclase** de `IllegalArgumentException`) y un precio negativo (lo lanza el constructor). Un registro mal escrito **no debe tumbar el programa**: se informa, se ignora y se sigue con el siguiente."
        },
        {
          t: "predecir",
          p: "¿Qué muestra?",
          code: `public class Main {
    public static void main(String[] args) {
        String linea = "CH-0010;Chaleco salvavidas;34.5;20";
        String[] c = linea.split(";");
        System.out.println(c.length);
        System.out.println(c[1]);
        System.out.println(Double.parseDouble(c[2]) * Integer.parseInt(c[3]));
    }
}`,
          salida: `4
Chaleco salvavidas
690.0`,
          e: "Hay 4 campos; `c[1]` es el nombre (los índices empiezan en 0) y `34.5 * 20 = 690.0`."
        },
        {
          t: "ejecuta",
          p: `**Cargar con tolerancia a errores.** Completa el bucle: para cada línea de \`lineas\`, muestra \`OK: <nombre>\` si es válida o \`Linea N ignorada\` (N empieza en 1) si el formato es defectuoso (no tiene exactamente 3 campos \`nombre;precio;stock\`, o el stock no es un entero). Debe mostrar:
\`\`\`
OK: Kayak
Linea 2 ignorada
Linea 3 ignorada
OK: Neopreno
\`\`\``,
          inicial: `public class App {
    public static void main(String[] args) {
        String[] lineas = {
            "Kayak;249.9;5",
            "Chaleco;34.5",
            "Gafas;24.9;pocos",
            "Neopreno;89.95;12"
        };
        for (int i = 0; i < lineas.length; i++) {
            // TODO: trocear, validar y mostrar
        }
    }
}`,
          tests: [
            {
              out: `OK: Kayak
Linea 2 ignorada
Linea 3 ignorada
OK: Neopreno`
            }
          ],
          pistas: [
            "`split(\";\")` devuelve un array: comprueba su `length` antes de usar los campos.",
            "`NumberFormatException` es subclase de `IllegalArgumentException`: un solo `catch` basta."
          ],
          solucion: `public class App {
    public static void main(String[] args) {
        String[] lineas = {
            "Kayak;249.9;5",
            "Chaleco;34.5",
            "Gafas;24.9;pocos",
            "Neopreno;89.95;12"
        };
        for (int i = 0; i < lineas.length; i++) {
            try {
                String[] c = lineas[i].split(";");
                if (c.length != 3) {
                    throw new IllegalArgumentException("campos");
                }
                Double.parseDouble(c[1]);
                Integer.parseInt(c[2]);
                System.out.println("OK: " + c[0]);
            } catch (IllegalArgumentException e) {
                System.out.println("Linea " + (i + 1) + " ignorada");
            }
        }
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Por qué el formato CSV no usa la coma si se llama «comma-separated»?",
          bloques: [
            {
              t: "texto",
              md: "Porque en España la coma es el separador **decimal** y aparece dentro de los nombres («Neopreno, 3 mm»). Si separas con coma, esos datos rompen el registro. Con `;` (o con tabulador) se evitan la mayoría de problemas. En CSV «de verdad» los campos con el separador dentro se escriben entre comillas, pero ese caso se complica: elige un separador que no aparezca en tus datos."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Si el nombre de un producto puede contener el separador, `split` **rompe el registro**. Soluciones: elegir otro separador, **escapar** el carácter o usar un formato con estructura (JSON). Elegir bien el formato es una decisión de diseño: piensa en los datos *raros* (nombres con `;`, saltos de línea, vacíos) antes de que lleguen.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos los **ficheros de datos y los registros**.",
        inicial: [
          {
            p: "¿Qué es un registro en un fichero?",
            o: [
              "Un tipo de excepción",
              "Un elemento del fichero formado por campos",
              "Un tipo de flujo",
              "Una línea de comentario"
            ],
            c: 1,
            e: "Un elemento (como un producto) formado por varios campos."
          },
          {
            p: "Con `String[] c = \"A;B;C\".split(\";\");`, ¿cuánto vale `c.length`?",
            o: ["1", "2", "3", "5"],
            c: 2,
            e: "Tres trozos: A, B y C."
          },
          {
            p: "¿Qué excepción lanza `Integer.parseInt(\"abc\")`?",
            o: ["`IOException`", "`NumberFormatException`", "`NullPointerException`", "`ArithmeticException`"],
            c: 1,
            e: "`NumberFormatException`, subclase de `IllegalArgumentException`."
          }
        ],
        pasos: [
          {
            titulo: "Un registro por línea",
            cubre: [0],
            explica: "En un CSV cada línea es un **registro** y los **campos** se separan con un delimitador. Hay que decidir el formato (campos, orden, separador, decimales con punto) antes de programar.",
            pregunta: {
              p: "¿Qué separa los campos en nuestros CSV?",
              o: ["Un espacio", "El punto y coma", "El salto de línea", "La tabulación obligatoriamente"],
              c: 1,
              e: "El `;`. El salto de línea separa registros."
            },
            extra: "Es como una hoja de cálculo escrita a mano: cada fila es un producto y cada columna un dato. Solo que las columnas se separan con un `;` en vez de con las rayas de la tabla."
          },
          {
            titulo: "Del texto al objeto",
            cubre: [1, 2],
            explica: "`split` trocea la línea en un array; con `Integer.parseInt` y `Double.parseDouble` conviertes cada trozo al tipo que necesitas. Todo lo que puede salir mal lanza una excepción que **tú** decides tratar.",
            ejemplo: {
              code: `public class Main {
    public static void main(String[] args) {
        String[] c = "KY-1;Kayak;249.9;5".split(";");
        System.out.println(c.length);
        System.out.println(Integer.parseInt(c[3]) + 1);
    }
}`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "Si un campo numérico tiene letras, `parseInt` lanza…",
              o: ["`IOException`", "`NumberFormatException`", "Nada", "`ArithmeticException`"],
              c: 1,
              e: "Y como es subclase de `IllegalArgumentException`, un `catch` de esa lo recoge."
            }
          }
        ],
        reto: {
          p: `**Reto final.** Escribe \`desdeCsv(String linea)\` para \`Cliente\` (\`nombre;telefono;socio\`). Si no tiene 3 campos, lanza \`IllegalArgumentException("Formato incorrecto")\`. \`socio\` es \`true\` o \`false\` (\`Boolean.parseBoolean\`). Debe mostrar:
\`\`\`
Laura (600111222) socio=true
Formato incorrecto
\`\`\``,
          inicial: `class Cliente {
    private String nombre;
    private String telefono;
    private boolean socio;

    public Cliente(String nombre, String telefono, boolean socio) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.socio = socio;
    }

    public static Cliente desdeCsv(String linea) {
        // TODO
        return null;
    }

    @Override
    public String toString() {
        return nombre + " (" + telefono + ") socio=" + socio;
    }
}

public class App {
    public static void main(String[] args) {
        System.out.println(Cliente.desdeCsv("Laura;600111222;true"));
        try {
            Cliente.desdeCsv("Pedro;600333444");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
          tests: [
            {
              out: `Laura (600111222) socio=true
Formato incorrecto`
            }
          ],
          solucion: `class Cliente {
    private String nombre;
    private String telefono;
    private boolean socio;

    public Cliente(String nombre, String telefono, boolean socio) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.socio = socio;
    }

    public static Cliente desdeCsv(String linea) {
        String[] c = linea.split(";");
        if (c.length != 3) {
            throw new IllegalArgumentException("Formato incorrecto");
        }
        return new Cliente(c[0], c[1], Boolean.parseBoolean(c[2]));
    }

    @Override
    public String toString() {
        return nombre + " (" + telefono + ") socio=" + socio;
    }
}

public class App {
    public static void main(String[] args) {
        System.out.println(Cliente.desdeCsv("Laura;600111222;true"));
        try {
            Cliente.desdeCsv("Pedro;600333444");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
          pistas: ["`desdeCsv` es `static` porque crea el objeto: se llama `Cliente.desdeCsv(...)`."]
        }
      }
    },

    {
      id: "ut5-texto",
      titulo: "Ficheros de texto: abrir, leer, escribir y cerrar",
      resumen: "Modos de acceso, `PrintWriter`/`FileWriter`, el patrón de lectura con `BufferedReader`, y el peligro de sobrescribir.",
      bloques: [
        {
          t: "texto",
          md: "Trabajar con un fichero siempre sigue tres pasos: **abrirlo**, **leer o escribir** y **cerrarlo**. Al abrirlo se elige un **modo de acceso**:"
        },
        {
          t: "tabla",
          titulo: "Modos de acceso",
          cab: ["Modo", "Qué hace"],
          filas: [
            ["Lectura", "Solo se puede leer. El fichero tiene que existir."],
            [
              "Escritura (sobrescribir)",
              "Se escribe desde el principio. Si el fichero existe, **se borra su contenido anterior**; si no, se crea."
            ],
            ["Escritura (añadir, *append*)", "Se escribe **al final**, conservando lo que había."],
            ["Lectura y escritura", "Se puede hacer las dos cosas y moverse libremente (acceso aleatorio)."]
          ]
        },
        {
          t: "texto",
          md: `Y según cómo se recorran los datos, hay dos **métodos de acceso**:
- **Acceso secuencial**: se lee o escribe **en orden**, del primer dato al último, sin saltar. Es lo normal en los ficheros de texto.
- **Acceso aleatorio** (o directo): se puede **saltar** directamente a cualquier posición sin recorrer lo anterior. Exige que los registros ocupen todos lo mismo.`
        },
        {
          t: "test",
          p: "Quieres añadir una anotación al final de `bitacora.txt` **sin perder** las anteriores. ¿Qué modo usas?",
          o: ["Lectura", "Escritura (sobrescribir)", "Escritura (añadir)", "Cualquiera"],
          c: 2,
          e: "Modo *append*: se escribe al final conservando el contenido."
        },
        {
          t: "texto",
          md: `### Escribir un fichero de texto
\`FileWriter\` escribe caracteres en un fichero y \`PrintWriter\` le añade los cómodos \`println\` y \`printf\` que ya conoces de la pantalla:`
        },
        {
          t: "codigo",
          titulo: "EscribirTexto.java",
          code: `import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

public class EscribirTexto {
    public static void main(String[] args) {
        try (PrintWriter salida = new PrintWriter(new FileWriter("bitacora.txt", StandardCharsets.UTF_8))) {
            salida.println("NÁUTICA BAHÍA - bitácora");
            salida.println("Apertura de caja a las 10:00");
            salida.printf("Fondo de caja: %.2f euros%n", 150.0);
        } catch (IOException e) {
            System.err.println("No se pudo escribir el fichero: " + e.getMessage());
        }
    }
}`
        },
        {
          t: "texto",
          md: "Al ejecutarlo, aparece `bitacora.txt` en la **carpeta del proyecto**. Si lo ejecutas dos veces, el contenido es el mismo: cada ejecución **sobrescribe** el anterior. Para **añadir** al final, se pasa un tercer argumento `true` al `FileWriter`:"
        },
        {
          t: "codigo",
          titulo: "Añadir en lugar de sobrescribir",
          code: `import java.io.*;
import java.nio.charset.StandardCharsets;

public class Anadir {
    public static void main(String[] args) throws IOException {
        FileWriter f = new FileWriter("bitacora.txt", StandardCharsets.UTF_8, true);   // true = añadir al final
        f.close();
    }
}`
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "**El borrado silencioso.** Abrir un fichero en modo escritura **sin `true`** vacía su contenido **al instante**, sin avisar y sin papelera. Es uno de los errores más caros: un programa que debía añadir una línea a la bitácora y en realidad la reemplaza. Antes de escribir, piensa siempre: ¿**sobrescribo o añado**?"
        },
        {
          t: "texto",
          md: `### Leer un fichero de texto, línea a línea
\`BufferedReader\` sobre un \`FileReader\` permite leer **una línea cada vez** con \`readLine()\`, que devuelve **\`null\`** cuando se acaba el fichero. El patrón de lectura es siempre este:`
        },
        {
          t: "codigo",
          titulo: "LeerTexto.java",
          code: `import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class LeerTexto {
    public static void main(String[] args) {
        try (BufferedReader lector = new BufferedReader(new FileReader("bitacora.txt", StandardCharsets.UTF_8))) {
            String linea;
            int numero = 0;
            while ((linea = lector.readLine()) != null) {
                numero++;
                System.out.println(numero + ": " + linea);
            }
        } catch (FileNotFoundException e) {
            System.err.println("El fichero no existe: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("Error de lectura: " + e.getMessage());
        }
    }
}`
        },
        {
          t: "texto",
          md: "La línea `while ((linea = lector.readLine()) != null)` hace **tres cosas a la vez**: lee, guarda en `linea` y comprueba si es `null` (fin del fichero). Es una asignación dentro de una condición, y se usa tanto que merece aprenderla tal cual. Observa el orden de los `catch`: `FileNotFoundException` es una **subclase** de `IOException`, y el más concreto debe ir **primero** (UT3)."
        },
        {
          t: "texto",
          md: "Para poder **ejecutar** ese mismo patrón en el navegador, aquí tienes un «lector de mentira» con las mismas reglas: `readLine()` devuelve una línea cada vez y `null` al terminar."
        },
        {
          t: "codigo",
          titulo: "El patrón while ((linea = readLine()) != null)",
          code: `class LectorFalso {
    private String[] lineas;
    private int pos = 0;

    public LectorFalso(String[] lineas) {
        this.lineas = lineas;
    }

    public String readLine() {
        if (pos < lineas.length) {
            return lineas[pos++];
        }
        return null;
    }
}

public class Main {
    public static void main(String[] args) {
        LectorFalso lector = new LectorFalso(new String[] {
            "NÁUTICA BAHÍA - bitácora",
            "Apertura de caja a las 10:00",
            "Fondo de caja: 150,00 euros"
        });
        String linea;
        int numero = 0;
        while ((linea = lector.readLine()) != null) {
            numero++;
            System.out.println(numero + ": " + linea);
        }
        System.out.println("Fin del fichero");
    }
}`,
          ejecutable: true
        },
        {
          t: "huecos",
          p: "Completa el patrón de lectura línea a línea.",
          codigo: `String linea;
while (({{linea}} = lector.{{readLine}}()) != {{null}}) {
    System.out.println(linea);
}`,
          e: "Se lee y se asigna a `linea` en la condición; `readLine()` devuelve `null` cuando no quedan líneas."
        },
        {
          t: "ordenar",
          p: "Ordena las instrucciones de este programa que lee un fichero de texto.",
          items: [
            "Abrir el `BufferedReader` en un `try-with-resources`",
            "Leer una línea con `readLine()`",
            "Repetir mientras la línea no sea `null`",
            "Cerrar automáticamente al salir del bloque `try`"
          ],
          e: "Abrir → leer en bucle hasta `null` → cierre automático."
        },
        {
          t: "texto",
          md: `### Más cómodo: \`Scanner\` y \`Files\`
Dos alternativas para leer texto, útiles según el caso:
- **\`Scanner\` sobre un fichero**: el mismo \`Scanner\` del teclado, con otro origen. Se recorre con \`hasNextLine()\` / \`nextLine()\`.
- **La clase \`Files\`** (\`java.nio.file\`): ficheros pequeños, en una línea: \`Files.readString(Path.of("a.txt"))\`, \`Files.readAllLines(...)\`, \`Files.writeString(...)\`. Usa UTF-8 por defecto y no necesita cerrar nada, pero **carga el fichero entero en memoria**: perfecto para ficheros pequeños, pero no para uno de varios gigas.`
        },
        {
          t: "codigo",
          titulo: "El mismo recorrido con Scanner (aquí sobre un texto)",
          code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String contenido = "Náutica Bahía\\nAlquiler de kayaks y paddle surf\\nAbierto de 10 a 20\\n";
        Scanner lector = new Scanner(contenido);      // con un fichero: new Scanner(new File("a.txt"), UTF_8)
        int lineas = 0;
        int palabras = 0;
        while (lector.hasNextLine()) {
            String linea = lector.nextLine();
            lineas++;
            palabras += linea.strip().split(" ").length;
        }
        System.out.println(lineas + " líneas y " + palabras + " palabras");
    }
}`,
          ejecutable: true
        },
        {
          t: "ejecuta",
          p: `**Leer y contar.** Recorre el texto línea a línea con \`Scanner\` y muestra cuántas **líneas**, **palabras** y **caracteres** tiene (los caracteres de cada línea, sin contar los saltos de línea). Debe mostrar:
\`\`\`
3 líneas, 13 palabras, 63 caracteres
\`\`\``,
          inicial: `import java.util.Scanner;

public class App {
    public static void main(String[] args) {
        String texto = "Náutica Bahía\\nAlquiler de kayaks y paddle surf\\nAbierto de 10 a 20";
        Scanner lector = new Scanner(texto);
        int lineas = 0;
        int palabras = 0;
        int caracteres = 0;
        // TODO: recorrer y contar
        System.out.println(lineas + " líneas, " + palabras + " palabras, " + caracteres + " caracteres");
    }
}`,
          tests: [
            { out: "3 líneas, 13 palabras, 63 caracteres" }
          ],
          pistas: [
            "`hasNextLine()` es la condición del bucle y `nextLine()` devuelve la línea.",
            "`split(\" \").length` cuenta las palabras de una línea."
          ],
          solucion: `import java.util.Scanner;

public class App {
    public static void main(String[] args) {
        String texto = "Náutica Bahía\\nAlquiler de kayaks y paddle surf\\nAbierto de 10 a 20";
        Scanner lector = new Scanner(texto);
        int lineas = 0;
        int palabras = 0;
        int caracteres = 0;
        while (lector.hasNextLine()) {
            String linea = lector.nextLine();
            lineas++;
            caracteres += linea.length();
            palabras += linea.strip().split(" ").length;
        }
        System.out.println(lineas + " líneas, " + palabras + " palabras, " + caracteres + " caracteres");
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `FileNotFoundException` va antes que `IOException` en los `catch`?",
          bloques: [
            {
              t: "texto",
              md: "Porque `FileNotFoundException` es una **subclase** de `IOException`. Java prueba los `catch` de arriba abajo y entra en el primero que encaja: si pusieras `IOException` primero, atraparía también el caso del fichero que no existe y el `catch` más concreto no se alcanzaría **nunca** (el compilador lo detecta y da error). Siempre: de lo concreto a lo general."
            }
          ]
        },
        {
          t: "practica",
          titulo: "La bitácora de caja",
          p: "Programa **Bitacora.java** en tu IDE: un menú (UT3) con 1) añadir una anotación con fecha y hora, 2) mostrar todas las anotaciones numeradas, 0) salir. Esta práctica necesita ficheros reales, así que se hace en tu IDE; aquí tienes los pasos.",
          pasos: [
            {
              t: "Diseña el menú",
              md: "Usa un `do-while` con `switch`. Lee la opción con `Integer.parseInt(teclado.nextLine().strip())` para evitar la trampa del `Scanner`.",
              check: "El menú se repite hasta elegir 0.",
              pregunta: "¿Por qué es mejor `nextLine` + `parseInt` que `nextInt`?"
            },
            {
              t: "Opción 1: añadir",
              md: "Abre `bitacora.txt` en modo **añadir** (tercer argumento `true`) con `try-with-resources` y escribe `LocalDateTime.now().withNano(0) + \" \" + texto`.",
              code: "new PrintWriter(new FileWriter(\"bitacora.txt\", StandardCharsets.UTF_8, true))",
              check: "Tras dos ejecuciones, el fichero conserva las anotaciones anteriores."
            },
            {
              t: "Opción 2: mostrar",
              md: "Lee con `BufferedReader` y `while ((linea = lector.readLine()) != null)`, numerando. Captura `FileNotFoundException` **antes** que `IOException` para decir «Todavía no hay anotaciones».",
              check: "Con el fichero borrado, no falla: avisa con un mensaje claro."
            },
            {
              t: "Protege la entrada",
              md: "Captura `NumberFormatException` en el menú para que escribir letras no haga fallar el programa.",
              check: "Escribir `abc` en el menú muestra un aviso y vuelve a preguntar."
            }
          ],
          entrega: "El código `Bitacora.java` y una captura del contenido de `bitacora.txt` tras varias ejecuciones."
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Prueba qué pasa si **ejecutas el programa desde otra carpeta**: el fichero relativo `bitacora.txt` se crea en el **directorio de trabajo**, no donde está el código. Es la causa número uno del «¡mi fichero ha desaparecido!» y se explica en la sección del sistema de ficheros.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos cómo **leer y escribir ficheros de texto**.",
        inicial: [
          {
            p: "¿Qué ocurre al abrir `new FileWriter(\"a.txt\")` (sin `true`) si el fichero ya existe?",
            o: ["Se añade al final", "Se borra su contenido anterior", "Da error", "Se renombra"],
            c: 1,
            e: "Se sobrescribe: se vacía al abrir."
          },
          {
            p: "¿Qué devuelve `readLine()` al llegar al final del fichero?",
            o: ["Una cadena vacía", "`null`", "Lanza `EOFException`", "`-1`"],
            c: 1,
            e: "`null`."
          },
          {
            p: "¿Qué `catch` debe ir primero: `FileNotFoundException` o `IOException`?",
            o: ["`IOException`", "`FileNotFoundException`, la más concreta", "Da igual", "Ninguno"],
            c: 1,
            e: "De lo concreto a lo general."
          }
        ],
        pasos: [
          {
            titulo: "Sobrescribir o añadir",
            cubre: [0],
            explica: "Por defecto, abrir en escritura **vacía** el fichero. Para conservar lo anterior, pasa `true` al `FileWriter` (modo *append*).",
            pregunta: {
              p: "¿Qué hace `new FileWriter(\"a.txt\", StandardCharsets.UTF_8, true)`?",
              o: ["Sobrescribe", "Añade al final", "Lee el fichero", "Lo borra"],
              c: 1,
              e: "El `true` activa el modo añadir."
            },
            extra: "Es la diferencia entre escribir en un cuaderno nuevo cada vez (sobrescribir) y seguir escribiendo debajo de lo que ya había (añadir)."
          },
          {
            titulo: "El patrón de lectura",
            cubre: [1],
            explica: "Abres con `try-with-resources` y recorres con `while ((linea = lector.readLine()) != null)`. Asigna, lee y comprueba el fin a la vez.",
            ejemplo: {
              code: `class Lector {
    private String[] l = {"uno", "dos"};
    private int p = 0;
    String readLine() { return p < l.length ? l[p++] : null; }
}

public class Main {
    public static void main(String[] args) {
        Lector r = new Lector();
        String linea;
        while ((linea = r.readLine()) != null) {
            System.out.println(linea);
        }
    }
}`,
              ejecutable: true,
              titulo: "El patrón, ejecutable"
            },
            pregunta: {
              p: "¿Cuántas veces se ejecuta el cuerpo si el fichero tiene 3 líneas?",
              o: ["2", "3", "4", "Ninguna"],
              c: 1,
              e: "Una por línea; la cuarta lectura devuelve `null` y termina."
            }
          },
          {
            titulo: "Orden de los catch",
            cubre: [2],
            explica: "`FileNotFoundException` extiende `IOException`: el más concreto, primero. Así puedes dar un mensaje distinto para «no existe» y para «error de lectura».",
            pregunta: {
              p: "Si pones `catch (IOException)` antes que `catch (FileNotFoundException)`…",
              o: [
                "Funciona igual",
                "Error de compilación: el segundo no se alcanza nunca",
                "Se ejecutan los dos",
                "Se ignora el primero"
              ],
              c: 1,
              e: "El compilador avisa de que el segundo es inalcanzable."
            }
          }
        ],
        reto: {
          p: `**Reto final.** Completa \`contarPalabras(String texto)\` para que devuelva cuántas palabras hay (separadas por espacios) en **todo** el texto, leyéndolo línea a línea con \`Scanner\`. Debe mostrar:
\`\`\`
7
\`\`\``,
          inicial: `import java.util.Scanner;

public class App {
    static int contarPalabras(String texto) {
        Scanner lector = new Scanner(texto);
        int total = 0;
        // TODO
        return total;
    }

    public static void main(String[] args) {
        System.out.println(contarPalabras("Kayak azul\\nPaddle surf de 12 pies\\n"));
    }
}`,
          tests: [
            { out: "7" }
          ],
          solucion: `import java.util.Scanner;

public class App {
    static int contarPalabras(String texto) {
        Scanner lector = new Scanner(texto);
        int total = 0;
        while (lector.hasNextLine()) {
            String linea = lector.nextLine().strip();
            if (!linea.isEmpty()) {
                total += linea.split(" ").length;
            }
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(contarPalabras("Kayak azul\\nPaddle surf de 12 pies\\n"));
    }
}`,
          pistas: ["Una línea vacía daría 1 palabra con `split`: ignórala con `isEmpty()`."]
        }
      }
    },

    {
      id: "ut5-binarios",
      titulo: "Ficheros binarios, acceso aleatorio y serialización",
      resumen: "`DataOutputStream`/`DataInputStream`, `RandomAccessFile` con registros de longitud fija y guardar objetos enteros.",
      bloques: [
        {
          t: "texto",
          md: `### Ficheros binarios: \`DataOutputStream\` y \`DataInputStream\`
Un flujo \`Data\` guarda los tipos primitivos y los textos **directamente en binario**, sin convertirlos a texto: un \`int\` ocupa siempre **4 bytes**, un \`double\`, **8**. Se lee en **el mismo orden** en que se escribió, porque el fichero no tiene separadores ni nombres de campo:`
        },
        {
          t: "codigo",
          titulo: "DatosBinarios.java: escribir y leer en el mismo orden",
          code: `import java.io.*;

public class DatosBinarios {
    public static void main(String[] args) {
        try (DataOutputStream salida = new DataOutputStream(new FileOutputStream("ventas.dat"))) {
            salida.writeUTF("Chaleco salvavidas");
            salida.writeInt(3);
            salida.writeDouble(34.50);
            salida.writeUTF("Gafas de buceo");
            salida.writeInt(2);
            salida.writeDouble(24.90);
        } catch (IOException e) {
            System.err.println("Error al escribir: " + e.getMessage());
        }

        try (DataInputStream entrada = new DataInputStream(new FileInputStream("ventas.dat"))) {
            while (entrada.available() > 0) {
                String nombre = entrada.readUTF();
                int unidades = entrada.readInt();
                double precio = entrada.readDouble();
                System.out.println(unidades + " x " + nombre + " a " + precio);
            }
        } catch (IOException e) {
            System.err.println("Error al leer: " + e.getMessage());
        }
    }
}`
        },
        {
          t: "texto",
          md: "`available()` indica cuántos bytes quedan por leer; cuando llega a 0, se ha acabado el fichero. Si se lee en un orden distinto del de escritura (por ejemplo, un `readInt` donde se había escrito un `writeUTF`), el resultado son **datos sin sentido o un error**. Esa fragilidad es el precio de la compacidad."
        },
        {
          t: "test",
          p: "Has escrito `writeUTF`, `writeInt`, `writeDouble`. ¿En qué orden debes leer?",
          o: [
            "Da igual",
            "`readUTF`, `readInt`, `readDouble`",
            "`readDouble`, `readInt`, `readUTF`",
            "Cualquiera si no hay errores"
          ],
          c: 1,
          e: "Exactamente el mismo orden: el fichero no tiene separadores ni nombres de campo."
        },
        {
          t: "test",
          p: "¿Cuántos bytes ocupa un `int` escrito con `writeInt` y un `double` con `writeDouble`?",
          o: ["2 y 4", "4 y 8", "8 y 16", "Depende del valor"],
          c: 1,
          e: "`int`: 4 bytes; `double`: 8 bytes. Siempre, sea cual sea el valor."
        },
        {
          t: "texto",
          md: `### Acceso aleatorio: \`RandomAccessFile\`
Imagina el stock de la tienda, con miles de productos, y que quieres cambiar solo el stock de **uno**. Con un fichero de texto habría que leer todo, cambiar una línea y reescribirlo entero. Con \`RandomAccessFile\` se puede **saltar** directamente al sitio y modificar solo esos bytes. El truco es que **todos los registros ocupen exactamente lo mismo**, y así se calcula dónde está cada uno:
\`\`\`
| código 4 B | stock 4 B | precio 8 B | código 4 B | stock 4 B | precio 8 B | ...
|<------- registro 0: posición 0 (16 bytes) ------->|<--- registro 1: posición 16 --->|
\`\`\`
El registro *n* (contando desde 0) empieza en el byte **n × 16**. Con \`seek(posición)\` el «cursor» del fichero salta allí, y desde ahí se lee o se escribe con \`readInt\`, \`writeInt\`…`
        },
        {
          t: "codigo",
          titulo: "InventarioAleatorio.java",
          code: `import java.io.IOException;
import java.io.RandomAccessFile;

public class InventarioAleatorio {
    public static void main(String[] args) {
        final int TAMANO_REGISTRO = 16;      // int (4) + int (4) + double (8)
        try (RandomAccessFile fichero = new RandomAccessFile("stock.dat", "rw")) {
            fichero.setLength(0);                                   // empezar de cero
            fichero.writeInt(101); fichero.writeInt(5);  fichero.writeDouble(249.90);
            fichero.writeInt(102); fichero.writeInt(20); fichero.writeDouble(34.50);
            fichero.writeInt(103); fichero.writeInt(12); fichero.writeDouble(89.95);
            System.out.println("Registros: " + fichero.length() / TAMANO_REGISTRO);

            fichero.seek(1L * TAMANO_REGISTRO);                    // registro 1 (el segundo)
            int codigo = fichero.readInt();
            int stock = fichero.readInt();
            System.out.println("Producto " + codigo + ": stock " + stock);

            fichero.seek(1L * TAMANO_REGISTRO + 4);                // saltar el código
            fichero.writeInt(stock - 3);                           // vendemos 3

            fichero.seek(1L * TAMANO_REGISTRO + 4);
            System.out.println("Stock actualizado: " + fichero.readInt());
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}`
        },
        {
          t: "texto",
          md: "El segundo argumento de `RandomAccessFile` es el modo: `\"r\"` (solo lectura) o `\"rw\"` (lectura y escritura; crea el fichero si no existe). Los textos de longitud variable no encajan en este esquema: para guardar un nombre habría que reservarle una **longitud fija** (por ejemplo, 30 caracteres, rellenando con espacios)."
        },
        {
          t: "predecir",
          p: "Los cálculos de posiciones se pueden probar sin ficheros. ¿Qué muestra?",
          code: `public class Main {
    public static void main(String[] args) {
        final int TAMANO = 16;
        for (int n = 0; n < 4; n++) {
            System.out.println("registro " + n + " -> byte " + n * TAMANO);
        }
        long bytes = 48;
        System.out.println("registros: " + bytes / TAMANO);
    }
}`,
          salida: `registro 0 -> byte 0
registro 1 -> byte 16
registro 2 -> byte 32
registro 3 -> byte 48
registros: 3`,
          e: "El registro *n* empieza en `n × tamaño`: 0, 16, 32 y 48. Y con 48 bytes en total hay `48 / 16 = 3` registros."
        },
        {
          t: "ejecuta",
          p: `**Calcular posiciones.** Completa los métodos para un fichero de registros de 16 bytes: \`posicion(n)\` (byte donde empieza el registro *n*), \`posicionStock(n)\` (donde empieza su stock: tras el código, 4 bytes) y \`numRegistros(longitudFichero)\`. Debe mostrar:
\`\`\`
32
36
3
\`\`\``,
          inicial: `public class App {
    static final int TAMANO_REGISTRO = 16;
    static final int TAMANO_CODIGO = 4;

    static long posicion(int n) {
        return 0;   // TODO
    }

    static long posicionStock(int n) {
        return 0;   // TODO
    }

    static long numRegistros(long longitudFichero) {
        return 0;   // TODO
    }

    public static void main(String[] args) {
        System.out.println(posicion(2));
        System.out.println(posicionStock(2));
        System.out.println(numRegistros(48));
    }
}`,
          tests: [
            {
              out: `32
36
3`
            }
          ],
          pistas: [
            "`posicionStock` reutiliza `posicion` y suma lo que ocupa el código.",
            "Multiplica con `(long) n * TAMANO_REGISTRO` para no desbordar en ficheros enormes."
          ],
          solucion: `public class App {
    static final int TAMANO_REGISTRO = 16;
    static final int TAMANO_CODIGO = 4;

    static long posicion(int n) {
        return (long) n * TAMANO_REGISTRO;
    }

    static long posicionStock(int n) {
        return posicion(n) + TAMANO_CODIGO;
    }

    static long numRegistros(long longitudFichero) {
        return longitudFichero / TAMANO_REGISTRO;
    }

    public static void main(String[] args) {
        System.out.println(posicion(2));
        System.out.println(posicionStock(2));
        System.out.println(numRegistros(48));
    }
}`
        },
        {
          t: "aviso",
          tipo: "clave",
          md: `**¿Qué formato elijo?**
- Datos que una persona debe poder leer o arreglar, o intercambio con otros programas (hojas de cálculo) → **texto (CSV)**.
- Datos compactos que solo usa tu programa, leídos del principio al final → **binario con \`Data\`**.
- Muchos registros del mismo tamaño que hay que consultar o modificar en cualquier orden → **\`RandomAccessFile\`**.
- Guardar objetos enteros con muchas propiedades sin escribir el formato a mano → **serialización**.`
        },
        {
          t: "relacionar",
          p: "Elige el formato más adecuado para cada caso.",
          pares: [
            ["Exportar los productos para abrirlos en Excel", "CSV (texto)"],
            ["Cambiar el stock del producto nº 5000 sin leer los demás", "RandomAccessFile"],
            ["Guardar el historial de ventas compacto, leído siempre entero", "Data (binario)"],
            ["Guardar un objeto Socio completo sin escribir el formato", "Serialización"]
          ],
          e: "Cada formato tiene su caso: legibilidad, acceso directo, compacidad o comodidad."
        },
        {
          t: "texto",
          md: `### Guardar objetos enteros: serialización
Escribir a mano el formato de cada clase es tedioso. Java permite guardar un objeto **entero** con un flujo \`ObjectOutputStream\`, si su clase lo permite añadiendo \`implements Serializable\` (una marca; el significado de \`implements\` se explica en la UT7). Las propiedades marcadas **\`transient\`** no se guardan (útil para contraseñas o datos calculables), y \`readObject\` devuelve un \`Object\` que hay que convertir con un *casting*:`
        },
        {
          t: "codigo",
          titulo: "Socio.java: serialización con una propiedad transient",
          code: `import java.io.*;

public class Socio implements Serializable {
    private static final long serialVersionUID = 1L;
    private String nombre;
    private int puntos;
    private transient String clave;       // transient: NO se guarda

    public Socio(String nombre, int puntos, String clave) {
        this.nombre = nombre;
        this.puntos = puntos;
        this.clave = clave;
    }

    @Override
    public String toString() {
        return nombre + " (" + puntos + " puntos, clave " + clave + ")";
    }

    public static void main(String[] args) {
        try (ObjectOutputStream salida = new ObjectOutputStream(new FileOutputStream("socio.obj"))) {
            salida.writeObject(new Socio("Laura Martínez", 1250, "secreta"));
        } catch (IOException e) {
            System.err.println("Error al guardar: " + e.getMessage());
        }

        try (ObjectInputStream entrada = new ObjectInputStream(new FileInputStream("socio.obj"))) {
            Socio leido = (Socio) entrada.readObject();
            System.out.println(leido);       // la clave sale null: no se guardó
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Error al leer: " + e.getMessage());
        }
    }
}`
        },
        {
          t: "test",
          p: "Tras guardar y leer un `Socio` con la propiedad `transient String clave`, ¿cuánto vale `clave`?",
          o: ["La clave original", "`null`", "Cadena vacía", "Lanza excepción"],
          c: 1,
          e: "Las propiedades `transient` no se guardan: al leer, valen su valor por defecto (`null`)."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "**La serialización también tiene sus peligros.** El fichero depende de la clase: si cambias las propiedades de `Socio` después de guardar, la lectura falla o da datos incorrectos (para eso existe `serialVersionUID`). Y **nunca** debe leerse con `ObjectInputStream` un fichero de **origen desconocido**: puede ejecutar código malicioso. Para datos que viven mucho tiempo o se comparten, conviene un formato abierto (CSV, JSON) o una base de datos (UT9)."
        },
        {
          t: "abierta",
          p: "Explica con tus palabras por qué el **acceso aleatorio** exige que todos los registros tengan la **misma longitud**, y qué haces con un campo de texto como el nombre.",
          modelo: "Para saltar directamente al registro *n* hay que poder calcular dónde empieza con una fórmula: posición = n × tamaño del registro. Eso solo funciona si todos los registros ocupan exactamente lo mismo; si cada uno tuviera una longitud distinta, no habría fórmula y habría que leer todos los anteriores para encontrar el que buscas (que es acceso secuencial). Con un campo de texto de longitud variable como el nombre, se le reserva una longitud fija (por ejemplo, 30 caracteres) y se rellena con espacios, o se recorta si es más largo.",
          rubrica: [
            "Menciona la fórmula posición = n × tamaño",
            "Explica que sin longitud fija no se puede calcular la posición",
            "Indica la solución para textos: longitud fija con relleno"
          ],
          minPalabras: 40
        },
        {
          t: "profundizar",
          titulo: "¿Por qué el acceso aleatorio se parece a indexar un array?",
          bloques: [
            {
              t: "texto",
              md: "Porque es la misma idea: la posición del elemento *n* es una **función** `n → n × T`. Si `T` (el tamaño de cada elemento) es constante, el ordenador salta directamente sin recorrer lo anterior; por eso `array[5000]` es tan rápido como `array[0]`. Con elementos de tamaño variable, no hay fórmula: habría que recorrer."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Los ficheros binarios dependen del **orden de los bytes** y de los tipos exactos. Java los escribe siempre en *big-endian* (el byte más significativo primero), por eso un `.dat` escrito en Java se lee igual en cualquier ordenador… **siempre que lo lea Java**. Para intercambiar datos con otros lenguajes, usa formatos de texto abiertos.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos los **ficheros binarios y el acceso aleatorio**.",
        inicial: [
          {
            p: "¿Cuántos bytes ocupa un `double` con `writeDouble`?",
            o: ["2", "4", "8", "Depende"],
            c: 2,
            e: "8 bytes."
          },
          {
            p: "En un fichero de registros de 16 bytes, ¿dónde empieza el registro número 3 (contando desde 0)?",
            o: ["En el byte 16", "En el byte 32", "En el byte 48", "En el byte 3"],
            c: 2,
            e: "3 × 16 = 48."
          },
          {
            p: "¿Qué hace la palabra `transient` en una propiedad serializable?",
            o: ["La hace constante", "Impide que se guarde", "La hace pública", "La hace estática"],
            c: 1,
            e: "La propiedad no se guarda."
          }
        ],
        pasos: [
          {
            titulo: "Binario con `Data`",
            cubre: [0],
            explica: "Los flujos `Data` guardan los primitivos tal cual (`int` = 4 bytes, `double` = 8) y se leen en el **mismo orden** en que se escribieron. Sin separadores ni nombres de campo.",
            pregunta: {
              p: "Si lees en un orden distinto del de escritura…",
              o: [
                "Funciona igual",
                "Obtienes datos sin sentido o un error",
                "Java reordena los datos",
                "El fichero se borra"
              ],
              c: 1,
              e: "El fichero no sabe qué es cada dato."
            },
            extra: "Es como una fila de cajas sin etiquetas: solo sabes qué hay en cada una porque tú las llenaste en un orden. Si las abres en otro orden, sacas cosas sin sentido."
          },
          {
            titulo: "Acceso aleatorio",
            cubre: [1],
            explica: "Con registros de **longitud fija**, el registro *n* empieza en `n × tamaño`. `seek(posición)` salta allí. Así modificas un registro sin tocar los demás.",
            ejemplo: {
              code: `public class Main {
    public static void main(String[] args) {
        final int T = 16;
        for (int n = 0; n < 3; n++) {
            System.out.println(n * T);
        }
    }
}`,
              ejecutable: true,
              titulo: "Las posiciones"
            },
            pregunta: {
              p: "¿Por qué los registros deben tener todos la misma longitud?",
              o: [
                "Por estética",
                "Para poder calcular la posición de cada uno con una fórmula",
                "Porque Java lo exige siempre",
                "Para ocupar menos"
              ],
              c: 1,
              e: "Sin longitud fija no hay fórmula."
            }
          },
          {
            titulo: "Serialización",
            cubre: [2],
            explica: "Con `implements Serializable` puedes guardar un objeto entero con `ObjectOutputStream`. Lo marcado `transient` no se guarda. Cuidado con leer ficheros de origen desconocido.",
            pregunta: {
              p: "¿Qué propiedad conviene marcar `transient`?",
              o: ["El nombre", "Una contraseña", "El código", "Todas"],
              c: 1,
              e: "Datos que no quieres guardar, como una clave."
            }
          }
        ],
        reto: {
          p: `**Reto final.** Escribe \`posicion(int n, int tamano)\` y \`registrosEn(long bytes, int tamano)\`. Para registros de 24 bytes: el registro 5 empieza en el byte 120 y un fichero de 240 bytes tiene 10 registros. Debe mostrar:
\`\`\`
120
10
\`\`\``,
          inicial: `public class App {
    static long posicion(int n, int tamano) {
        return 0;   // TODO
    }

    static long registrosEn(long bytes, int tamano) {
        return 0;   // TODO
    }

    public static void main(String[] args) {
        System.out.println(posicion(5, 24));
        System.out.println(registrosEn(240, 24));
    }
}`,
          tests: [
            {
              out: `120
10`
            }
          ],
          solucion: `public class App {
    static long posicion(int n, int tamano) {
        return (long) n * tamano;
    }

    static long registrosEn(long bytes, int tamano) {
        return bytes / tamano;
    }

    public static void main(String[] args) {
        System.out.println(posicion(5, 24));
        System.out.println(registrosEn(240, 24));
    }
}`,
          pistas: ["Es una multiplicación y una división."]
        }
      }
    },

    {
      id: "ut5-sistema",
      titulo: "El sistema de ficheros: rutas, carpetas y borrado",
      resumen: "Rutas absolutas y relativas, `File` frente a `Path`/`Files`, recorrer carpetas y crear, copiar, mover y borrar.",
      bloques: [
        {
          t: "texto",
          md: `Hasta ahora hemos escrito \`"productos.csv"\` sin preguntarnos **dónde** se crea el fichero. Para controlar dónde guardamos y leemos los datos hay que entender las **rutas**.
- Una **ruta absoluta** indica el camino completo desde la raíz del disco: \`C:\\Usuarios\\ana\\nautica\\productos.csv\` (Windows) o \`/home/ana/nautica/productos.csv\` (Linux, macOS).
- Una **ruta relativa** se cuenta desde el **directorio de trabajo** del programa: el sitio desde el que se ejecuta. \`"productos.csv"\` o \`"datos/productos.csv"\` son relativas. En el IDE, el directorio de trabajo suele ser la **carpeta del proyecto**; por eso los ficheros de los ejemplos aparecen allí.

Se puede ver con \`System.getProperty("user.dir")\`. Y como Windows separa con \`\\\` y los demás con \`/\`, **no escribas el separador a mano**: deja que Java lo ponga, con \`Path.of("datos", "productos.csv")\` o \`new File("datos", "productos.csv")\`. (En un texto de Java, la barra invertida se escribe doble: \`"C:\\\\datos"\`; con la barra normal \`/\` funcionan también las rutas de Windows.)`
        },
        {
          t: "relacionar",
          p: "Clasifica cada ruta.",
          pares: [
            ["/home/ana/nautica/productos.csv", "absoluta"],
            ["datos/productos.csv", "relativa"],
            ["C:\\\\Usuarios\\\\ana\\\\a.txt", "absoluta"],
            ["bitacora.txt", "relativa"]
          ],
          e: "Absoluta: empieza en la raíz (`/` o `C:\\`). Relativa: se cuenta desde el directorio de trabajo."
        },
        {
          t: "test",
          p: "Ejecutas tu programa desde otra carpeta y `new FileReader(\"datos.txt\")` no encuentra el fichero. ¿Por qué?",
          o: [
            "El fichero se ha borrado",
            "La ruta relativa se cuenta desde el directorio de trabajo, que ha cambiado",
            "Java no lee ficheros relativos",
            "Falta el `import`"
          ],
          c: 1,
          e: "Las rutas relativas dependen del directorio desde el que se ejecuta el programa."
        },
        {
          t: "texto",
          md: `### Las clases \`File\` y \`Path\`/\`Files\`
Java tiene dos formas de representar y manipular rutas. Verás las dos en el código real:`
        },
        {
          t: "tabla",
          titulo: "File frente a Path/Files",
          cab: ["", "`File` (`java.io`, clásica)", "`Path` y `Files` (`java.nio.file`, moderna)"],
          filas: [
            ["Representar una ruta", "`new File(\"datos/p.csv\")`", "`Path.of(\"datos\", \"p.csv\")`"],
            ["¿Existe?", "`f.exists()`", "`Files.exists(ruta)`"],
            [
              "¿Fichero o carpeta?",
              "`f.isFile()`, `f.isDirectory()`",
              "`Files.isRegularFile(ruta)`, `Files.isDirectory(ruta)`"
            ],
            ["Tamaño en bytes", "`f.length()`", "`Files.size(ruta)`"],
            [
              "Los errores se notifican",
              "Con un `boolean` (`true`/`false`)",
              "Con excepciones (`IOException` y subclases)"
            ]
          ]
        },
        {
          t: "texto",
          md: "`File` es más sencilla de leer para empezar, pero `Path` y `Files` son lo recomendado hoy, y sus excepciones dan más información sobre lo que ha fallado."
        },
        {
          t: "codigo",
          titulo: "InfoFichero.java",
          code: `import java.io.File;
import java.util.Date;

public class InfoFichero {
    public static void main(String[] args) {
        File f = new File("bitacora.txt");
        System.out.println("Nombre: " + f.getName());
        System.out.println("Ruta absoluta: " + f.getAbsolutePath());
        System.out.println("¿Existe? " + f.exists());
        if (f.exists()) {
            System.out.println("¿Es fichero? " + f.isFile());
            System.out.println("Tamaño: " + f.length() + " bytes");
            System.out.println("Última modificación: " + new Date(f.lastModified()));
        }
    }
}`
        },
        {
          t: "texto",
          md: `### Recorrer una carpeta
\`File.listFiles()\` devuelve el contenido de una carpeta (un array de \`File\`) que se recorre con un **for-each**: \`for (File f : carpeta.listFiles())\` se lee «para cada \`f\` de la lista». Si la ruta no existe o no es una carpeta, \`listFiles()\` devuelve **\`null\`**: compruébalo antes de recorrer.`
        },
        {
          t: "codigo",
          titulo: "Listar.java",
          code: `import java.io.File;

public class Listar {
    public static void main(String[] args) {
        File carpeta = new File(".");           // "." es el directorio actual
        File[] contenido = carpeta.listFiles();
        if (contenido == null) {
            System.out.println("No es una carpeta");
            return;
        }
        for (File f : contenido) {
            String tipo = f.isDirectory() ? "[carpeta]" : f.length() + " bytes";
            System.out.println(f.getName() + "  " + tipo);
        }
    }
}`
        },
        {
          t: "texto",
          md: `### Crear, copiar, mover y borrar
Además de leer y escribir el **contenido**, un programa puede crear, copiar, mover y borrar los propios ficheros y carpetas. Con \`File\`, las operaciones devuelven \`true\` o \`false\` según hayan funcionado:`
        },
        {
          t: "tabla",
          titulo: "Operaciones con File",
          cab: ["Operación", "Qué hace"],
          filas: [
            ["`f.createNewFile()`", "Crea un fichero vacío. Devuelve `false` si ya existía."],
            ["`d.mkdir()`", "Crea **una** carpeta (la carpeta padre debe existir)."],
            ["`d.mkdirs()`", "Crea la carpeta y todas las intermedias que falten."],
            ["`f.delete()`", "Borra un fichero o una carpeta **vacía**. Devuelve `false` si no pudo."],
            ["`f.renameTo(otro)`", "Renombra o mueve."]
          ]
        },
        {
          t: "codigo",
          titulo: "CrearEstructura.java",
          code: `import java.io.File;
import java.io.IOException;

public class CrearEstructura {
    public static void main(String[] args) {
        File datos = new File("nautica/datos");
        if (datos.mkdirs()) {
            System.out.println("Carpeta creada: " + datos.getPath());
        } else {
            System.out.println("La carpeta ya existía o no se pudo crear");
        }

        File fichero = new File(datos, "productos.csv");
        try {
            if (fichero.createNewFile()) {
                System.out.println("Fichero creado: " + fichero.getPath());
            }
        } catch (IOException e) {
            System.err.println("No se pudo crear: " + e.getMessage());
        }

        System.out.println(fichero.delete());                 // true
        System.out.println(datos.delete());                   // true: ya está vacía
        System.out.println(new File("nautica").delete());     // true
    }
}`
        },
        {
          t: "texto",
          md: "Con `Files`, las mismas tareas y algunas más (**copiar y mover**, que `File` no hace bien) se hacen así, y si algo falla se lanza una **excepción que dice por qué**:"
        },
        {
          t: "codigo",
          titulo: "OperacionesFiles.java",
          code: `import java.io.IOException;
import java.nio.file.*;

public class OperacionesFiles {
    public static void main(String[] args) throws IOException {
        Path carpeta = Path.of("nautica", "copias");
        Files.createDirectories(carpeta);                                       // como mkdirs
        Files.writeString(Path.of("productos.csv"), "KY-1;Kayak;249.9;5\\n");
        Files.copy(Path.of("productos.csv"), carpeta.resolve("productos.csv"),
                   StandardCopyOption.REPLACE_EXISTING);                        // copiar
        Files.move(carpeta.resolve("productos.csv"), carpeta.resolve("viejo.csv"),
                   StandardCopyOption.REPLACE_EXISTING);                        // mover o renombrar
        Files.deleteIfExists(carpeta.resolve("viejo.csv"));                     // borrar sin quejarse si no existe
    }
}`
        },
        {
          t: "texto",
          md: "Estas son subclases de `IOException` que conviene reconocer: `NoSuchFileException` (no existe), `FileAlreadyExistsException` (ya existe, al copiar o mover sin permiso para sobrescribir) y `DirectoryNotEmptyException` (borrar una carpeta con contenido). `carpeta.resolve(\"x.csv\")` construye la ruta de un fichero dentro de la carpeta."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "**Borrar es para siempre.** Los ficheros que borra un programa **no van a la papelera**. Cuando pruebes programas que crean y borran cosas, hazlo siempre en una **carpeta de pruebas** (como `nautica/`) y nunca con rutas calculadas a partir de lo que escribe el usuario sin comprobarlas, o un error de escritura puede borrar lo que no debía."
        },
        {
          t: "ordenar",
          p: "Ordena los pasos para borrar una carpeta que **contiene ficheros** con `File`.",
          items: [
            "Obtener el contenido con `listFiles()`",
            "Comprobar que no es `null`",
            "Borrar cada fichero con `delete()`",
            "Borrar la carpeta, que ya está vacía"
          ],
          e: "`delete()` solo borra carpetas vacías: primero hay que borrar lo de dentro."
        },
        {
          t: "huecos",
          p: "Completa para crear la carpeta `nautica/datos` aunque no exista `nautica`.",
          codigo: `File datos = new File("nautica/datos");
boolean creada = datos.{{mkdirs}}();`,
          e: "`mkdirs()` crea también las carpetas intermedias; `mkdir()` solo crea la última."
        },
        {
          t: "test",
          p: "`new File(\"a/b/c\").mkdir()` con la carpeta `a` inexistente…",
          o: [
            "Crea las tres carpetas",
            "Devuelve `false` y no crea nada",
            "Lanza `IOException`",
            "Crea solo `c`"
          ],
          c: 1,
          e: "`mkdir()` necesita que la carpeta padre exista; para crear toda la ruta, `mkdirs()`."
        },
        {
          t: "ejecuta",
          p: `**Copia con fecha.** Escribe \`nombreCopia(String fichero, LocalDate fecha)\`, que añade la fecha antes de la extensión: \`productos.csv\` y 2026-11-02 dan \`productos_2026-11-02.csv\`. Usa \`lastIndexOf('.')\` y \`substring\`. Debe mostrar:
\`\`\`
productos_2026-11-02.csv
informe_2026-11-02.txt
\`\`\``,
          inicial: `import java.time.LocalDate;

public class App {
    static String nombreCopia(String fichero, LocalDate fecha) {
        // TODO
        return fichero;
    }

    public static void main(String[] args) {
        LocalDate hoy = LocalDate.of(2026, 11, 2);
        System.out.println(nombreCopia("productos.csv", hoy));
        System.out.println(nombreCopia("informe.txt", hoy));
    }
}`,
          tests: [
            {
              out: `productos_2026-11-02.csv
informe_2026-11-02.txt`
            }
          ],
          pistas: [
            "`substring(0, punto)` da el nombre y `substring(punto)` la extensión (con el punto).",
            "Un `LocalDate` concatenado con texto se muestra como `2026-11-02`."
          ],
          solucion: `import java.time.LocalDate;

public class App {
    static String nombreCopia(String fichero, LocalDate fecha) {
        int punto = fichero.lastIndexOf('.');
        String nombre = fichero.substring(0, punto);
        String extension = fichero.substring(punto);
        return nombre + "_" + fecha + extension;
    }

    public static void main(String[] args) {
        LocalDate hoy = LocalDate.of(2026, 11, 2);
        System.out.println(nombreCopia("productos.csv", hoy));
        System.out.println(nombreCopia("informe.txt", hoy));
    }
}`
        },
        {
          t: "practica",
          titulo: "Preparar el día",
          p: "Escribe en tu IDE un programa que «prepara el día». Necesita crear y borrar carpetas y ficheros reales, así que se hace en tu IDE; aquí tienes los pasos.",
          pasos: [
            {
              t: "Crea la estructura",
              md: "Crea (si no existen) las carpetas `nautica/datos`, `nautica/copias` y `nautica/informes`. Que no falle si se ejecuta dos veces.",
              code: "Files.createDirectories(Path.of(\"nautica\", \"datos\"));",
              check: "Ejecutarlo dos veces seguidas no da error."
            },
            {
              t: "Copia con la fecha",
              md: "Copia `productos.csv` a `nautica/copias` con la fecha de hoy en el nombre (como `productos_2026-11-02.csv`), usando `Files.copy` y `StandardCopyOption.REPLACE_EXISTING`.",
              check: "En `copias` aparece el fichero con la fecha.",
              pregunta: "¿Qué ocurre si no pones `REPLACE_EXISTING` y ejecutas dos veces?"
            },
            {
              t: "Lista el resultado",
              md: "Muestra el contenido de `nautica` indicando cuáles son carpetas.",
              check: "La salida distingue carpetas de ficheros."
            },
            {
              t: "Deshacer con cuidado",
              md: "Pregunta si se quiere deshacerlo todo y, si la respuesta es `s`, borra lo creado: primero los ficheros y después las carpetas.",
              check: "Tras deshacer, no queda nada de `nautica/`."
            }
          ],
          entrega: "El código del programa y la salida de dos ejecuciones seguidas."
        },
        {
          t: "profundizar",
          titulo: "¿Qué diferencia práctica hay entre `File.delete()` y `Files.delete()`?",
          bloques: [
            {
              t: "texto",
              md: "`File.delete()` devuelve `false` si no puede borrar, **sin decir por qué** (¿no existe?, ¿sin permisos?, ¿carpeta con contenido?). `Files.delete()` lanza una excepción **concreta** (`NoSuchFileException`, `DirectoryNotEmptyException`…) que te dice exactamente qué ha pasado. Por eso `Files` es lo recomendado: un error que explica su causa es mucho más fácil de arreglar."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Rutas y seguridad.** Si construyes una ruta con texto que escribe el usuario (`\"datos/\" + nombre`), alguien podría escribir `../../otro` y salirse de tu carpeta (*path traversal*). Normaliza la ruta (`Path.normalize()`) y comprueba que sigue dentro de la carpeta permitida antes de leer o borrar.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos el **sistema de ficheros**.",
        inicial: [
          {
            p: "¿Desde dónde se cuenta una ruta relativa?",
            o: [
              "Desde la raíz del disco",
              "Desde el directorio de trabajo del programa",
              "Desde el escritorio",
              "Desde la carpeta del JDK"
            ],
            c: 1,
            e: "Desde el directorio de trabajo."
          },
          {
            p: "¿Qué devuelve `File.delete()` cuando no puede borrar?",
            o: ["Una excepción", "`false`", "`null`", "`-1`"],
            c: 1,
            e: "Con `File`, los errores se notifican con un `boolean`."
          },
          {
            p: "¿Qué método crea una carpeta y todas las intermedias que falten?",
            o: ["`mkdir()`", "`mkdirs()`", "`createNewFile()`", "`renameTo()`"],
            c: 1,
            e: "`mkdirs()`."
          }
        ],
        pasos: [
          {
            titulo: "Rutas",
            cubre: [0],
            explica: "Absoluta: desde la raíz. Relativa: desde el directorio de trabajo (normalmente la carpeta del proyecto). No escribas el separador a mano: usa `Path.of(...)`.",
            pregunta: {
              p: "¿Qué ruta es absoluta?",
              o: ["`datos/a.txt`", "`/home/ana/a.txt`", "`a.txt`", "`../a.txt`"],
              c: 1,
              e: "Empieza en la raíz."
            },
            extra: "Una ruta absoluta es como una dirección completa (país, ciudad, calle y número); una relativa es «la segunda puerta a la derecha» y solo tiene sentido si sabes desde dónde empiezas a contar."
          },
          {
            titulo: "File y Files",
            cubre: [1, 2],
            explica: "`File` avisa con `boolean`; `Files` lanza excepciones que explican el fallo. Para crear carpetas, `mkdirs`; para borrar una carpeta, antes hay que vaciarla.",
            pregunta: {
              p: "¿Qué ventaja tiene `Files.delete` frente a `File.delete`?",
              o: [
                "Es más rápido",
                "Si falla, la excepción dice por qué",
                "Borra carpetas con contenido",
                "Va a la papelera"
              ],
              c: 1,
              e: "La excepción concreta indica la causa."
            },
            profundiza: "Los borrados de un programa no pasan por la papelera, así que prueba siempre en una carpeta de pruebas."
          }
        ],
        reto: {
          p: `**Reto final.** Escribe \`extension(String fichero)\`, que devuelve la extensión sin el punto (\`informe.final.txt\` → \`txt\`), o una cadena vacía si no hay punto. Debe mostrar:
\`\`\`
csv
txt

\`\`\`
(la tercera línea está vacía).`,
          inicial: `public class App {
    static String extension(String fichero) {
        // TODO
        return "";
    }

    public static void main(String[] args) {
        System.out.println(extension("productos.csv"));
        System.out.println(extension("informe.final.txt"));
        System.out.println(extension("README"));
    }
}`,
          tests: [
            {
              out: `csv
txt`
            }
          ],
          solucion: `public class App {
    static String extension(String fichero) {
        int punto = fichero.lastIndexOf('.');
        if (punto < 0) {
            return "";
        }
        return fichero.substring(punto + 1);
    }

    public static void main(String[] args) {
        System.out.println(extension("productos.csv"));
        System.out.println(extension("informe.final.txt"));
        System.out.println(extension("README"));
    }
}`,
          pistas: ["`lastIndexOf` devuelve `-1` si no encuentra el carácter."]
        }
      }
    },

    {
      id: "ut5-formatos",
      titulo: "Teclado, pantalla y formatos de visualización",
      resumen: "`Scanner` con seguridad, `printf`, `Locale`, fechas con formato y bloques de texto.",
      bloques: [
        {
          t: "texto",
          md: `La consola sigue siendo la forma más rápida de interactuar con un programa, y un programa se juzga también por **lo que muestra**. Este apartado reúne lo que ya sabías y lo que falta para hacerlo con garbo.

### Entrada desde teclado con seguridad
Ya conoces \`Scanner\` y sus dos trampas (UT2), y la forma de proteger los datos con excepciones y repetir la pregunta (UT3). Dos mejoras:
- **Preguntar antes de leer**: \`hasNextInt()\`, \`hasNextDouble()\`… devuelven \`true\` si lo siguiente que se va a leer tiene ese tipo, **sin lanzar excepciones**.
- **Elegir el formato de los decimales** con \`teclado.useLocale(Locale.US)\`: así \`nextDouble()\` acepta \`12.5\` (con punto) en cualquier equipo. Con la configuración regional del equipo en español, espera \`12,5\`.`
        },
        {
          t: "codigo",
          titulo: "hasNextDouble y useLocale (prueba con 12.5 y con hola)",
          code: `import java.util.Locale;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        teclado.useLocale(Locale.US);
        System.out.print("Precio: ");
        if (teclado.hasNextDouble()) {
            double precio = teclado.nextDouble();
            System.out.println("Con IVA: " + precio * 1.21);
        } else {
            System.out.println("Eso no es un número");
        }
    }
}`,
          ejecutable: true,
          stdin: `12.5
`
        },
        {
          t: "texto",
          md: `### Salida con formato: \`printf\`
\`System.out.printf\` (y \`String.format\`, que construye el texto sin mostrarlo) usan una **cadena de formato** con **marcadores** que empiezan por \`%\`:`
        },
        {
          t: "tabla",
          titulo: "Marcadores de printf",
          cab: ["Marcador", "Significado", "Ejemplo (3500 o 34.5)"],
          filas: [
            ["`%d`", "Entero", "`3500`"],
            ["`%8d`", "Entero en 8 columnas, a la derecha", "`    3500`"],
            ["`%-8d`", "Entero en 8 columnas, a la izquierda", "`3500    `"],
            ["`%08d`", "Entero relleno con ceros", "`00003500`"],
            ["`%,d`", "Entero con separador de miles", "`3.500` (en español)"],
            ["`%f`", "Decimal (6 decimales por defecto)", "`34,500000`"],
            ["`%.2f`", "Decimal con 2 decimales", "`34,50`"],
            ["`%8.2f`", "Decimal con 2 decimales en 8 columnas", "`   34,50`"],
            ["`%,.2f`", "Decimal con miles y 2 decimales", "`3.500,00`"],
            ["`%s`", "Texto (o cualquier objeto)", "`Kayak`"],
            ["`%-20s`", "Texto en 20 columnas, a la izquierda", "`Kayak               `"],
            ["`%c`", "Un carácter", "`M`"],
            ["`%b`", "`boolean`", "`true`"],
            ["`%n`", "Salto de línea (el de cada sistema)", ""],
            ["`%%`", "El signo %", "`%`"]
          ]
        },
        {
          t: "texto",
          md: "Con esto se hacen **tablas alineadas**, algo imposible con simples concatenaciones:"
        },
        {
          t: "codigo",
          titulo: "TablaPrecios.java",
          code: `public class TablaPrecios {
    public static void main(String[] args) {
        System.out.printf("%-22s%10s%8s%n", "Producto", "Precio", "Stock");
        System.out.printf("%-22s%10.2f%8d%n", "Kayak Bahía 2", 249.90, 5);
        System.out.printf("%-22s%10.2f%8d%n", "Chaleco salvavidas", 34.50, 20);
        System.out.printf("%-22s%10.2f%8d%n", "Neopreno corto 3mm", 89.95, 12);
        System.out.println("-".repeat(40));
        System.out.printf("%-22s%10.2f%n", "Valor del almacén", 249.90 * 5 + 34.50 * 20 + 89.95 * 12);
    }
}`,
          ejecutable: true
        },
        {
          t: "predecir",
          p: "¿Qué muestra? (Cuenta las columnas.)",
          code: `public class Main {
    public static void main(String[] args) {
        System.out.println(String.format("[%6d]", 42));
        System.out.println(String.format("[%-6d]", 42));
        System.out.println(String.format("[%06d]", 42));
        System.out.println(String.format("[%.1f]", 2.25));
        System.out.println(String.format("[%,d]", 1234567));
    }
}`,
          salida: `[    42]
[42    ]
[000042]
[2,3]
[1.234.567]`,
          e: "`%6d` rellena a la izquierda con espacios hasta 6 columnas; `%-6d`, a la derecha; `%06d`, con ceros. `%.1f` redondea (2,25 → 2,3 en `HALF_UP`) y `%,d` agrupa los miles con puntos en español."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "Si un marcador **no coincide con el tipo del dato** (por ejemplo, `%d` con un `double`), el programa lanza `IllegalFormatConversionException` **al ejecutarse**: el compilador no lo detecta."
        },
        {
          t: "codigo",
          titulo: "%d con un double",
          code: `public class Main {
    public static void main(String[] args) {
        try {
            System.out.println(String.format("Unidades: %d", 3.5));
        } catch (java.util.IllegalFormatConversionException e) {
            System.out.println("El marcador no encaja con el dato");
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `### Formato regional: \`Locale\`
Los separadores dependen del idioma y país configurados en el equipo (*configuración regional*): en España, **coma** decimal y **punto** para los miles; en Estados Unidos, al revés. Un programa que escribe un fichero o se ejecuta en equipos distintos **no debe depender de eso**. Se fija con un \`Locale\`. Regla práctica: **lo que va a un fichero o lo lee otro programa, con \`Locale.US\`**; **lo que lee una persona, con su configuración regional**.`
        },
        {
          t: "codigo",
          titulo: "El mismo número con dos Locale",
          code: `import java.util.Locale;

public class Main {
    public static void main(String[] args) {
        System.out.println(String.format(Locale.US, "%,.2f", 3018.9));
        System.out.println(String.format(Locale.forLanguageTag("es-ES"), "%,.2f", 3018.9));
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `### Fechas con formato
\`LocalDate\` (UT2) se muestra por defecto como \`2026-11-02\`. Para otros formatos se usa \`DateTimeFormatter\` con un **patrón**: \`dd\` día, \`MM\` mes, \`yyyy\` año, \`HH:mm\` hora y minutos, \`EEEE\` nombre del día, \`MMMM\` nombre del mes. El texto fijo va entre comillas simples:`
        },
        {
          t: "codigo",
          titulo: "Fechas con DateTimeFormatter",
          code: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class Main {
    public static void main(String[] args) {
        LocalDate fecha = LocalDate.of(2026, 11, 2);
        Locale es = Locale.forLanguageTag("es-ES");
        System.out.println(fecha);
        System.out.println(fecha.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        System.out.println(fecha.format(DateTimeFormatter.ofPattern("EEEE d 'de' MMMM 'de' yyyy", es)));
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `### Bloques de texto
Desde Java 15, un texto de varias líneas se puede escribir entre **tres comillas dobles**, sin \`\\n\` ni concatenaciones. Va muy bien para plantillas de tickets y mensajes largos, y se combina con \`formatted\`. La sangría común a todas las líneas (la del cierre de las tres comillas) se descarta, de modo que el texto queda alineado a la izquierda:`
        },
        {
          t: "codigo",
          titulo: "Un ticket con bloque de texto",
          code: `public class Main {
    public static void main(String[] args) {
        String ticket = """
                NÁUTICA BAHÍA S.L.
                Cliente: %s
                Total:   %.2f euros
                """.formatted("Laura Martínez", 58.08);
        System.out.print(ticket);
    }
}`,
          ejecutable: true
        },
        {
          t: "ejecuta",
          p: "**Formatos en pantalla.** Muestra una tabla alineada: nombre (20 columnas, a la izquierda), precio (10 columnas, 2 decimales), unidades (6 columnas) e importe (10 columnas, con separador de miles y 2 decimales). Debajo, una línea de 46 guiones y el total (`%,.2f`). Parte del código ya está hecho.",
          inicial: `public class App {
    public static void main(String[] args) {
        String[] nombres = {"Kayak Bahía 2", "Chaleco salvavidas", "Tabla paddle surf"};
        double[] precios = {249.90, 34.50, 1299.00};
        int[] unidades = {5, 20, 3};
        System.out.printf("%-20s%10s%6s%10s%n", "Producto", "Precio", "Uds", "Importe");
        double total = 0;
        for (int i = 0; i < nombres.length; i++) {
            double importe = precios[i] * unidades[i];
            total += importe;
            // TODO: mostrar la fila con printf
        }
        // TODO: línea de guiones y total
    }
}`,
          tests: [
            {
              out: `Producto                Precio   Uds   Importe
Kayak Bahía 2           249,90     5   1249,50
Chaleco salvavidas       34,50    20    690,00
Tabla paddle surf      1299,00     3   3897,00
----------------------------------------------
Total                                  5836,50`
            }
          ],
          pistas: [
            "La fila: `\"%-20s%10.2f%6d%10.2f%n\"` con nombre, precio, unidades e importe.",
            "El total ocupa 36 + 10 = 46 columnas, como la línea de guiones."
          ],
          solucion: `public class App {
    public static void main(String[] args) {
        String[] nombres = {"Kayak Bahía 2", "Chaleco salvavidas", "Tabla paddle surf"};
        double[] precios = {249.90, 34.50, 1299.00};
        int[] unidades = {5, 20, 3};
        System.out.printf("%-20s%10s%6s%10s%n", "Producto", "Precio", "Uds", "Importe");
        double total = 0;
        for (int i = 0; i < nombres.length; i++) {
            double importe = precios[i] * unidades[i];
            total += importe;
            System.out.printf("%-20s%10.2f%6d%10.2f%n", nombres[i], precios[i], unidades[i], importe);
        }
        System.out.println("-".repeat(46));
        System.out.printf("%-36s%10.2f%n", "Total", total);
    }
}`
        },
        {
          t: "ejecuta",
          p: `**Precio con punto en cualquier equipo.** Lee un precio con \`Scanner\` aceptando el **punto** decimal (\`useLocale(Locale.US)\`) y muestra el precio con IVA (21 %) con el formato de España y con el de Estados Unidos. Con la entrada \`12.5\` debe mostrar:
\`\`\`
España: 15,13
EE. UU.: 15.13
\`\`\``,
          inicial: `import java.util.Locale;
import java.util.Scanner;

public class App {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        // TODO: aceptar el punto decimal
        double precio = teclado.nextDouble();
        double total = precio * 1.21;
        // TODO: mostrar con los dos formatos
    }
}`,
          tests: [
            {
              in: `12.5
`,
              out: `España: 15,13
EE. UU.: 15.13`
            },
            {
              in: `100
`,
              out: `España: 121,00
EE. UU.: 121.00`
            }
          ],
          pistas: [
            "`useLocale(Locale.US)` va **antes** de `nextDouble()`.",
            "`String.format(Locale, formato, datos...)` recibe el `Locale` como primer argumento."
          ],
          solucion: `import java.util.Locale;
import java.util.Scanner;

public class App {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        teclado.useLocale(Locale.US);
        double precio = teclado.nextDouble();
        double total = precio * 1.21;
        System.out.println("España: " + String.format(Locale.forLanguageTag("es-ES"), "%.2f", total));
        System.out.println("EE. UU.: " + String.format(Locale.US, "%.2f", total));
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `printf(\"%.2f\", 2.675)` muestra `2,68` y no `2,67`?",
          bloques: [
            {
              t: "texto",
              md: "Porque el `double` `2.675` se guarda en binario como `2.67499999999999982236…`, lo que haría pensar en 2,67. Pero Java formatea a partir de la representación decimal más corta del número (`2.675`) y aplica *HALF_UP*, por eso muestra 2,68. Moraleja: para dinero exacto no uses `double`; usa `BigDecimal` o guarda los céntimos como enteros."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**El `Locale` por defecto cambia de un equipo a otro.** En las máquinas del aula puede que sea distinto del tuyo y las capturas de pantalla no coincidirán. Si un programa debe producir **siempre** la misma salida (informes, ficheros, tests), fija el `Locale` de forma explícita; el `Locale` por defecto solo es adecuado para lo que lee una persona en su propio equipo.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos **teclado, pantalla y formatos**.",
        inicial: [
          {
            p: "¿Qué hace `%-10s` en `printf`?",
            o: [
              "Un texto de 10 columnas alineado a la derecha",
              "Un texto de 10 columnas alineado a la izquierda",
              "Un número con 10 decimales",
              "Un texto de 10 caracteres exactos"
            ],
            c: 1,
            e: "El `-` alinea a la izquierda."
          },
          {
            p: "¿Qué muestra `String.format(\"%.2f\", 3.14159)` con la configuración española?",
            o: ["`3.14`", "`3,14`", "`3,1416`", "`3`"],
            c: 1,
            e: "Dos decimales con coma."
          },
          {
            p: "Un programa escribe un CSV que leerá otro programa. ¿Qué `Locale` conviene?",
            o: ["El del equipo", "`Locale.US`", "Ninguno", "El de Francia"],
            c: 1,
            e: "Fija el punto decimal: el fichero queda igual en cualquier equipo."
          }
        ],
        pasos: [
          {
            titulo: "printf",
            cubre: [0, 1],
            explica: "Marcadores: `%d` entero, `%f` decimal, `%s` texto, `%n` salto de línea. Con un número delante fijas el ancho; `-` alinea a la izquierda; `.2` son los decimales; `,` agrupa miles.",
            ejemplo: {
              code: `public class Main {
    public static void main(String[] args) {
        System.out.printf("%-10s|%8.2f|%n", "Kayak", 249.9);
        System.out.printf("%-10s|%8.2f|%n", "Chaleco", 34.5);
    }
}`,
              ejecutable: true,
              titulo: "Columnas alineadas"
            },
            pregunta: {
              p: "¿Qué hace `%8.2f`?",
              o: [
                "Ocho decimales",
                "Un decimal en 8 columnas con 2 decimales",
                "Dos enteros",
                "Un texto de 8 caracteres"
              ],
              c: 1,
              e: "Ancho 8 y 2 decimales."
            },
            extra: "Piensa en una tabla con columnas de ancho fijo: el número tras el `%` es el ancho de la columna y el `-` indica que el texto va pegado a la izquierda."
          },
          {
            titulo: "Locale",
            cubre: [2],
            explica: "La coma y el punto decimales dependen del `Locale`. Lo que va a ficheros o a otros programas se escribe con `Locale.US`; lo que lee una persona, con su configuración.",
            pregunta: {
              p: "¿Por qué conviene `useLocale(Locale.US)` en un `Scanner` que lee `12.5`?",
              o: [
                "Para que acepte el punto sea cual sea la configuración del equipo",
                "Para leer más rápido",
                "Para leer enteros",
                "No sirve para nada"
              ],
              c: 0,
              e: "Sin él, un equipo en español esperaría `12,5`."
            }
          }
        ],
        reto: {
          p: `**Reto final.** Muestra el total \`1234567.891\` con tres formatos, uno por línea: con miles y 2 decimales en España (\`%,.2f\`), con miles y 2 decimales en EE. UU., y relleno de ceros hasta 12 caracteres con 2 decimales (\`%012.2f\`) en EE. UU.
\`\`\`
1.234.567,89
1,234,567.89
001234567.89
\`\`\``,
          inicial: `import java.util.Locale;

public class App {
    public static void main(String[] args) {
        double total = 1234567.891;
        // TODO: tres líneas con String.format
    }
}`,
          tests: [
            {
              out: `1.234.567,89
1,234,567.89
001234567.89`
            }
          ],
          solucion: `import java.util.Locale;

public class App {
    public static void main(String[] args) {
        double total = 1234567.891;
        System.out.println(String.format(Locale.forLanguageTag("es-ES"), "%,.2f", total));
        System.out.println(String.format(Locale.US, "%,.2f", total));
        System.out.println(String.format(Locale.US, "%012.2f", total));
    }
}`,
          pistas: ["`String.format(Locale.US, \"%,.2f\", total)`. Para los ceros, `%012.2f`."]
        }
      }
    },

    {
      id: "ut5-graficas",
      titulo: "Interfaces gráficas con Swing",
      resumen: "Ventanas, componentes y gestores de distribución; el árbol de componentes y los diálogos `JOptionPane`.",
      bloques: [
        {
          t: "texto",
          md: `La consola obliga a responder en **el orden** en que el programa pregunta. Una **interfaz gráfica** (GUI) lo muestra todo a la vez y deja al usuario decidir qué hacer. Para el programador cambia algo importante: el programa **ya no dirige la conversación**, se queda esperando a que el usuario haga algo (apartado siguiente).

Usaremos **Swing**, la biblioteca gráfica incluida en Java (\`javax.swing\`, con \`java.awt\` para colores y distribuciones). Una ventana se construye con **componentes**, que son objetos como los de la UT4: se crean con \`new\`, se configuran con métodos y se pasan a quien los contiene.`
        },
        {
          t: "aviso",
          tipo: "info",
          md: "**Dónde se prueba esto.** El código de Swing necesita pantalla, así que **no se ejecuta en esta aplicación**: aquí lo estudias, lo ordenas, lo completas y respondes preguntas; **lo programas y lo ejecutas en tu IDE**. En los bloques de esta unidad verás la ventana descrita en el código y su esquema."
        },
        {
          t: "tabla",
          titulo: "Los componentes básicos de Swing",
          cab: ["Clase", "Qué es"],
          filas: [
            ["`JFrame`", "La ventana principal, con barra de título y botón de cerrar"],
            ["`JPanel`", "Contenedor invisible para agrupar otros componentes"],
            ["`JLabel`", "Un texto fijo (etiqueta) o una imagen"],
            ["`JTextField`", "Caja de texto de una línea"],
            ["`JButton`", "Un botón"],
            ["`JCheckBox`, `JRadioButton`", "Casillas de verificación y botones de opción"],
            ["`JComboBox`", "Lista desplegable"],
            [
              "`JTextArea` (con `JScrollPane`)",
              "Texto de varias líneas (el `JScrollPane` añade barras de desplazamiento)"
            ],
            ["`JOptionPane`", "Cuadros de diálogo listos para usar"]
          ]
        },
        { t: "texto", md: "### Una ventana mínima" },
        {
          t: "codigo",
          titulo: "VentanaMinima.java",
          code: `import javax.swing.*;

public class VentanaMinima {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame ventana = new JFrame("Náutica Bahía");
            ventana.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            ventana.add(new JLabel("Bienvenido a Náutica Bahía", SwingConstants.CENTER));
            ventana.setSize(360, 120);
            ventana.setLocationRelativeTo(null);       // centrar en la pantalla
            ventana.setVisible(true);                  // ¡sin esto no se ve!
        });
    }
}`
        },
        {
          t: "texto",
          md: "`new JFrame(\"título\")` crea la ventana; `setDefaultCloseOperation(EXIT_ON_CLOSE)` hace que el programa **termine** al cerrarla (sin esto, la ventana desaparece pero el programa sigue vivo); `add` añade un componente; `setSize` da el tamaño en píxeles; y `setVisible(true)` la muestra. `SwingUtilities.invokeLater(() -> { ... })` es una **fórmula** que usarás siempre: pide a Swing que cree la ventana en su propio hilo de trabajo (`() -> ...` se explica en el siguiente apartado)."
        },
        {
          t: "test",
          p: "¿Qué ocurre si olvidas `setVisible(true)`?",
          o: [
            "La ventana sale vacía",
            "La ventana no se ve, aunque el programa se ejecuta",
            "El programa no compila",
            "La ventana sale pequeña"
          ],
          c: 1,
          e: "Sin `setVisible(true)` la ventana existe en memoria pero no se muestra."
        },
        {
          t: "test",
          p: "¿Qué hace `setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)`?",
          o: [
            "Impide cerrar la ventana",
            "Termina el programa al cerrar la ventana",
            "Minimiza la ventana",
            "Borra los componentes"
          ],
          c: 1,
          e: "Sin ella, la ventana desaparece pero el programa sigue en ejecución."
        },
        {
          t: "texto",
          md: `### Colocar los componentes: gestores de distribución
No se colocan los componentes con coordenadas: se elige un **gestor de distribución** (*layout manager*) que los coloca solo y que se adapta si la ventana cambia de tamaño.`
        },
        {
          t: "tabla",
          titulo: "Los tres gestores básicos",
          cab: ["Gestor", "Cómo coloca"],
          filas: [
            [
              "`FlowLayout`",
              "Uno detrás de otro, de izquierda a derecha, saltando de línea si no caben (el de `JPanel` por defecto)"
            ],
            [
              "`BorderLayout`",
              "En cinco zonas: `NORTH`, `SOUTH`, `EAST`, `WEST` y `CENTER` (el de `JFrame` por defecto)"
            ],
            ["`GridLayout`", "En una cuadrícula de filas y columnas, todas del mismo tamaño"]
          ]
        },
        {
          t: "texto",
          md: `Las interfaces reales **combinan** gestores. La calculadora de alquiler que construiremos es un \`JFrame\` (\`BorderLayout\`) con un panel \`GridLayout\` en el centro y una etiqueta con el resultado al sur:
\`\`\`
+------------------------------------------+
| Calculadora de alquiler               x  |
+------------------------------------------+
|  Minutos de uso:        [ 200         ]  |   <- panel con GridLayout (CENTER)
|  Número de equipos:     [ 2           ]  |
|  [x] Es socio (10 %)    [  Calcular   ]  |
+------------------------------------------+
|   4 h cobradas. Total con IVA: 69,70     |   <- JLabel (SOUTH)
+------------------------------------------+
\`\`\``
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "**La interfaz es un árbol de componentes.** Una ventana es un `JFrame` que contiene paneles, que contienen componentes, que a su vez pueden ser paneles… Para entender o diseñar una interfaz, **dibuja primero el árbol** en papel: qué contiene cada zona y con qué gestor se coloca. Programarla es solo traducir ese dibujo a código."
        },
        {
          t: "relacionar",
          p: "Relaciona cada gestor con su descripción.",
          pares: [
            ["`FlowLayout`", "Uno tras otro, saltando de línea"],
            ["`BorderLayout`", "Cinco zonas: norte, sur, este, oeste y centro"],
            ["`GridLayout`", "Cuadrícula de celdas iguales"]
          ],
          e: "Tres gestores básicos, que se combinan anidando paneles."
        },
        {
          t: "test",
          p: "¿Qué gestor usa por defecto un `JFrame`?",
          o: ["`FlowLayout`", "`BorderLayout`", "`GridLayout`", "Ninguno"],
          c: 1,
          e: "`BorderLayout`. El `JPanel` usa `FlowLayout`."
        },
        {
          t: "texto",
          md: `### Diálogos listos para usar: \`JOptionPane\`
Para un mensaje o una pregunta sencilla no hace falta construir una ventana: \`JOptionPane\` muestra cuadros de diálogo en una sola línea, ideales para sustituir a la consola. El primer argumento (\`null\`) es la ventana *padre*. \`showInputDialog\` devuelve un \`String\` o **\`null\` si el usuario cancela**: hay que comprobarlo antes de usar el resultado.`
        },
        {
          t: "codigo",
          titulo: "Dialogos.java",
          code: `import javax.swing.*;

public class Dialogos {
    public static void main(String[] args) {
        JOptionPane.showMessageDialog(null, "Reserva guardada", "Aviso", JOptionPane.INFORMATION_MESSAGE);

        String nombre = JOptionPane.showInputDialog(null, "Nombre del cliente:");   // null si se cancela
        if (nombre != null) {
            System.out.println("Cliente: " + nombre.strip());
        }

        int respuesta = JOptionPane.showConfirmDialog(null, "¿Borrar el producto?", "Confirmar",
                                                      JOptionPane.YES_NO_OPTION);
        if (respuesta == JOptionPane.YES_OPTION) {
            System.out.println("Borrado");
        }
    }
}`
        },
        {
          t: "ordenar",
          p: "Ordena los pasos para mostrar una ventana con una etiqueta.",
          items: [
            "Crear el `JFrame` con su título",
            "Indicar qué pasa al cerrar con `setDefaultCloseOperation`",
            "Añadir la `JLabel` con `add`",
            "Dar tamaño con `setSize`",
            "Mostrarla con `setVisible(true)`"
          ],
          e: "Se construye, se configura, se rellena y, al final, se muestra."
        },
        {
          t: "huecos",
          p: "Completa para que, al pulsar el botón de cerrar, termine el programa.",
          codigo: `JFrame ventana = new JFrame("Mi ventana");
ventana.{{setDefaultCloseOperation}}(JFrame.{{EXIT_ON_CLOSE}});
ventana.{{setVisible}}(true);`,
          e: "`setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)` y, para mostrarla, `setVisible(true)`."
        },
        {
          t: "ejecuta",
          p: `**La lógica, separada de la ventana.** Antes de dibujar la calculadora, la lógica se prueba aparte. Escribe \`horasCobradas(int minutos)\`, que redondea **hacia arriba** a horas completas (60 min = 1 h, 61 min = 2 h). Debe mostrar:
\`\`\`
1
2
4
\`\`\``,
          inicial: `public class App {
    static int horasCobradas(int minutos) {
        return 0;   // TODO
    }

    public static void main(String[] args) {
        System.out.println(horasCobradas(60));
        System.out.println(horasCobradas(61));
        System.out.println(horasCobradas(200));
    }
}`,
          tests: [
            {
              out: `1
2
4`
            }
          ],
          pistas: [
            "Divide con decimales: `(double) minutos / 60`.",
            "`Math.ceil` redondea hacia arriba; devuelve `double`, así que conviértelo a `int`."
          ],
          solucion: `public class App {
    static int horasCobradas(int minutos) {
        return (int) Math.ceil((double) minutos / 60);
    }

    public static void main(String[] args) {
        System.out.println(horasCobradas(60));
        System.out.println(horasCobradas(61));
        System.out.println(horasCobradas(200));
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Por qué no se colocan los componentes con coordenadas?",
          bloques: [
            {
              t: "texto",
              md: "Porque las coordenadas fijas se rompen cuando la ventana cambia de tamaño, cuando el usuario tiene otra resolución o fuentes más grandes, o cuando se traduce una etiqueta a un idioma con textos más largos. Un gestor de distribución **calcula** la posición cada vez. Existe también `GridBagLayout`, muy potente pero engorroso: de momento, con combinar los tres básicos hay de sobra."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Todo el código de Swing debe ejecutarse en el **hilo de eventos**; por eso `SwingUtilities.invokeLater`. Si lo olvidas, muchas veces *parece* que funciona, pero de forma intermitente aparecen ventanas a medio pintar o bloqueos difíciles de reproducir.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos **Swing y los gestores de distribución**.",
        inicial: [
          {
            p: "¿Qué clase representa la ventana principal?",
            o: ["`JPanel`", "`JFrame`", "`JLabel`", "`JOptionPane`"],
            c: 1,
            e: "`JFrame`."
          },
          {
            p: "¿Qué gestor coloca en norte, sur, este, oeste y centro?",
            o: ["`FlowLayout`", "`BorderLayout`", "`GridLayout`", "`BoxLayout`"],
            c: 1,
            e: "`BorderLayout`."
          },
          {
            p: "¿Qué devuelve `showInputDialog` si el usuario cancela?",
            o: ["Cadena vacía", "`null`", "`0`", "Una excepción"],
            c: 1,
            e: "`null`: hay que comprobarlo."
          }
        ],
        pasos: [
          {
            titulo: "Componentes",
            cubre: [0],
            explica: "Una ventana es un **árbol**: un `JFrame` que contiene paneles, que contienen componentes (`JLabel`, `JTextField`, `JButton`…). Todos son objetos de la UT4: se crean con `new`, se configuran y se añaden.",
            pregunta: {
              p: "Para mostrar una ventana hace falta, al final…",
              o: ["`setVisible(true)`", "`dispose()`", "`pack()` solo", "Nada"],
              c: 0,
              e: "Sin `setVisible(true)` no se ve."
            },
            extra: "Es como montar con piezas: primero decides el esquema (el árbol), después colocas cada pieza en su caja, y al final enciendes la luz con `setVisible`."
          },
          {
            titulo: "Distribución y diálogos",
            cubre: [1, 2],
            explica: "Los gestores (`FlowLayout`, `BorderLayout`, `GridLayout`) colocan los componentes y se combinan anidando paneles. `JOptionPane` da diálogos en una línea.",
            pregunta: {
              p: "Un formulario de etiquetas y cajas alineadas en dos columnas encaja mejor con…",
              o: ["`GridLayout`", "`FlowLayout` siempre", "Coordenadas fijas", "`JOptionPane`"],
              c: 0,
              e: "`GridLayout(0, 2)`: filas libres y dos columnas."
            }
          }
        ],
        reto: {
          p: `**Reto final.** Escribe \`total(int minutos, int equipos, boolean socio)\`: horas redondeadas hacia arriba × 8 € × equipos, −10 % si es socio, y +21 % de IVA. Si minutos o equipos no son positivos, lanza \`IllegalArgumentException\`. Muestra el total de 200 min, 2 equipos, socio, con dos decimales; y un caso no válido.
\`\`\`
69,70
Los valores deben ser mayores que cero
\`\`\``,
          inicial: `public class App {
    static double total(int minutos, int equipos, boolean socio) {
        return 0;   // TODO
    }

    public static void main(String[] args) {
        System.out.printf("%.2f%n", total(200, 2, true));
        try {
            total(0, 2, false);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
          tests: [
            {
              out: `69,70
Los valores deben ser mayores que cero`
            }
          ],
          solucion: `public class App {
    static double total(int minutos, int equipos, boolean socio) {
        if (minutos <= 0 || equipos <= 0) {
            throw new IllegalArgumentException("Los valores deben ser mayores que cero");
        }
        int horas = (int) Math.ceil((double) minutos / 60);
        double base = horas * 8.0 * equipos;
        if (socio) {
            base = base * (1 - 0.10);
        }
        return base * (1 + 0.21);
    }

    public static void main(String[] args) {
        System.out.printf("%.2f%n", total(200, 2, true));
        try {
            total(0, 2, false);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
          pistas: ["Primero valida; después calcula horas, base, descuento e IVA."]
        }
      }
    },

    {
      id: "ut5-eventos",
      titulo: "Eventos y controladores",
      resumen: "Programación dirigida por eventos, oyentes con lambdas, la calculadora de alquiler y los adaptadores de ratón, teclado y ventana.",
      bloques: [
        {
          t: "texto",
          md: `Un programa de consola sigue un guion: lee, calcula, muestra, y vuelve a leer, **en el orden que decide él**. Una interfaz gráfica funciona al revés: el programa construye la ventana y **se queda esperando**. El usuario hace clic, escribe, cierra la ventana… y el programa **reacciona**. Es la **programación dirigida por eventos**.

Un **evento** es algo que ocurre y que el programa puede querer atender: un clic, una tecla, el cursor que se mueve, la ventana que se cierra. Tiene tres actores:
- La **fuente**: el componente donde ocurre (el botón donde se hizo clic).
- El **objeto evento**: con los detalles (qué botón, dónde, qué tecla).
- El **oyente** (*listener*) o **controlador**: el código que se ejecuta cuando ocurre. Lo escribes tú, y es lo que da vida a la ventana.

\`\`\`
Usuario hace clic -> Botón (fuente) -> ActionEvent (evento) -> Oyente (tu código)
\`\`\`
Por debajo, Swing mantiene un bucle que no termina nunca, el **bucle de eventos**, en un hilo propio (el *hilo de eventos*).`
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "**Inversión de control.** En consola, el programa llama al usuario (`nextLine`). En una GUI, es el *framework* quien llama al programa (tu oyente). Es una de las ideas centrales de la programación moderna: un manejador de clic en JavaScript (2.º) es lo mismo."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "**No bloquees la ventana.** El código de un controlador se ejecuta **en el hilo que dibuja la ventana**. Si tarda mucho (leer un fichero enorme, esperar a la red), la ventana se **congela**: no repinta ni atiende a nadie hasta que termine. Mantén los controladores cortos."
        },
        {
          t: "tabla",
          titulo: "Los eventos más usados",
          cab: ["Evento", "Oyente", "Método", "Cuándo ocurre"],
          filas: [
            [
              "`ActionEvent`",
              "`ActionListener`",
              "`actionPerformed`",
              "Clic en un botón; *Enter* en una caja de texto"
            ],
            [
              "`ItemEvent`",
              "`ItemListener`",
              "`itemStateChanged`",
              "Se marca una casilla o se elige otra opción de una lista"
            ],
            ["`MouseEvent`", "`MouseListener`", "`mouseClicked`, `mousePressed`…", "Acciones del ratón"],
            ["`KeyEvent`", "`KeyListener`", "`keyPressed`, `keyTyped`…", "Se pulsa una tecla"],
            ["`WindowEvent`", "`WindowListener`", "`windowClosing`…", "La ventana se abre, se cierra…"]
          ]
        },
        {
          t: "relacionar",
          p: "Relaciona cada situación con su evento.",
          pares: [
            ["Clic en un botón", "`ActionEvent`"],
            ["Pulsar una tecla en una caja de texto", "`KeyEvent`"],
            ["Hacer clic con el ratón en un panel", "`MouseEvent`"],
            ["Cerrar la ventana", "`WindowEvent`"]
          ],
          e: "Cada tipo de acción genera un tipo de evento distinto."
        },
        {
          t: "texto",
          md: `### Crear un controlador
Hay dos pasos: **escribir el oyente** y **registrarlo** en el componente con \`addXxxListener\`. La forma moderna usa una **expresión lambda**: «este bloque de código, para cuando ocurra el evento».
\`\`\`java
boton.addActionListener(e -> {
    System.out.println("Clic en el botón");
});
\`\`\`
\`e\` es el objeto evento; la flecha \`->\` separa el parámetro del código. Con una sola instrucción se pueden quitar las llaves: \`boton.addActionListener(e -> calcular());\`. Antes de Java 8 se escribía con una **clase anónima**, más larga, que verás en código antiguo y hace exactamente lo mismo:
\`\`\`java
boton.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("Clic en el botón");
    }
});
\`\`\``
        },
        {
          t: "codigo",
          titulo: "Contador.java: el primer controlador",
          code: `import javax.swing.*;
import java.awt.*;

public class Contador {
    private static int clics = 0;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame ventana = new JFrame("Contador");
            ventana.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

            JLabel etiqueta = new JLabel("Clics: 0", SwingConstants.CENTER);
            JButton boton = new JButton("Pulsa aquí");
            boton.addActionListener(e -> {
                clics++;
                etiqueta.setText("Clics: " + clics);
            });

            ventana.add(etiqueta, BorderLayout.CENTER);
            ventana.add(boton, BorderLayout.SOUTH);
            ventana.setSize(260, 140);
            ventana.setLocationRelativeTo(null);
            ventana.setVisible(true);
        });
    }
}`
        },
        {
          t: "texto",
          md: "La ventana se crea y se queda esperando; al pulsar el botón se ejecuta el oyente, que cambia el texto de la etiqueta con `setText`. Desde un oyente se puede modificar cualquier componente: `setText`, `getText`, `setEnabled(false)`…"
        },
        {
          t: "test",
          p: "En `boton.addActionListener(e -> calcular());`, ¿qué es `e`?",
          o: ["El botón", "El objeto evento (`ActionEvent`)", "El método `calcular`", "Una excepción"],
          c: 1,
          e: "El evento: lleva los detalles de lo ocurrido."
        },
        {
          t: "test",
          p: "Si creas el botón y escribes el oyente pero **no llamas a `addActionListener`**, al pulsar el botón…",
          o: ["Se ejecuta el oyente", "No pasa nada", "Falla la compilación", "Se cierra la ventana"],
          c: 1,
          e: "Hay que **registrar** el oyente en el componente."
        },
        {
          t: "texto",
          md: `### Un ejemplo completo: la calculadora de alquiler
Recoge los datos con cajas de texto y una casilla, calcula al pulsar el botón y **protege la entrada con las excepciones de la UT3**, avisando con un diálogo de error. Está escrita como una **clase que hereda de \`JFrame\`** (UT4): la ventana es un objeto con sus componentes como propiedades y su lógica en métodos.`
        },
        {
          t: "codigo",
          titulo: "VentanaAlquiler.java",
          code: `import javax.swing.*;
import java.awt.*;

public class VentanaAlquiler extends JFrame {
    private static final double TARIFA_HORA = 8.0;
    private static final double IVA = 0.21;
    private static final double DESCUENTO_SOCIO = 0.10;
    private static final int MINUTOS_HORA = 60;

    private final JTextField campoMinutos = new JTextField(8);
    private final JTextField campoEquipos = new JTextField(8);
    private final JCheckBox casillaSocio = new JCheckBox("Es socio (10 %)");
    private final JLabel resultado = new JLabel(" ");

    public VentanaAlquiler() {
        super("Calculadora de alquiler");
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        JPanel formulario = new JPanel(new GridLayout(0, 2, 8, 8));
        formulario.setBorder(BorderFactory.createEmptyBorder(12, 12, 6, 12));
        formulario.add(new JLabel("Minutos de uso:"));
        formulario.add(campoMinutos);
        formulario.add(new JLabel("Número de equipos:"));
        formulario.add(campoEquipos);
        formulario.add(casillaSocio);
        JButton botonCalcular = new JButton("Calcular");
        formulario.add(botonCalcular);

        resultado.setHorizontalAlignment(SwingConstants.CENTER);
        resultado.setBorder(BorderFactory.createEmptyBorder(6, 12, 12, 12));

        add(formulario, BorderLayout.CENTER);
        add(resultado, BorderLayout.SOUTH);

        botonCalcular.addActionListener(e -> calcular());
        pack();
        setLocationRelativeTo(null);
    }

    private void calcular() {
        try {
            int minutos = Integer.parseInt(campoMinutos.getText().strip());
            int equipos = Integer.parseInt(campoEquipos.getText().strip());
            if (minutos <= 0 || equipos <= 0) {
                throw new IllegalArgumentException("Los valores deben ser mayores que cero");
            }
            int horas = (int) Math.ceil((double) minutos / MINUTOS_HORA);
            double base = horas * TARIFA_HORA * equipos;
            if (casillaSocio.isSelected()) {
                base = base * (1 - DESCUENTO_SOCIO);
            }
            double total = base * (1 + IVA);
            resultado.setText(String.format("%d h cobradas. Total con IVA: %.2f euros", horas, total));
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Escribe números enteros válidos",
                    "Dato incorrecto", JOptionPane.ERROR_MESSAGE);
        } catch (IllegalArgumentException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(),
                    "Dato incorrecto", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new VentanaAlquiler().setVisible(true));
    }
}`
        },
        {
          t: "texto",
          md: `Fíjate en el diseño:
- Los componentes con los que se interactúa (\`campoMinutos\`, \`casillaSocio\`, \`resultado\`) son **propiedades**, porque los usa más de un método. El botón, que solo se usa en el constructor, es una variable local.
- El **constructor construye la interfaz** y registra los oyentes; el oyente solo **llama a un método** (\`calcular\`). El cálculo queda legible, no enterrado dentro de una lambda.
- Los números fijos son **constantes** (UT1): ningún valor mágico.
- \`NumberFormatException\` es subclase de \`IllegalArgumentException\`, por eso se captura **primero** (UT3).
- En \`main\` solo se crea y se muestra la ventana.`
        },
        {
          t: "test",
          p: "En `VentanaAlquiler`, ¿por qué `campoMinutos` es una propiedad y `botonCalcular` una variable local?",
          o: [
            "Porque Java lo exige",
            "Porque lo usan varios métodos, mientras que el botón solo se usa en el constructor",
            "Porque los botones no pueden ser propiedades",
            "Por rendimiento"
          ],
          c: 1,
          e: "Lo que se usa desde más de un método se guarda como propiedad."
        },
        {
          t: "test",
          p: "Si en `calcular` se invirtiera el orden de los `catch` (`IllegalArgumentException` antes que `NumberFormatException`)…",
          o: [
            "Funcionaría igual",
            "No compilaría: el segundo `catch` sería inalcanzable",
            "Se saltarían los diálogos",
            "Se ejecutarían los dos"
          ],
          c: 1,
          e: "`NumberFormatException` es subclase de la otra: el `catch` más general va **después**."
        },
        {
          t: "predecir",
          p: "Los números de la calculadora se pueden comprobar aparte de la ventana. ¿Qué muestra?",
          code: `public class Main {
    public static void main(String[] args) {
        int minutos = 200;
        int equipos = 2;
        int horas = (int) Math.ceil((double) minutos / 60);
        double base = horas * 8.0 * equipos * (1 - 0.10);
        System.out.println(horas + " h cobradas. Total con IVA: " + String.format("%.2f", base * 1.21) + " euros");
    }
}`,
          salida: "4 h cobradas. Total con IVA: 69,70 euros",
          e: "200 min → 4 h; 4 × 8 × 2 = 64 €; −10 % = 57,60; +21 % = 69,70."
        },
        {
          t: "texto",
          md: `### Otros eventos: ratón, teclado y ventana
Los oyentes de ratón, teclado y ventana tienen **varios métodos** y casi nunca se necesitan todos. Java ofrece clases **adaptadoras** (\`MouseAdapter\`, \`KeyAdapter\`, \`WindowAdapter\`) con todos los métodos ya escritos y vacíos: heredas de ellas y sobrescribes (\`@Override\`, UT4) solo el que te interesa.`
        },
        {
          t: "codigo",
          titulo: "EventosVarios.java",
          code: `import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class EventosVarios {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame ventana = new JFrame("Eventos");
            ventana.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);   // lo decidimos nosotros

            JLabel estado = new JLabel("Haz clic en el panel o escribe en la caja", SwingConstants.CENTER);
            JPanel panel = new JPanel();
            panel.setBackground(Color.LIGHT_GRAY);
            JTextField caja = new JTextField();

            panel.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    estado.setText("Clic en (" + e.getX() + ", " + e.getY() + ")");
                }
            });

            caja.addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent e) {
                    estado.setText("Tecla: " + KeyEvent.getKeyText(e.getKeyCode()));
                }
            });

            ventana.addWindowListener(new WindowAdapter() {
                @Override
                public void windowClosing(WindowEvent e) {
                    int r = JOptionPane.showConfirmDialog(ventana, "¿Cerrar la aplicación?",
                            "Salir", JOptionPane.YES_NO_OPTION);
                    if (r == JOptionPane.YES_OPTION) {
                        ventana.dispose();
                    }
                }
            });

            ventana.add(estado, BorderLayout.NORTH);
            ventana.add(panel, BorderLayout.CENTER);
            ventana.add(caja, BorderLayout.SOUTH);
            ventana.setSize(380, 260);
            ventana.setLocationRelativeTo(null);
            ventana.setVisible(true);
        });
    }
}`
        },
        {
          t: "texto",
          md: "Con `DO_NOTHING_ON_CLOSE`, el botón de cerrar **no cierra nada** por sí solo: es nuestro controlador de `windowClosing` el que pregunta y decide. Es el patrón de «¿guardar los cambios antes de salir?»."
        },
        {
          t: "ordenar",
          p: "Ordena los pasos para que un botón haga algo.",
          items: [
            "Crear el botón con `new JButton(\"Calcular\")`",
            "Escribir el código que debe ejecutarse (un método `calcular`)",
            "Registrar el oyente con `addActionListener(e -> calcular())`",
            "Mostrar la ventana",
            "El usuario hace clic y se ejecuta `calcular`"
          ],
          e: "Primero se prepara todo y se registra; después el usuario actúa y el programa reacciona."
        },
        {
          t: "huecos",
          p: "Completa el oyente que muestra un saludo.",
          codigo: `boton.{{addActionListener}}(e -> {
    etiqueta.{{setText}}("Hola, " + campo.{{getText}}());
});`,
          e: "Se registra con `addActionListener`; dentro, `getText` lee la caja y `setText` escribe en la etiqueta."
        },
        {
          t: "practica",
          titulo: "La ventana de bienvenida",
          p: "Escribe **VentanaBienvenida.java** en tu IDE (Swing no se ejecuta aquí): una ventana con una caja de texto para el nombre, un botón «Saludar» y una etiqueta. Al pulsar el botón **o** al pulsar *Enter* en la caja, la etiqueta muestra `Bienvenido a Náutica Bahía, <nombre>`. Si la caja está vacía, debe aparecer un diálogo de aviso en lugar del saludo.",
          pasos: [
            {
              t: "Dibuja el árbol",
              md: "En papel: un `JFrame` (`BorderLayout`) con un panel `FlowLayout` al norte (etiqueta, caja, botón) y la etiqueta del saludo al centro.",
              check: "Tienes el esquema antes de teclear."
            },
            {
              t: "Escribe la clase",
              md: "Hereda de `JFrame`. La caja y la etiqueta del saludo son **propiedades**; el constructor construye la interfaz y registra los oyentes.",
              code: `public class VentanaBienvenida extends JFrame {
    private final JTextField campoNombre = new JTextField(15);
    private final JLabel saludo = new JLabel(" ", SwingConstants.CENTER);`,
              check: "La ventana aparece y se cierra terminando el programa."
            },
            {
              t: "Un único método `saludar()`",
              md: "Lee con `getText().strip()`. Si está vacío, `JOptionPane.showMessageDialog` con `WARNING_MESSAGE`; si no, `saludo.setText(...)`.",
              check: "Con la caja vacía sale el aviso y no cambia el saludo.",
              pregunta: "¿Por qué conviene que el oyente solo llame a un método?"
            },
            {
              t: "Dos oyentes, un método",
              md: "Registra `boton.addActionListener(e -> saludar())` y `campoNombre.addActionListener(e -> saludar())`: la caja también genera `ActionEvent` con *Enter*.",
              check: "Funciona con el botón y con Enter."
            }
          ],
          entrega: "El fichero `.java` y dos capturas: el saludo y el aviso con la caja vacía."
        },
        {
          t: "abierta",
          p: "Explica con tus palabras la diferencia entre un programa de consola y uno con interfaz gráfica en cuanto a **quién dirige el programa**, e indica qué es un oyente.",
          modelo: "En un programa de consola, el programa decide el orden: pregunta, espera la respuesta, calcula y vuelve a preguntar; es él quien llama al usuario (por ejemplo con nextLine). En una interfaz gráfica, el programa construye la ventana y se queda esperando: es el usuario quien decide qué hacer (pulsar un botón, escribir, cerrar), y el programa reacciona. Un oyente (o controlador de eventos) es el código que escribimos y registramos en un componente (con addActionListener, por ejemplo) para que Swing lo ejecute cuando ocurra el evento correspondiente. A esto se le llama programación dirigida por eventos o inversión de control.",
          rubrica: [
            "Dice que en consola el programa dirige el orden",
            "Dice que en una GUI el usuario decide y el programa reacciona a eventos",
            "Define el oyente como el código que se ejecuta al ocurrir el evento y se registra en el componente"
          ],
          minPalabras: 50
        },
        {
          t: "profundizar",
          titulo: "¿Por qué conviene que el oyente solo llame a un método y no contenga toda la lógica?",
          bloques: [
            {
              t: "texto",
              md: "Porque una lambda larga mezcla **interfaz** y **lógica**: se lee mal, no se puede reutilizar (el mismo cálculo para el botón y para *Enter*) y no se puede probar sin abrir la ventana. Con un método `calcular()` separado, la lógica es normal y comprobable (incluso podría estar en otra clase, como `Fiscal` en la UT4), y la ventana solo se ocupa de leer cajas y mostrar resultados."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Esta separación (la ventana por un lado, la lógica por otro) tiene nombre: es la base de patrones como **MVC** (modelo-vista-controlador) que verás en los frameworks web. La clase `Producto` sería el modelo, la ventana la vista, y el oyente, el controlador.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos **los eventos**.",
        inicial: [
          {
            p: "¿Qué evento se genera al pulsar un botón?",
            o: ["`MouseEvent`", "`ActionEvent`", "`KeyEvent`", "`WindowEvent`"],
            c: 1,
            e: "`ActionEvent`."
          },
          {
            p: "¿Qué método registra un oyente en un botón?",
            o: ["`setListener`", "`addActionListener`", "`onClick`", "`listen`"],
            c: 1,
            e: "`addActionListener`."
          },
          {
            p: "¿Qué ocurre si un controlador tarda varios segundos?",
            o: ["Nada", "La ventana se congela", "Se ejecuta en paralelo", "Se cancela"],
            c: 1,
            e: "Se ejecuta en el hilo que dibuja la ventana."
          }
        ],
        pasos: [
          {
            titulo: "Programación dirigida por eventos",
            cubre: [0, 2],
            explica: "El programa construye la ventana y **espera**; el usuario actúa y Swing llama a tu **oyente**. Fuente (el componente), evento (los detalles) y oyente (tu código).",
            pregunta: {
              p: "¿Quién llama al oyente?",
              o: [
                "El programador desde `main`",
                "Swing, cuando ocurre el evento",
                "El usuario",
                "El compilador"
              ],
              c: 1,
              e: "Es la inversión de control: el *framework* llama a tu código."
            },
            extra: "Es como dejar tu número de teléfono en una tienda: no llamas tú cada día, te llaman cuando llega el pedido."
          },
          {
            titulo: "Crear controladores",
            cubre: [1],
            explica: "Se escribe el oyente (con una lambda `e -> ...`) y se **registra** con `addXxxListener`. El oyente debería limitarse a llamar a un método.",
            pregunta: {
              p: "¿Qué pasa si no se registra el oyente?",
              o: ["Se ejecuta igualmente", "No se ejecuta nunca", "No compila", "Se ejecuta una vez"],
              c: 1,
              e: "Sin `addXxxListener` el componente no avisa a nadie."
            },
            profundiza: "Las clases adaptadoras (`MouseAdapter`, `KeyAdapter`, `WindowAdapter`) evitan escribir todos los métodos de la interfaz cuando solo necesitas uno."
          }
        ],
        reto: {
          p: `**Reto final.** Los controladores de la calculadora llaman a métodos como este. Escribe \`formatear(int horas, double total)\`, que devuelve \`"4 h cobradas. Total con IVA: 69,70 euros"\` (con coma decimal). Muestra el resultado para 4 horas y 69.696 euros, y el de 1 hora y 9.68.
\`\`\`
4 h cobradas. Total con IVA: 69,70 euros
1 h cobradas. Total con IVA: 9,68 euros
\`\`\``,
          inicial: `public class App {
    static String formatear(int horas, double total) {
        return "";   // TODO
    }

    public static void main(String[] args) {
        System.out.println(formatear(4, 69.696));
        System.out.println(formatear(1, 9.68));
    }
}`,
          tests: [
            {
              out: `4 h cobradas. Total con IVA: 69,70 euros
1 h cobradas. Total con IVA: 9,68 euros`
            }
          ],
          solucion: `public class App {
    static String formatear(int horas, double total) {
        return String.format("%d h cobradas. Total con IVA: %.2f euros", horas, total);
    }

    public static void main(String[] args) {
        System.out.println(formatear(4, 69.696));
        System.out.println(formatear(1, 9.68));
    }
}`,
          pistas: ["`String.format(\"%d ... %.2f ...\", horas, total)`."]
        }
      }
    },

    {
      id: "ut5-integracion",
      titulo: "Todo junto: el gestor de productos",
      resumen: "Cierre de la unidad y del Reto 1: un menú, objetos `Producto` y un fichero CSV, con la técnica del fichero temporal para modificar.",
      bloques: [
        {
          t: "texto",
          md: `Para cerrar la unidad (y el Reto 1) reunimos todo: un programa que **gestiona los productos de Náutica Bahía y los guarda en un fichero**, con un menú (UT3), objetos con sus clases (UT4) y ficheros (UT5). Usa la clase \`Producto\` con el getter \`getCodigo()\` y los métodos \`aCsv\` y \`desdeCsv\` que ya conoces.

La parte delicada es **modificar un producto**, porque un fichero de texto **no se puede editar por dentro**. La técnica clásica:
1. Leer el original línea a línea.
2. Escribir una **copia en un fichero temporal** con el cambio hecho.
3. Al final, **reemplazar** el original por el temporal.`
        },
        {
          t: "ordenar",
          p: "Ordena la técnica para modificar un registro de un fichero de texto.",
          items: [
            "Abrir el original para leer y un temporal para escribir",
            "Leer cada línea, convertirla en `Producto` y aplicar el cambio al que coincide",
            "Escribir cada producto (cambiado o no) en el temporal",
            "Cerrar ambos ficheros",
            "Mover el temporal sobre el original con `REPLACE_EXISTING`"
          ],
          e: "Se copia con el cambio hecho y al final se sustituye el original."
        },
        {
          t: "codigo",
          titulo: "GestorProductos.java (junto a Producto y StockInsuficienteException)",
          code: `import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.Scanner;

public class GestorProductos {
    private static final Path FICHERO = Path.of("productos.csv");
    private static final Path TEMPORAL = Path.of("productos.tmp");

    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int opcion = -1;
        do {
            System.out.println();
            System.out.println("=== GESTOR DE PRODUCTOS ===");
            System.out.println("1. Añadir producto");
            System.out.println("2. Listar productos");
            System.out.println("3. Vender unidades");
            System.out.println("0. Salir");
            System.out.print("Opción: ");
            try {
                opcion = Integer.parseInt(teclado.nextLine().strip());
                switch (opcion) {
                    case 1 -> anadir(teclado);
                    case 2 -> listar();
                    case 3 -> vender(teclado);
                    case 0 -> System.out.println("Hasta pronto.");
                    default -> System.out.println("Opción no válida.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Escribe un número válido.");
                opcion = -1;
            } catch (IllegalArgumentException e) {
                System.out.println("Dato no válido: " + e.getMessage());
            } catch (IOException e) {
                System.err.println("Error de fichero: " + e.getMessage());
            }
        } while (opcion != 0);
        teclado.close();
    }

    private static void anadir(Scanner teclado) throws IOException {
        System.out.print("Código: ");
        String codigo = teclado.nextLine().strip();
        System.out.print("Nombre: ");
        String nombre = teclado.nextLine().strip();
        System.out.print("Precio: ");
        double precio = Double.parseDouble(teclado.nextLine().strip());
        System.out.print("Stock: ");
        int stock = Integer.parseInt(teclado.nextLine().strip());

        Producto p = new Producto(codigo, nombre, precio, stock);
        Files.writeString(FICHERO, p.aCsv() + "\\n", StandardCharsets.UTF_8,
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        System.out.println("Guardado: " + p);
    }

    private static void listar() throws IOException {
        if (!Files.exists(FICHERO)) {
            System.out.println("Todavía no hay productos.");
            return;
        }
        System.out.printf("%-10s%-24s%10s%8s%n", "Código", "Nombre", "Precio", "Stock");
        for (String linea : Files.readAllLines(FICHERO, StandardCharsets.UTF_8)) {
            Producto p = Producto.desdeCsv(linea);
            System.out.printf("%-10s%-24s%10.2f%8d%n",
                    p.getCodigo(), p.getNombre(), p.getPrecio(), p.getStock());
        }
    }

    private static void vender(Scanner teclado) throws IOException {
        System.out.print("Código del producto: ");
        String codigo = teclado.nextLine().strip();
        System.out.print("Unidades: ");
        int unidades = Integer.parseInt(teclado.nextLine().strip());

        boolean encontrado = false;
        try (BufferedReader lector = Files.newBufferedReader(FICHERO, StandardCharsets.UTF_8);
             PrintWriter salida = new PrintWriter(Files.newBufferedWriter(TEMPORAL, StandardCharsets.UTF_8))) {
            String linea;
            while ((linea = lector.readLine()) != null) {
                Producto p = Producto.desdeCsv(linea);
                if (p.getCodigo().equals(codigo)) {
                    p.vender(unidades);
                    encontrado = true;
                }
                salida.println(p.aCsv());
            }
        } catch (StockInsuficienteException e) {
            Files.deleteIfExists(TEMPORAL);
            System.out.println("Venta rechazada: " + e.getMessage());
            return;
        }

        if (encontrado) {
            Files.move(TEMPORAL, FICHERO, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("Venta registrada.");
        } else {
            Files.deleteIfExists(TEMPORAL);
            System.out.println("No existe el producto " + codigo);
        }
    }
}`
        },
        {
          t: "texto",
          md: `Fíjate en cómo se apoya en lo anterior:
- **UT3:** menú con \`do-while\` y \`switch\`, entrada leída con \`nextLine\` + \`parseInt\` y tres \`catch\` ordenados de más concreto a más general.
- **UT4:** \`Producto\` valida sus datos y sabe convertirse a CSV y desde CSV; el gestor no toca sus propiedades, usa sus métodos.
- **UT5:** \`try-with-resources\` con dos recursos, modo *añadir* (\`APPEND\`), \`Files.move\` con \`REPLACE_EXISTING\` y \`deleteIfExists\` para no dejar temporales si la venta se rechaza.`
        },
        {
          t: "test",
          p: "En `vender`, si el stock no alcanza, ¿qué ocurre con `productos.csv`?",
          o: ["Se pone a 0", "No se toca: se borra el temporal y se aborta", "Queda a medias", "Se borra"],
          c: 1,
          e: "La excepción se captura antes del `move`: el original queda intacto y se elimina el temporal."
        },
        {
          t: "test",
          p: "¿Por qué se escribe en un fichero temporal en lugar de modificar el original directamente?",
          o: [
            "Por velocidad",
            "Porque un fichero de texto no se puede editar por dentro y así no se pierde el original si algo falla",
            "Porque Java lo exige",
            "Para ahorrar memoria"
          ],
          c: 1,
          e: "Si falla a mitad, el original sigue intacto."
        },
        {
          t: "test",
          p: "¿Qué modo de apertura usa `anadir` para no borrar lo que ya hay?",
          o: ["Sobrescribir", "`StandardOpenOption.APPEND`", "Lectura", "No necesita ninguno"],
          c: 1,
          e: "`CREATE` + `APPEND`: crea el fichero si no existe y añade al final."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "**Prueba con datos desechables.** Este programa modifica `productos.csv`. Hazlo en una carpeta de pruebas y guarda una copia antes de empezar; una venta con un código mal escrito no debe corromper el fichero, pero es buena costumbre comprobarlo."
        },
        {
          t: "ejecuta",
          p: `**El mismo cambio, en memoria.** Sin ficheros, la lógica de «modificar una línea y copiar las demás» se prueba igual con una lista de líneas CSV. Completa \`vender(lineas, codigo, unidades)\`: devuelve una **lista nueva** en la que el producto con ese código tiene el stock reducido (los demás, sin cambios). Debe mostrar:
\`\`\`
KY-1;Kayak;249.9;2
CH-2;Chaleco;34.5;20
\`\`\``,
          inicial: `import java.util.ArrayList;
import java.util.List;

public class App {
    static List<String> vender(List<String> lineas, String codigo, int unidades) {
        List<String> nuevas = new ArrayList<>();
        // TODO: copiar cada línea, cambiando el stock de la que coincide
        return nuevas;
    }

    public static void main(String[] args) {
        List<String> lineas = new ArrayList<>();
        lineas.add("KY-1;Kayak;249.9;5");
        lineas.add("CH-2;Chaleco;34.5;20");
        for (String l : vender(lineas, "KY-1", 3)) {
            System.out.println(l);
        }
    }
}`,
          tests: [
            {
              out: `KY-1;Kayak;249.9;2
CH-2;Chaleco;34.5;20`
            }
          ],
          pistas: [
            "`linea.split(\";\")` da los cuatro campos; el stock es `campos[3]`.",
            "Añade a `nuevas` siempre una línea: la original o la modificada."
          ],
          solucion: `import java.util.ArrayList;
import java.util.List;

public class App {
    static List<String> vender(List<String> lineas, String codigo, int unidades) {
        List<String> nuevas = new ArrayList<>();
        for (String linea : lineas) {
            String[] campos = linea.split(";");
            if (campos[0].equals(codigo)) {
                int stock = Integer.parseInt(campos[3]) - unidades;
                linea = campos[0] + ";" + campos[1] + ";" + campos[2] + ";" + stock;
            }
            nuevas.add(linea);
        }
        return nuevas;
    }

    public static void main(String[] args) {
        List<String> lineas = new ArrayList<>();
        lineas.add("KY-1;Kayak;249.9;5");
        lineas.add("CH-2;Chaleco;34.5;20");
        for (String l : vender(lineas, "KY-1", 3)) {
            System.out.println(l);
        }
    }
}`
        },
        {
          t: "practica",
          titulo: "Amplía el gestor",
          p: "En tu IDE, parte de `GestorProductos` y amplíalo (ficheros reales, así que se hace fuera de esta app). Es el cierre del **Reto 1**.",
          pasos: [
            {
              t: "Opción «Reponer stock»",
              md: "Añade la opción 4: pide código y unidades y **suma** al stock con la técnica del fichero temporal. Reutiliza la estructura de `vender`.",
              check: "Tras reponer, `listar` muestra el stock nuevo.",
              pregunta: "¿Qué parte del código de `vender` puedes extraer a un método para no repetirla?"
            },
            {
              t: "Opción «Buscar por nombre»",
              md: "Pide un texto y lista los productos cuyo nombre lo **contiene**, sin distinguir mayúsculas (`toLowerCase().contains(...)`).",
              check: "Buscar `kay` encuentra `Kayak Bahía 2`."
            },
            {
              t: "Copia de seguridad al salir",
              md: "Al elegir 0, copia `productos.csv` a una carpeta `copias/` con la fecha en el nombre (`Files.createDirectories` y `Files.copy`).",
              check: "Aparece `copias/productos_AAAA-MM-DD.csv`."
            },
            {
              t: "Pruebas con errores",
              md: "Prueba: código inexistente, precio con letras, stock mayor que el disponible, fichero borrado antes de listar. Ninguno debe hacer fallar el programa.",
              check: "En todos los casos sale un mensaje claro y el menú sigue."
            }
          ],
          entrega: "El código final y una tabla con las pruebas de errores y el resultado de cada una."
        },
        {
          t: "abierta",
          p: "Explica por qué `vender` escribe en un fichero temporal y al final lo **mueve** sobre el original, en lugar de modificar `productos.csv` directamente. ¿Qué pasa si la venta se rechaza?",
          modelo: "Un fichero de texto no se puede editar por dentro: no se puede cambiar una línea sin reescribir lo que viene detrás. Por eso se lee el original línea a línea y se escribe una copia en un fichero temporal con el cambio hecho. Solo cuando todo ha ido bien se mueve el temporal sobre el original con REPLACE_EXISTING. Así, si algo falla a mitad (por ejemplo, por falta de stock se lanza StockInsuficienteException), el original no se ha tocado y solo hay que borrar el temporal con deleteIfExists; no se pierden datos ni queda un fichero a medias.",
          rubrica: [
            "Dice que un fichero de texto no se edita por dentro y hay que reescribirlo",
            "Explica que el original se mantiene intacto si algo falla",
            "Indica que si la venta se rechaza se borra el temporal y no se cambia nada"
          ],
          minPalabras: 50
        },
        {
          t: "profundizar",
          titulo: "¿Cuándo dejaría de ser buena idea usar un CSV como «base de datos»?",
          bloques: [
            {
              t: "texto",
              md: "Cuando hay **muchos** registros (cada modificación reescribe el fichero entero), cuando varios usuarios o programas lo modifican **a la vez** (pueden pisarse), o cuando necesitas buscar y relacionar datos («todas las ventas del cliente X de este mes»). Ahí entran las **bases de datos** (UT9): guardan, buscan y modifican registros sin reescribir todo, y controlan el acceso simultáneo."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Aunque funcione, `GestorProductos` mezcla menú, lógica y ficheros en una clase. Un diseño mejor tiene una clase `RepositorioProductos` que se ocupa **solo** del fichero (`guardar`, `listar`, `buscar`) y deja el menú sin saber que existe un CSV. Cambiar a una base de datos después sería cambiar solo esa clase.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Cerramos la unidad con **el gestor de productos**.",
        inicial: [
          {
            p: "¿Por qué se usa un fichero temporal para modificar?",
            o: [
              "Por velocidad",
              "Un fichero de texto no se edita por dentro y así el original no se pierde si algo falla",
              "Es obligatorio en Java",
              "Para ahorrar disco"
            ],
            c: 1,
            e: "Si algo falla, el original está intacto."
          },
          {
            p: "¿Qué opción añade al final sin borrar lo anterior?",
            o: ["`TRUNCATE_EXISTING`", "`APPEND`", "`READ`", "`DELETE_ON_CLOSE`"],
            c: 1,
            e: "`APPEND`."
          },
          {
            p: "¿Qué clase sabe convertir un producto a CSV?",
            o: ["El menú", "`Producto`", "`Scanner`", "`Files`"],
            c: 1,
            e: "Cada clase se ocupa de sus datos: `Producto` tiene `aCsv` y `desdeCsv`."
          }
        ],
        pasos: [
          {
            titulo: "Las piezas",
            cubre: [2],
            explica: "Menú (UT3) + objetos `Producto` (UT4) + fichero CSV (UT5). `Producto` sabe leer y escribir su línea; el gestor decide qué hacer.",
            pregunta: {
              p: "¿Dónde debe estar el código que convierte un `Producto` en una línea CSV?",
              o: ["En el menú", "En `Producto`", "En `Files`", "En `main`"],
              c: 1,
              e: "En la clase que conoce sus datos."
            },
            extra: "Es como una cadena de montaje: el menú pide, `Producto` sabe cómo es su línea y `Files` la guarda."
          },
          {
            titulo: "Modificar con temporal",
            cubre: [0, 1],
            explica: "Lees el original, escribes la copia con el cambio, y al final **mueves** el temporal sobre el original. Si la venta se rechaza, borras el temporal y no pasa nada.",
            ejemplo: {
              code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> lineas = new ArrayList<>();
        lineas.add("KY-1;Kayak;249.9;5");
        lineas.add("CH-2;Chaleco;34.5;20");
        List<String> nuevas = new ArrayList<>();
        for (String l : lineas) {
            String[] c = l.split(";");
            if (c[0].equals("KY-1")) {
                l = c[0] + ";" + c[1] + ";" + c[2] + ";" + (Integer.parseInt(c[3]) - 3);
            }
            nuevas.add(l);
        }
        System.out.println(nuevas);
    }
}`,
              ejecutable: true,
              titulo: "Lo mismo, en memoria"
            },
            pregunta: {
              p: "Si la venta se rechaza por falta de stock, el original…",
              o: ["Queda a medias", "No cambia", "Se borra", "Se vacía"],
              c: 1,
              e: "El `move` solo se hace si todo ha ido bien."
            }
          }
        ],
        reto: {
          p: `**Reto final.** Escribe \`buscar(List<String> lineas, String texto)\`: devuelve las líneas CSV cuyo **nombre** (segundo campo) contiene el texto sin distinguir mayúsculas. Busca \`ka\` en dos líneas:
\`\`\`
KY-1;Kayak;249.9;5
\`\`\``,
          inicial: `import java.util.ArrayList;
import java.util.List;

public class App {
    static List<String> buscar(List<String> lineas, String texto) {
        List<String> resultado = new ArrayList<>();
        // TODO
        return resultado;
    }

    public static void main(String[] args) {
        List<String> lineas = new ArrayList<>();
        lineas.add("KY-1;Kayak;249.9;5");
        lineas.add("CH-2;Chaleco;34.5;20");
        for (String l : buscar(lineas, "ka")) {
            System.out.println(l);
        }
    }
}`,
          tests: [
            { out: "KY-1;Kayak;249.9;5" }
          ],
          solucion: `import java.util.ArrayList;
import java.util.List;

public class App {
    static List<String> buscar(List<String> lineas, String texto) {
        List<String> resultado = new ArrayList<>();
        for (String linea : lineas) {
            String nombre = linea.split(";")[1];
            if (nombre.toLowerCase().contains(texto.toLowerCase())) {
                resultado.add(linea);
            }
        }
        return resultado;
    }

    public static void main(String[] args) {
        List<String> lineas = new ArrayList<>();
        lineas.add("KY-1;Kayak;249.9;5");
        lineas.add("CH-2;Chaleco;34.5;20");
        for (String l : buscar(lineas, "ka")) {
            System.out.println(l);
        }
    }
}`,
          pistas: ["Pasa a minúsculas los dos textos antes de `contains`."]
        }
      }
    }

  ],

  /* ============ BANCO DE PREGUNTAS PARA LA AUTOEVALUACIÓN (+1 / −1/3 / 0) ============ */
  banco: [
    {
      sec: "ut5-flujos",
      p: "¿Qué ocurre con los datos de un programa que solo usa variables cuando el programa termina?",
      o: ["Se guardan solos", "Se pierden", "Se guardan en la nube", "Se pasan a otro programa"],
      c: 1,
      e: "Viven en la memoria RAM, que se libera al terminar."
    },
    {
      sec: "ut5-flujos",
      p: "¿Qué es un flujo (*stream*) en Java?",
      o: [
        "Un tipo de variable",
        "Un canal por el que viajan datos hacia o desde el exterior",
        "Un bucle",
        "Una excepción"
      ],
      c: 1,
      e: "Es una secuencia de datos que se lee o se escribe."
    },
    {
      sec: "ut5-flujos",
      p: "¿Qué trabaja con bytes?",
      o: ["`FileReader`", "`FileInputStream`", "`BufferedReader`", "`PrintWriter`"],
      c: 1,
      e: "Las clases `...Stream` trabajan con bytes; `...Reader`/`...Writer`, con caracteres."
    },
    {
      sec: "ut5-flujos",
      p: "¿Qué clases se usan para leer **texto**?",
      o: ["`InputStream`", "`Reader`", "`DataInputStream`", "`ObjectInputStream`"],
      c: 1,
      e: "Los `Reader` trabajan con caracteres."
    },
    {
      sec: "ut5-flujos",
      p: "¿Qué flujo usa `System.out`?",
      o: ["De entrada de bytes", "De salida", "De entrada de caracteres", "Ninguno"],
      c: 1,
      e: "Es un flujo de salida hacia la pantalla."
    },
    {
      sec: "ut5-flujos",
      p: "¿Qué flujo usa `System.in`?",
      o: ["De salida", "De entrada de bytes desde el teclado", "De ficheros", "De red"],
      c: 1,
      e: "Por eso `Scanner` lo envuelve para leer cómodamente."
    },
    {
      sec: "ut5-flujos",
      p: "Abrir un fichero que no existe para leerlo lanza…",
      o: ["`ArithmeticException`", "`FileNotFoundException`", "`NullPointerException`", "Ninguna"],
      c: 1,
      e: "Es una subclase de `IOException`."
    },
    {
      sec: "ut5-flujos",
      p: "¿Por qué las excepciones de E/S son *checked*?",
      o: [
        "Por error de diseño",
        "Porque el exterior puede fallar sin que sea culpa del programador",
        "Porque son lentas",
        "Porque no se pueden capturar"
      ],
      c: 1,
      e: "Obligan a tratar algo que puede ocurrir aunque el código esté bien."
    },
    {
      sec: "ut5-flujos",
      p: "¿Qué relación hay entre `FileNotFoundException` e `IOException`?",
      o: ["Ninguna", "`FileNotFoundException` es subclase de `IOException`", "Al revés", "Son iguales"],
      c: 1,
      e: "Se captura primero la más concreta."
    },
    {
      sec: "ut5-flujos",
      p: "¿Qué ventaja tiene `try-with-resources`?",
      o: [
        "Es más rápido",
        "Cierra los recursos automáticamente",
        "Evita todas las excepciones",
        "Permite abrir más ficheros"
      ],
      c: 1,
      e: "Cierra al salir del bloque, aunque haya error."
    },
    {
      sec: "ut5-flujos",
      p: "¿Qué pasa si no cierras un fichero de escritura?",
      o: ["Nada", "Puede perder datos y dejarlo bloqueado", "Se borra", "Se duplica"],
      c: 1,
      e: "Los datos pueden quedarse en el búfer sin escribirse."
    },
    {
      sec: "ut5-flujos",
      p: "Para tratar una imagen o un `.pdf` se usan flujos de…",
      o: ["Caracteres", "Bytes", "Texto", "Ninguno"],
      c: 1,
      e: "No son texto: hay que leer los bytes tal cual.",
      nivel: "pro"
    },
    {
      sec: "ut5-flujos",
      p: "¿Cuál es la ventaja de envolver un `FileReader` en un `BufferedReader`?",
      o: ["Lee binarios", "Lee línea a línea y más rápido gracias al búfer", "Evita excepciones", "Cierra solo"],
      c: 1,
      e: "Permite `readLine()` y reduce los accesos al disco."
    },
    {
      sec: "ut5-registros",
      p: "¿Qué es un registro en un fichero de datos?",
      o: ["Un error", "Un conjunto de campos que describen una entidad", "Un tipo de excepción", "Un fichero"],
      c: 1,
      e: "Por ejemplo, un producto con código, nombre, precio y stock."
    },
    {
      sec: "ut5-registros",
      p: "¿Qué es un campo?",
      o: ["Un dato concreto de un registro", "Un fichero", "Una línea", "Una carpeta"],
      c: 0,
      e: "Código, nombre, precio… son campos."
    },
    {
      sec: "ut5-registros",
      p: "En un CSV de Náutica Bahía, ¿qué suele ser cada línea?",
      o: ["Un campo", "Un registro", "Un fichero", "Un flujo"],
      c: 1,
      e: "Una línea por registro, campos separados por `;`."
    },
    {
      sec: "ut5-registros",
      p: "¿Por qué se usa `;` en lugar de `,` como separador en España?",
      o: [
        "Por capricho",
        "Porque la coma decimal puede aparecer en los números",
        "Porque Java lo exige",
        "Para ahorrar espacio"
      ],
      c: 1,
      e: "Evita confundir la coma decimal con el separador."
    },
    {
      sec: "ut5-registros",
      p: "¿Qué hace `linea.split(\";\")`?",
      o: ["Une cadenas", "Divide la línea en un array de campos", "Borra los `;`", "Cuenta los `;`"],
      c: 1,
      e: "Devuelve un `String[]`."
    },
    {
      sec: "ut5-registros",
      p: "Con `\"KY-1;Kayak;249.9;5\".split(\";\")`, ¿cuánto vale `campos.length`?",
      o: ["3", "4", "5", "1"],
      c: 1,
      e: "Cuatro campos."
    },
    {
      sec: "ut5-registros",
      p: "¿Qué conversión falla con `NumberFormatException`?",
      o: ["`\"12\"` a `int`", "`\"abc\"` a `int`", "`\"3.5\"` a `double`", "`\"7\"` a `double`"],
      c: 1,
      e: "El texto no representa un número."
    },
    {
      sec: "ut5-registros",
      p: "¿Por qué conviene comprobar `campos.length` antes de usar los campos?",
      o: [
        "Por estética",
        "Para evitar `ArrayIndexOutOfBoundsException` con líneas incompletas",
        "Porque split lo exige",
        "No conviene"
      ],
      c: 1,
      e: "Una línea mal formada tendría menos campos."
    },
    {
      sec: "ut5-registros",
      p: "¿Qué ventaja tiene un fichero de texto frente a uno binario?",
      o: [
        "Es más compacto",
        "Se puede leer y arreglar con cualquier editor",
        "Es más rápido siempre",
        "Es más seguro"
      ],
      c: 1,
      e: "Es legible y portable; el binario es más compacto."
    },
    {
      sec: "ut5-registros",
      p: "Un fichero CSV con precios `249.9` escritos con `Locale.US` y leídos con `Double.parseDouble`…",
      o: ["Falla siempre", "Funciona en cualquier equipo", "Depende del Locale", "Lanza `IOException`"],
      c: 1,
      e: "`parseDouble` espera siempre el punto decimal."
    },
    {
      sec: "ut5-registros",
      p: "¿Qué sentido tiene que `Producto` tenga `aCsv()` y `desdeCsv()`?",
      o: [
        "Ninguno",
        "Que la propia clase sabe convertirse a línea y viceversa",
        "Evitar el constructor",
        "Ahorrar memoria"
      ],
      c: 1,
      e: "Cada clase se ocupa de su propio formato."
    },
    {
      sec: "ut5-registros",
      p: "Si un nombre contiene `;`, el formato CSV simple…",
      o: ["Funciona", "Se rompe: habría más campos", "Lo ignora", "Lo escapa solo"],
      c: 1,
      e: "Los CSV reales usan comillas o escapes.",
      nivel: "pro"
    },
    {
      sec: "ut5-texto",
      p: "¿Qué clase conviene para escribir texto cómodamente con `println` en un fichero?",
      o: ["`FileInputStream`", "`PrintWriter`", "`Scanner`", "`RandomAccessFile`"],
      c: 1,
      e: "`PrintWriter` tiene `println` y `printf`."
    },
    {
      sec: "ut5-texto",
      p: "¿Qué hace el tercer argumento `true` de `new FileWriter(\"a.txt\", true)`?",
      o: ["Cierra el fichero", "Añade al final en lugar de sobrescribir", "Lo hace de solo lectura", "Lo cifra"],
      c: 1,
      e: "Modo *append*."
    },
    {
      sec: "ut5-texto",
      p: "Si abres un `FileWriter` **sin** `true` en un fichero que ya existe…",
      o: ["Se añade al final", "Se vacía y se empieza de cero", "Falla", "Se crea otro"],
      c: 1,
      e: "Por defecto sobrescribe."
    },
    {
      sec: "ut5-texto",
      p: "¿Qué devuelve `readLine()` cuando no quedan líneas?",
      o: ["Cadena vacía", "`null`", "`-1`", "Lanza excepción"],
      c: 1,
      e: "`null` marca el final."
    },
    {
      sec: "ut5-texto",
      p: "¿Qué patrón lee un fichero entero línea a línea?",
      o: [
        "`while ((linea = lector.readLine()) != null)`",
        "`for (;;) lector.read()`",
        "`do { } while (true)`",
        "`lector.readAll()`"
      ],
      c: 0,
      e: "Se asigna y se compara con `null` en la condición."
    },
    {
      sec: "ut5-texto",
      p: "¿Qué `catch` va primero?",
      o: ["`IOException`", "`FileNotFoundException`", "Da igual", "Ninguno"],
      c: 1,
      e: "Primero la subclase, después la superclase."
    },
    {
      sec: "ut5-texto",
      p: "¿Qué codificación conviene indicar al leer y escribir texto?",
      o: ["La del sistema", "`StandardCharsets.UTF_8`", "ASCII", "Ninguna"],
      c: 1,
      e: "Evita que las tildes cambien de un equipo a otro."
    },
    {
      sec: "ut5-texto",
      p: "¿Qué problema evita indicar `UTF_8`?",
      o: [
        "Falta de memoria",
        "Que `á` o `ñ` se vean como símbolos raros",
        "Fichero no encontrado",
        "Cierres olvidados"
      ],
      c: 1,
      e: "La codificación por defecto depende del sistema."
    },
    {
      sec: "ut5-texto",
      p: "¿Qué hace `Files.readAllLines(ruta)`?",
      o: [
        "Lee solo la primera línea",
        "Devuelve todas las líneas en una lista",
        "Borra el fichero",
        "Cuenta caracteres"
      ],
      c: 1,
      e: "Carga todo el fichero en una `List<String>`."
    },
    {
      sec: "ut5-texto",
      p: "¿Cuándo no conviene `readAllLines`?",
      o: [
        "Con ficheros pequeños",
        "Con ficheros enormes, porque los carga enteros en memoria",
        "Nunca",
        "Con CSV"
      ],
      c: 1,
      e: "Para ficheros grandes es mejor leer línea a línea."
    },
    {
      sec: "ut5-texto",
      p: "Con `try (BufferedReader l = ...)`, ¿cuándo se cierra `l`?",
      o: [
        "Nunca",
        "Al terminar el bloque `try`, aunque haya error",
        "Al llamar a `main`",
        "Al final del programa"
      ],
      c: 1,
      e: "Eso es `try-with-resources`."
    },
    {
      sec: "ut5-texto",
      p: "¿Qué método de `Files` escribe todo un texto de una vez?",
      o: ["`Files.writeString`", "`Files.print`", "`Files.save`", "`Files.put`"],
      c: 0,
      e: "`Files.writeString(ruta, texto)`."
    },
    {
      sec: "ut5-texto",
      p: "Para añadir con `Files.writeString` sin borrar lo anterior hay que pasar…",
      o: ["`StandardOpenOption.APPEND`", "`true`", "`\"a\"`", "Nada"],
      c: 0,
      e: "Junto con `CREATE` para crear si no existe."
    },
    {
      sec: "ut5-binarios",
      p: "¿Cuántos bytes ocupa siempre un `int` con `writeInt`?",
      o: ["2", "4", "8", "Depende"],
      c: 1,
      e: "4 bytes."
    },
    {
      sec: "ut5-binarios",
      p: "¿Y un `double` con `writeDouble`?",
      o: ["4", "8", "16", "Depende"],
      c: 1,
      e: "8 bytes."
    },
    {
      sec: "ut5-binarios",
      p: "Si escribes `writeUTF`, `writeInt`, `writeDouble`, debes leer…",
      o: ["En cualquier orden", "En el mismo orden", "Al revés", "Solo el primero"],
      c: 1,
      e: "El fichero no tiene separadores."
    },
    {
      sec: "ut5-binarios",
      p: "¿Qué indica `available()` en un `DataInputStream`?",
      o: ["El tamaño del disco", "Los bytes que quedan por leer", "Si hay permisos", "El número de registros"],
      c: 1,
      e: "Cuando llega a 0, se acabó el fichero."
    },
    {
      sec: "ut5-binarios",
      p: "¿Qué permite `RandomAccessFile` que no permiten los flujos normales?",
      o: ["Leer texto", "Saltar a una posición con `seek`", "Cifrar", "Comprimir"],
      c: 1,
      e: "Acceso directo sin recorrer lo anterior."
    },
    {
      sec: "ut5-binarios",
      p: "Registros de 16 bytes: el registro 3 (desde 0) empieza en…",
      o: ["3", "16", "48", "64"],
      c: 2,
      e: "3 × 16 = 48."
    },
    {
      sec: "ut5-binarios",
      p: "¿Para qué sirve el modo `\"rw\"`?",
      o: ["Solo leer", "Leer y escribir (crea el fichero si no existe)", "Solo escribir", "Borrar"],
      c: 1,
      e: "`\"r\"` es solo lectura."
    },
    {
      sec: "ut5-binarios",
      p: "¿Por qué el acceso aleatorio exige registros de longitud fija?",
      o: ["Por estética", "Para poder calcular la posición de cada uno", "Por seguridad", "Porque lo pide Java"],
      c: 1,
      e: "posición = n × tamaño."
    },
    {
      sec: "ut5-binarios",
      p: "Para guardar un nombre en un fichero de registros fijos hay que…",
      o: [
        "Guardar solo el principio",
        "Reservarle una longitud fija y rellenar o recortar",
        "Usar `double`",
        "No se puede"
      ],
      c: 1,
      e: "Por ejemplo, 30 caracteres con relleno de espacios."
    },
    {
      sec: "ut5-binarios",
      p: "Para guardar un objeto entero con `ObjectOutputStream` su clase debe…",
      o: ["Ser `static`", "Implementar `Serializable`", "Ser abstracta", "Tener un `main`"],
      c: 1,
      e: "Es la marca que permite serializar."
    },
    {
      sec: "ut5-binarios",
      p: "¿Qué ocurre con una propiedad `transient` al serializar?",
      o: ["Se guarda cifrada", "No se guarda", "Se guarda dos veces", "Da error"],
      c: 1,
      e: "Al leer vale su valor por defecto."
    },
    {
      sec: "ut5-binarios",
      p: "¿Por qué es peligroso leer con `ObjectInputStream` un fichero de origen desconocido?",
      o: ["Es lento", "Puede ejecutar código malicioso", "Siempre falla", "No es peligroso"],
      c: 1,
      e: "La deserialización de datos no confiables es una vulnerabilidad clásica.",
      nivel: "pro"
    },
    {
      sec: "ut5-binarios",
      p: "Quieres modificar el stock del producto nº 5000 sin leer los demás. Eliges…",
      o: ["CSV", "`RandomAccessFile`", "`Scanner`", "Serialización"],
      c: 1,
      e: "Acceso directo con registros fijos."
    },
    {
      sec: "ut5-binarios",
      p: "¿Qué formato es mejor para intercambiar datos con otros lenguajes?",
      o: ["Serialización de Java", "Texto abierto (CSV, JSON)", "`Data` binario", "Ninguno"],
      c: 1,
      e: "La serialización de Java solo la entiende Java."
    },
    {
      sec: "ut5-sistema",
      p: "¿Qué ruta es absoluta?",
      o: ["`datos/a.txt`", "`/home/ana/a.txt`", "`a.txt`", "`../a.txt`"],
      c: 1,
      e: "Empieza en la raíz."
    },
    {
      sec: "ut5-sistema",
      p: "Una ruta relativa se cuenta desde…",
      o: ["La raíz del disco", "El directorio de trabajo del programa", "El escritorio", "El JDK"],
      c: 1,
      e: "Normalmente, la carpeta del proyecto en el IDE."
    },
    {
      sec: "ut5-sistema",
      p: "¿Qué hace `System.getProperty(\"user.dir\")`?",
      o: ["Devuelve el usuario", "Devuelve el directorio de trabajo", "Devuelve el JDK", "Crea una carpeta"],
      c: 1,
      e: "Muestra desde dónde se ejecuta el programa."
    },
    {
      sec: "ut5-sistema",
      p: "¿Por qué no conviene escribir el separador (`\\` o `/`) a mano?",
      o: ["Es ilegal", "Cambia según el sistema; mejor `Path.of(...)`", "Es más lento", "No funciona"],
      c: 1,
      e: "`Path.of(\"datos\", \"a.csv\")` pone el separador correcto."
    },
    {
      sec: "ut5-sistema",
      p: "¿Cómo se comprueba si existe una ruta con `File`?",
      o: ["`f.exists()`", "`f.has()`", "`f.found()`", "`f.is()`"],
      c: 0,
      e: "`exists()`."
    },
    {
      sec: "ut5-sistema",
      p: "Con `File`, los errores se notifican con…",
      o: ["Excepciones", "Un `boolean`", "`null` siempre", "Un mensaje"],
      c: 1,
      e: "Por eso no se sabe por qué falló."
    },
    {
      sec: "ut5-sistema",
      p: "Con `Files`, un fallo al borrar…",
      o: ["Devuelve `false`", "Lanza una excepción que explica la causa", "Se ignora", "Cierra el programa"],
      c: 1,
      e: "Por ejemplo, `NoSuchFileException`."
    },
    {
      sec: "ut5-sistema",
      p: "¿Qué devuelve `carpeta.listFiles()` si la ruta no existe?",
      o: ["Array vacío", "`null`", "Excepción", "`0`"],
      c: 1,
      e: "Hay que comprobarlo antes de recorrer."
    },
    {
      sec: "ut5-sistema",
      p: "¿Qué método crea una carpeta y las intermedias?",
      o: ["`mkdir`", "`mkdirs`", "`createNewFile`", "`renameTo`"],
      c: 1,
      e: "`mkdirs()`."
    },
    {
      sec: "ut5-sistema",
      p: "`new File(\"a/b/c\").mkdir()` con `a` inexistente…",
      o: ["Crea las tres", "Devuelve `false` y no crea nada", "Lanza excepción", "Crea solo `c`"],
      c: 1,
      e: "`mkdir` necesita que el padre exista."
    },
    {
      sec: "ut5-sistema",
      p: "¿`File.delete()` borra una carpeta con ficheros dentro?",
      o: ["Sí", "No, solo carpetas vacías", "Solo en Windows", "Solo con permisos"],
      c: 1,
      e: "Primero hay que borrar el contenido."
    },
    {
      sec: "ut5-sistema",
      p: "Los ficheros borrados desde un programa Java…",
      o: ["Van a la papelera", "No van a la papelera: se pierden", "Se pueden deshacer", "Se mueven a /tmp"],
      c: 1,
      e: "Prueba siempre en una carpeta de pruebas."
    },
    {
      sec: "ut5-sistema",
      p: "¿Qué opción permite sobrescribir al copiar con `Files.copy`?",
      o: ["`REPLACE_EXISTING`", "`OVERWRITE`", "`FORCE`", "`true`"],
      c: 0,
      e: "Sin ella, si existe el destino lanza `FileAlreadyExistsException`."
    },
    {
      sec: "ut5-sistema",
      p: "`Files.deleteIfExists(ruta)` cuando la ruta no existe…",
      o: ["Lanza excepción", "Devuelve `false`, sin quejarse", "Crea el fichero", "Devuelve `true`"],
      c: 1,
      e: "Borra solo si existe."
    },
    {
      sec: "ut5-sistema",
      p: "¿Qué excepción se lanza al borrar con `Files.delete` una carpeta con contenido?",
      o: [
        "`NoSuchFileException`",
        "`DirectoryNotEmptyException`",
        "`FileAlreadyExistsException`",
        "`ArithmeticException`"
      ],
      c: 1,
      e: "Es subclase de `IOException`."
    },
    {
      sec: "ut5-sistema",
      p: "Construir una ruta con texto del usuario sin comprobarla puede permitir salir de la carpeta (por ejemplo con `../`). ¿Cómo se llama?",
      o: ["*Path traversal*", "Overflow", "Inyección SQL", "Deadlock"],
      c: 0,
      e: "Normaliza y comprueba que sigue dentro de la carpeta permitida.",
      nivel: "pro"
    },
    {
      sec: "ut5-sistema",
      p: `¿Qué muestra?
\`\`\`
public class Main {
    public static void main(String[] args) {
        String f = "informe.final.txt";
        int punto = f.lastIndexOf('.');
        System.out.println(f.substring(0, punto));
        System.out.println(f.substring(punto + 1));
    }
}
\`\`\``,
      o: ["`informe / final.txt`", "`informe.final / txt`", "`informe.final.txt / `", "`informe / txt`"],
      c: 1,
      e: "`lastIndexOf` busca el **último** punto.",
      salida: `informe.final
txt`
    },
    {
      sec: "ut5-formatos",
      p: "¿Qué hace `%d` en `printf`?",
      o: ["Un decimal", "Un entero", "Un texto", "Un salto de línea"],
      c: 1,
      e: "`%d` es entero; `%f`, decimal; `%s`, texto."
    },
    {
      sec: "ut5-formatos",
      p: "¿Qué hace `%.2f`?",
      o: ["Dos enteros", "Un decimal con 2 decimales", "Dos columnas", "Un redondeo a 2 cifras"],
      c: 1,
      e: "Muestra el decimal con dos decimales."
    },
    {
      sec: "ut5-formatos",
      p: "`%-10s` produce un texto…",
      o: [
        "A la derecha en 10 columnas",
        "A la izquierda en 10 columnas",
        "De 10 caracteres exactos",
        "Con 10 decimales"
      ],
      c: 1,
      e: "El `-` alinea a la izquierda."
    },
    {
      sec: "ut5-formatos",
      p: "`%08d` con `42` muestra…",
      o: ["`42`", "`00000042`", "`42000000`", "`      42`"],
      c: 1,
      e: "Relleno con ceros hasta 8 columnas."
    },
    {
      sec: "ut5-formatos",
      p: "¿Qué marcador da un salto de línea portable?",
      o: ["`\\n`", "`%n`", "`%l`", "`%r`"],
      c: 1,
      e: "`%n` usa el salto de cada sistema."
    },
    {
      sec: "ut5-formatos",
      p: "¿Qué ocurre con `printf(\"%d\", 3.5)`?",
      o: ["Muestra 3", "Lanza `IllegalFormatConversionException` al ejecutar", "No compila", "Muestra 3,5"],
      c: 1,
      e: "El compilador no lo detecta."
    },
    {
      sec: "ut5-formatos",
      p: "¿Qué diferencia hay entre `printf` y `String.format`?",
      o: [
        "Ninguna",
        "`printf` muestra; `String.format` devuelve el texto",
        "Al revés",
        "`printf` solo admite enteros"
      ],
      c: 1,
      e: "Misma cadena de formato; uno imprime y el otro devuelve."
    },
    {
      sec: "ut5-formatos",
      p: "¿Qué `Locale` conviene al escribir un fichero que leerá otro programa?",
      o: ["El del equipo", "`Locale.US`", "Ninguno", "El de Francia"],
      c: 1,
      e: "Fija el punto decimal, igual en cualquier equipo."
    },
    {
      sec: "ut5-formatos",
      p: "`teclado.useLocale(Locale.US)` sirve para que `nextDouble()`…",
      o: [
        "Lea enteros",
        "Acepte el punto decimal en cualquier equipo",
        "Lea más rápido",
        "Ignore los decimales"
      ],
      c: 1,
      e: "Sin él, un equipo en español esperaría coma."
    },
    {
      sec: "ut5-formatos",
      p: "¿Qué devuelve `hasNextInt()`?",
      o: [
        "El siguiente entero",
        "`true` si lo siguiente es un entero, sin consumirlo ni lanzar excepción",
        "Lanza excepción si no lo es",
        "Siempre `true`"
      ],
      c: 1,
      e: "Pregunta antes de leer."
    },
    {
      sec: "ut5-formatos",
      p: "¿Qué patrón de `DateTimeFormatter` da `02/11/2026`?",
      o: ["`yyyy-MM-dd`", "`dd/MM/yyyy`", "`MM/dd/yy`", "`d-m-Y`"],
      c: 1,
      e: "`dd` día, `MM` mes, `yyyy` año."
    },
    {
      sec: "ut5-formatos",
      p: "En un patrón de fecha, ¿cómo se escribe texto fijo como «de»?",
      o: ["Entre comillas simples: `'de'`", "Entre comillas dobles", "Sin nada", "Entre corchetes"],
      c: 0,
      e: "Para que no se interprete como letras del patrón."
    },
    {
      sec: "ut5-formatos",
      p: "Un bloque de texto de Java se escribe entre…",
      o: ["`\"`", "`'''`", "`\"\"\"`", "`/* */`"],
      c: 2,
      e: "Tres comillas dobles, desde Java 15."
    },
    {
      sec: "ut5-formatos",
      p: "¿Qué hace `\"-\".repeat(40)`?",
      o: ["Cuenta guiones", "Crea una línea de 40 guiones", "Borra 40 caracteres", "No compila"],
      c: 1,
      e: "Útil para separadores en tablas."
    },
    {
      sec: "ut5-formatos",
      p: `¿Qué muestra?
\`\`\`
public class Main {
    public static void main(String[] args) {
        System.out.println(String.format("[%6d]", 42));
        System.out.println(String.format("[%-6d]", 42));
        System.out.println(String.format("[%06d]", 42));
    }
}
\`\`\``,
      o: [
        "`[42] / [42] / [42]`",
        "`[    42] / [42    ] / [000042]`",
        "`[42    ] / [    42] / [000042]`",
        "`[    42] / [42    ] / [420000]`"
      ],
      c: 1,
      e: "`%6d` a la derecha, `%-6d` a la izquierda, `%06d` con ceros.",
      salida: `[    42]
[42    ]
[000042]`
    },
    {
      sec: "ut5-formatos",
      p: `¿Qué muestra?
\`\`\`
import java.util.Locale;

public class Main {
    public static void main(String[] args) {
        System.out.println(String.format(Locale.US, "%,.2f", 3018.9));
    }
}
\`\`\``,
      o: ["`3.018,90`", "`3,018.90`", "`3018.9`", "`3,018.9`"],
      c: 1,
      e: "Con `Locale.US`, coma para los miles y punto decimal.",
      salida: "3,018.90"
    },
    {
      sec: "ut5-graficas",
      p: "¿Qué biblioteca gráfica incluye Java?",
      o: ["JavaFX obligatoriamente", "Swing", "Qt", "Tkinter"],
      c: 1,
      e: "Swing, en `javax.swing`."
    },
    {
      sec: "ut5-graficas",
      p: "¿Qué clase es la ventana principal?",
      o: ["`JPanel`", "`JFrame`", "`JLabel`", "`JOptionPane`"],
      c: 1,
      e: "`JFrame`."
    },
    {
      sec: "ut5-graficas",
      p: "¿Qué componente es una caja de texto de una línea?",
      o: ["`JLabel`", "`JTextField`", "`JButton`", "`JCheckBox`"],
      c: 1,
      e: "`JTextField`."
    },
    {
      sec: "ut5-graficas",
      p: "¿Qué hace falta para que la ventana se vea?",
      o: ["`show()`", "`setVisible(true)`", "`open()`", "Nada"],
      c: 1,
      e: "Sin eso existe pero no se muestra."
    },
    {
      sec: "ut5-graficas",
      p: "¿Qué hace `setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)`?",
      o: ["Impide cerrar", "Termina el programa al cerrar", "Minimiza", "Nada"],
      c: 1,
      e: "Sin ella, el programa sigue vivo al cerrar la ventana."
    },
    {
      sec: "ut5-graficas",
      p: "¿Qué gestor coloca en cinco zonas?",
      o: ["`FlowLayout`", "`BorderLayout`", "`GridLayout`", "`CardLayout`"],
      c: 1,
      e: "Norte, sur, este, oeste y centro."
    },
    {
      sec: "ut5-graficas",
      p: "¿Qué gestor usa por defecto un `JPanel`?",
      o: ["`BorderLayout`", "`FlowLayout`", "`GridLayout`", "Ninguno"],
      c: 1,
      e: "El `JFrame` usa `BorderLayout`."
    },
    {
      sec: "ut5-graficas",
      p: "¿Qué hace `new GridLayout(0, 2)`?",
      o: ["Dos filas", "Dos columnas y las filas que hagan falta", "Dos celdas", "Un error"],
      c: 1,
      e: "0 filas = tantas como haga falta."
    },
    {
      sec: "ut5-graficas",
      p: "¿Por qué se usan gestores de distribución y no coordenadas?",
      o: [
        "Porque son más bonitos",
        "Porque se adaptan al cambiar el tamaño, la resolución o los textos",
        "Porque Java no admite coordenadas",
        "Porque son más rápidos"
      ],
      c: 1,
      e: "La posición se calcula cada vez."
    },
    {
      sec: "ut5-graficas",
      p: "¿Qué devuelve `JOptionPane.showInputDialog` si el usuario cancela?",
      o: ["Cadena vacía", "`null`", "`0`", "Excepción"],
      c: 1,
      e: "Hay que comprobar `null` antes de usar el resultado."
    },
    {
      sec: "ut5-graficas",
      p: "¿Para qué sirve `JScrollPane` con un `JTextArea`?",
      o: ["Para colorear", "Para añadir barras de desplazamiento", "Para guardar", "Para ordenar"],
      c: 1,
      e: "Sin él, el texto largo no se puede desplazar."
    },
    {
      sec: "ut5-graficas",
      p: "Una ventana es, conceptualmente…",
      o: ["Una lista", "Un árbol de componentes", "Una matriz", "Una pila"],
      c: 1,
      e: "Un `JFrame` contiene paneles, que contienen componentes."
    },
    {
      sec: "ut5-graficas",
      p: "¿Por qué se usa `SwingUtilities.invokeLater`?",
      o: [
        "Por rendimiento",
        "Para crear la ventana en el hilo de eventos de Swing",
        "Para esperar",
        "Para cerrar"
      ],
      c: 1,
      e: "Es la fórmula estándar."
    },
    {
      sec: "ut5-graficas",
      p: "¿Se puede probar código de Swing en un servidor sin pantalla?",
      o: ["Sí, siempre", "No: necesita un entorno gráfico", "Solo en Linux", "Solo con Java 8"],
      c: 1,
      e: "Sin pantalla lanza `HeadlessException`.",
      nivel: "pro"
    },
    {
      sec: "ut5-eventos",
      p: "En programación dirigida por eventos, el programa…",
      o: [
        "Dirige el orden de la conversación",
        "Espera y reacciona a lo que hace el usuario",
        "Termina enseguida",
        "No usa objetos"
      ],
      c: 1,
      e: "Construye la ventana y se queda esperando."
    },
    {
      sec: "ut5-eventos",
      p: "¿Cuáles son los tres actores de un evento?",
      o: [
        "Fuente, evento y oyente",
        "Clase, objeto y método",
        "Entrada, proceso y salida",
        "Ventana, panel y botón"
      ],
      c: 0,
      e: "Fuente (componente), objeto evento (detalles) y oyente (tu código)."
    },
    {
      sec: "ut5-eventos",
      p: "¿Qué evento genera un botón al pulsarlo?",
      o: ["`MouseEvent`", "`ActionEvent`", "`KeyEvent`", "`ItemEvent`"],
      c: 1,
      e: "`ActionEvent`."
    },
    {
      sec: "ut5-eventos",
      p: "¿Qué método registra un oyente de acción?",
      o: ["`setListener`", "`addActionListener`", "`onAction`", "`bind`"],
      c: 1,
      e: "`addActionListener`."
    },
    {
      sec: "ut5-eventos",
      p: "Si no registras el oyente con `addActionListener`…",
      o: ["Se ejecuta igualmente", "Al pulsar no pasa nada", "No compila", "Se cierra la ventana"],
      c: 1,
      e: "El componente no avisa a nadie."
    },
    {
      sec: "ut5-eventos",
      p: "En `e -> calcular()`, `e` es…",
      o: ["El botón", "El objeto evento", "La excepción", "El método"],
      c: 1,
      e: "El evento, con los detalles."
    },
    {
      sec: "ut5-eventos",
      p: "¿Qué es una expresión lambda en este contexto?",
      o: [
        "Una clase",
        "Un bloque de código que se guarda para ejecutarlo cuando ocurra el evento",
        "Una constante",
        "Un tipo de variable"
      ],
      c: 1,
      e: "Forma abreviada de pasar código."
    },
    {
      sec: "ut5-eventos",
      p: "¿Qué evento genera *Enter* en un `JTextField`?",
      o: ["`KeyEvent` solo", "`ActionEvent`", "`WindowEvent`", "Ninguno"],
      c: 1,
      e: "Por eso el mismo método sirve para el botón y para Enter."
    },
    {
      sec: "ut5-eventos",
      p: "¿Qué ocurre si un controlador tarda mucho?",
      o: ["Nada", "La ventana se congela", "Se ejecuta en paralelo", "Se cancela solo"],
      c: 1,
      e: "Se ejecuta en el hilo que dibuja la ventana."
    },
    {
      sec: "ut5-eventos",
      p: "¿Qué es la inversión de control?",
      o: [
        "Invertir el orden de un array",
        "Que el *framework* llama a tu código, no al revés",
        "Un tipo de excepción",
        "Cambiar de lenguaje"
      ],
      c: 1,
      e: "En consola llamas tú a `nextLine`; en una GUI te llama Swing."
    },
    {
      sec: "ut5-eventos",
      p: "¿Para qué sirve `MouseAdapter`?",
      o: [
        "Para dibujar",
        "Para sobrescribir solo el método de ratón que interesa",
        "Para guardar el ratón",
        "Para ocultar el ratón"
      ],
      c: 1,
      e: "Trae todos los métodos vacíos."
    },
    {
      sec: "ut5-eventos",
      p: "Con `DO_NOTHING_ON_CLOSE`, el botón de cerrar…",
      o: ["Cierra el programa", "No hace nada por sí solo: lo decide tu controlador", "Minimiza", "Da error"],
      c: 1,
      e: "Es el patrón de «¿guardar antes de salir?»."
    },
    {
      sec: "ut5-eventos",
      p: "En la calculadora, ¿por qué el `catch` de `NumberFormatException` va antes que el de `IllegalArgumentException`?",
      o: ["Por estilo", "Porque es subclase: el general va después", "Da igual", "Porque es más rápido"],
      c: 1,
      e: "Si el general fuese primero, el segundo sería inalcanzable."
    },
    {
      sec: "ut5-eventos",
      p: "En un diseño limpio, el oyente debería…",
      o: [
        "Contener toda la lógica",
        "Limitarse a llamar a un método",
        "Estar vacío",
        "Ser una clase aparte siempre"
      ],
      c: 1,
      e: "Así la lógica es legible, reutilizable y comprobable."
    },
    {
      sec: "ut5-eventos",
      p: "Los componentes que usan varios métodos de la ventana suelen ser…",
      o: ["Variables locales", "Propiedades de la clase", "Constantes", "Estáticos"],
      c: 1,
      e: "Una variable local solo existe en su método."
    },
    {
      sec: "ut5-eventos",
      p: "¿Qué se necesita para leer lo que hay escrito en un `JTextField`?",
      o: ["`getText()`", "`readLine()`", "`nextLine()`", "`input()`"],
      c: 0,
      e: "`getText()`; para escribir, `setText()`."
    },
    {
      sec: "ut5-eventos",
      p: "Se parece más a un oyente de Swing…",
      o: ["Un `for`", "Un manejador de clic en JavaScript", "Un `switch`", "Un array"],
      c: 1,
      e: "Mismo modelo: reaccionar a eventos."
    },
    {
      sec: "ut5-integracion",
      p: "Para modificar un registro de un fichero de texto se usa la técnica de…",
      o: [
        "Editar en su sitio",
        "Copiar a un temporal con el cambio y reemplazar el original",
        "Borrar y empezar",
        "Serializar"
      ],
      c: 1,
      e: "Un fichero de texto no se puede editar por dentro."
    },
    {
      sec: "ut5-integracion",
      p: "Si la venta se rechaza por falta de stock, ¿qué se hace con el temporal?",
      o: ["Se mueve sobre el original", "Se borra y el original queda intacto", "Se conserva", "Se renombra"],
      c: 1,
      e: "`Files.deleteIfExists(TEMPORAL)`."
    },
    {
      sec: "ut5-integracion",
      p: "¿Qué opciones abren un fichero para añadir y crearlo si no existe?",
      o: ["`CREATE` y `APPEND`", "`READ` y `WRITE`", "`DELETE`", "Ninguna"],
      c: 0,
      e: "`StandardOpenOption.CREATE, StandardOpenOption.APPEND`."
    },
    {
      sec: "ut5-integracion",
      p: "¿Dónde debe estar el código que convierte un `Producto` a una línea CSV?",
      o: ["En el menú", "En `Producto`", "En `main`", "En `Files`"],
      c: 1,
      e: "La clase conoce sus datos."
    },
    {
      sec: "ut5-integracion",
      p: "¿Qué UT aporta el menú con `do-while` y `switch` al gestor?",
      o: ["UT1", "UT3", "UT7", "Ninguna"],
      c: 1,
      e: "Estructuras de control: UT3."
    },
    {
      sec: "ut5-integracion",
      p: "¿Por qué el gestor captura `IOException` **después** de `NumberFormatException` e `IllegalArgumentException`?",
      o: [
        "Por obligación del IDE",
        "Porque son excepciones sin relación entre sí: el orden solo importa entre las emparentadas",
        "Porque son subclases",
        "No es cierto"
      ],
      c: 1,
      e: "Solo importa el orden entre excepciones emparentadas (subclase antes que superclase); el resto, da igual.",
      nivel: "pro"
    },
    {
      sec: "ut5-integracion",
      p: "¿Cuándo dejaría de ser buena idea usar un CSV como «base de datos»?",
      o: ["Nunca", "Con muchos registros o acceso simultáneo de varios usuarios", "Con precios", "Con tildes"],
      c: 1,
      e: "Entonces conviene una base de datos (UT9)."
    },
    {
      sec: "ut5-integracion",
      p: "¿Qué dos recursos abre a la vez el `try` de `vender`?",
      o: ["Un `Scanner` y un `Producto`", "Un `BufferedReader` y un `PrintWriter`", "Dos `File`", "Ninguno"],
      c: 1,
      e: "Lee el original y escribe el temporal."
    }
  ]
});
