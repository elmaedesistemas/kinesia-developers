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

## `VideoPoseProvider`

Module `KinesiaMotionVision`, iOS and macOS. Since 0.2.0. See [Tests and recordings](/en/guias/pruebas-y-grabaciones/).

```swift
init(url: URL,
     mirrored: Bool = false,
     minimumConfidence: Float = 0.3,
     maximumFrameRate: Double = 30,
     realTime: Bool = false)
```

| Member | |
| --- | --- |
| `url: URL` | The video (`.mov`, `.mp4`). Processed on the device. |
| `mirrored: Bool` | `true` when the video looks like a mirror; sides become the patient's. |
| `minimumConfidence: Float` | Points below this confidence are dropped. |
| `maximumFrameRate: Double` | Skips frames closer than `1 / maximumFrameRate`. |
| `realTime: Bool` | Waits between frames as in the video. |
| `readAll() async throws -> [Pose]` | Every pose at once. Throws `ReadError` if the file can't be read. |

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
