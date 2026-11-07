---
title: Versiones
description: Historial de versiones de KinesiaMotion para Android.
---

La versión actual es **0.3.0**. Repositorio: [kinesia-motion-android](https://github.com/elmaedesistemas/kinesia-motion-android). Fija una versión exacta en Gradle y revisa esta página antes de actualizar.

| Versión | Fecha | Cambios |
| --- | --- | --- |
| `0.3.0` | 2026-11-06 | **Elegir 2D o 3D:** `MotionSession(space = …)` y `RepEngine.space` (`IMAGE`, `WORLD` o automático). |
| `0.2.0` | 2026-11-06 | **Medición 3D:** `Pose.world` (`Point3`), `MeasureSpace`, `imageValue`/`worldValue`; `BlazePose.pose(worldLandmarks = …)`; `CameraPoseProvider` y `VideoPoseProvider` con `world = true`. Ver [Medición 3D](/android/guias/medicion-3d/). |
| `0.1.0` | 2026-10-25 | **Primera versión.** `kinesia-motion`: el motor en Kotlin puro, con 8 ejercicios, repeticiones, sostenidos, técnica, ubicación y medición inicial. `kinesia-motion-camera`: `CameraPoseProvider` (CameraX) y `VideoPoseProvider`, sobre MediaPipe Pose Landmarker. El módulo de cámara aún no se ha validado en dispositivos. |
