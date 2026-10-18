---
title: Events and snapshot
description: When to read state and when to listen to events.
---

`MotionSession` talks to you in two ways. Use each one for its job.

## Snapshot: for drawing

`session.snapshot` is a `MotionSnapshot`: everything a screen needs, in a single value. Since `MotionSession` is `@Observable` and runs on the `MainActor`, SwiftUI updates by itself.

```swift
struct Hud: View {
    let session: MotionSession

    var body: some View {
        let s = session.snapshot
        VStack {
            Text(s.value.map { "\(Int($0))°" } ?? "—")
            Text("\(s.repCount) clean · \(s.rejectedCount) rejected")
            if let progress = s.holdProgress {
                ProgressView(value: progress)
            }
            if !s.isVisible {
                Text("Show: \(s.missingJoints.map(\.rawValue).joined(separator: ", "))")
            }
        }
    }
}
```

| Field | Type | What it is |
| --- | --- | --- |
| `value` | `Double?` | Current smoothed value of the primary measure |
| `best` | `Double` | Highest value seen since the last reset |
| `repCount` / `rejectedCount` | `Int` | Clean / rejected reps |
| `lastRep` | `Rep?` | The last judged rep (clean or not) |
| `holdProgress` | `Double?` | 0…1 while holding, `nil` otherwise |
| `confidence` | `Double?` | Lowest confidence among the measured joints |
| `setupIssues` | `Set<SetupIssue>` | Placement problems; empty = fine |
| `isVisible` / `missingJoints` | `Bool` / `[Joint]` | Whether the joints are in view and which are missing |
| `isRunning` | `Bool` | Whether the session is reading poses |
| `baseline` | `BaselineProgress?` | Progress of the [baseline measurement](/en/guias/medicion-inicial/) |

## Events: for reacting

`session.events()` returns a new `AsyncStream<MotionEvent>` for each caller. You can have several listeners (voice, haptics, analytics) without them stepping on each other. The stream ends when the listener stops iterating.

```swift
for await event in session.events() {
    switch event {
    case .repCompleted(let rep):
        haptics.success()
        voice.say("\(Int(rep.peak)) degrees")
    case .repRejected(let rep):
        voice.say(text(for: rep.faults.first))
    case .formFault(let fault):
        voice.say(text(for: fault))        // live cue
    case .holdStarted:
        voice.say("Hold it")
    case .visibilityChanged(let v):
        voice.say(v.isVisible ? "I can see you" : "I can't see all of you")
    case .setupChanged(let issues):
        if let issue = issues.first { voice.say(text(for: issue)) }
    case .baselineCompleted(let value):
        saveBaseline(value)
    }
}
```

| Event | When |
| --- | --- |
| `.repCompleted(Rep)` | A clean rep (or hold) finished |
| `.repRejected(Rep)` | One finished with poor form; `rep.faults` says why |
| `.holdStarted` | Holds: the value crossed the threshold and the clock started |
| `.formFault(FormFeedback)` | A rule was broken for ~0.25 s; once per rep and fault |
| `.visibilityChanged(Visibility)` | The joints came into view or left it (debounced) |
| `.setupChanged(Set<SetupIssue>)` | The placement problems changed (debounced) |
| `.baselineCompleted(Double)` | The baseline measurement finished |

## Correction texts

The SDK ships no texts: `FormFeedback` and `SetupIssue` are `enum`s with stable `rawValue`s, meant for your app to translate.

```swift
func text(for fault: FormFeedback?) -> String {
    switch fault {
    case .keepUpperArmStill:  "Keep your upper arm by your side"
    case .keepThighStill:     "Keep your thigh still"
    case .keepElbowStraight:  "Straighten your elbow"
    case .keepTrunkUpright:   "Keep your trunk upright"
    case .keepShouldersLevel: "Level your shoulders"
    case .keepKneeStraight:   "Straighten your knee"
    case .keepHipsLevel:      "Level your hips"
    case nil:                 "Watch your form"
    }
}
```

## Processing by hand

If you already have your own pose loop, skip `start(with:)` and call `process(_:)`. It returns that frame's events (and also emits them to listeners):

```swift
let events = session.process(pose)
```

`run(with:)` is the `async` version of `start(with:)`: it reads until the source ends or the task is cancelled. Useful when you manage the `Task` yourself, or in tests.
