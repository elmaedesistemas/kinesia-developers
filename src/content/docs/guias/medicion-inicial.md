---
title: Medición inicial
description: Mide de dónde parte el paciente con la mediana de sus primeras repeticiones limpias.
---

La **medición inicial** (baseline) responde: ¿cuánto rango tiene hoy el paciente? Es la mediana de los picos de las primeras N repeticiones **limpias**. Las rechazadas no cuentan, así el punto de partida se mide con buena técnica.

## Empezar

```swift
session.startBaseline(reps: 3)   // reinicia el contador y empieza
```

Para ejercicios de sostenido cuenta sostenidos limpios en vez de repeticiones.

## Seguir el progreso

```swift
if let baseline = session.snapshot.baseline {
    Text("\(baseline.repsDone) de \(baseline.repsNeeded)")
    if let result = baseline.result {
        Text("Tu rango hoy: \(Int(result))°")
    }
}
```

O espera el evento:

```swift
for await event in session.events() {
    if case .baselineCompleted(let value) = event {
        paciente.rangoInicial = value
        objetivo = max(value + 10, ejercicio.defaultTarget)  // tu lógica
    }
}
```

## Terminar antes o cancelar

```swift
session.finishBaseline()   // termina con las limpias que haya (al menos una)
session.cancelBaseline()   // sale sin resultado y reinicia
```

`finishBaseline()` no hace nada si todavía no hay ninguna repetición limpia.

## Por qué la mediana

Con tres repeticiones de 98°, 102° y 131°, el promedio (110°) se deja arrastrar por un rebote. La mediana (102°) refleja lo que el paciente hace de forma consistente.
