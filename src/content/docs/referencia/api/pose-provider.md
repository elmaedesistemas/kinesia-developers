---
title: PoseProvider
description: Fuentes de poses incluidas (cámara, video y grabaciones) y cómo escribir la tuya.
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

## `VideoPoseProvider`

Módulo `KinesiaMotionVision`, iOS y macOS. Desde 0.2.0. Ver [Pruebas y grabaciones](/guias/pruebas-y-grabaciones/).

```swift
init(url: URL,
     mirrored: Bool = false,
     minimumConfidence: Float = 0.3,
     maximumFrameRate: Double = 30,
     realTime: Bool = false)
```

| Miembro | |
| --- | --- |
| `url: URL` | El video (`.mov`, `.mp4`). Se procesa en el dispositivo. |
| `mirrored: Bool` | `true` si el video se ve como espejo; los lados se pasan a los del paciente. |
| `minimumConfidence: Float` | Puntos con menos confianza se descartan. |
| `maximumFrameRate: Double` | Salta cuadros más juntos que `1 / maximumFrameRate`. |
| `realTime: Bool` | Espera entre cuadros como en el video. |
| `readAll() async throws -> [Pose]` | Todas las poses de una vez. Lanza `ReadError` si no puede leer el archivo. |

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
