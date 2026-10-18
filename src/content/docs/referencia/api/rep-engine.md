---
title: RepEngine y Rep
description: El motor de conteo, sin sesión ni concurrencia.
sidebar:
  order: 5
---

## `RepEngine`

```swift
public struct RepEngine: Sendable
```

Convierte poses en repeticiones (o sostenidos) revisando la técnica. Un tipo de valor puro y síncrono: sin cámara, sin UI. `MotionSession` lo usa por dentro; úsalo directo cuando no necesites visibilidad, ubicación ni eventos asíncronos.

```swift
init(definition: ExerciseDefinition, side: BodySide)
mutating func process(_ pose: Pose) -> [MotionEvent]
mutating func reset()
```

### Ajustes

| Propiedad | Por defecto | |
| --- | --- | --- |
| `smoothing` | `0.5` | Factor de suavizado. `1` = ninguno. |
| `faultTolerance` | `0.2` | Fracción de fotogramas que puede romper una regla antes de rechazar. |
| `framesToCue` | `6` | Fotogramas malos seguidos antes de `.formFault` (~0,25 s). |
| `holdTolerance` | `5.0` | Grados que puede moverse un sostenido antes de reiniciar el reloj. |

### Estado (solo lectura)

`value`, `best`, `reps`, `rejected`, `holdProgress`, `confidence`, `count`, `peaks`.

`process` solo emite `.repCompleted`, `.repRejected`, `.holdStarted` y `.formFault`. Los eventos de visibilidad, ubicación y medición inicial los agrega `MotionSession`.

## `Rep`

```swift
public struct Rep: Sendable, Equatable
```

| Propiedad | Tipo | |
| --- | --- | --- |
| `peak` | `Double` | Máximo; en sostenidos, la mediana de la ventana. |
| `duration` | `TimeInterval` | De reposo a reposo; en sostenidos, el tiempo sostenido. |
| `riseDuration` | `TimeInterval` | Del inicio al pico. |
| `returnDuration` | `TimeInterval` | Del pico al reposo. 0 en sostenidos. |
| `peakVelocity` | `Double` | Grados por segundo. |
| `confidence` | `Double?` | Confianza media, 0…1. |
| `faults` | `Set<FormFeedback>` | Reglas rotas. |
| `isClean` | `Bool` | `faults.isEmpty`. |

```swift
extension Array where Element == Rep {
    var peakSpread: Double?   // desviación estándar de los picos; nil con menos de 2
}
```
