---
title: Cámara en vivo con Vision
description: Usa VisionPoseProvider para obtener poses de la cámara del iPhone.
---

`VisionPoseProvider` (módulo `KinesiaMotionVision`, solo iOS) abre la cámara, corre el detector de cuerpo 2D de Vision en cada fotograma y entrega poses que ya cumplen el [contrato de Pose](/conceptos/pose/).

```swift
import KinesiaMotionVision

let camera = VisionPoseProvider(
    camera: .front,          // .front o .back
    minimumConfidence: 0.3   // puntos por debajo se descartan
)
```

## Permiso

```swift
if !VisionPoseProvider.isAuthorized {
    let granted = await VisionPoseProvider.requestAccess()
    guard granted else {
        // Muestra cómo activar la cámara en Ajustes
        return
    }
}
```

Recuerda la clave `NSCameraUsageDescription` en `Info.plist` ([Instalación](/empezar/instalacion/#permiso-de-cámara)).

## Ciclo de vida

La cámara **se enciende sola** cuando alguien empieza a iterar `poses()` y **se apaga sola** cuando deja de hacerlo. Con `MotionSession` eso significa:

```swift
session.start(with: camera)  // enciende
session.stop()               // apaga
```

No hace falta llamar `startRunning()` ni `stopRunning()` en `captureSession`.

:::caution[Un flujo a la vez]
Cada `VisionPoseProvider` atiende un solo flujo. Si necesitas medir los dos lados con la misma cámara, crea dos `MotionSession` y reparte cada pose a ambas desde un solo bucle (ver abajo), en lugar de llamar `start(with:)` dos veces con el mismo proveedor.
:::

## Mostrar la imagen

`captureSession` es un `AVCaptureSession` normal: pásalo a un `AVCaptureVideoPreviewLayer`. El ejemplo completo de `CameraPreview` para SwiftUI está en el [inicio rápido](/empezar/inicio-rapido/#el-ejemplo-completo).

Con la cámara frontal, la capa de vista previa se ve espejada (como un espejo), pero las poses traen los lados **reales** del paciente. Si dibujas los puntos encima, espeja la `x` al dibujar, no al medir.

## Qué hace por dentro

- Resolución VGA (640×480), suficiente para el detector y liviana para la batería.
- Descarta los fotogramas atrasados: si tu código va lento, siempre recibes la pose más nueva.
- Convierte las coordenadas de Vision (normalizadas, origen abajo) a píxeles con `y` hacia abajo, para una imagen vertical.
- Con la cámara frontal intercambia izquierda y derecha.
- Envía también poses vacías cuando no detecta a nadie.

## Los dos lados con una cámara

Así lo hace la app de Kinesia: una sola cámara, una sesión por lado.

```swift
let camera = VisionPoseProvider(camera: .front)
let left = MotionSession(exercise: exercise, side: .left)
let right = MotionSession(exercise: exercise, side: .right)

let task = Task { @MainActor in
    for await pose in camera.poses() {
        left.process(pose)
        right.process(pose)
    }
}
// Para terminar: task.cancel()  → la cámara se apaga
```
