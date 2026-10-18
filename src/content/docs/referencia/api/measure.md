---
title: Measure y LandmarkRef
description: Qué se puede medir sobre una pose y cómo se nombran los puntos.
sidebar:
  order: 4
---

## `Measure`

```swift
public enum Measure: Sendable, Hashable, Codable
```

Algo que se lee de una pose, en grados.

| Caso | Resultado |
| --- | --- |
| `.angle(a:vertex:b:)` | Ángulo interno en `vertex`, 0…180. |
| `.flexion(a:vertex:b:)` | `180 − angle`: 0 = recto, crece al doblar. |
| `.fromVertical(from:to:)` | Segmento contra la vertical: 0 abajo, 90 horizontal, 180 arriba. |
| `.tilt(a:b:)` | Línea contra la horizontal: 0 nivelada, 90 vertical. |

```swift
func value(in pose: Pose, side: BodySide) -> Double?
func joints(for side: BodySide) -> [Joint]
```

`value` es `nil` si falta alguna articulación o si dos puntos coinciden.

```swift
let flexion = Measure.flexion(a: "hip", vertex: "knee", b: "ankle")
flexion.value(in: pose, side: .left)   // p. ej. 87.4
flexion.joints(for: .left)             // [.leftHip, .leftKnee, .leftAnkle]
```

:::note[Coordenadas 2D]
Las mediciones se hacen en el plano de la imagen. Un movimiento que sale hacia la cámara se ve más corto de lo que es; por eso cada ejercicio declara su `view`, y `SetupCheck` avisa si el paciente no está orientado como corresponde.
:::

## `LandmarkRef`

```swift
public struct LandmarkRef: Sendable, Hashable, Codable, ExpressibleByStringLiteral
```

Un punto del cuerpo relativo al lado que se ejercita, para que un ejercicio sirva para ambos lados.

| Texto | Significado con `side = .left` |
| --- | --- |
| `"elbow"` | `.leftElbow` |
| `"opposite.shoulder"` | `.rightShoulder` |
| `"neck"` | `.neck` (línea media: no cambia) |

Puntos: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

```swift
LandmarkRef(.shoulder, opposite: true)
LandmarkRef(string: "opposite.hip")   // nil si no se reconoce
ref.joint(for: .right)
ref.stringValue                        // "opposite.hip"
```

En JSON es un `String`. Un literal desconocido en Swift (`"elbw"`) detiene la ejecución con `preconditionFailure`; en JSON produce un `DecodingError`.
