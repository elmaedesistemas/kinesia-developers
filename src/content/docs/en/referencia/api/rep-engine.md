---
title: RepEngine and Rep
description: The counting engine, without a session or concurrency.
sidebar:
  order: 5
---

## `RepEngine`

```swift
public struct RepEngine: Sendable
```

Turns poses into reps (or holds) while checking form. A pure, synchronous value type: no camera, no UI. `MotionSession` uses it inside; use it directly when you don't need visibility, placement or async events.

```swift
init(definition: ExerciseDefinition, side: BodySide)
mutating func process(_ pose: Pose) -> [MotionEvent]
mutating func reset()
```

### Settings

| Property | Default | |
| --- | --- | --- |
| `smoothing` | `0.5` | Smoothing factor. `1` = none. |
| `faultTolerance` | `0.2` | Share of frames that may break a rule before the rep is rejected. |
| `framesToCue` | `6` | Bad frames in a row before `.formFault` (~0.25 s). |
| `holdTolerance` | `5.0` | Degrees a hold may drift before the clock restarts. |

### State (read-only)

`value`, `best`, `reps`, `rejected`, `holdProgress`, `confidence`, `count`, `peaks`.

`process` only emits `.repCompleted`, `.repRejected`, `.holdStarted` and `.formFault`. Visibility, placement and baseline events are added by `MotionSession`.

## `Rep`

```swift
public struct Rep: Sendable, Equatable
```

| Property | Type | |
| --- | --- | --- |
| `peak` | `Double` | Maximum; for holds, the median of the window. |
| `duration` | `TimeInterval` | Rest to rest; for holds, the time held. |
| `riseDuration` | `TimeInterval` | From the start to the peak. |
| `returnDuration` | `TimeInterval` | From the peak to rest. 0 for holds. |
| `peakVelocity` | `Double` | Degrees per second. |
| `confidence` | `Double?` | Average confidence, 0…1. |
| `faults` | `Set<FormFeedback>` | Broken rules. |
| `isClean` | `Bool` | `faults.isEmpty`. |

```swift
extension Array where Element == Rep {
    var peakSpread: Double?   // standard deviation of the peaks; nil with fewer than 2
}
```
