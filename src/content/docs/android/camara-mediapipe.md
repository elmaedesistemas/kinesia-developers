---
title: Cámara con MediaPipe
description: Usa CameraPoseProvider y VideoPoseProvider para obtener poses en Android.
---

En Android, las poses salen de **MediaPipe Pose Landmarker**, el mismo modelo que usará el SDK web. `CameraPoseProvider` lo corre sobre la cámara con CameraX, y `VideoPoseProvider` sobre un archivo de video. Los dos entregan poses que cumplen el [contrato de Pose](/conceptos/pose/), así que el motor mide igual que en iOS.

```kotlin
import one.kinesia.motion.camera.CameraPoseProvider

val camera = CameraPoseProvider(
    context = context,
    lifecycleOwner = lifecycleOwner,
    camera = CameraPoseProvider.Camera.FRONT,          // FRONT o BACK
    minimumConfidence = 0.3,                           // puntos por debajo se descartan
    previewSurface = previewView.surfaceProvider,      // opcional: la imagen en vivo
)
```

## Ciclo de vida

La cámara **se enciende sola** cuando alguien empieza a recolectar `poses()` y **se apaga sola** cuando deja de hacerlo. Con `MotionSession`:

```kotlin
session.start(camera, lifecycleScope)  // enciende
session.stop()                         // apaga
```

Además, la cámara está ligada al `lifecycleOwner`: CameraX la pausa cuando la pantalla deja de estar visible.

:::caution[Un flujo a la vez]
Cada `CameraPoseProvider` atiende un solo flujo. Para medir los dos lados con la misma cámara, reparte cada pose a dos sesiones desde un solo `collect` (ver abajo).
:::

## Mostrar la imagen

Pasa `previewView.surfaceProvider` (de `androidx.camera.view.PreviewView`) en `previewSurface`. Con la cámara frontal, la vista previa se ve espejada y los puntos de la pose están en ese mismo cuadro espejado: puedes dibujarlos encima sin voltear la `x`. Los **lados** sí son los reales del paciente.

`PreviewView` recorta la imagen para llenar la pantalla (`FILL_CENTER`). Para dibujar los puntos encima, escálalos con `pose.imageSize` igual que la vista previa.

## Qué hace por dentro

- Analiza los fotogramas con CameraX (`ImageAnalysis`, por defecto 640×480) y descarta los atrasados: si tu código va lento, siempre recibes la pose más nueva.
- Endereza cada fotograma según la orientación del sensor y, con la cámara frontal, lo espeja como la vista previa.
- Corre MediaPipe en modo video (un solo cuerpo) en un hilo propio.
- Convierte los 33 puntos de BlazePose a los 19 `Joint` del SDK con `BlazePose.pose(...)`. El cuello (`NECK`) y la raíz (`ROOT`) no existen en BlazePose: son el punto medio de los hombros y de las caderas.
- Usa la `visibility` de MediaPipe como confianza por punto.
- Envía poses vacías cuando no detecta a nadie.

## Los dos lados con una cámara

```kotlin
val camera = CameraPoseProvider(context, lifecycleOwner)
val left = MotionSession(exercise, BodySide.LEFT)
val right = MotionSession(exercise, BodySide.RIGHT)

val job = lifecycleScope.launch {
    camera.poses().collect { pose ->
        left.process(pose)
        right.process(pose)
    }
}
// Para terminar: job.cancel()  → la cámara se apaga
```

## Desde un video

`VideoPoseProvider` lee un video con el mismo modelo, por ejemplo para comparar con un goniómetro o repasar una sesión grabada:

```kotlin
import one.kinesia.motion.camera.VideoPoseProvider

val poses = VideoPoseProvider(context, uri, framesPerSecond = 24.0).readAll()

val session = MotionSession(ExerciseLibrary.elbowFlexion, BodySide.RIGHT)
poses.forEach { session.process(it) }
println(session.peaks)
```

Los fotogramas se leen tan rápido como permite el teléfono, no en tiempo real, y el `timestamp` de cada pose es su posición en el video, en segundos.

## Otro detector

Si ya tienes otro detector de pose, no necesitas el módulo de cámara: arma las `Pose` tú mismo y pásalas a `session.process(pose)`. Si tu detector da los 33 puntos de BlazePose (por ejemplo, MediaPipe en otra configuración), `BlazePose.pose(...)` hace la conversión por ti.
