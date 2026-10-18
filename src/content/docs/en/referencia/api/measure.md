---
title: Measure and LandmarkRef
description: What can be measured on a pose and how points are named.
sidebar:
  order: 4
---

## `Measure`

```swift
public enum Measure: Sendable, Hashable, Codable
```

Something read from a pose, in degrees.

| Case | Result |
| --- | --- |
| `.angle(a:vertex:b:)` | Inner angle at `vertex`, 0…180. |
| `.flexion(a:vertex:b:)` | `180 − angle`: 0 = straight, grows as it bends. |
| `.fromVertical(from:to:)` | Segment against vertical: 0 down, 90 horizontal, 180 up. |
| `.tilt(a:b:)` | Line against level: 0 level, 90 vertical. |

```swift
func value(in pose: Pose, side: BodySide) -> Double?
func joints(for side: BodySide) -> [Joint]
```

`value` is `nil` if a joint is missing or two points coincide.

```swift
let flexion = Measure.flexion(a: "hip", vertex: "knee", b: "ankle")
flexion.value(in: pose, side: .left)   // e.g. 87.4
flexion.joints(for: .left)             // [.leftHip, .leftKnee, .leftAnkle]
```

:::note[2D coordinates]
Measures are taken in the image plane. A movement toward the camera looks shorter than it is; that's why each exercise declares its `view`, and `SetupCheck` warns if the patient isn't facing the right way.
:::

## `LandmarkRef`

```swift
public struct LandmarkRef: Sendable, Hashable, Codable, ExpressibleByStringLiteral
```

A body point relative to the exercised side, so one exercise works for both sides.

| Text | Meaning with `side = .left` |
| --- | --- |
| `"elbow"` | `.leftElbow` |
| `"opposite.shoulder"` | `.rightShoulder` |
| `"neck"` | `.neck` (midline: never changes) |

Points: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

```swift
LandmarkRef(.shoulder, opposite: true)
LandmarkRef(string: "opposite.hip")   // nil if not recognized
ref.joint(for: .right)
ref.stringValue                        // "opposite.hip"
```

In JSON it's a `String`. An unknown literal in Swift (`"elbw"`) stops execution with `preconditionFailure`; in JSON it produces a `DecodingError`.
