---
title: Tests and recordings
description: Test your integration without a camera using RecordedPoseProvider and synthetic poses.
---

KinesiaMotion's engine needs no camera and no UI, so it can be tested with `swift test` on macOS and in CI.

## `RecordedPoseProvider`

Replays a list of poses as if they came from the camera.

```swift
let provider = RecordedPoseProvider(poses, realTime: false)
```

- `realTime: false` (default): delivers the poses as fast as possible. Ideal for tests.
- `realTime: true`: waits between poses according to their `timestamp`, so a demo looks live.

## From a video: `VideoPoseProvider`

Gets poses from a video file (`.mov` or `.mp4`) with the same Apple Vision body detector as the live camera. The video is processed on the device and isn't uploaded anywhere. It lives in the `KinesiaMotionVision` module and works on iOS and macOS.

```swift
import KinesiaMotion
import KinesiaMotionVision

let video = VideoPoseProvider(url: videoURL)

// Just like the camera:
await session.run(with: video)

// Or every pose at once, to save or reuse them:
let poses = try await video.readAll()
let replay = RecordedPoseProvider(poses)
```

- Useful to validate against a goniometer: record the measurement with the goniometer next to the patient and compare the degrees afterwards.
- Reads iPhone videos in any orientation.
- `mirrored: true` when the video looks like a mirror (a selfie that kept the flipped image), so sides match the patient's.
- `maximumFrameRate` (30 by default) skips frames to go faster; `realTime: true` waits between frames like the camera.
- `readAll()` throws if the file can't be read; `poses()` just ends.

## Validate against a goniometer: `kinesia-validate`

The package includes a command-line tool that compares Kinesia's angles with a goniometer. Each trial is a short video plus the reading the goniometer showed while the patient held the end of the range.

Write the trials in a CSV, one line per video, with the videos in the same folder. The column names and values are in Spanish:

```
video,ejercicio,lado,goniometro,espejo
codo-der-01.mov,codo,derecho,132,no
```

From the `kinesia-motion` folder, on a Mac:

```sh
swift run kinesia-validate ~/Validacion/mediciones.csv
```

- It reads each video with `VideoPoseProvider` and takes the angle at the end of the range (the median of the 5 highest frames).
- Per exercise and side it shows the mean absolute error, the bias (whether it reads high or low), the worst error and the share within ±5°. It passes if the mean error is 5° or less.
- It writes `resultados.csv` in the same folder, with the detail of each video.
- `ejercicio` is one of: `codo` (elbow), `rodilla` (knee), `hombro-flexion`, `hombro-abduccion` (shoulder), `cadera-flexion`, `cadera-abduccion` (hip), `tobillo` (ankle), `cuello` (neck). `lado` is `izquierdo` (left) or `derecho` (right).

Camera placement for each exercise and how to record are in [`Validation/INSTRUCCIONES.md`](https://github.com/elmaedesistemas/kinesia-motion/blob/main/Validation/INSTRUCCIONES.md) (in Spanish).

## Synthetic poses

For a test, the joints the exercise measures are enough. This helper builds a right arm with an exact elbow flexion:

```swift
import CoreGraphics
import KinesiaMotion

/// Right arm with an exact elbow flexion. y grows downward.
func elbowPose(flexion: Double, time: TimeInterval) -> Pose {
    let r = Double.pi / 180
    let shoulder = CGPoint(x: 0, y: 0)
    let elbow = CGPoint(x: 0, y: 100)
    let wrist = CGPoint(x: elbow.x + 100 * sin(flexion * r), y: elbow.y + 100 * cos(flexion * r))
    return Pose(points: [.rightShoulder: shoulder, .rightElbow: elbow, .rightWrist: wrist], timestamp: time)
}

/// 0 → peak → 0 in 10° steps at 24 FPS.
func oneRep(peak: Double, startingAt start: TimeInterval = 0) -> [Pose] {
    var up = Array(stride(from: 0.0, to: peak, by: 10))
    up.append(peak)
    let angles = up + up.reversed().dropFirst()
    return angles.enumerated().map { i, angle in
        elbowPose(flexion: angle, time: start + Double(i) / 24)
    }
}
```

## A complete test

```swift
import Testing
import KinesiaMotion

@MainActor
@Test func countsTwoCleanReps() async {
    let session = MotionSession(exercise: ExerciseLibrary.elbowFlexion, side: .right, smoothing: 1)
    let poses = oneRep(peak: 120) + oneRep(peak: 110, startingAt: 2)

    await session.run(with: RecordedPoseProvider(poses))

    #expect(session.snapshot.repCount == 2)
    #expect(session.peaks == [120, 110])
}
```

:::tip[`smoothing: 1`]
In tests, turn smoothing off so the peak is exactly the one you built. With the default (0.5) the measured peak lands a bit lower.
:::

Use `run(with:)` instead of `start(with:)`: it waits for the recording to finish, so you can check the result right after.

## Without a session: `RepEngine`

If you only care about counting, `RepEngine` is a pure, synchronous `struct`:

```swift
var engine = RepEngine(definition: ExerciseLibrary.elbowFlexion, side: .right)
engine.smoothing = 1
for pose in oneRep(peak: 120) {
    let events = engine.process(pose)
    // ...
}
engine.count   // 1
```

## Recording real sessions

`Pose` isn't `Codable` (because of `CGPoint` and `Joint` as a dictionary key), so to save a recording it's best to use your own type:

```swift
struct RecordedFrame: Codable {
    var t: TimeInterval
    var points: [String: [Double]]   // "rightElbow": [x, y]
}

extension Pose {
    init(_ frame: RecordedFrame) {
        var points: [Joint: CGPoint] = [:]
        for (name, xy) in frame.points {
            if let joint = Joint(rawValue: name), xy.count == 2 {
                points[joint] = CGPoint(x: xy[0], y: xy[1])
            }
        }
        self.init(points: points, timestamp: frame.t)
    }
}
```

Record a few seconds with `VisionPoseProvider`, save them as JSON next to your tests, and you'll have real cases (poor light, loose clothing, compensated movements) to tune thresholds without depending on a patient.
