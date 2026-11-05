---
title: ExerciseDefinition
description: La descripción de un ejercicio, sus reglas de forma y el catálogo.
sidebar:
  order: 3
---

```kotlin
@Serializable
public data class ExerciseDefinition
```

Todo lo que el motor necesita saber de un ejercicio. Datos puros: entra y sale en JSON.

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

| Propiedad | Tipo | |
| --- | --- | --- |
| `id` | `String` | Estable, p. ej. `"elbow.flexion"`. Se guarda con las sesiones: nunca lo renombres. |
| `region` | `BodyRegion` | `NECK`, `SHOULDER`, `ELBOW`, `WRIST`, `BACK`, `HIP`, `KNEE`, `ANKLE`. |
| `view` | `CameraView` | `CameraView.SIDE` o `CameraView.FRONT`. |
| `kind` | `Kind` | Cómo se cuenta (abajo). |
| `primary` | [`Measure`](/android/referencia/api/measure/) | El valor principal: lo que se grafica y se compara con el objetivo. |
| `rules` | `List<FormRule>` | Reglas de técnica. |
| `defaultTarget` | `Double` | Objetivo en grados si nadie configura otro. |

```kotlin
fun joints(side: BodySide): List<Joint>
```

Todas las articulaciones que lee el ejercicio, primero las de la medición principal.

## `Kind`

| Caso | |
| --- | --- |
| `Kind.Reps(low: Double, high: Double)` | Cuenta cuando el valor pasa `high` y vuelve bajo `low`. |
| `Kind.Hold(threshold: Double, seconds: Double)` | Cuenta cuando el valor queda sobre `threshold` y estable durante `seconds`. |

Ver [Repeticiones y sostenidos](/android/conceptos/repeticiones/).

## `FormRule`

```kotlin
@Serializable
public data class FormRule(
    val feedback: FormFeedback,
    val measure: Measure,
    val allowed: ClosedFloatingPointRange<Double>,
)
```

Una condición que debe cumplirse mientras dura la repetición. Si las articulaciones de `measure` no se ven, la regla no se evalúa.

## `FormFeedback`

`KEEP_UPPER_ARM_STILL`, `KEEP_THIGH_STILL`, `KEEP_ELBOW_STRAIGHT`, `KEEP_TRUNK_UPRIGHT`, `KEEP_SHOULDERS_LEVEL`, `KEEP_KNEE_STRAIGHT`, `KEEP_HIPS_LEVEL`.

`@Serializable`: el `rawValue` es estable para traducir y guardar.

## `ExerciseLibrary`

| Miembro | |
| --- | --- |
| `val all: List<ExerciseDefinition>` | Los 8 del [catálogo](/android/referencia/ejercicios/). |
| `val elbowFlexion`, `kneeFlexionStanding`, … | Cada ejercicio por nombre. |
| `fun definition(id: String): ExerciseDefinition?` | Busca por `id`. |
| `fun definitions(region: BodyRegion): List<ExerciseDefinition>` | Filtra por región. |
| `fun decode(text: String): List<ExerciseDefinition>` | Lee un arreglo JSON. |
| `fun encode(definitions: List<ExerciseDefinition>): String` | Escribe JSON. |
