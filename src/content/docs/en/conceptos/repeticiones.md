---
title: Reps and holds
description: How the engine decides a rep started, ended and was clean.
---

An exercise is counted in one of two ways, depending on its `kind`.

## Reps: `.reps(low:high:)`

The patient leaves rest, goes far and comes back. **Two thresholds** (hysteresis) are used so jitter around a single value doesn't count false reps:

1. When the value goes above `low`, an **attempt** starts.
2. During the attempt the engine records the peak, velocity, confidence and broken rules.
3. When the value drops below `low`, the attempt ends:
   - if the peak **never reached `high`**, it's ignored (it was a small movement);
   - if it did, it's **judged**: clean → `.repCompleted`, with faults → `.repRejected`.

```text
 degrees
  high ┤        ╭──╮               ╭─╮
       │       ╱    ╲             ╱   ╲
  low  ┤──────╱──────╲───╭─╮─────╱─────╲────
       │     ╱        ╲ ╱   ╲   ╱       ╲
     0 ┼────╯          ╰     ╰─╯         ╰──
            └─ counts ─┘ ignored └ counts ┘
```

Example: elbow flexion uses `.reps(low: 30, high: 90)`. Bending to 60° and back doesn't count; bending to 125° does, with `peak = 125`.

## Holds: `.hold(threshold:seconds:)`

The patient reaches the end of the range and stays there.

1. Going above `threshold` emits `.holdStarted` and starts the clock.
2. If the value moves more than `holdTolerance` (5° by default) from where it started, the clock **restarts** from there. So while the patient keeps rising, nothing is counted.
3. Once the value stays steady for `seconds`, the hold is judged. Its `peak` is the **median** of that window, not the maximum, so a single spike doesn't inflate the result.
4. The patient must go back below `threshold` before the next one.

While holding, `snapshot.holdProgress` goes from 0 to 1: use it for a progress ring.

## Smoothing

Before anything else, the primary value is smoothed with an exponential moving average:

```text
value = previous + smoothing × (raw − previous)
```

With `smoothing = 0.5` (the default) single-frame jumps disappear without noticeable lag. `1` turns smoothing off. Set it in `MotionSession(exercise:side:smoothing:)`.

## Form rules

Each `FormRule` is a measure with an allowed range. On every frame of the attempt:

- if the rule **can't be measured** (its joints aren't visible), it's skipped: what can't be seen isn't penalized;
- if it's **broken** for `framesToCue` frames in a row (6, ~0.25 s), `.formFault` is emitted **once per rep**: that's the live cue;
- at the end, if a rule was broken in more than `faultTolerance` of the frames (20%), the rep is rejected and the fault shows up in `rep.faults`.

So a brief slip doesn't ruin the rep, but doing it wrong most of the time does.

## What each rep stores

| Property | Meaning |
| --- | --- |
| `peak` | Highest value (median of the window for holds) |
| `duration` | Rest to rest; for holds, the time held |
| `riseDuration` | From the start to the peak |
| `returnDuration` | From the peak back to rest (0 for holds) |
| `peakVelocity` | Fastest movement, in degrees per second |
| `confidence` | Average detector confidence, 0…1, or `nil` |
| `faults` | Broken rules; empty = clean (`isClean`) |

To see how consistent a set is: `session.reps.peakSpread` gives the standard deviation of the peaks.
