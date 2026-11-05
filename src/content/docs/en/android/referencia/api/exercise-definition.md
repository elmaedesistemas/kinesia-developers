---
title: ExerciseDefinition
description: An exercise's description, its form rules and the catalog.
sidebar:
  order: 3
---

```kotlin
@Serializable
public data class ExerciseDefinition
```

Everything the engine needs to know about one exercise. Plain data: JSON in, JSON out.

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

| Property | Type | |
| --- | --- | --- |
| `id` | `String` | Stable, e.g. `"elbow.flexion"`. Saved with sessions: never rename it. |
| `region` | `BodyRegion` | `NECK`, `SHOULDER`, `ELBOW`, `WRIST`, `BACK`, `HIP`, `KNEE`, `ANKLE`. |
| `view` | `CameraView` | `CameraView.SIDE` or `CameraView.FRONT`. |
| `kind` | `Kind` | How it's counted (below). |
| `primary` | [`Measure`](/en/android/referencia/api/measure/) | The main value: what gets charted and compared with the target. |
| `rules` | `List<FormRule>` | Form rules. |
| `defaultTarget` | `Double` | Target in degrees if nobody sets another. |

```kotlin
fun joints(side: BodySide): List<Joint>
```

Every joint the exercise reads, the primary measure's first.

## `Kind`

| Case | |
| --- | --- |
| `Kind.Reps(low: Double, high: Double)` | Counts when the value passes `high` and comes back below `low`. |
| `Kind.Hold(threshold: Double, seconds: Double)` | Counts when the value stays above `threshold` and steady for `seconds`. |

See [Reps and holds](/en/android/conceptos/repeticiones/).

## `FormRule`

```kotlin
@Serializable
public data class FormRule(
    val feedback: FormFeedback,
    val measure: Measure,
    val allowed: ClosedFloatingPointRange<Double>,
)
```

A condition that must hold while the rep lasts. If the joints of `measure` aren't visible, the rule isn't evaluated.

## `FormFeedback`

`KEEP_UPPER_ARM_STILL`, `KEEP_THIGH_STILL`, `KEEP_ELBOW_STRAIGHT`, `KEEP_TRUNK_UPRIGHT`, `KEEP_SHOULDERS_LEVEL`, `KEEP_KNEE_STRAIGHT`, `KEEP_HIPS_LEVEL`.

`@Serializable`: the `rawValue` is stable for translating and storing.

## `ExerciseLibrary`

| Member | |
| --- | --- |
| `val all: List<ExerciseDefinition>` | The 8 in the [catalog](/en/android/referencia/ejercicios/). |
| `val elbowFlexion`, `kneeFlexionStanding`, … | Each exercise by name. |
| `fun definition(id: String): ExerciseDefinition?` | Looks up by `id`. |
| `fun definitions(region: BodyRegion): List<ExerciseDefinition>` | Filters by region. |
| `fun decode(text: String): List<ExerciseDefinition>` | Reads a JSON array. |
| `fun encode(definitions: List<ExerciseDefinition>): String` | Writes JSON. |
