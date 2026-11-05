---
title: Measure e LandmarkRef
description: O que pode ser medido em uma pose e como os pontos são nomeados.
sidebar:
  order: 4
---

## `Measure`

```kotlin
@Serializable
public sealed interface Measure
```

Algo que se lê de uma pose, em graus.

| Caso | Resultado |
| --- | --- |
| `Measure.Angle(a, vertex, b)` | Ângulo interno em `vertex`, 0…180. |
| `Measure.Flexion(a, vertex, b)` | `180 − angle`: 0 = reto, cresce ao dobrar. |
| `Measure.FromVertical(from, to)` | Segmento em relação à vertical: 0 para baixo, 90 horizontal, 180 para cima. |
| `Measure.Tilt(a, b)` | Linha em relação à horizontal: 0 nivelada, 90 vertical. |

```kotlin
fun value(pose: Pose, side: BodySide): Double?
fun joints(side: BodySide): List<Joint>
```

`value` é `null` se faltar alguma articulação ou se dois pontos coincidirem.

```kotlin
val flexion = Measure.Flexion("hip", "knee", "ankle")
flexion.value(pose, BodySide.LEFT)    // p. ex. 87.4
flexion.joints(BodySide.LEFT)         // [LEFT_HIP, LEFT_KNEE, LEFT_ANKLE]
```

:::note[Coordenadas 2D]
As medições são feitas no plano da imagem. Um movimento em direção à câmera parece mais curto do que é; por isso cada exercício declara sua `view`, e o `SetupCheck` avisa se o paciente não está orientado como deveria.
:::

## `LandmarkRef`

```kotlin
@Serializable
public data class LandmarkRef(val landmark: Landmark, val isOpposite: Boolean = false)
```

Um ponto do corpo relativo ao lado exercitado, para que um exercício sirva para os dois lados.

| Texto | Significado com `side = BodySide.LEFT` |
| --- | --- |
| `"elbow"` | `Joint.LEFT_ELBOW` |
| `"opposite.shoulder"` | `Joint.RIGHT_SHOULDER` |
| `"neck"` | `Joint.NECK` (linha média: não muda) |

Pontos: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

```kotlin
LandmarkRef(LandmarkRef.Landmark.SHOULDER, isOpposite = true)
LandmarkRef.parse("opposite.hip")    // null se não for reconhecido
LandmarkRef.of("opposite.hip")       // lança IllegalArgumentException se não for reconhecido
ref.joint(BodySide.RIGHT)
ref.stringValue                      // "opposite.hip"
```

Em JSON é uma `String`. Um ponto desconhecido (`"elbw"`) lança `IllegalArgumentException` em `LandmarkRef.of` e `SerializationException` em JSON.
