---
title: 3D measurement
description: Angles with depth that hold even when the patient turns a little in front of the camera.
---

In 2D, the angle comes from the image: if the patient isn't exactly side-on (or facing the camera), the segment looks shorter and the angle reads wrong. With 3D measurement, every `Pose` also carries the joints' positions in meters, and the angle is computed in space.

## Turn it on

Ask the provider for 3D points with `world: true`. It uses Vision's 3D model (`VNDetectHumanBodyPose3DRequest`, iOS 17), which costs more per frame than 2D.

```swift
let camera = VisionPoseProvider(camera: .front, world: true)
session.start(with: camera)

// From a video too:
let poses = try await VideoPoseProvider(url: url, world: true).readAll()
```

## Choose 2D or 3D

Whoever uses the kit decides with `space` on `MotionSession`:

| `space` | Measures | Needs |
| --- | --- | --- |
| `nil` (default) | In 3D when the pose has it, 2D otherwise | Any provider |
| `.image` | Always in 2D, on the image | Any provider |
| `.world` | Always in 3D | A provider with `world: true` |

```swift
let session = MotionSession(exercise: ExerciseLibrary.elbowFlexion, side: .right, space: .world)

// It can change live; it applies from the next frame:
session.space = .image
```

With `.world` and poses without 3D points nothing is measured, so use it together with `world: true`. `RepEngine` has the same `space` property if you use it without a session.

## How each measure decides

`Measure.value(in:side:)` measures in 3D when `pose.world` has **every** joint the measure needs; if one is missing, it measures on the image as always.

| Measure | In 3D |
| --- | --- |
| `angle`, `flexion` | The real angle between the two segments, wherever the patient faces |
| `fromVertical` | Against the real vertical (y axis up) |
| `tilt` | Against the horizontal plane |

Vision's 3D model has no eyes, ears or nose: neck measures stay in 2D.

To force one space, with no fallback:

```swift
let onImage = measure.value(in: pose, side: .right, space: .image)
let in3D = measure.value(in: pose, side: .right, space: .world)   // nil without 3D points
```

`pose.imageOnly` drops a pose's 3D points.

## The contract

`pose.world` is in meters, with the y axis pointing **up** (camera held upright). The origin depends on the source: only directions matter. There is only a 3D point for joints that are also in `points`, so both spaces see the same body.

## Compare it with a goniometer

Depth comes from a single camera, so it is estimated. `kinesia-validate` measures each video in 2D and in 3D and writes `resultados.csv` and `resultados-3d.csv`, so you can decide with data which one to use for each exercise:

```bash
swift run kinesia-validate mediciones.csv
```
