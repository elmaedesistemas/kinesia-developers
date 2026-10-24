---
title: Installation
description: Add KinesiaMotion to your project with Swift Package Manager.
---

KinesiaMotion ships with **Swift Package Manager**.

## In Xcode

1. Open **File → Add Package Dependencies…**
2. Paste the repository URL:
   ```
   https://github.com/elmaedesistemas/kinesia-motion.git
   ```
3. Under **Dependency Rule** choose **Exact Version** and enter the latest version (for example `0.2.0`).
4. Add the products you need to your app target:
   - `KinesiaMotion`: always.
   - `KinesiaMotionVision`: if you'll use the iPhone camera.

:::note[Versions]
Pin an exact version and read the [release notes](/en/referencia/versiones/) before updating.
:::

## In `Package.swift`

```swift title="Package.swift"
dependencies: [
    .package(url: "https://github.com/elmaedesistemas/kinesia-motion.git", exact: "0.2.0")
],
targets: [
    .target(
        name: "MyApp",
        dependencies: [
            .product(name: "KinesiaMotion", package: "kinesia-motion"),
            .product(name: "KinesiaMotionVision", package: "kinesia-motion")
        ]
    )
]
```

## Camera permission

`VisionPoseProvider` uses the camera, so your app needs the usage description in `Info.plist`:

```xml title="Info.plist"
<key>NSCameraUsageDescription</key>
<string>We use the camera to measure your movement during exercises. Images never leave the phone.</string>
```

Without this key, iOS terminates the app the first time it asks for camera access.

## Check the installation

```swift
import KinesiaMotion

print(ExerciseLibrary.all.map(\.id))
// ["elbow.flexion", "knee.flexion.standing", "shoulder.flexion", ...]
```

If it compiles and prints the exercises, you're ready for the [quick start](/en/empezar/inicio-rapido/).
