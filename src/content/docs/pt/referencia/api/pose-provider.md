---
title: PoseProvider
description: As fontes de poses incluídas e como escrever a sua.
sidebar:
  order: 2
---

```swift
public protocol PoseProvider: Sendable {
    func poses() -> AsyncStream<Pose>
}
```

Qualquer coisa que produza poses. Cada chamada a `poses()` começa um fluxo novo. Quando o consumidor para de iterar (sai do laço ou cancela sua tarefa), o fluxo termina e o provider libera o que estava usando.

## `VisionPoseProvider`

Módulo `KinesiaMotionVision`, só iOS. Veja o [guia](/pt/guias/camara-vision/).

```swift
init(camera: Camera = .front, minimumConfidence: Float = 0.3)
```

| Membro | |
| --- | --- |
| `captureSession: AVCaptureSession` | Para um `AVCaptureVideoPreviewLayer`. |
| `camera: Camera` | `.front` ou `.back`. |
| `minimumConfidence: Float` | Pontos com menos confiança são descartados. |
| `static isAuthorized: Bool` | Se já há permissão de câmera. |
| `static requestAccess() async -> Bool` | Pede a permissão. |

## `RecordedPoseProvider`

Módulo `KinesiaMotion`. Veja [Testes e gravações](/pt/guias/pruebas-y-grabaciones/).

```swift
init(_ recording: [Pose], realTime: Bool = false)
```

## Escrever o seu

Por exemplo, para poses vindas de outro detector:

```swift
struct MyDetectorProvider: PoseProvider {
    let detector: MyDetector

    func poses() -> AsyncStream<Pose> {
        AsyncStream(bufferingPolicy: .bufferingNewest(1)) { continuation in
            let token = detector.onFrame { result in
                continuation.yield(Pose(
                    points: result.pointsInPixels,      // y para baixo
                    timestamp: result.time,
                    imageSize: result.imageSize,
                    confidence: result.confidence
                ))
            }
            continuation.onTermination = { _ in detector.stop(token) }
        }
    }
}
```

Respeite o [contrato de Pose](/pt/conceptos/pose/): pixels com `y` para baixo, lados anatômicos e só pontos confiáveis. `.bufferingNewest(1)` evita acumular quadros velhos se o consumidor estiver lento.
