---
title: ExerciseDefinition
description: A descrição de um exercício, suas regras de forma e o catálogo.
sidebar:
  order: 3
---

```kotlin
@Serializable
public data class ExerciseDefinition
```

Tudo o que o motor precisa saber sobre um exercício. Dados puros: entra e sai em JSON.

```kotlin
ExerciseDefinition(
    id: String,
    region: BodyRegion,
    view: CameraView,
    kind: Kind,
    primary: Measure,
    rules: List<FormRule> = emptyList(),
    defaultTarget: Double,
)
```

| Propriedade | Tipo | |
| --- | --- | --- |
| `id` | `String` | Estável, p. ex. `"elbow.flexion"`. É salvo com as sessões: nunca o renomeie. |
| `region` | `BodyRegion` | `NECK`, `SHOULDER`, `ELBOW`, `WRIST`, `BACK`, `HIP`, `KNEE`, `ANKLE`. |
| `view` | `CameraView` | `CameraView.SIDE` ou `CameraView.FRONT`. |
| `kind` | `Kind` | Como é contado (abaixo). |
| `primary` | [`Measure`](/pt/android/referencia/api/measure/) | O valor principal: o que é exibido no gráfico e comparado com a meta. |
| `rules` | `List<FormRule>` | Regras de técnica. |
| `defaultTarget` | `Double` | Meta em graus se ninguém configurar outra. |

```kotlin
fun joints(side: BodySide): List<Joint>
```

Todas as articulações que o exercício lê, primeiro as da medição principal.

## `Kind`

| Caso | |
| --- | --- |
| `Kind.Reps(low: Double, high: Double)` | Conta quando o valor passa de `high` e volta abaixo de `low`. |
| `Kind.Hold(threshold: Double, seconds: Double)` | Conta quando o valor fica acima de `threshold` e estável por `seconds`. |

Veja [Repetições e sustentações](/pt/android/conceptos/repeticiones/).

## `FormRule`

```kotlin
@Serializable
public data class FormRule(
    val feedback: FormFeedback,
    val measure: Measure,
    val allowed: ClosedFloatingPointRange<Double>,
)
```

Uma condição que deve se manter enquanto dura a repetição. Se as articulações de `measure` não estão visíveis, a regra não é avaliada.

## `FormFeedback`

`KEEP_UPPER_ARM_STILL`, `KEEP_THIGH_STILL`, `KEEP_ELBOW_STRAIGHT`, `KEEP_TRUNK_UPRIGHT`, `KEEP_SHOULDERS_LEVEL`, `KEEP_KNEE_STRAIGHT`, `KEEP_HIPS_LEVEL`.

`@Serializable`: o `rawValue` é estável para traduzir e salvar.

## `ExerciseLibrary`

| Membro | |
| --- | --- |
| `val all: List<ExerciseDefinition>` | Os 8 do [catálogo](/pt/android/referencia/ejercicios/). |
| `val elbowFlexion`, `kneeFlexionStanding`, … | Cada exercício pelo nome. |
| `fun definition(id: String): ExerciseDefinition?` | Busca por `id`. |
| `fun definitions(region: BodyRegion): List<ExerciseDefinition>` | Filtra por região. |
| `fun decode(text: String): List<ExerciseDefinition>` | Lê um array JSON. |
| `fun encode(definitions: List<ExerciseDefinition>): String` | Escreve JSON. |
