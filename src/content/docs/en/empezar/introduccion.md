---
title: Introduction
description: What KinesiaMotion is and what it solves.
---

**KinesiaMotion** is the SDK the Kinesia app uses to measure a patient's movement with the iPhone camera. It takes body points frame by frame and returns what a rehab app needs: the current angle, the reps done, the ones done with poor form, and whether the patient is well placed in front of the camera.

## Two modules

| Module | What it contains | Depends on |
| --- | --- | --- |
| `KinesiaMotion` | The engine: poses, measures, exercises, rep counting, session. Pure Swift, no camera, no UI. | Foundation, CoreGraphics, Observation |
| `KinesiaMotionVision` | `VisionPoseProvider`: live poses from the camera with Vision's body detector. | `KinesiaMotion`, AVFoundation, Vision |

The split is deliberate: the engine can be tested on macOS with recorded poses, and the pose source can be swapped (another detector, a file, a server) without touching anything else.

## What it does

- **Measures in degrees** with four kinds of measure: inner angle, flexion, angle from vertical and tilt.
- **Counts reps** with hysteresis thresholds, and **times holds** (keeping a position for N seconds).
- **Checks form**: each exercise has form rules; it cues live and rejects reps that break them.
- **Checks placement**: detects whether the patient should turn, move closer or step back.
- **Measures quality**: detector confidence per rep, peak velocity, rise and return times.
- **Baseline measurement**: the median of the first N clean reps.

## What it doesn't do

- It doesn't draw UI. It gives you an observable `MotionSnapshot` and an event stream; the screen, voice and haptics are yours.
- It doesn't store data. You decide where to persist the reps (`session.reps`).
- It doesn't translate. Corrections (`FormFeedback`, `SetupIssue`) are `enum` cases; your app turns them into text and speech in the patient's language.

:::caution[Clinical use]
KinesiaMotion measures in 2D from a single camera. Measurements are meant to track the progress of the same patient in the same posture; they don't replace clinical goniometry.
:::

## Requirements

- iOS 17 or later (macOS 14 for the engine and tests).
- Swift 6 with strict concurrency: every public type is `Sendable`.
- `KinesiaMotionVision` only works on iOS (it needs a camera).
