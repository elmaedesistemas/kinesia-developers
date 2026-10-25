---
title: Introduction
description: What KinesiaMotion is, which platforms it runs on and what it solves.
---

**KinesiaMotion** is the SDK the Kinesia app uses to measure a patient's movement with the phone camera, on **iOS** and **Android**. It takes body points frame by frame and returns what a rehab app needs: the current angle, the reps done, the ones done with poor form, and whether the patient is well placed in front of the camera.

## Platforms and modules

On each platform the SDK has two parts: an **engine** with no camera and no UI, and a **camera module** that detects the body and delivers poses. Both engines measure the same: the same angles, the same rep counting, the same catalog and the same exercise JSON.

| Platform | Engine | Camera | Detector | Repository |
| --- | --- | --- | --- | --- |
| iOS | `KinesiaMotion` (Swift) | `KinesiaMotionVision` | Apple Vision | [kinesia-motion-ios](https://github.com/elmaedesistemas/kinesia-motion-ios) |
| Android | `kinesia-motion` (Kotlin) | `kinesia-motion-camera` | MediaPipe Pose Landmarker | [kinesia-motion-android](https://github.com/elmaedesistemas/kinesia-motion-android) |
| Web | — | — | MediaPipe | Soon |

The split is deliberate: the engine can be tested without a phone (on macOS or on the JVM) with recorded poses, and the pose source can be swapped (another detector, a file, a server) without touching anything else.

The guides show their examples in Swift. For Android, see the [differences from iOS](/en/android/diferencias-con-ios/).

## What it does

- **Measures in degrees** with four kinds of measure: inner angle, flexion, angle from vertical and tilt.
- **Counts reps** with hysteresis thresholds, and **times holds** (keeping a position for N seconds).
- **Checks form**: each exercise has form rules; it cues live and rejects reps that break them.
- **Checks placement**: detects whether the patient should turn, move closer or step back.
- **Measures quality**: detector confidence per rep, peak velocity, rise and return times.
- **Baseline measurement**: the median of the first N clean reps.

## What it doesn't do

- It doesn't draw UI. It gives you a `MotionSnapshot` you can observe and an event stream; the screen, voice and haptics are yours.
- It doesn't store data. You decide where to persist the reps (`session.reps`).
- It doesn't translate. Corrections (`FormFeedback`, `SetupIssue`) are `enum` cases; your app turns them into text and speech in the patient's language.

:::caution[Clinical use]
KinesiaMotion measures in 2D from a single camera. Measurements are meant to track the progress of the same patient in the same posture; they don't replace clinical goniometry.
:::

## Requirements

**iOS**
- iOS 17 or later (macOS 14 for the engine and tests).
- Swift 6 with strict concurrency: every public type is `Sendable`.
- `KinesiaMotionVision` only works on iOS (it needs a camera).

**Android**
- `minSdk 24` (Android 7.0) or later.
- The engine is pure Kotlin and runs on any JVM; the camera module needs Android.
