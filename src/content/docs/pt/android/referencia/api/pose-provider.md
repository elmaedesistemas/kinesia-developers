---
title: PoseProvider
description: As fontes de poses incluídas e como escrever a sua.
sidebar:
  order: 2
---

```kotlin
public fun interface PoseProvider {
    public fun poses(): Flow<Pose>
}
```

Qualquer coisa que produza poses. Cada `collect` de `poses()` começa um fluxo novo. Quando o consumidor para de coletar (cancela sua corrotina ou sai do scope), o fluxo termina e o provedor libera o que estava usando.

## `CameraPoseProvider`

Módulo `kinesia-motion-camera`. Veja o [guia](/pt/android/camara-mediapipe/).

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

| Membro | |
| --- | --- |
| `camera: Camera` | `Camera.FRONT` ou `Camera.BACK`. |
| `minimumConfidence: Double` | Pontos com menos confiança são descartados. |
| `previewSurface` | Onde mostrar a imagem ao vivo, por exemplo `previewView.surfaceProvider`. |
| `modelAssetPath` | O modelo do MediaPipe. Por padrão, `pose_landmarker_lite.task`, incluído no módulo. |
| `CameraPoseProvider.isAuthorized(context): Boolean` | Se já há permissão de câmera. |

## `VideoPoseProvider`

Módulo `kinesia-motion-camera`. Veja [Testes e gravações](/pt/android/guias/pruebas-y-grabaciones/).

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

| Membro | |
| --- | --- |
| `uri: Uri` | O vídeo. É processado no dispositivo. |
| `framesPerSecond: Double` | Quantos quadros são lidos por segundo de vídeo. |
| `mirrored: Boolean` | `true` se o vídeo parece um espelho; os lados passam a ser os do paciente. |
| `minimumConfidence: Double` | Pontos com menos confiança são descartados. |
| `suspend readAll(): List<Pose>` | Todas as poses de uma vez. |

## `BlazePose`

Módulo `kinesia-motion`. Converte os 33 pontos do MediaPipe em uma `Pose`.

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

Módulo `kinesia-motion`. Veja [Testes e gravações](/pt/android/guias/pruebas-y-grabaciones/).

```kotlin
RecordedPoseProvider(recording: List<Pose>, realTime: Boolean = false)
```

## Escrever o seu

Por exemplo, para poses vindas de outro detector:

```kotlin
class MyDetectorProvider(private val detector: MyDetector) : PoseProvider {
    override fun poses(): Flow<Pose> = callbackFlow {
        val token = detector.onFrame { result ->
            trySend(
                Pose(
                    points = result.pointsInPixels,      // y para baixo
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

Respeite o [contrato de Pose](/pt/android/conceptos/pose/): pixels com `y` para baixo, lados anatômicos e só pontos confiáveis. `conflate()` evita acumular quadros antigos se o consumidor for lento.
