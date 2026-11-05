---
title: Measure and LandmarkRef
description: What can be measured on a pose and how points are named.
sidebar:
  order: 4
---

## `Measure`

```kotlin
@Serializable
public sealed interface Measure
```

Something read from a pose, in degrees.

| Case | Result |
| --- | --- |
| `Measure.Angle(a, vertex, b)` | Inner angle at `vertex`, 0…180. |
| `Measure.Flexion(a, vertex, b)` | `180 − angle`: 0 = straight, grows as it bends. |
| `Measure.FromVertical(from, to)` | Segment against vertical: 0 down, 90 horizontal, 180 up. |
| `Measure.Tilt(a, b)` | Line against level: 0 level, 90 vertical. |

```kotlin
fun value(pose: Pose, side: BodySide): Double?
fun joints(side: BodySide): List<Joint>
```

`value` is `null` if a joint is missing or two points coincide.

```kotlin
val flexion = Measure.Flexion("hip", "knee", "ankle")
flexion.value(pose, BodySide.LEFT)    // e.g. 87.4
flexion.joints(BodySide.LEFT)         // [LEFT_HIP, LEFT_KNEE, LEFT_ANKLE]
```

:::note[2D coordinates]
Measures are taken in the image plane. A movement toward the camera looks shorter than it is; that's why each exercise declares its `view`, and `SetupCheck` warns if the patient isn't facing the right way.
:::

## `LandmarkRef`

```kotlin
@Serializable
public data class LandmarkRef(val landmark: Landmark, val isOpposite: Boolean = false)
```

A body point relative to the exercised side, so one exercise works for both sides.

| Text | Meaning with `side = BodySide.LEFT` |
| --- | --- |
| `"elbow"` | `Joint.LEFT_ELBOW` |
| `"opposite.shoulder"` | `Joint.RIGHT_SHOULDER` |
| `"neck"` | `Joint.NECK` (midline: never changes) |

Points: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

```kotlin
LandmarkRef(LandmarkRef.Landmark.SHOULDER, isOpposite = true)
LandmarkRef.parse("opposite.hip")    // null if not recognized
LandmarkRef.of("opposite.hip")       // throws IllegalArgumentException if not recognized
ref.joint(BodySide.RIGHT)
ref.stringValue                      // "opposite.hip"
```

In JSON it's a `String`. An unknown point (`"elbw"`) throws `IllegalArgumentException` in `LandmarkRef.of` and `SerializationException` in JSON.
