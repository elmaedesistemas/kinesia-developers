---
title: Measure y LandmarkRef
description: Qué se puede medir sobre una pose y cómo se nombran los puntos.
sidebar:
  order: 4
---

## `Measure`

```kotlin
@Serializable
public sealed interface Measure
```

Algo que se lee de una pose, en grados.

| Caso | Resultado |
| --- | --- |
| `Measure.Angle(a, vertex, b)` | Ángulo interno en `vertex`, 0…180. |
| `Measure.Flexion(a, vertex, b)` | `180 − angle`: 0 = recto, crece al doblar. |
| `Measure.FromVertical(from, to)` | Segmento contra la vertical: 0 abajo, 90 horizontal, 180 arriba. |
| `Measure.Tilt(a, b)` | Línea contra la horizontal: 0 nivelada, 90 vertical. |

```kotlin
fun value(pose: Pose, side: BodySide): Double?
fun joints(side: BodySide): List<Joint>
```

`value` es `null` si falta alguna articulación o si dos puntos coinciden.

```kotlin
val flexion = Measure.Flexion("hip", "knee", "ankle")
flexion.value(pose, BodySide.LEFT)    // p. ej. 87.4
flexion.joints(BodySide.LEFT)         // [LEFT_HIP, LEFT_KNEE, LEFT_ANKLE]
```

:::note[Coordenadas 2D]
Las mediciones se hacen en el plano de la imagen. Un movimiento que sale hacia la cámara se ve más corto de lo que es; por eso cada ejercicio declara su `view`, y `SetupCheck` avisa si el paciente no está orientado como corresponde.
:::

## `LandmarkRef`

```kotlin
@Serializable
public data class LandmarkRef(val landmark: Landmark, val isOpposite: Boolean = false)
```

Un punto del cuerpo relativo al lado que se ejercita, para que un ejercicio sirva para ambos lados.

| Texto | Significado con `side = BodySide.LEFT` |
| --- | --- |
| `"elbow"` | `Joint.LEFT_ELBOW` |
| `"opposite.shoulder"` | `Joint.RIGHT_SHOULDER` |
| `"neck"` | `Joint.NECK` (línea media: no cambia) |

Puntos: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

```kotlin
LandmarkRef(LandmarkRef.Landmark.SHOULDER, isOpposite = true)
LandmarkRef.parse("opposite.hip")    // null si no se reconoce
LandmarkRef.of("opposite.hip")       // lanza IllegalArgumentException si no se reconoce
ref.joint(BodySide.RIGHT)
ref.stringValue                      // "opposite.hip"
```

En JSON es un `String`. Un punto desconocido (`"elbw"`) lanza `IllegalArgumentException` en `LandmarkRef.of` y `SerializationException` en JSON.
