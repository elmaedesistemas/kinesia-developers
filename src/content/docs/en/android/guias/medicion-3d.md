---
title: 3D measurement
description: Angles with depth that hold even when the patient turns a little in front of the camera.
---

In 2D, the angle comes from the image: if the patient isn't exactly side-on (or facing the camera), the segment looks shorter and the angle reads wrong. With 3D measurement, every `Pose` also carries the joints' positions in meters, and the angle is computed in space.

## Turn it on

Ask the provider for 3D points with `world = true`. MediaPipe already computes its world landmarks on every frame, so it costs almost nothing.

```kotlin
val camera = CameraPoseProvider(context, lifecycleOwner, world = true)
session.start(camera, scope)

// From a video too:
val poses = VideoPoseProvider(context, uri, world = true).readAll()
```

## Choose 2D or 3D

Whoever uses the kit decides with `space` on `MotionSession`:

| `space` | Measures | Needs |
| --- | --- | --- |
| `null` (default) | In 3D when the pose has it, 2D otherwise | Any provider |
| `MeasureSpace.IMAGE` | Always in 2D, on the image | Any provider |
| `MeasureSpace.WORLD` | Always in 3D | A provider with `world = true` |

```kotlin
val session = MotionSession(ExerciseLibrary.elbowFlexion, BodySide.RIGHT, space = MeasureSpace.WORLD)

// It can change live; it applies from the next frame:
session.space = MeasureSpace.IMAGE
```

With `MeasureSpace.WORLD` and poses without 3D points nothing is measured, so use it together with `world = true`. `RepEngine` has the same `space` property if you use it without a session.

## How each measure decides

`Measure.value(pose, side)` measures in 3D when `pose.world` has **every** joint the measure needs; if one is missing, it measures on the image as always.

| Measure | In 3D |
| --- | --- |
| `Angle`, `Flexion` | The real angle between the two segments, wherever the patient faces |
| `FromVertical` | Against the real vertical (y axis up) |
| `Tilt` | Against the horizontal plane |

To force one space, with no fallback:

```kotlin
val onImage = measure.value(pose, BodySide.RIGHT, MeasureSpace.IMAGE)
val in3D = measure.value(pose, BodySide.RIGHT, MeasureSpace.WORLD)   // null without 3D points
```

`pose.imageOnly` drops a pose's 3D points.

## The contract

`pose.world` is a `Map<Joint, Point3>` in meters, with the y axis pointing **up** (camera held upright). The origin depends on the source: only directions matter. There is only a 3D point for joints that are also in `points`, so both spaces see the same body.

If you convert landmarks yourself, pass MediaPipe's to `BlazePose.pose(..., worldLandmarks = ...)` as they come (y down): the SDK turns them.

## Keep in mind

Depth comes from a single camera, so it is estimated. Compare it with a goniometer on your exercises before using it for clinical decisions.
