---
title: Live camera with Vision
description: Use VisionPoseProvider to get poses from the iPhone camera.
---

`VisionPoseProvider` (module `KinesiaMotionVision`, iOS only) opens the camera, runs Vision's 2D body detector on every frame and delivers poses that already follow the [Pose contract](/en/conceptos/pose/).

```swift
import KinesiaMotionVision

let camera = VisionPoseProvider(
    camera: .front,          // .front or .back
    minimumConfidence: 0.3   // points below this are dropped
)
```

## Permission

```swift
if !VisionPoseProvider.isAuthorized {
    let granted = await VisionPoseProvider.requestAccess()
    guard granted else {
        // Show how to enable the camera in Settings
        return
    }
}
```

Remember the `NSCameraUsageDescription` key in `Info.plist` ([Installation](/en/empezar/instalacion/#camera-permission)).

## Lifecycle

The camera **turns itself on** when someone starts iterating `poses()` and **turns itself off** when they stop. With `MotionSession` that means:

```swift
session.start(with: camera)  // on
session.stop()               // off
```

There's no need to call `startRunning()` or `stopRunning()` on `captureSession`.

:::caution[One stream at a time]
Each `VisionPoseProvider` serves a single stream. To measure both sides with the same camera, create two `MotionSession`s and feed each pose to both from a single loop (see below), instead of calling `start(with:)` twice with the same provider.
:::

## Showing the image

`captureSession` is a regular `AVCaptureSession`: hand it to an `AVCaptureVideoPreviewLayer`. The full `CameraPreview` example for SwiftUI is in the [quick start](/en/empezar/inicio-rapido/#the-full-example).

With the front camera the preview layer looks mirrored (like a mirror), but poses carry the patient's **real** sides. If you draw the points on top, mirror `x` when drawing, not when measuring.

## What it does inside

- VGA resolution (640×480): enough for the detector and light on the battery.
- Drops late frames: if your code is slow, you always get the newest pose.
- Converts Vision's coordinates (normalized, bottom-left origin) to pixels with `y` pointing down, for a portrait image.
- With the front camera it swaps left and right.
- Also sends empty poses when nobody is detected.

## Both sides with one camera

This is how the Kinesia app does it: one camera, one session per side.

```swift
let camera = VisionPoseProvider(camera: .front)
let left = MotionSession(exercise: exercise, side: .left)
let right = MotionSession(exercise: exercise, side: .right)

let task = Task { @MainActor in
    for await pose in camera.poses() {
        left.process(pose)
        right.process(pose)
    }
}
// To finish: task.cancel()  → the camera turns off
```
