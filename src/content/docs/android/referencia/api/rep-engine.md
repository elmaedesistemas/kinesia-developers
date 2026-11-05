---
title: RepEngine y Rep
description: El motor de conteo, sin sesión ni concurrencia.
sidebar:
  order: 5
---

## `RepEngine`

```kotlin
public class RepEngine
```

Convierte poses en repeticiones (o sostenidos) revisando la técnica. Una clase síncrona, sin cámara, sin UI y sin corrutinas. `MotionSession` la usa por dentro; úsala directo cuando no necesites visibilidad, ubicación ni eventos en un flujo. No es segura entre hilos: aliméntala desde uno solo.

```kotlin
RepEngine(definition: ExerciseDefinition, side: BodySide)
fun process(pose: Pose): List<MotionEvent>
fun reset()
```

### Ajustes

| Propiedad | Por defecto | |
| --- | --- | --- |
| `smoothing` | `0.5` | Factor de suavizado. `1` = ninguno. |
| `faultTolerance` | `0.2` | Fracción de fotogramas que puede romper una regla antes de rechazar. |
| `framesToCue` | `6` | Fotogramas malos seguidos antes de `FormFault` (~0,25 s). |
| `holdTolerance` | `5.0` | Grados que puede moverse un sostenido antes de reiniciar el reloj. |

### Estado (solo lectura)

`value`, `best`, `reps`, `rejected`, `holdProgress`, `confidence`, `count`, `peaks`.

`process` solo emite `RepCompleted`, `RepRejected`, `HoldStarted` y `FormFault`. Los eventos de visibilidad, ubicación y medición inicial los agrega `MotionSession`.

## `Rep`

```kotlin
public data class Rep
```

| Propiedad | Tipo | |
| --- | --- | --- |
| `peak` | `Double` | Máximo; en sostenidos, la mediana de la ventana. |
| `duration` | `Double` | De reposo a reposo; en sostenidos, el tiempo sostenido. |
| `riseDuration` | `Double` | Del inicio al pico. |
| `returnDuration` | `Double` | Del pico al reposo. 0 en sostenidos. |
| `peakVelocity` | `Double` | Grados por segundo. |
| `confidence` | `Double?` | Confianza media, 0…1. |
| `faults` | `Set<FormFeedback>` | Reglas rotas. |
| `isClean` | `Boolean` | `faults.isEmpty()`. |

```kotlin
val List<Rep>.peakSpread: Double?   // desviación estándar de los picos; null con menos de 2
```
