---
title: Camera with MediaPipe
description: Use CameraPoseProvider and VideoPoseProvider to get poses on Android.
---

On Android, poses come from **MediaPipe Pose Landmarker**, the same model the web SDK will use. `CameraPoseProvider` runs it on the camera with CameraX, and `VideoPoseProvider` on a video file. Both deliver poses that follow the [Pose contract](/en/conceptos/pose/), so the engine measures the same as on iOS.

```kotlin
import one.kinesia.motion.camera.CameraPoseProvider

val camera = CameraPoseProvider(
    context = context,
    lifecycleOwner = lifecycleOwner,
    camera = CameraPoseProvider.Camera.FRONT,          // FRONT or BACK
    minimumConfidence = 0.3,                           // points below are dropped
    previewSurface = previewView.surfaceProvider,      // optional: the live image
)
```

## Lifecycle

The camera **turns on by itself** when someone starts collecting `poses()` and **turns off by itself** when they stop. With `MotionSession`:

```kotlin
session.start(camera, lifecycleScope)  // on
session.stop()                         // off
```

The camera is also tied to the `lifecycleOwner`: CameraX pauses it when the screen is no longer visible.

:::caution[One stream at a time]
Each `CameraPoseProvider` serves a single stream. To measure both sides with the same camera, hand each pose to two sessions from a single `collect` (see below).
:::

## Showing the image

Pass `previewView.surfaceProvider` (from `androidx.camera.view.PreviewView`) as `previewSurface`. With the front camera the preview is mirrored, and the pose's points are in that same mirrored frame: you can draw them on top without flipping `x`. The **sides**, though, are the patient's real ones.

`PreviewView` crops the image to fill the screen (`FILL_CENTER`). To draw the points on top, scale them with `pose.imageSize` the same way as the preview.

## What it does inside

- Analyzes frames with CameraX (`ImageAnalysis`, 640×480 by default) and drops late ones: if your code is slow, you always get the newest pose.
- Turns each frame upright using the sensor orientation and, with the front camera, mirrors it like the preview.
- Runs MediaPipe in video mode (one body) on its own thread.
- Converts BlazePose's 33 points to the SDK's 19 `Joint`s with `BlazePose.pose(...)`. The neck (`NECK`) and root (`ROOT`) don't exist in BlazePose: they're the midpoint of the shoulders and of the hips.
- Uses MediaPipe's `visibility` as each point's confidence.
- Also sends empty poses when nobody is detected.

## Both sides with one camera

```kotlin
val camera = CameraPoseProvider(context, lifecycleOwner)
val left = MotionSession(exercise, BodySide.LEFT)
val right = MotionSession(exercise, BodySide.RIGHT)

val job = lifecycleScope.launch {
    camera.poses().collect { pose ->
        left.process(pose)
        right.process(pose)
    }
}
// To finish: job.cancel()  → the camera turns off
```

## From a video

`VideoPoseProvider` reads a video with the same model, for example to compare with a goniometer or review a recorded session:

```kotlin
import one.kinesia.motion.camera.VideoPoseProvider

val poses = VideoPoseProvider(context, uri, framesPerSecond = 24.0).readAll()

val session = MotionSession(ExerciseLibrary.elbowFlexion, BodySide.RIGHT)
poses.forEach { session.process(it) }
println(session.peaks)
```

Frames are read as fast as the phone allows, not in real time, and each pose's `timestamp` is its position in the video, in seconds.

## Another detector

If you already have another pose detector, you don't need the camera module: build the `Pose`s yourself and pass them to `session.process(pose)`. If your detector gives BlazePose's 33 points (for example, MediaPipe in another setup), `BlazePose.pose(...)` does the conversion for you.
