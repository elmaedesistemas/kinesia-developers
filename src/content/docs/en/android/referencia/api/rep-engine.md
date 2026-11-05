---
title: RepEngine and Rep
description: The counting engine, without a session or concurrency.
sidebar:
  order: 5
---

## `RepEngine`

```kotlin
public class RepEngine
```

Turns poses into reps (or holds) while checking form. A synchronous class, with no camera, UI or coroutines. `MotionSession` uses it inside; use it directly when you don't need visibility, placement or an event flow. It isn't thread-safe: feed it from one thread.

```kotlin
RepEngine(definition: ExerciseDefinition, side: BodySide)
fun process(pose: Pose): List<MotionEvent>
fun reset()
```

### Settings

| Property | Default | |
| --- | --- | --- |
| `smoothing` | `0.5` | Smoothing factor. `1` = none. |
| `faultTolerance` | `0.2` | Share of frames that may break a rule before the rep is rejected. |
| `framesToCue` | `6` | Bad frames in a row before `FormFault` (~0.25 s). |
| `holdTolerance` | `5.0` | Degrees a hold may drift before the clock restarts. |

### State (read-only)

`value`, `best`, `reps`, `rejected`, `holdProgress`, `confidence`, `count`, `peaks`.

`process` only emits `RepCompleted`, `RepRejected`, `HoldStarted` and `FormFault`. Visibility, placement and baseline events are added by `MotionSession`.

## `Rep`

```kotlin
public data class Rep
```

| Property | Type | |
| --- | --- | --- |
| `peak` | `Double` | Maximum; for holds, the median of the window. |
| `duration` | `Double` | Rest to rest; for holds, the time held. |
| `riseDuration` | `Double` | From the start to the peak. |
| `returnDuration` | `Double` | From the peak to rest. 0 for holds. |
| `peakVelocity` | `Double` | Degrees per second. |
| `confidence` | `Double?` | Average confidence, 0…1. |
| `faults` | `Set<FormFeedback>` | Broken rules. |
| `isClean` | `Boolean` | `faults.isEmpty()`. |

```kotlin
val List<Rep>.peakSpread: Double?   // standard deviation of the peaks; null with fewer than 2
```
