---
title: Instalação no Android
description: Adicione o KinesiaMotion ao seu app Android com Gradle e JitPack.
---

O KinesiaMotion para Android é distribuído pelo **JitPack**, que compila diretamente as tags do repositório [kinesia-motion-android](https://github.com/elmaedesistemas/kinesia-motion-android).

:::caution[Versão 0.1.0]
O motor reproduz os mesmos testes do SDK de iOS. O módulo de câmera ainda não foi validado em dispositivos: se encontrar um problema, abra uma issue no repositório.
:::

## Dois módulos

| Módulo | O que contém | Depende de |
| --- | --- | --- |
| `kinesia-motion` | O motor: poses, medições, exercícios, contagem, sessão. Kotlin puro, sem Android. | Coroutines, kotlinx.serialization |
| `kinesia-motion-camera` | `CameraPoseProvider` (CameraX) e `VideoPoseProvider`, com MediaPipe Pose Landmarker. | `kinesia-motion`, CameraX, MediaPipe |

## Gradle

Adicione o JitPack aos repositórios:

```kotlin title="settings.gradle.kts"
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven("https://jitpack.io")
    }
}
```

E a dependência no módulo do seu app. `kinesia-motion-camera` já inclui o motor:

```kotlin title="app/build.gradle.kts"
dependencies {
    implementation("com.github.elmaedesistemas.kinesia-motion-android:kinesia-motion-camera:0.1.0")
}
```

Se você só precisa do motor (testes, um servidor, poses de outra fonte):

```kotlin
implementation("com.github.elmaedesistemas.kinesia-motion-android:kinesia-motion:0.1.0")
```

:::note[Versões]
As tags não levam `v`: `0.1.0`, `0.2.0`… Fixe uma versão exata e consulte as [notas de versão](/pt/referencia/versiones/) antes de atualizar.
:::

## Requisitos

- `minSdk 24` (Android 7.0) ou superior.
- Java 17 para compilar.
- O modelo de pose (`pose_landmarker_lite.task`, uns 5 MB) vem dentro do AAR: não precisa baixá-lo à parte.

## Permissão de câmera

O módulo de câmera já declara `android.permission.CAMERA` no seu manifesto. Seu app a pede em tempo de execução antes de começar:

```kotlin
val askCamera = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
    if (granted) startMeasuring() else showCameraSettingsHelp()
}

if (CameraPoseProvider.isAuthorized(this)) startMeasuring()
else askCamera.launch(Manifest.permission.CAMERA)
```

## Verificar a instalação

```kotlin
import one.kinesia.motion.ExerciseLibrary

println(ExerciseLibrary.all.map { it.id })
// [elbow.flexion, knee.flexion.standing, shoulder.flexion, ...]
```

Se compilar e imprimir os exercícios, siga para o [início rápido](/pt/android/inicio-rapido/).
