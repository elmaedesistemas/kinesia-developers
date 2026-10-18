---
title: Measure e LandmarkRef
description: O que pode ser medido em uma pose e como os pontos são nomeados.
sidebar:
  order: 4
---

## `Measure`

```swift
public enum Measure: Sendable, Hashable, Codable
```

Algo que se lê de uma pose, em graus.

| Caso | Resultado |
| --- | --- |
| `.angle(a:vertex:b:)` | Ângulo interno em `vertex`, 0…180. |
| `.flexion(a:vertex:b:)` | `180 − angle`: 0 = reto, cresce ao dobrar. |
| `.fromVertical(from:to:)` | Segmento em relação à vertical: 0 para baixo, 90 horizontal, 180 para cima. |
| `.tilt(a:b:)` | Linha em relação à horizontal: 0 nivelada, 90 vertical. |

```swift
func value(in pose: Pose, side: BodySide) -> Double?
func joints(for side: BodySide) -> [Joint]
```

`value` é `nil` se faltar alguma articulação ou se dois pontos coincidirem.

```swift
let flexion = Measure.flexion(a: "hip", vertex: "knee", b: "ankle")
flexion.value(in: pose, side: .left)   // p. ex. 87.4
flexion.joints(for: .left)             // [.leftHip, .leftKnee, .leftAnkle]
```

:::note[Coordenadas 2D]
As medições são feitas no plano da imagem. Um movimento em direção à câmera parece mais curto do que é; por isso cada exercício declara sua `view`, e o `SetupCheck` avisa se o paciente não está orientado como deveria.
:::

## `LandmarkRef`

```swift
public struct LandmarkRef: Sendable, Hashable, Codable, ExpressibleByStringLiteral
```

Um ponto do corpo relativo ao lado exercitado, para que um exercício sirva para os dois lados.

| Texto | Significado com `side = .left` |
| --- | --- |
| `"elbow"` | `.leftElbow` |
| `"opposite.shoulder"` | `.rightShoulder` |
| `"neck"` | `.neck` (linha média: não muda) |

Pontos: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

```swift
LandmarkRef(.shoulder, opposite: true)
LandmarkRef(string: "opposite.hip")   // nil se não for reconhecido
ref.joint(for: .right)
ref.stringValue                        // "opposite.hip"
```

Em JSON é uma `String`. Um literal desconhecido em Swift (`"elbw"`) interrompe a execução com `preconditionFailure`; em JSON produz um `DecodingError`.
