---
title: MotionSession
description: The SDK's front door.
sidebar:
  order: 1
---

```kotlin
public class MotionSession
```

Connects a pose source, publishes the state in `snapshot` and the moments in `events`. It can be called from any thread.

## Create

```kotlin
MotionSession(exercise: ExerciseDefinition, side: BodySide, smoothing: Double = 0.5)
```

| Parameter | |
| --- | --- |
| `exercise` | Which exercise to measure. See the [catalog](/en/android/referencia/ejercicios/). |
| `side` | The anatomical side being exercised. |
| `smoothing` | Exponential moving average factor, 0…1. `1` = no smoothing. |

## State

| Property | Type | |
| --- | --- | --- |
| `snapshot` | `StateFlow<MotionSnapshot>` | All the state to draw. |
| `exercise` | `ExerciseDefinition` | Current exercise. |
| `side` | `BodySide` | Current side. |
| `reps` | `List<Rep>` | Clean reps, with their metrics. |
| `peaks` | `List<Double>` | Peaks of the clean reps. |

## Running

| Method | |
| --- | --- |
| `start(provider: PoseProvider, scope: CoroutineScope)` | Starts reading poses in `scope`. Calling it again replaces the source. |
| `stop()` | Stops reading. The provider flow is cancelled and the camera turns off. |
| `suspend run(provider: PoseProvider)` | Reads until the source ends or the coroutine is cancelled. For tests, or when you manage the coroutine. |
| `process(pose: Pose): List<MotionEvent>` | Processes one pose by hand. Returns and emits the frame events. |

## Configuring

| Method | |
| --- | --- |
| `configure(exercise, side)` | Switches exercise or side and resets the count. |
| `reset()` | Clears reps and values. The source keeps running. |

| Property | Default | |
| --- | --- | --- |
| `framesToConfirmVisibility` | `6` | Frames in a row before visibility flips (~0.25 s at 24 FPS). |
| `framesToConfirmSetup` | `12` | Frames in a row before placement issues change (~0.5 s). |
| `setupCheck` | `SetupCheck()` | Placement thresholds. See [Measurement quality](/en/android/guias/calidad-de-medicion/). |

## Baseline measurement

| Method | |
| --- | --- |
| `startBaseline(reps: Int = 3)` | Resets and starts a baseline of `reps` clean reps. |
| `finishBaseline()` | Finishes early with the clean reps so far (at least one). |
| `cancelBaseline()` | Leaves without a result and resets. |

## Events

```kotlin
val events: SharedFlow<MotionEvent>
```

One flow for every listener; each `collect` gets events from the moment it starts listening. It keeps up to 64 events if a listener falls behind. See [`MotionEvent`](/en/android/referencia/api/tipos/#motionevent).

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
| `isVisible` | `Boolean` |
| `missingJoints` | `List<Joint>` |
| `isRunning` | `Boolean` |
| `baseline` | `BaselineProgress?` |

`BaselineProgress` has `repsDone`, `repsNeeded`, `result: Double?` and `isFinished`.
