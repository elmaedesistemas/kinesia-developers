---
title: Measurement quality
description: Placement in front of the camera, detector confidence and per-rep metrics.
---

An angle is only as good as the image it comes from. KinesiaMotion gives you three tools to know when to trust a measurement.

## 1. Placement: `SetupIssue`

On every frame, `SetupCheck` looks at how the patient stands in front of the camera, and the session publishes the problems in `snapshot.setupIssues` (and in `.setupChanged` when they change, after ~0.5 s of stability).

| Case | What happens | What to tell them |
| --- | --- | --- |
| `turnSideways` | Side-view exercise, but they face the camera: the angle is foreshortened | "Turn sideways" |
| `faceCamera` | Front-view exercise, but they're turned sideways | "Face the camera" |
| `moveCloser` | The measured joints look tiny: points jitter more | "Come closer" |
| `stepBack` | A joint is at the edge of the image and will leave it when moving | "Step back a little" |

Anything that can't be judged (a joint out of view, no `imageSize`) is left out rather than guessed.

```swift
if session.snapshot.isVisible, let issue = session.snapshot.setupIssues.first {
    Banner(text(for: issue))
}
```

:::tip
Show visibility first ("I can't see your arm") and only then placement. Asking someone to turn when their arm isn't even visible is confusing.
:::

### Tuning the thresholds

```swift
var check = SetupCheck()
check.maxSideRatio = 0.45   // shoulder width ÷ torso above which they "face the camera"
check.minFrontRatio = 0.35  // below which they're "sideways"
check.minSpan = 0.15        // minimum size of the joints ÷ the image's shorter side
check.edgeMargin = 0.03     // minimum margin to the edges
session.setupCheck = check

session.framesToConfirmSetup = 12       // debounce (~0.5 s at 24 FPS)
session.framesToConfirmVisibility = 6   // debounce (~0.25 s)
```

## 2. Detector confidence

`snapshot.confidence` is the **lowest** confidence among the primary measure's joints on the last frame, 0…1. Each `Rep` stores the **average** over the rep.

```swift
if let c = session.snapshot.lastRep?.confidence, c < 0.5 {
    Text("Unreliable measurement: improve the light or framing")
}
```

It's `nil` when the pose source gives no confidence.

## 3. Per-rep metrics

Beyond the peak, each `Rep` carries data to assess movement control:

```swift
for rep in session.reps {
    print(rep.peak, rep.riseDuration, rep.returnDuration, rep.peakVelocity)
}
session.reps.peakSpread   // standard deviation of the peaks: low = consistent
```

A return much faster than the rise (`returnDuration` ≪ `riseDuration`) usually means the patient "drops" the limb instead of controlling it.
