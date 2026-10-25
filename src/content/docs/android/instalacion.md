---
title: Instalación en Android
description: Agrega KinesiaMotion a tu app de Android con Gradle y JitPack.
---

KinesiaMotion para Android se distribuye por **JitPack**, que compila directamente los tags del repositorio [kinesia-motion-android](https://github.com/elmaedesistemas/kinesia-motion-android).

:::caution[Versión 0.1.0]
El núcleo reproduce las mismas pruebas que el SDK de iOS. El módulo de cámara todavía no se ha validado en dispositivos: si encuentras un problema, abre un issue en el repositorio.
:::

## Dos módulos

| Módulo | Qué contiene | Depende de |
| --- | --- | --- |
| `kinesia-motion` | El motor: poses, mediciones, ejercicios, conteo, sesión. Kotlin puro, sin Android. | Coroutines, kotlinx.serialization |
| `kinesia-motion-camera` | `CameraPoseProvider` (CameraX) y `VideoPoseProvider`, con MediaPipe Pose Landmarker. | `kinesia-motion`, CameraX, MediaPipe |

## Gradle

Agrega JitPack a los repositorios:

```kotlin title="settings.gradle.kts"
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven("https://jitpack.io")
    }
}
```

Y la dependencia en el módulo de tu app. `kinesia-motion-camera` ya incluye el núcleo:

```kotlin title="app/build.gradle.kts"
dependencies {
    implementation("com.github.elmaedesistemas.kinesia-motion-android:kinesia-motion-camera:0.1.0")
}
```

Si solo necesitas el motor (pruebas, un servidor, poses de otra fuente):

```kotlin
implementation("com.github.elmaedesistemas.kinesia-motion-android:kinesia-motion:0.1.0")
```

:::note[Versiones]
Los tags no llevan `v`: `0.1.0`, `0.2.0`… Fija una versión exacta y revisa las [notas de versión](/referencia/versiones/) antes de actualizar.
:::

## Requisitos

- `minSdk 24` (Android 7.0) o superior.
- Java 17 para compilar.
- El modelo de pose (`pose_landmarker_lite.task`, unos 5 MB) viene dentro del AAR: no hay que descargarlo aparte.

## Permiso de cámara

El módulo de cámara ya declara `android.permission.CAMERA` en su manifiesto. Tu app lo pide en tiempo de ejecución antes de empezar:

```kotlin
val askCamera = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
    if (granted) startMeasuring() else showCameraSettingsHelp()
}

if (CameraPoseProvider.isAuthorized(this)) startMeasuring()
else askCamera.launch(Manifest.permission.CAMERA)
```

## Comprobar la instalación

```kotlin
import one.kinesia.motion.ExerciseLibrary

println(ExerciseLibrary.all.map { it.id })
// [elbow.flexion, knee.flexion.standing, shoulder.flexion, ...]
```

Si compila e imprime los ejercicios, sigue con el [inicio rápido](/android/inicio-rapido/).
