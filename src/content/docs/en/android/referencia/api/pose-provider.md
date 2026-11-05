---
title: PoseProvider
description: The built-in pose sources and how to write your own.
sidebar:
  order: 2
---

```kotlin
public fun interface PoseProvider {
    public fun poses(): Flow<Pose>
}
```

Anything that produces poses. Each `collect` of `poses()` starts a new stream. When the consumer stops collecting (cancels its coroutine or leaves the scope), the stream ends and the provider releases what it was using.

## `CameraPoseProvider`

`kinesia-motion-camera` module. See the [guide](/en/android/camara-mediapipe/).

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

| Member | |
| --- | --- |
| `camera: Camera` | `Camera.FRONT` or `Camera.BACK`. |
| `minimumConfidence: Double` | Points with less confidence are dropped. |
| `previewSurface` | Where to show the live image, for example `previewView.surfaceProvider`. |
| `modelAssetPath` | The MediaPipe model. By default, `pose_landmarker_lite.task`, included in the module. |
| `CameraPoseProvider.isAuthorized(context): Boolean` | Whether the camera permission is granted. |

## `VideoPoseProvider`

`kinesia-motion-camera` module. See [Tests and recordings](/en/android/guias/pruebas-y-grabaciones/).

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

| Member | |
| --- | --- |
| `uri: Uri` | The video. It's processed on the device. |
| `framesPerSecond: Double` | How many frames are read per second of video. |
| `mirrored: Boolean` | `true` if the video looks like a mirror; the sides are changed to the patient's. |
| `minimumConfidence: Double` | Points with less confidence are dropped. |
| `suspend readAll(): List<Pose>` | Every pose at once. |

## `BlazePose`

`kinesia-motion` module. Turns MediaPipe's 33 points into a `Pose`.

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

Module `KinesiaMotion`. See [Tests and recordings](/en/android/guias/pruebas-y-grabaciones/).

```kotlin
RecordedPoseProvider(recording: List<Pose>, realTime: Boolean = false)
```

## Writing your own

For example, for poses coming from another detector:

```kotlin
class MyDetectorProvider(private val detector: MyDetector) : PoseProvider {
    override fun poses(): Flow<Pose> = callbackFlow {
        val token = detector.onFrame { result ->
            trySend(
                Pose(
                    points = result.pointsInPixels,      // y pointing down
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

Follow the [Pose contract](/en/android/conceptos/pose/): pixels with `y` pointing down, anatomical sides and only confident points. `conflate()` avoids piling up old frames if the consumer is slow.
