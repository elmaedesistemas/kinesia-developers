---
title: Versiones
description: Historial de versiones de KinesiaMotion para iOS.
next: false
---

La versión estable actual es **0.5.2**. Repositorio: [kinesia-motion-ios](https://github.com/elmaedesistemas/kinesia-motion-ios). Fija una versión exacta en tu `Package.swift` y revisa esta página antes de actualizar.

| Versión | Fecha | Cambios |
| --- | --- | --- |
| `0.5.2` | 2026-11-06 | Corrección: el modelo 3D de Vision fallaba en cada fotograma de la cámara; ahora recibe imágenes BGRA. |
| `0.5.1` | 2026-11-06 | Corrección: con la cámara frontal, los puntos 3D del brazo activo se descartaban y la medida seguía en 2D. La consola de Xcode indica si llegan los puntos 3D (categoría `vision3d`). |
| `0.5.0` | 2026-11-06 | **Elegir 2D o 3D:** `MotionSession(space:)` y `RepEngine.space` (`.image`, `.world` o automático). |
| `0.4.0` | 2026-11-06 | **Medición 3D:** `Pose.world`, `MeasureSpace`, `imageValue`/`worldValue`; `VisionPoseProvider` y `VideoPoseProvider` con `world: true`; `kinesia-validate` compara 2D y 3D. Ver [Medición 3D](/guias/medicion-3d/). |
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
