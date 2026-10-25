---
title: Versiones
description: Historial de versiones de KinesiaMotion para iOS y Android.
---

Cada plataforma tiene sus propias versiones. Fija una versión exacta y revisa esta página antes de actualizar.

## Android

La versión actual es **0.1.0**. Repositorio: [kinesia-motion-android](https://github.com/elmaedesistemas/kinesia-motion-android).

| Versión | Fecha | Cambios |
| --- | --- | --- |
| `0.1.0` | 2026-10-25 | **Primera versión**, equivalente a iOS `0.3.0`: el motor en Kotlin puro con los mismos ángulos, conteo, catálogo y JSON, y pruebas JVM que reproducen las de Swift. `kinesia-motion-camera` con `CameraPoseProvider` (CameraX) y `VideoPoseProvider`, sobre MediaPipe Pose Landmarker. El módulo de cámara aún no se ha validado en dispositivos. |

## iOS

La versión estable actual es **0.3.0**. Repositorio: [kinesia-motion-ios](https://github.com/elmaedesistemas/kinesia-motion-ios) (antes `kinesia-motion`).

| Versión | Fecha | Cambios |
| --- | --- | --- |
| `0.3.0` | 2026-10-25 | **`kinesia-validate`**: herramienta para comparar los ángulos con un goniómetro a partir de videos y un CSV. Sin cambios en la API. |
| `0.2.0` | 2026-10-24 | **`VideoPoseProvider`**: poses desde un video (`.mov`, `.mp4`) con el mismo detector que la cámara, en iOS y macOS; `readAll()` devuelve todas las poses. |
| `0.1.0` | 2026-10-24 | **Primera versión estable.** Mismo código que `0.1.0-alpha.9`, con `CHANGELOG.md`. La precisión frente al goniómetro (meta ±5°) se valida en el piloto. |
| `0.1.0-alpha.9` | 2026-10-17 | **Calidad de la medición:** `SetupCheck` y `SetupIssue`, evento `.setupChanged`; métricas por repetición (`riseDuration`, `returnDuration`, `peakVelocity`, `confidence`) y `peakSpread`; confianza en el snapshot. |
| `0.1.0-alpha.8` | 2026-10-17 | `Pose` trae confianza por articulación. Corrección: `RecordedPoseProvider` en tiempo real esperaba el triple. |
| `0.1.0-alpha.7` | 2026-10-17 | Ejercicios de sostenido (`.hold`, `.holdStarted`, `holdProgress`). Nuevos en el catálogo: hombro, cadera, tobillo y cuello. |
| `0.1.0-alpha.6` | 2026-10-17 | El SDK pasa a llamarse **KinesiaMotion** (antes KinetiaMotion). |
| `0.1.0-alpha.5` | 2026-10-04 | `Pose.imageSize` y `MotionSession.peaks`. |
| `0.1.0-alpha.3` / `alpha.4` | 2026-10-04 | Módulo de cámara con `VisionPoseProvider`. |
| `0.1.0-alpha.2` | 2026-10-04 | Medición inicial (`startBaseline`). |
| `0.1.0-alpha.1` | 2026-10-04 | Primera versión: geometría, mediciones, ejercicios, `RepEngine` y `MotionSession` con snapshot, eventos y visibilidad. |
