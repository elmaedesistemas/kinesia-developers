---
title: The Pose contract
description: The rules every pose source must follow.
---

A `Pose` is one frame of body points. The whole engine trusts that poses follow this contract; if you write your own `PoseProvider`, it's up to you to respect it.

```kotlin
public data class Pose(
    val points: Map<Joint, Point>,
    val timestamp: Double,                 // seconds
    val imageSize: Size? = null,
    val confidence: Map<Joint, Double> = emptyMap(),
)
```

## The four rules

1. **Image pixels, with `y` pointing down.** The origin is at the top left, as in Android views. MediaPipe gives normalized coordinates (0…1): the adapter must convert them to pixels.
2. **Anatomical sides.** `Joint.LEFT_ELBOW` is the patient's *real* left elbow. With the front camera the image is mirrored, so the adapter must swap left and right before building the pose.
3. **Only confident points.** Low-confidence joints are left out of the map. A missing joint means "I can't see it", and the engine treats it that way: it doesn't measure, doesn't penalize and reports it as missing.
4. **`confidence` is optional.** If your detector has no confidence, leave the map empty; confidence metrics will be `null`.

:::tip[Empty poses]
Send the pose even when it has no points. An empty pose tells the session the patient left the frame, so it can emit `VisibilityChanged`.
:::

## The 19 joints

`Joint` has 19 points. MediaPipe detects 33 (BlazePose): `BlazePose.pose(...)` converts them, and computes `NECK` and `ROOT` as the midpoint of the shoulders and of the hips.

| Area | Joints |
| --- | --- |
| Head | `NOSE`, `LEFT_EYE`, `RIGHT_EYE`, `LEFT_EAR`, `RIGHT_EAR` |
| Midline | `NECK`, `ROOT` (center of the hips) |
| Arms | `LEFT_SHOULDER`, `RIGHT_SHOULDER`, `LEFT_ELBOW`, `RIGHT_ELBOW`, `LEFT_WRIST`, `RIGHT_WRIST` |
| Legs | `LEFT_HIP`, `RIGHT_HIP`, `LEFT_KNEE`, `RIGHT_KNEE`, `LEFT_ANKLE`, `RIGHT_ANKLE` |

To avoid writing `if (side == BodySide.LEFT) Joint.LEFT_KNEE else Joint.RIGHT_KNEE`, use the shortcuts:

```kotlin
Joint.knee(BodySide.LEFT)   // Joint.LEFT_KNEE
Joint.shoulder(side)        // depending on the side
BodySide.RIGHT.opposite     // BodySide.LEFT
```

:::note
There are no points for toes or fingers. That's why ankle dorsiflexion is measured as shin tilt; see the [catalog](/en/android/referencia/ejercicios/#ankle).
:::

## Reading a pose

```kotlin
pose[Joint.RIGHT_ELBOW]?.let { elbow ->
    println(elbow)                     // Point in pixels
}
pose.confidence(listOf(Joint.RIGHT_SHOULDER, Joint.RIGHT_ELBOW, Joint.RIGHT_WRIST))
// The lowest confidence among those in view, or null
```

`imageSize` lets you draw the points over the camera view by scaling them to the view's size.
