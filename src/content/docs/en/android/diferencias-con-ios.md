---
title: Differences from iOS
description: How to write in Kotlin what the guides show in Swift.
---

Both SDKs have the same API: the same angles, the same rep counting, the same catalog and the same exercise JSON format. What changes is how you write it, so it feels natural in each language. The guides have their examples in Swift; this table tells you how to read them in Kotlin.

## Types and names

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `import KinesiaMotion` | `import one.kinesia.motion.*` |
| `import KinesiaMotionVision` | `import one.kinesia.motion.camera.*` |
| `.right`, `.leftShoulder` | `BodySide.RIGHT`, `Joint.LEFT_SHOULDER` |
| `.keepUpperArmStill`, `.turnSideways` | `FormFeedback.KEEP_UPPER_ARM_STILL`, `SetupIssue.TURN_SIDEWAYS` |
| `feedback.rawValue` | `feedback.rawValue` (the same text: `"keepUpperArmStill"`) |
| `CGPoint`, `CGSize` | `Point`, `Size` (as `Double`) |
| `TimeInterval` | `Double`, in seconds |
| `0...30` | `0.0..30.0` |

Use `rawValue` as the translation key: that way both apps share the same texts.

## Measures and exercises

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `.flexion(a: "shoulder", vertex: "elbow", b: "wrist")` | `Measure.Flexion("shoulder", "elbow", "wrist")` |
| `.fromVertical(from: "hip", to: "knee")` | `Measure.FromVertical("hip", "knee")` |
| `.tilt(a: "ear", b: "opposite.ear")` | `Measure.Tilt("ear", "opposite.ear")` |
| `"opposite.shoulder" as LandmarkRef` | `LandmarkRef.of("opposite.shoulder")` |
| `.reps(low: 30, high: 90)` | `ExerciseDefinition.Kind.Reps(low = 30.0, high = 90.0)` |
| `.hold(threshold: 15, seconds: 3)` | `ExerciseDefinition.Kind.Hold(threshold = 15.0, seconds = 3.0)` |
| `ExerciseLibrary.decode(from: data)` | `ExerciseLibrary.decode(text)` |
| `ExerciseLibrary.encode(list)` → `Data` | `ExerciseLibrary.encode(list)` → `String` |

The JSON is the same on both platforms: an exercise downloaded from your server works the same on iOS and Android. Invalid JSON throws `DecodingError` in Swift and `SerializationException` in Kotlin.

## Session, snapshot and events

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `session.start(with: camera)` | `session.start(camera, scope)` |
| `await session.run(with: provider)` | `session.run(provider)` (`suspend`) |
| `session.snapshot` (`@Observable`) | `session.snapshot.value`, or `collect` the `StateFlow` |
| `for await event in session.events()` | `session.events.collect { event -> … }` |
| `case .repCompleted(let rep)` | `is MotionEvent.RepCompleted -> event.rep` |
| `case .holdStarted` | `MotionEvent.HoldStarted` |
| `session.process(pose)` | `session.process(pose)` |

`session.events` is a `SharedFlow`: each `collect` gets events from the moment it starts listening, not earlier ones. Start listening before you start the session.

In Swift, `MotionSession` lives on the `MainActor`. In Kotlin it can be called from any thread; the usual setup is `lifecycleScope` or `viewModelScope`.

## Pose sources

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `PoseProvider` with `AsyncStream<Pose>` | `PoseProvider` with `Flow<Pose>` |
| `VisionPoseProvider` (Apple Vision) | `CameraPoseProvider` (CameraX + MediaPipe) |
| `VideoPoseProvider(url:)` | `VideoPoseProvider(context, uri)` |
| `RecordedPoseProvider(poses)` | `RecordedPoseProvider(poses)` |
| Vision's 19 points | BlazePose's 33 points, converted to the same 19 |

## Tests

The Android engine doesn't depend on Android: tests run on the JVM with `./gradlew test`, like `swift test` on macOS. The Android SDK's tests reproduce the Swift ones one by one.
