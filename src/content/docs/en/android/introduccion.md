---
title: Introduction to KinesiaMotion for Android
description: What the Android SDK is, which modules it has and what it solves.
prev: false
---

**KinesiaMotion for Android** measures a patient's movement with the phone camera. It's a Kotlin library: it takes body points frame by frame and returns what a rehab app needs: the current angle, the reps done, the ones done with poor form, and whether the patient is well placed in front of the camera.

## Two modules

| Module | What it contains | Depends on |
| --- | --- | --- |
| `kinesia-motion` | The engine: poses, measures, exercises, rep counting, session. Pure Kotlin, no Android, no camera, no UI. | Coroutines, kotlinx.serialization |
| `kinesia-motion-camera` | `CameraPoseProvider` and `VideoPoseProvider`: poses from the camera or a video, with MediaPipe Pose Landmarker. | `kinesia-motion`, CameraX, MediaPipe |

The split is deliberate: the engine is tested on the JVM with recorded poses, no emulator, and the pose source can be swapped (another detector, a file, a server) without touching anything else.

## What it does

- **Measures in degrees** with four kinds of measure: inner angle, flexion, angle from vertical and tilt.
- **Counts reps** with hysteresis thresholds, and **measures holds** (keeping a position for N seconds).
- **Checks form**: each exercise has form rules; it warns live and rejects the reps that break them.
- **Checks placement**: it detects whether the patient should turn, move closer or step back.
- **Measures quality**: detector confidence per rep, peak velocity, rise and return times.
- **Baseline measurement**: the median of the first N clean reps.

## What it doesn't do

- It doesn't draw UI. It gives you a `StateFlow<MotionSnapshot>` and a `SharedFlow<MotionEvent>`; the screen, voice and haptics are yours.
- It doesn't store data. You decide where to persist the reps (`session.reps`).
- It doesn't translate. Corrections (`FormFeedback`, `SetupIssue`) are `enum` cases; your app turns them into text and voice in the patient's language.

:::caution[Clinical use]
KinesiaMotion measures in 2D from a single camera. Measurements are useful to follow the same patient over time in the same posture; they don't replace clinical goniometry.
:::

## Requirements

- `minSdk 24` (Android 7.0) or later.
- Java 17 to build.
- The engine runs on any JVM; the camera module needs Android.

## Where to go next

1. [Installation](/en/android/instalacion/): add the dependencies with Gradle.
2. [Quick start](/en/android/inicio-rapido/): a Jetpack Compose screen that counts reps.
3. [How it works](/en/android/conceptos/como-funciona/): from a frame to a measured rep.
