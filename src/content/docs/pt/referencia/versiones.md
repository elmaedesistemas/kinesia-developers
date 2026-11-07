---
title: Versões
description: Histórico de versões do KinesiaMotion para iOS.
next: false
---

A versão estável atual é a **0.5.2**. Repositório: [kinesia-motion-ios](https://github.com/elmaedesistemas/kinesia-motion-ios). Fixe uma versão exata no seu `Package.swift` e consulte esta página antes de atualizar.

| Versão | Data | Mudanças |
| --- | --- | --- |
| `0.5.2` | 2026-11-06 | Correção: o modelo 3D do Vision falhava em cada quadro da câmera; agora recebe imagens BGRA. |
| `0.5.1` | 2026-11-06 | Correção: com a câmera frontal, os pontos 3D do braço ativo eram descartados e a medida continuava em 2D. O console do Xcode indica se os pontos 3D chegam (categoria `vision3d`). |
| `0.5.0` | 2026-11-06 | **Escolher 2D ou 3D:** `MotionSession(space:)` e `RepEngine.space` (`.image`, `.world` ou automático). |
| `0.4.0` | 2026-11-06 | **Medição 3D:** `Pose.world`, `MeasureSpace`, `imageValue`/`worldValue`; `VisionPoseProvider` e `VideoPoseProvider` com `world: true`; `kinesia-validate` compara 2D e 3D. Veja [Medição 3D](/pt/guias/medicion-3d/). |
| `0.3.0` | 2026-10-25 | **`kinesia-validate`**: ferramenta para comparar os ângulos com um goniômetro a partir de vídeos e um CSV. Sem mudanças na API. |
| `0.2.0` | 2026-10-24 | **`VideoPoseProvider`**: poses a partir de um vídeo (`.mov`, `.mp4`) com o mesmo detector da câmera, em iOS e macOS; `readAll()` devolve todas as poses. |
| `0.1.0` | 2026-10-24 | **Primeira versão estável.** Mesmo código da `0.1.0-alpha.9`, com `CHANGELOG.md`. A precisão frente ao goniômetro (meta ±5°) é validada no piloto. |
| `0.1.0-alpha.9` | 2026-10-17 | **Qualidade da medição:** `SetupCheck` e `SetupIssue`, evento `.setupChanged`; métricas por repetição (`riseDuration`, `returnDuration`, `peakVelocity`, `confidence`) e `peakSpread`; confiança no snapshot. |
| `0.1.0-alpha.8` | 2026-10-17 | `Pose` traz confiança por articulação. Correção: `RecordedPoseProvider` em tempo real esperava o triplo. |
| `0.1.0-alpha.7` | 2026-10-17 | Exercícios de sustentação (`.hold`, `.holdStarted`, `holdProgress`). Novos no catálogo: ombro, quadril, tornozelo e pescoço. |
| `0.1.0-alpha.6` | 2026-10-17 | O SDK passa a se chamar **KinesiaMotion** (antes KinetiaMotion). |
| `0.1.0-alpha.5` | 2026-10-04 | `Pose.imageSize` e `MotionSession.peaks`. |
| `0.1.0-alpha.3` / `alpha.4` | 2026-10-04 | Módulo de câmera com `VisionPoseProvider`. |
| `0.1.0-alpha.2` | 2026-10-04 | Medição inicial (`startBaseline`). |
| `0.1.0-alpha.1` | 2026-10-04 | Primeira versão: geometria, medições, exercícios, `RepEngine` e `MotionSession` com snapshot, eventos e visibilidade. |
