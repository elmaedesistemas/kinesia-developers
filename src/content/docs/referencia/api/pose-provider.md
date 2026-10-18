---
title: PoseProvider
description: Fuentes de poses incluidas y cómo escribir la tuya.
sidebar:
  order: 2
---

```swift
public protocol PoseProvider: Sendable {
    func poses() -> AsyncStream<Pose>
}
```

Cualquier cosa que produzca poses. Cada llamada a `poses()` empieza un flujo nuevo. Cuando el consumidor deja de iterar (sale del bucle o cancela su tarea), el flujo termina y el proveedor libera lo que usaba.

## `VisionPoseProvider`

Módulo `KinesiaMotionVision`, solo iOS. Ver la [guía](/guias/camara-vision/).

```swift
init(camera: Camera = .front, minimumConfidence: Float = 0.3)
```

| Miembro | |
| --- | --- |
| `captureSession: AVCaptureSession` | Para una `AVCaptureVideoPreviewLayer`. |
| `camera: Camera` | `.front` o `.back`. |
| `minimumConfidence: Float` | Puntos con menos confianza se descartan. |
| `static isAuthorized: Bool` | Si ya hay permiso de cámara. |
| `static requestAccess() async -> Bool` | Pide el permiso. |

## `RecordedPoseProvider`

Módulo `KinesiaMotion`. Ver [Pruebas y grabaciones](/guias/pruebas-y-grabaciones/).

```swift
init(_ recording: [Pose], realTime: Bool = false)
```

## Escribir el tuyo

Por ejemplo, para poses que llegan de otro detector:

```swift
struct MyDetectorProvider: PoseProvider {
    let detector: MyDetector

    func poses() -> AsyncStream<Pose> {
        AsyncStream(bufferingPolicy: .bufferingNewest(1)) { continuation in
            let token = detector.onFrame { result in
                continuation.yield(Pose(
                    points: result.pointsInPixels,      // y hacia abajo
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

Respeta el [contrato de Pose](/conceptos/pose/): píxeles con `y` hacia abajo, lados anatómicos y solo puntos confiables. `.bufferingNewest(1)` evita acumular fotogramas viejos si el consumidor va lento.
