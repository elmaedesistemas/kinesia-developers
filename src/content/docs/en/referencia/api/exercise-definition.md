---
title: ExerciseDefinition
description: An exercise's description, its form rules and the catalog.
sidebar:
  order: 3
---

```swift
public struct ExerciseDefinition: Identifiable, Sendable, Hashable, Codable
```

Everything the engine needs to know about one exercise. Plain data: JSON in, JSON out.

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

| Property | Type | |
| --- | --- | --- |
| `id` | `String` | Stable, e.g. `"elbow.flexion"`. Saved with sessions: never rename it. |
| `region` | `BodyRegion` | `neck`, `shoulder`, `elbow`, `wrist`, `back`, `hip`, `knee`, `ankle`. |
| `view` | `CameraView` | `.side` or `.front`. |
| `kind` | `Kind` | How it's counted (below). |
| `primary` | [`Measure`](/en/referencia/api/measure/) | The main value: what gets charted and compared with the target. |
| `rules` | `[FormRule]` | Form rules. |
| `defaultTarget` | `Double` | Target in degrees if nobody sets another. |

```swift
func joints(for side: BodySide) -> [Joint]
```

Every joint the exercise reads, the primary measure's first.

## `Kind`

| Case | |
| --- | --- |
| `.reps(low: Double, high: Double)` | Counts when the value passes `high` and comes back below `low`. |
| `.hold(threshold: Double, seconds: Double)` | Counts when the value stays above `threshold` and steady for `seconds`. |

See [Reps and holds](/en/conceptos/repeticiones/).

## `FormRule`

```swift
public struct FormRule: Sendable, Hashable, Codable {
    init(feedback: FormFeedback, measure: Measure, allowed: ClosedRange<Double>)
}
```

A condition that must hold while the rep lasts. If the joints of `measure` aren't visible, the rule isn't evaluated.

## `FormFeedback`

`keepUpperArmStill`, `keepThighStill`, `keepElbowStraight`, `keepTrunkUpright`, `keepShouldersLevel`, `keepKneeStraight`, `keepHipsLevel`.

`String`, `CaseIterable`, `Codable`: the `rawValue` is stable for translating and storing.

## `ExerciseLibrary`

| Member | |
| --- | --- |
| `static let all: [ExerciseDefinition]` | The 8 in the [catalog](/en/referencia/ejercicios/). |
| `static let elbowFlexion`, `kneeFlexionStanding`, … | Each exercise by name. |
| `static func definition(id:) -> ExerciseDefinition?` | Looks up by `id`. |
| `static func definitions(for: BodyRegion) -> [ExerciseDefinition]` | Filters by region. |
| `static func decode(from: Data) throws -> [ExerciseDefinition]` | Reads a JSON array. |
| `static func encode(_: [ExerciseDefinition]) throws -> Data` | Writes JSON with sorted keys. |
