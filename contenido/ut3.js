/* UT3 · Utilización de estructuras de control — contenido editable (formato documentado en GUIA_PROFESOR.md). */

registrarUnidad({
  id: "ut3",
  titulo: "UT3. Utilización de estructuras de control",
  ra: "RA3. Escribe y depura código, analizando y utilizando las estructuras de control del lenguaje.",
  resumen: "Hasta ahora tus programas no decidían ni repetían. Aquí aprenderás a que el programa elija caminos, repita tareas, reaccione a los errores y se pruebe con método.",
  aprenderas: [
    "Elegir caminos con `if`, `else if` y `switch`",
    "Repetir tareas con `while`, `do-while` y `for`, reconociendo los patrones habituales",
    "Saltar con `break` y `continue` sin abusar",
    "Controlar excepciones con `try-catch-finally`, lanzar las tuyas y crear excepciones propias",
    "Usar aserciones para detectar tus propios errores",
    "Diseñar casos de prueba, depurar con método y documentar"
  ],
  testN: 20,

  /* ===================== APUNTES POR SECCIONES ===================== */
  secciones: [
    {
      id: "ut3-if",
      titulo: "Selección: if, else if e if anidados",
      resumen: "Hacer que el programa decida: condiciones, alternativas y errores típicos.",
      bloques: [
        {
          t: "texto",
          md: `Hasta ahora tus programas **no decidían**: se ejecutaban de arriba abajo, una instrucción tras otra (flujo **secuencial**). Pero un socio de Náutica Bahía tiene descuento y un no socio no; el programa necesita **elegir** qué hacer. Las **estructuras de control** modifican el orden de ejecución. Empezamos por las de **selección**.

### \`if\` y \`if-else\`
\`if (condición) { ... }\`: el bloque solo se ejecuta si la condición vale \`true\`. Con \`else\` indicas qué hacer en caso contrario. La condición es siempre un \`boolean\` (justo lo que aprendiste a construir con los operadores de la UT1) y va entre paréntesis.`
        },
        {
          t: "codigo",
          titulo: "EstadoStock.java",
          code: `public class EstadoStock {
    public static void main(String[] args) {
        int stock = 4;
        if (stock > 0) {
            System.out.println("Hay stock");
        } else {
            System.out.println("Agotado");
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "clave",
          md: `**Usa siempre llaves**, aunque el bloque tenga una sola instrucción. Sin ellas, al añadir una segunda línea *parece* que está dentro del \`if\`, pero Java solo considera una:
\`\`\`
if (stock == 0)
    System.out.println("Agotado");
    System.out.println("Avisar al proveedor"); // ¡se ejecuta SIEMPRE!
\`\`\``
        },
        {
          t: "predecir",
          p: "¿Qué muestra? (Mira la sangría... y las llaves.)",
          code: `int stock = 5;
if (stock == 0)
    System.out.println("Agotado");
    System.out.println("Avisar al proveedor");
System.out.println("Fin");`,
          salida: `Avisar al proveedor
Fin`,
          e: "Sin llaves, el `if` solo controla la primera instrucción. Las otras dos se ejecutan siempre. La sangría engaña a las personas, no a Java."
        },
        {
          t: "texto",
          md: `### Varias alternativas: \`else if\`
Con más de dos casos se encadenan condiciones. Java las evalúa **de arriba abajo** y ejecuta solo el bloque de la **primera** que sea cierta; el resto se ignora. El \`else\` final recoge todo lo demás. **El orden importa**: si pones primero \`stock <= 3\`, el caso \`stock == 0\` quedaría tapado.`
        },
        {
          t: "codigo",
          titulo: "EstadoStock2.java",
          code: `public class EstadoStock2 {
    public static void main(String[] args) {
        int stock = 2;
        if (stock == 0) {
            System.out.println("Agotado");
        } else if (stock <= 3) {
            System.out.println("Últimas unidades");
        } else {
            System.out.println("Disponible");
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: `**Errores típicos con \`if\`**
- \`if (stock = 0)\` en lugar de \`if (stock == 0)\`: error de compilación (asigna un entero, no hay \`boolean\`).
- Comparar textos con \`==\`: usa \`equals\` o \`equalsIgnoreCase\`.
- Un \`;\` justo después de la condición (\`if (stock > 0); { ... }\`): el \`if\` controla una instrucción vacía y el bloque se ejecuta **siempre**.
- Condiciones en mal orden en una cadena de \`else if\`.
- Comparar \`double\` con \`==\` (\`0.1 + 0.2 == 0.3\` es \`false\`).`
        },
        {
          t: "ejecuta",
          p: `**Encuentra el error.** Este programa debería mostrar «Agotado» cuando \`stock\` vale 0, pero muestra «Últimas unidades». Corrígelo cambiando **solo el orden** de las condiciones:
\`\`\`
Agotado
\`\`\``,
          inicial: `public class Orden {
    public static void main(String[] args) {
        int stock = 0;
        if (stock <= 3) {
            System.out.println("Últimas unidades");
        } else if (stock == 0) {
            System.out.println("Agotado");
        } else {
            System.out.println("Disponible");
        }
    }
}`,
          tests: [
            { out: "Agotado" }
          ],
          pistas: [
            "Java se queda con la **primera** condición cierta. ¿Cuál es cierta cuando `stock` vale 0?",
            "Pon primero el caso más concreto (`stock == 0`)."
          ],
          solucion: `public class Orden {
    public static void main(String[] args) {
        int stock = 0;
        if (stock == 0) {
            System.out.println("Agotado");
        } else if (stock <= 3) {
            System.out.println("Últimas unidades");
        } else {
            System.out.println("Disponible");
        }
    }
}`
        },
        {
          t: "texto",
          md: `### \`if\` anidados
Dentro de un bloque puede haber otro \`if\`: se llama **anidar** y sirve cuando una decisión solo tiene sentido tras otra. Si ves tres o cuatro niveles de sangría, replantéatelo: a menudo se puede **aplanar** con \`&&\`, \`||\` o \`else if\`.`
        },
        {
          t: "codigo",
          titulo: "Fianza.java",
          code: `public class Fianza {
    public static void main(String[] args) {
        int stock = 3;
        boolean esSocio = false;
        if (stock > 0) {
            if (esSocio) {
                System.out.println("Alquiler sin fianza");
            } else {
                System.out.println("Alquiler con fianza de 50 euros");
            }
        } else {
            System.out.println("Producto agotado");
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "test",
          p: "Tarifa: 7+ días 15 %, 3-6 días 5 %, y los socios tienen un 5 % **extra** que se suma. ¿Cómo programas el descuento de días y el de socio?",
          o: [
            "Con una sola cadena `else if` para todo",
            "Con dos `if` independientes, porque los descuentos se suman",
            "Con un `switch`",
            "Con un `if` anidado dentro del `else`"
          ],
          c: 1,
          e: "Los descuentos son **independientes** (se suman), no excluyentes: dos `if` separados. Con `else if`, un socio nunca recibiría ambos."
        },
        {
          t: "profundizar",
          titulo: "¿Cuál es la diferencia entre varios `if` sueltos y un `else if`?",
          bloques: [
            {
              t: "texto",
              md: "En una cadena `if / else if / else` **solo se ejecuta una rama** (las alternativas son **excluyentes**). Con varios `if` sueltos se evalúa **cada** condición por separado y pueden ejecutarse varias (son **independientes**)."
            },
            {
              t: "codigo",
              code: `int x = 10;
if (x > 5) { System.out.println("mayor que 5"); }
if (x > 8) { System.out.println("mayor que 8"); }
System.out.println("---");
if (x > 5) { System.out.println("mayor que 5"); }
else if (x > 8) { System.out.println("mayor que 8"); }`,
              ejecutable: true
            },
            {
              t: "texto",
              md: "Pregúntate siempre: ¿estos casos se excluyen entre sí (`else if`) o se acumulan (`if` separados)?"
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Cómo se comparan `double` en un `if`?",
          bloques: [
            {
              t: "texto",
              md: "No con `==`: `0.1 + 0.2 == 0.3` es `false` por la representación binaria. Se compara con una **tolerancia**: `Math.abs(a - b) < 1e-9`. Es el ε de las matemáticas. Para dinero, mejor trabajar en céntimos con enteros (lo viste en la UT1)."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Qué pasa con las condiciones complejas? (De Morgan)",
          bloques: [
            {
              t: "texto",
              md: "Las leyes de De Morgan sirven para **simplificar negaciones**: `!(stock > 0 && esSocio)` equivale a `stock <= 0 || !esSocio`. Y el cortocircuito evita errores: `d != 0 && n / d > 2` nunca divide entre cero porque, si `d` es 0, el segundo operando no se evalúa."
            }
          ]
        },
        {
          t: "ejecuta",
          p: `**Descuento del alquiler.** Lee por teclado los **días** de alquiler (entero) y si el cliente es socio (\`s\`/\`n\`). Tarifa: 25 euros/día. 7 o más días: 15 % de descuento; de 3 a 6: 5 %; menos de 3: ninguno. Los socios tienen **un 5 % adicional**. Muestra el descuento (como \`Descuento: 20%\`) y el total con dos decimales (\`Total: 100,00 euros\`).
*Cuidado con la trampa de \`Scanner\` (\`nextInt\` + \`nextLine\`).*`,
          inicial: `import java.util.Scanner;

public class DescuentoAlquiler {
    public static void main(String[] args) {
        final double TARIFA_DIA = 25.0;
        Scanner teclado = new Scanner(System.in);
        int dias = teclado.nextInt();
        // sigue tú
    }
}`,
          tests: [
            {
              in: `8
s
`,
              out: `Descuento: 20%
Total: 160,00 euros`
            },
            {
              in: `4
n
`,
              out: `Descuento: 5%
Total: 95,00 euros`
            },
            {
              in: `1
S
`,
              out: `Descuento: 5%
Total: 23,75 euros`
            },
            {
              in: `3
n
`,
              out: `Descuento: 5%
Total: 71,25 euros`
            },
            {
              in: `7
n
`,
              out: `Descuento: 15%
Total: 148,75 euros`
            }
          ],
          pistas: [
            "Dos `if` **independientes**: uno por días (con `else if`, excluyentes) y otro por socio (se suma).",
            "Trabaja el descuento como entero (`15`, `5`) para evitar errores de decimales."
          ],
          solucion: `import java.util.Scanner;

public class DescuentoAlquiler {
    public static void main(String[] args) {
        final double TARIFA_DIA = 25.0;
        Scanner teclado = new Scanner(System.in);
        int dias = teclado.nextInt();
        teclado.nextLine();
        boolean esSocio = teclado.nextLine().strip().equalsIgnoreCase("s");
        int descuento = 0;
        if (dias >= 7) {
            descuento = 15;
        } else if (dias >= 3) {
            descuento = 5;
        }
        if (esSocio) {
            descuento += 5;
        }
        double total = TARIFA_DIA * dias * (100 - descuento) / 100;
        System.out.println("Descuento: " + descuento + "%");
        System.out.printf("Total: %.2f euros%n", total);
    }
}`,
          rubrica: [
            "Usas `else if` donde los casos son excluyentes y un `if` separado donde son independientes",
            "Probaste los valores límite 2, 3, 6 y 7 días"
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Esta práctica es una **regla de negocio** de verdad. En el trabajo, las reglas cambian (¿y si el descuento de socio pasa al 8 %?). Por eso los valores van en **constantes con nombre** y la lógica, en pocas líneas. Y por eso importan los **casos límite**: la mayoría de los fallos en producción están justo en `<` frente a `<=`.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Calendario de tarifas: temporada y fin de semana",
          p: `La tienda cobra el kayak según mes y día de la semana. Lee un entero \`mes\` (1-12) y un entero \`dia\` (1 = lunes ... 7 = domingo). Tarifa base: 12 €/hora. **Temporada alta** (junio a septiembre): +50 %. **Fin de semana** (sábado o domingo): +20 % **sobre el precio ya con temporada**. Muestra el precio por hora con dos decimales. Si el mes o el día no son válidos, muestra \`Datos no validos\`.
Ejemplo: mes 7, dia 6 → 12 × 1,5 × 1,2 = \`21,60 euros/hora\`.`,
          requisitos: [
            "Validas primero los datos y solo calculas si son válidos",
            "Los recargos son independientes y se aplican en cascada",
            "Sin números mágicos sueltos: constantes para 12, 1,5 y 1,2 si quieres puntuar a lo profesional"
          ],
          inicial: `import java.util.Scanner;

public class TarifaCalendario {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int mes = teclado.nextInt();
        int dia = teclado.nextInt();
    }
}`,
          tests: [
            {
              in: `7 6
`,
              out: "21,60 euros/hora"
            },
            {
              in: `2 3
`,
              out: "12,00 euros/hora"
            },
            {
              in: `12 7
`,
              out: "14,40 euros/hora"
            },
            {
              in: `8 2
`,
              out: "18,00 euros/hora"
            },
            {
              in: `13 1
`,
              out: "Datos no validos"
            },
            {
              in: `5 0
`,
              out: "Datos no validos"
            }
          ],
          pistas: ["Valida primero; después calcula en un `else`.", "`precio *= 1.5;` multiplica y guarda."],
          solucion: `import java.util.Scanner;

public class TarifaCalendario {
    public static void main(String[] args) {
        final double BASE = 12.0;
        Scanner teclado = new Scanner(System.in);
        int mes = teclado.nextInt();
        int dia = teclado.nextInt();
        if (mes < 1 || mes > 12 || dia < 1 || dia > 7) {
            System.out.println("Datos no validos");
        } else {
            double precio = BASE;
            if (mes >= 6 && mes <= 9) {
                precio *= 1.5;
            }
            if (dia >= 6) {
                precio *= 1.2;
            }
            System.out.printf("%.2f euros/hora%n", precio);
        }
    }
}`,
          rubrica: [
            "Probaste todos los límites: mes 5, 6, 9, 10; día 5, 6, 7",
            "Tu condición de temporada no tiene errores de uno (`>=` frente a `>`)"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Vamos con la **selección: if, else if e if anidados**.",
        inicial: [
          {
            p: "Con `int n = 5;` ¿qué muestra `if (n > 3) { A } else if (n > 1) { B } else { C }` (A, B y C son mensajes)?",
            o: ["Solo A", "A y B", "Solo B", "A, B y C"],
            c: 0,
            e: "Se ejecuta solo la primera rama cuya condición es cierta."
          },
          {
            p: "¿Qué pasa con `if (x = 0) { ... }`?",
            o: ["Compara x con 0", "Error de compilación", "Asigna 0 y entra en el if", "Nada"],
            c: 1,
            e: "`=` asigna; el `if` necesita un `boolean`."
          },
          {
            p: "¿Qué hace un `;` justo tras `if (cond)`?",
            o: [
              "Nada",
              "El if controla una instrucción vacía y el bloque siguiente se ejecuta siempre",
              "Error de compilación",
              "Hace el if más rápido"
            ],
            c: 1,
            e: "Es un error lógico muy traicionero."
          }
        ],
        pasos: [
          {
            titulo: "if, else if, else",
            cubre: [0, 2],
            explica: "Java evalúa las condiciones de arriba abajo y ejecuta **solo la primera cierta**. El `else` recoge el resto. Por eso el **orden** importa: pon el caso más concreto primero.",
            ejemplo: {
              code: `int n = 5;
if (n > 3) {
    System.out.println("A");
} else if (n > 1) {
    System.out.println("B");
} else {
    System.out.println("C");
}`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "Con `n = 0`, ¿qué se muestra en el mismo código?",
              o: ["A", "B", "C", "Nada"],
              c: 2,
              e: "`0 > 3` es falso, `0 > 1` es falso: entra el `else`."
            }
          },
          {
            titulo: "= frente a ==",
            cubre: [1],
            explica: "`=` asigna; `==` compara. En un `if`, `x = 0` no es un `boolean` y el compilador lo rechaza. Con textos, ni siquiera `==`: `equals`.",
            pregunta: {
              p: "¿Cuál es la forma correcta de comprobar si `respuesta` vale «s» ignorando mayúsculas?",
              o: [
                "`respuesta == \"s\"`",
                "`respuesta.equalsIgnoreCase(\"s\")`",
                "`respuesta = \"s\"`",
                "`respuesta.equals`"
              ],
              c: 1,
              e: "`equalsIgnoreCase` compara contenido ignorando mayúsculas."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Lee un entero \`edad\` y muestra \`Menor\`, \`Adulto\` o \`Jubilado\` (menos de 18, de 18 a 66 y 67 o más).
 `,
          inicial: `
 import java.util.Scanner;

 public class Edad {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int edad = teclado.nextInt();
     }
 }
 `,
          tests: [
            {
              in: `10
`,
              out: "Menor"
            },
            {
              in: `18
`,
              out: "Adulto"
            },
            {
              in: `66
`,
              out: "Adulto"
            },
            {
              in: `67
`,
              out: "Jubilado"
            }
          ],
          solucion: `
 import java.util.Scanner;

 public class Edad {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int edad = teclado.nextInt();
         if (edad < 18) {
             System.out.println("Menor");
         } else if (edad < 67) {
             System.out.println("Adulto");
         } else {
             System.out.println("Jubilado");
         }
     }
 }
 `,
          pistas: ["Cadena `if / else if / else`: en el segundo caso ya sabes que `edad >= 18`."]
        }
      }
    },

    {
      id: "ut3-switch",
      titulo: "El switch",
      resumen: "Elegir entre valores concretos con la forma moderna (flechas) y el clásico con break.",
      bloques: [
        {
          t: "texto",
          md: `Cuando hay que elegir entre muchos valores **concretos** de una misma variable, una cadena larga de \`else if\` pesa. Para eso está \`switch\`. Funciona con \`byte\`, \`short\`, \`char\`, \`int\`, \`String\` y enumerados; **no** con \`double\` ni \`boolean\`, y tampoco admite **rangos**.

La forma moderna (Java 14+) usa **flechas** y es la que debes usar:`
        },
        {
          t: "codigo",
          titulo: "Tallas.java",
          code: `public class Tallas {
    public static void main(String[] args) {
        char talla = 'M';
        switch (talla) {
            case 'S' -> System.out.println("Hasta 1,65 m");
            case 'M' -> System.out.println("De 1,65 m a 1,78 m");
            case 'L', 'X' -> System.out.println("Más de 1,78 m");
            default -> System.out.println("Talla desconocida");
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: "Tres detalles: cada `case` puede agrupar valores con comas, solo se ejecuta el caso que coincide, y `default` recoge todos los demás. Además `switch` puede **devolver un valor** (y se usa `yield` si un caso necesita varias instrucciones):"
        },
        {
          t: "codigo",
          titulo: "Rango.java",
          code: `public class Rango {
    public static void main(String[] args) {
        char talla = 'L';
        String rango = switch (talla) {
            case 'S' -> "Hasta 1,65 m";
            case 'M' -> "De 1,65 m a 1,78 m";
            case 'L', 'X' -> "Más de 1,78 m";
            default -> "Talla desconocida";
        };
        int diasFianza = switch (talla) {
            case 'S', 'M' -> 2;
            case 'L' -> {
                System.out.println("Talla grande: se revisa el stock");
                yield 3;
            }
            default -> 0;
        };
        System.out.println(rango + " / fianza " + diasFianza + " días");
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "**El `switch` clásico y el `break`.** Encontrarás mucho código con la forma antigua (`case 'S':` con dos puntos). Ahí, si olvidas el `break`, la ejecución **continúa** con el caso siguiente aunque no coincida (*fall-through*). Es una fuente clásica de errores y la razón por la que la forma con flecha es preferible: no lo tiene."
        },
        {
          t: "predecir",
          p: "Este `switch` es de la forma clásica y le faltan los `break`. ¿Qué muestra?",
          code: `int opcion = 2;
switch (opcion) {
    case 1:
        System.out.println("Alquilar");
    case 2:
        System.out.println("Devolver");
    case 3:
        System.out.println("Consultar");
        break;
    default:
        System.out.println("Opcion no valida");
}`,
          salida: `Devolver
Consultar`,
          e: "Entra en `case 2` y, sin `break`, **sigue cayendo** por `case 3` hasta que encuentra el `break`."
        },
        {
          t: "tabla",
          titulo: "¿if o switch?",
          cab: ["Situación", "Estructura"],
          filas: [
            ["Rangos o condiciones complejas (`stock <= 3`, `edad < 26 && esSocio`)", "`if`"],
            ["Una variable que se compara con valores concretos (talla, día, opción de menú)", "`switch`"],
            ["Elegir entre solo dos caminos", "`if-else`"]
          ]
        },
        {
          t: "test",
          p: "¿Con cuál de estas variables **no** puedes usar `switch`?",
          o: ["`int opcion`", "`String dia`", "`char letra`", "`double precio`"],
          c: 3,
          e: "El `switch` no admite `double`: sus valores no son exactos."
        },
        {
          t: "ejecuta",
          p: "**Menú de la tienda.** Lee un entero `opcion` y muestra con un `switch` (forma moderna): 1 → `Alquilar`, 2 → `Devolver`, 3 o 4 → `Consultar`, cualquier otro → `Opcion no valida`.",
          inicial: `import java.util.Scanner;

public class Menu {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int opcion = teclado.nextInt();
    }
}`,
          tests: [
            {
              in: `1
`,
              out: "Alquilar"
            },
            {
              in: `2
`,
              out: "Devolver"
            },
            {
              in: `3
`,
              out: "Consultar"
            },
            {
              in: `4
`,
              out: "Consultar"
            },
            {
              in: `9
`,
              out: "Opcion no valida"
            }
          ],
          pistas: ["`case 3, 4 ->` agrupa dos valores.", "No hace falta `break` con flechas."],
          solucion: `import java.util.Scanner;

public class Menu {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int opcion = teclado.nextInt();
        switch (opcion) {
            case 1 -> System.out.println("Alquilar");
            case 2 -> System.out.println("Devolver");
            case 3, 4 -> System.out.println("Consultar");
            default -> System.out.println("Opcion no valida");
        }
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Qué es el *fall-through* y tiene alguna utilidad?",
          bloques: [
            {
              t: "texto",
              md: "Es la caída al caso siguiente en el `switch` clásico cuando falta `break`. A veces se usaba a propósito para **agrupar casos** (`case 1: case 2: ...`), pero con la forma moderna eso se escribe `case 1, 2 ->` sin riesgo. Hoy se considera casi siempre un **error**; muchos analizadores de código lo marcan como aviso."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Puede un `switch` trabajar con `String`?",
          bloques: [
            {
              t: "texto",
              md: "Sí. Compara con `equals` internamente (distingue mayúsculas): `switch (dia) { case \"lunes\" -> ...; case \"sabado\", \"domingo\" -> ...; }`. Si el usuario escribe «Lunes» con mayúscula, no coincide: normaliza antes con `toLowerCase()`. Con `null` lanza `NullPointerException`."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "En Java 21 el `switch` ha evolucionado a *pattern matching* (decidir según el **tipo** o la forma del dato). No lo necesitas ahora, pero es una razón más para dominar la forma moderna con flechas: es la base de todo lo nuevo.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Calculadora de comandos",
          p: `Lee un texto \`comando\` (\`suma\`, \`resta\`, \`producto\` o \`cociente\`, sin importar mayúsculas) y dos enteros \`a\` y \`b\`. Usa un \`switch\` **con valor devuelto** para calcularlo. Si el comando no existe, muestra \`Comando desconocido\`. Si es \`cociente\` y \`b\` vale 0, muestra \`No se puede dividir entre 0\`. Si todo va bien, muestra \`Resultado: <n>\`.
*Entrada*: en la primera línea el comando y en la segunda \`a b\`.`,
          requisitos: [
            "`switch` con valor devuelto",
            "Normalizas el comando con `strip()` y `toLowerCase()`",
            "Gestionas el comando desconocido y la división entre cero **antes** de calcular"
          ],
          inicial: `import java.util.Scanner;

public class Calculadora {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        String comando = teclado.nextLine().strip().toLowerCase();
        int a = teclado.nextInt();
        int b = teclado.nextInt();
    }
}`,
          tests: [
            {
              in: `SUMA
7 5
`,
              out: "Resultado: 12"
            },
            {
              in: `resta
7 5
`,
              out: "Resultado: 2"
            },
            {
              in: `Producto
7 5
`,
              out: "Resultado: 35"
            },
            {
              in: `cociente
7 2
`,
              out: "Resultado: 3"
            },
            {
              in: `cociente
7 0
`,
              out: "No se puede dividir entre 0"
            },
            {
              in: `potencia
2 3
`,
              out: "Comando desconocido"
            }
          ],
          pistas: [
            "Normaliza el texto antes del `switch`.",
            "Primero decide si el comando es válido; después calcula."
          ],
          solucion: `import java.util.Scanner;

public class Calculadora {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        String comando = teclado.nextLine().strip().toLowerCase();
        int a = teclado.nextInt();
        int b = teclado.nextInt();
        boolean conocido = switch (comando) {
            case "suma", "resta", "producto", "cociente" -> true;
            default -> false;
        };
        if (!conocido) {
            System.out.println("Comando desconocido");
        } else if (comando.equals("cociente") && b == 0) {
            System.out.println("No se puede dividir entre 0");
        } else {
            int resultado = switch (comando) {
                case "suma" -> a + b;
                case "resta" -> a - b;
                case "producto" -> a * b;
                default -> a / b;
            };
            System.out.println("Resultado: " + resultado);
        }
    }
}`,
          rubrica: [
            "Sabrías explicar por qué se comprueba la división entre cero antes de calcular",
            "Has probado con mayúsculas y con espacios de más"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos el **switch**.",
        inicial: [
          {
            p: "¿Qué hace `case 3, 4 ->`?",
            o: [
              "Error de sintaxis",
              "Agrupa los valores 3 y 4 en el mismo caso",
              "Compara con 34",
              "Suma 3 y 4"
            ],
            c: 1,
            e: "Las comas agrupan valores."
          },
          {
            p: "¿Qué pasa en un `switch` clásico si falta `break`?",
            o: [
              "Nada",
              "La ejecución sigue al siguiente caso (fall-through)",
              "Error de compilación",
              "Se repite el caso"
            ],
            c: 1,
            e: "Es el fall-through."
          },
          {
            p: "¿Con qué tipo **no** funciona `switch`?",
            o: ["`int`", "`String`", "`double`", "`char`"],
            c: 2,
            e: "No admite `double` ni `boolean`."
          }
        ],
        pasos: [
          {
            titulo: "La forma moderna",
            cubre: [0, 2],
            explica: "`case valor -> instrucción;` y `default ->` para el resto. Sin `break`. Varios valores: `case 1, 2 ->`. Si devuelve valor: `x = switch (...) { case ... -> valor; ... };`",
            pregunta: {
              p: "Con `int d = 3;` y `case 1 -> A; case 2, 3 -> B; default -> C;`, ¿qué se ejecuta?",
              o: ["A", "B", "C", "B y C"],
              c: 1,
              e: "3 está en el segundo `case`."
            }
          },
          {
            titulo: "El switch clásico y su trampa",
            cubre: [1],
            explica: "Con `case X:` (dos puntos) hay que poner `break` al final de cada caso. Si no, sigue ejecutando los siguientes casos.",
            pregunta: {
              p: "Con el clásico y `opcion = 1`, un caso 1 sin `break` seguido de un caso 2 con `break`, ¿qué se ejecuta?",
              o: ["Solo el caso 1", "El caso 1 y el caso 2", "Solo el caso 2", "Ninguno"],
              c: 1,
              e: "Cae del 1 al 2 hasta encontrar el `break`."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Lee un entero de 1 a 7 y muestra el día de la semana con \`switch\` (1 \`Lunes\` ... 7 \`Domingo\`), o \`Dia no valido\`.
 `,
          inicial: `
 import java.util.Scanner;

 public class Dia {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int dia = teclado.nextInt();
     }
 }
 `,
          tests: [
            {
              in: `1
`,
              out: "Lunes"
            },
            {
              in: `7
`,
              out: "Domingo"
            },
            {
              in: `0
`,
              out: "Dia no valido"
            }
          ],
          solucion: `
 import java.util.Scanner;

 public class Dia {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int dia = teclado.nextInt();
         String nombre = switch (dia) {
             case 1 -> "Lunes";
             case 2 -> "Martes";
             case 3 -> "Miercoles";
             case 4 -> "Jueves";
             case 5 -> "Viernes";
             case 6 -> "Sabado";
             case 7 -> "Domingo";
             default -> "Dia no valido";
         };
         System.out.println(nombre);
     }
 }
 `,
          pistas: ["`String nombre = switch (dia) { ... };`"]
        }
      }
    },

    {
      id: "ut3-bucles",
      titulo: "Repetición: while, do-while y for",
      resumen: "Repetir tareas: la condición, la actualización, la tabla de seguimiento y los errores típicos.",
      bloques: [
        {
          t: "texto",
          md: `Para mostrar el precio de alquilar un kayak durante 1, 2, 3 y 4 horas podríamos escribir cuatro \`println\` casi iguales; con 100 horas sería interminable. Una estructura de **repetición** (**bucle**) ejecuta un bloque **mientras** se cumpla una condición. Cada ejecución del bloque es una **iteración**.

### \`while\``
        },
        {
          t: "codigo",
          titulo: "TarifaHoras.java",
          code: `public class TarifaHoras {
    public static void main(String[] args) {
        final double PRECIO_HORA = 12.0;
        int hora = 1;
        while (hora <= 4) {
            System.out.println("Hora " + hora + ": " + hora * PRECIO_HORA + " euros");
            hora++;
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: "Se evalúa la condición; si es cierta, se ejecuta el bloque y se vuelve a evaluar; si es falsa, se sale. Dos consecuencias: si la condición es falsa desde el principio, el bloque **no se ejecuta ni una vez**; y algo dentro del bloque tiene que **acabar haciendo falsa la condición** (aquí `hora++`) o tendrás un **bucle infinito**."
        },
        {
          t: "traza",
          p: "**Tabla de seguimiento.** Completa el valor de `suma` e `i` al terminar cada vuelta de este bucle.",
          code: `int suma = 0;
int i = 1;
while (i <= 4) {
    suma += i * 2;
    i++;
}`,
          cols: ["Vuelta", "suma", "i"],
          filas: [
            [
              { dado: "inicio" },
              { dado: "0" },
              { dado: "1" }
            ],
            [
              { dado: "1" },
              "2",
              "2"
            ],
            [
              { dado: "2" },
              "6",
              "3"
            ],
            [
              { dado: "3" },
              "12",
              "4"
            ],
            [
              { dado: "4" },
              "20",
              "5"
            ]
          ],
          e: "Al acabar, `i` vale 5 y la condición `i <= 4` es falsa. `suma` valdrá 20 al salir."
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "**La tabla de seguimiento** (anotar el valor de las variables en cada vuelta) es la mejor forma de entender un bucle y de depurar **sin ordenador**. Te hará falta en las pruebas escritas."
        },
        {
          t: "texto",
          md: `### \`do-while\`
Igual que \`while\`, pero **evalúa la condición al final**: el bloque se ejecuta **al menos una vez**. Es la estructura natural para pedir un dato y repetir si no es válido. La variable se declara **fuera** del bucle (si no, la condición no la vería: ámbito de la UT1). Y lleva \`;\` tras el \`while\`.`
        },
        {
          t: "codigo",
          titulo: "EdadValida.java",
          code: `import java.util.Scanner;

public class EdadValida {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int edad;
        do {
            System.out.print("Edad del cliente (14-99): ");
            edad = teclado.nextInt();
        } while (edad < 14 || edad > 99);
        System.out.println("Edad registrada: " + edad);
    }
}`,
          ejecutable: true,
          stdin: `5
120
30
`
        },
        {
          t: "texto",
          md: `### \`for\`
Cuando sabes de antemano cuántas veces repetir, \`for\` reúne en una línea la **inicialización**, la **condición** y la **actualización**. La variable declarada en el \`for\` solo existe dentro del bucle. Se puede contar hacia atrás o de tres en tres:`
        },
        {
          t: "codigo",
          titulo: "Contar.java",
          code: `public class Contar {
    public static void main(String[] args) {
        for (int hora = 1; hora <= 4; hora++) {
            System.out.println("Hora " + hora);
        }
        for (int dias = 10; dias > 0; dias -= 3) {
            System.out.println("Quedan " + dias);
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "tabla",
          titulo: "¿Qué bucle elijo?",
          cab: ["Situación", "Bucle"],
          filas: [
            ["Sé cuántas veces voy a repetir (10 tallas, 7 días, `n` productos)", "`for`"],
            ["Repito mientras pase algo, y puede que no se ejecute ninguna vez", "`while`"],
            ["Debo ejecutar el bloque al menos una vez (validar un dato, mostrar un menú)", "`do-while`"]
          ]
        },
        {
          t: "predecir",
          p: "¿Cuántas líneas muestra y cuáles? Haz la tabla de seguimiento.",
          code: `for (int i = 0; i < 5; i += 2) {
    System.out.println("i=" + i);
}
System.out.println("fin");`,
          salida: `i=0
i=2
i=4
fin`,
          e: "Vueltas con i = 0, 2, 4; con 6 la condición falla. Tres vueltas, no cinco."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: `**Errores típicos con bucles**
- **Bucle infinito**: olvidar la actualización o escribirla al revés (\`hora--\` en un bucle que cuenta hacia arriba).
- **Error de uno** (*off-by-one*): \`i < 5\` da 5 vueltas (0 a 4) y \`i <= 5\`, 6. Ante la duda, tabla de seguimiento.
- **\`;\` tras el \`for\` o el \`while\`**: \`for (...);\` repite una instrucción vacía y el bloque se ejecuta una vez, después.
- **Contar con \`double\`**: \`for (double x = 0; x != 1; x += 0.1)\` no termina nunca. Cuenta con \`int\`.
- **Inicializar el acumulador dentro del bucle**: se reinicia en cada vuelta.`
        },
        {
          t: "ejecuta",
          p: `**Encuentra el error de uno.** Este programa debería mostrar los números del 1 al 5 y muestra del 0 al 4. Corrígelo **cambiando solo la cabecera del \`for\`**:
\`\`\`
1
2
3
4
5
\`\`\``,
          inicial: `public class UnoACinco {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
        }
    }
}`,
          tests: [
            {
              out: `1
2
3
4
5`
            }
          ],
          pistas: ["La inicialización y la condición tienen que cambiar.", "Empieza en 1 y usa `<=`."],
          solucion: `public class UnoACinco {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}`
        },
        {
          t: "ejecuta",
          p: "**Tabla de tarifas.** Con un `for`, muestra el precio de alquilar un kayak de 1 a 8 horas a 12 €/hora, **con un máximo de 50 € al día**, con el formato `3 h -> 36,00 euros`. Después, con un `while`, calcula cuántas horas completas se pueden alquilar con 100 euros y muestra `Con 100 euros: 8 horas`.",
          inicial: `public class TablaTarifas {
    public static void main(String[] args) {
        final double PRECIO_HORA = 12.0;
        final double PRECIO_MAXIMO_DIA = 50.0;
    }
}`,
          tests: [
            {
              out: `1 h -> 12,00 euros
2 h -> 24,00 euros
3 h -> 36,00 euros
4 h -> 48,00 euros
5 h -> 50,00 euros
6 h -> 50,00 euros
7 h -> 50,00 euros
8 h -> 50,00 euros
Con 100 euros: 8 horas`
            }
          ],
          pistas: [
            "Dentro del `for`, calcula el precio y limítalo con un `if`.",
            "El `while` resta `PRECIO_HORA` al presupuesto mientras llegue para una hora más."
          ],
          solucion: `public class TablaTarifas {
    public static void main(String[] args) {
        final double PRECIO_HORA = 12.0;
        final double PRECIO_MAXIMO_DIA = 50.0;
        for (int horas = 1; horas <= 8; horas++) {
            double precio = horas * PRECIO_HORA;
            if (precio > PRECIO_MAXIMO_DIA) {
                precio = PRECIO_MAXIMO_DIA;
            }
            System.out.printf("%d h -> %.2f euros%n", horas, precio);
        }
        double presupuesto = 100;
        int horasPosibles = 0;
        while (presupuesto >= PRECIO_HORA) {
            presupuesto -= PRECIO_HORA;
            horasPosibles++;
        }
        System.out.println("Con 100 euros: " + horasPosibles + " horas");
    }
}`,
          rubrica: [
            "Usas `for` donde sabes cuántas vueltas y `while` donde depende de una condición",
            "Sabrías resolver la segunda parte sin bucle (con `/`): ¿cuál sería la fórmula?"
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Se puede convertir cualquier bucle en otro?",
          bloques: [
            {
              t: "texto",
              md: "Sí: los tres bucles son **intercambiables**; cambia la **claridad**. Un `for (int i = 0; i < n; i++)` es un `while` con la inicialización antes y la actualización al final del bloque. Y muchos bucles se pueden sustituir por una **fórmula** (sumar del 1 al n es `n*(n+1)/2`): cuando es posible, la fórmula es mejor, porque no depende de `n`."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Qué es un bucle `for-each`?",
          bloques: [
            {
              t: "texto",
              md: "Existe una versión para recorrer colecciones (`for (String s : lista)`) que verás cuando trabajes con arrays y listas. No se usa con contadores numéricos. Por ahora, domina el `for` clásico: es la base."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Un bucle mal escrito puede **colgar un servidor entero**. Los profesionales piensan en el **peor caso**: ¿cuántas vueltas dará si la entrada es enorme? Un bucle dentro de otro con 100 000 elementos son **10 000 millones** de vueltas. A esto se le llama *complejidad* y lo verás en profundidad en otros módulos.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Caja registradora con menú",
          p: `Programa una **caja registradora de consola**. Repite hasta que se elija salir. Lee una opción entera cada vez:
\`1\` Añadir venta · \`2\` Ver total · \`3\` Salir
- Opción 1: lee un importe (decimal con coma). Si es positivo, lo suma al total; si no, muestra \`Importe no valido\`.
- Opción 2: muestra \`Total: <n> euros\` con dos decimales.
- Opción 3: muestra \`Hasta luego\` y termina.
- Otra opción: muestra \`Opcion no valida\`.
No muestres el texto del menú: solo reacciona a las opciones (la entrada llega por teclado).`,
          requisitos: [
            "`do-while` para repetir hasta la opción 3",
            "`switch` moderno para despachar las opciones",
            "Acumulador inicializado fuera del bucle"
          ],
          inicial: `import java.util.Scanner;

public class Caja {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        double total = 0;
        int opcion;
    }
}`,
          tests: [
            {
              in: `1
10,5
1
4,25
2
3
`,
              out: `Total: 14,75 euros
Hasta luego`
            },
            {
              in: `1
-3
2
7
3
`,
              out: `Importe no valido
Total: 0,00 euros
Opcion no valida
Hasta luego`
            },
            {
              in: `3
`,
              out: "Hasta luego"
            }
          ],
          pistas: [
            "El menú se ejecuta al menos una vez: `do-while`.",
            "Declara `opcion` fuera del bucle para que la condición la vea."
          ],
          solucion: `import java.util.Scanner;

public class Caja {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        double total = 0;
        int opcion;
        do {
            opcion = teclado.nextInt();
            switch (opcion) {
                case 1 -> {
                    double importe = teclado.nextDouble();
                    if (importe > 0) {
                        total += importe;
                    } else {
                        System.out.println("Importe no valido");
                    }
                }
                case 2 -> System.out.printf("Total: %.2f euros%n", total);
                case 3 -> System.out.println("Hasta luego");
                default -> System.out.println("Opcion no valida");
            }
        } while (opcion != 3);
    }
}`,
          rubrica: [
            "Sabrías explicar por qué `total` y `opcion` se declaran fuera del bucle",
            "Probaste una entrada con importe negativo y una opción inexistente"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Hablemos de los **bucles**.",
        inicial: [
          {
            p: "¿Cuántas veces se ejecuta el cuerpo de `for (int i = 0; i < 5; i++)`?",
            o: ["4", "5", "6", "Infinitas"],
            c: 1,
            e: "i = 0, 1, 2, 3, 4."
          },
          {
            p: "¿Qué bucle ejecuta su bloque **al menos una vez**?",
            o: ["`for`", "`while`", "`do-while`", "Ninguno"],
            c: 2,
            e: "`do-while` evalúa la condición al final."
          },
          {
            p: "¿Qué hace `for (int i = 0; i < 3; i++);` (con `;` al final)?",
            o: [
              "Repite 3 veces la instrucción siguiente",
              "Repite una instrucción vacía; la siguiente se ejecuta una vez",
              "Error de compilación",
              "Bucle infinito"
            ],
            c: 1,
            e: "El `;` es el cuerpo del bucle (vacío)."
          }
        ],
        pasos: [
          {
            titulo: "Seguir un bucle a mano",
            cubre: [0],
            explica: "Anota las variables en cada vuelta: la **tabla de seguimiento**. Mira la condición **antes** de cada vuelta: el bloque solo se ejecuta si es cierta.",
            ejemplo: {
              code: `int s = 0;
for (int i = 1; i <= 3; i++) {
    s += i;
}
System.out.println(s);`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "En el ejemplo, ¿cuánto vale `s` al final?",
              o: ["3", "6", "10", "0"],
              c: 1,
              e: "1 + 2 + 3 = 6.",
              pista: "Haz la tabla: i = 1, 2, 3."
            }
          },
          {
            titulo: "Elegir bucle",
            cubre: [1],
            explica: "`for` si sabes cuántas veces. `while` si depende de una condición y puede no ejecutarse. `do-while` si necesitas ejecutar al menos una vez (validar datos).",
            pregunta: {
              p: "Quieres pedir una contraseña y repetir hasta que sea correcta. ¿Cuál es el más natural?",
              o: ["`for`", "`do-while`", "`switch`", "Ninguno"],
              c: 1,
              e: "Hay que pedirla al menos una vez."
            }
          },
          {
            titulo: "Errores de bucle",
            cubre: [2],
            explica: "El `;` tras el `for`/`while` y el error de uno (`<` frente a `<=`) son los fallos más frecuentes.",
            pregunta: {
              p: "¿Cuántas veces se ejecuta `for (int i = 1; i <= 5; i++)`?",
              o: ["4", "5", "6", "Ninguna"],
              c: 1,
              e: "i = 1..5: cinco vueltas."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Lee un entero \`n\` y muestra la suma de los números del 1 al \`n\` (con un \`for\`). Con \`n = 4\`, \`10\`.
 `,
          inicial: `
 import java.util.Scanner;

 public class Suma {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int n = teclado.nextInt();
     }
 }
 `,
          tests: [
            {
              in: `4
`,
              out: "10"
            },
            {
              in: `1
`,
              out: "1"
            },
            {
              in: `0
`,
              out: "0"
            },
            {
              in: `100
`,
              out: "5050"
            }
          ],
          solucion: `
 import java.util.Scanner;

 public class Suma {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int n = teclado.nextInt();
         int suma = 0;
         for (int i = 1; i <= n; i++) {
             suma += i;
         }
         System.out.println(suma);
     }
 }
 `,
          pistas: ["Un acumulador `suma` inicializado en 0 fuera del bucle."]
        }
      }
    },

    {
      id: "ut3-patrones",
      titulo: "Patrones de bucle y bucles anidados",
      resumen: "Contador, acumulador, centinela, bandera, máximo/mínimo; recorrer tablas con bucles anidados.",
      bloques: [
        {
          t: "texto",
          md: "Los problemas con bucles se repiten con las mismas ideas. Reconocerlas es la mitad del trabajo:"
        },
        {
          t: "tabla",
          cab: ["Patrón", "Idea"],
          filas: [
            ["**Contador**", "Una variable que *cuenta* cuántas veces ocurre algo: `ventas++;`"],
            [
              "**Acumulador**",
              "Una variable que *suma* (o multiplica) en cada vuelta: `total += importe;`. Se inicializa en 0 (o en 1 si multiplica)."
            ],
            [
              "**Centinela**",
              "Un valor especial que indica «se acabó»: el bucle se repite hasta que el usuario escribe, por ejemplo, 0."
            ],
            [
              "**Bandera**",
              "Una variable `boolean` que cambia cuando ocurre algo, para decidir luego: `boolean encontrado = false;`"
            ],
            ["**Máximo / mínimo**", "Una variable con el mayor (o menor) valor visto hasta el momento."]
          ]
        },
        {
          t: "relacionar",
          p: "Relaciona cada situación con el patrón que la resuelve.",
          pares: [
            ["Contar cuántos clientes han pedido más de 5 días", "contador"],
            ["Sumar el importe de todas las ventas del día", "acumulador"],
            ["Leer importes hasta que el usuario escriba 0", "centinela"],
            ["Saber si algún producto está agotado", "bandera"],
            ["Encontrar la venta más cara", "máximo"]
          ],
          e: "Son las cinco herramientas básicas con las que se escribe casi cualquier bucle de esta unidad."
        },
        {
          t: "texto",
          md: "El siguiente programa los combina todos. Lee los importes de las ventas del día hasta que se escribe 0 y muestra un resumen (el ejemplo ya trae entrada: `12,5`, `30`, `7,25` y `0`):"
        },
        {
          t: "codigo",
          titulo: "ResumenCaja.java",
          code: `import java.util.Scanner;

public class ResumenCaja {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int ventas = 0;       // contador
        double total = 0;     // acumulador
        double mayor = 0;
        double menor = 0;

        double importe = teclado.nextDouble();
        while (importe != 0) {              // 0 es el centinela
            ventas++;
            total += importe;
            if (ventas == 1 || importe > mayor) {
                mayor = importe;
            }
            if (ventas == 1 || importe < menor) {
                menor = importe;
            }
            importe = teclado.nextDouble();
        }

        if (ventas > 0) {
            System.out.println("Ventas: " + ventas);
            System.out.printf("Total: %.2f euros%n", total);
            System.out.printf("Media: %.2f euros%n", total / ventas);
            System.out.println("Mayor: " + mayor + " - Menor: " + menor);
        } else {
            System.out.println("Hoy no ha habido ventas.");
        }
    }
}`,
          ejecutable: true,
          stdin: `12,5
30
7,25
0
`
        },
        {
          t: "aviso",
          tipo: "clave",
          md: `Tres cosas que entender de este programa:
1. **La primera lectura se hace antes del bucle** y la siguiente al final de cada vuelta. Así la condición \`importe != 0\` siempre tiene un dato que comprobar.
2. **El máximo y el mínimo se inicializan con el primer valor**, no con 0: si todas las ventas fueran mayores que cero, empezar el mínimo en 0 daría un mínimo falso (de ahí \`ventas == 1 || ...\`).
3. **Hay que proteger la división**: sin ventas, \`total / ventas\` sería dividir entre cero (de ahí el \`if (ventas > 0)\` final).`
        },
        {
          t: "test",
          p: "En el programa anterior, ¿por qué el mínimo no se inicializa en 0?",
          o: [
            "Porque 0 no es un `double`",
            "Porque si todas las ventas son positivas, el mínimo nunca podría ser menor que 0 y quedaría un valor falso",
            "Porque no se puede inicializar",
            "Por estilo"
          ],
          c: 1,
          e: "Inicializa los extremos con el primer dato real."
        },
        {
          t: "texto",
          md: `### Bucles anidados
Un bucle puede contener otro. El **interior se ejecuta completo** en cada vuelta del exterior. Es la forma natural de recorrer tablas (filas y columnas):`
        },
        {
          t: "codigo",
          titulo: "TablaProductos.java",
          code: `public class TablaProductos {
    public static void main(String[] args) {
        for (int fila = 1; fila <= 3; fila++) {
            for (int columna = 1; columna <= 4; columna++) {
                System.out.print(fila * columna + "\\t");
            }
            System.out.println();   // salto de línea al terminar cada fila
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "predecir",
          p: "¿Qué dibuja? Fíjate en que el límite del bucle interior depende de la fila.",
          code: `for (int fila = 1; fila <= 4; fila++) {
    for (int col = 1; col <= fila; col++) {
        System.out.print("*");
    }
    System.out.println();
}`,
          salida: `*
**
***
****`,
          e: "La fila `n` tiene `n` asteriscos: el bucle interior depende del exterior. Es un triángulo."
        },
        {
          t: "test",
          p: "Si el bucle exterior da 5 vueltas y el interior 4, ¿cuántas veces se ejecuta el cuerpo del interior en total?",
          o: ["9", "20", "5", "4"],
          c: 1,
          e: "El interior se ejecuta completo (4) en cada una de las 5 vueltas exteriores: 5 × 4 = 20."
        },
        {
          t: "ejecuta",
          p: `**Triángulo de cajas.** Lee la altura \`n\` y dibuja un triángulo de altura \`n\` con asteriscos: la fila \`i\` tiene \`i\` asteriscos separados por un espacio. Con \`n = 3\`:
\`\`\`
*
* *
* * *
\`\`\`
(sin espacios al final de cada línea).`,
          inicial: `import java.util.Scanner;

public class Triangulo {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int n = teclado.nextInt();
    }
}`,
          tests: [
            {
              in: `3
`,
              out: `*
* *
* * *`
            },
            {
              in: `1
`,
              out: "*"
            },
            {
              in: `5
`,
              out: `*
* *
* * *
* * * *
* * * * *`
            }
          ],
          pistas: [
            "Dos bucles: el exterior para las filas y el interior para los asteriscos de esa fila.",
            "Para no dejar un espacio final, añade el espacio **antes** de cada asterisco salvo el primero."
          ],
          solucion: `import java.util.Scanner;

public class Triangulo {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int n = teclado.nextInt();
        for (int fila = 1; fila <= n; fila++) {
            String linea = "";
            for (int col = 1; col <= fila; col++) {
                linea += (col == 1 ? "" : " ") + "*";
            }
            System.out.println(linea);
        }
    }
}`
        },
        {
          t: "ejecuta",
          p: `**Estadísticas de notas.** Lee notas (enteros) hasta que se escriba \`-1\` (centinela, no cuenta como nota). Muestra el número de notas, la nota máxima, la mínima y cuántas han aprobado (≥ 5). Si no hay notas, muestra \`Sin notas\`. Formato:
\`\`\`
Notas: 4
Maxima: 9
Minima: 3
Aprobadas: 3
\`\`\``,
          inicial: `import java.util.Scanner;

public class Notas {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
    }
}`,
          tests: [
            {
              in: `7 3 9 5 -1
`,
              out: `Notas: 4
Maxima: 9
Minima: 3
Aprobadas: 3`
            },
            {
              in: `-1
`,
              out: "Sin notas"
            },
            {
              in: `10 -1
`,
              out: `Notas: 1
Maxima: 10
Minima: 10
Aprobadas: 1`
            },
            {
              in: `0 0 -1
`,
              out: `Notas: 2
Maxima: 0
Minima: 0
Aprobadas: 0`
            }
          ],
          pistas: [
            "Combina cuatro patrones: contador, contador condicional, máximo y mínimo.",
            "Inicializa el máximo y el mínimo con la primera nota (como en `ResumenCaja`)."
          ],
          solucion: `import java.util.Scanner;

public class Notas {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int notas = 0;
        int aprobadas = 0;
        int maxima = 0;
        int minima = 0;
        int nota = teclado.nextInt();
        while (nota != -1) {
            notas++;
            if (nota >= 5) {
                aprobadas++;
            }
            if (notas == 1 || nota > maxima) {
                maxima = nota;
            }
            if (notas == 1 || nota < minima) {
                minima = nota;
            }
            nota = teclado.nextInt();
        }
        if (notas == 0) {
            System.out.println("Sin notas");
        } else {
            System.out.println("Notas: " + notas);
            System.out.println("Maxima: " + maxima);
            System.out.println("Minima: " + minima);
            System.out.println("Aprobadas: " + aprobadas);
        }
    }
}`,
          rubrica: [
            "Gestionas el caso sin notas (no hay máximo ni mínimo)",
            "Probaste con una sola nota y con todas iguales"
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Cómo se inicializan bien el máximo y el mínimo?",
          bloques: [
            {
              t: "texto",
              md: "Dos errores clásicos: con notas negativas, un máximo inicializado en 0 nunca bajaría de 0; y un mínimo inicializado en 1000 falla si hay un valor mayor. La solución robusta es **inicializar con el primer dato** (como aquí) o con los extremos del tipo: `Integer.MIN_VALUE` para el máximo e `Integer.MAX_VALUE` para el mínimo."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Cómo se sale de un bucle anidado? ¿Y qué coste tiene anidar?",
          bloques: [
            {
              t: "texto",
              md: "Con una **bandera** (`boolean encontrado`) o una **etiqueta** (`break etiqueta;`, lo ves en la siguiente sección). Y cada nivel de anidación **multiplica** las vueltas: 3 bucles anidados de 1 000 vueltas son mil millones de iteraciones. Antes de anidar mucho, piensa si hay una forma más directa."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Los **patrones de bucle** son lo que hace un analista de datos con Excel, SQL o Python cada día: contar, sumar, agrupar, máximos, filtros. Lo que aprendes aquí con un `while` en Java es exactamente un `COUNT`, `SUM`, `MAX` y `GROUP BY` en SQL. Tenerlo claro te hará rápido en cualquier lenguaje.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Números primos hasta N (con bandera y bucles anidados)",
          p: `Lee un entero \`n\` ≥ 2 y muestra **todos los números primos** de 2 a \`n\`, separados por un espacio y en una sola línea (sin espacio final). Un número es primo si **solo** es divisible por 1 y por sí mismo. Usa un bucle exterior (candidatos) y uno interior (divisores) con una **bandera** \`esPrimo\`. Después muestra, en otra línea, \`Total: <cantidad>\`.
Con \`n = 20\`: \`2 3 5 7 11 13 17 19\` y \`Total: 8\`.`,
          requisitos: [
            "Bucle exterior de candidatos y bucle interior de divisores",
            "Bandera `esPrimo` reiniciada **en cada candidato**",
            "Optimización: basta probar divisores hasta la raíz cuadrada (`divisor * divisor <= candidato`)"
          ],
          inicial: `import java.util.Scanner;

public class Primos {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int n = teclado.nextInt();
    }
}`,
          tests: [
            {
              in: `20
`,
              out: `2 3 5 7 11 13 17 19
Total: 8`
            },
            {
              in: `2
`,
              out: `2
Total: 1`
            },
            {
              in: `30
`,
              out: `2 3 5 7 11 13 17 19 23 29
Total: 10`
            }
          ],
          pistas: [
            "La bandera se pone a `true` al empezar cada candidato y a `false` al encontrar un divisor.",
            "Si `candidato % divisor == 0`, ya no es primo: no hace falta seguir (`break`)."
          ],
          solucion: `import java.util.Scanner;

public class Primos {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int n = teclado.nextInt();
        String lista = "";
        int total = 0;
        for (int candidato = 2; candidato <= n; candidato++) {
            boolean esPrimo = true;
            for (int divisor = 2; divisor * divisor <= candidato; divisor++) {
                if (candidato % divisor == 0) {
                    esPrimo = false;
                    break;
                }
            }
            if (esPrimo) {
                lista += (total == 0 ? "" : " ") + candidato;
                total++;
            }
        }
        System.out.println(lista);
        System.out.println("Total: " + total);
    }
}`,
          rubrica: [
            "Sabrías explicar por qué basta llegar hasta la raíz cuadrada",
            "Has probado con 2, 3, 4 y con un cuadrado perfecto como 25 o 49"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos los **patrones de bucle y los bucles anidados**.",
        inicial: [
          {
            p: "¿Con qué se inicializa un acumulador que **suma**?",
            o: ["Con 1", "Con 0", "Con -1", "Con el primer dato siempre"],
            c: 1,
            e: "El elemento neutro de la suma es 0 (el del producto, 1)."
          },
          {
            p: "¿Qué es un centinela?",
            o: [
              "Un tipo de bucle",
              "Un valor especial que indica el final de la entrada",
              "Una variable booleana",
              "Una excepción"
            ],
            c: 1,
            e: "Por ejemplo, «escribe 0 para terminar»."
          },
          {
            p: "El bucle exterior da 3 vueltas y el interior 5. ¿Cuántas veces se ejecuta el cuerpo del interior?",
            o: ["8", "15", "3", "5"],
            c: 1,
            e: "3 × 5."
          }
        ],
        pasos: [
          {
            titulo: "Contador y acumulador",
            cubre: [0],
            explica: "El **contador** suma 1 cada vez que ocurre algo (`ventas++`). El **acumulador** suma un valor (`total += importe`). Los dos se inicializan **antes** del bucle: en 0 (o en 1 si multiplica).",
            ejemplo: {
              code: `int pares = 0;
int suma = 0;
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        pares++;
        suma += i;
    }
}
System.out.println(pares + " " + suma);`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "En el ejemplo, ¿cuánto vale `suma` al final?",
              o: ["15", "30", "55", "10"],
              c: 1,
              e: "2 + 4 + 6 + 8 + 10 = 30."
            }
          },
          {
            titulo: "Centinela y máximo",
            cubre: [1],
            explica: "El **centinela** es un dato que no cuenta y marca el final. El **máximo** se inicializa con el primer dato real (no con 0).",
            pregunta: {
              p: "¿Qué lectura se hace **antes** del bucle `while (dato != 0)`?",
              o: ["Ninguna", "La primera, para que la condición tenga algo que comprobar", "La última", "Todas"],
              c: 1,
              e: "Lectura previa + lectura al final de cada vuelta."
            }
          },
          {
            titulo: "Bucles anidados",
            cubre: [2],
            explica: "El bucle interior se ejecuta **completo** en cada vuelta del exterior. Total de vueltas del interior = vueltas del exterior × vueltas del interior.",
            pregunta: {
              p: "¿Cuántos asteriscos dibuja `for (i = 1; i <= 3; i++) for (j = 1; j <= i; j++) print(\"*\")`?",
              o: ["3", "6", "9", "12"],
              c: 1,
              e: "1 + 2 + 3 = 6."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Lee 5 enteros y muestra cuántos de ellos son pares:
 \`\`\`
 Pares: 2
 \`\`\`
 (con entrada \`4 7 10 3 5\`).
 `,
          inicial: `
 import java.util.Scanner;

 public class ContarPares {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
     }
 }
 `,
          tests: [
            {
              in: `4 7 10 3 5
`,
              out: "Pares: 2"
            },
            {
              in: `1 3 5 7 9
`,
              out: "Pares: 0"
            },
            {
              in: `2 2 2 2 2
`,
              out: "Pares: 5"
            }
          ],
          solucion: `
 import java.util.Scanner;

 public class ContarPares {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int pares = 0;
         for (int i = 0; i < 5; i++) {
             int numero = teclado.nextInt();
             if (numero % 2 == 0) {
                 pares++;
             }
         }
         System.out.println("Pares: " + pares);
     }
 }
 `,
          pistas: ["Un `for` de 5 vueltas con un `nextInt()` dentro y un contador."]
        }
      }
    },

    {
      id: "ut3-saltos",
      titulo: "Estructuras de salto: break y continue",
      resumen: "Salir de un bucle antes de tiempo o saltarse una vuelta; etiquetas y buenas prácticas.",
      bloques: [
        {
          t: "texto",
          md: `A veces el bucle normal no basta: queremos salir antes de tiempo o saltarnos una vuelta. Las sentencias de **salto** alteran el flujo de forma más brusca:
- \`break\`: termina **inmediatamente** el bucle (o el \`switch\` clásico) y continúa después de él.
- \`continue\`: abandona la vuelta actual y **pasa a la siguiente iteración**.

El ejemplo de las ventas, reescrito con \`while (true)\` (infinito a propósito) y \`break\` para salir:`
        },
        {
          t: "codigo",
          titulo: "VentasBreak.java",
          code: `import java.util.Scanner;

public class VentasBreak {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        double total = 0;
        while (true) {
            double importe = teclado.nextDouble();
            if (importe == 0) {
                break;                 // salimos del bucle
            }
            if (importe < 0) {
                System.out.println("Importe negativo: se ignora");
                continue;              // volvemos a pedir otro importe
            }
            total += importe;
        }
        System.out.printf("Total: %.2f%n", total);
    }
}`,
          ejecutable: true,
          stdin: `10
-5
2,5
0
`
        },
        {
          t: "predecir",
          p: "Haz la tabla de seguimiento: ¿qué muestra?",
          code: `for (int i = 1; i <= 6; i++) {
    if (i == 2) {
        continue;
    }
    if (i == 5) {
        break;
    }
    System.out.println(i);
}
System.out.println("fin");`,
          salida: `1
3
4
fin`,
          e: "Con `i = 2`, `continue` salta el `println`. Con `i = 5`, `break` sale del bucle: nunca se muestra 5 ni 6."
        },
        {
          t: "texto",
          md: "Si hay bucles anidados, `break` solo sale del **más interno**. Para salir del exterior se pone una **etiqueta** al bucle y se escribe `break etiqueta;`:"
        },
        {
          t: "codigo",
          titulo: "Busqueda.java",
          code: `public class Busqueda {
    public static void main(String[] args) {
        busqueda:
        for (int fila = 1; fila <= 5; fila++) {
            for (int columna = 1; columna <= 5; columna++) {
                if (fila * columna == 12) {
                    System.out.println("Encontrado: " + fila + " x " + columna);
                    break busqueda;    // sale de los dos bucles
                }
            }
        }
        System.out.println("fin");
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "clave",
          md: `**Úsalos con moderación.** Abusar de \`break\` y \`continue\` hace el código más difícil de seguir, porque hay varias salidas posibles de un mismo bucle.
- Si la condición del bucle puede expresar la salida con claridad, hazlo ahí.
- \`break\` es razonable al **encontrar lo que buscabas** o en el patrón «leer hasta el centinela».
- Evita \`continue\` si un simple \`if\` dentro del bucle consigue lo mismo.
- \`return\` sale de un **método** completo; lo usarás en la UT4.`
        },
        {
          t: "test",
          p: "Con bucles anidados, ¿qué hace `break` sin etiqueta?",
          o: [
            "Sale de todos los bucles",
            "Sale solo del bucle más interno",
            "Salta una vuelta",
            "Termina el programa"
          ],
          c: 1,
          e: "Solo del más interno. Para salir de los dos se usa una etiqueta."
        },
        {
          t: "ejecuta",
          p: "**Primer múltiplo.** Lee un entero `n` y busca con un `for` el **primer número mayor que 100 que sea múltiplo de `n`**. Muéstralo con `break` en cuanto lo encuentres: `Primer multiplo: 105`.",
          inicial: `import java.util.Scanner;

public class Multiplo {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int n = teclado.nextInt();
    }
}`,
          tests: [
            {
              in: `7
`,
              out: "Primer multiplo: 105"
            },
            {
              in: `5
`,
              out: "Primer multiplo: 105"
            },
            {
              in: `100
`,
              out: "Primer multiplo: 200"
            },
            {
              in: `1
`,
              out: "Primer multiplo: 101"
            }
          ],
          pistas: [
            "Empieza en 101 y para en cuanto `i % n == 0`.",
            "Siempre hay un múltiplo de `n` en los `n` números siguientes a 100."
          ],
          solucion: `import java.util.Scanner;

public class Multiplo {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int n = teclado.nextInt();
        int encontrado = 0;
        for (int i = 101; i <= 100 + n; i++) {
            if (i % n == 0) {
                encontrado = i;
                break;
            }
        }
        System.out.println("Primer multiplo: " + encontrado);
    }
}`
        },
        {
          t: "profundizar",
          titulo: "¿Se puede escribir el ejemplo de `break` sin `break`?",
          bloques: [
            {
              t: "texto",
              md: "Sí, con una **bandera** o con la condición del `while`. Compara: `while (importe != 0)` con lectura previa y final (sin `break`) frente a `while (true)` con `break` (una sola lectura). Ninguno es «correcto»: elige el más **legible**. En equipos profesionales se valora la versión sin `break` cuando el bucle es corto, y con `break` cuando evita duplicar código."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Muchos equipos tienen guías de estilo que **limitan** `continue` y las etiquetas. Pregunta siempre por la guía del proyecto (*coding conventions*). Y si tu bucle necesita una etiqueta, probablemente conviene **extraer** esa búsqueda a un método (lo harás en la UT4): `return` sustituye a `break etiqueta` de forma más limpia.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos **break y continue**.",
        inicial: [
          {
            p: "¿Qué hace `continue` dentro de un bucle?",
            o: [
              "Sale del bucle",
              "Salta a la siguiente iteración",
              "Termina el programa",
              "Repite la vuelta actual"
            ],
            c: 1,
            e: "Abandona la vuelta actual."
          },
          {
            p: "¿Qué hace `break` en un `for`?",
            o: ["Salta una vuelta", "Sale inmediatamente del bucle", "Pausa el programa", "Reinicia el bucle"],
            c: 1,
            e: "Sale del bucle."
          }
        ],
        pasos: [
          {
            titulo: "break frente a continue",
            cubre: [0, 1],
            explica: "`break` **sale** del bucle. `continue` **se salta el resto de la vuelta actual** y pasa a la siguiente. Ambos suelen ir dentro de un `if`.",
            ejemplo: {
              code: `for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;
    }
    System.out.println(i);
}`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "Con `continue` cuando `i == 3`, ¿qué números se muestran?",
              o: ["1 2", "1 2 4 5", "1 2 3 4 5", "3"],
              c: 1,
              e: "Solo se salta el 3."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Lee enteros hasta que aparezca un número **negativo** (que no se procesa). Muestra la suma de los leídos antes: con \`4 6 2 -1\`, \`Suma: 12\`. Usa \`break\`.
 `,
          inicial: `
 import java.util.Scanner;

 public class SumaHastaNegativo {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
     }
 }
 `,
          tests: [
            {
              in: `4 6 2 -1
`,
              out: "Suma: 12"
            },
            {
              in: `-5
`,
              out: "Suma: 0"
            },
            {
              in: `10 -3 8
`,
              out: "Suma: 10"
            }
          ],
          solucion: `
 import java.util.Scanner;

 public class SumaHastaNegativo {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int suma = 0;
         while (true) {
             int n = teclado.nextInt();
             if (n < 0) {
                 break;
             }
             suma += n;
         }
         System.out.println("Suma: " + suma);
     }
 }
 `,
          pistas: ["`while (true)` y un `break` cuando el número sea negativo."]
        }
      }
    },

    {
      id: "ut3-excepciones",
      titulo: "Control de excepciones",
      resumen: "Qué es una excepción, la traza, try-catch-finally, jerarquía, throw y excepciones propias.",
      bloques: [
        {
          t: "texto",
          md: `Un programa que solo funciona si el usuario lo hace todo bien no es un buen programa. Si escribes \`tres\` cuando se pide un entero con \`nextInt()\`, el programa termina bruscamente con un mensaje como este:
\`\`\`
Exception in thread "main" java.util.InputMismatchException
    at java.base/java.util.Scanner.throwFor(Scanner.java:947)
    at java.base/java.util.Scanner.next(Scanner.java:1602)
    at java.base/java.util.Scanner.nextInt(Scanner.java:2267)
    at Pedido.main(Pedido.java:7)
\`\`\`
Eso es una **excepción**: un evento anormal que interrumpe el flujo normal. El mensaje se llama **traza de la pila** (*stack trace*):
- La **primera línea** dice **qué** ha pasado: el tipo de excepción (aquí, el dato no coincide con el tipo pedido) y a veces un mensaje.
- Las líneas \`at\` dicen **dónde**, de dentro hacia fuera. La que más te interesa es **la primera que menciona tu propia clase**: \`Pedido.main(Pedido.java:7)\`, línea 7 de tu archivo.`
        },
        {
          t: "test",
          p: "En una traza, ¿qué línea te dice dónde falló **tu** código?",
          o: [
            "La primera línea (`Exception in thread ...`)",
            "La primera línea `at` que menciona tu clase",
            "La última línea del programa",
            "La línea que dice `java.base`"
          ],
          c: 1,
          e: "Las líneas de `java.base` son código interno de Java. Busca tu clase y el número de línea."
        },
        {
          t: "texto",
          md: `Otras excepciones habituales: \`ArithmeticException\` (división **entera** entre cero), \`NumberFormatException\` (\`Integer.parseInt("12a")\`), \`NullPointerException\` (usar un objeto que vale \`null\`) y \`StringIndexOutOfBoundsException\` (posición inexistente).

### \`try-catch\`
El código **que puede fallar** va en \`try\`; el que **gestiona el error**, en \`catch\`. Si no hay error, el \`catch\` se salta; si lo hay, la ejecución **salta** desde la línea que falló al \`catch\` (el resto del \`try\` no se ejecuta) y el programa continúa. La \`e\` del \`catch\` es el objeto excepción: \`e.getMessage()\` da el mensaje.`
        },
        {
          t: "codigo",
          titulo: "PedidoSeguro.java",
          code: `import java.util.InputMismatchException;
import java.util.Scanner;

public class PedidoSeguro {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        try {
            System.out.print("Unidades: ");
            int unidades = teclado.nextInt();
            System.out.println("Pedido de " + unidades + " unidades");
        } catch (InputMismatchException e) {
            System.out.println("Eso no es un número entero.");
        }
        System.out.println("Fin del programa");
    }
}`,
          ejecutable: true,
          stdin: `tres
`
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: "**El caso especial de `Scanner`**: cuando `nextInt()` falla, el texto incorrecto **se queda sin leer**. Si vuelves a llamar a `nextInt()`, lo encontrará de nuevo, fallará de nuevo, y tendrás un **bucle infinito**. Antes de reintentar hay que **descartar** lo escrito con `teclado.nextLine()`."
        },
        {
          t: "texto",
          md: "Esto da lugar al patrón que más usarás: **leer un dato y repetir hasta que sea válido** (bandera + `while` + excepción controlada):"
        },
        {
          t: "codigo",
          titulo: "Unidades.java",
          code: `import java.util.InputMismatchException;
import java.util.Scanner;

public class Unidades {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int unidades = 0;
        boolean valido = false;
        while (!valido) {
            try {
                System.out.print("Unidades (1-50): ");
                unidades = teclado.nextInt();
                if (unidades < 1 || unidades > 50) {
                    System.out.println("Debe estar entre 1 y 50.");
                } else {
                    valido = true;
                }
            } catch (InputMismatchException e) {
                System.out.println("Escribe un número entero.");
                teclado.nextLine();      // descartamos lo escrito
            }
        }
        System.out.println("Pedido de " + unidades + " unidades");
    }
}`,
          ejecutable: true,
          stdin: `abc
99
7
`
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "Hay **dos tipos de dato incorrecto**: el que no es un número (**excepción**) y el que es un número pero está fuera de rango (**condición normal** con `if`). Usa excepciones para lo excepcional; para lo previsible, un `if`."
        },
        {
          t: "texto",
          md: `### Varios \`catch\` y \`finally\`
Un \`try\` puede tener varios \`catch\` (uno por tipo de error) y un \`finally\` que **se ejecuta siempre**, haya o no excepción. Java comprueba los \`catch\` **en orden** y ejecuta el **primero** que encaja. Para tratar dos tipos igual: \`catch (A | B e)\`.`
        },
        {
          t: "predecir",
          p: "Predice con cuidado. ¿Qué muestra?",
          code: `String texto = "12a";
try {
    int personas = Integer.parseInt(texto);
    int reparto = 100 / personas;
    System.out.println("Cada persona paga " + reparto);
} catch (NumberFormatException e) {
    System.out.println("No es un número: " + texto);
} catch (ArithmeticException e) {
    System.out.println("No se puede repartir entre cero");
} finally {
    System.out.println("Fin del cálculo");
}`,
          salida: `No es un número: 12a
Fin del cálculo`,
          e: "`parseInt` falla y salta al primer `catch`. El `finally` se ejecuta siempre."
        },
        {
          t: "predecir",
          p: "Ahora con otro texto. ¿Qué muestra?",
          code: `String texto = "0";
try {
    int personas = Integer.parseInt(texto);
    int reparto = 100 / personas;
    System.out.println("Cada persona paga " + reparto);
} catch (NumberFormatException e) {
    System.out.println("No es un número: " + texto);
} catch (ArithmeticException e) {
    System.out.println("No se puede repartir entre cero");
} finally {
    System.out.println("Fin del cálculo");
}`,
          salida: `No se puede repartir entre cero
Fin del cálculo`,
          e: "`parseInt(\"0\")` sí funciona; falla la división, que salta al segundo `catch`."
        },
        {
          t: "texto",
          md: `### Tipos de excepciones: la jerarquía
Las excepciones forman un **árbol** (en la UT4 verás que se llama herencia):
\`\`\`
Throwable
├── Error                 (fallos graves de la JVM: no se capturan)
└── Exception
    ├── IOException       (COMPROBADAS: el compilador obliga a tratarlas)
    ├── (las tuyas, p. ej. StockInsuficienteException)
    └── RuntimeException  (NO comprobadas)
        ├── ArithmeticException
        ├── IllegalArgumentException
        │   └── NumberFormatException
        ├── NullPointerException
        ├── IndexOutOfBoundsException
        │   └── StringIndexOutOfBoundsException
        └── NoSuchElementException
            └── InputMismatchException
\`\`\`
- **No comprobadas** (cuelgan de \`RuntimeException\`): suelen indicar un fallo del programador o un dato incorrecto. El compilador no obliga a capturarlas.
- **Comprobadas** (el resto de \`Exception\`): problemas **externos** aunque el programa esté bien escrito (archivo que no existe, conexión caída). El compilador **obliga** a tratarlas con \`try-catch\` o a declararlas con \`throws\`.
- **\`Error\`**: fallos de la máquina virtual; no se capturan.

Los \`catch\` se escriben **de lo más concreto a lo más general**: si capturas \`Exception\` antes que una concreta, la segunda nunca se alcanza y el compilador da error.`
        },
        {
          t: "relacionar",
          p: "¿Comprobada o no comprobada?",
          pares: [
            ["IOException (el archivo no existe)", "comprobada"],
            ["NullPointerException", "no comprobada"],
            ["ArithmeticException", "no comprobada"],
            ["Una excepción propia que extiende Exception", "comprobada"],
            ["OutOfMemoryError", "es un Error"]
          ],
          e: "Cuelga de `RuntimeException`: no comprobada. Cuelga de `Exception` sin pasar por `RuntimeException`: comprobada. `Error`: ni se trata."
        },
        {
          t: "aviso",
          tipo: "cuidado",
          md: `**Lo que no debes hacer**
- **Un \`catch\` vacío** (\`catch (Exception e) { }\`): esconde el error y hace casi imposible encontrarlo. Como mínimo, muestra el mensaje.
- **Capturar \`Exception\` para todo** cuando sabes qué error esperas: capturas también fallos que no habías previsto.
- **Usar excepciones para el flujo normal** cuando una condición basta: \`if (personas != 0)\` es mejor que capturar \`ArithmeticException\`.`
        },
        {
          t: "texto",
          md: `### Lanzar excepciones: \`throw\`
Nosotros también podemos **provocar** una excepción al detectar algo incorrecto: \`throw new TipoDeExcepcion("mensaje")\`.
\`\`\`
if (unidades <= 0) {
    throw new IllegalArgumentException("Las unidades deben ser positivas: " + unidades);
}
\`\`\`
### Crear nuestras propias excepciones
Para errores propios de la tienda conviene una excepción con un nombre que lo diga todo. De momento acéptalo como **plantilla** (\`extends Exception\` = «es un tipo de excepción»; el constructor pasa el mensaje al padre). Al heredar de \`Exception\` (no de \`RuntimeException\`) es **comprobada**: Java obliga a tratarla.`
        },
        {
          t: "codigo",
          titulo: "SalidaAlmacen.java",
          code: `class StockInsuficienteException extends Exception {
    public StockInsuficienteException(String mensaje) {
        super(mensaje);
    }
}

public class SalidaAlmacen {
    public static void main(String[] args) {
        int stock = 5;
        int pedido = 8;
        try {
            if (pedido > stock) {
                throw new StockInsuficienteException(
                    "Piden " + pedido + " unidades y solo quedan " + stock);
            }
            stock -= pedido;
            System.out.println("Pedido servido. Stock restante: " + stock);
        } catch (StockInsuficienteException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`,
          ejecutable: true
        },
        {
          t: "texto",
          md: `### Cerrar recursos: \`try-with-resources\`
Si ocurre una excepción antes de llegar a \`close()\`, el \`Scanner\` no se cierra. Java ofrece declarar el recurso entre paréntesis tras el \`try\`: se **cierra solo** al terminar el bloque, haya error o no.
\`\`\`
try (Scanner teclado = new Scanner(System.in)) {
    int unidades = teclado.nextInt();
    System.out.println("Pedido de " + unidades + " unidades");
} catch (InputMismatchException e) {
    System.out.println("Eso no es un número entero.");
}
\`\`\``
        },
        {
          t: "ejecuta",
          p: "**Arregla el orden de los `catch`.** Este programa no compila porque un `catch` general tapa a otro concreto. Corrígelo para que muestre `No es un numero`:",
          inicial: `public class OrdenCatch {
    public static void main(String[] args) {
        try {
            int n = Integer.parseInt("abc");
            System.out.println(n);
        } catch (Exception e) {
            System.out.println("Error general");
        } catch (NumberFormatException e) {
            System.out.println("No es un numero");
        }
    }
}`,
          tests: [
            { out: "No es un numero" }
          ],
          pistas: [
            "Los `catch` se prueban en orden: el más concreto primero.",
            "Intercambia los dos bloques `catch`."
          ],
          solucion: `public class OrdenCatch {
    public static void main(String[] args) {
        try {
            int n = Integer.parseInt("abc");
            System.out.println(n);
        } catch (NumberFormatException e) {
            System.out.println("No es un numero");
        } catch (Exception e) {
            System.out.println("Error general");
        }
    }
}`,
          explicacion: "`NumberFormatException` es un caso particular de `Exception`: si `Exception` va antes, la concreta no se alcanza nunca (el compilador lo detecta: *exception has already been caught*)."
        },
        {
          t: "ejecuta",
          p: "**Reparto de gastos.** Lee el importe total de una excursión (decimal con coma) y el número de personas (entero). Muestra lo que paga cada persona con dos decimales (`Cada persona paga 12,50 euros`). Si lo escrito no es un número, muestra `Escribe un numero valido` y **vuelve a pedirlo todo**; si las personas son 0 o menos, muestra `Debe haber al menos una persona` y también repite. Usa `try-catch`, `throw` y un `while` con bandera.",
          inicial: `import java.util.InputMismatchException;
import java.util.Scanner;

public class ReparteGastos {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        boolean terminado = false;
    }
}`,
          tests: [
            {
              in: `100 8
`,
              out: "Cada persona paga 12,50 euros"
            },
            {
              in: `abc
50 2
`,
              out: `Escribe un numero valido
Cada persona paga 25,00 euros`
            },
            {
              in: `60 0
60 4
`,
              out: `Debe haber al menos una persona
Cada persona paga 15,00 euros`
            }
          ],
          pistas: [
            "Dos `catch`: `InputMismatchException` (descartando con `nextLine()`) e `IllegalArgumentException`.",
            "La bandera `terminado` solo se pone a `true` cuando todo salió bien."
          ],
          solucion: `import java.util.InputMismatchException;
import java.util.Scanner;

public class ReparteGastos {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        boolean terminado = false;
        while (!terminado) {
            try {
                double importe = teclado.nextDouble();
                int personas = teclado.nextInt();
                if (personas <= 0) {
                    throw new IllegalArgumentException("Debe haber al menos una persona");
                }
                System.out.printf("Cada persona paga %.2f euros%n", importe / personas);
                terminado = true;
            } catch (InputMismatchException e) {
                System.out.println("Escribe un numero valido");
                teclado.nextLine();
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}`,
          rubrica: [
            "Descartas el texto incorrecto con `nextLine()` para evitar el bucle infinito",
            "Compruebas `personas` antes de dividir"
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Por qué `double / 0` no lanza excepción?",
          bloques: [
            {
              t: "texto",
              md: "Con **enteros**, `5 / 0` lanza `ArithmeticException`. Con **decimales**, `5.0 / 0` da `Infinity` y `0.0 / 0` da `NaN` (*Not a Number*), según el estándar IEEE 754. No avisa: sigue calculando con `Infinity` y el resultado final es absurdo. Por eso conviene **comprobar el divisor** antes de dividir, sea del tipo que sea."
            },
            {
              t: "codigo",
              code: `System.out.println(5.0 / 0);
System.out.println(-5.0 / 0);
System.out.println(0.0 / 0);
System.out.println(5 / 0);`,
              ejecutable: true
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Cuándo `catch` y cuándo `throws`?",
          bloques: [
            {
              t: "texto",
              md: "Si **puedes hacer algo útil** con el error (volver a pedir el dato, usar un valor por defecto), lo capturas con `catch`. Si no sabes qué hacer en ese punto, lo **declaras** con `throws` y dejas que lo trate quien te llamó. En la UT4 lo harás con tus propios métodos: `void servir(int pedido) throws StockInsuficienteException`. Regla: captura **donde puedas resolver**, no donde puedas ocultar."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "En producción, el **registro de errores** (*logging*) es lo que te salva a las 3 de la madrugada. Un `catch` bien escrito **registra** el mensaje y **la traza completa** (con `e.printStackTrace()` en un ejercicio; con una librería de logging en un proyecto real) y, además, da al usuario un mensaje **comprensible** sin datos internos. Nunca muestres trazas ni contraseñas al cliente: son información que facilita un ataque.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Validador de pedidos con excepción propia",
          p: `Crea (en el mismo archivo) la excepción comprobada \`PedidoInvalidoException extends Exception\`. Lee **tres pedidos** (cada uno: código de producto como texto y unidades como texto) y procesa cada uno con un \`try-catch\` independiente:
- Si las unidades no son un entero → \`Pedido X: unidades no numericas\`.
- Si son 0 o negativas → lanza \`PedidoInvalidoException("unidades <= 0")\` y se muestra \`Pedido X: invalido (unidades <= 0)\`.
- Si son más de 50 → \`Pedido X: invalido (demasiadas unidades)\`.
- Si es correcto → \`Pedido X: OK\`.
Muestra al final \`Correctos: <n>/3\`. (X es el código.)`,
          requisitos: [
            "Excepción propia comprobada que se lanza con `throw`",
            "Dos `catch` de tipos distintos en orden correcto",
            "`try-catch` **dentro** del bucle: un pedido erróneo no debe impedir procesar los siguientes"
          ],
          inicial: `import java.util.Scanner;

class PedidoInvalidoException extends Exception {
    public PedidoInvalidoException(String mensaje) {
        super(mensaje);
    }
}

public class Pedidos {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int correctos = 0;
    }
}`,
          tests: [
            {
              in: `A1 5
B2 abc
C3 -4
`,
              out: `Pedido A1: OK
Pedido B2: unidades no numericas
Pedido C3: invalido (unidades <= 0)
Correctos: 1/3`
            },
            {
              in: `X 60
Y 50
Z 1
`,
              out: `Pedido X: invalido (demasiadas unidades)
Pedido Y: OK
Pedido Z: OK
Correctos: 2/3`
            }
          ],
          pistas: [
            "Si el `try-catch` estuviera fuera del `for`, el primer error terminaría el bucle.",
            "`Integer.parseInt` lanza `NumberFormatException` con texto no numérico."
          ],
          solucion: `import java.util.Scanner;

class PedidoInvalidoException extends Exception {
    public PedidoInvalidoException(String mensaje) {
        super(mensaje);
    }
}

public class Pedidos {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int correctos = 0;
        for (int i = 0; i < 3; i++) {
            String codigo = teclado.next();
            String texto = teclado.next();
            try {
                int unidades = Integer.parseInt(texto);
                if (unidades <= 0) {
                    throw new PedidoInvalidoException("unidades <= 0");
                }
                if (unidades > 50) {
                    throw new PedidoInvalidoException("demasiadas unidades");
                }
                System.out.println("Pedido " + codigo + ": OK");
                correctos++;
            } catch (NumberFormatException e) {
                System.out.println("Pedido " + codigo + ": unidades no numericas");
            } catch (PedidoInvalidoException e) {
                System.out.println("Pedido " + codigo + ": invalido (" + e.getMessage() + ")");
            }
        }
        System.out.println("Correctos: " + correctos + "/3");
    }
}`,
          rubrica: [
            "Sabrías explicar por qué el `try-catch` va dentro del bucle",
            "Sabrías explicar por qué `PedidoInvalidoException` es comprobada"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Hablemos del **control de excepciones**.",
        inicial: [
          {
            p: "¿Qué indica la primera línea de una traza de excepción?",
            o: ["Dónde ocurrió", "Qué tipo de error ha ocurrido", "Quién lo causó", "Cómo arreglarlo"],
            c: 1,
            e: "El tipo de excepción y a veces un mensaje."
          },
          {
            p: "¿Cuándo se ejecuta el bloque `finally`?",
            o: ["Solo si hay excepción", "Solo si no hay excepción", "Siempre", "Nunca"],
            c: 2,
            e: "Siempre, haya o no error."
          },
          {
            p: "¿Qué excepción lanza `Integer.parseInt(\"12a\")`?",
            o: [
              "`ArithmeticException`",
              "`NumberFormatException`",
              "`NullPointerException`",
              "`InputMismatchException`"
            ],
            c: 1,
            e: "El texto no tiene formato numérico."
          }
        ],
        pasos: [
          {
            titulo: "try-catch",
            cubre: [1],
            explica: "El código que puede fallar va en `try`. Si falla, la ejecución **salta** al `catch` que encaja (el resto del `try` no se ejecuta) y el programa sigue. `finally` se ejecuta siempre.",
            ejemplo: {
              code: `try {
    System.out.println("A");
    int x = 5 / 0;
    System.out.println("B");
} catch (ArithmeticException e) {
    System.out.println("C");
} finally {
    System.out.println("D");
}`,
              ejecutable: true,
              titulo: "Compruébalo"
            },
            pregunta: {
              p: "En el ejemplo, ¿qué se muestra?",
              o: ["A B C D", "A C D", "A D", "A B D"],
              c: 1,
              e: "B no llega a mostrarse: la excepción salta al `catch`."
            }
          },
          {
            titulo: "Excepciones comunes",
            cubre: [2],
            explica: "`ArithmeticException` (entero entre 0), `NumberFormatException` (`parseInt` de un texto no numérico), `NullPointerException` (método sobre `null`), `InputMismatchException` (el `Scanner` no recibe el tipo pedido).",
            pregunta: {
              p: "¿Qué excepción lanza `Integer.parseInt(\"hola\")`?",
              o: ["`ArithmeticException`", "`NumberFormatException`", "`NullPointerException`", "Ninguna"],
              c: 1,
              e: "El texto no se puede convertir a número."
            }
          },
          {
            titulo: "Leer la traza",
            cubre: [0],
            explica: "Primera línea: **qué** excepción. Líneas `at`: **dónde**; la primera con el nombre de **tu** clase te da el archivo y la línea.",
            pregunta: {
              p: "`at Pedido.main(Pedido.java:7)` significa…",
              o: [
                "Error en la línea 7 de Pedido.java",
                "El método main tarda 7 segundos",
                "7 errores en Pedido",
                "Línea 7 de la API de Java"
              ],
              c: 0,
              e: "Es el sitio de tu código donde ocurrió."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Lee un texto y conviértelo con \`Integer.parseInt\`. Si no es un entero, muestra \`No valido\`; si lo es, muestra el doble. Con \`21\` → \`42\`; con \`hola\` → \`No valido\`.
 `,
          inicial: `
 import java.util.Scanner;

 public class Doble {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         String texto = teclado.nextLine();
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
              in: `hola
`,
              out: "No valido"
            },
            {
              in: `3.5
`,
              out: "No valido"
            }
          ],
          solucion: `
 import java.util.Scanner;

 public class Doble {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         String texto = teclado.nextLine();
         try {
             int n = Integer.parseInt(texto);
             System.out.println(n * 2);
         } catch (NumberFormatException e) {
             System.out.println("No valido");
         }
     }
 }
 `,
          pistas: ["El `try` contiene el `parseInt` y el `println` del doble."]
        }
      }
    },

    {
      id: "ut3-aserciones",
      titulo: "Aserciones",
      resumen: "Afirmar lo que tiene que ser cierto mientras desarrollas con assert y la opción -ea.",
      bloques: [
        {
          t: "texto",
          md: `Una **aserción** es una afirmación que haces sobre el estado del programa en un punto concreto: «aquí, esto **tiene que** ser cierto». Se escribe con \`assert\`:
\`\`\`
assert precio >= 0 : "El precio no puede ser negativo: " + precio;
\`\`\`
Si la condición es falsa, el programa lanza un **\`AssertionError\`** con el mensaje tras los dos puntos (opcional). Y atención: **por defecto, las aserciones están desactivadas** y Java las ignora por completo. Se activan ejecutando con la opción \`-ea\` (*enable assertions*): \`java -ea PrecioAlquiler\`. En VS Code se añade \`"vmArgs": "-ea"\` a \`.vscode/launch.json\`. (En el editor de esta página tienes una casilla «-ea».)`
        },
        {
          t: "codigo",
          titulo: "PrecioAlquiler.java",
          code: `public class PrecioAlquiler {
    public static void main(String[] args) {
        int dias = 3;
        double descuento = 1.5;    // ¡error: un 150 %!
        double precio = dias * 25.0 * (1 - descuento);
        assert precio >= 0 : "El precio no puede ser negativo: " + precio;
        System.out.println("Precio: " + precio);
    }
}`,
          ejecutable: true
        },
        {
          t: "aviso",
          tipo: "consejo",
          md: "Ejecuta el código de arriba **dos veces**: sin `-ea` y con la casilla «-ea» marcada. Sin `-ea` muestra un precio negativo y no se queja; con `-ea` se detiene con `AssertionError` y te dice **dónde** y **por qué**."
        },
        {
          t: "predecir",
          p: "Sin la opción `-ea` (la ejecución por defecto), ¿qué muestra?",
          code: `int stock = 3;
assert stock > 100 : "stock insuficiente";
System.out.println("Stock: " + stock);`,
          salida: "Stock: 3",
          e: "Sin `-ea`, la línea del `assert` ni se evalúa: es como si no existiera."
        },
        {
          t: "tabla",
          titulo: "Aserción frente a validación",
          cab: ["", "`assert`", "`if` + excepción"],
          filas: [
            [
              "¿Para qué?",
              "Detectar **errores del programador** mientras desarrollas",
              "Controlar **datos incorrectos** (del usuario, de un fichero)"
            ],
            ["¿Siempre activo?", "No: solo con `-ea`", "Sí"],
            [
              "Ejemplo",
              "`assert total >= 0` justo después de un cálculo propio",
              "`if (unidades <= 0) throw new IllegalArgumentException(...)`"
            ]
          ]
        },
        {
          t: "test",
          p: "¿Para validar el número de unidades que escribe un cliente usarías `assert`?",
          o: [
            "Sí, es lo más cómodo",
            "No: un `assert` puede estar desactivado, y los datos del usuario hay que validarlos siempre",
            "Sí, pero con `-ea` obligatorio",
            "Solo en `main`"
          ],
          c: 1,
          e: "`assert` es una herramienta de desarrollo para errores **internos**. Los datos externos se validan con `if` + excepción."
        },
        {
          t: "test",
          p: "¿Qué excepción lanza un `assert` que falla?",
          o: ["`IllegalStateException`", "`AssertionError`", "`RuntimeException`", "`ArithmeticException`"],
          c: 1,
          e: "`AssertionError` es un `Error`, no una `Exception`: no se debe capturar."
        },
        {
          t: "abierta",
          p: "Explica con tus palabras la diferencia entre **validar un dato con `if`** y **comprobar con `assert`**, con un ejemplo de cada uno en la tienda de Náutica Bahía.",
          modelo: "Validar con `if` (y lanzar una excepción o mostrar un mensaje) sirve para los **datos que vienen de fuera** del programa, como las unidades que escribe un cliente: siempre pueden ser incorrectos y hay que comprobarlos **siempre**. Un `assert` sirve para comprobar **mis propias suposiciones** mientras desarrollo: por ejemplo, después de calcular el total de un ticket, `assert total >= 0`; si falla, es un error mío en el cálculo y quiero enterarme al probar. Como los `assert` se pueden desactivar, no se usan para proteger el programa en producción.",
          rubrica: [
            "Menciona que `assert` puede estar desactivado",
            "Distingue datos externos de errores internos",
            "Pone un ejemplo de cada uno"
          ],
          minPalabras: 40
        },
        {
          t: "profundizar",
          titulo: "¿Por qué las aserciones vienen desactivadas por defecto?",
          bloques: [
            {
              t: "texto",
              md: "Porque una aserción puede ser **costosa** (comprobar que una lista enorme está ordenada) y no debe frenar el programa en producción. Se activan en **desarrollo y pruebas** (`-ea`) y se desactivan en producción. Por eso un `assert` **no debe tener efectos secundarios**: `assert contador++ > 0` cambiaría el programa según esté activado o no. Es un error clásico."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Las aserciones son la base de las **pruebas automáticas** (JUnit): `assertEquals(esperado, obtenido)` es un `assert` pensado para que un programa ejecute miles de comprobaciones y te diga cuáles fallan. Cuando aprendas a usar JUnit (Entornos de desarrollo), lo que has visto aquí te resultará natural.",
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Veamos las **aserciones**.",
        inicial: [
          {
            p: "¿Qué ocurre con `assert x > 0;` si el programa se ejecuta **sin** `-ea`?",
            o: [
              "Se evalúa siempre",
              "Se ignora por completo",
              "Da error de compilación",
              "Se evalúa solo si x es positivo"
            ],
            c: 1,
            e: "Están desactivadas por defecto."
          },
          {
            p: "¿Qué opción activa las aserciones?",
            o: ["`-assert`", "`-ea`", "`-debug`", "`-on`"],
            c: 1,
            e: "`-ea` = enable assertions."
          }
        ],
        pasos: [
          {
            titulo: "assert frente a validación",
            cubre: [0, 1],
            explica: "Las aserciones comprueban **errores internos** durante el desarrollo y se pueden desactivar. Los datos del usuario se validan con `if` + excepción, que siempre está activa.",
            pregunta: {
              p: "¿Qué sentencia es adecuada para comprobar que **tu propio cálculo** del total no dio negativo?",
              o: ["`assert total >= 0;`", "`if (total >= 0) {}`", "`catch (total)`", "`switch (total)`"],
              c: 0,
              e: "Es una suposición interna: `assert`."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Con \`int a = 7, b = 3;\` muestra \`Suma: 10\` y añade, antes, una aserción \`assert a > b : "a debe ser mayor que b";\`. Ejecutado sin \`-ea\` debe mostrar solo la suma.
 `,
          inicial: `
 public class Suma {
     public static void main(String[] args) {
         int a = 7, b = 3;
     }
 }
 `,
          tests: [
            { out: "Suma: 10" }
          ],
          solucion: `
 public class Suma {
     public static void main(String[] args) {
         int a = 7, b = 3;
         assert a > b : "a debe ser mayor que b";
         System.out.println("Suma: " + (a + b));
     }
 }
 `,
          pistas: ["`assert condición : \"mensaje\";` y después el `println`."]
        }
      }
    },

    {
      id: "ut3-pruebas",
      titulo: "Prueba, depuración y documentación",
      resumen: "Tipos de errores, casos de prueba (típicos, límite, inválidos), depurador de VS Code y documentación.",
      bloques: [
        {
          t: "texto",
          md: `Escribir el programa es solo una parte del trabajo. Hay que **comprobar** que hace lo que debe, **encontrar** los errores cuando no lo hace y **documentarlo** para quien lo lea después (incluido tú dentro de un mes).

### Tipos de errores`
        },
        {
          t: "tabla",
          cab: ["Tipo", "Qué es", "Cuándo se detecta"],
          filas: [
            [
              "**Sintaxis** (compilación)",
              "No se respetan las reglas del lenguaje: `;` que falta, variable sin declarar",
              "Al compilar; el IDE los subraya"
            ],
            [
              "**Ejecución**",
              "Compila pero se detiene con una excepción: división entre cero, dato incorrecto",
              "Al ejecutar"
            ],
            [
              "**Lógicos**",
              "Funciona y no da error, pero el **resultado es incorrecto**: un `<` en lugar de `<=`, un descuento mal calculado",
              "Solo comprobando el resultado"
            ]
          ]
        },
        {
          t: "relacionar",
          p: "Clasifica cada error.",
          pares: [
            ["Falta un punto y coma", "sintaxis"],
            ["`Integer.parseInt(\"abc\")`", "ejecución"],
            ["`for (int i = 1; i < 10; i++)` cuando quería llegar a 10", "lógico"],
            ["Usar una variable sin declararla", "sintaxis"],
            ["`5 / 0` con enteros", "ejecución"]
          ],
          e: "Los más traicioneros son los **lógicos**: nadie te avisa. Solo se encuentran probando con método."
        },
        {
          t: "texto",
          md: `### Pruebas: diseñar casos de prueba
Probar no es ejecutar el programa una vez y ver que «sale algo razonable». Una **prueba** consiste en elegir unos **datos de entrada**, decidir **antes de ejecutar** qué resultado esperas y comparar con lo que sale. Los casos se organizan en una tabla. Para la tarifa por días (menos de 3: sin descuento; 3 a 6: 5 %; 7 o más: 15 %):`
        },
        {
          t: "tabla",
          cab: ["Días", "Tipo de caso", "Resultado esperado"],
          filas: [
            ["1", "típico (tramo bajo)", "sin descuento"],
            ["5", "típico (tramo medio)", "5 %"],
            ["10", "típico (tramo alto)", "15 %"],
            ["2", "**límite**", "sin descuento (último del tramo bajo)"],
            ["3", "**límite**", "5 % (primero del tramo medio)"],
            ["6", "**límite**", "5 % (último del tramo medio)"],
            ["7", "**límite**", "15 % (primero del tramo alto)"],
            ["0", "**inválido**", "error o mensaje"],
            ["-4", "**inválido**", "error o mensaje"]
          ]
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "Hay tres familias de casos que siempre debes buscar: los **típicos**, los **valores límite** (justo en los bordes de cada tramo: ahí se esconden casi todos los errores de `<` frente a `<=`) y los **inválidos** (lo que el usuario no debería escribir, pero escribirá)."
        },
        {
          t: "test",
          p: "Una regla da 10 % de descuento a partir de **100 euros** (incluido). ¿Cuáles son los valores límite que **debes** probar?",
          o: ["50 y 150", "99,99 y 100", "0 y 1000", "100 y 200"],
          c: 1,
          e: "Los valores límite son los que están **justo a ambos lados** del borde: 99,99 (no descuenta) y 100 (sí descuenta)."
        },
        {
          t: "ejecuta",
          p: "**Caza el error lógico.** Este programa debería aplicar un 10 % de descuento a partir de **100 euros incluidos**, pero con exactamente 100 euros no lo aplica. Corrige **una sola condición**. Con 100 debe mostrar `90.0`:",
          inicial: `public class Descuento {
    public static void main(String[] args) {
        double importe = 100;
        double total = importe;
        if (importe > 100) {
            total = importe * 0.9;
        }
        System.out.println(total);
    }
}`,
          tests: [
            { out: "90.0" }
          ],
          pistas: ["¿Qué debe pasar justo en 100? Es un valor límite.", "`>` excluye el 100; `>=` lo incluye."],
          solucion: `public class Descuento {
    public static void main(String[] args) {
        double importe = 100;
        double total = importe;
        if (importe >= 100) {
            total = importe * 0.9;
        }
        System.out.println(total);
    }
}`,
          explicacion: "Es el error de uno de siempre. Lo habrías encontrado probando el valor límite exacto."
        },
        {
          t: "texto",
          md: `### Depuración
**Depurar** es encontrar y corregir la **causa** de un error. No se hace al tuntún, cambiando cosas hasta que funcione, sino con método:
1. **Reproducir** el error: encontrar unos datos con los que falle siempre.
2. **Localizar** en qué punto el programa deja de comportarse como esperas.
3. **Formular una hipótesis** de por qué ocurre y comprobarla.
4. **Corregir una sola cosa** y volver a probar **todos** los casos, para comprobar que no se ha roto otra.

La técnica básica para localizar es insertar \`System.out.println\` con el valor de las variables. Funciona, pero hay que acordarse de borrarlos y ensucia el código. La herramienta profesional es el **depurador** del IDE: ejecuta el programa **paso a paso** y muestra las variables en cada momento (la tabla de seguimiento, hecha automáticamente). En Visual Studio Code:`
        },
        {
          t: "ordenar",
          p: "Ordena los pasos para depurar en VS Code.",
          items: [
            "Poner un punto de ruptura (clic a la izquierda del número de línea)",
            "Ejecutar con Debug (F5)",
            "El programa se detiene: mirar el panel Variables",
            "Avanzar paso a paso con F10 (step over) o F11 (step into)",
            "Terminar con Shift+F5"
          ],
          e: "Edit Breakpoint (clic derecho) permite parar solo si se cumple una condición (`hora == 99`): muy útil en bucles largos."
        },
        {
          t: "tabla",
          cab: ["Tecla", "Qué hace"],
          filas: [
            ["`F5`", "Iniciar la depuración / continuar hasta el siguiente punto de ruptura"],
            ["`F10`", "*Step over*: ejecuta la línea actual"],
            ["`F11`", "*Step into*: entra en el método que se llama"],
            ["`Shift+F5`", "Detener el programa"]
          ]
        },
        {
          t: "aviso",
          tipo: "clave",
          md: "**Cómo leer un error**: lee el mensaje **entero y despacio** (tipo de error, mensaje y primera línea de **tu** código en la traza). El 80 % de las veces te dice dónde está el problema. Primero entiende el mensaje y después busca en el código, **no al revés**."
        },
        {
          t: "texto",
          md: `### Documentación
- **Cabecera**: al principio de cada archivo, qué hace el programa, quién lo escribió y la fecha.
- **Comenta el porqué**: \`if (dias >= 7)\` se entiende solo; \`// semana completa: 15 % de descuento\` explica la **regla de negocio**.
- **Documenta los casos que descartas**: «se ignoran los importes negativos».
- **Documenta las pruebas**: la tabla de casos forma parte de la documentación. Entregarla junto al programa demuestra qué has comprobado.
- **Javadoc**: los comentarios \`/** ... */\` antes de clases y métodos se convierten en páginas web con la herramienta \`javadoc\`: \`javadoc -d docs -encoding UTF-8 src/Tarifa.java\`. Con \`@param\` y \`@return\` se documentan los datos que recibe y devuelve un método (lo practicarás en la UT4).`
        },
        {
          t: "abierta",
          p: "Tienes que probar un programa que calcula el precio de un alquiler con estas reglas: **menos de 3 días no hay descuento, de 3 a 6 hay un 5 %, de 7 en adelante un 15 %**. Escribe los **casos de prueba** que harías (al menos 7, indicando si son típicos, límite o inválidos y el resultado esperado).",
          modelo: `Típicos: 1 día → sin descuento; 5 días → 5 %; 10 días → 15 %.
Límite: 2 días → sin descuento (último del tramo bajo); 3 días → 5 % (primero del medio); 6 días → 5 % (último del medio); 7 días → 15 % (primero del alto).
Inválidos: 0 días → error o mensaje; −4 días → error o mensaje; un texto como «tres» → mensaje de dato no numérico.`,
          rubrica: [
            "Incluye casos típicos de los tres tramos",
            "Incluye los cuatro valores límite (2, 3, 6, 7)",
            "Incluye al menos un caso inválido (0, negativo o texto)",
            "Indica el resultado esperado de cada caso"
          ],
          minPalabras: 40
        },
        {
          t: "profundizar",
          titulo: "¿Qué son las pruebas automáticas y por qué no basta con probar a mano?",
          bloques: [
            {
              t: "texto",
              md: "Probar a mano funciona hoy, pero **mañana** cambias algo y no vuelves a probar los 20 casos. Una **prueba automática** (con JUnit, que verás en Entornos de desarrollo) es un programa que ejecuta tus casos y compara resultados en segundos, **cada vez** que cambias el código. Es la red de seguridad que permite modificar un programa grande sin romperlo. Los casos de prueba que diseñas aquí a mano son exactamente los que luego automatizarás."
            }
          ]
        },
        {
          t: "profundizar",
          titulo: "¿Qué es la depuración «del patito de goma»?",
          bloques: [
            {
              t: "texto",
              md: "Consiste en **explicar tu código en voz alta, línea a línea, a un patito de goma** (o a un compañero). Al verbalizar lo que *crees* que hace cada línea, descubres lo que *realmente* hace. Parece una broma y la usan programadores profesionales: funciona porque te obliga a dejar de «leer en diagonal» y seguir el programa con la misma disciplina que una tabla de seguimiento."
            }
          ]
        },
        {
          t: "aviso",
          tipo: "pro",
          md: "Dos hábitos que distinguen a un profesional: (1) **escribe la prueba antes del código** cuando puedas (*test-driven development*), porque te obliga a definir qué es «correcto» antes de programar; (2) **cuando arregles un error, añade el caso de prueba que lo habría detectado**. Así el mismo fallo no vuelve nunca.",
          modo: "pro"
        },
        {
          t: "reto",
          titulo: "Plan de pruebas y depuración del ticket",
          p: `Este programa calcula el **total con descuento** de un ticket (entrada: \`n p\`, es decir, \`n\` productos de \`p\` euros cada uno): **10 o más** productos → 12 %; **más de 3** → 5 %; y el total mínimo de pago es **1 euro**. Tiene **dos errores lógicos** ocultos. Encuéntralos y corrígelos usando estos casos:

\`n=3, p=10 → 30,00\` · \`n=4, p=10 → 38,00\` · \`n=10, p=10 → 88,00\` · \`n=1, p=0,5 → 1,00\``,
          requisitos: [
            "Primer error: un valor límite (`>` en lugar de `>=`)",
            "Segundo error: una asignación que no hace nada (`total = total`)",
            "Tras corregir, **todos** los casos de la tabla pasan"
          ],
          inicial: `import java.util.Scanner;

public class TicketDescuento {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int n = teclado.nextInt();
        double p = teclado.nextDouble();
        double total = n * p;
        if (n > 10) {
            total = total * 0.88;
        } else if (n > 3) {
            total = total * 0.95;
        }
        if (total < 1) {
            total = total;
        }
        System.out.printf("%.2f%n", total);
    }
}`,
          tests: [
            {
              in: `3 10
`,
              out: "30,00"
            },
            {
              in: `4 10
`,
              out: "38,00"
            },
            {
              in: `10 10
`,
              out: "88,00"
            },
            {
              in: `1 0,5
`,
              out: "1,00"
            },
            {
              in: `9 10
`,
              out: "85,50"
            }
          ],
          pistas: [
            "Prueba `n = 10, p = 10` en el código original: el 12 % no se aplica. ¿Por qué?",
            "Lee la última condición: ¿qué hace `total = total;`?"
          ],
          solucion: `import java.util.Scanner;

public class TicketDescuento {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int n = teclado.nextInt();
        double p = teclado.nextDouble();
        double total = n * p;
        if (n >= 10) {
            total = total * 0.88;
        } else if (n > 3) {
            total = total * 0.95;
        }
        if (total < 1) {
            total = 1;
        }
        System.out.printf("%.2f%n", total);
    }
}`,
          rubrica: [
            "Describiste cada error con tus palabras: qué esperabas, qué pasó y por qué",
            "Añadiste un caso de prueba nuevo que habría detectado cada error"
          ],
          modo: "pro"
        }
      ],
      tutor: {
        intro: "Última sección: **prueba, depuración y documentación**.",
        inicial: [
          {
            p: "Un programa compila y no da errores, pero el descuento sale mal. ¿Qué tipo de error es?",
            o: ["De sintaxis", "De ejecución", "Lógico", "De compilación"],
            c: 2,
            e: "Funciona pero da un resultado incorrecto: error lógico."
          },
          {
            p: "¿Qué son los valores límite?",
            o: [
              "Los valores más grandes que cabe en un `int`",
              "Los que están justo a ambos lados del borde de cada tramo",
              "Los valores inválidos",
              "Los valores por defecto"
            ],
            c: 1,
            e: "Ahí se esconden los errores de `<` frente a `<=`."
          },
          {
            p: "¿Qué comentario aporta más?",
            o: [
              "`i++; // suma uno`",
              "`// 7 días o más: tarifa semanal pactada con el club`",
              "`// bucle`",
              "`// fin`"
            ],
            c: 1,
            e: "Explica el porqué de una regla de negocio."
          }
        ],
        pasos: [
          {
            titulo: "Tipos de errores y casos de prueba",
            cubre: [0, 1],
            explica: "Sintaxis (no compila), ejecución (excepción) y **lógicos** (resultado incorrecto, los más peligrosos). Para cazar los lógicos: casos **típicos**, **límite** (en los bordes) e **inválidos**, decidiendo el resultado **antes** de ejecutar.",
            pregunta: {
              p: "Para un descuento que empieza en 7 días, ¿qué valores límite pruebas?",
              o: ["1 y 10", "6 y 7", "0 y 100", "7 y 8"],
              c: 1,
              e: "6 (último sin descuento) y 7 (primero con descuento).",
              pista: "Los dos lados del borde."
            }
          },
          {
            titulo: "Depuración y documentación",
            cubre: [2],
            explica: "Depurar con método: reproducir, localizar, hipótesis, corregir **una** cosa y volver a probar. Con el depurador de VS Code: punto de ruptura, F5, F10/F11. Documenta el **porqué**, las pruebas y usa Javadoc en clases y métodos.",
            pregunta: {
              p: "¿Qué tecla hace *step over* en el depurador de VS Code?",
              o: ["F5", "F10", "F11", "Shift+F5"],
              c: 1,
              e: "F10 ejecuta la línea actual sin entrar en métodos."
            }
          }
        ],
        reto: {
          p: `
 **Reto final.** Este programa debería mostrar \`Aprobado\` con una nota de 5 o más y \`Suspenso\` con menos, pero con un 5 muestra \`Suspenso\`. Corrige el error lógico. (Entrada: \`5\` → \`Aprobado\`.)
 `,
          inicial: `
 import java.util.Scanner;

 public class Nota {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int nota = teclado.nextInt();
         if (nota > 5) {
             System.out.println("Aprobado");
         } else {
             System.out.println("Suspenso");
         }
     }
 }
 `,
          tests: [
            {
              in: `5
`,
              out: "Aprobado"
            },
            {
              in: `4
`,
              out: "Suspenso"
            },
            {
              in: `10
`,
              out: "Aprobado"
            }
          ],
          solucion: `
 import java.util.Scanner;

 public class Nota {
     public static void main(String[] args) {
         Scanner teclado = new Scanner(System.in);
         int nota = teclado.nextInt();
         if (nota >= 5) {
             System.out.println("Aprobado");
         } else {
             System.out.println("Suspenso");
         }
     }
 }
 `,
          pistas: ["Es un valor límite: ¿incluye el 5 la condición actual?"]
        }
      }
    }

  ],

  /* ============ BANCO DE PREGUNTAS PARA LA AUTOEVALUACIÓN (+1 / −1/3 / 0) ============ */
  banco: [
    {
      sec: "ut3-if",
      p: "¿Qué es una estructura de selección?",
      o: [
        "Una que repite instrucciones",
        "Una que elige qué instrucciones se ejecutan según una condición",
        "Una que captura errores",
        "Una que importa clases"
      ],
      c: 1,
      e: "Elige un camino según una condición."
    },
    {
      sec: "ut3-if",
      p: "¿Qué tipo debe tener la condición de un `if`?",
      o: ["`int`", "`String`", "`boolean`", "Cualquiera"],
      c: 2,
      e: "La condición es siempre un `boolean`."
    },
    {
      sec: "ut3-if",
      p: `¿Qué muestra?
\`\`\`
int n = 5;
if (n > 3) {
    System.out.println("A");
} else if (n > 1) {
    System.out.println("B");
} else {
    System.out.println("C");
}
\`\`\``,
      o: ["A", "B", "C", "A / B"],
      c: 0,
      e: "Solo se ejecuta la primera rama cierta.",
      salida: "A"
    },
    {
      sec: "ut3-if",
      p: `¿Qué muestra?
\`\`\`
int n = 2;
if (n > 3) System.out.println("A");
else if (n > 1) System.out.println("B");
else System.out.println("C");
\`\`\``,
      o: ["A", "B", "C", "B / C"],
      c: 1,
      e: "`2 > 3` es falso y `2 > 1` es cierto.",
      salida: "B"
    },
    {
      sec: "ut3-if",
      p: `¿Qué muestra? (Fíjate en que no hay llaves.)
\`\`\`
int stock = 5;
if (stock == 0)
    System.out.println("X");
    System.out.println("Y");
\`\`\``,
      o: ["Nada", "X", "Y", "X / Y"],
      c: 2,
      e: "Sin llaves, solo la primera instrucción depende del `if`. La segunda se ejecuta siempre.",
      salida: "Y"
    },
    {
      sec: "ut3-if",
      p: "¿Qué ocurre con `if (stock = 0)`?",
      o: ["Compara con 0", "Error de compilación", "Asigna 0 y entra", "Funciona igual que `==`"],
      c: 1,
      e: "`=` asigna un `int`; el `if` necesita un `boolean`."
    },
    {
      sec: "ut3-if",
      p: "¿Qué hace un `;` tras `if (cond)`?",
      o: [
        "Nada",
        "El `if` controla una instrucción vacía y el bloque siguiente se ejecuta siempre",
        "Error de compilación",
        "Acelera el programa"
      ],
      c: 1,
      e: "Error lógico muy traicionero."
    },
    {
      sec: "ut3-if",
      p: "¿Cómo se comparan correctamente dos `String` en un `if`?",
      o: ["`a == b`", "`a.equals(b)`", "`a = b`", "`a.same(b)`"],
      c: 1,
      e: "`equals` compara contenido."
    },
    {
      sec: "ut3-if",
      p: "Una cadena `else if` evalúa las condiciones…",
      o: ["De abajo arriba", "De arriba abajo y ejecuta solo la primera cierta", "Todas siempre", "Al azar"],
      c: 1,
      e: "Por eso importa el orden."
    },
    {
      sec: "ut3-if",
      p: "Descuento por días y descuento de socio son independientes y se suman. ¿Qué estructura usas?",
      o: ["Una sola cadena `else if`", "Dos `if` separados", "Un `switch`", "Un `do-while`"],
      c: 1,
      e: "Si son independientes, `if` separados; si son excluyentes, `else if`."
    },
    {
      sec: "ut3-if",
      p: `¿Qué muestra?
\`\`\`
int x = 10;
if (x > 5) { System.out.println("A"); }
if (x > 8) { System.out.println("B"); }
\`\`\``,
      o: ["A", "B", "A / B", "Nada"],
      c: 2,
      e: "Son dos `if` independientes: ambos se cumplen.",
      salida: `A
B`
    },
    {
      sec: "ut3-if",
      p: `¿Qué muestra?
\`\`\`
int x = 10;
if (x > 5) { System.out.println("A"); }
else if (x > 8) { System.out.println("B"); }
\`\`\``,
      o: ["A", "B", "A / B", "Nada"],
      c: 0,
      e: "En `else if` solo se ejecuta una rama.",
      salida: "A"
    },
    {
      sec: "ut3-if",
      p: "`!(stock > 0 && esSocio)` equivale a…",
      o: [
        "`stock <= 0 || !esSocio`",
        "`stock <= 0 && !esSocio`",
        "`stock < 0 || esSocio`",
        "`stock > 0 || esSocio`"
      ],
      c: 0,
      e: "Ley de De Morgan.",
      nivel: "pro"
    },
    {
      sec: "ut3-if",
      p: "¿Cómo se comparan dos `double` con seguridad?",
      o: ["Con `==`", "Con `Math.abs(a - b) < tolerancia`", "Con `equals`", "No se pueden comparar"],
      c: 1,
      e: "Con una tolerancia (ε).",
      nivel: "pro"
    },
    {
      sec: "ut3-switch",
      p: "¿Con cuál de estos tipos **no** se puede usar `switch`?",
      o: ["`int`", "`String`", "`double`", "`char`"],
      c: 2,
      e: "No admite `double` ni `boolean`."
    },
    {
      sec: "ut3-switch",
      p: "¿Qué hace `case 3, 4 ->`?",
      o: ["Error de sintaxis", "Agrupa los valores 3 y 4", "Compara con 34", "Suma 3 y 4"],
      c: 1,
      e: "Las comas agrupan valores."
    },
    {
      sec: "ut3-switch",
      p: `¿Qué muestra?
\`\`\`
int d = 3;
switch (d) {
    case 1 -> System.out.println("A");
    case 2, 3 -> System.out.println("B");
    default -> System.out.println("C");
}
\`\`\``,
      o: ["A", "B", "C", "B / C"],
      c: 1,
      e: "El 3 está en el segundo caso.",
      salida: "B"
    },
    {
      sec: "ut3-switch",
      p: `¿Qué muestra? (switch clásico sin break.)
\`\`\`
int d = 1;
switch (d) {
    case 1:
        System.out.println("A");
    case 2:
        System.out.println("B");
        break;
    default:
        System.out.println("C");
}
\`\`\``,
      o: ["A", "A / B", "B", "A / B / C"],
      c: 1,
      e: "Sin `break` cae al caso siguiente (fall-through).",
      salida: `A
B`
    },
    {
      sec: "ut3-switch",
      p: `¿Qué muestra?
\`\`\`
char t = 'M';
String r = switch (t) {
    case 'S' -> "pequena";
    case 'M', 'L' -> "media o grande";
    default -> "otra";
};
System.out.println(r);
\`\`\``,
      o: ["pequena", "media o grande", "otra", "Error"],
      c: 1,
      e: "La `M` coincide con el segundo caso.",
      salida: "media o grande"
    },
    {
      sec: "ut3-switch",
      p: "¿Cuándo es mejor `if` que `switch`?",
      o: ["Cuando hay rangos o condiciones complejas", "Cuando hay valores concretos", "Nunca", "Siempre"],
      c: 0,
      e: "`switch` solo compara valores concretos; los rangos requieren `if`."
    },
    {
      sec: "ut3-switch",
      p: "¿Para qué sirve `yield` en un `switch` con valor?",
      o: [
        "Para salir del programa",
        "Para devolver el valor desde un bloque de varias instrucciones",
        "Para repetir el caso",
        "Para declarar variables"
      ],
      c: 1,
      e: "Es el valor que devuelve el caso con llaves.",
      nivel: "pro"
    },
    {
      sec: "ut3-switch",
      p: "Con un `switch` sobre un `String` con valor `null`, ¿qué ocurre?",
      o: ["Entra en `default`", "Lanza `NullPointerException`", "No hace nada", "Error de compilación"],
      c: 1,
      e: "No se puede comparar `null` con los casos.",
      nivel: "pro"
    },
    {
      sec: "ut3-bucles",
      p: "¿Cuántas veces se ejecuta el cuerpo de `for (int i = 0; i < 5; i++)`?",
      o: ["4", "5", "6", "Infinitas"],
      c: 1,
      e: "i = 0, 1, 2, 3, 4."
    },
    {
      sec: "ut3-bucles",
      p: "¿Qué bucle se ejecuta **al menos una vez**?",
      o: ["`for`", "`while`", "`do-while`", "Ninguno"],
      c: 2,
      e: "Evalúa la condición al final."
    },
    {
      sec: "ut3-bucles",
      p: `¿Cuánto vale \`s\` al terminar?
\`\`\`
int s = 0;
for (int i = 1; i <= 4; i++) {
    s += i;
}
System.out.println(s);
\`\`\``,
      o: ["4", "10", "6", "15"],
      c: 1,
      e: "1 + 2 + 3 + 4.",
      salida: "10"
    },
    {
      sec: "ut3-bucles",
      p: `¿Qué muestra?
\`\`\`
int i = 3;
while (i > 0) {
    System.out.print(i + " ");
    i--;
}
\`\`\``,
      o: ["`3 2 1 `", "`1 2 3 `", "`3 2 1 0 `", "Nada"],
      c: 0,
      e: "Cuenta atrás hasta que `i > 0` es falso.",
      salida: "3 2 1 "
    },
    {
      sec: "ut3-bucles",
      p: `¿Cuántas líneas muestra?
\`\`\`
int c = 0;
for (int i = 0; i < 10; i += 3) {
    c++;
}
System.out.println(c);
\`\`\``,
      o: ["3", "4", "10", "9"],
      c: 1,
      e: "i = 0, 3, 6, 9: cuatro vueltas.",
      salida: "4"
    },
    {
      sec: "ut3-bucles",
      p: `¿Qué muestra?
\`\`\`
int n = 10;
while (n < 5) {
    System.out.println("dentro");
    n++;
}
System.out.println("fuera");
\`\`\``,
      o: ["dentro / fuera", "fuera", "dentro", "Nada"],
      c: 1,
      e: "La condición es falsa desde el principio: el cuerpo no se ejecuta.",
      salida: "fuera"
    },
    {
      sec: "ut3-bucles",
      p: `¿Qué muestra?
\`\`\`
int n = 10;
do {
    System.out.println("dentro");
    n++;
} while (n < 5);
System.out.println("fuera");
\`\`\``,
      o: ["dentro / fuera", "fuera", "dentro", "Nada"],
      c: 0,
      e: "`do-while` ejecuta el cuerpo al menos una vez.",
      salida: `dentro
fuera`
    },
    {
      sec: "ut3-bucles",
      p: "¿Qué provoca un bucle infinito?",
      o: [
        "Una condición que nunca llega a ser falsa",
        "Usar demasiadas variables",
        "Usar `int`",
        "Un `;` al final de una línea cualquiera"
      ],
      c: 0,
      e: "Algo del bloque tiene que hacer falsa la condición."
    },
    {
      sec: "ut3-bucles",
      p: "¿Qué hace `for (int i = 0; i < 3; i++);` (con `;` al final)?",
      o: [
        "Repite 3 veces la instrucción siguiente",
        "Repite una instrucción vacía; la siguiente se ejecuta una vez",
        "Error de compilación",
        "Bucle infinito"
      ],
      c: 1,
      e: "El `;` es el cuerpo vacío."
    },
    {
      sec: "ut3-bucles",
      p: "Quieres pedir una contraseña y repetir hasta que sea correcta. ¿Qué bucle es el más natural?",
      o: ["`for`", "`while`", "`do-while`", "`switch`"],
      c: 2,
      e: "Hay que pedirla al menos una vez."
    },
    {
      sec: "ut3-bucles",
      p: "¿Qué es una tabla de seguimiento?",
      o: [
        "Una tabla de la base de datos",
        "Anotar el valor de las variables en cada vuelta de un bucle",
        "Una tabla de casos de prueba",
        "Un tipo de bucle"
      ],
      c: 1,
      e: "Sirve para entender y depurar bucles a mano."
    },
    {
      sec: "ut3-bucles",
      p: "¿Por qué es mala idea `for (double x = 0; x != 1; x += 0.1)`?",
      o: [
        "Porque no compila",
        "Porque `x` nunca vale exactamente 1 y el bucle no termina",
        "Porque `double` no se puede incrementar",
        "Porque es muy lento"
      ],
      c: 1,
      e: "Los `double` acumulan error de precisión.",
      nivel: "pro"
    },
    {
      sec: "ut3-patrones",
      p: "¿Con qué valor se inicializa un acumulador que **multiplica**?",
      o: ["0", "1", "-1", "El primer dato"],
      c: 1,
      e: "El elemento neutro del producto es 1."
    },
    {
      sec: "ut3-patrones",
      p: "¿Qué es un centinela?",
      o: [
        "Un tipo de bucle",
        "Un valor especial que indica el final de la entrada",
        "Una variable `boolean`",
        "Una excepción"
      ],
      c: 1,
      e: "Por ejemplo, «escribe 0 para terminar»."
    },
    {
      sec: "ut3-patrones",
      p: "¿Qué patrón usarías para saber **si algún** producto está agotado?",
      o: ["Contador", "Acumulador", "Bandera", "Centinela"],
      c: 2,
      e: "Una variable `boolean` que cambia cuando ocurre algo."
    },
    {
      sec: "ut3-patrones",
      p: `¿Qué muestra?
\`\`\`
int pares = 0;
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        pares++;
    }
}
System.out.println(pares);
\`\`\``,
      o: ["5", "10", "4", "6"],
      c: 0,
      e: "2, 4, 6, 8, 10.",
      salida: "5"
    },
    {
      sec: "ut3-patrones",
      p: `¿Cuántos asteriscos se imprimen?
\`\`\`
int c = 0;
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
        c++;
    }
}
System.out.println(c);
\`\`\``,
      o: ["7", "12", "3", "4"],
      c: 1,
      e: "3 × 4 = 12.",
      salida: "12"
    },
    {
      sec: "ut3-patrones",
      p: `¿Qué muestra?
\`\`\`
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print(j);
    }
    System.out.println();
}
\`\`\``,
      o: ["1 / 12 / 123", "123 / 123 / 123", "1 / 1 / 1", "111 / 22 / 3"],
      c: 0,
      e: "La fila `i` muestra de 1 a `i`.",
      salida: `1
12
123`
    },
    {
      sec: "ut3-patrones",
      p: "¿Por qué el mínimo no se inicializa en 0?",
      o: [
        "Porque 0 no es un `int`",
        "Porque si todos los datos son positivos, el mínimo quedaría en un 0 falso",
        "Porque no se puede",
        "Por estilo"
      ],
      c: 1,
      e: "Se inicializa con el primer dato real."
    },
    {
      sec: "ut3-patrones",
      p: "Antes de calcular una media con un acumulador y un contador, ¿qué hay que comprobar?",
      o: ["Que el acumulador sea `double`", "Que el contador no sea 0", "Que haya un `switch`", "Nada"],
      c: 1,
      e: "Si no hay datos, dividir por 0 daría error o `NaN`."
    },
    {
      sec: "ut3-patrones",
      p: "¿Cuántas veces ejecuta el cuerpo del bucle interior un exterior de 6 vueltas y un interior de 7?",
      o: ["13", "42", "7", "6"],
      c: 1,
      e: "6 × 7."
    },
    {
      sec: "ut3-patrones",
      p: "¿Cómo se escribe «repite hasta que termine» con un `while`?",
      o: [
        "Con una condición verdadera mientras NO se haya terminado: `while (!terminado)`",
        "Con `break` siempre",
        "Con `switch`",
        "No se puede"
      ],
      c: 0,
      e: "La condición del `while` es de continuar, no de salir.",
      nivel: "pro"
    },
    {
      sec: "ut3-saltos",
      p: "¿Qué hace `continue`?",
      o: ["Sale del bucle", "Salta a la siguiente iteración", "Termina el programa", "Repite la vuelta"],
      c: 1,
      e: "Abandona la vuelta actual."
    },
    {
      sec: "ut3-saltos",
      p: "¿Qué hace `break` en un `for`?",
      o: ["Salta una vuelta", "Sale inmediatamente del bucle", "Pausa el programa", "Reinicia el bucle"],
      c: 1,
      e: "Sale del bucle."
    },
    {
      sec: "ut3-saltos",
      p: `¿Qué muestra?
\`\`\`
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;
    }
    System.out.print(i);
}
\`\`\``,
      o: ["12", "1245", "12345", "123"],
      c: 1,
      e: "`continue` se salta el 3.",
      salida: "1245"
    },
    {
      sec: "ut3-saltos",
      p: `¿Qué muestra?
\`\`\`
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        break;
    }
    System.out.print(i);
}
\`\`\``,
      o: ["12", "1245", "12345", "123"],
      c: 0,
      e: "`break` sale cuando `i == 3`.",
      salida: "12"
    },
    {
      sec: "ut3-saltos",
      p: "Con bucles anidados, `break` sin etiqueta…",
      o: [
        "Sale de todos los bucles",
        "Sale solo del bucle más interno",
        "Salta una vuelta",
        "Termina el programa"
      ],
      c: 1,
      e: "Solo del más interno."
    },
    {
      sec: "ut3-saltos",
      p: "¿Para qué sirve `while (true)` con un `break`?",
      o: [
        "Para un bucle infinito sin salida",
        "Para repetir hasta que se cumpla una condición interna de salida",
        "Para evitar `Scanner`",
        "Para saltar una vuelta"
      ],
      c: 1,
      e: "Un bucle infinito a propósito con salida controlada."
    },
    {
      sec: "ut3-saltos",
      p: "¿Qué sentencia sale de un **método** completo?",
      o: ["`break`", "`continue`", "`return`", "`exit`"],
      c: 2,
      e: "Lo verás en la UT4.",
      nivel: "pro"
    },
    {
      sec: "ut3-excepciones",
      p: "¿Qué indica la primera línea de una traza de excepción?",
      o: ["Dónde ocurrió", "Qué tipo de error ocurrió", "Quién lo causó", "Cómo arreglarlo"],
      c: 1,
      e: "El tipo de excepción y a veces un mensaje."
    },
    {
      sec: "ut3-excepciones",
      p: "¿Cuándo se ejecuta `finally`?",
      o: ["Solo si hay excepción", "Solo si no hay excepción", "Siempre", "Nunca"],
      c: 2,
      e: "Siempre, haya o no error."
    },
    {
      sec: "ut3-excepciones",
      p: "¿Qué excepción lanza `Integer.parseInt(\"12a\")`?",
      o: [
        "`ArithmeticException`",
        "`NumberFormatException`",
        "`NullPointerException`",
        "`InputMismatchException`"
      ],
      c: 1,
      e: "El texto no tiene formato numérico."
    },
    {
      sec: "ut3-excepciones",
      p: "¿Qué excepción lanza `5 / 0` con enteros?",
      o: [
        "`ArithmeticException`",
        "`NumberFormatException`",
        "Ninguna: da `Infinity`",
        "`NullPointerException`"
      ],
      c: 0,
      e: "División entera entre cero."
    },
    {
      sec: "ut3-excepciones",
      p: `¿Qué muestra?
\`\`\`
try {
    System.out.println("A");
    int x = 5 / 0;
    System.out.println("B");
} catch (ArithmeticException e) {
    System.out.println("C");
} finally {
    System.out.println("D");
}
\`\`\``,
      o: ["A / B / C / D", "A / C / D", "A / D", "A / B / D"],
      c: 1,
      e: "B no llega a mostrarse: la excepción salta al `catch`.",
      salida: `A
C
D`
    },
    {
      sec: "ut3-excepciones",
      p: `¿Qué muestra?
\`\`\`
try {
    System.out.println("A");
} catch (Exception e) {
    System.out.println("B");
} finally {
    System.out.println("C");
}
\`\`\``,
      o: ["A", "A / C", "A / B / C", "B / C"],
      c: 1,
      e: "Sin error: el `catch` se salta pero `finally` se ejecuta.",
      salida: `A
C`
    },
    {
      sec: "ut3-excepciones",
      p: `¿Qué vale \`r\` al terminar?
\`\`\`
String r = "inicio";
try {
    Integer.parseInt("x");
    r = "bien";
} catch (NumberFormatException e) {
    r = "mal";
}
System.out.println(r);
\`\`\``,
      o: ["inicio", "bien", "mal", "Error"],
      c: 2,
      e: "La excepción salta al `catch` y `r = \"bien\"` nunca se ejecuta.",
      salida: "mal"
    },
    {
      sec: "ut3-excepciones",
      p: "¿Qué excepciones obliga el compilador a tratar?",
      o: [
        "Las que cuelgan de `RuntimeException`",
        "Las comprobadas (el resto de `Exception`)",
        "Los `Error`",
        "Ninguna"
      ],
      c: 1,
      e: "Las comprobadas: `try-catch` o `throws`."
    },
    {
      sec: "ut3-excepciones",
      p: "¿Qué `catch` debe ir primero?",
      o: ["El más general", "El más concreto", "Da igual", "El de `Exception`"],
      c: 1,
      e: "Si el general va primero, el concreto no se alcanza y el compilador da error."
    },
    {
      sec: "ut3-excepciones",
      p: "¿Qué hace `throw new IllegalArgumentException(\"x\")`?",
      o: ["Captura una excepción", "Provoca una excepción", "Declara una excepción", "Ignora una excepción"],
      c: 1,
      e: "`throw` lanza una excepción."
    },
    {
      sec: "ut3-excepciones",
      p: "Tras un `nextInt()` que falla por texto no numérico, ¿qué hay que hacer antes de reintentar?",
      o: ["Nada", "Descartar la línea con `nextLine()`", "Cerrar el `Scanner`", "Llamar a `System.gc()`"],
      c: 1,
      e: "El texto incorrecto sigue en el teclado y provocaría un bucle infinito."
    },
    {
      sec: "ut3-excepciones",
      p: "¿Por qué es mala práctica un `catch` vacío?",
      o: ["Porque no compila", "Porque esconde el error", "Porque es lento", "Porque lo prohíbe Java"],
      c: 1,
      e: "Hace casi imposible encontrar el fallo."
    },
    {
      sec: "ut3-excepciones",
      p: "¿Qué ventaja tiene `try-with-resources`?",
      o: [
        "Es más rápido",
        "Cierra el recurso automáticamente",
        "Evita todas las excepciones",
        "Permite `catch` vacío"
      ],
      c: 1,
      e: "Cierra el recurso haya o no error."
    },
    {
      sec: "ut3-excepciones",
      p: `¿Qué muestra?
\`\`\`
System.out.println(5.0 / 0);
\`\`\``,
      o: ["Infinity", "0", "Un error de ejecución", "NaN"],
      c: 0,
      e: "Con decimales no hay excepción: da `Infinity`.",
      nivel: "pro",
      salida: "Infinity"
    },
    {
      sec: "ut3-excepciones",
      p: "¿De qué tipo es una excepción propia declarada `extends Exception`?",
      o: ["No comprobada", "Comprobada", "Un `Error`", "Un `Throwable` raro"],
      c: 1,
      e: "No cuelga de `RuntimeException`: es comprobada.",
      nivel: "pro"
    },
    {
      sec: "ut3-aserciones",
      p: "¿Qué ocurre con `assert x > 0;` sin `-ea`?",
      o: ["Se evalúa siempre", "Se ignora por completo", "Error de compilación", "Se evalúa si x es positivo"],
      c: 1,
      e: "Están desactivadas por defecto."
    },
    {
      sec: "ut3-aserciones",
      p: "¿Qué opción activa las aserciones?",
      o: ["`-assert`", "`-ea`", "`-debug`", "`-on`"],
      c: 1,
      e: "`-ea`: enable assertions."
    },
    {
      sec: "ut3-aserciones",
      p: "¿Qué lanza un `assert` que falla?",
      o: ["`IllegalStateException`", "`AssertionError`", "`RuntimeException`", "`ArithmeticException`"],
      c: 1,
      e: "`AssertionError`."
    },
    {
      sec: "ut3-aserciones",
      p: "¿Para validar los datos del usuario se usa `assert`?",
      o: [
        "Sí",
        "No: puede estar desactivado y los datos externos se validan siempre",
        "Solo en `main`",
        "Solo con `-ea`"
      ],
      c: 1,
      e: "`assert` es para errores internos durante el desarrollo."
    },
    {
      sec: "ut3-aserciones",
      p: "¿Por qué un `assert` no debe tener efectos secundarios (`assert i++ > 0`)?",
      o: [
        "Porque no compila",
        "Porque el programa se comportaría distinto con y sin `-ea`",
        "Porque `i` es `int`",
        "No pasa nada"
      ],
      c: 1,
      e: "Si se desactiva, el efecto desaparece.",
      nivel: "pro"
    },
    {
      sec: "ut3-pruebas",
      p: "Un programa compila y no da errores, pero un descuento sale mal. ¿Qué error es?",
      o: ["De sintaxis", "De ejecución", "Lógico", "De compilación"],
      c: 2,
      e: "Resultado incorrecto sin aviso: lógico."
    },
    {
      sec: "ut3-pruebas",
      p: "¿Qué son los valores límite?",
      o: [
        "Los mayores de un tipo",
        "Los que están justo a ambos lados del borde de cada tramo",
        "Los valores inválidos",
        "Los valores por defecto"
      ],
      c: 1,
      e: "Ahí se esconden los errores de `<` frente a `<=`."
    },
    {
      sec: "ut3-pruebas",
      p: "Para un descuento desde 100 euros incluidos, ¿qué valores límite pruebas?",
      o: ["50 y 150", "99,99 y 100", "0 y 1000", "100 y 200"],
      c: 1,
      e: "A ambos lados del borde."
    },
    {
      sec: "ut3-pruebas",
      p: "¿Qué es depurar?",
      o: ["Escribir comentarios", "Encontrar y corregir la causa de un error", "Compilar", "Borrar código"],
      c: 1,
      e: "Con método: reproducir, localizar, hipótesis, corregir una cosa."
    },
    {
      sec: "ut3-pruebas",
      p: "¿Qué tecla de VS Code ejecuta la línea actual sin entrar en métodos (*step over*)?",
      o: ["F5", "F10", "F11", "Shift+F5"],
      c: 1,
      e: "F10."
    },
    {
      sec: "ut3-pruebas",
      p: "¿Qué conviene decidir **antes** de ejecutar un caso de prueba?",
      o: ["El resultado esperado", "El color del IDE", "El nombre de la clase", "Nada"],
      c: 0,
      e: "Si no sabes qué esperas, no estás probando."
    },
    {
      sec: "ut3-pruebas",
      p: "Tras corregir un error, ¿qué debes hacer?",
      o: ["Probar solo ese caso", "Volver a probar todos los casos", "Borrar la tabla", "Nada"],
      c: 1,
      e: "Para comprobar que no se rompió otra cosa."
    },
    {
      sec: "ut3-pruebas",
      p: "¿Qué comentario aporta más?",
      o: [
        "`i++; // suma uno`",
        "`// 7 días o más: tarifa semanal pactada con el club`",
        "`// bucle`",
        "`// fin`"
      ],
      c: 1,
      e: "Explica el porqué de una regla de negocio."
    },
    {
      sec: "ut3-pruebas",
      p: "¿Para qué sirven los comentarios Javadoc?",
      o: [
        "Para depurar",
        "Para generar documentación automática",
        "Para ocultar código",
        "Para ejecutar pruebas"
      ],
      c: 1,
      e: "La herramienta `javadoc` crea páginas web con ellos."
    },
    {
      sec: "ut3-pruebas",
      p: "¿Qué es el desarrollo guiado por pruebas (TDD)?",
      o: ["Probar al final", "Escribir la prueba antes que el código", "No probar", "Probar solo en producción"],
      c: 1,
      e: "Obliga a definir qué es correcto antes de programar.",
      nivel: "pro"
    }
  ]
});
