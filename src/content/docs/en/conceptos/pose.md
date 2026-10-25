---
title: The Pose contract
description: The rules every pose source must follow.
---

A `Pose` is one frame of body points. The whole engine trusts that poses follow this contract; if you write your own `PoseProvider`, it's up to you to respect it.

```swift
public struct Pose: Sendable {
    public var points: [Joint: CGPoint]
    public var timestamp: TimeInterval
    public var imageSize: CGSize?
    public var confidence: [Joint: Double]
}
```

## The four rules

1. **Image pixels, with `y` pointing down.** The origin is at the top left, as in UIKit. Don't use normalized coordinates (0…1) or Vision's bottom-left origin.
2. **Anatomical sides.** `.leftElbow` is the patient's *real* left elbow. With the front camera the image is mirrored, so the adapter must swap left and right before building the pose.
3. **Only confident points.** Low-confidence joints are left out of the dictionary. A missing joint means "I can't see it", and the engine treats it that way: it doesn't measure, doesn't penalize and reports it as missing.
4. **`confidence` is optional.** If your detector has no confidence, leave the dictionary empty; confidence metrics will be `nil`.

:::tip[Empty poses]
Send the pose even when it has no points. An empty pose tells the session the patient left the frame, so it can emit `.visibilityChanged`.
:::

## The 19 joints

`Joint` follows the 19 points of Vision's 2D body detector:

| Area | Joints |
| --- | --- |
| Head | `nose`, `leftEye`, `rightEye`, `leftEar`, `rightEar` |
| Midline | `neck`, `root` (center of the hips) |
| Arms | `leftShoulder`, `rightShoulder`, `leftElbow`, `rightElbow`, `leftWrist`, `rightWrist` |
| Legs | `leftHip`, `rightHip`, `leftKnee`, `rightKnee`, `leftAnkle`, `rightAnkle` |

On Android they're written `Joint.LEFT_SHOULDER`, `Joint.NECK`, and so on. MediaPipe detects 33 points (BlazePose): the SDK converts them to these same 19, and computes `neck` and `root` as the midpoint of the shoulders and of the hips. See [Camera with MediaPipe](/en/android/camara-mediapipe/).

To avoid writing `side == .left ? .leftKnee : .rightKnee`, use the shortcuts:

```swift
Joint.knee(.left)       // .leftKnee
Joint.shoulder(side)    // depends on the side
BodySide.right.opposite // .left
```

:::note
There are no points for toes or fingers. That's why ankle dorsiflexion is measured as shin tilt; see the [catalog](/en/referencia/ejercicios/#ankle).
:::

## Reading a pose

```swift
if let elbow = pose[.rightElbow] {
    print(elbow)                                // CGPoint in pixels
}
pose.confidence(of: [.rightShoulder, .rightElbow, .rightWrist])
// The lowest confidence among the visible ones, or nil
```

`imageSize` lets you draw the points over the camera view by scaling them to the view's size.
