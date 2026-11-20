/* UT2 · Introducción a la programación orientada a objetos — contenido editable (formato documentado en GUIA_PROFESOR.md). */

registrarUnidad({
  id: "ut2",
  titulo: "UT2. Introducción a la programación orientada a objetos",
  ra: "RA2. Escribe y prueba programas sencillos, reconociendo y aplicando los fundamentos de la programación orientada a objetos.",
  resumen: "Aprenderás a pensar en objetos: crear objetos de clases que ya existen en Java, llamar a sus métodos, usar sus propiedades y entender cómo se gestionan en memoria.",
  aprenderas: [
    "Explicar qué son un objeto y una clase",
    "Crear objetos y entender que las variables de objeto guardan **referencias**",
    "Llamar a métodos con parámetros y usar los de `String`",
    "Usar métodos estáticos y dar formato a números",
    "Usar `Scanner`, `Random` y `LocalDate`",
    "Importar librerías y entender el recolector de basura"
  ],
  testN: 20,

  /* ===================== APUNTES POR SECCIONES ===================== */
  secciones: [
    {
      id: "ut2-objetos",
      titulo: "Objetos y clases",
      resumen: "Estado, comportamiento e identidad; la clase como molde; la API de Java.",
      bloques: [
        {
          t: "texto",
          md: `En la UT1 trabajaste con datos sueltos: un número, un texto. Pero en el mundo real los datos van **juntos** y además **hacen cosas**. Un kayak de la tienda tiene modelo, precio, color y estado (disponible o alquilado), y se puede alquilar, devolver o cambiar de precio.

La **programación orientada a objetos** (POO) organiza los programas así. Un **objeto** tiene:
- **Estado**: los datos que guarda, llamados **atributos** o **propiedades** (modelo, precio, color…).
- **Comportamiento**: lo que sabe hacer, llamado **métodos** (alquilar, devolver, cambiar el precio…).
- **Identidad**: cada objeto es único, aunque tenga los mismos datos que otro. Dos kayaks del mismo modelo y color siguen siendo dos kayaks distintos.

Una **clase** es la plantilla o molde a partir del cual se crean objetos. Cada objeto concreto creado a partir de una clase es una **instancia** de esa clase.`
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "Clase = molde (se define una vez). Objeto = cada cosa concreta hecha con el molde (puede haber muchas). Igual que con un molde de flanes: el molde no se come; los flanes, sí."
        },
        {
          t: "relacionar",
          p: "Relaciona cada elemento del kayak con el concepto de POO que representa.",
          pares: [
            ["Kayak (el molde de todos los kayaks)", "clase"],
            ["El kayak azul del muelle 3", "objeto"],
            ["precio = 249.9", "atributo"],
            ["alquilar()", "método"]
          ],
          e: "La clase es la plantilla; el objeto, una instancia concreta; el atributo forma parte del estado y el método, del comportamiento."
        },
        {
          t: "test",
          p: "Tienes dos kayaks con el mismo modelo, color y precio. ¿Son el mismo objeto?",
          o: [
            "Sí, porque tienen los mismos datos",
            "No: cada objeto tiene identidad propia",
            "Depende del precio",
            "Sí, si pertenecen a la misma clase"
          ],
          c: 1,
          e: "La **identidad** es independiente del contenido: dos objetos iguales en datos siguen siendo dos objetos."
        },
        {
          t: "texto",
          md: `### Las clases que ya trae Java
Java incluye miles de clases ya programadas, organizadas en **paquetes**: \`String\` (textos), \`Math\` (cálculos), \`Scanner\` (leer del teclado), \`LocalDate\` (fechas)… En esta unidad aprenderás a **usarlas**; crear clases propias será la UT4. Todas están descritas en la documentación oficial, la **API de Java**: \`docs.oracle.com/en/java/javase/21/docs/api/\`.

Para cada clase la documentación muestra sus **constructores** (cómo crear objetos), sus **atributos** y sus **métodos**, con los parámetros que reciben y lo que devuelven. Una fila como \`int indexOf(String str)\` se lee: el método se llama \`indexOf\`, recibe un \`String\` y devuelve un \`int\`.`
        },
        {
          t: "test",
          p: "En la documentación aparece `char charAt(int index)`. ¿Qué significa?",
          o: [
            "Recibe un `char` y devuelve un `int`",
            "Recibe un `int` (la posición) y devuelve un `char`",
            "No recibe nada y devuelve un `char`",
            "Recibe un `String` y no devuelve nada"
          ],
          c: 1,
          e: "Se lee de derecha a izquierda en el tipo: lo que va **delante** del nombre es lo que devuelve; lo de los **paréntesis**, lo que recibe."
        },
        {
          t: "ordenar",
          p: "Ordena de lo más general a lo más concreto.",
          items: [
            "Paquete java.util",
            "Clase Scanner",
            "Objeto teclado (new Scanner(System.in))",
            "Estado: la posición por la que va leyendo"
          ],
          e: "Un paquete agrupa clases; una clase es el molde; el objeto es una instancia concreta y tiene su propio estado."
        },
        {
          t: "profundizar",
          titulo: "¿Por qué los atributos están ocultos en casi todas las clases?",
          bloques: [
            {
              t: "texto",
              md: "Porque cada clase quiere **proteger** su estado: si cualquiera pudiera escribir `kayak.precio = -500`, el objeto quedaría con datos absurdos. Lo normal es que los atributos sean privados y que se acceda a ellos con métodos (`getPrecio()`, `setPrecio(...)`) que pueden **validar** los datos. Eso se llama **encapsulación** y lo verás en profundidad en la UT4 al crear tus propias clases."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Leer la documentación oficial (en inglés) es una habilidad de profesional, no un extra. Cuando no sepas qué hace un método, la API es la **fuente de verdad**: más fiable que un vídeo antiguo, un foro o una IA que puede inventar métodos que no existen. Acostúmbrate: busca la clase, la tabla *Method Summary*, la fila que te interesa.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Empezamos con **objetos y clases**. Tres preguntas rápidas para ver por dónde vas.",
        inicial: [
          {
            p: "¿Qué es una clase?",
            o: [
              "Un objeto concreto con sus datos",
              "La plantilla a partir de la cual se crean objetos",
              "Un tipo de método",
              "Un paquete de Java"
            ],
            c: 1,
            e: "La clase es el molde."
          },
          {
            p: "En `precio = 249.9` de un kayak, ¿qué es `precio`?",
            o: ["Un método", "Un atributo (parte del estado)", "Una clase", "Un paquete"],
            c: 1,
            e: "Los datos que guarda un objeto son sus atributos o propiedades."
          },
          {
            p: "Dos objetos de la misma clase con idénticos datos…",
            o: [
              "Son el mismo objeto",
              "Son objetos distintos, con identidad propia",
              "No pueden existir",
              "Se fusionan automáticamente"
            ],
            c: 1,
            e: "Cada objeto tiene identidad propia."
          }
        ],
        pasos: [
          {
            titulo: "Objeto y clase",
            cubre: [0, 2],
            explica: "Un **objeto** tiene **estado** (atributos), **comportamiento** (métodos) e **identidad**. La **clase** es el molde que define qué atributos y métodos tendrán todos sus objetos. Como el molde de los flanes: una clase, muchos objetos.",
            pregunta: {
              p: "¿Cuántos objetos `Kayak` puede haber a partir de una sola clase `Kayak`?",
              o: ["Solo uno", "Tantos como queramos", "Dos como máximo", "Ninguno: las clases no crean objetos"],
              c: 1,
              e: "Una clase, muchos objetos.",
              pista: "Piensa en el molde de flanes."
            }
          },
          {
            titulo: "Atributos y métodos",
            cubre: [1],
            explica: "El estado son los **atributos** (qué *es* el objeto: modelo, precio) y el comportamiento son los **métodos** (qué *hace*: alquilar, devolver). Los atributos son datos; los métodos, acciones.",
            pregunta: {
              p: "¿Cuál de estos es un método de un kayak?",
              o: ["`precio`", "`color`", "`devolver()`", "`modelo`"],
              c: 2,
              e: "Un método es una acción y se escribe con paréntesis."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Piensa en una *bicicleta eléctrica* de la tienda. Escribe un programa \`FichaBici\` que muestre (con \`println\`) exactamente:
 \`\`\`
 Clase: Bici
 Atributos: marca, bateria, disponible
 Metodos: alquilar, devolver
 \`\`\`
 (Es un ejercicio de modelado: lo importante es que pienses qué es estado y qué es comportamiento.)
 `,
          inicial: `
 public class FichaBici {
     public static void main(String[] args) {
     }
 }
 `,
          tests: [
            {
              out: `Clase: Bici
Atributos: marca, bateria, disponible
Metodos: alquilar, devolver`
            }
          ],
          solucion: `
 public class FichaBici {
     public static void main(String[] args) {
         System.out.println("Clase: Bici");
         System.out.println("Atributos: marca, bateria, disponible");
         System.out.println("Metodos: alquilar, devolver");
     }
 }
 `,
          pistas: ["Tres sentencias `println`."]
        }
      }
    },

    {
      id: "ut2-referencias",
      titulo: "Instanciación y referencias",
      resumen: "Crear objetos con new, variables que guardan flechas (referencias) y el valor null.",
      bloques: [
        {
          t: "texto",
          md: `**Instanciar** es crear un objeto a partir de una clase. Se hace con \`new\` seguido de un **constructor**, que se llama igual que la clase:
\`\`\`
StringBuilder ticket = new StringBuilder();
\`\`\`
Esa línea hace **tres cosas**:
1. \`StringBuilder ticket\` declara una variable que puede apuntar a objetos \`StringBuilder\`.
2. \`new StringBuilder()\` crea un objeto nuevo en memoria.
3. El \`=\` hace que la variable apunte a ese objeto.

### Primitivos frente a referencias
- Una variable **primitiva** (\`int\`, \`double\`…) guarda **directamente el valor**.
- Una variable de **objeto** guarda una **referencia**: la dirección de memoria donde está el objeto. Es como una flecha que apunta a él.`
        },
        {
          t: "memoria",
          titulo: "Pila y montón",
          variables: [
            { n: "unidades", tipo: "int", v: 5 },
            { n: "p1", tipo: "Point", ref: "o1" },
            { n: "p2", tipo: "Point", ref: "o1" }
          ],
          objetos: [
            {
              id: "o1",
              clase: "Point",
              campos: [
                { n: "x", v: 3 },
                { n: "y", v: 4 }
              ]
            }
          ],
          nota: "`unidades` guarda el valor 5. `p1` y `p2` guardan flechas que apuntan al **mismo** objeto."
        },
        {
          t: "texto",
          md: "Si copias una referencia, **no copias el objeto**: las dos variables apuntan al mismo, y un cambio hecho desde una se ve desde la otra."
        },
        {
          t: "codigo",
          titulo: "Referencias.java",
          code: `import java.awt.Point;

public class Referencias {
    public static void main(String[] args) {
        Point p1 = new Point(3, 4);   // un punto en (3, 4)
        Point p2 = p1;                // p2 apunta al MISMO objeto
        p2.x = 10;
        System.out.println(p1.x);     // ¿qué sale?
        Point p3 = new Point(3, 4);   // otro objeto distinto, aunque igual
        System.out.println(p3.x);
    }
}`,
          ejecutable: true
        },
        {
          t: "predecir",
          p: "Antes de ejecutar, predice qué se muestra. Dibuja las flechas en un papel.",
          code: `import java.awt.Point;
Point a = new Point(1, 1);
Point b = a;
Point c = new Point(1, 1);
b.x = 7;
c.y = 9;
System.out.println(a.x + " " + a.y);
System.out.println(c.x + " " + c.y);`,
          salida: `7 1
1 9`,
          e: "`a` y `b` apuntan al mismo objeto: cambiar `b.x` cambia lo que ve `a`. `c` es otro objeto y su cambio no afecta a `a`."
        },
        {
          t: "test",
          p: "Con `Point p1 = new Point(3, 4); Point p2 = p1;`, ¿cuántos objetos `Point` hay en memoria?",
          o: ["0", "1", "2", "Depende del compilador"],
          c: 1,
          e: "`new` se ejecuta una sola vez: hay un objeto y dos referencias a él."
        },
        {
          t: "texto",
          md: `### El valor \`null\`
Una variable de objeto puede **no apuntar a nada**: entonces vale \`null\`. Si intentas usar un método de una variable que vale \`null\`, el programa se detiene con una **\`NullPointerException\`**, uno de los errores más frecuentes en Java. Los **primitivos nunca valen \`null\`**.`
        },
        {
          t: "codigo",
          titulo: "Nulo.java",
          code: `public class Nulo {
    public static void main(String[] args) {
        String cliente = null;
        System.out.println("Antes");
        System.out.println(cliente.length());
        System.out.println("Después");
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "Lee el mensaje del error: indica **la línea** y **qué variable** era `null`. Casi siempre la solución es averiguar por qué esa variable no se inicializó. El «Después» nunca se muestra: la excepción detiene el programa."
        },
        {
          t: "huecos",
          p: "Completa para crear un punto en (2, 5) y una segunda referencia al mismo objeto.",
          codigo: `Point puesto = {{new}} Point({{2}}, {{5}});
Point alias = {{puesto}};`,
          e: "`new` crea el objeto; copiar `puesto` copia la **referencia**, no el objeto."
        },
        {
          t: "profundizar",
          titulo: "¿Java tiene punteros como C?",
          bloques: [
            {
              t: "texto",
              md: "No como en C: no puedes hacer aritmética con direcciones ni acceder a memoria arbitraria. Las referencias son punteros **«seguros»** que solo sirven para llegar al objeto. Internamente, las variables locales se guardan en la **pila** (*stack*) y los objetos en el **montón** (*heap*); una referencia es, en la práctica, una dirección del montón."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `String` es un caso especial?",
          bloques: [
            {
              t: "texto",
              md: "Los textos son objetos de la clase `String`, pero son tan habituales que Java permite crearlos **sin `new`**, escribiendo el literal: `String modelo = \"Bahía 2\";`. Además, Java **reutiliza** los literales iguales (el *string pool*): dos literales `\"kayak\"` apuntan al mismo objeto. Esto tiene consecuencias al comparar textos (lo ves en la siguiente sección)."
            }
          ]
        },
        {
          t: "ejecuta",
          p: `**Arregla el error.** Este programa lanza una excepción. Averigua por qué y corrígelo (**sin borrar la línea que usa \`length()\`**) para que muestre:
\`\`\`
Cliente sin nombre: 0 letras
\`\`\``,
          inicial: `public class SinNombre {
    public static void main(String[] args) {
        String nombre = null;
        System.out.println("Cliente sin nombre: " + nombre.length() + " letras");
    }
}`,
          tests: [
            { out: "Cliente sin nombre: 0 letras" }
          ],
          pistas: [
            "`null` significa «no apunta a ningún objeto».",
            "Un texto vacío `\"\"` **sí** es un objeto `String`, con longitud 0."
          ],
          solucion: `public class SinNombre {
    public static void main(String[] args) {
        String nombre = "";
        System.out.println("Cliente sin nombre: " + nombre.length() + " letras");
    }
}`,
          explicacion: "`null` (ausencia de objeto) y `\"\"` (un objeto texto vacío) son cosas distintas."
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "En producción, `NullPointerException` es la causa de una enorme parte de los fallos. Dos hábitos de profesional: **inicializar siempre** lo que declares, y **validar** los datos que vienen de fuera (formularios, ficheros, APIs) antes de usarlos. Su inventor, Tony Hoare, lo llamó «mi error de mil millones de dólares».",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Seguimos con **instanciación y referencias**: la idea más importante de la unidad.",
        inicial: [
          {
            p: "¿Qué guarda una variable de tipo objeto?",
            o: [
              "El objeto entero",
              "Una referencia (flecha) al objeto",
              "Una copia del objeto",
              "Su nombre de clase"
            ],
            c: 1,
            e: "Las variables de objeto guardan referencias."
          },
          {
            p: "`Point a = new Point(1,2); Point b = a; b.x = 9;` ¿Cuánto vale `a.x`?",
            o: ["1", "9", "2", "Error"],
            c: 1,
            e: "`a` y `b` apuntan al mismo objeto."
          },
          {
            p: "¿Qué ocurre al llamar a un método de una variable que vale `null`?",
            o: ["Devuelve 0", "NullPointerException", "Se crea el objeto", "Nada"],
            c: 1,
            e: "No hay objeto sobre el que llamar al método."
          }
        ],
        pasos: [
          {
            titulo: "new, variable y referencia",
            cubre: [0, 1],
            explica: "`new Point(3, 4)` **crea** un objeto en memoria. La variable no contiene el objeto: contiene una **referencia** (una flecha) que apunta a él. Con `=` entre dos variables de objeto se copia la **flecha**, no el objeto.",
            ejemplo: {
              code: `import java.awt.Point;
Point a = new Point(1, 2);
Point b = a;
b.x = 9;
System.out.println(a.x);`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "Tras `Point c = new Point(1,2); Point d = new Point(1,2); d.x = 5;`, ¿cuánto vale `c.x`?",
              o: ["5", "1", "2", "Error"],
              c: 1,
              e: "`c` y `d` son **dos objetos distintos**: cambiar uno no afecta al otro.",
              pista: "¿Cuántas veces se ejecuta `new`?"
            }
          },
          {
            titulo: "El valor null",
            cubre: [2],
            explica: "`null` significa «esta variable no apunta a ningún objeto». Llamar a un método de ella lanza `NullPointerException`. Un `String` vacío (`\"\"`) no es `null`: es un objeto con longitud 0.",
            pregunta: {
              p: "¿Cuál de estas variables provoca `NullPointerException` al llamar a `.length()`?",
              o: ["`String a = \"\";`", "`String b = \"hola\";`", "`String c = null;`", "`String d = \" \";`"],
              c: 2,
              e: "Solo `null` carece de objeto."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Crea dos referencias \`p\` y \`q\` al **mismo** \`Point(0, 0)\`. Cambia \`q.x\` a 5 y muestra \`p.x\` para comprobar que se ve el cambio:
 \`\`\`
 5
 \`\`\`
 `,
          inicial: `
 import java.awt.Point;

 public class Alias {
     public static void main(String[] args) {
         // crea p y q (mismo objeto), modifica q.x y muestra p.x
     }
 }
 `,
          tests: [
            { out: "5" }
          ],
          solucion: `
 import java.awt.Point;

 public class Alias {
     public static void main(String[] args) {
         Point p = new Point(0, 0);
         Point q = p;
         q.x = 5;
         System.out.println(p.x);
     }
 }
 `,
          pistas: ["`Point q = p;` copia la referencia, no crea otro objeto."]
        }
      }
    },

    {
      id: "ut2-metodos",
      titulo: "Métodos, parámetros y String",
      resumen: "Notación punto, parámetros, valor devuelto, inmutabilidad y comparar con equals.",
      bloques: [
        {
          t: "texto",
          md: "Un **método** es una acción que un objeto sabe hacer. Se llama con la **notación punto**: `objeto.metodo(parámetros)`."
        },
        {
          t: "codigo",
          titulo: "Metodos.java",
          code: `public class Metodos {
    public static void main(String[] args) {
        String modelo = "Kayak Bahía";
        int letras = modelo.length();            // sin parámetros
        String mayus = modelo.toUpperCase();     // sin parámetros
        char inicial = modelo.charAt(0);         // un parámetro: la posición
        String parte = modelo.substring(6, 11);  // dos parámetros
        System.out.println(letras + " " + mayus + " " + inicial + " " + parte);
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `Al llamar a un método fíjate en tres cosas (aparecen en la documentación):
- **Los parámetros**: los datos que necesita, en el **orden** y del **tipo** indicados. Si no necesita ninguno, paréntesis vacíos.
- **El valor de retorno**: lo que devuelve. Se guarda en una variable o se usa en una expresión. Si devuelve \`void\`, no devuelve nada.
- **La sobrecarga**: un método puede existir en varias versiones con distintos parámetros. \`substring(6)\` va desde la 6 hasta el final; \`substring(6, 11)\`, desde la 6 hasta la **10** (la última no se incluye).`
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "Las posiciones de un `String` **empiezan en 0**: el primer carácter está en la posición `0` y el último en `length() - 1`. Pedir una posición que no existe lanza `StringIndexOutOfBoundsException`."
        },
        {
          t: "tabla",
          cab: ["Método", "Qué hace (con `s = \"  Neopreno 3mm  \"`)"],
          filas: [
            ["`length()`", "Número de caracteres: `16`"],
            ["`strip()`", "Quita los espacios del principio y del final: `\"Neopreno 3mm\"`"],
            ["`toUpperCase()` / `toLowerCase()`", "Pasa a mayúsculas o minúsculas"],
            ["`charAt(i)`", "Carácter de la posición `i`"],
            ["`indexOf(texto)`", "Posición de la primera aparición, o `-1` si no aparece"],
            ["`substring(i, j)`", "Trozo desde `i` hasta `j - 1` (longitud `j - i`)"],
            ["`contains(t)` · `startsWith(t)` · `endsWith(t)`", "`true`/`false`"],
            ["`replace(a, b)`", "Cambia cada aparición de `a` por `b`"],
            [
              "`equals(otro)` · `equalsIgnoreCase(otro)`",
              "Compara el contenido (el segundo ignora mayúsculas)"
            ],
            ["`isBlank()`", "`true` si está vacío o solo tiene espacios"]
          ]
        },
        {
          t: "predecir",
          p: "¿Qué muestra? Calcula las posiciones con cuidado (empiezan en 0).",
          code: `String s = "chaleco salvavidas";
System.out.println(s.length());
System.out.println(s.charAt(3));
System.out.println(s.indexOf("salva"));
System.out.println(s.substring(8));
System.out.println(s.substring(0, 7));
System.out.println(s.indexOf("barco"));`,
          salida: `18
l
8
salvavidas
chaleco
-1`,
          e: "`length` cuenta 18; `charAt(3)` es la cuarta letra (`l`); `\"salva\"` empieza en la 8; `substring(0, 7)` toma las posiciones 0 a 6; si no aparece, `indexOf` devuelve −1."
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "**Los `String` son inmutables**: ningún método cambia el original; todos devuelven uno **nuevo**. Por eso `modelo.toUpperCase();` solo, sin guardar el resultado, no sirve para nada. Hay que escribir `modelo = modelo.toUpperCase();`."
        },
        {
          t: "predecir",
          p: "¿Qué muestra este programa? (Atención a lo que se guarda y a lo que no.)",
          code: `String modelo = "bahia";
modelo.toUpperCase();
String otro = modelo.replace("a", "o");
System.out.println(modelo);
System.out.println(otro);`,
          salida: `bahia
bohio`,
          e: "La línea 2 calcula `\"BAHIA\"` pero lo tira: no se guarda. `replace` devuelve un texto nuevo que se guarda en `otro`; `modelo` no cambia."
        },
        {
          t: "texto",
          md: "Las llamadas se pueden **encadenar**, porque cada método devuelve un objeto sobre el que se puede llamar a otro: `String limpio = entrada.strip().toUpperCase();`"
        },
        {
          t: "texto",
          md: `### Comparar objetos: \`==\` frente a \`equals\`
Con objetos, \`==\` compara **referencias** (si apuntan al mismo objeto). Para saber si dos textos tienen el mismo **contenido** hay que usar \`equals\`.`
        },
        {
          t: "codigo",
          titulo: "CompararTextos.java",
          code: `public class CompararTextos {
    public static void main(String[] args) {
        String a = "kayak";
        String b = new String("kayak");
        System.out.println(a == b);
        System.out.println(a.equals(b));
        String c = "kayak";
        System.out.println(a == c);
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "Para comparar textos usa **siempre** `equals`. `==` a veces «funciona» por casualidad (Java reutiliza los literales iguales: `a == c` da `true`), y por eso es un error tan traicionero: pasa los primeros tests y falla en producción."
        },
        {
          t: "test",
          p: "Quieres saber si el usuario escribió «si» sin importar mayúsculas. ¿Qué usas?",
          o: [
            "`respuesta == \"si\"`",
            "`respuesta.equals(\"si\")`",
            "`respuesta.equalsIgnoreCase(\"si\")`",
            "`respuesta = \"si\"`"
          ],
          c: 2,
          e: "`equalsIgnoreCase` compara contenido ignorando mayúsculas. `==` compara referencias y `=` asigna."
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `substring(i, j)` no incluye la posición `j`?",
          bloques: [
            {
              t: "texto",
              md: "Es un intervalo **semiabierto** `[i, j)`: incluye `i` y excluye `j`. Tiene una ventaja práctica: la longitud del trozo es siempre `j - i`, y dos trozos consecutivos encajan sin solaparse (`substring(0, 5)` y `substring(5, 10)`). Muchas APIs de programación usan este convenio."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Qué es `trim()` y en qué se diferencia de `strip()`?",
          bloques: [
            {
              t: "texto",
              md: "`strip()` es la versión moderna (Java 11): reconoce todos los espacios Unicode. `trim()` solo quita caracteres de control y espacio normal. Para texto del día a día dan lo mismo, así que si ves `trim()` en un tutorial antiguo, es válido."
            }
          ]
        },
        {
          t: "ejecuta",
          p: "Dado `String producto = \"  chaleco salvavidas talla L  \";`, escribe `TextoProducto` para que muestre, **en este orden y en líneas distintas**: el texto sin espacios sobrantes, ese mismo texto en mayúsculas, su longitud, si contiene la palabra «talla» y la posición donde empieza «salvavidas».",
          inicial: `public class TextoProducto {
    public static void main(String[] args) {
        String producto = "  chaleco salvavidas talla L  ";
        // tu código
    }
}`,
          tests: [
            {
              out: `chaleco salvavidas talla L
CHALECO SALVAVIDAS TALLA L
26
true
8`
            }
          ],
          pistas: [
            "Empieza guardando `producto.strip()` en una variable: las demás operaciones trabajan sobre el texto limpio.",
            "La longitud, la posición y el `contains` se calculan sobre el texto **ya limpio**."
          ],
          solucion: `public class TextoProducto {
    public static void main(String[] args) {
        String producto = "  chaleco salvavidas talla L  ";
        String limpio = producto.strip();
        System.out.println(limpio);
        System.out.println(limpio.toUpperCase());
        System.out.println(limpio.length());
        System.out.println(limpio.contains("talla"));
        System.out.println(limpio.indexOf("salvavidas"));
    }
}`,
          rubrica: [
            "Guardas el resultado de `strip()` en una variable (los `String` son inmutables)",
            "No repites cálculos innecesarios"
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Cuando de verdad compares texto de usuarios, normaliza **antes**: `entrada.strip().toLowerCase()` (o `equalsIgnoreCase`). Y cuando el valor esperado es un literal, escribe `\"si\".equals(entrada)` en vez de `entrada.equals(\"si\")`: así, si `entrada` es `null`, no explota (devuelve `false`). Es un truco clásico para evitar `NullPointerException`.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Validador de códigos de reserva",
          p: `Un código de reserva válido tiene el formato \`NB-\` seguido de 4 dígitos, por ejemplo \`NB-0042\`. Dado \`String codigo = "  nb-0042 ";\` (que viene con espacios y en minúsculas): normalízalo y muestra
\`\`\`
Codigo: NB-0042
Prefijo correcto: true
Numero: 42
\`\`\`
Usa solo métodos de \`String\` (y \`Integer.parseInt\` para el número). Recuerda: sin \`if\` ni bucles.`,
          requisitos: [
            "Encadenas `strip()` y `toUpperCase()` en una sola expresión",
            "No usas `==` para comparar texto",
            "Conviertes el número con `Integer.parseInt`"
          ],
          inicial: `public class ValidaCodigo {
    public static void main(String[] args) {
        String codigo = "  nb-0042 ";
    }
}`,
          tests: [
            {
              out: `Codigo: NB-0042
Prefijo correcto: true
Numero: 42`
            }
          ],
          pistas: [
            "`parseInt(\"0042\")` da 42: ignora los ceros a la izquierda.",
            "El número empieza en la posición 3: `substring(3)`."
          ],
          solucion: `public class ValidaCodigo {
    public static void main(String[] args) {
        String codigo = "  nb-0042 ";
        String normal = codigo.strip().toUpperCase();
        System.out.println("Codigo: " + normal);
        System.out.println("Prefijo correcto: " + normal.startsWith("NB-"));
        int numero = Integer.parseInt(normal.substring(3));
        System.out.println("Numero: " + numero);
    }
}`,
          rubrica: [
            "Sabrías explicar por qué `strip()` y `toUpperCase()` se pueden encadenar",
            "Has probado con otro código (por ejemplo `\"NB-0105\"`)"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Vamos con **métodos y String**: donde más puntos se pierden en los exámenes.",
        inicial: [
          {
            p: "Con `String s = \"kayak\";`, ¿qué devuelve `s.charAt(1)`?",
            o: ["`k`", "`a`", "`y`", "Error"],
            c: 1,
            e: "La posición 0 es `k`, la 1 es `a`."
          },
          {
            p: "Tras `String s = \"sol\"; s.toUpperCase();` ¿cuánto vale `s`?",
            o: ["`\"SOL\"`", "`\"sol\"`", "`null`", "Error"],
            c: 1,
            e: "Los `String` son inmutables y el resultado no se guardó."
          },
          {
            p: "Para comparar el **contenido** de dos textos se usa…",
            o: ["`==`", "`equals`", "`=`", "`compare`"],
            c: 1,
            e: "`==` compara referencias; `equals`, contenido."
          }
        ],
        pasos: [
          {
            titulo: "Posiciones y substring",
            cubre: [0],
            explica: "Un `String` numera sus caracteres desde **0**. `charAt(i)` da el carácter de la posición `i`; `substring(i, j)` da el trozo desde `i` hasta `j - 1` (longitud `j - i`); `indexOf(t)` da la posición de la primera aparición o `-1`.",
            ejemplo: {
              code: `String s = "kayak";
System.out.println(s.charAt(1));
System.out.println(s.substring(1, 3));
System.out.println(s.indexOf("y"));`,
              ejecutable: true,
              titulo: "Pruébalo"
            },
            pregunta: {
              p: "Con `String t = \"neopreno\";`, ¿qué da `t.substring(2, 5)`?",
              o: ["`eop`", "`opr`", "`eopr`", "`neo`"],
              c: 1,
              e: "Posiciones 2, 3 y 4: `o`, `p`, `r`.",
              pista: "La posición 0 es `n`, la 1 es `e`, la 2 es `o`."
            }
          },
          {
            titulo: "Inmutabilidad",
            cubre: [1],
            explica: "Ningún método de `String` modifica el texto: devuelven uno nuevo. Si no lo guardas, se pierde. Correcto: `s = s.strip();`",
            pregunta: {
              p: "¿Cuál de estas líneas hace que `nombre` quede en mayúsculas?",
              o: [
                "`nombre.toUpperCase();`",
                "`nombre = nombre.toUpperCase();`",
                "`nombre.toUpperCase;`",
                "`toUpperCase(nombre);`"
              ],
              c: 1,
              e: "Hay que reasignar el resultado."
            }
          },
          {
            titulo: "== frente a equals",
            cubre: [2],
            explica: "`==` pregunta «¿es el mismo objeto?». `equals` pregunta «¿tiene el mismo contenido?». Para textos usa siempre `equals` (o `equalsIgnoreCase`).",
            ejemplo: {
              code: `String a = "kayak";
String b = new String("kayak");
System.out.println(a == b);
System.out.println(a.equals(b));`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "Con el ejemplo anterior, ¿por qué `a == b` da `false`?",
              o: [
                "Porque el contenido es distinto",
                "Porque son dos objetos distintos en memoria",
                "Porque `==` no funciona con `String`",
                "Por un error del compilador"
              ],
              c: 1,
              e: "`new String(...)` crea un objeto nuevo, aunque tenga el mismo contenido."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Dado \`String nombre = "  laura martinez ";\`, muestra el nombre sin espacios y en mayúsculas, y su longitud ya limpio:
 \`\`\`
 LAURA MARTINEZ
 14
 \`\`\`
 `,
          inicial: `
 public class Nombre {
     public static void main(String[] args) {
         String nombre = "  laura martinez ";
     }
 }
 `,
          tests: [
            {
              out: `LAURA MARTINEZ
14`
            }
          ],
          solucion: `
 public class Nombre {
     public static void main(String[] args) {
         String nombre = "  laura martinez ";
         String limpio = nombre.strip().toUpperCase();
         System.out.println(limpio);
         System.out.println(limpio.length());
     }
 }
 `,
          pistas: ["Encadena `strip()` y `toUpperCase()` y guarda el resultado."]
        }
      }
    },

    {
      id: "ut2-propiedades",
      titulo: "Propiedades y encapsulación",
      resumen: "Consultar y modificar atributos públicos; por qué normalmente se ocultan.",
      bloques: [
        {
          t: "texto",
          md: "Las **propiedades** (atributos) son los datos que guarda un objeto. Si la clase los deja a la vista (`public`), se consultan y modifican con la notación punto, pero **sin paréntesis**. La clase `java.awt.Point` es de las pocas de la API con atributos públicos (`x`, `y`), perfecta para practicar:"
        },
        {
          t: "codigo",
          titulo: "Ubicacion.java",
          code: `import java.awt.Point;

public class Ubicacion {
    public static void main(String[] args) {
        Point puesto = new Point(2, 5);   // posición de un kayak en el almacén
        System.out.println("Fila " + puesto.x + ", columna " + puesto.y);
        puesto.x = 3;                     // modificar una propiedad
        puesto.translate(1, -2);          // un método que modifica el estado
        System.out.println("Fila " + puesto.x + ", columna " + puesto.y);
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "**Propiedad:** `objeto.x` (sin paréntesis, es un dato). **Método:** `objeto.translate(1, 2)` (con paréntesis, es una acción). Si dudas, mira si lleva paréntesis."
        },
        {
          t: "test",
          p: "¿Cuál de estas expresiones **consulta una propiedad** de un `Point p`?",
          o: ["`p.x`", "`p.x()`", "`p.translate(1, 1)`", "`p.getX`"],
          c: 0,
          e: "Las propiedades se usan sin paréntesis. `p.translate(...)` es un método."
        },
        {
          t: "predecir",
          p: "¿Qué muestra?",
          code: `import java.awt.Point;
Point p = new Point(2, 5);
p.translate(3, -1);
p.x = p.x * 2;
System.out.println(p.x + "," + p.y);`,
          salida: "10,4",
          e: "Tras `translate(3, -1)` el punto es (5, 4). Luego `x` pasa a 10."
        },
        {
          t: "texto",
          md: `### Encapsulación
En la mayoría de las clases los atributos **no son públicos**: están ocultos y solo se accede a ellos mediante métodos, normalmente \`getAlgo()\` (consultar) y \`setAlgo(...)\` (modificar). Esto se llama **encapsulación** y protege al objeto de recibir datos incorrectos. Por ejemplo, \`Point\` también ofrece \`getX()\` y \`getY()\`.`
        },
        {
          t: "codigo",
          titulo: "Getters y setters",
          code: `import java.awt.Point;

public class Metodos2 {
    public static void main(String[] args) {
        Point p = new Point(4, 6);
        System.out.println(p.getX());   // método getter: devuelve un double
        System.out.println(p.x);        // propiedad: es un int
        p.setLocation(0, 0);            // método setter
        System.out.println(p);
    }
}`,
          ejecutable: true
        },
        {
          t: "profundizar",
          titulo: "¿Qué se gana ocultando los atributos?",
          bloques: [
            {
              t: "texto",
              md: "Imagina que `precio` de un `Kayak` fuera público: alguien podría escribir `kayak.precio = -500`. Si el atributo es privado y solo se puede cambiar con `setPrecio(double nuevo)`, ese método puede **rechazar** valores absurdos, registrar el cambio o recalcular otros datos. Además, el interior de la clase puede cambiar (por ejemplo, guardar el precio en céntimos) **sin romper** el código de quienes la usan, porque ellos solo conocen los métodos. En la UT4 lo implementarás tú."
            }
          ]
        },
        {
          t: "relacionar",
          p: "Relaciona cada expresión con lo que es.",
          pares: [
            ["p.y", "propiedad (dato)"],
            ["p.getY()", "método que consulta"],
            ["p.translate(1, 1)", "método que modifica el estado"],
            ["new Point(1, 2)", "constructor"]
          ],
          codigo: true,
          e: "La diferencia se ve en la sintaxis: sin paréntesis es un dato; con paréntesis, una acción."
        },
        {
          t: "ejecuta",
          p: "Un kayak está en la posición `(2, 5)` del almacén (usa un `Point`). Muévelo 4 filas hacia delante (`x`) y 1 columna hacia atrás (`y`) **usando un método**, y muestra su posición final con el formato `Posicion: (6, 4)`.",
          inicial: `import java.awt.Point;

public class MoverKayak {
    public static void main(String[] args) {
    }
}`,
          tests: [
            { out: "Posicion: (6, 4)" }
          ],
          pistas: [
            "Hay un método de `Point` que mueve el punto sumando incrementos.",
            "`translate(dx, dy)`: usa un `-1` para ir hacia atrás."
          ],
          solucion: `import java.awt.Point;

public class MoverKayak {
    public static void main(String[] args) {
        Point kayak = new Point(2, 5);
        kayak.translate(4, -1);
        System.out.println("Posicion: (" + kayak.x + ", " + kayak.y + ")");
    }
}`
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Los **getters y setters** son tan habituales que los IDE los generan solos (en VS Code: clic derecho › *Source Action › Generate Getters and Setters*). Pero no los generes a ciegas: un `setX` por cada atributo desmonta la encapsulación. Pregúntate qué operaciones **tiene sentido** ofrecer: un kayak tiene `alquilar()` y `devolver()`, no `setDisponible(...)`.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos **propiedades y encapsulación**.",
        inicial: [
          {
            p: "¿Cómo se consulta la propiedad `x` de un `Point p`?",
            o: ["`p.x`", "`p.x()`", "`p->x`", "`x(p)`"],
            c: 0,
            e: "Notación punto, sin paréntesis."
          },
          {
            p: "¿Para qué sirve ocultar los atributos de una clase?",
            o: [
              "Para que el programa ocupe menos",
              "Para proteger al objeto de datos incorrectos",
              "Porque Java no permite atributos públicos",
              "Para que no se pueda crear el objeto"
            ],
            c: 1,
            e: "Es la encapsulación."
          }
        ],
        pasos: [
          {
            titulo: "Propiedades frente a métodos",
            cubre: [0],
            explica: "Una **propiedad** es un dato: `p.x`. Un **método** es una acción: `p.translate(1, 2)`. El paréntesis es la pista. Los métodos que consultan se llaman *getters* (`getX()`), los que modifican, *setters*.",
            pregunta: {
              p: "¿Cuál es un método?",
              o: ["`p.x`", "`p.y`", "`p.translate(1, 0)`", "`p`"],
              c: 2,
              e: "Lleva paréntesis y parámetros."
            }
          },
          {
            titulo: "Encapsulación",
            cubre: [1],
            explica: "Casi todas las clases ocultan sus atributos y ofrecen métodos para usarlos. Así pueden **validar** los datos y cambiar su interior sin romper a quien las usa.",
            pregunta: {
              p: "¿Qué ventaja tiene `setPrecio(double nuevo)` frente a un atributo `precio` público?",
              o: ["Es más rápido", "Puede rechazar precios negativos", "Ocupa menos memoria", "Ninguna"],
              c: 1,
              e: "El método puede validar."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Crea un \`Point\` en (1, 1), súmale (2, 3) con el método adecuado y muestra \`3,4\`.
 `,
          inicial: `
 import java.awt.Point;

 public class Mueve {
     public static void main(String[] args) {
     }
 }
 `,
          tests: [
            { out: "3,4" }
          ],
          solucion: `
 import java.awt.Point;

 public class Mueve {
     public static void main(String[] args) {
         Point p = new Point(1, 1);
         p.translate(2, 3);
         System.out.println(p.x + "," + p.y);
     }
 }
 `,
          pistas: ["`translate` suma los incrementos a `x` e `y`."]
        }
      }
    },

    {
      id: "ut2-estaticos",
      titulo: "Métodos estáticos y formato",
      resumen: "Math, Integer, String.valueOf y String.format: métodos que se llaman sobre la clase.",
      bloques: [
        {
          t: "texto",
          md: "Algunos métodos no necesitan un objeto: pertenecen a la **clase**. Se llaman **métodos estáticos** (`static`) y se usan escribiendo el nombre de la clase, un punto y el método. Ya conoces uno: `main` es estático."
        },
        {
          t: "codigo",
          titulo: "Estaticos.java",
          code: `public class Estaticos {
    public static void main(String[] args) {
        System.out.println(Math.sqrt(16));        // 4.0
        System.out.println(Math.pow(2, 10));      // 1024.0
        System.out.println(Math.max(7, 12));      // 12
        System.out.println(Math.round(21.735));   // 22
        System.out.println(Math.ceil(3.2));       // 4.0
        System.out.println(Math.PI);              // un atributo estático
        int numero = Integer.parseInt("25");      // de texto a int
        double precio = Double.parseDouble("34.50");
        String texto = String.valueOf(99);        // de número a texto
        System.out.println(numero + 1);
        System.out.println(precio * 2);
        System.out.println(texto + 1);
    }
}`,
          ejecutable: true
        },
        {
          t: "tabla",
          titulo: "¿Estático o de instancia?",
          cab: ["De instancia", "Estático"],
          filas: [
            [
              "Se llama sobre un **objeto**: `modelo.length()`",
              "Se llama sobre la **clase**: `Math.sqrt(16)`"
            ],
            ["Depende de los datos de ese objeto", "No depende de ningún objeto concreto"]
          ]
        },
        {
          t: "test",
          p: "¿Por qué `Math.sqrt(16)` es estático y `modelo.length()` no?",
          o: [
            "Por casualidad",
            "La raíz no depende de ningún objeto; la longitud depende del texto concreto",
            "`Math` es una clase muy antigua",
            "Porque `length` es más lento"
          ],
          c: 1,
          e: "Es el criterio que usarás en la UT4 para decidir si tus métodos son estáticos."
        },
        {
          t: "predecir",
          p: "¿Qué muestra? Mira bien qué clase llama a qué método.",
          code: `System.out.println(Math.max(3, 9) + Math.min(3, 9));
System.out.println(Integer.parseInt("12") + Integer.parseInt("30"));
System.out.println("12" + "30");
System.out.println(Math.round(2.5) + " " + Math.round(2.4) + " " + Math.round(-2.5));`,
          salida: `12
42
1230
3 2 -2`,
          e: "`max + min` = 9 + 3 = 12; `parseInt` convierte antes de sumar (42); sin `parseInt`, `+` concatena; `Math.round` redondea la mitad hacia arriba (incluso con negativos: −2,5 → −2)."
        },
        {
          t: "texto",
          md: `### Dar formato a los números
\`String.format\` construye un texto con un formato. \`%.2f\` significa «decimal con dos decimales», \`%d\` «entero», \`%s\` «texto», \`%n\` «salto de línea». \`System.out.printf\` hace lo mismo pero muestra el resultado directamente.`
        },
        {
          t: "codigo",
          titulo: "Formato.java",
          code: `public class Formato {
    public static void main(String[] args) {
        double total = 125.235;
        String linea = String.format("Total: %.2f euros", total);
        System.out.println(linea);
        System.out.printf("Codigo: NB-%04d%n", 42);
        System.out.printf("%s cuesta %.1f euros y quedan %d%n", "Kayak", 249.9, 3);
        System.out.printf("%8.2f|%-8s|%n", 3.14159, "ab");
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "Si tu ordenador está en español, `%.2f` escribe el decimal con **coma** (`125,24`), no con punto. Además `printf` **redondea** (mitad hacia arriba), mientras que concatenar un `double` lo muestra tal cual (`125.235`)."
        },
        {
          t: "huecos",
          p: "Muestra el precio con exactamente dos decimales.",
          codigo: "System.out.{{printf}}(\"Precio: %{{.2f}} euros%n\", precio);",
          e: "`printf` formatea; `%.2f` pide dos decimales; `%n` salta de línea."
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `Math.round(x * 100) / 100.0` lleva `.0`?",
          bloques: [
            {
              t: "texto",
              md: "Es la forma clásica de redondear a dos decimales: `x * 100` desplaza los decimales, `Math.round` redondea al entero más cercano y `/ 100.0` los devuelve a su sitio. Con `/ 100` (sin `.0`) la división sería **entera** y perderías los decimales (repaso de la UT1). Para **mostrar**, mejor `String.format(\"%.2f\", x)`: redondear y mostrar son cosas distintas."
            },
            {
              t: "codigo",
              code: `double x = 125.235;
System.out.println(Math.round(x * 100) / 100.0);
System.out.println(Math.round(x * 100) / 100);
System.out.println(String.format("%.2f", x));`,
              ejecutable: true
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Qué es `Integer.MAX_VALUE`?",
          bloques: [
            {
              t: "texto",
              md: "`Integer.MAX_VALUE` es un **atributo estático** de la clase `Integer`: el mayor `int` posible (2 147 483 647). Existe también `Integer.MIN_VALUE`. Además, `Math.addExact(a, b)` suma lanzando una excepción si hay desbordamiento (lo que en la UT1 pasaba en silencio)."
            }
          ]
        },
        {
          t: "ejecuta",
          p: `Escribe \`Ticket\`: con un precio unitario de **34,50**, 3 unidades y un IVA del 21 %, muestra con \`printf\` la base, el IVA y el total, **cada uno con dos decimales**, así (la coma es la del ordenador en español):
\`\`\`
Base:  103,50
IVA:    21,74
Total: 125,24
\`\`\`
(los números se alinean a la derecha en 7 posiciones).`,
          inicial: `public class Ticket {
    public static void main(String[] args) {
        double precio = 34.50;
        int unidades = 3;
        final double IVA = 0.21;
    }
}`,
          tests: [
            {
              out: `Base:   103,50
IVA:     21,74
Total:  125,24`
            }
          ],
          pistas: [
            "`%7.2f` reserva 7 posiciones y usa 2 decimales.",
            "Cuida los espacios después de `Base:`, `IVA:` y `Total:` para alinear."
          ],
          solucion: `public class Ticket {
    public static void main(String[] args) {
        double precio = 34.50;
        int unidades = 3;
        final double IVA = 0.21;
        double base = precio * unidades;
        double importeIva = base * IVA;
        double total = base + importeIva;
        System.out.printf("Base:  %7.2f%n", base);
        System.out.printf("IVA:   %7.2f%n", importeIva);
        System.out.printf("Total: %7.2f%n", total);
    }
}`
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "El formato de números **depende de la configuración regional** (`Locale`): en España `1.234,56`, en EE. UU. `1,234.56`. Un programa que muestra dinero o fechas a clientes de varios países debe indicar el `Locale` explícitamente: `String.format(Locale.US, \"%.2f\", x)`. Nunca asumas el del ordenador donde pruebas.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Calculadora de tarifa con descuentos por duración",
          p: `La tienda cobra el alquiler de un kayak a \`12.50\` €/hora. Dado \`int minutos = 200;\`, calcula las **horas facturables** redondeando **hacia arriba** (cada hora empezada se cobra entera: 200 min → 4 h) **sin usar \`if\`** (usa \`Math.ceil\` y un casting). Muestra:
\`\`\`
Horas facturables: 4
Total: 50,00 euros
\`\`\``,
          requisitos: [
            "Usas `Math.ceil` con una división **decimal** (`/ 60.0`)",
            "Conviertes con casting a `int`",
            "Usas `printf` para el total"
          ],
          inicial: `public class TarifaHoras {
    public static void main(String[] args) {
        final double PRECIO_HORA = 12.50;
        int minutos = 200;
    }
}`,
          tests: [
            {
              out: `Horas facturables: 4
Total: 50,00 euros`
            }
          ],
          pistas: [
            "`200 / 60` es 3 (entera). Necesitas 3,33… para que `ceil` dé 4.",
            "`Math.ceil` devuelve un `double`: conviértelo con `(int)`."
          ],
          solucion: `public class TarifaHoras {
    public static void main(String[] args) {
        final double PRECIO_HORA = 12.50;
        int minutos = 200;
        int horas = (int) Math.ceil(minutos / 60.0);
        double total = horas * PRECIO_HORA;
        System.out.println("Horas facturables: " + horas);
        System.out.printf("Total: %.2f euros%n", total);
    }
}`,
          rubrica: [
            "Entiendes por qué `minutos / 60` sin decimal daría una hora menos",
            "Pruebas con 180, 181 y 1 minuto"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos los **métodos estáticos y el formato** de números.",
        inicial: [
          {
            p: "¿Cómo se llama a un método estático?",
            o: [
              "Sobre un objeto: `obj.metodo()`",
              "Sobre la clase: `Clase.metodo()`",
              "Con `new`",
              "No se puede llamar"
            ],
            c: 1,
            e: "Se escribe el nombre de la clase y el método."
          },
          {
            p: "¿Qué da `Math.round(7.5)`?",
            o: ["7", "8", "7.5", "7.0"],
            c: 1,
            e: "Redondea al entero más cercano y la mitad hacia arriba."
          },
          {
            p: "¿Qué hace `%.2f` en `printf`?",
            o: [
              "Muestra un entero",
              "Muestra un decimal con dos decimales",
              "Muestra un texto",
              "Salta de línea"
            ],
            c: 1,
            e: "`f` = decimal, `.2` = dos decimales."
          }
        ],
        pasos: [
          {
            titulo: "Estático frente a instancia",
            cubre: [0],
            explica: "Si el método **no depende de ningún objeto concreto**, es estático y se llama sobre la clase (`Math.sqrt(9)`). Si depende de los datos de un objeto, se llama sobre el objeto (`texto.length()`).",
            pregunta: {
              p: "¿Cuál de estas llamadas es **estática**?",
              o: ["`nombre.length()`", "`Math.pow(2, 3)`", "`texto.strip()`", "`p.translate(1, 1)`"],
              c: 1,
              e: "`Math.pow` no necesita ningún objeto."
            }
          },
          {
            titulo: "Math y conversiones",
            cubre: [1],
            explica: "`Math.round` redondea al entero más cercano (mitad hacia arriba) y devuelve `long`; `Math.ceil` redondea hacia arriba y devuelve `double`. `Integer.parseInt(\"25\")` convierte texto a `int`.",
            ejemplo: {
              code: `System.out.println(Math.round(7.5));
System.out.println(Math.ceil(7.1));
System.out.println(Integer.parseInt("25") + 1);`,
              ejecutable: true,
              titulo: "Pruébalo"
            },
            pregunta: {
              p: "¿Qué da `Math.ceil(3.01)`?",
              o: ["`3.0`", "`4.0`", "`3`", "`4`"],
              c: 1,
              e: "`ceil` sube al siguiente entero y devuelve `double`."
            }
          },
          {
            titulo: "printf y String.format",
            cubre: [2],
            explica: "`%d` entero, `%f` decimal (`%.2f` con 2 decimales), `%s` texto, `%n` salto de línea. `printf` muestra; `String.format` devuelve el texto.",
            ejemplo: {
              code: "System.out.printf(\"%s: %.2f euros%n\", \"Kayak\", 249.9);",
              ejecutable: true,
              titulo: "Pruébalo"
            },
            pregunta: {
              p: "¿Qué muestra `System.out.printf(\"%d%%%n\", 15);`?",
              o: ["`15%`", "`15`", "`%d`", "Error"],
              c: 0,
              e: "`%%` escribe un símbolo de porcentaje."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Muestra la raíz cuadrada de 2 con **tres decimales** usando \`printf\`:
 \`\`\`
 1,414
 \`\`\`
 `,
          inicial: `
 public class Raiz {
     public static void main(String[] args) {
     }
 }
 `,
          tests: [
            { out: "1,414" }
          ],
          solucion: `
 public class Raiz {
     public static void main(String[] args) {
         System.out.printf("%.3f%n", Math.sqrt(2));
     }
 }
 `,
          pistas: ["`Math.sqrt(2)` devuelve un `double`. `%.3f` da tres decimales."]
        }
      }
    },

    {
      id: "ut2-constructores",
      titulo: "Constructores: Scanner, Random y LocalDate",
      resumen: "Cómo se crean objetos de clases de la API y cómo se usan para leer datos, generar azar y trabajar con fechas.",
      bloques: [
        {
          t: "texto",
          md: `Un **constructor** es un método especial que se ejecuta al crear un objeto con \`new\` y prepara su estado inicial. Se llama igual que la clase y puede tener varias versiones con distintos parámetros (**sobrecarga**):
\`\`\`
Point origen = new Point();               // (0, 0)
Point posicion = new Point(3, 4);         // (3, 4)
StringBuilder vacio = new StringBuilder();
StringBuilder ticket = new StringBuilder("NÁUTICA BAHÍA\\n");
\`\`\`
### Leer del teclado: \`Scanner\`
Su constructor recibe **de dónde leer**; \`System.in\` es el teclado. Métodos principales: \`nextLine()\` (una línea), \`nextInt()\`, \`nextDouble()\` y \`next()\` (una palabra).`
        },
        {
          t: "codigo",
          titulo: "SaludoCliente.java",
          code: `import java.util.Scanner;

public class SaludoCliente {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        System.out.print("Nombre del cliente: ");
        String nombre = teclado.nextLine();
        System.out.print("Días de alquiler: ");
        int dias = teclado.nextInt();
        System.out.println("Hola, " + nombre.strip() + ". Alquiler de " + dias + " días.");
        teclado.close();
    }
}`,
          ejecutable: true,
          stdin: `Laura Martínez
3
`
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: `**Dos trampas de \`Scanner\`**
- Tras \`nextInt()\` o \`nextDouble()\` el **salto de línea queda sin leer**. Si después llamas a \`nextLine()\`, devolverá un texto **vacío**. Solución: un \`nextLine()\` extra para limpiar, o leer primero los textos.
- Con el ordenador en español, \`nextDouble()\` espera los decimales con **coma** (\`12,5\`). Si escribes \`12.5\`, falla.`
        },
        {
          t: "predecir",
          p: "Este programa recibe esta entrada del usuario: `3`, Intro, `Laura`, Intro. ¿Qué muestra? (Fíjate en la trampa.)",
          code: `import java.util.Scanner;
Scanner t = new Scanner(System.in);
int dias = t.nextInt();
String nombre = t.nextLine();
System.out.println("[" + nombre + "] " + dias);`,
          stdin: `3
Laura
`,
          salida: "[] 3",
          e: "`nextInt()` lee el 3 pero deja el salto de línea; `nextLine()` consume justo ese resto vacío. `Laura` no se llega a leer."
        },
        {
          t: "ejecuta",
          p: `**Arregla la trampa.** Este programa debería leer los días y después el nombre, pero el nombre sale vacío. Corrígelo añadiendo **una sola línea**. Con la entrada \`3\`, \`Laura Martínez\` debe mostrar:
\`\`\`
Cliente: Laura Martínez (3 días)
\`\`\``,
          inicial: `import java.util.Scanner;

public class LeerBien {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int dias = teclado.nextInt();
        String nombre = teclado.nextLine();
        System.out.println("Cliente: " + nombre + " (" + dias + " días)");
    }
}`,
          tests: [
            {
              in: `3
Laura Martínez
`,
              out: "Cliente: Laura Martínez (3 días)"
            }
          ],
          pistas: [
            "El salto de línea que escribe el usuario tras el 3 sigue en el teclado.",
            "Llama a `nextLine()` una vez y descarta el resultado."
          ],
          solucion: `import java.util.Scanner;

public class LeerBien {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int dias = teclado.nextInt();
        teclado.nextLine();
        String nombre = teclado.nextLine();
        System.out.println("Cliente: " + nombre + " (" + dias + " días)");
    }
}`
        },
        {
          t: "texto",
          md: `### Números aleatorios: \`Random\`
\`nextInt(n)\` devuelve un entero entre \`0\` y \`n - 1\`. Si al constructor le pasas un número (la **semilla**: \`new Random(42)\`) genera **siempre la misma secuencia**: útil para hacer pruebas.`
        },
        {
          t: "codigo",
          titulo: "CodigoReserva.java",
          code: `import java.util.Random;

public class CodigoReserva {
    public static void main(String[] args) {
        Random azar = new Random(42);
        int numero = azar.nextInt(9000) + 1000;   // entre 1000 y 9999
        char letra = (char) ('A' + azar.nextInt(26));
        System.out.println("Reserva: " + letra + "-" + numero);
    }
}`,
          ejecutable: true
        },
        {
          t: "test",
          p: "Quieres un número aleatorio entre **1 y 6** (un dado). ¿Qué expresión usas?",
          o: ["`azar.nextInt(6)`", "`azar.nextInt(6) + 1`", "`azar.nextInt(7)`", "`azar.nextInt(1, 6)`"],
          c: 1,
          e: "`nextInt(6)` da 0-5; sumando 1 sale 1-6. (Existe `nextInt(1, 7)` desde Java 17, pero el patrón `+ 1` es el clásico.)"
        },
        {
          t: "texto",
          md: `### Fechas: \`LocalDate\`
Algunas clases no se crean con \`new\`, sino con **métodos estáticos de fábrica** que fabrican el objeto:`
        },
        {
          t: "codigo",
          titulo: "FechaDevolucion.java",
          code: `import java.time.LocalDate;

public class FechaDevolucion {
    public static void main(String[] args) {
        LocalDate inicio = LocalDate.of(2026, 10, 9);
        LocalDate devolucion = inicio.plusDays(5);
        System.out.println("Devolución: " + devolucion);
        System.out.println("Día: " + devolucion.getDayOfWeek());
        System.out.println("Mes: " + devolucion.getMonthValue());
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "`LocalDate.of(...)` y `LocalDate.now()` son **métodos estáticos de fábrica**: devuelven un objeto nuevo sin usar `new`. La documentación de cada clase indica cómo se crea cada objeto. Los `LocalDate` son **inmutables**: `inicio.plusDays(5)` devuelve una fecha nueva y `inicio` no cambia."
        },
        {
          t: "predecir",
          p: "¿Qué muestra? Recuerda que las fechas son inmutables.",
          code: `import java.time.LocalDate;
LocalDate f = LocalDate.of(2026, 1, 30);
f.plusDays(5);
LocalDate g = f.plusDays(5);
System.out.println(f);
System.out.println(g);`,
          salida: `2026-01-30
2026-02-04`,
          e: "`f.plusDays(5)` sin guardar no hace nada. `g` es la fecha nueva, y Java gestiona el cambio de mes."
        },
        {
          t: "profundizar",
          titulo: "¿Cuándo hay que cerrar el Scanner?",
          bloques: [
            {
              t: "texto",
              md: "Cerrar el `Scanner` es buena práctica, pero **cierra también `System.in`**: si en el mismo programa creas otro `Scanner` después, ya no podrás leer. Regla sencilla: **un solo `Scanner` por programa**, que se cierra al final. Más adelante verás `try-with-resources`, que cierra los recursos automáticamente."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `Random` con semilla genera siempre lo mismo?",
          bloques: [
            {
              t: "texto",
              md: "Un `Random` no es realmente aleatorio: es una fórmula matemática (un generador congruencial lineal) que produce números a partir de un estado interno. La **semilla** fija ese estado inicial. Sin semilla, Java usa uno distinto cada vez (basado en el reloj). Con semilla, tus pruebas son **reproducibles**: ideal para depurar. Para contraseñas o claves **no** se usa `Random` sino `SecureRandom`."
            }
          ]
        },
        {
          t: "ejecuta",
          p: "Escribe `AlquilerSemana`: un cliente alquila un kayak el **12 de noviembre de 2026** durante **10 días**. Muestra la fecha de devolución con el formato `Devolucion: 2026-11-22` y el día de la semana (en inglés, tal como lo da `LocalDate`).",
          inicial: `import java.time.LocalDate;

public class AlquilerSemana {
    public static void main(String[] args) {
    }
}`,
          tests: [
            {
              out: `Devolucion: 2026-11-22
SUNDAY`
            }
          ],
          pistas: [
            "`LocalDate.of(año, mes, día)` crea la fecha.",
            "`plusDays(10)` devuelve una fecha nueva: guárdala."
          ],
          solucion: `import java.time.LocalDate;

public class AlquilerSemana {
    public static void main(String[] args) {
        LocalDate inicio = LocalDate.of(2026, 11, 12);
        LocalDate devolucion = inicio.plusDays(10);
        System.out.println("Devolucion: " + devolucion);
        System.out.println(devolucion.getDayOfWeek());
    }
}`
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Para trabajar con fechas **nunca** uses `String` ni restes números a mano: usa `java.time` (`LocalDate`, `LocalDateTime`, `Duration`, `ChronoUnit.DAYS.between(a, b)`). Calcular la diferencia de días «a mano» falla con los años bisiestos y con los meses de distinta duración. Y para guardar fechas en una base de datos o enviarlas por red, usa el formato **ISO-8601** (`2026-11-12`), que es justo el que imprime `LocalDate`.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Generador de códigos de reserva reproducibles",
          p: "Escribe un programa que genere el código de reserva `NB-<letra>-<4 cifras>` (letra mayúscula aleatoria y número entre 1000 y 9999) usando un `Random` **con semilla 7**. Como la semilla fija la secuencia, la salida es siempre la misma. Muestra los **dos primeros códigos** (uno por línea). Primero la letra y después el número en cada código.",
          requisitos: [
            "Un solo objeto `Random`, creado una vez",
            "El orden de las llamadas importa: letra, número, letra, número",
            "La letra se obtiene con `(char) ('A' + azar.nextInt(26))`"
          ],
          inicial: `import java.util.Random;

public class Codigos {
    public static void main(String[] args) {
    }
}`,
          tests: [
            {
              out: `NB-Q-1164
NB-D-6044`
            }
          ],
          pistas: [
            "Cada llamada a `nextInt` consume un valor de la secuencia: si cambias el orden, cambia el resultado."
          ],
          solucion: `import java.util.Random;

public class Codigos {
    public static void main(String[] args) {
        Random azar = new Random(7);
        char letra1 = (char) ('A' + azar.nextInt(26));
        int numero1 = azar.nextInt(9000) + 1000;
        char letra2 = (char) ('A' + azar.nextInt(26));
        int numero2 = azar.nextInt(9000) + 1000;
        System.out.println("NB-" + letra1 + "-" + numero1);
        System.out.println("NB-" + letra2 + "-" + numero2);
    }
}`,
          rubrica: [
            "Entiendes por qué cambiar el orden de las llamadas cambia los códigos",
            "Sabrías explicar por qué esto no sirve para generar contraseñas"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos los **constructores** y tres clases de la API: `Scanner`, `Random` y `LocalDate`.",
        inicial: [
          {
            p: "¿Qué hace `new Scanner(System.in)`?",
            o: [
              "Crea un lector que lee del teclado",
              "Imprime por pantalla",
              "Lee un fichero",
              "Importa la clase"
            ],
            c: 0,
            e: "`System.in` es el teclado."
          },
          {
            p: "¿Qué da `new Random().nextInt(10)`?",
            o: ["Un entero entre 1 y 10", "Un entero entre 0 y 9", "Un decimal entre 0 y 10", "Siempre 10"],
            c: 1,
            e: "`nextInt(n)` da de 0 a n−1."
          },
          {
            p: "¿Cómo se crea el 1 de enero de 2027 con `LocalDate`?",
            o: [
              "`new LocalDate(2027, 1, 1)`",
              "`LocalDate.of(2027, 1, 1)`",
              "`LocalDate(\"2027-1-1\")`",
              "`LocalDate.new(1, 1, 2027)`"
            ],
            c: 1,
            e: "Es un método estático de fábrica."
          }
        ],
        pasos: [
          {
            titulo: "Constructores y new",
            cubre: [2],
            explica: "Un constructor prepara el objeto al crearlo con `new` y se llama como la clase. Puede tener versiones con distintos parámetros: `new Point()` y `new Point(3, 4)`. Algunas clases (`LocalDate`) se crean con métodos de fábrica estáticos, sin `new`.",
            pregunta: {
              p: "¿Cuál de estas es una forma correcta de crear un objeto?",
              o: [
                "`LocalDate f = LocalDate.of(2026, 5, 1);`",
                "`LocalDate f = new LocalDate();`",
                "`LocalDate f = LocalDate;`",
                "`f = LocalDate(2026, 5, 1);`"
              ],
              c: 0,
              e: "`LocalDate` no tiene constructor público: se usa `of` o `now`."
            }
          },
          {
            titulo: "Scanner: leer datos",
            cubre: [0],
            explica: "`new Scanner(System.in)` lee del teclado. `nextLine()` lee una línea; `nextInt()` un entero, **sin consumir el salto de línea**. Si después de un número quieres leer una línea, haz antes un `nextLine()` de limpieza.",
            pregunta: {
              p: "Tras `int n = t.nextInt();` quieres leer una línea de texto. ¿Qué hay que hacer?",
              o: [
                "Nada, funciona directamente",
                "Llamar antes a `t.nextLine()` para descartar el resto de la línea",
                "Cerrar el `Scanner`",
                "Usar `nextInt` otra vez"
              ],
              c: 1,
              e: "El salto de línea sigue en el teclado."
            }
          },
          {
            titulo: "Random: rangos",
            cubre: [1],
            explica: "`nextInt(n)` va de 0 a n−1. Para el rango `[a, b]`: `azar.nextInt(b - a + 1) + a`. Con semilla, la secuencia siempre es la misma.",
            pregunta: {
              p: "¿Qué expresión da un entero entre 10 y 20 (ambos incluidos)?",
              o: [
                "`azar.nextInt(20)`",
                "`azar.nextInt(10) + 10`",
                "`azar.nextInt(11) + 10`",
                "`azar.nextInt(20) + 10`"
              ],
              c: 2,
              e: "Hay 11 valores (10..20): `nextInt(11) + 10`.",
              pista: "Cuenta cuántos valores hay en el rango y suma el mínimo."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Lee un entero por teclado y muestra su doble. Con la entrada \`21\`, debe mostrar \`42\`.
 `,
          inicial: `
 import java.util.Scanner;

 public class Doble {
     public static void main(String[] args) {
     }
 }
 `,
          tests: [
            {
              in: `21
`,
              out: "42"
            },
            {
              in: `-4
`,
              out: "-8"
            }
          ],
          solucion: `
 import java.util.Scanner;

 public class Doble {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int n = teclado.nextInt();
         System.out.println(n * 2);
     }
 }
 `,
          pistas: ["Crea el `Scanner` con `System.in` y lee con `nextInt()`."]
        }
      }
    },

    {
      id: "ut2-memoria",
      titulo: "Memoria, recolector de basura e import",
      resumen: "Cuándo se libera un objeto y cómo se importan las clases de otros paquetes.",
      bloques: [
        {
          t: "texto",
          md: `En Java **no hay que destruir los objetos a mano**. La máquina virtual tiene un **recolector de basura** (*garbage collector*) que, cada cierto tiempo, busca los objetos a los que **ya no apunta ninguna referencia** y libera su memoria.

Un objeto deja de ser accesible cuando:
- la variable que lo apuntaba deja de existir (termina el bloque donde se declaró);
- a esa variable se le asigna otro objeto, o \`null\`.`
        },
        {
          t: "codigo",
          titulo: "Objetos inaccesibles",
          code: `StringBuilder borrador = new StringBuilder("Pedido 1");
borrador = new StringBuilder("Pedido 2");  // "Pedido 1" ya no es accesible
borrador = null;                           // "Pedido 2" tampoco
// El recolector liberará los dos cuando lo considere oportuno.`
        },
        {
          t: "memoria",
          titulo: "Después de la segunda línea",
          variables: [
            { n: "borrador", tipo: "StringBuilder", ref: "o2" }
          ],
          objetos: [
            { id: "o1", clase: "StringBuilder («Pedido 1»)  ← basura", campos: [] },
            { id: "o2", clase: "StringBuilder («Pedido 2»)", campos: [] }
          ],
          nota: "Ninguna flecha llega al objeto «Pedido 1»: el recolector de basura podrá liberarlo."
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "No sabemos **cuándo** se ejecutará el recolector. `System.gc()` solo se lo **sugiere** a la máquina virtual, que puede ignorarlo; en programas normales no se usa. Lo que sí es responsabilidad del programador es **cerrar los recursos** que abre (un `Scanner`, un fichero, una conexión)."
        },
        {
          t: "test",
          p: "`Point a = new Point(1, 1); Point b = a; a = null;` ¿Puede el recolector liberar el objeto?",
          o: [
            "Sí, porque `a` vale `null`",
            "No, porque `b` todavía apunta a él",
            "Sí, siempre",
            "Solo si llamas a `System.gc()`"
          ],
          c: 1,
          e: "Mientras quede **alguna** referencia, el objeto sigue accesible."
        },
        {
          t: "ordenar",
          p: "Ordena el ciclo de vida de un objeto.",
          items: [
            "Se crea con new y una variable lo referencia",
            "Se usa llamando a sus métodos",
            "Ninguna variable lo referencia ya",
            "El recolector de basura libera su memoria"
          ],
          e: "El programador solo crea y usa; la liberación es automática."
        },
        {
          t: "texto",
          md: `### Librerías: la sentencia \`import\`
Para usar una clase de otro paquete hay que **importarla** al principio del archivo, antes de la clase:
\`\`\`
import java.util.Scanner;       // una clase concreta
import java.time.LocalDate;
import java.util.*;             // todas las clases del paquete java.util
\`\`\`
Las clases del paquete \`java.lang\` (\`String\`, \`Math\`, \`Integer\`, \`System\`…) se importan **automáticamente**. Por eso hasta ahora no habías necesitado ningún \`import\` para ellas. El IDE suele añadir los \`import\` solo cuando escribes el nombre de la clase.`
        },
        {
          t: "relacionar",
          p: "¿Necesita `import` o no?",
          pares: [
            ["String", "no (java.lang)"],
            ["Math", "no (java.lang)"],
            ["Scanner", "sí (java.util)"],
            ["LocalDate", "sí (java.time)"],
            ["Random", "sí (java.util)"]
          ],
          codigo: true,
          e: "Solo `java.lang` es automático."
        },
        {
          t: "ejecuta",
          p: "**Arregla el error.** Este programa no compila. Léelo y corrígelo para que muestre `Nos vemos el 2026-12-24`.",
          inicial: `public class Cita {
    public static void main(String[] args) {
        LocalDate dia = LocalDate.of(2026, 12, 24);
        System.out.println("Nos vemos el " + dia);
    }
}`,
          tests: [
            { out: "Nos vemos el 2026-12-24" }
          ],
          pistas: [
            "El compilador dice *cannot find symbol* sobre `LocalDate`: no sabe qué clase es.",
            "Falta `import java.time.LocalDate;` antes de la clase."
          ],
          solucion: `import java.time.LocalDate;

public class Cita {
    public static void main(String[] args) {
        LocalDate dia = LocalDate.of(2026, 12, 24);
        System.out.println("Nos vemos el " + dia);
    }
}`,
          explicacion: "Sin el `import`, Java no sabe dónde buscar `LocalDate`."
        },
        {
          t: "profundizar",
          titulo: "¿Qué diferencia hay entre `import java.util.*` e importar una clase concreta?",
          bloques: [
            {
              t: "texto",
              md: "El comodín `*` importa **todas las clases públicas del paquete** (no los subpaquetes), pero no tiene coste en tiempo de ejecución: solo le dice al compilador dónde buscar. En equipos profesionales se prefieren los imports **explícitos** porque documentan qué clases usa el archivo y evitan ambigüedades (hay una `List` en `java.util` y otra en `java.awt`)."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Qué es una fuga de memoria si Java tiene recolector?",
          bloques: [
            {
              t: "texto",
              md: "Sigue pudiendo haberlas: si **conservas referencias** a objetos que ya no necesitas (una lista estática que solo crece, una caché sin límite), el recolector **no puede** liberarlos porque siguen accesibles. El recolector libera lo **inalcanzable**, no lo **inútil**. En C/C++ el programador libera a mano (`free`, `delete`) y olvidarlo provoca fugas; Java lo automatiza a cambio de algo de rendimiento."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "En tu CV, «Java» incluye entender **cuándo un objeto sigue vivo**. En entrevistas es clásica la pregunta *«¿puede haber fugas de memoria en Java?»*. Respuesta de profesional: sí, por referencias que se conservan sin necesidad (colecciones estáticas, listeners no eliminados, cachés sin límite).",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Última sección de la UT2: **memoria, recolector de basura e import**.",
        inicial: [
          {
            p: "¿Cuándo puede el recolector de basura liberar un objeto?",
            o: [
              "Cuando termina el programa",
              "Cuando ninguna referencia apunta a él",
              "Cuando llamamos a `delete`",
              "Nunca"
            ],
            c: 1,
            e: "Cuando es inaccesible."
          },
          {
            p: "¿Qué paquete se importa automáticamente?",
            o: ["`java.util`", "`java.lang`", "`java.time`", "`java.awt`"],
            c: 1,
            e: "`java.lang` contiene `String`, `Math`, `System`…"
          },
          {
            p: "`import java.util.Scanner;` va…",
            o: [
              "Dentro de `main`",
              "Al principio del archivo, antes de la clase",
              "Después de la clase",
              "En un archivo aparte"
            ],
            c: 1,
            e: "Los import se escriben antes de la declaración de la clase."
          }
        ],
        pasos: [
          {
            titulo: "Recolector de basura",
            cubre: [0],
            explica: "Un objeto es **basura** cuando ya no hay ninguna referencia que llegue hasta él. Java lo detecta y libera su memoria **automáticamente**, en un momento que no controlas.",
            pregunta: {
              p: "`String s = new String(\"a\"); s = new String(\"b\");` ¿Qué ocurre con el primer objeto?",
              o: [
                "Sigue accesible",
                "Queda sin referencias: es candidato a liberarse",
                "Se convierte en `null`",
                "Se copia en `s`"
              ],
              c: 1,
              e: "Ninguna variable lo apunta ya."
            }
          },
          {
            titulo: "La sentencia import",
            cubre: [1, 2],
            explica: "Para usar una clase que no es de `java.lang`, hay que importarla antes de la clase: `import java.util.Scanner;`. Sin `import`, el compilador dice *cannot find symbol*.",
            pregunta: {
              p: "¿Qué imports necesita un programa que usa `Scanner` y `Random`?",
              o: [
                "Ninguno",
                "`import java.util.Scanner;` e `import java.util.Random;`",
                "`import java.lang.*;`",
                "`import java.time.*;`"
              ],
              c: 1,
              e: "Las dos clases están en `java.util`."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Escribe un programa que cree un \`Random\` con semilla 1, genere un entero entre 0 y 99 con \`nextInt(100)\` y muestre \`Numero: <valor>\`. Recuerda el \`import\`.
 `,
          inicial: `
 public class Azar {
     public static void main(String[] args) {
     }
 }
 `,
          tests: [
            { out: "Numero: 85" }
          ],
          solucion: `
 import java.util.Random;

 public class Azar {
     public static void main(String[] args) {
         Random r = new Random(1);
         System.out.println("Numero: " + r.nextInt(100));
     }
 }
 `,
          pistas: ["`Random` está en `java.util`: necesita `import`."]
        }
      }
    }

  ],

  /* ============ BANCO DE PREGUNTAS PARA LA AUTOEVALUACIÓN (+1 / −1/3 / 0) ============ */
  banco: [
    {
      sec: "ut2-objetos",
      p: "¿Qué es una clase?",
      o: [
        "Un objeto concreto",
        "La plantilla a partir de la cual se crean objetos",
        "Un método especial",
        "Una variable global"
      ],
      c: 1,
      e: "La clase es el molde; los objetos son sus instancias."
    },
    {
      sec: "ut2-objetos",
      p: "¿Qué tres cosas tiene todo objeto?",
      o: [
        "Estado, comportamiento e identidad",
        "Nombre, tipo y valor",
        "Clase, paquete y método",
        "Variable, constante y literal"
      ],
      c: 0,
      e: "Estado (atributos), comportamiento (métodos) e identidad."
    },
    {
      sec: "ut2-objetos",
      p: "En la POO, ¿qué son los métodos de un objeto?",
      o: ["Los datos que guarda", "Lo que sabe hacer", "Su identidad", "Su paquete"],
      c: 1,
      e: "El comportamiento."
    },
    {
      sec: "ut2-objetos",
      p: "Dos objetos de la misma clase con los mismos datos…",
      o: ["Son el mismo objeto", "Son dos objetos con identidad propia", "No pueden existir", "Se fusionan"],
      c: 1,
      e: "La identidad es independiente de los datos."
    },
    {
      sec: "ut2-objetos",
      p: "En la documentación de la API aparece `int indexOf(String str)`. ¿Qué significa?",
      o: [
        "Recibe un `int` y devuelve un `String`",
        "Recibe un `String` y devuelve un `int`",
        "No recibe nada",
        "No devuelve nada"
      ],
      c: 1,
      e: "Delante del nombre va lo que devuelve; entre paréntesis, lo que recibe."
    },
    {
      sec: "ut2-objetos",
      p: "¿Dónde se consulta qué métodos tiene una clase de Java?",
      o: ["En la API oficial de Java", "En el compilador", "En el sistema operativo", "No se puede"],
      c: 0,
      e: "La API de Java es la documentación oficial."
    },
    {
      sec: "ut2-objetos",
      p: "Un atributo de un objeto forma parte de su…",
      o: ["Comportamiento", "Estado", "Constructor", "Paquete"],
      c: 1,
      e: "Los atributos son su estado."
    },
    {
      sec: "ut2-referencias",
      p: "¿Qué guarda una variable de tipo objeto?",
      o: ["El objeto completo", "Una referencia al objeto", "Una copia del objeto", "Solo su clase"],
      c: 1,
      e: "Guarda una referencia (la dirección del objeto)."
    },
    {
      sec: "ut2-referencias",
      p: "¿Qué hace `new Point(3, 4)`?",
      o: ["Declara una variable", "Crea un objeto en memoria", "Importa la clase", "Copia un objeto"],
      c: 1,
      e: "`new` crea un objeto nuevo."
    },
    {
      sec: "ut2-referencias",
      p: "`Point a = new Point(1,2); Point b = a; b.x = 8;` ¿Cuánto vale `a.x`?",
      o: ["1", "8", "2", "Error"],
      c: 1,
      e: "`a` y `b` apuntan al mismo objeto.",
      salida: "8"
    },
    {
      sec: "ut2-referencias",
      p: "`Point a = new Point(1,2); Point b = new Point(1,2); b.x = 8;` ¿Cuánto vale `a.x`?",
      o: ["1", "8", "2", "Error"],
      c: 0,
      e: "Son dos objetos distintos.",
      salida: "1"
    },
    {
      sec: "ut2-referencias",
      p: "¿Qué ocurre si se llama a un método de una variable que vale `null`?",
      o: ["Devuelve 0", "Lanza `NullPointerException`", "Crea el objeto", "No pasa nada"],
      c: 1,
      e: "No hay objeto sobre el que llamar."
    },
    {
      sec: "ut2-referencias",
      p: "¿Cuál de estas variables puede valer `null`?",
      o: ["`int a`", "`double b`", "`String c`", "`boolean d`"],
      c: 2,
      e: "Solo las variables de objeto; los primitivos nunca."
    },
    {
      sec: "ut2-referencias",
      p: "¿Dónde se guardan las variables locales y dónde los objetos?",
      o: [
        "Variables en el montón y objetos en la pila",
        "Variables en la pila y objetos en el montón",
        "Todo en la pila",
        "Todo en el montón"
      ],
      c: 1,
      e: "Pila para variables locales; montón para objetos.",
      nivel: "pro"
    },
    {
      sec: "ut2-referencias",
      p: "Con `String t = \"\";`, ¿qué devuelve `t.length()`?",
      o: ["`NullPointerException`", "`0`", "`1`", "`-1`"],
      c: 1,
      e: "Un texto vacío es un objeto con longitud 0 (no es `null`).",
      salida: "0"
    },
    {
      sec: "ut2-metodos",
      p: "Con `String s = \"kayak\";`, ¿qué devuelve `s.charAt(0)`?",
      o: ["`k`", "`a`", "`y`", "Error"],
      c: 0,
      e: "La primera posición es la 0.",
      salida: "k"
    },
    {
      sec: "ut2-metodos",
      p: "Con `String s = \"kayak\";`, ¿qué devuelve `s.substring(1, 3)`?",
      o: ["`aya`", "`ay`", "`kay`", "`ya`"],
      c: 1,
      e: "Posiciones 1 y 2: `a` y `y`.",
      salida: "ay"
    },
    {
      sec: "ut2-metodos",
      p: "Con `String s = \"neopreno\";`, ¿qué devuelve `s.indexOf(\"pre\")`?",
      o: ["2", "3", "4", "-1"],
      c: 1,
      e: "`n`=0 `e`=1 `o`=2 `p`=3.",
      salida: "3"
    },
    {
      sec: "ut2-metodos",
      p: "¿Qué devuelve `\"kayak\".indexOf(\"z\")`?",
      o: ["0", "-1", "`null`", "Error"],
      c: 1,
      e: "Si no aparece devuelve −1.",
      salida: "-1"
    },
    {
      sec: "ut2-metodos",
      p: "Tras `String s = \"sol\"; s.toUpperCase();` ¿cuánto vale `s`?",
      o: ["`\"SOL\"`", "`\"sol\"`", "`null`", "Error"],
      c: 1,
      e: "Los `String` son inmutables y no se guardó el resultado."
    },
    {
      sec: "ut2-metodos",
      p: "¿Qué línea deja `nombre` en mayúsculas?",
      o: [
        "`nombre.toUpperCase();`",
        "`nombre = nombre.toUpperCase();`",
        "`nombre.toUpperCase;`",
        "`toUpperCase(nombre);`"
      ],
      c: 1,
      e: "Hay que guardar el resultado."
    },
    {
      sec: "ut2-metodos",
      p: "¿Cómo se comparan correctamente dos textos?",
      o: ["`a == b`", "`a.equals(b)`", "`a = b`", "`a.compare(b)`"],
      c: 1,
      e: "`equals` compara el contenido."
    },
    {
      sec: "ut2-metodos",
      p: "Con `String a = \"kayak\"; String b = new String(\"kayak\");` ¿qué da `a == b`?",
      o: ["`true`", "`false`", "Error", "`null`"],
      c: 1,
      e: "Son dos objetos distintos aunque tengan el mismo contenido.",
      salida: "false"
    },
    {
      sec: "ut2-metodos",
      p: "¿Qué da `\"  Hola \".strip().length()`?",
      o: ["4", "6", "5", "3"],
      c: 0,
      e: "`strip()` deja `\"Hola\"`: 4 letras.",
      salida: "4"
    },
    {
      sec: "ut2-metodos",
      p: "¿Qué muestra `System.out.println(\"Java\".substring(2));`?",
      o: ["`Ja`", "`va`", "`ava`", "`a`"],
      c: 1,
      e: "Desde la posición 2 hasta el final.",
      salida: "va"
    },
    {
      sec: "ut2-metodos",
      p: "¿Qué devuelve `\"Hola\".charAt(4)`?",
      o: ["`a`", "`null`", "Una `StringIndexOutOfBoundsException`", "`\" \"`"],
      c: 2,
      e: "Las posiciones válidas van de 0 a 3."
    },
    {
      sec: "ut2-metodos",
      p: "¿Por qué es mejor escribir `\"si\".equals(respuesta)` que `respuesta.equals(\"si\")`?",
      o: [
        "Es más rápido",
        "Si `respuesta` es `null` no lanza excepción",
        "Compara mayúsculas",
        "No hay diferencia"
      ],
      c: 1,
      e: "El literal nunca es `null`.",
      nivel: "pro"
    },
    {
      sec: "ut2-metodos",
      p: "¿Qué devuelve `\"banana\".replace(\"an\", \"x\")`?",
      o: ["`bxxa`", "`bxna`", "`bxx`", "`bxa`"],
      c: 0,
      e: "Cambia cada aparición de `an` por `x`: `b` + `x` + `x` + `a`.",
      salida: "bxxa"
    },
    {
      sec: "ut2-propiedades",
      p: "¿Cómo se consulta la propiedad `x` de un `Point p`?",
      o: ["`p.x`", "`p.x()`", "`p->x`", "`x(p)`"],
      c: 0,
      e: "Notación punto sin paréntesis."
    },
    {
      sec: "ut2-propiedades",
      p: "`Point p = new Point(1,1); p.translate(2,3);` ¿Cuánto vale `p.y`?",
      o: ["3", "4", "1", "5"],
      c: 1,
      e: "1 + 3 = 4.",
      salida: "4"
    },
    {
      sec: "ut2-propiedades",
      p: "¿Para qué sirve la encapsulación?",
      o: [
        "Para que el programa sea más rápido",
        "Para proteger el estado del objeto de datos incorrectos",
        "Para ocultar la clase",
        "Para borrar objetos"
      ],
      c: 1,
      e: "Los atributos se ocultan y se accede con métodos que pueden validar."
    },
    {
      sec: "ut2-propiedades",
      p: "¿Qué es un *getter*?",
      o: [
        "Un método que modifica un atributo",
        "Un método que consulta un atributo",
        "Un constructor",
        "Un tipo de variable"
      ],
      c: 1,
      e: "Un `getX()` devuelve el valor de un atributo."
    },
    {
      sec: "ut2-estaticos",
      p: "¿Cómo se llama a `sqrt`?",
      o: ["`Math.sqrt(9)`", "`new Math().sqrt(9)`", "`sqrt.Math(9)`", "`9.sqrt()`"],
      c: 0,
      e: "Es estático: se llama sobre la clase."
    },
    {
      sec: "ut2-estaticos",
      p: "¿Qué devuelve `Math.round(2.5)`?",
      o: ["2", "3", "2.5", "2.0"],
      c: 1,
      e: "La mitad se redondea hacia arriba.",
      salida: "3"
    },
    {
      sec: "ut2-estaticos",
      p: "¿Qué muestra `System.out.println(Integer.parseInt(\"5\") + 1);`?",
      o: ["`6`", "`51`", "`\"5\"+1`", "Error"],
      c: 0,
      e: "`parseInt` convierte antes de sumar.",
      salida: "6"
    },
    {
      sec: "ut2-estaticos",
      p: "¿Qué muestra `System.out.println(\"5\" + 1);`?",
      o: ["`6`", "`51`", "Error", "`5`"],
      c: 1,
      e: "Concatena porque uno de los operandos es texto.",
      salida: "51"
    },
    {
      sec: "ut2-estaticos",
      p: "¿Qué da `Math.ceil(4.01)`?",
      o: ["`4.0`", "`5.0`", "`4`", "`5`"],
      c: 1,
      e: "`ceil` redondea hacia arriba y devuelve `double`.",
      salida: "5.0"
    },
    {
      sec: "ut2-estaticos",
      p: "¿Qué muestra `System.out.printf(\"%d%%%n\", 15);`?",
      o: ["`15%`", "`15`", "`%d`", "Error"],
      c: 0,
      e: "`%%` escribe un porcentaje.",
      salida: "15%"
    },
    {
      sec: "ut2-estaticos",
      p: "¿Qué significa `%.2f` en `printf`?",
      o: [
        "Un entero de 2 dígitos",
        "Un decimal con dos decimales",
        "Un texto de 2 caracteres",
        "Un salto de línea"
      ],
      c: 1,
      e: "`f` decimal y `.2` dos decimales."
    },
    {
      sec: "ut2-estaticos",
      p: "¿Qué da `Math.round(x * 100) / 100` con `x = 2.567`?",
      o: ["`2.57`", "`2`", "`2.5`", "`3`"],
      c: 1,
      e: "Sin `.0` la división es entera: `257 / 100 = 2`.",
      nivel: "pro",
      salida: "2"
    },
    {
      sec: "ut2-estaticos",
      p: "¿Por qué conviene indicar el `Locale` al formatear dinero?",
      o: [
        "Porque el decimal es coma o punto según el país",
        "Porque `printf` falla sin él",
        "Porque lo exige el compilador",
        "Para que sea más rápido"
      ],
      c: 0,
      e: "El formato depende de la configuración regional.",
      nivel: "pro"
    },
    {
      sec: "ut2-constructores",
      p: "¿Qué hace `new Scanner(System.in)`?",
      o: ["Crea un lector del teclado", "Imprime un texto", "Lee un fichero", "Importa `Scanner`"],
      c: 0,
      e: "`System.in` es el teclado."
    },
    {
      sec: "ut2-constructores",
      p: "Tras `nextInt()`, ¿qué problema aparece al llamar a `nextLine()`?",
      o: [
        "Lee un texto vacío (el resto de la línea)",
        "Falla siempre",
        "Lee el siguiente número",
        "No hay ningún problema"
      ],
      c: 0,
      e: "El salto de línea queda sin consumir."
    },
    {
      sec: "ut2-constructores",
      p: "¿Qué rango de valores da `azar.nextInt(10)`?",
      o: ["1 a 10", "0 a 9", "0 a 10", "1 a 9"],
      c: 1,
      e: "`nextInt(n)` va de 0 a n−1."
    },
    {
      sec: "ut2-constructores",
      p: "¿Qué expresión da un entero entre 1 y 6?",
      o: ["`azar.nextInt(6)`", "`azar.nextInt(6) + 1`", "`azar.nextInt(7)`", "`azar.nextInt(5) + 1`"],
      c: 1,
      e: "`nextInt(6)` da 0-5; sumando 1 sale 1-6."
    },
    {
      sec: "ut2-constructores",
      p: "¿Para qué sirve la semilla de `new Random(42)`?",
      o: [
        "Para que la secuencia sea siempre la misma",
        "Para que sea más aleatorio",
        "Para limitar el rango",
        "Para cerrar el generador"
      ],
      c: 0,
      e: "Fija el estado inicial: útil en pruebas."
    },
    {
      sec: "ut2-constructores",
      p: "¿Cómo se crea el 24 de diciembre de 2026?",
      o: [
        "`new LocalDate(2026, 12, 24)`",
        "`LocalDate.of(2026, 12, 24)`",
        "`LocalDate(\"2026-12-24\")`",
        "`LocalDate.new(24, 12, 2026)`"
      ],
      c: 1,
      e: "Es un método de fábrica estático."
    },
    {
      sec: "ut2-constructores",
      p: "`LocalDate f = LocalDate.of(2026, 1, 31); f.plusDays(1);` ¿Qué vale `f`?",
      o: ["`2026-02-01`", "`2026-01-31`", "`2026-01-32`", "Error"],
      c: 1,
      e: "Los `LocalDate` son inmutables y no se guardó el resultado."
    },
    {
      sec: "ut2-constructores",
      p: "¿Qué muestra `System.out.println(LocalDate.of(2026, 3, 1).plusDays(30));`?",
      o: ["`2026-03-31`", "`2026-04-01`", "`2026-03-30`", "`2026-04-30`"],
      c: 1,
      e: "El 1 de marzo más 30 días es el 31 de marzo.",
      salida: "2026-03-31"
    },
    {
      sec: "ut2-memoria",
      p: "¿Cuándo puede el recolector de basura liberar un objeto?",
      o: [
        "Cuando termina `main`",
        "Cuando ninguna referencia apunta a él",
        "Cuando se llama a `delete`",
        "Nunca"
      ],
      c: 1,
      e: "Cuando el objeto es inaccesible."
    },
    {
      sec: "ut2-memoria",
      p: "¿Qué hace `System.gc()`?",
      o: [
        "Libera la memoria inmediatamente",
        "Sugiere a la JVM que ejecute el recolector (puede ignorarlo)",
        "Cierra el programa",
        "Borra todas las variables"
      ],
      c: 1,
      e: "Solo es una sugerencia."
    },
    {
      sec: "ut2-memoria",
      p: "¿Qué paquete se importa automáticamente?",
      o: ["`java.util`", "`java.lang`", "`java.time`", "`java.io`"],
      c: 1,
      e: "`String`, `Math`, `Integer` y `System` están en `java.lang`."
    },
    {
      sec: "ut2-memoria",
      p: "¿Qué error da el compilador al usar `Scanner` sin importarlo?",
      o: ["*cannot find symbol*", "*NullPointerException*", "*division by zero*", "Ninguno"],
      c: 0,
      e: "No sabe a qué clase te refieres."
    },
    {
      sec: "ut2-memoria",
      p: "¿Dónde se escriben las sentencias `import`?",
      o: [
        "Dentro de `main`",
        "Al principio del archivo, antes de la clase",
        "Al final del archivo",
        "En el `.class`"
      ],
      c: 1,
      e: "Antes de la declaración de la clase."
    },
    {
      sec: "ut2-memoria",
      p: "Puede haber fugas de memoria en Java si…",
      o: [
        "Nunca puede",
        "Se conservan referencias a objetos que ya no se necesitan",
        "Se usa `String`",
        "Se llama a `main` dos veces"
      ],
      c: 1,
      e: "El recolector libera lo inaccesible, no lo inútil.",
      nivel: "pro"
    }
  ]
});
