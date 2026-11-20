/* UT1 · Introducción a la programación — contenido editable (formato de bloques documentado en GUIA_PROFESOR.md). */

registrarUnidad({
  id: "ut1",
  titulo: "UT1. Introducción a la programación",
  ra: "RA1. Reconoce la estructura de un programa informático, identificando y relacionando los elementos propios del lenguaje de programación utilizado.",
  resumen: "Las bases de todo lo demás: cómo es un programa en Java, cómo guardar datos en variables, qué tipos existen, cómo operar con ellos y cómo convertirlos de un tipo a otro.",
  aprenderas: [
    "Identificar las partes que forman un programa en Java",
    "Crear un proyecto en el entorno de desarrollo, compilarlo y ejecutarlo",
    "Usar **variables, tipos de datos, literales, constantes y operadores**",
    "Convertir datos de un tipo a otro y entender qué se puede perder",
    "Comentar el código para que otras personas (y tú dentro de un mes) lo entiendan"
  ],
  testN: 20,

  /* ===================== APUNTES POR SECCIONES ===================== */
  secciones: [
    {
      id: "ut1-estructura",
      titulo: "Estructura de un programa y errores típicos",
      resumen: "La clase, el método main, las sentencias y qué hacer cuando el compilador protesta.",
      bloques: [
        {
          t: "texto",
          md: "Un **programa** es un conjunto de instrucciones que el ordenador ejecuta **en orden**, una detrás de otra. En Java, el programa más pequeño posible es este (puedes ejecutarlo y modificarlo):"
        },
        {
          t: "codigo",
          titulo: "Bienvenida.java",
          code: `public class Bienvenida {
    public static void main(String[] args) {
        System.out.println("Bienvenido a Náutica Bahía");
        System.out.println("Tienda y alquiler de material náutico");
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `Sus partes son:
- **La clase** (\`public class Bienvenida\`): en Java todo el código va dentro de una clase. El archivo debe llamarse igual: \`Bienvenida.java\`.
- **El método principal** (\`public static void main(String[] args)\`): es el punto de entrada. Cuando ejecutas el programa, Java empieza por aquí. De momento apréndetelo de memoria; entenderás cada palabra en la UT2 y la UT4.
- **Los bloques**, delimitados por llaves \`{ }\`. Cada llave que se abre tiene que cerrarse. El bloque de la clase contiene el bloque del método.
- **Las sentencias**: cada instrucción. Terminan siempre en punto y coma (\`;\`). \`System.out.println(...)\` muestra un texto y salta de línea; \`System.out.print(...)\` lo muestra sin saltar.`
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "Java **distingue mayúsculas y minúsculas**: `System` no es lo mismo que `system`. Y la sangría (los espacios al principio de línea) no es obligatoria para Java, pero sí para las personas: sin ella el código es casi imposible de leer."
        },
        {
          t: "huecos",
          p: "Completa el esqueleto del programa con las palabras que faltan.",
          codigo: `public {{class}} Bienvenida {
    public static {{void}} main(String[] {{args}}) {
        System.out.println("Hola"){{;}}
    }
}`,
          e: "`class` abre la clase, `void` indica que `main` no devuelve nada, `args` es el nombre del parámetro y cada sentencia termina en `;`.",
          pista: "Todo el código va dentro de una ...; y main «no devuelve nada»."
        },
        {
          t: "ordenar",
          p: "Ordena lo que ocurre desde que escribes el código hasta que ves el resultado.",
          items: [
            "Escribes el código fuente en Bienvenida.java",
            "El compilador (javac) lo traduce a bytecode: Bienvenida.class",
            "La máquina virtual de Java (JVM) ejecuta el bytecode",
            "Aparece el resultado por pantalla"
          ],
          e: "Esto ya lo viste en Entornos de desarrollo: el compilador traduce y la JVM ejecuta. Por eso un mismo .class funciona en Windows, Linux o macOS."
        },
        {
          t: "profundizar",
          titulo: "¿Por qué el archivo tiene que llamarse igual que la clase?",
          bloques: [
            {
              t: "texto",
              md: `Porque \`javac\` lo exige para las clases \`public\`: si escribes \`public class Bienvenida\` dentro de \`Tienda.java\`, el compilador da error (*class Bienvenida is public, should be declared in a file named Bienvenida.java*). La razón es práctica: así Java sabe en qué archivo buscar cada clase sin tener que leerlos todos.

Curiosidad: desde Java 25 existen los *compact source files*, que permiten escribir un programa sin declarar la clase (\`void main() { IO.println("Hola"); }\`). En esta asignatura usamos la forma clásica porque es la que aparece en los libros, la documentación y cualquier proyecto real.`
            }
          ]
        },
        {
          t: "ejecuta",
          p: `**Arregla el programa.** Tiene tres errores de los típicos: dos del compilador y uno de mayúsculas. Pulsa «Ejecutar», **lee el mensaje** (te dice la línea) y corrige uno a uno hasta que muestre exactamente:
\`\`\`
Alquiler abierto
Horario: 10:00 a 20:00
\`\`\``,
          inicial: `public class Aviso {
    public static void main(String[] args) {
        system.out.println("Alquiler abierto")
        System.out.printLn("Horario: 10:00 a 20:00");
    }
}`,
          tests: [
            {
              out: `Alquiler abierto
Horario: 10:00 a 20:00`,
              desc: "Muestra las dos líneas"
            }
          ],
          pistas: [
            "El compilador te da el número de línea. Empieza por el primer error que aparezca.",
            "Falta algo al final de una sentencia y `System` empieza por mayúscula.",
            "El método se llama `println` (con `ln` en minúscula)."
          ],
          solucion: `public class Aviso {
    public static void main(String[] args) {
        System.out.println("Alquiler abierto");
        System.out.println("Horario: 10:00 a 20:00");
    }
}`,
          explicacion: "Aprende a leer el mensaje: casi siempre dice **qué** falla y **en qué línea**. Es información, no un castigo."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: `**Errores típicos de esta unidad**
- Olvidar el punto y coma al final de una sentencia.
- Llaves sin cerrar o cerradas en el sitio equivocado.
- Que el nombre del archivo no coincida con el de la clase.
- Escribir \`system.out.println\` o \`System.out.printLn\`.`
        },
        {
          t: "practica",
          titulo: "Tu primer proyecto en Visual Studio Code",
          p: "Crea un proyecto Java en tu ordenador. Marca cada paso cuando lo hayas hecho.",
          pasos: [
            {
              t: "Instala lo necesario",
              md: "Necesitas el **JDK** (Java 21 o superior) y **Visual Studio Code** con el *Extension Pack for Java*.",
              check: "En una terminal, `java -version` muestra la versión instalada."
            },
            {
              t: "Crea el proyecto",
              md: "Pulsa `Ctrl+Shift+P`, escribe *Java: Create Java Project*, elige **No build tools**, una carpeta y un nombre (por ejemplo `nautica-ut1`).",
              check: "Aparece una carpeta `src` con un archivo `App.java`."
            },
            {
              t: "Escribe y ejecuta Bienvenida",
              md: "Crea `Bienvenida.java` dentro de `src` (clic derecho › New File) con el código de arriba y pulsa **Run** sobre la línea del `main`.",
              check: "En el terminal aparecen las dos líneas de bienvenida.",
              pregunta: "¿Qué carpeta se ha creado al ejecutar y qué contiene?"
            },
            {
              t: "Provoca un error a propósito",
              md: "Quita un `;` y vuelve a ejecutar. Lee el mensaje del compilador.",
              check: "El IDE subraya la línea en rojo y el mensaje indica la línea del error.",
              pregunta: "¿Qué línea señala el compilador y por qué crees que es esa?"
            }
          ],
          entrega: "Un pantallazo de tu terminal con la salida de `Bienvenida` ejecutándose en tu ordenador."
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "En un proyecto real pasarás **más tiempo leyendo errores que escribiendo código**. Un buen hábito: lee el mensaje **de arriba abajo** (el primer error suele causar los siguientes), arregla solo ese, y vuelve a compilar. Si copias un error en un buscador o en una IA, copia **el mensaje completo y las líneas de código implicadas**, pero **nunca** contraseñas, claves de API ni datos de clientes.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Vamos con la **estructura de un programa Java**. Te hago tres preguntas rápidas; si las aciertas todas, nos saltamos la teoría.",
        inicial: [
          {
            p: "¿Por dónde empieza Java a ejecutar un programa?",
            o: [
              "Por la primera clase que encuentra en el proyecto",
              "Por el método `main`",
              "Por la línea 1 del archivo",
              "Por el método `start`"
            ],
            c: 1,
            e: "Java busca el método `public static void main(String[] args)` y empieza ahí."
          },
          {
            p: "El archivo se llama `Tienda.java` y contiene `public class Almacen { ... }`. ¿Qué ocurre al compilar?",
            o: [
              "Compila sin problemas",
              "Error: la clase pública debe llamarse como el archivo",
              "Se ejecuta, pero muestra un aviso",
              "Java cambia el nombre del archivo solo"
            ],
            c: 1,
            e: "Una clase `public` debe estar en un archivo con su mismo nombre."
          },
          {
            p: "¿Qué diferencia hay entre `print` y `println`?",
            o: [
              "No hay ninguna",
              "`println` salta de línea al final; `print` no",
              "`print` muestra números y `println` textos",
              "`println` no necesita punto y coma"
            ],
            c: 1,
            e: "`println` = print + line (salto de línea)."
          }
        ],
        pasos: [
          {
            titulo: "El método main: la puerta de entrada",
            cubre: [0],
            explica: "Un programa Java es como una tienda: puede tener muchas «salas» (clases), pero solo hay **una puerta de entrada**: el método `main`. Cuando ejecutas el programa, Java busca exactamente esto y empieza por la primera sentencia de su bloque.",
            pregunta: {
              p: "¿Cuál de estas es la cabecera correcta del método principal?",
              o: [
                "`public static void main(String[] args)`",
                "`public void main()`",
                "`static main(String args)`",
                "`public class main(String[] args)`"
              ],
              c: 0,
              e: "Es la cabecera exacta que busca la JVM.",
              pista: "Debe ser pública, estática, no devolver nada (`void`) y recibir un array de textos."
            },
            extra: "Piensa en `main` como «el botón de arranque». Si no existe, el programa no sabe por dónde empezar y la JVM se queja: *no main method found*."
          },
          {
            titulo: "Nombre de archivo y de clase",
            cubre: [1],
            explica: "En Java **cada clase pública vive en su propio archivo** y el archivo se llama como la clase, respetando mayúsculas: `Bienvenida` → `Bienvenida.java`. El compilador lo comprueba. Es una norma de orden: sabiendo el nombre de la clase, sabes el archivo.",
            pregunta: {
              p: "Tienes `public class FichaCliente`. ¿Cómo se llama el archivo?",
              o: ["fichacliente.java", "FichaCliente.java", "Ficha Cliente.java", "FichaCliente.class"],
              c: 1,
              e: "Mismo nombre, mismas mayúsculas, extensión `.java`. El `.class` lo genera el compilador.",
              pista: "Respeta mayúsculas y minúsculas y usa la extensión del código fuente."
            }
          },
          {
            titulo: "print frente a println",
            cubre: [2],
            explica: "`System.out.println(\"Hola\")` escribe el texto **y salta de línea**; `System.out.print(\"Hola\")` lo escribe y se queda en la misma línea. Toda sentencia acaba en `;`.",
            ejemplo: {
              code: `System.out.print("A");
System.out.print("B");
System.out.println("C");
System.out.println("D");`,
              ejecutable: true,
              titulo: "Prueba: ¿qué sale?"
            },
            pregunta: {
              p: "Con el ejemplo de arriba, ¿qué muestra el programa?",
              o: [
                "`A B C D` en cuatro líneas",
                "`ABC` y en la línea siguiente `D`",
                "`ABCD` en una línea",
                "`A`, `B` y `CD`"
              ],
              c: 1,
              e: "Los dos `print` y el primer `println` escriben en la misma línea; el salto llega al terminar `println(\"C\")`."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Escribe un programa \`Cartel\` que muestre exactamente estas tres líneas, usando \`print\` en una de ellas para que el precio quede en la misma línea que el texto:
 \`\`\`
 Kayak biplaza
 Alquiler por hora: 12 euros
 ¡Reserva ya!
 \`\`\`
 `,
          inicial: `
 public class Cartel {
     public static void main(String[] args) {
         // escribe aquí tus sentencias
     }
 }
 `,
          tests: [
            {
              out: `Kayak biplaza
Alquiler por hora: 12 euros
¡Reserva ya!`
            }
          ],
          solucion: `
 public class Cartel {
     public static void main(String[] args) {
         System.out.println("Kayak biplaza");
         System.out.print("Alquiler por hora: ");
         System.out.println("12 euros");
         System.out.println("¡Reserva ya!");
     }
 }
 `,
          pistas: [
            "Cada línea de texto es una sentencia que termina en `;`.",
            "Para unir dos textos en la misma línea, la primera sentencia usa `print` y la segunda `println`."
          ]
        }
      }
    },

    {
      id: "ut1-variables",
      titulo: "Variables, nombres y ámbito",
      resumen: "Cajas con nombre donde guardar datos que cambian; reglas de nombres y dónde «vive» cada variable.",
      bloques: [
        {
          t: "texto",
          md: "Una **variable** es un espacio de memoria con nombre donde guardamos un dato que puede **cambiar** durante la ejecución. Toda variable tiene un **tipo** (qué clase de dato guarda), un **nombre** y un **valor**."
        },
        {
          t: "codigo",
          titulo: "Variables.java",
          code: `public class Variables {
    public static void main(String[] args) {
        int unidades;                 // declaración: reserva espacio para un entero
        unidades = 3;                 // asignación: guarda el valor 3
        double precio = 249.90;       // declaración e inicialización en una línea
        unidades = unidades + 2;      // la variable cambia: ahora vale 5
        System.out.println(unidades + " unidades a " + precio + " euros");
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "El signo `=` **no significa «igual»** como en matemáticas: significa «calcula lo de la derecha y **guárdalo** en la variable de la izquierda». Por eso `unidades = unidades + 2;` tiene sentido: calcula `unidades + 2` y lo guarda otra vez en `unidades`."
        },
        {
          t: "traza",
          p: "**Sigue la variable a mano.** Rellena el valor de cada variable después de ejecutar cada línea (usa `—` si todavía no existe… no hace falta escribir nada en esas celdas).",
          code: `int unidades = 3;               // línea 1
unidades = unidades + 2;        // línea 2
int doble = unidades * 2;       // línea 3
unidades = 1;                   // línea 4`,
          cols: ["Después de la línea", "unidades", "doble"],
          filas: [
            [
              { dado: "1" },
              "3",
              { dado: "—" }
            ],
            [
              { dado: "2" },
              "5",
              { dado: "—" }
            ],
            [
              { dado: "3" },
              "5",
              "10"
            ],
            [
              { dado: "4" },
              "1",
              "10"
            ]
          ],
          e: "Fíjate en que `doble` **no** se actualiza en la línea 4: guardó el resultado de un cálculo anterior, no una fórmula."
        },
        {
          t: "profundizar",
          titulo: "Si vengo de las matemáticas, ¿por qué `x = x + 1` no es una ecuación imposible?",
          bloques: [
            {
              t: "texto",
              md: "En matemáticas, `x = x + 1` no tiene solución. En programación **no es una ecuación, es una orden**: «toma el valor actual de `x`, súmale 1 y guarda el resultado en `x`». Una variable cambia de valor **en el tiempo** (primero valía 3, luego 4); en matemáticas, una variable representa un valor fijo desconocido. Es el malentendido más frecuente de la primera semana, y se arregla leyendo `=` como una flecha ←."
            }
          ]
        },
        {
          t: "texto",
          md: `### Reglas y convenciones para los nombres
Los **identificadores** deben empezar por una letra, \`_\` o \`$\`; pueden contener números, pero no espacios; y no pueden ser palabras reservadas (\`int\`, \`class\`, \`public\`…). Además, en Java se siguen estas **convenciones**:`
        },
        {
          t: "tabla",
          cab: ["Elemento", "Convención", "Ejemplo"],
          filas: [
            [
              "Variables y métodos",
              "lowerCamelCase: primera palabra en minúscula, el resto empiezan en mayúscula",
              "`precioAlquiler`"
            ],
            ["Clases", "UpperCamelCase", "`CalculadoraIva`"],
            ["Constantes", "MAYÚSCULAS con guiones bajos", "`IVA_GENERAL`"]
          ]
        },
        {
          t: "test",
          p: "¿Cuál de estos es un nombre de variable **válido** en Java?",
          o: ["`2dias`", "`dias alquiler`", "`diasAlquiler`", "`class`"],
          c: 2,
          e: "No puede empezar por número, tener espacios ni ser una palabra reservada."
        },
        {
          t: "relacionar",
          p: "Relaciona cada nombre con lo que designa según las convenciones de Java.",
          pares: [
            ["precioAlquiler", "variable"],
            ["CalculadoraIva", "clase"],
            ["IVA_GENERAL", "constante"]
          ],
          codigo: true,
          e: "lowerCamelCase para variables, UpperCamelCase para clases y MAYÚSCULAS_CON_GUIONES para constantes."
        },
        {
          t: "texto",
          md: `### Ámbito de una variable
Una variable solo existe **dentro del bloque \`{ }\` en el que se declara**, desde la línea de su declaración hasta que se cierra ese bloque. Además, Java no deja usar una variable local sin haberle dado antes un valor. Ejecútalo y lee el error:`
        },
        {
          t: "codigo",
          titulo: "Ambito.java",
          code: `public class Ambito {
    public static void main(String[] args) {
        int stock;
        System.out.println(stock);
    }
}`,
          ejecutable: true
        },
        {
          t: "ejecuta",
          p: `Crea \`FichaCliente\`: guarda en variables el nombre de un cliente (\`"Laura Martínez"\`), su edad (34) y cuántas veces ha alquilado (2). Después **suma 1** a los alquileres y vuelve a mostrarlos. Debe mostrar:
\`\`\`
Cliente: Laura Martínez (34 años)
Alquileres: 2
Alquileres tras el nuevo: 3
\`\`\``,
          inicial: `public class FichaCliente {
    public static void main(String[] args) {
        // declara las variables y muestra los datos
    }
}`,
          tests: [
            {
              out: `Cliente: Laura Martínez (34 años)
Alquileres: 2
Alquileres tras el nuevo: 3`
            }
          ],
          pistas: [
            "`String` es el tipo para textos, `int` para enteros.",
            "Une textos y variables con `+`. Los espacios y paréntesis del texto van entre comillas."
          ],
          solucion: `public class FichaCliente {
    public static void main(String[] args) {
        String nombre = "Laura Martínez";
        int edad = 34;
        int alquileres = 2;
        System.out.println("Cliente: " + nombre + " (" + edad + " años)");
        System.out.println("Alquileres: " + alquileres);
        alquileres = alquileres + 1;
        System.out.println("Alquileres tras el nuevo: " + alquileres);
    }
}`,
          rubrica: [
            "Los nombres de las variables siguen lowerCamelCase",
            "No hay valores «mágicos» repetidos: cada dato se guarda una vez en su variable",
            "La salida es idéntica a la del enunciado"
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Nombrar bien es la mitad de programar.** `diasAlquiler` se entiende; `d` o `x1`, no. Si necesitas un comentario para explicar qué guarda una variable, probablemente el nombre es malo. Desde Java 10 existe `var` (`var total = 125.5;`): el compilador **infiere** el tipo, y el tipo sigue siendo fijo (`double`). Úsalo solo cuando el tipo sea evidente a simple vista.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Repasemos las **variables**: qué guardan, cómo se nombran y dónde viven.",
        inicial: [
          {
            p: "Tras `int a = 5; a = a * 2;`, ¿cuánto vale `a`?",
            o: ["5", "10", "25", "Error: `a` no puede cambiar"],
            c: 1,
            e: "Se calcula `5 * 2 = 10` y se guarda de nuevo en `a`."
          },
          {
            p: "¿Qué nombre sigue la convención de Java para una **constante**?",
            o: ["`ivaGeneral`", "`IvaGeneral`", "`IVA_GENERAL`", "`iva-general`"],
            c: 2,
            e: "Las constantes se escriben en MAYÚSCULAS con guiones bajos."
          },
          {
            p: "Declaras `int total = 3;` dentro de un `if { ... }` y lo usas **después** del `if`. ¿Qué pasa?",
            o: [
              "Funciona igual",
              "Error: la variable ya no existe fuera de su bloque",
              "Vale 0 fuera del bloque",
              "Java la crea de nuevo"
            ],
            c: 1,
            e: "Una variable solo existe dentro del bloque donde se declara (su ámbito)."
          }
        ],
        pasos: [
          {
            titulo: "Asignar no es igualar",
            cubre: [0],
            explica: "`=` es una **orden de guardar**, no una igualdad. Primero se evalúa **toda la parte derecha** con los valores actuales y después se guarda el resultado en la variable de la izquierda. Con `a = a * 2`, si `a` vale 5: se calcula 10 y se guarda en `a`.",
            pregunta: {
              p: "`int x = 4; x = x + x; x = x - 3;` ¿Cuánto vale `x` al final?",
              o: ["1", "5", "8", "4"],
              c: 1,
              e: "4 + 4 = 8 y luego 8 − 3 = 5.",
              pista: "Ve línea a línea: cada asignación usa el valor que tiene `x` en ese momento."
            },
            extra: "Dibuja una caja con la etiqueta `x`. Cada asignación **borra lo que había y mete un valor nuevo**. Anota el contenido de la caja tras cada línea."
          },
          {
            titulo: "Nombres y convenciones",
            cubre: [1],
            explica: "Variables y métodos: `lowerCamelCase` (`precioAlquiler`). Clases: `UpperCamelCase` (`CalculadoraIva`). Constantes: `MAYUSCULAS_CON_GUIONES`. Un nombre no puede empezar por número, tener espacios ni ser palabra reservada. Y debe **explicar** lo que guarda.",
            pregunta: {
              p: "¿Cuál es el mejor nombre para guardar los días de alquiler?",
              o: ["`d`", "`dias_alquiler_total_del_cliente_actual`", "`diasAlquiler`", "`DIAS`"],
              c: 2,
              e: "Claro, corto y con la convención correcta.",
              pista: "Debe explicar qué guarda y usar lowerCamelCase."
            }
          },
          {
            titulo: "El ámbito: dónde vive una variable",
            cubre: [2],
            explica: "Cada par de llaves `{ }` crea un **bloque**. Una variable declarada dentro de un bloque **desaparece al cerrarse**. Si la necesitas fuera, declárala **antes** (fuera del bloque).",
            ejemplo: {
              code: `int dias = 3;
{
    int fianza = 50;
}
System.out.println(dias);
System.out.println(fianza);`,
              ejecutable: true,
              titulo: "Prueba: ¿qué falla?"
            },
            pregunta: {
              p: "En el ejemplo, ¿por qué falla `System.out.println(fianza)`?",
              o: [
                "Porque `fianza` no es un número",
                "Porque `fianza` se declaró en un bloque ya cerrado",
                "Porque falta un punto y coma",
                "Porque `println` solo muestra un dato"
              ],
              c: 1,
              e: "`fianza` solo existe entre sus llaves."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Tienes dos variables, \`a\` con 3 y \`b\` con 7. **Intercámbialas** (que \`a\` pase a valer 7 y \`b\` 3) usando una tercera variable auxiliar, y muestra:
 \`\`\`
 a=7 b=3
 \`\`\`
 `,
          inicial: `
 public class Intercambio {
     public static void main(String[] args) {
         int a = 3;
         int b = 7;
         // intercambia a y b aquí

         System.out.println("a=" + a + " b=" + b);
     }
 }
 `,
          tests: [
            { out: "a=7 b=3" }
          ],
          solucion: `
 public class Intercambio {
     public static void main(String[] args) {
         int a = 3;
         int b = 7;
         int auxiliar = a;
         a = b;
         b = auxiliar;
         System.out.println("a=" + a + " b=" + b);
     }
 }
 `,
          pistas: [
            "Si haces `a = b;` directamente, pierdes el valor original de `a`.",
            "Guarda primero uno de los valores en una variable auxiliar."
          ]
        }
      }
    },

    {
      id: "ut1-tipos",
      titulo: "Tipos de datos, literales y constantes",
      resumen: "Los ocho tipos primitivos, String, cómo se escriben los valores y cómo fijar datos que no deben cambiar.",
      bloques: [
        {
          t: "texto",
          md: "El **tipo** indica qué valores puede guardar una variable y qué operaciones admite. Java es de **tipado estático**: el tipo se decide al declarar la variable y no cambia nunca. Hay ocho **tipos primitivos**:"
        },
        {
          t: "tabla",
          cab: ["Tipo", "Tamaño", "Qué guarda"],
          filas: [
            ["`byte`", "1 byte", "Enteros de −128 a 127"],
            ["`short`", "2 bytes", "Enteros de −32 768 a 32 767"],
            ["`int`", "4 bytes", "Enteros de unos −2 100 a 2 100 millones. **El entero por defecto.**"],
            ["`long`", "8 bytes", "Enteros muy grandes (hasta ~9·10¹⁸)"],
            ["`float`", "4 bytes", "Decimales con ~7 cifras de precisión"],
            ["`double`", "8 bytes", "Decimales con ~15 cifras. **El decimal por defecto.**"],
            ["`char`", "2 bytes", "Un único carácter: `'A'`, `'7'`, `'ñ'`"],
            ["`boolean`", "—", "Solo `true` o `false`"]
          ]
        },
        {
          t: "texto",
          md: "En la práctica usarás casi siempre `int`, `double`, `char` y `boolean`. Para textos se usa `String`, que **no es un primitivo sino una clase** (la verás a fondo en la UT2)."
        },
        {
          t: "relacionar",
          p: "¿Qué tipo eliges para guardar cada dato de la tienda?",
          pares: [
            ["Unidades en stock", "int"],
            ["Precio de un producto", "double"],
            ["Talla de un neopreno (S, M, L)", "char"],
            ["¿El cliente es socio?", "boolean"],
            ["Nombre del cliente", "String"]
          ],
          e: "Enteros → `int`; con decimales → `double`; una letra → `char`; sí/no → `boolean`; texto → `String`."
        },
        {
          t: "test",
          p: "Quieres guardar el **código postal** `30860`. ¿Qué tipo es mejor?",
          o: ["`int`", "`double`", "`String`", "`long`"],
          c: 2,
          e: "No se opera con él (no se suma ni se multiplica) y puede empezar por 0 (`04001`): se guarda como texto. Lo mismo vale para un teléfono."
        },
        {
          t: "texto",
          md: `### Literales
Un **literal** es un valor escrito directamente en el código: \`42\`, \`249.90\`, \`'M'\`, \`"Kayak"\`, \`true\`. Detalles que importan:
- El separador decimal es el **punto**, nunca la coma.
- \`char\` va con **comillas simples** (\`'M'\`) y \`String\` con **dobles** (\`"Kayak"\`).
- Un entero muy grande necesita sufijo \`L\` (\`9000000000L\`) y un \`float\` necesita \`f\` (\`19.99f\`).
- Dentro de un texto, algunos caracteres se escriben con **barra invertida**: \`\\n\` (salto de línea), \`\\t\` (tabulador), \`\\"\` (comillas) y \`\\\\\` (una barra).`
        },
        {
          t: "predecir",
          p: "¿Qué muestra este programa por pantalla? (Fíjate en `print`, `println` y en los escapes.)",
          code: `System.out.println("Modelo \\"Bahía 2\\"");
System.out.print("Línea 1\\nLínea 2");
System.out.println(" fin");`,
          salida: `Modelo "Bahía 2"
Línea 1
Línea 2 fin`,
          e: "`\\\"` escribe unas comillas; `\\n` salta de línea; el último `println` continúa en la línea donde terminó el `print`."
        },
        {
          t: "texto",
          md: `### Constantes
Una **constante** es una variable cuyo valor **no puede cambiar** una vez asignado. Se declara con \`final\` y por convención se escribe en MAYÚSCULAS:`
        },
        {
          t: "codigo",
          titulo: "Constantes.java",
          code: `public class Constantes {
    public static void main(String[] args) {
        final double IVA_GENERAL = 0.21;
        System.out.println("IVA: " + IVA_GENERAL);
        IVA_GENERAL = 0.10;   // ¿qué dirá el compilador?
    }
}`,
          ejecutable: true
        },
        {
          t: "huecos",
          p: "Declara una constante para los días máximos de alquiler.",
          codigo: "{{final}} {{int}} DIAS_MAXIMOS_ALQUILER = 15;",
          e: "`final` impide cambiar el valor; `int` es el tipo adecuado para un número entero de días."
        },
        {
          t: "profundizar",
          titulo: "¿Qué es un «número mágico» y por qué hay que evitarlo?",
          bloques: [
            {
              t: "texto",
              md: "Un **número mágico** es un valor que aparece suelto en el código sin explicación: `total * 1.21`. ¿Es el IVA? ¿Un recargo? Y si el IVA cambia, tendrás que buscar todos los `1.21` del programa (y quizá cambiar uno que no era IVA). Con `final double IVA_GENERAL = 0.21;` el nombre explica el valor y se cambia en **un solo sitio**."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `0.1 + 0.2` no da `0.3`?",
          bloques: [
            {
              t: "texto",
              md: "Los `double` se guardan en **binario** (estándar IEEE 754) y muchos decimales, como 0,1, **no tienen representación binaria exacta**, igual que 1/3 no la tiene en decimal (0,3333…). El ordenador guarda una aproximación muy buena y al operar se acumula un error minúsculo. Pruébalo:"
            },
            {
              t: "codigo",
              titulo: "Precisión",
              code: `System.out.println(0.1 + 0.2);
System.out.println(0.1 + 0.2 == 0.3);`,
              ejecutable: true
            },
            {
              t: "texto",
              md: "Moraleja: para **dinero real** no se usa `double` (se usan enteros en céntimos o la clase `BigDecimal`), y los decimales **no se comparan con `==`**. En esta unidad usaremos `double` y redondearemos al mostrar."
            }
          ]
        },
        {
          t: "ejecuta",
          p: `Escribe \`PrecioFinal\`: con una **constante** para el IVA (21 %), calcula y muestra la base imponible, el IVA y el total de **3 chalecos salvavidas a 34,50 €** cada uno. Salida:
\`\`\`
Base imponible: 103.5
IVA (21%): 21.735
Total: 125.235
\`\`\``,
          inicial: `public class PrecioFinal {
    public static void main(String[] args) {
        // constante del IVA, precio y unidades

    }
}`,
          tests: [
            {
              out: `Base imponible: 103.5
IVA (21%): 21.735
Total: 125.235`
            }
          ],
          pistas: [
            "El punto es el separador decimal: `34.50`.",
            "La base es `precioUnitario * unidades`; el IVA, `base * IVA`."
          ],
          solucion: `public class PrecioFinal {
    public static void main(String[] args) {
        final double IVA = 0.21;
        double precioUnitario = 34.50;
        int unidades = 3;
        double base = precioUnitario * unidades;
        double importeIva = base * IVA;
        double total = base + importeIva;
        System.out.println("Base imponible: " + base);
        System.out.println("IVA (21%): " + importeIva);
        System.out.println("Total: " + total);
    }
}`,
          rubrica: [
            "El IVA está en una constante `final` con nombre en MAYÚSCULAS",
            "Cada dato (precio, unidades) está en su variable, sin números sueltos en las operaciones"
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Dinero y `double` no se llevan bien.** En software real (facturas, TPV, banca) el dinero se guarda como **entero en céntimos** (`long`) o con `BigDecimal`. Un error de redondeo de un céntimo multiplicado por miles de facturas es un problema contable y legal. Si ves `double` en una factura de verdad, desconfía.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Caja exacta en céntimos",
          p: `La tienda factura **3 chalecos a 34,50 €** con IVA del 21 %. Calcula **sin usar \`double\`**: trabaja en **céntimos** con \`long\`/\`int\`. El IVA se redondea **al céntimo más cercano** (la mitad hacia arriba) y los importes se muestran en euros con coma decimal y dos cifras:
\`\`\`
Base: 103,50 euros
IVA (21%): 21,74 euros
Total: 125,24 euros
\`\`\``,
          requisitos: [
            "No puede aparecer ningún `double` ni `float` en el programa",
            "Los importes en euros se obtienen con `/ 100` y `% 100` (con un 0 delante si los céntimos son menores que 10)",
            "El IVA redondea con enteros: suma 50 antes de dividir entre 100"
          ],
          inicial: `public class CajaExacta {
    public static void main(String[] args) {
        final int PRECIO_UNIDAD_CENTIMOS = 3450;
        final int UNIDADES = 3;
        final int IVA_PORCENTAJE = 21;
        // 1) base en céntimos  2) IVA redondeado al céntimo  3) total  4) mostrar con coma
    }
}`,
          tests: [
            {
              out: `Base: 103,50 euros
IVA (21%): 21,74 euros
Total: 125,24 euros`
            }
          ],
          pistas: [
            "Base = 3450 × 3 = 10350 céntimos. Para el IVA: (base × 21) / 100 = 2173,5 → ¿cómo redondeas hacia arriba solo con enteros?",
            "Suma la mitad del divisor (50) antes de dividir: así 2173,5 pasa a 2174.",
            "Para mostrar 103,50: euros = 10350 / 100 y céntimos = 10350 % 100."
          ],
          solucion: `public class CajaExacta {
    public static void main(String[] args) {
        final int PRECIO_UNIDAD_CENTIMOS = 3450;
        final int UNIDADES = 3;
        final int IVA_PORCENTAJE = 21;
        long base = (long) PRECIO_UNIDAD_CENTIMOS * UNIDADES;
        long iva = (base * IVA_PORCENTAJE + 50) / 100;   // redondeo half-up con enteros
        long total = base + iva;
        System.out.println("Base: " + base / 100 + "," + (base % 100 < 10 ? "0" : "") + base % 100 + " euros");
        System.out.println("IVA (21%): " + iva / 100 + "," + (iva % 100 < 10 ? "0" : "") + iva % 100 + " euros");
        System.out.println("Total: " + total / 100 + "," + (total % 100 < 10 ? "0" : "") + total % 100 + " euros");
    }
}`,
          explicacion: "Este patrón (`(x * p + 50) / 100`) es el redondeo *half-up* con enteros que usan muchos sistemas de facturación.",
          rubrica: [
            "Hay constantes con nombre para todos los valores de negocio",
            "Evitas repetir tres veces el mismo código de formato (¿se puede ordenar mejor? lo verás con métodos en la UT4)",
            "Has comprobado el caso límite de céntimos < 10 (por ejemplo 5 céntimos se muestra «05»)"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Hablemos de **tipos, literales y constantes**. Responde y ajusto el recorrido.",
        inicial: [
          {
            p: "¿Qué tipo es el más adecuado para guardar el **precio** de un producto en esta unidad?",
            o: ["`int`", "`double`", "`char`", "`boolean`"],
            c: 1,
            e: "Los precios tienen decimales: `double`."
          },
          {
            p: "¿Cuál de estos literales es de tipo `char`?",
            o: ["`\"M\"`", "`'M'`", "`M`", "`77.0`"],
            c: 1,
            e: "Una sola letra entre **comillas simples**."
          },
          {
            p: "¿Qué hace `final` en `final double IVA = 0.21;`?",
            o: [
              "Hace que la variable sea más rápida",
              "Impide cambiar su valor después de asignarlo",
              "La convierte en `String`",
              "La borra al terminar el programa"
            ],
            c: 1,
            e: "`final` = constante: no se puede reasignar."
          }
        ],
        pasos: [
          {
            titulo: "Elegir bien el tipo",
            cubre: [0],
            explica: "Pregúntate **qué guarda** y **qué vas a hacer con ello**: ¿un entero que cuentas? `int`. ¿Un valor con decimales? `double`. ¿Una sola letra? `char`. ¿Un sí/no? `boolean`. ¿Texto? `String`. Si no vas a hacer cuentas con el dato (código postal, teléfono), también es un `String`.",
            pregunta: {
              p: "¿Qué tipo usarías para «¿está disponible el kayak?»?",
              o: ["`int`", "`String`", "`boolean`", "`double`"],
              c: 2,
              e: "Solo hay dos posibilidades (sí/no): `boolean`."
            }
          },
          {
            titulo: "Literales: cómo se escribe cada valor",
            cubre: [1],
            explica: "`42` es `int`; `42.0` es `double`; `'M'` (comillas **simples**) es `char`; `\"M\"` (comillas **dobles**) es `String`; `true`/`false` son `boolean`. `9000000000L` lleva `L` para ser `long`.",
            pregunta: {
              p: "¿Qué diferencia hay entre `'A'` y `\"A\"`?",
              o: [
                "Ninguna",
                "La primera es `char` y la segunda `String`",
                "La primera es `String` y la segunda `char`",
                "La segunda es un número"
              ],
              c: 1,
              e: "Comillas simples → `char`; dobles → `String`."
            }
          },
          {
            titulo: "Constantes con final",
            cubre: [2],
            explica: "`final double IVA = 0.21;` crea una variable que **solo se puede asignar una vez**. Si intentas cambiarla, el compilador da error. Se escriben en MAYÚSCULAS y evitan los «números mágicos»: valores sueltos sin explicación.",
            ejemplo: {
              code: `final int MAX = 15;
MAX = 20;`,
              ejecutable: true,
              titulo: "Prueba el error"
            },
            pregunta: {
              p: "¿Por qué es mejor `total * IVA` que `total * 0.21`?",
              o: [
                "Porque es más rápido",
                "Porque el nombre explica el valor y se cambia en un solo sitio",
                "Porque Java no admite números sueltos",
                "No es mejor, es igual"
              ],
              c: 1,
              e: "Es legibilidad y mantenimiento: un nombre explica; un número suelto, no."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Una tarifa de **12 euros por hora** y un máximo de **5 horas** de alquiler. Con una **constante** para cada valor, calcula el precio máximo y muestra:
 \`\`\`
 Precio máximo: 60 euros
 \`\`\`
 `,
          inicial: `
 public class TarifaMaxima {
     public static void main(String[] args) {
         // constantes y cálculo
     }
 }
 `,
          tests: [
            { out: "Precio máximo: 60 euros" }
          ],
          solucion: `
 public class TarifaMaxima {
     public static void main(String[] args) {
         final int PRECIO_HORA = 12;
         final int HORAS_MAXIMAS = 5;
         int maximo = PRECIO_HORA * HORAS_MAXIMAS;
         System.out.println("Precio máximo: " + maximo + " euros");
     }
 }
 `,
          pistas: [
            "Declara `final int PRECIO_HORA = 12;` y otra para las horas.",
            "Multiplica las dos constantes y concatena el resultado con el texto."
          ]
        }
      }
    },

    {
      id: "ut1-operadores",
      titulo: "Operadores y expresiones",
      resumen: "Aritméticos, concatenación, incremento, relacionales, lógicos, ternario y precedencia.",
      bloques: [
        {
          t: "texto",
          md: `Una **expresión** es una combinación de valores, variables y operadores que produce un resultado: \`precio * unidades\` es una expresión.
### Operadores aritméticos`
        },
        {
          t: "tabla",
          cab: ["Operador", "Operación", "Ejemplo"],
          filas: [
            ["`+`", "Suma (y concatenación de textos)", "`5 + 2` vale 7"],
            ["`-`", "Resta", "`5 - 2` vale 3"],
            ["`*`", "Multiplicación", "`5 * 2` vale 10"],
            ["`/`", "División", "`5 / 2` vale **2** (¡entera!); `5.0 / 2` vale 2.5"],
            ["`%`", "Resto de la división entera", "`17 % 5` vale 2"]
          ]
        },
        {
          t: "aviso",
          tipo: "cuidado",
          titulo: "La división entera",
          md: "Si **los dos operandos son enteros**, la división es **entera**: se descartan los decimales. `7 / 2` vale `3`, no `3.5`. Si necesitas decimales, **al menos uno** de los dos operandos debe ser decimal: `7.0 / 2` vale `3.5`."
        },
        {
          t: "texto",
          md: "La combinación de `/` y `%` es muy útil: por ejemplo, para pasar minutos a horas y minutos."
        },
        {
          t: "codigo",
          titulo: "DuracionAlquiler.java",
          code: `public class DuracionAlquiler {
    public static void main(String[] args) {
        int minutos = 145;
        int horas = minutos / 60;     // 2
        int resto = minutos % 60;     // 25
        System.out.println(minutos + " minutos son " + horas + " h y " + resto + " min");
    }
}`,
          ejecutable: true
        },
        {
          t: "predecir",
          p: "Calcula primero a mano y comprueba después. ¿Qué muestra?",
          code: `int a = 7, b = 2;
System.out.println(a / b);
System.out.println(a % b);
System.out.println((double) a / b);
System.out.println(a / (double) b);`,
          salida: `3
1
3.5
3.5`,
          e: "`7 / 2` es división entera (3) y `7 % 2` es el resto (1). Al convertir uno de los operandos a `double`, la división es decimal."
        },
        {
          t: "texto",
          md: `### Concatenación
Si uno de los operandos de \`+\` es un \`String\`, el resultado es un texto que une ambos. Las expresiones se evalúan **de izquierda a derecha**, y eso tiene consecuencias.`
        },
        {
          t: "predecir",
          p: "¿Qué muestran estas tres líneas?",
          code: `System.out.println("Total: " + 2 + 3);
System.out.println("Total: " + (2 + 3));
System.out.println(2 + 3 + " unidades");`,
          salida: `Total: 23
Total: 5
5 unidades`,
          e: "En la primera, `\"Total: \" + 2` ya es un texto y después se le añade `3`. Con paréntesis se suma primero. En la tercera, `2 + 3` se suma antes de llegar al texto."
        },
        {
          t: "texto",
          md: `### Asignación, incremento y decremento
\`x += 5;\` equivale a \`x = x + 5;\` (igual con \`-=\`, \`*=\`, \`/=\`, \`%=\`). \`x++\` y \`++x\` equivalen a \`x = x + 1;\`. Usados **solos** en una sentencia hacen lo mismo; dentro de una expresión se diferencian: \`++x\` incrementa **antes** de usar el valor y \`x++\`, **después**.`
        },
        {
          t: "traza",
          p: "**Sigue las tres variables.** Rellena los valores tras cada línea.",
          code: `int a = 5;          // línea 1
int b = a++;        // línea 2
int c = ++a;        // línea 3`,
          cols: ["Después de la línea", "a", "b", "c"],
          filas: [
            [
              { dado: "1" },
              "5",
              { dado: "—" },
              { dado: "—" }
            ],
            [
              { dado: "2" },
              "6",
              "5",
              { dado: "—" }
            ],
            [
              { dado: "3" },
              "7",
              "5",
              "7"
            ]
          ],
          e: "`b = a++` guarda **primero** el 5 y después incrementa `a` a 6. `c = ++a` incrementa **antes** (a = 7) y guarda 7."
        },
        {
          t: "profundizar",
          titulo: "¿Cuánto vale `-7 % 3`: 2 o −1?",
          bloques: [
            {
              t: "texto",
              md: "En Java vale **−1**. El resto tiene el **signo del dividendo** (el número de la izquierda). Si vienes de la aritmética modular (donde −7 ≡ 2 mod 3), cuidado: aquí `%` es el *resto de la división entera con truncamiento hacia cero*, no el módulo matemático. Para obtener un módulo no negativo existe `Math.floorMod(-7, 3)`, que vale 2."
            },
            {
              t: "codigo",
              code: `System.out.println(-7 % 3);
System.out.println(7 % -3);
System.out.println(Math.floorMod(-7, 3));`,
              ejecutable: true
            }
          ]
        },
        {
          t: "texto",
          md: `### Relacionales y lógicos
Los **relacionales** comparan y devuelven un \`boolean\`: \`==\`, \`!=\`, \`<\`, \`<=\`, \`>\`, \`>=\`. Los **lógicos** combinan booleanos: \`&&\` (Y), \`||\` (O) y \`!\` (NO).`
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "No confundas `=` (asignar) con `==` (comparar). Y no uses `==` para comparar **textos**: en la UT2 verás por qué y cómo hacerlo bien."
        },
        {
          t: "test",
          p: "¿Cuánto vale `5 + 3 * 2 > 10 && !(4 % 2 == 1)`?",
          o: ["`true`", "`false`", "Da un error de compilación", "`11`"],
          c: 0,
          e: "`3 * 2 = 6`, `5 + 6 = 11 > 10` → `true`. `4 % 2 == 1` es `false`, y `!false` es `true`. `true && true` → `true`."
        },
        {
          t: "profundizar",
          titulo: "¿Qué es el cortocircuito y para qué sirve?",
          bloques: [
            {
              t: "texto",
              md: "Java evalúa `&&` y `||` en **cortocircuito**: si con el primer operando ya se sabe el resultado, **no evalúa el segundo**. Esto no es solo una optimización: te protege de errores. En `d != 0 && n / d > 2`, si `d` vale 0 el primer operando es falso y la división (que lanzaría un error) **nunca se ejecuta**."
            },
            {
              t: "codigo",
              code: `int n = 10, d = 0;
System.out.println(d != 0 && n / d > 2);
System.out.println(d == 0 || n / d > 2);`,
              ejecutable: true
            }
          ]
        },
        {
          t: "ordenar",
          p: "Ordena los operadores de **mayor a menor** precedencia (el primero se evalúa antes).",
          items: [
            "Paréntesis ( )",
            "Unarios: ++ -- !",
            "Multiplicativos: * / %",
            "Aditivos: + -",
            "Relacionales: < <= > >=",
            "Igualdad: == !=",
            "Lógicos: && y después ||",
            "Asignación: = += -="
          ],
          e: "Ante la duda, **usa paréntesis**: hacen el código más claro y no cuesta nada."
        },
        {
          t: "huecos",
          p: "Completa el operador ternario: «Disponible» si hay stock y «Agotado» si no.",
          codigo: "String estado = stock > 0 {{?}} \"Disponible\" {{:}} \"Agotado\";",
          e: "`condición ? valorSiTrue : valorSiFalse`."
        },
        {
          t: "ejecuta",
          p: `**Corrige la media.** Este programa calcula la media de tres notas enteras (7, 8 y 8), pero muestra \`7.0\` en lugar de \`7.666666666666667\`. Encuentra el error de la división entera y corrígelo para que muestre:
\`\`\`
Media: 7.666666666666667
\`\`\``,
          inicial: `public class MediaNotas {
    public static void main(String[] args) {
        int n1 = 7;
        int n2 = 8;
        int n3 = 8;
        double media = (n1 + n2 + n3) / 3;
        System.out.println("Media: " + media);
    }
}`,
          tests: [
            { out: "Media: 7.666666666666667" }
          ],
          pistas: [
            "`(n1 + n2 + n3)` es un `int` (23) y `3` también: la división es entera.",
            "Basta con que uno de los dos operandos sea decimal: `3.0`."
          ],
          solucion: `public class MediaNotas {
    public static void main(String[] args) {
        int n1 = 7;
        int n2 = 8;
        int n3 = 8;
        double media = (n1 + n2 + n3) / 3.0;
        System.out.println("Media: " + media);
    }
}`,
          explicacion: "Aunque la variable `media` sea `double`, la división se hace **antes** de guardarla: `23 / 3` vale 7 y luego se convierte a `7.0`."
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "La **lógica booleana** que ya conoces (tablas de verdad, leyes de De Morgan: `!(a && b)` equivale a `!a || !b`) tiene uso real constante: simplificar condiciones de negocio. Una regla legible vale oro: `puedeAlquilar = esSocio && !tieneDeuda` se entiende; `!(!esSocio || tieneDeuda)` es equivalente pero nadie quiere mantenerla.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Reloj de la tienda: segundos a días, horas, minutos y segundos",
          p: `El contador de una máquina de alquiler guarda el tiempo de uso total en **segundos** (\`long segundos = 1_000_000\`). Descomponlo en días, horas, minutos y segundos y muéstralo así:
\`\`\`
11 d 13 h 46 m 40 s
\`\`\``,
          requisitos: [
            "Usa constantes con nombre para 60, 3600 y 86400 (nada de números mágicos)",
            "Usa solo `/` y `%`, sin bucles",
            "Debe funcionar con cualquier valor de `segundos` (cámbialo y compruébalo)"
          ],
          inicial: `public class Reloj {
    public static void main(String[] args) {
        long segundos = 1_000_000;
        // descompón usando / y %
    }
}`,
          tests: [
            { out: "11 d 13 h 46 m 40 s" }
          ],
          pistas: [
            "Días = segundos / 86400. ¿Qué te queda después? El **resto** de esa división.",
            "Repite el patrón «dividir y quedarte con el resto» para horas y minutos."
          ],
          solucion: `public class Reloj {
    public static void main(String[] args) {
        final long SEG_MIN = 60;
        final long SEG_HORA = 60 * SEG_MIN;
        final long SEG_DIA = 24 * SEG_HORA;
        long segundos = 1_000_000;
        long dias = segundos / SEG_DIA;
        long resto = segundos % SEG_DIA;
        long horas = resto / SEG_HORA;
        resto = resto % SEG_HORA;
        long minutos = resto / SEG_MIN;
        long seg = resto % SEG_MIN;
        System.out.println(dias + " d " + horas + " h " + minutos + " m " + seg + " s");
    }
}`,
          rubrica: [
            "Las tres constantes están calculadas a partir de 60 (no escritas a mano)",
            "Probaste con 0, 59, 60 y 86400 segundos",
            "Los nombres de variables explican lo que guardan"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos los **operadores y expresiones**: lo que más fallos provoca en los exámenes.",
        inicial: [
          {
            p: "¿Cuánto vale `9 / 2` en Java?",
            o: ["4.5", "4", "5", "4.0"],
            c: 1,
            e: "Los dos operandos son enteros: división entera, se descartan los decimales."
          },
          {
            p: "¿Qué muestra `System.out.println(1 + 2 + \"a\" + 1 + 2);`?",
            o: ["`12a12`", "`3a12`", "`3a3`", "`1+2a1+2`"],
            c: 1,
            e: "De izquierda a derecha: `1 + 2 = 3`; `3 + \"a\" = \"3a\"`; después `\"3a\" + 1` y `+ 2` concatenan."
          },
          {
            p: "Con `int x = 4;`, ¿qué vale `y` después de `int y = x++;`?",
            o: ["5", "4", "3", "Da error"],
            c: 1,
            e: "`x++` entrega el valor **anterior** (4) y luego incrementa `x`."
          }
        ],
        pasos: [
          {
            titulo: "La división entera",
            cubre: [0],
            explica: "Con dos enteros, `/` **descarta la parte decimal** (no redondea): `9 / 2` es 4 y `-9 / 2` es −4. `%` da el resto: `9 % 2` es 1. Si quieres decimales, que **un** operando sea decimal: `9 / 2.0 = 4.5` o `(double) 9 / 2 = 4.5`.",
            pregunta: {
              p: "¿Qué muestra `System.out.println(10 / 4 * 2.0);`?",
              o: ["5.0", "4.0", "5.0 con decimales infinitos", "4"],
              c: 1,
              e: "`10 / 4` = 2 (entera) y `2 * 2.0` = 4.0. Se evalúa de izquierda a derecha.",
              pista: "Primero se hace `10 / 4`: ¿ambos son enteros?"
            },
            extra: "Regla de oro: **mira el tipo de los dos operandos antes de dividir**. Si son enteros, el resultado será entero aunque lo guardes después en un `double`."
          },
          {
            titulo: "Concatenar o sumar: de izquierda a derecha",
            cubre: [1],
            explica: "`+` suma números, pero si **uno de los dos lados es un texto**, concatena. Se evalúa de izquierda a derecha, así que `1 + 2 + \"a\"` da `\"3a\"` pero `\"a\" + 1 + 2` da `\"a12\"`. Los paréntesis cambian el orden: `\"a\" + (1 + 2)` da `\"a3\"`.",
            pregunta: {
              p: "¿Qué muestra `System.out.println(\"x\" + 1 + 1);`?",
              o: ["`x2`", "`x11`", "`2x`", "`x 1 1`"],
              c: 1,
              e: "`\"x\" + 1` = `\"x1\"`, y después `\"x1\" + 1` = `\"x11\"`."
            }
          },
          {
            titulo: "Incremento: antes o después",
            cubre: [2],
            explica: "`x++` = «usa el valor de `x` y **luego** súmale 1». `++x` = «súmale 1 y **luego** usa el valor». Solos en una línea son idénticos; la diferencia solo se nota cuando el resultado se usa en una expresión.",
            ejemplo: {
              code: `int a = 5;
int b = a++;
int c = ++a;
System.out.println(a + " " + b + " " + c);`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "Con `int n = 1; int m = n++ + ++n;` ¿cuánto vale `m`?",
              o: ["2", "3", "4", "5"],
              c: 2,
              e: "`n++` entrega 1 y n pasa a 2; `++n` pasa n a 3 y entrega 3. `1 + 3 = 4`. (Y por eso no se escriben expresiones así.)"
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Tienes \`int minutos = 200;\` de alquiler. Calcula las **horas completas** y los **minutos sueltos** y muestra:
 \`\`\`
 3 h 20 min
 \`\`\`
 `,
          inicial: `
 public class HorasMinutos {
     public static void main(String[] args) {
         int minutos = 200;
         // calcula horas y minutos sueltos
     }
 }
 `,
          tests: [
            { out: "3 h 20 min" }
          ],
          solucion: `
 public class HorasMinutos {
     public static void main(String[] args) {
         int minutos = 200;
         int horas = minutos / 60;
         int sueltos = minutos % 60;
         System.out.println(horas + " h " + sueltos + " min");
     }
 }
 `,
          pistas: [
            "Las horas completas son la división **entera** entre 60.",
            "Los minutos sueltos son el **resto** de esa división."
          ]
        }
      }
    },

    {
      id: "ut1-conversiones",
      titulo: "Conversiones de tipo",
      resumen: "Pasar un dato de un tipo a otro: cuándo es automático, cuándo hay que pedirlo y qué se puede perder.",
      bloques: [
        {
          t: "texto",
          md: `A veces hay que pasar un dato de un tipo a otro. Hay dos clases de conversión.
### Conversión implícita (automática)
Java convierte solo de un tipo «pequeño» a uno «grande» porque **no se pierde información** (*ampliación*): \`byte → short → int → long → float → double\`, y \`char → int\`. También ocurre dentro de las expresiones: si se mezclan tipos, el resultado es del tipo más grande. Por eso \`7.0 / 2\` da \`3.5\`: el \`2\` se convierte a \`double\`.`
        },
        {
          t: "ordenar",
          p: "Ordena los tipos numéricos de **menor a mayor** (el sentido de la conversión automática).",
          items: ["byte", "short", "int", "long", "float", "double"],
          codigo: true,
          e: "De izquierda a derecha, cada tipo «cabe» en el siguiente sin perder información (con matices en `long → float`, que veremos más adelante)."
        },
        {
          t: "texto",
          md: `### Conversión explícita (casting)
Para pasar de un tipo grande a uno pequeño hay que **pedirlo expresamente**, con el tipo destino entre paréntesis. Se puede **perder información**:`
        },
        {
          t: "codigo",
          titulo: "Conversiones.java",
          code: `public class Conversiones {
    public static void main(String[] args) {
        double precio = 249.90;
        int euros = (int) precio;              // se descartan los decimales (no redondea)
        int a = 7, b = 2;
        double media = (double) a / b;         // se convierte a antes de dividir
        double malMedia = (double) (a / b);    // la división entera ya se ha hecho
        char letra = (char) 66;                // cada carácter tiene un código numérico
        int codigo = 'A';                      // char -> int (implícita)
        System.out.println(euros + " " + media + " " + malMedia + " " + letra + " " + codigo);
    }
}`,
          ejecutable: true
        },
        {
          t: "predecir",
          p: "¿Qué muestra este programa?",
          code: `double precio = 19.99;
int entero = (int) precio;
long grande = entero;
double dec = grande;
System.out.println(entero + " " + grande + " " + dec);`,
          salida: "19 19 19.0",
          e: "`(int) 19.99` trunca a 19. Después `int → long → double` son conversiones automáticas: el valor se mantiene y solo cambia la forma de escribirlo (`19.0`)."
        },
        {
          t: "test",
          p: "¿Cuánto vale `(int) -2.99`?",
          o: ["`-3`", "`-2`", "`-2.99`", "`3`"],
          c: 1,
          e: "El casting **trunca hacia cero**: no redondea. `-2.99` pasa a `-2` (y `2.99` pasa a `2`)."
        },
        {
          t: "test",
          p: "`double media = (double) (a / b);` con `a = 7` y `b = 2`, ¿cuánto vale `media`?",
          o: ["`3.5`", "`3.0`", "`3`", "`4.0`"],
          c: 1,
          e: "Los paréntesis hacen que la división entera (`7 / 2 = 3`) se haga **antes** del casting. Para obtener 3.5 hay que escribir `(double) a / b`."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          titulo: "Desbordamiento",
          md: "Si el valor no cabe en el tipo destino, el resultado no tiene sentido: `(byte) 200` vale `-56`. **Java no avisa**: es responsabilidad del programador. Lo mismo pasa con `Integer.MAX_VALUE + 1`, que da un número negativo."
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `(byte) 200` vale −56?",
          bloques: [
            {
              t: "texto",
              md: "Los enteros se guardan en **complemento a dos**. Al convertir a `byte`, Java se queda con los **8 bits menos significativos**: 200 = `11001000` en binario, que interpretado como `byte` con signo es 200 − 256 = −56. Es aritmética módulo 2⁸. Del mismo modo, `Integer.MAX_VALUE + 1` da `Integer.MIN_VALUE`."
            },
            {
              t: "codigo",
              code: `System.out.println((byte) 200);
System.out.println((byte) 128);
System.out.println(Integer.MAX_VALUE + 1);
System.out.println((int) 3_000_000_000L);`,
              ejecutable: true
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Y de texto a número?",
          bloques: [
            {
              t: "texto",
              md: "`\"25\"` es un `String`, no un número: **no se puede convertir con un casting**. Se hace con métodos como `Integer.parseInt(\"25\")` (lo verás en la UT2). Al revés, de número a texto, basta con concatenar: `\"\" + 25`."
            }
          ]
        },
        {
          t: "ejecuta",
          p: `**La letra siguiente.** Dada \`char letra = 'k';\`, calcula la letra siguiente del alfabeto y muestra la letra y su código numérico:
\`\`\`
Siguiente: l (108)
\`\`\``,
          inicial: `public class LetraSiguiente {
    public static void main(String[] args) {
        char letra = 'k';
        // calcula la siguiente letra (¡cuidado con el tipo!)
    }
}`,
          tests: [
            { out: "Siguiente: l (108)" }
          ],
          pistas: [
            "`letra + 1` es un `int` (los `char` se promocionan en las operaciones).",
            "Necesitas un casting `(char)` para guardarlo de nuevo en un `char`; y una conversión implícita `char → int` para el código."
          ],
          solucion: `public class LetraSiguiente {
    public static void main(String[] args) {
        char letra = 'k';
        char siguiente = (char) (letra + 1);
        int codigo = siguiente;
        System.out.println("Siguiente: " + siguiente + " (" + codigo + ")");
    }
}`,
          explicacion: "`letra + 1` produce un `int`; para guardarlo en un `char` hay que hacer el casting explícito, porque se pasa de un tipo grande a uno pequeño."
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Los **errores de desbordamiento silenciosos** son una clásica fuente de fallos graves en producción (contadores que dan la vuelta, importes negativos, el famoso *Y2K38*). Java ofrece `Math.addExact`, `Math.multiplyExact`… que **lanzan una excepción** si hay desbordamiento. Cuando manejes dinero, tiempos o identificadores, piensa siempre: «¿cuál es el valor máximo posible de esta variable y qué pasa si lo supero?».",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Segundos en 70 años: el desbordamiento en acción",
          p: `Un sistema de reservas guarda duraciones en segundos. Calcula cuántos **segundos hay en 70 años** (de 365 días) de dos formas y muestra los dos resultados. Observa qué ocurre con \`int\`:
\`\`\`
Con int: -2087447296
Con long: 2207520000
\`\`\`
Después, responde por escrito en un comentario del código **por qué** el resultado con \`int\` es negativo.`,
          requisitos: [
            "Una variable `int` y una `long` calculadas con la misma operación",
            "En la versión `long`, **basta con que un solo factor sea `long`** (`70L`): explica por qué en un comentario",
            "Un comentario explica por qué el `int` sale negativo"
          ],
          inicial: `public class SegundosEnSetentaAnios {
    public static void main(String[] args) {
        // 70 años * 365 días * 24 h * 60 min * 60 s
    }
}`,
          tests: [
            {
              out: `Con int: -2087447296
Con long: 2207520000`
            }
          ],
          pistas: [
            "El resultado real es 2.207.520.000. ¿Cuál es el mayor `int`?",
            "Con `70L * 365 * ...` toda la cadena se calcula en `long`: la promoción sube de tipo en cada operación."
          ],
          solucion: `public class SegundosEnSetentaAnios {
    public static void main(String[] args) {
        int conInt = 70 * 365 * 24 * 60 * 60;
        long conLong = 70L * 365 * 24 * 60 * 60;
        System.out.println("Con int: " + conInt);
        System.out.println("Con long: " + conLong);
        // El resultado real (2.207.520.000) supera Integer.MAX_VALUE (2.147.483.647):
        // el int «da la vuelta» (complemento a dos) y se vuelve negativo.
    }
}`,
          rubrica: [
            "Tu explicación menciona el valor máximo de `int` (2.147.483.647)",
            "Entiendes que el desbordamiento no produce ningún error: Java sigue sin avisar"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Repasemos las **conversiones de tipo**: cuándo son automáticas, cuándo hay que pedirlas y qué se pierde.",
        inicial: [
          {
            p: "¿Qué hace `(int) 7.9`?",
            o: ["Da 8", "Da 7", "Da 7.9", "Error de compilación"],
            c: 1,
            e: "El casting trunca, no redondea."
          },
          {
            p: "¿Compila `int x = 3.5;`?",
            o: [
              "Sí, `x` vale 3",
              "Sí, `x` vale 4",
              "No: hace falta un casting explícito porque se pierde información",
              "No: los `int` no pueden tener valor"
            ],
            c: 2,
            e: "Pasar de `double` a `int` pierde información: Java exige que lo pidas con `(int)`."
          },
          {
            p: "¿Qué muestra `System.out.println((char) ('a' + 2));`?",
            o: ["`99`", "`c`", "`a2`", "Error"],
            c: 1,
            e: "`'a' + 2` es el `int` 99; el casting `(char)` lo convierte en el carácter `'c'`."
          }
        ],
        pasos: [
          {
            titulo: "Automática: de pequeño a grande",
            cubre: [1],
            explica: "`byte → short → int → long → float → double` (y `char → int`) se hace **sola**, sin perder información. Por eso puedes escribir `double d = 5;` (vale `5.0`) o `long l = 7;`.",
            pregunta: {
              p: "¿Cuál de estas líneas compila sin casting?",
              o: ["`int a = 2.0;`", "`long b = 5;`", "`char c = 70000;`", "`byte d = 1000;`"],
              c: 1,
              e: "`int → long` es una ampliación automática. Las demás pierden información o no caben.",
              pista: "Busca la que va de un tipo pequeño a uno grande."
            }
          },
          {
            titulo: "Explícita: el casting",
            cubre: [0, 2],
            explica: "De grande a pequeño hay que **pedirlo**: `(int) precio`, `(char) 66`. Es una orden al compilador: «sé lo que hago, aunque pierda información». El casting a `int` **trunca** los decimales (no redondea) y `(byte) 200` da `-56` porque no cabe.",
            ejemplo: {
              code: `System.out.println((int) 7.9);
System.out.println((int) -7.9);
System.out.println((char) 99);
System.out.println((byte) 130);`,
              ejecutable: true,
              titulo: "Pruébalo"
            },
            pregunta: {
              p: "¿Qué da `(int) -7.9`?",
              o: ["`-8`", "`-7`", "`7`", "`-7.9`"],
              c: 1,
              e: "Trunca hacia cero.",
              pista: "El casting solo descarta la parte decimal."
            }
          },
          {
            titulo: "El orden importa: casting y paréntesis",
            cubre: [0, 1],
            explica: "El casting se aplica **al elemento que tiene a su derecha**: `(double) a / b` convierte `a` y la división ya es decimal; `(double) (a / b)` hace primero la división entera y luego convierte. Es una trampa clásica.",
            pregunta: {
              p: "Con `int a = 9, b = 2;`, ¿qué vale `(double) a / b`?",
              o: ["`4.0`", "`4.5`", "`4`", "`4.25`"],
              c: 1,
              e: "`(double) a` es 9.0 y `9.0 / 2 = 4.5`."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Tienes \`double precio = 249.90;\`. Calcula los **euros enteros** y los **céntimos** como enteros (sin usar \`Math\`) y muestra:
 \`\`\`
 249 euros y 90 centimos
 \`\`\`
 *Pista de diseño:* los decimales de un \`double\` pueden dar sorpresas; ¿cómo evitas que 90 salga como 89?
 `,
          inicial: `
 public class PrecioPartido {
     public static void main(String[] args) {
         double precio = 249.90;
         // euros enteros y céntimos
     }
 }
 `,
          tests: [
            { out: "249 euros y 90 centimos" }
          ],
          solucion: `
 public class PrecioPartido {
     public static void main(String[] args) {
         double precio = 249.90;
         int euros = (int) precio;
         int centimos = (int) ((precio - euros) * 100 + 0.5);
         System.out.println(euros + " euros y " + centimos + " centimos");
     }
 }
 `,
          pistas: [
            "Los euros son `(int) precio`.",
            "Los céntimos son `(precio - euros) * 100`, pero el resultado puede ser 89,99999… Suma 0,5 antes del casting para «redondear»."
          ]
        }
      }
    },

    {
      id: "ut1-comentarios",
      titulo: "Comentarios y buenas prácticas",
      resumen: "Documentar el código para las personas: qué comentar y qué no.",
      bloques: [
        {
          t: "texto",
          md: "Los **comentarios** son texto que el compilador **ignora**. Sirven para explicar el código a las personas. Java tiene tres tipos:"
        },
        {
          t: "codigo",
          titulo: "Los tres tipos",
          code: `// Comentario de una línea

/* Comentario de
   varias líneas */

/**
 * Comentario de documentación (Javadoc).
 * Calcula el precio de alquiler de material náutico.
 * @author Laura Martínez
 */
public class Alquiler {
    // ...
}`
        },
        {
          t: "texto",
          md: "Los comentarios **Javadoc** (`/** ... */`) se colocan antes de clases y métodos, y con ellos se genera automáticamente la documentación del proyecto (lo trabajarás en Entornos de desarrollo)."
        },
        {
          t: "aviso",
          tipo: "clave",
          md: `**Buenas prácticas**
- Comenta el **porqué**, no el **qué**: \`i++; // suma 1 a i\` no aporta nada; \`// 3 días o más: tarifa semanal\` sí.
- Un buen nombre de variable ahorra comentarios.
- Pon al principio de cada archivo un comentario con **qué hace el programa y quién lo ha escrito**.
- Si cambias el código, **actualiza el comentario**: un comentario falso es peor que ninguno.`
        },
        {
          t: "test",
          p: "¿Cuál de estos comentarios aporta más valor?",
          o: [
            "`x = x + 1; // incrementa x`",
            "`// TARIFA SEMANAL: a partir de 3 días sale más barato que pagar por días`",
            "`// aquí empieza el programa`",
            "`// esto es una variable`"
          ],
          c: 1,
          e: "Explica el **porqué** de una decisión de negocio, que no se ve leyendo el código. Los otros repiten lo que ya dice el código."
        },
        {
          t: "abierta",
          p: "Explica con tus palabras **cuándo conviene comentar** y cuándo es mejor mejorar el nombre de una variable. Pon un ejemplo de cada caso.",
          modelo: "Conviene comentar el **porqué** de una decisión que no se deduce del código: una regla de negocio (`// 3 días o más: tarifa semanal`), una trampa conocida o una razón histórica. Cuando el comentario solo describe **qué** hace la línea (`i++; // suma 1`), es mejor mejorar el código: un nombre como `diasAlquiler` en lugar de `d` hace innecesario explicar qué guarda la variable. Además, el comentario que se queda desactualizado es peor que ninguno.",
          rubrica: [
            "Distingues «qué» de «porqué»",
            "Das un ejemplo real de comentario útil",
            "Das un ejemplo de nombre de variable que sustituye a un comentario"
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "**Un comentario es una deuda.** Cada comentario hay que mantenerlo igual que el código. Los equipos profesionales prefieren código que se explique solo (nombres claros, métodos pequeños) y reservan los comentarios para el *porqué*. Los `// TODO:` y `// FIXME:` son habituales, pero un TODO sin dueño ni fecha se queda ahí cinco años: anota quién lo hará y cuándo. Y recuerda: **el código comentado no se deja en el repositorio**; para eso existe el control de versiones (Git).",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Refactoriza: de código ilegible a código profesional",
          p: `Este programa **funciona**, pero está escrito sin cuidado: nombres sin sentido, números mágicos y ningún comentario. Reescríbelo **sin cambiar lo que muestra**: nombres claros, constantes para los valores de negocio y un comentario inicial (qué hace y quién lo escribe). Debe seguir mostrando:
\`\`\`
Total: 85.5 euros
\`\`\``,
          requisitos: [
            "Nombres de clase y variables significativos y con la convención correcta",
            "Constantes `final` para el precio por hora y la fianza",
            "Un comentario Javadoc al principio con el autor",
            "La salida no cambia"
          ],
          inicial: `public class P {
    public static void main(String[] a) {
        double x = 12.5;
        int y = 3;
        double z = x * y * 1.0 + 48;
        System.out.println("Total: " + z + " euros");
    }
}`,
          tests: [
            { out: "Total: 85.5 euros" }
          ],
          solucion: `/**
 * Calcula el total de un alquiler: 3 horas de kayak más la fianza fija.
 * @author Tu Nombre
 */
public class TotalAlquiler {
    public static void main(String[] args) {
        final double PRECIO_HORA = 12.5;
        final double FIANZA = 48;
        int horas = 3;
        double total = PRECIO_HORA * horas + FIANZA;
        System.out.println("Total: " + total + " euros");
    }
}`,
          explicacion: "`x * y * 1.0 + 48` esconde: `1.0` no hace nada (número mágico inútil) y `48` es una fianza. Refactorizar es mejorar la forma **sin cambiar el comportamiento**.",
          rubrica: [
            "Ningún valor numérico suelto en las operaciones",
            "Ningún comentario repite lo que ya dice el código",
            "Sabrías explicar qué hace el programa solo leyendo los nombres"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Última sección de la unidad: **comentarios y buenas prácticas**.",
        inicial: [
          {
            p: "¿Qué sintaxis tiene un comentario de **una sola línea**?",
            o: ["`/* texto */`", "`// texto`", "`# texto`", "`<!-- texto -->`"],
            c: 1,
            e: "`//` hasta el final de la línea."
          },
          {
            p: "¿Qué conviene comentar principalmente?",
            o: [
              "Cada línea, para que se entienda",
              "El porqué de las decisiones que no se ven en el código",
              "Solo el nombre del autor",
              "Nada: los comentarios están prohibidos"
            ],
            c: 1,
            e: "Comenta el **porqué**, no el **qué**."
          }
        ],
        pasos: [
          {
            titulo: "Qué comentar y qué no",
            cubre: [0, 1],
            explica: "El código ya dice **qué** hace. Los comentarios sirven para el **porqué**: reglas de negocio, decisiones, trampas. Y todo archivo debería empezar con qué hace y quién lo escribió. Un comentario desactualizado es peor que ninguno.",
            pregunta: {
              p: "¿Cuál es un buen comentario?",
              o: [
                "`i++; // suma 1`",
                "`// Descuento del 15 % por acuerdo con el club náutico (contrato 2026)`",
                "`// variable`",
                "`// fin del main`"
              ],
              c: 1,
              e: "Explica una razón que no está en el código."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Escribe un programa \`Cabecera\` que muestre \`Hola, Náutica Bahía\` y que empiece con un comentario **Javadoc** que diga qué hace y quién lo escribe (el comentario no se ve en la salida).
 `,
          inicial: `
 public class Cabecera {
     public static void main(String[] args) {
     }
 }
 `,
          tests: [
            { out: "Hola, Náutica Bahía" }
          ],
          solucion: `
 /**
  * Muestra un saludo de bienvenida.
  * @author Tu Nombre
  */
 public class Cabecera {
     public static void main(String[] args) {
         System.out.println("Hola, Náutica Bahía");
     }
 }
 `,
          pistas: ["Un comentario Javadoc empieza con `/**` y termina con `*/`."]
        }
      }
    }

  ],

  /* ============ BANCO DE PREGUNTAS PARA LA AUTOEVALUACIÓN (+1 / −1/3 / 0) ============ */
  banco: [
    {
      sec: "ut1-estructura",
      p: "¿Qué contiene el archivo `.class` que genera el compilador?",
      o: [
        "El código fuente en Java",
        "El bytecode que ejecuta la JVM",
        "Código máquina específico de Windows",
        "La documentación del proyecto"
      ],
      c: 1,
      e: "El compilador (`javac`) traduce el código fuente a bytecode, que ejecuta la máquina virtual."
    },
    {
      sec: "ut1-estructura",
      p: "¿Cuál es el punto de entrada de un programa Java?",
      o: [
        "El método `start`",
        "La primera clase del proyecto",
        "El método `public static void main(String[] args)`",
        "La primera variable declarada"
      ],
      c: 2,
      e: "Java empieza a ejecutar por el método `main`."
    },
    {
      sec: "ut1-estructura",
      p: "Un archivo `Tienda.java` contiene `public class Almacen`. ¿Qué ocurre al compilarlo?",
      o: [
        "Compila bien",
        "Error: la clase pública debe llamarse igual que el archivo",
        "Se compila pero no se ejecuta",
        "Java renombra la clase"
      ],
      c: 1,
      e: "Una clase `public` debe estar en un archivo con su mismo nombre."
    },
    {
      sec: "ut1-estructura",
      p: "¿Qué diferencia hay entre `System.out.print` y `System.out.println`?",
      o: [
        "`println` muestra el texto y salta de línea; `print` no",
        "`print` solo admite números",
        "`println` necesita comillas simples",
        "No hay diferencia"
      ],
      c: 0,
      e: "`println` añade un salto de línea al final."
    },
    {
      sec: "ut1-estructura",
      p: "¿Qué sentencia produce un error de compilación?",
      o: [
        "`System.out.println(\"Hola\");`",
        "`System.out.println(\"Hola\")`",
        "`System.out.print(\"Hola\");`",
        "`System.out.println(5);`"
      ],
      c: 1,
      e: "Falta el `;` al final de la sentencia."
    },
    {
      sec: "ut1-estructura",
      p: `¿Qué muestra este código?
\`\`\`
System.out.print("A");
System.out.println("B");
System.out.print("C");
\`\`\``,
      o: [
        "`A`, `B`, `C` en tres líneas",
        "`AB` y, sin salto, `C`",
        "`A` y `BC` en dos líneas",
        "`ABC` en una línea y un salto final"
      ],
      c: 1,
      e: "Solo `println(\"B\")` salta de línea; el último `print` no.",
      salida: `AB
C`
    },
    {
      sec: "ut1-estructura",
      p: "¿Qué es una sentencia en Java?",
      o: [
        "Cada instrucción, que termina en `;`",
        "Un conjunto de llaves",
        "Un comentario",
        "El nombre de un archivo"
      ],
      c: 0,
      e: "Las sentencias son las instrucciones individuales y terminan en punto y coma."
    },
    {
      sec: "ut1-variables",
      p: "Tras `int a = 3; a = a + 4;`, ¿cuánto vale `a`?",
      o: ["3", "4", "7", "Error: no se puede reasignar"],
      c: 2,
      e: "Se calcula 3 + 4 y se guarda de nuevo en `a`."
    },
    {
      sec: "ut1-variables",
      p: "¿Cuál es un nombre de variable válido?",
      o: ["`1er_dia`", "`dias totales`", "`diasTotales`", "`double`"],
      c: 2,
      e: "No puede empezar por número, tener espacios ni ser palabra reservada."
    },
    {
      sec: "ut1-variables",
      p: "¿Qué convención se usa para los nombres de **clases** en Java?",
      o: ["`UpperCamelCase`", "`lowerCamelCase`", "`MAYUSCULAS_CON_GUIONES`", "`snake_case`"],
      c: 0,
      e: "Las clases usan UpperCamelCase (`CalculadoraIva`)."
    },
    {
      sec: "ut1-variables",
      p: "Declaras una variable dentro de un bloque `{ }` y la usas después de cerrarlo. ¿Qué pasa?",
      o: [
        "Funciona igual",
        "Error: la variable no existe fuera del bloque",
        "La variable vale 0",
        "Java avisa pero compila"
      ],
      c: 1,
      e: "El ámbito de una variable es el bloque en el que se declara."
    },
    {
      sec: "ut1-variables",
      p: `¿Qué ocurre con este código?
\`\`\`
int stock;
System.out.println(stock);
\`\`\``,
      o: [
        "Muestra `0`",
        "Muestra `null`",
        "Error de compilación: variable no inicializada",
        "Muestra un valor aleatorio"
      ],
      c: 2,
      e: "Java no deja usar una variable local sin haberle asignado un valor."
    },
    {
      sec: "ut1-variables",
      p: "En `int x = 5; x = x * 2; x = x - 3;`, ¿cuánto vale `x` al final?",
      o: ["2", "7", "10", "5"],
      c: 1,
      e: "5 · 2 = 10 y 10 − 3 = 7.",
      salida: "7"
    },
    {
      sec: "ut1-variables",
      p: "¿Qué significa el signo `=` en Java?",
      o: [
        "Igualdad matemática",
        "Guardar en la variable de la izquierda el valor calculado a la derecha",
        "Comparar dos valores",
        "Declarar una constante"
      ],
      c: 1,
      e: "Es una asignación, no una comparación."
    },
    {
      sec: "ut1-tipos",
      p: "¿Qué tipo es adecuado para guardar un código postal como `04001`?",
      o: ["`int`", "`double`", "`String`", "`long`"],
      c: 2,
      e: "No se opera con él y puede empezar por 0: texto."
    },
    {
      sec: "ut1-tipos",
      p: "¿Cuál de estos literales es de tipo `char`?",
      o: ["`\"A\"`", "`'A'`", "`A`", "`65.0`"],
      c: 1,
      e: "Un carácter entre comillas simples."
    },
    {
      sec: "ut1-tipos",
      p: "¿Qué tipo tiene el literal `3.14`?",
      o: ["`float`", "`double`", "`int`", "`decimal`"],
      c: 1,
      e: "Los decimales sin sufijo son `double`."
    },
    {
      sec: "ut1-tipos",
      p: "¿Qué hace la palabra `final` en una declaración?",
      o: [
        "Impide que el valor se modifique después de asignarlo",
        "Acaba el programa",
        "Convierte la variable en `String`",
        "Hace que se muestre al final"
      ],
      c: 0,
      e: "`final` define una constante."
    },
    {
      sec: "ut1-tipos",
      p: "¿Cuántos valores puede tomar un `boolean`?",
      o: ["1", "2", "256", "Infinitos"],
      c: 1,
      e: "Solo `true` y `false`."
    },
    {
      sec: "ut1-tipos",
      p: "¿Qué muestra `System.out.println(\"a\\tb\");`?",
      o: ["`a\\tb`", "`a` y `b` separados por un tabulador", "`a`, salto de línea y `b`", "Error"],
      c: 1,
      e: "`\\t` es el tabulador."
    },
    {
      sec: "ut1-tipos",
      p: "¿Por qué conviene usar `final double IVA = 0.21;` en vez de escribir `0.21` por todo el código?",
      o: [
        "Porque es más rápido de ejecutar",
        "Porque el nombre explica el valor y se cambia en un solo sitio",
        "Porque Java no admite números sueltos",
        "Porque ocupa menos memoria"
      ],
      c: 1,
      e: "Evita los números mágicos y facilita el mantenimiento."
    },
    {
      sec: "ut1-tipos",
      p: "¿Qué muestra `System.out.println(0.1 + 0.2);`?",
      o: ["`0.3`", "`0.30000000000000004`", "`0.2`", "Error"],
      c: 1,
      e: "Los `double` se guardan en binario y 0,1 no es exacto.",
      nivel: "pro",
      salida: "0.30000000000000004"
    },
    {
      sec: "ut1-operadores",
      p: "¿Cuánto vale `17 % 5`?",
      o: ["3", "2", "3.4", "12"],
      c: 1,
      e: "El resto de dividir 17 entre 5 es 2.",
      salida: "2"
    },
    {
      sec: "ut1-operadores",
      p: "¿Qué muestra `System.out.println(9 / 2);`?",
      o: ["4.5", "4", "5", "4.0"],
      c: 1,
      e: "Los dos son enteros: división entera.",
      salida: "4"
    },
    {
      sec: "ut1-operadores",
      p: "¿Qué muestra `System.out.println(\"N: \" + 3 + 4);`?",
      o: ["`N: 7`", "`N: 34`", "`7`", "Error"],
      c: 1,
      e: "Se evalúa de izquierda a derecha: `\"N: \" + 3` ya es texto.",
      salida: "N: 34"
    },
    {
      sec: "ut1-operadores",
      p: "¿Qué muestra `System.out.println(3 + 4 + \" N\");`?",
      o: ["`34 N`", "`7 N`", "`N 7`", "Error"],
      c: 1,
      e: "`3 + 4` se suma antes de llegar al texto.",
      salida: "7 N"
    },
    {
      sec: "ut1-operadores",
      p: "Con `int a = 4;`, ¿qué valen `a` y `b` tras `int b = a++;`?",
      o: ["`a = 4`, `b = 5`", "`a = 5`, `b = 4`", "`a = 5`, `b = 5`", "`a = 4`, `b = 4`"],
      c: 1,
      e: "`a++` entrega el valor anterior y luego incrementa."
    },
    {
      sec: "ut1-operadores",
      p: "¿Cuánto vale la expresión `true || false && false`?",
      o: ["`true`", "`false`", "Error", "Depende del orden"],
      c: 0,
      e: "`&&` tiene mayor precedencia que `||`: `false && false` es `false` y `true || false` es `true`.",
      salida: "true"
    },
    {
      sec: "ut1-operadores",
      p: "¿Qué operador permite elegir entre dos valores según una condición?",
      o: ["`&&`", "`? :`", "`==`", "`%`"],
      c: 1,
      e: "El operador condicional (ternario): `cond ? a : b`."
    },
    {
      sec: "ut1-operadores",
      p: "¿Qué muestra `System.out.println(10 / 4 * 2.0);`?",
      o: ["5.0", "4.0", "5", "4"],
      c: 1,
      e: "`10 / 4` es 2 (entera) y `2 * 2.0` es 4.0.",
      salida: "4.0"
    },
    {
      sec: "ut1-operadores",
      p: "¿Cuánto vale `-7 % 3` en Java?",
      o: ["2", "-1", "1", "-2"],
      c: 1,
      e: "El resto toma el signo del dividendo.",
      nivel: "pro",
      salida: "-1"
    },
    {
      sec: "ut1-operadores",
      p: "¿Para qué sirve el cortocircuito de `&&`?",
      o: [
        "Para ejecutar más rápido siempre",
        "Para no evaluar el segundo operando si el primero ya es falso",
        "Para evaluar los dos operandos a la vez",
        "Para convertir a booleano"
      ],
      c: 1,
      e: "Si el primer operando es falso, el resultado ya es falso. Evita, p. ej., dividir entre cero.",
      nivel: "pro"
    },
    {
      sec: "ut1-conversiones",
      p: "¿Qué vale `(int) 8.9`?",
      o: ["9", "8", "8.9", "Error"],
      c: 1,
      e: "El casting trunca.",
      salida: "8"
    },
    {
      sec: "ut1-conversiones",
      p: "¿Cuál de estas líneas compila **sin** casting?",
      o: ["`int a = 2.5;`", "`long b = 10;`", "`byte c = 300;`", "`char d = 70000;`"],
      c: 1,
      e: "`int → long` es una ampliación automática."
    },
    {
      sec: "ut1-conversiones",
      p: "Con `int a = 7, b = 2;`, ¿cuánto vale `(double) a / b`?",
      o: ["3.0", "3.5", "3", "4.0"],
      c: 1,
      e: "`(double) a` es 7.0 y la división es decimal.",
      salida: "3.5"
    },
    {
      sec: "ut1-conversiones",
      p: "Con `int a = 7, b = 2;`, ¿cuánto vale `(double) (a / b)`?",
      o: ["3.5", "3.0", "3", "4.0"],
      c: 1,
      e: "La división entera se hace antes del casting.",
      salida: "3.0"
    },
    {
      sec: "ut1-conversiones",
      p: "¿Qué muestra `System.out.println((char) 67);`?",
      o: ["`67`", "`C`", "`c`", "Error"],
      c: 1,
      e: "El carácter con código 67 es `'C'`.",
      salida: "C"
    },
    {
      sec: "ut1-conversiones",
      p: "¿Qué muestra `System.out.println('A' + 1);`?",
      o: ["`B`", "`66`", "`A1`", "Error"],
      c: 1,
      e: "Un `char` más un `int` da un `int`.",
      salida: "66"
    },
    {
      sec: "ut1-conversiones",
      p: "¿Qué vale `(byte) 200`?",
      o: ["200", "-56", "127", "0"],
      c: 1,
      e: "No cabe en un `byte` y «da la vuelta» (complemento a dos).",
      nivel: "pro",
      salida: "-56"
    },
    {
      sec: "ut1-conversiones",
      p: "Con `long x = 2_000_000_000L * 2;` ¿cuánto vale `x`?",
      o: ["4000000000", "-294967296", "Error de compilación", "2000000000"],
      c: 0,
      e: "Un operando es `long`, así que toda la operación es `long` y no hay desbordamiento.",
      nivel: "pro",
      salida: "4000000000"
    },
    {
      sec: "ut1-comentarios",
      p: "¿Qué sintaxis tiene un comentario de varias líneas?",
      o: ["`// ... //`", "`/* ... */`", "`<!-- ... -->`", "`# ... #`"],
      c: 1,
      e: "Se abre con `/*` y se cierra con `*/`."
    },
    {
      sec: "ut1-comentarios",
      p: "¿Qué conviene comentar sobre todo?",
      o: [
        "El qué hace cada línea",
        "El porqué de las decisiones que no se ven en el código",
        "Solo el nombre del archivo",
        "Nada"
      ],
      c: 1,
      e: "Comenta el porqué, no el qué."
    },
    {
      sec: "ut1-comentarios",
      p: "¿Para qué sirven los comentarios Javadoc (`/** ... */`)?",
      o: [
        "Para ejecutar código",
        "Para generar documentación automática del proyecto",
        "Para ocultar código",
        "Para declarar constantes"
      ],
      c: 1,
      e: "Con ellos se genera la documentación del proyecto."
    },
    {
      sec: "ut1-comentarios",
      p: "¿Qué comentario sobra en un código bien escrito?",
      o: [
        "`// Tarifa semanal desde 3 días: así lo pactó el club`",
        "`contador++; // suma 1 al contador`",
        "`// FIXME: no contempla fianzas negativas`",
        "`/** Calcula el total del alquiler. */`"
      ],
      c: 1,
      e: "Repite lo que ya dice el código; no explica el porqué."
    },
    {
      sec: "ut1-comentarios",
      p: "Un comentario `// TODO: revisar` lleva dos años sin tocarse. ¿Qué buena práctica se incumple?",
      o: [
        "Indicar quién lo hará y cuándo",
        "Usar `//` en vez de `/* */`",
        "Escribirlo en mayúsculas",
        "Ponerlo antes de un método"
      ],
      c: 0,
      e: "Un TODO debe tener responsable y fecha, o se queda para siempre.",
      nivel: "pro"
    },
    {
      sec: "ut1-comentarios",
      p: "¿Qué conviene hacer con el código comentado que ya no se usa?",
      o: [
        "Dejarlo por si acaso",
        "Borrarlo: para recuperarlo existe el control de versiones",
        "Convertirlo en Javadoc",
        "Moverlo al final del archivo"
      ],
      c: 1,
      e: "Git guarda el historial; el código muerto solo estorba.",
      nivel: "pro"
    },
    {
      sec: "ut1-comentarios",
      p: "¿Dónde se coloca un comentario Javadoc?",
      o: [
        "Dentro de cada sentencia",
        "Antes de la clase o del método que documenta",
        "Solo al final del archivo",
        "En el nombre del archivo"
      ],
      c: 1,
      e: "Documenta el elemento que viene justo después."
    },
    {
      sec: "ut1-comentarios",
      p: "¿Qué hace el compilador con los comentarios?",
      o: ["Los ejecuta", "Los ignora", "Los convierte en variables", "Los muestra por pantalla"],
      c: 1,
      e: "Los comentarios son solo para las personas."
    }
  ]
});
