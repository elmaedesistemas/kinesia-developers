---
title: Tests and recordings
description: Test your integration without a camera using RecordedPoseProvider and synthetic poses.
---

The KinesiaMotion engine (`kinesia-motion`) is pure Kotlin: it needs no camera, Android or emulator, so it is tested on the JVM with `./gradlew test`, on your machine and in CI.

## `RecordedPoseProvider`

Replays a list of poses as if they came from the camera.

```kotlin
val provider = RecordedPoseProvider(poses, realTime = false)
```

- `realTime = false` (default): delivers the poses as fast as possible. Ideal for tests.
- `realTime = true`: waits between poses according to their `timestamp`, so a demo looks live.

## From a video: `VideoPoseProvider`

Gets the poses from a video with the same MediaPipe model as the live camera. The video is processed on the device and isn't uploaded anywhere. It's in the `kinesia-motion-camera` module.

```kotlin
import one.kinesia.motion.camera.VideoPoseProvider

val video = VideoPoseProvider(context, videoUri)

// Just like the camera:
session.run(video)

// Or every pose at once, to store or reuse them:
val poses = video.readAll()
val replay = RecordedPoseProvider(poses)
```

- It's useful to validate against a goniometer: record the measurement with the goniometer alongside and compare the degrees later, calmly.
- `mirrored = true` if the video looks like a mirror (a selfie that saved the flipped image): that way the sides match the patient's.
- `framesPerSecond` (24 by default) sets how many frames are read per second of video. They're read as fast as the phone allows, not in real time.

## Synthetic poses

For a test, the joints the exercise measures are enough. This helper builds a right arm with an exact elbow flexion:

```kotlin
import one.kinesia.motion.*
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/** Right arm with an exact elbow flexion. y grows downward. */
fun elbowPose(flexion: Double, time: Double): Pose {
    val r = PI / 180
    val shoulder = Point(0.0, 0.0)
    val elbow = Point(0.0, 100.0)
    val wrist = Point(elbow.x + 100 * sin(flexion * r), elbow.y + 100 * cos(flexion * r))
    return Pose(
        mapOf(Joint.RIGHT_SHOULDER to shoulder, Joint.RIGHT_ELBOW to elbow, Joint.RIGHT_WRIST to wrist),
        time,
    )
}

/** 0 → peak → 0 in 10° steps at 24 FPS. */
fun oneRep(peak: Double, startingAt: Double = 0.0): List<Pose> {
    val up = generateSequence(0.0) { it + 10 }.takeWhile { it < peak }.toList() + peak
    val angles = up + up.reversed().drop(1)
    return angles.mapIndexed { i, angle -> elbowPose(angle, startingAt + i / 24.0) }
}
```

## A complete test

```kotlin
import kotlinx.coroutines.test.runTest
import one.kinesia.motion.*
import kotlin.test.Test
import kotlin.test.assertEquals

class ElbowTest {
    @Test fun countsTwoCleanReps() = runTest {
        val session = MotionSession(ExerciseLibrary.elbowFlexion, BodySide.RIGHT, smoothing = 1.0)
        val poses = oneRep(120.0) + oneRep(110.0, startingAt = 2.0)

        session.run(RecordedPoseProvider(poses))

        assertEquals(2, session.snapshot.value.repCount)
        assertEquals(listOf(120.0, 110.0), session.peaks)
    }
}
```

:::tip[`smoothing = 1.0`]
In tests, turn smoothing off so the peak is exactly the one you built. With the default (0.5) the measured peak lands a bit lower.
:::

Use `run(provider)` instead of `start(provider, scope)`: it waits for the recording to end, so you can check the result right after. Add `kotlinx-coroutines-test` to your test dependencies for `runTest`.

## Without a session: `RepEngine`

If you only care about counting, `RepEngine` is a synchronous class, with no coroutines:

```kotlin
val engine = RepEngine(ExerciseLibrary.elbowFlexion, BodySide.RIGHT)
engine.smoothing = 1.0
for (pose in oneRep(120.0)) {
    val events = engine.process(pose)
    // ...
}
engine.count   // 1
```

## Recording real sessions

`Pose` isn't `@Serializable`, so to store a recording use a type of your own:

```kotlin
@Serializable
data class RecordedFrame(
    val t: Double,
    val points: Map<String, List<Double>>,   // "RIGHT_ELBOW": [x, y]
)

fun RecordedFrame.toPose(): Pose = Pose(
    points = points
        .filterValues { it.size == 2 }
        .mapKeys { Joint.valueOf(it.key) }
        .mapValues { Point(it.value[0], it.value[1]) },
    timestamp = t,
)
```

Record a few seconds with `CameraPoseProvider`, store them as JSON next to your tests and you'll have real cases (bad light, loose clothes, compensated movements) to tune thresholds without depending on a patient.
