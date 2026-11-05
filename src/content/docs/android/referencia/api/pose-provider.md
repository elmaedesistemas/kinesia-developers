---
title: PoseProvider
description: Fuentes de poses incluidas (cámara, video y grabaciones) y cómo escribir la tuya.
sidebar:
  order: 2
---

```kotlin
public fun interface PoseProvider {
    public fun poses(): Flow<Pose>
}
```

Cualquier cosa que produzca poses. Cada `collect` de `poses()` empieza un flujo nuevo. Cuando el consumidor deja de recolectar (cancela su corrutina o sale del scope), el flujo termina y el proveedor libera lo que usaba.

## `CameraPoseProvider`

Módulo `kinesia-motion-camera`. Ver la [guía](/android/camara-mediapipe/).

```kotlin
CameraPoseProvider(
    context: Context,
    lifecycleOwner: LifecycleOwner,
    camera: Camera = Camera.FRONT,
    minimumConfidence: Double = 0.3,
    previewSurface: Preview.SurfaceProvider? = null,
    modelAssetPath: String = DEFAULT_POSE_MODEL,
)
```

| Miembro | |
| --- | --- |
| `camera: Camera` | `Camera.FRONT` o `Camera.BACK`. |
| `minimumConfidence: Double` | Puntos con menos confianza se descartan. |
| `previewSurface` | Dónde mostrar la imagen en vivo, por ejemplo `previewView.surfaceProvider`. |
| `modelAssetPath` | El modelo de MediaPipe. Por defecto, `pose_landmarker_lite.task`, incluido en el módulo. |
| `CameraPoseProvider.isAuthorized(context): Boolean` | Si ya hay permiso de cámara. |

## `VideoPoseProvider`

Módulo `kinesia-motion-camera`. Ver [Pruebas y grabaciones](/android/guias/pruebas-y-grabaciones/).

```kotlin
VideoPoseProvider(
    context: Context,
    uri: Uri,
    framesPerSecond: Double = 24.0,
    mirrored: Boolean = false,
    minimumConfidence: Double = 0.3,
    modelAssetPath: String = DEFAULT_POSE_MODEL,
)
```

| Miembro | |
| --- | --- |
| `uri: Uri` | El video. Se procesa en el dispositivo. |
| `framesPerSecond: Double` | Cuántos cuadros se leen por segundo de video. |
| `mirrored: Boolean` | `true` si el video se ve como espejo; los lados se pasan a los del paciente. |
| `minimumConfidence: Double` | Puntos con menos confianza se descartan. |
| `suspend readAll(): List<Pose>` | Todas las poses de una vez. |

## `BlazePose`

Módulo `kinesia-motion`. Convierte los 33 puntos de MediaPipe en una `Pose`.

```kotlin
BlazePose.pose(
    landmarks: List<BlazePose.Landmark>,   // x, y (0..1), confidence
    imageSize: Size,
    timestamp: Double,
    mirrored: Boolean = false,
    minimumConfidence: Double = 0.3,
): Pose
```

## `RecordedPoseProvider`

Módulo `kinesia-motion`. Ver [Pruebas y grabaciones](/android/guias/pruebas-y-grabaciones/).

```kotlin
RecordedPoseProvider(recording: List<Pose>, realTime: Boolean = false)
```

## Escribir el tuyo

Por ejemplo, para poses que llegan de otro detector:

```kotlin
class MyDetectorProvider(private val detector: MyDetector) : PoseProvider {
    override fun poses(): Flow<Pose> = callbackFlow {
        val token = detector.onFrame { result ->
            trySend(
                Pose(
                    points = result.pointsInPixels,      // y hacia abajo
                    timestamp = result.time,
                    imageSize = result.imageSize,
                    confidence = result.confidence,
                ),
            )
        }
        awaitClose { detector.stop(token) }
    }.conflate()
}
```

Respeta el [contrato de Pose](/android/conceptos/pose/): píxeles con `y` hacia abajo, lados anatómicos y solo puntos confiables. `conflate()` evita acumular fotogramas viejos si el consumidor va lento.
