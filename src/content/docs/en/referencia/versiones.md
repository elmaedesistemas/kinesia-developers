---
title: Releases
description: KinesiaMotion release history.
---

KinesiaMotion is in **alpha**: the API may change between versions. Pin an exact version in your `Package.swift`.

| Version | Date | Changes |
| --- | --- | --- |
| `0.1.0-alpha.9` | 2026-10-17 | **Measurement quality:** `SetupCheck` and `SetupIssue`, `.setupChanged` event; per-rep metrics (`riseDuration`, `returnDuration`, `peakVelocity`, `confidence`) and `peakSpread`; confidence in the snapshot. |
| `0.1.0-alpha.8` | 2026-10-17 | `Pose` carries per-joint confidence. Fix: real-time `RecordedPoseProvider` waited three times too long. |
| `0.1.0-alpha.7` | 2026-10-17 | Hold exercises (`.hold`, `.holdStarted`, `holdProgress`). New in the catalog: shoulder, hip, ankle and neck. |
| `0.1.0-alpha.6` | 2026-10-17 | The SDK is renamed **KinesiaMotion** (formerly KinetiaMotion). |
| `0.1.0-alpha.5` | 2026-10-04 | `Pose.imageSize` and `MotionSession.peaks`. |
| `0.1.0-alpha.3` / `alpha.4` | 2026-10-04 | Camera module with `VisionPoseProvider`. |
| `0.1.0-alpha.2` | 2026-10-04 | Baseline measurement (`startBaseline`). |
| `0.1.0-alpha.1` | 2026-10-04 | First release: geometry, measures, exercises, `RepEngine` and `MotionSession` with snapshot, events and visibility. |
