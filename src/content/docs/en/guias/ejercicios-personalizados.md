---
title: Custom exercises
description: Define your own exercises in Swift or JSON, without touching the engine.
---

An exercise is an `ExerciseDefinition`: plain data. Adding one takes no logic, only a description.

## The pieces

### Side-relative points: `LandmarkRef`

An exercise is written once and works for both sides. That's why it doesn't name `rightElbow`, but `"elbow"` (the elbow on the exercised side) or `"opposite.shoulder"` (the shoulder on the other side).

Available points: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

### What to measure: `Measure`

| Case | Measures | Range |
| --- | --- | --- |
| `.angle(a:vertex:b:)` | Inner angle at `vertex` | 0…180 |
| `.flexion(a:vertex:b:)` | `180 − angle`: 0 = straight segment, grows as it bends | 0…180 |
| `.fromVertical(from:to:)` | Segment `from→to` against straight down | 0 down, 90 horizontal, 180 up |
| `.tilt(a:b:)` | Line between two points against level | 0 level, 90 vertical |

### What form to require: `FormRule`

A measure and the range allowed while the rep lasts. If it goes out of range, the associated `FormFeedback` is emitted.

## In Swift

A lateral arm raise with a bent elbow (the peak is measured on the arm, the rules watch the trunk):

```swift
let bentArmRaise = ExerciseDefinition(
    id: "clinic.shoulder.bentArmRaise",
    region: .shoulder,
    view: .front,
    kind: .reps(low: 25, high: 70),
    primary: .fromVertical(from: "shoulder", to: "elbow"),
    rules: [
        FormRule(
            feedback: .keepTrunkUpright,
            measure: .fromVertical(from: "shoulder", to: "hip"),
            allowed: 0...15
        ),
        FormRule(
            feedback: .keepShouldersLevel,
            measure: .tilt(a: "shoulder", b: "opposite.shoulder"),
            allowed: 0...12
        )
    ],
    defaultTarget: 90
)

let session = MotionSession(exercise: bentArmRaise, side: .left)
```

:::caution[The `id` is forever]
The `id` is saved with the patient's sessions. Pick your own prefix (`"clinic.…"`) so it doesn't clash with the catalog's, and never change it once published.
:::

## In JSON

`ExerciseDefinition` is `Codable`. You can bundle a JSON file with the app or download it from your server:

```swift
let data = try Data(contentsOf: url)
let exercises = try ExerciseLibrary.decode(from: data)
```

And to produce the JSON of an existing exercise:

```swift
let data = try ExerciseLibrary.encode([ExerciseLibrary.elbowFlexion])
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
An unknown point name (`"elbw"`) makes decoding fail with a clear error, instead of producing an exercise that never measures anything.
:::

## Choosing good thresholds

- **`low`**: a bit above rest, so standing still doesn't open attempts. 20–30° is usually enough.
- **`high`**: the minimum you consider a real rep. Below it, the movement is ignored without being rejected.
- **`defaultTarget`**: the target the app shows if the clinician doesn't set another.
- **`view`**: pick the view where the movement happens in the image plane. A flexion (forward/back) is seen from the side; an abduction (out to the side), from the front.
- **Rules**: start permissive and tune with real recordings. A rule that's too strict rejects valid reps and frustrates the patient.
