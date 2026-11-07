---
title: Releases
description: KinesiaMotion release history for iOS.
next: false
---

The current stable release is **0.5.4**. Repository: [kinesia-motion-ios](https://github.com/elmaedesistemas/kinesia-motion-ios). Pin an exact version in your `Package.swift` and check this page before updating.

| Version | Date | Changes |
| --- | --- | --- |
| `0.5.4` | 2026-11-07 | Fix: 3D joints take their side from Vision's names, and with 3D the camera captures at 720p so the person isn't lost. |
| `0.5.3` | 2026-11-06 | Fix: 3D runs on the un-mirrored image (Vision's 3D model fails on the mirrored front camera) and switches itself off if it keeps failing. |
| `0.5.2` | 2026-11-06 | Fix: Vision's 3D body pose failed on every camera frame; it now gets BGRA frames. |
| `0.5.1` | 2026-11-06 | Fix: with the front camera, the active arm's 3D points were dropped and the measure stayed in 2D. The Xcode console says whether 3D points arrive (category `vision3d`). |
| `0.5.0` | 2026-11-06 | **Choose 2D or 3D:** `MotionSession(space:)` and `RepEngine.space` (`.image`, `.world` or automatic). |
| `0.4.0` | 2026-11-06 | **3D measurement:** `Pose.world`, `MeasureSpace`, `imageValue`/`worldValue`; `VisionPoseProvider` and `VideoPoseProvider` with `world: true`; `kinesia-validate` compares 2D and 3D. See [3D measurement](/en/guias/medicion-3d/). |
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
