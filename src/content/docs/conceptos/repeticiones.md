---
title: Repeticiones y sostenidos
description: Cómo decide el motor que una repetición empezó, terminó y fue limpia.
---

Un ejercicio se cuenta de una de dos maneras, según su `kind`.

## Repeticiones: `.reps(low:high:)`

El paciente sale del reposo, llega lejos y vuelve. Se usan **dos umbrales** (histéresis) para que el temblor alrededor de un solo valor no cuente repeticiones falsas:

1. Cuando el valor supera `low`, empieza un **intento**.
2. Durante el intento se guarda el pico, la velocidad, la confianza y las reglas rotas.
3. Cuando el valor baja de `low`, el intento termina:
   - si el pico **nunca llegó a `high`**, se ignora (fue un movimiento pequeño);
   - si llegó, se **juzga**: limpia → `.repCompleted`, con fallas → `.repRejected`.

```text
 grados
  high ┤        ╭──╮               ╭─╮
       │       ╱    ╲             ╱   ╲
  low  ┤──────╱──────╲───╭─╮─────╱─────╲────
       │     ╱        ╲ ╱   ╲   ╱       ╲
     0 ┼────╯          ╰     ╰─╯         ╰──
            └─ cuenta ─┘ ignorada └ cuenta ┘
```

Ejemplo: la flexión de codo usa `.reps(low: 30, high: 90)`. Doblar hasta 60° y volver no cuenta; doblar hasta 125° sí, con `peak = 125`.

## Sostenidos: `.hold(threshold:seconds:)`

El paciente llega al final del rango y se queda ahí.

1. Al superar `threshold` se emite `.holdStarted` y arranca el reloj.
2. Si el valor se mueve más de `holdTolerance` (5° por defecto) respecto a donde empezó, el reloj **se reinicia** desde ahí. Así, mientras el paciente sigue subiendo, no se cuenta.
3. Cuando el valor se mantiene estable `seconds` segundos, se juzga el sostenido. Su `peak` es la **mediana** de esa ventana, no el máximo, para que un pico suelto no infle el resultado.
4. El paciente debe volver bajo `threshold` antes del siguiente.

Mientras sostiene, `snapshot.holdProgress` va de 0 a 1: úsalo para un anillo de progreso.

## Suavizado

Antes de todo, el valor principal se suaviza con una media móvil exponencial:

```text
valor = anterior + smoothing × (crudo − anterior)
```

Con `smoothing = 0.5` (por defecto) se eliminan saltos de un fotograma sin agregar retraso notable. `1` desactiva el suavizado. Se configura en `MotionSession(exercise:side:smoothing:)`.

## Reglas de forma

Cada `FormRule` es una medición con un rango permitido. En cada fotograma del intento:

- si la regla **no se puede medir** (no se ven sus articulaciones), se salta: no se castiga lo que no se ve;
- si **se rompe** `framesToCue` fotogramas seguidos (6, ~0,25 s), se emite `.formFault` **una vez por repetición**: es la corrección en vivo;
- al terminar, si una regla estuvo rota en más de `faultTolerance` de los fotogramas (20 %), la repetición se rechaza y la falla aparece en `rep.faults`.

Así una corrección breve no arruina la repetición, pero hacerla mal la mayor parte del tiempo sí.

## Lo que guarda cada repetición

| Propiedad | Significado |
| --- | --- |
| `peak` | Valor máximo (mediana de la ventana en sostenidos) |
| `duration` | De reposo a reposo; en sostenidos, el tiempo sostenido |
| `riseDuration` | Del inicio al pico |
| `returnDuration` | Del pico de vuelta al reposo (0 en sostenidos) |
| `peakVelocity` | Velocidad máxima, en grados por segundo |
| `confidence` | Confianza media del detector, 0…1, o `nil` |
| `faults` | Reglas rotas; vacío = limpia (`isClean`) |

Para ver la consistencia de una serie: `session.reps.peakSpread` da la desviación estándar de los picos.
