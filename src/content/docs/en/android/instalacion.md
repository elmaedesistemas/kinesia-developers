---
title: Installation on Android
description: Add KinesiaMotion to your Android app with Gradle and JitPack.
---

KinesiaMotion for Android is distributed through **JitPack**, which builds the tags of the [kinesia-motion-android](https://github.com/elmaedesistemas/kinesia-motion-android) repository directly.

:::caution[Version 0.1.0]
The engine reproduces the same tests as the iOS SDK. The camera module hasn't been validated on devices yet: if you find a problem, open an issue in the repository.
:::

## Two modules

| Module | What it contains | Depends on |
| --- | --- | --- |
| `kinesia-motion` | The engine: poses, measures, exercises, rep counting, session. Pure Kotlin, no Android. | Coroutines, kotlinx.serialization |
| `kinesia-motion-camera` | `CameraPoseProvider` (CameraX) and `VideoPoseProvider`, with MediaPipe Pose Landmarker. | `kinesia-motion`, CameraX, MediaPipe |

## Gradle

Add JitPack to the repositories:

```kotlin title="settings.gradle.kts"
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven("https://jitpack.io")
    }
}
```

And the dependency in your app module. `kinesia-motion-camera` already includes the engine:

```kotlin title="app/build.gradle.kts"
dependencies {
    implementation("com.github.elmaedesistemas.kinesia-motion-android:kinesia-motion-camera:0.1.0")
}
```

If you only need the engine (tests, a server, poses from another source):

```kotlin
implementation("com.github.elmaedesistemas.kinesia-motion-android:kinesia-motion:0.1.0")
```

:::note[Versions]
Tags have no `v`: `0.1.0`, `0.2.0`… Pin an exact version and check the [release notes](/en/referencia/versiones/) before updating.
:::

## Requirements

- `minSdk 24` (Android 7.0) or later.
- Java 17 to build.
- The pose model (`pose_landmarker_lite.task`, about 5 MB) ships inside the AAR: no separate download.

## Camera permission

The camera module already declares `android.permission.CAMERA` in its manifest. Your app asks for it at runtime before starting:

```kotlin
val askCamera = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
    if (granted) startMeasuring() else showCameraSettingsHelp()
}

if (CameraPoseProvider.isAuthorized(this)) startMeasuring()
else askCamera.launch(Manifest.permission.CAMERA)
```

## Check the installation

```kotlin
import one.kinesia.motion.ExerciseLibrary

println(ExerciseLibrary.all.map { it.id })
// [elbow.flexion, knee.flexion.standing, shoulder.flexion, ...]
```

If it builds and prints the exercises, continue with the [quick start](/en/android/inicio-rapido/).
