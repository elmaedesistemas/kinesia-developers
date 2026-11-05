---
title: Events and snapshot
description: When to read state and when to listen to events.
---

`MotionSession` talks to you in two ways. Use each one for its job.

## Snapshot: for drawing

`session.snapshot` is a `StateFlow<MotionSnapshot>`: everything a screen needs, in a single value. In Jetpack Compose, turn it into state with `collectAsStateWithLifecycle()`; to read it once, use `session.snapshot.value`.

```kotlin
@Composable
fun Hud(session: MotionSession) {
    val s by session.snapshot.collectAsStateWithLifecycle()

    Column {
        Text(s.value?.let { "${it.roundToInt()}°" } ?: "—")
        Text("${s.repCount} clean · ${s.rejectedCount} rejected")
        s.holdProgress?.let { progress ->
            LinearProgressIndicator(progress = { progress.toFloat() })
        }
        if (!s.isVisible) {
            Text("Show: ${s.missingJoints.joinToString { it.name }}")
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
| `holdProgress` | `Double?` | 0…1 while holding, `null` otherwise |
| `confidence` | `Double?` | Lowest confidence among the measured joints |
| `setupIssues` | `Set<SetupIssue>` | Placement problems; empty = fine |
| `isVisible` / `missingJoints` | `Boolean` / `List<Joint>` | Whether the joints are in view and which are missing |
| `isRunning` | `Boolean` | Whether the session is reading poses |
| `baseline` | `BaselineProgress?` | Progress of the [baseline measurement](/en/android/guias/medicion-inicial/) |

## Events: for reacting

`session.events` is a `SharedFlow<MotionEvent>`. You can have several listeners (voice, haptics, analytics) without them stepping on each other. Each `collect` gets events from the moment it starts listening, not earlier ones: start listening before you start the session. It keeps up to 64 events if a listener falls behind.

```kotlin
session.events.collect { event ->
    when (event) {
        is MotionEvent.RepCompleted -> {
            haptics.success()
            voice.say("${event.rep.peak.roundToInt()} degrees")
        }
        is MotionEvent.RepRejected -> voice.say(text(event.rep.faults.firstOrNull()))
        is MotionEvent.FormFault -> voice.say(text(event.feedback))   // live correction
        MotionEvent.HoldStarted -> voice.say("Hold it")
        is MotionEvent.VisibilityChanged ->
            voice.say(if (event.visibility.isVisible) "I can see you" else "I can't see all of you")
        is MotionEvent.SetupChanged -> event.issues.firstOrNull()?.let { voice.say(text(it)) }
        is MotionEvent.BaselineCompleted -> saveBaseline(event.value)
    }
}
```

| Event | When |
| --- | --- |
| `RepCompleted(rep)` | A clean rep (or hold) finished |
| `RepRejected(rep)` | One finished with poor form; `rep.faults` says why |
| `HoldStarted` | Holds: the value crossed the threshold and the clock started |
| `FormFault(feedback)` | A rule was broken for ~0.25 s; once per rep and fault |
| `VisibilityChanged(visibility)` | The joints came into view or left it (debounced) |
| `SetupChanged(issues)` | The placement problems changed (debounced) |
| `BaselineCompleted(value)` | The baseline measurement finished |

## Correction texts

The SDK ships no texts: `FormFeedback` and `SetupIssue` are `enum class`es with a stable `rawValue` (`"keepUpperArmStill"`), meant for your app to translate.

```kotlin
fun text(fault: FormFeedback?): String = when (fault) {
    FormFeedback.KEEP_UPPER_ARM_STILL -> "Keep your arm against your body"
    FormFeedback.KEEP_THIGH_STILL -> "Keep your thigh still"
    FormFeedback.KEEP_ELBOW_STRAIGHT -> "Straighten your elbow"
    FormFeedback.KEEP_TRUNK_UPRIGHT -> "Keep your trunk upright"
    FormFeedback.KEEP_SHOULDERS_LEVEL -> "Level your shoulders"
    FormFeedback.KEEP_KNEE_STRAIGHT -> "Straighten your knee"
    FormFeedback.KEEP_HIPS_LEVEL -> "Level your hips"
    null -> "Watch your form"
}
```

## Processing by hand

If you already have your own pose loop, skip `start(provider, scope)` and call `process(pose)`. It returns that frame's events (and also emits them to listeners):

```kotlin
val events = session.process(pose)
```

`run(provider)` is the `suspend` version of `start(provider, scope)`: it reads until the source ends or the coroutine is cancelled. Useful when you manage the coroutine yourself, or in tests.
