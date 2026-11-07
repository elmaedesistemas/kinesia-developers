---
title: Releases
description: KinesiaMotion for Android release history.
---

The current release is **0.3.0**. Repository: [kinesia-motion-android](https://github.com/elmaedesistemas/kinesia-motion-android). Pin an exact version in Gradle and check this page before updating.

| Version | Date | Changes |
| --- | --- | --- |
| `0.3.0` | 2026-11-06 | **Choose 2D or 3D:** `MotionSession(space = …)` and `RepEngine.space` (`IMAGE`, `WORLD` or automatic). |
| `0.2.0` | 2026-11-06 | **3D measurement:** `Pose.world` (`Point3`), `MeasureSpace`, `imageValue`/`worldValue`; `BlazePose.pose(worldLandmarks = …)`; `CameraPoseProvider` and `VideoPoseProvider` with `world = true`. See [3D measurement](/en/android/guias/medicion-3d/). |
| `0.1.0` | 2026-10-25 | **First release.** `kinesia-motion`: the engine in pure Kotlin, with 8 exercises, reps, holds, form, placement and baseline measurement. `kinesia-motion-camera`: `CameraPoseProvider` (CameraX) and `VideoPoseProvider`, on MediaPipe Pose Landmarker. The camera module hasn't been validated on devices yet. |
