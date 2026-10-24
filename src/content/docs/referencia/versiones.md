---
title: Versiones
description: Historial de versiones de KinesiaMotion.
---

La versión estable actual es **0.1.0**. Fija una versión exacta en tu `Package.swift` y revisa esta página antes de actualizar.

| Versión | Fecha | Cambios |
| --- | --- | --- |
| `0.1.0` | 2026-10-24 | **Primera versión estable.** Mismo código que `0.1.0-alpha.9`, con `CHANGELOG.md`. La precisión frente al goniómetro (meta ±5°) se valida en el piloto. |
| `0.1.0-alpha.9` | 2026-10-17 | **Calidad de la medición:** `SetupCheck` y `SetupIssue`, evento `.setupChanged`; métricas por repetición (`riseDuration`, `returnDuration`, `peakVelocity`, `confidence`) y `peakSpread`; confianza en el snapshot. |
| `0.1.0-alpha.8` | 2026-10-17 | `Pose` trae confianza por articulación. Corrección: `RecordedPoseProvider` en tiempo real esperaba el triple. |
| `0.1.0-alpha.7` | 2026-10-17 | Ejercicios de sostenido (`.hold`, `.holdStarted`, `holdProgress`). Nuevos en el catálogo: hombro, cadera, tobillo y cuello. |
| `0.1.0-alpha.6` | 2026-10-17 | El SDK pasa a llamarse **KinesiaMotion** (antes KinetiaMotion). |
| `0.1.0-alpha.5` | 2026-10-04 | `Pose.imageSize` y `MotionSession.peaks`. |
| `0.1.0-alpha.3` / `alpha.4` | 2026-10-04 | Módulo de cámara con `VisionPoseProvider`. |
| `0.1.0-alpha.2` | 2026-10-04 | Medición inicial (`startBaseline`). |
| `0.1.0-alpha.1` | 2026-10-04 | Primera versión: geometría, mediciones, ejercicios, `RepEngine` y `MotionSession` con snapshot, eventos y visibilidad. |
