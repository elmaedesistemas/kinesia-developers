---
title: ExerciseDefinition
description: La descripción de un ejercicio, sus reglas de forma y el catálogo.
sidebar:
  order: 3
---

```swift
public struct ExerciseDefinition: Identifiable, Sendable, Hashable, Codable
```

Todo lo que el motor necesita saber de un ejercicio. Datos puros: entra y sale en JSON.

```swift
init(
    id: String,
    region: BodyRegion,
    view: CameraView,
    kind: Kind,
    primary: Measure,
    rules: [FormRule] = [],
    defaultTarget: Double
)
```

| Propiedad | Tipo | |
| --- | --- | --- |
| `id` | `String` | Estable, p. ej. `"elbow.flexion"`. Se guarda con las sesiones: nunca lo renombres. |
| `region` | `BodyRegion` | `neck`, `shoulder`, `elbow`, `wrist`, `back`, `hip`, `knee`, `ankle`. |
| `view` | `CameraView` | `.side` o `.front`. |
| `kind` | `Kind` | Cómo se cuenta (abajo). |
| `primary` | [`Measure`](/referencia/api/measure/) | El valor principal: lo que se grafica y se compara con el objetivo. |
| `rules` | `[FormRule]` | Reglas de técnica. |
| `defaultTarget` | `Double` | Objetivo en grados si nadie configura otro. |

```swift
func joints(for side: BodySide) -> [Joint]
```

Todas las articulaciones que lee el ejercicio, primero las de la medición principal.

## `Kind`

| Caso | |
| --- | --- |
| `.reps(low: Double, high: Double)` | Cuenta cuando el valor pasa `high` y vuelve bajo `low`. |
| `.hold(threshold: Double, seconds: Double)` | Cuenta cuando el valor queda sobre `threshold` y estable durante `seconds`. |

Ver [Repeticiones y sostenidos](/conceptos/repeticiones/).

## `FormRule`

```swift
public struct FormRule: Sendable, Hashable, Codable {
    init(feedback: FormFeedback, measure: Measure, allowed: ClosedRange<Double>)
}
```

Una condición que debe cumplirse mientras dura la repetición. Si las articulaciones de `measure` no se ven, la regla no se evalúa.

## `FormFeedback`

`keepUpperArmStill`, `keepThighStill`, `keepElbowStraight`, `keepTrunkUpright`, `keepShouldersLevel`, `keepKneeStraight`, `keepHipsLevel`.

`String`, `CaseIterable`, `Codable`: el `rawValue` es estable para traducir y guardar.

## `ExerciseLibrary`

| Miembro | |
| --- | --- |
| `static let all: [ExerciseDefinition]` | Los 8 del [catálogo](/referencia/ejercicios/). |
| `static let elbowFlexion`, `kneeFlexionStanding`, … | Cada ejercicio por nombre. |
| `static func definition(id:) -> ExerciseDefinition?` | Busca por `id`. |
| `static func definitions(for: BodyRegion) -> [ExerciseDefinition]` | Filtra por región. |
| `static func decode(from: Data) throws -> [ExerciseDefinition]` | Lee un arreglo JSON. |
| `static func encode(_: [ExerciseDefinition]) throws -> Data` | Escribe JSON con claves ordenadas. |
