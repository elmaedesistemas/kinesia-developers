---
title: PoseProvider
description: The built-in pose sources and how to write your own.
sidebar:
  order: 2
---

```swift
public protocol PoseProvider: Sendable {
    func poses() -> AsyncStream<Pose>
}
```

Anything that produces poses. Every call to `poses()` starts a new stream. When the consumer stops iterating (breaks out of the loop or cancels its task), the stream ends and the provider releases what it was using.

## `VisionPoseProvider`

Module `KinesiaMotionVision`, iOS only. See the [guide](/en/guias/camara-vision/).

```swift
init(camera: Camera = .front, minimumConfidence: Float = 0.3)
```

| Member | |
| --- | --- |
| `captureSession: AVCaptureSession` | For an `AVCaptureVideoPreviewLayer`. |
| `camera: Camera` | `.front` or `.back`. |
| `minimumConfidence: Float` | Points with less confidence are dropped. |
| `static isAuthorized: Bool` | Whether camera permission is already granted. |
| `static requestAccess() async -> Bool` | Asks for permission. |

## `RecordedPoseProvider`

Module `KinesiaMotion`. See [Tests and recordings](/en/guias/pruebas-y-grabaciones/).

```swift
init(_ recording: [Pose], realTime: Bool = false)
```

## Writing your own

For example, for poses coming from another detector:

```swift
struct MyDetectorProvider: PoseProvider {
    let detector: MyDetector

    func poses() -> AsyncStream<Pose> {
        AsyncStream(bufferingPolicy: .bufferingNewest(1)) { continuation in
            let token = detector.onFrame { result in
                continuation.yield(Pose(
                    points: result.pointsInPixels,      // y pointing down
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

Respect the [Pose contract](/en/conceptos/pose/): pixels with `y` pointing down, anatomical sides and only confident points. `.bufferingNewest(1)` avoids piling up old frames if the consumer is slow.
