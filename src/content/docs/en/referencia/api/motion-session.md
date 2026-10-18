---
title: MotionSession
description: The SDK's front door.
sidebar:
  order: 1
---

```swift
@MainActor @Observable
public final class MotionSession
```

Connects a pose source, publishes state in `snapshot` and moments in `events()`. Runs on the `MainActor`.

## Create

```swift
init(exercise: ExerciseDefinition, side: BodySide, smoothing: Double = 0.5)
```

| Parameter | |
| --- | --- |
| `exercise` | Which exercise to measure. See the [catalog](/en/referencia/ejercicios/). |
| `side` | The anatomical side being exercised. |
| `smoothing` | Exponential moving average factor, 0…1. `1` = no smoothing. |

## State

| Property | Type | |
| --- | --- | --- |
| `snapshot` | `MotionSnapshot` | All the state needed to draw. Observable. |
| `exercise` | `ExerciseDefinition` | Current exercise. |
| `side` | `BodySide` | Current side. |
| `reps` | `[Rep]` | Clean reps, with their metrics. |
| `peaks` | `[Double]` | Peaks of the clean reps. |

## Running

| Method | |
| --- | --- |
| `start(with: some PoseProvider)` | Starts reading poses in the background. Calling it again replaces the source. |
| `stop()` | Stops reading. The provider's stream ends and the camera turns off. |
| `run(with: some PoseProvider) async` | Reads until the source ends or the task is cancelled. For tests, or when you manage the `Task`. |
| `process(_ pose: Pose) -> [MotionEvent]` | Processes one pose by hand. Returns and emits the frame's events. `@discardableResult`. |

## Configuring

| Method | |
| --- | --- |
| `configure(exercise:side:)` | Switches exercise or side and resets the count. |
| `reset()` | Clears reps and values. The source keeps running. |

| Property | Default | |
| --- | --- | --- |
| `framesToConfirmVisibility` | `6` | Frames in a row before visibility flips (~0.25 s at 24 FPS). |
| `framesToConfirmSetup` | `12` | Frames in a row before placement issues change (~0.5 s). |
| `setupCheck` | `SetupCheck()` | Placement thresholds. See [Measurement quality](/en/guias/calidad-de-medicion/). |

## Baseline measurement

| Method | |
| --- | --- |
| `startBaseline(reps: Int = 3)` | Resets and starts a baseline of `reps` clean reps. |
| `finishBaseline()` | Finishes early with the clean reps so far (at least one). |
| `cancelBaseline()` | Leaves without a result and resets. |

## Events

```swift
func events() -> AsyncStream<MotionEvent>
```

A new stream per call; it ends when the caller stops iterating. Buffers up to 64 events if the listener falls behind. See [`MotionEvent`](/en/referencia/api/tipos/#motionevent).

## `MotionSnapshot`

| Field | Type |
| --- | --- |
| `value` | `Double?` |
| `best` | `Double` |
| `repCount` | `Int` |
| `rejectedCount` | `Int` |
| `lastRep` | `Rep?` |
| `holdProgress` | `Double?` |
| `confidence` | `Double?` |
| `setupIssues` | `Set<SetupIssue>` |
| `isVisible` | `Bool` |
| `missingJoints` | `[Joint]` |
| `isRunning` | `Bool` |
| `baseline` | `BaselineProgress?` |

`BaselineProgress` has `repsDone`, `repsNeeded`, `result: Double?` and `isFinished`.
