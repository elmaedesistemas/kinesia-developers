---
title: Baseline measurement
description: Measure where the patient starts with the median of their first clean reps.
---

The **baseline measurement** answers: how much range does the patient have today? It's the median of the peaks of the first N **clean** reps. Rejected reps don't count, so the starting point is measured with good form.

## Start

```swift
session.startBaseline(reps: 3)   // resets the counter and starts
```

For hold exercises it counts clean holds instead of reps.

## Follow the progress

```swift
if let baseline = session.snapshot.baseline {
    Text("\(baseline.repsDone) of \(baseline.repsNeeded)")
    if let result = baseline.result {
        Text("Your range today: \(Int(result))°")
    }
}
```

Or wait for the event:

```swift
for await event in session.events() {
    if case .baselineCompleted(let value) = event {
        patient.baselineRange = value
        target = max(value + 10, exercise.defaultTarget)  // your logic
    }
}
```

## Finish early or cancel

```swift
session.finishBaseline()   // finishes with the clean reps so far (at least one)
session.cancelBaseline()   // leaves without a result and resets
```

`finishBaseline()` does nothing if there are no clean reps yet.

## Why the median

With three reps of 98°, 102° and 131°, the average (110°) gets dragged up by one bounce. The median (102°) reflects what the patient does consistently.
