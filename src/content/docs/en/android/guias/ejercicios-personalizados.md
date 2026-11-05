---
title: Custom exercises
description: Define your own exercises in Kotlin or JSON, without touching the engine.
---

An exercise is an `ExerciseDefinition`: plain data. Adding one takes no logic, only a description.

## The pieces

### Side-relative points: `LandmarkRef`

An exercise is written once and works for both sides. That's why it doesn't name `RIGHT_ELBOW`, but `"elbow"` (the elbow on the exercised side) or `"opposite.shoulder"` (the shoulder on the other side).

Available points: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

### What to measure: `Measure`

| Case | Measures | Range |
| --- | --- | --- |
| `Measure.Angle(a, vertex, b)` | Inner angle at `vertex` | 0…180 |
| `Measure.Flexion(a, vertex, b)` | `180 − angle`: 0 = straight segment, grows as it bends | 0…180 |
| `Measure.FromVertical(from, to)` | Segment `from→to` against straight down | 0 down, 90 horizontal, 180 up |
| `Measure.Tilt(a, b)` | Line between two points against level | 0 level, 90 vertical |

### What form to require: `FormRule`

A measure and the range allowed while the rep lasts. If it goes out of range, the associated `FormFeedback` is emitted.

## In Kotlin

A lateral arm raise with a bent elbow (the peak is measured on the arm, the rules watch the trunk):

```kotlin
val bentArmRaise = ExerciseDefinition(
    id = "clinic.shoulder.bentArmRaise",
    region = BodyRegion.SHOULDER,
    view = CameraView.FRONT,
    kind = ExerciseDefinition.Kind.Reps(low = 25.0, high = 70.0),
    primary = Measure.FromVertical("shoulder", "elbow"),
    rules = listOf(
        FormRule(
            feedback = FormFeedback.KEEP_TRUNK_UPRIGHT,
            measure = Measure.FromVertical("shoulder", "hip"),
            allowed = 0.0..15.0,
        ),
        FormRule(
            feedback = FormFeedback.KEEP_SHOULDERS_LEVEL,
            measure = Measure.Tilt("shoulder", "opposite.shoulder"),
            allowed = 0.0..12.0,
        ),
    ),
    defaultTarget = 90.0,
)

val session = MotionSession(bentArmRaise, BodySide.LEFT)
```

:::caution[The `id` is forever]
The `id` is saved with the patient's sessions. Pick your own prefix (`"clinic.…"`) so it doesn't clash with the catalog's, and never change it once published.
:::

## In JSON

`ExerciseDefinition` is `@Serializable`. You can bundle a JSON file with the app or download it from your server:

```kotlin
val text = context.assets.open("exercises.json").bufferedReader().use { it.readText() }
val exercises = ExerciseLibrary.decode(text)
```

And to produce the JSON of an existing exercise:

```kotlin
val text = ExerciseLibrary.encode(listOf(ExerciseLibrary.elbowFlexion))
```

This is elbow flexion:

```json title="exercises.json"
[
  {
    "defaultTarget": 120,
    "id": "elbow.flexion",
    "kind": { "reps": { "high": 90, "low": 30 } },
    "primary": {
      "flexion": { "a": "shoulder", "b": "wrist", "vertex": "elbow" }
    },
    "region": "elbow",
    "rules": [
      {
        "allowed": [0, 30],
        "feedback": "keepUpperArmStill",
        "measure": { "fromVertical": { "from": "shoulder", "to": "elbow" } }
      }
    ],
    "view": "side"
  }
]
```

A hold uses `"kind": { "hold": { "threshold": 15, "seconds": 3 } }`.

:::note
An unknown point name (`"elbw"`) makes decoding fail with a clear `SerializationException`, instead of producing an exercise that never measures anything.
:::

## Choosing good thresholds

- **`low`**: a bit above rest, so standing still doesn't open attempts. 20–30° is usually enough.
- **`high`**: the minimum you consider a real rep. Below it, the movement is ignored without being rejected.
- **`defaultTarget`**: the target the app shows if the clinician doesn't set another.
- **`view`**: pick the view where the movement happens in the image plane. A flexion (forward/back) is seen from the side; an abduction (out to the side), from the front.
- **Rules**: start permissive and tune with real recordings. A rule that's too strict rejects valid reps and frustrates the patient.
