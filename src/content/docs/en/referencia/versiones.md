---
title: Releases
description: KinesiaMotion release history for iOS and Android.
---

Each platform has its own versions. Pin an exact version and check this page before updating.

## Android

The current release is **0.1.0**. Repository: [kinesia-motion-android](https://github.com/elmaedesistemas/kinesia-motion-android).

| Version | Date | Changes |
| --- | --- | --- |
| `0.1.0` | 2026-10-25 | **First release**, equivalent to iOS `0.3.0`: the engine in pure Kotlin with the same angles, rep counting, catalog and JSON, and JVM tests that reproduce the Swift ones. `kinesia-motion-camera` with `CameraPoseProvider` (CameraX) and `VideoPoseProvider`, on MediaPipe Pose Landmarker. The camera module hasn't been validated on devices yet. |

## iOS

The current stable release is **0.3.0**. Repository: [kinesia-motion-ios](https://github.com/elmaedesistemas/kinesia-motion-ios) (formerly `kinesia-motion`).

| Version | Date | Changes |
| --- | --- | --- |
| `0.3.0` | 2026-10-25 | **`kinesia-validate`**: a tool to compare angles with a goniometer from videos and a CSV. No API changes. |
| `0.2.0` | 2026-10-24 | **`VideoPoseProvider`**: poses from a video file (`.mov`, `.mp4`) with the same detector as the camera, on iOS and macOS; `readAll()` returns every pose. |
| `0.1.0` | 2026-10-24 | **First stable release.** Same code as `0.1.0-alpha.9`, plus `CHANGELOG.md`. Accuracy against a goniometer (target ±5°) is validated in the pilot. |
| `0.1.0-alpha.9` | 2026-10-17 | **Measurement quality:** `SetupCheck` and `SetupIssue`, `.setupChanged` event; per-rep metrics (`riseDuration`, `returnDuration`, `peakVelocity`, `confidence`) and `peakSpread`; confidence in the snapshot. |
| `0.1.0-alpha.8` | 2026-10-17 | `Pose` carries per-joint confidence. Fix: real-time `RecordedPoseProvider` waited three times too long. |
| `0.1.0-alpha.7` | 2026-10-17 | Hold exercises (`.hold`, `.holdStarted`, `holdProgress`). New in the catalog: shoulder, hip, ankle and neck. |
| `0.1.0-alpha.6` | 2026-10-17 | The SDK is renamed **KinesiaMotion** (formerly KinetiaMotion). |
| `0.1.0-alpha.5` | 2026-10-04 | `Pose.imageSize` and `MotionSession.peaks`. |
| `0.1.0-alpha.3` / `alpha.4` | 2026-10-04 | Camera module with `VisionPoseProvider`. |
| `0.1.0-alpha.2` | 2026-10-04 | Baseline measurement (`startBaseline`). |
| `0.1.0-alpha.1` | 2026-10-04 | First release: geometry, measures, exercises, `RepEngine` and `MotionSession` with snapshot, events and visibility. |
