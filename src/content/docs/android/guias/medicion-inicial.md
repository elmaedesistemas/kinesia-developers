---
title: Medición inicial
description: Mide de dónde parte el paciente con la mediana de sus primeras repeticiones limpias.
---

La **medición inicial** (baseline) responde: ¿cuánto rango tiene hoy el paciente? Es la mediana de los picos de las primeras N repeticiones **limpias**. Las rechazadas no cuentan, así el punto de partida se mide con buena técnica.

## Empezar

```kotlin
session.startBaseline(reps = 3)   // reinicia el contador y empieza
```

Para ejercicios de sostenido cuenta sostenidos limpios en vez de repeticiones.

## Seguir el progreso

```kotlin
val snapshot by session.snapshot.collectAsStateWithLifecycle()

snapshot.baseline?.let { baseline ->
    Text("${baseline.repsDone} de ${baseline.repsNeeded}")
    baseline.result?.let { result ->
        Text("Tu rango hoy: ${result.roundToInt()}°")
    }
}
```

O espera el evento:

```kotlin
session.events.collect { event ->
    if (event is MotionEvent.BaselineCompleted) {
        paciente.rangoInicial = event.value
        objetivo = maxOf(event.value + 10, ejercicio.defaultTarget)  // tu lógica
    }
}
```

## Terminar antes o cancelar

```kotlin
session.finishBaseline()   // termina con las limpias que haya (al menos una)
session.cancelBaseline()   // sale sin resultado y reinicia
```

`finishBaseline()` no hace nada si todavía no hay ninguna repetición limpia.

## Por qué la mediana

Con tres repeticiones de 98°, 102° y 131°, el promedio (110°) se deja arrastrar por un rebote. La mediana (102°) refleja lo que el paciente hace de forma consistente.
