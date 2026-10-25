---
title: Diferencias con iOS
description: Cómo se escribe en Kotlin lo que las guías muestran en Swift.
---

Los dos SDK tienen la misma API: los mismos ángulos, el mismo conteo, el mismo catálogo y el mismo formato JSON de ejercicios. Cambia la forma de escribirla, para que se sienta natural en cada lenguaje. Las guías tienen los ejemplos en Swift; esta tabla te dice cómo leerlos en Kotlin.

## Tipos y nombres

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `import KinesiaMotion` | `import one.kinesia.motion.*` |
| `import KinesiaMotionVision` | `import one.kinesia.motion.camera.*` |
| `.right`, `.leftShoulder` | `BodySide.RIGHT`, `Joint.LEFT_SHOULDER` |
| `.keepUpperArmStill`, `.turnSideways` | `FormFeedback.KEEP_UPPER_ARM_STILL`, `SetupIssue.TURN_SIDEWAYS` |
| `feedback.rawValue` | `feedback.rawValue` (el mismo texto: `"keepUpperArmStill"`) |
| `CGPoint`, `CGSize` | `Point`, `Size` (en `Double`) |
| `TimeInterval` | `Double`, en segundos |
| `0...30` | `0.0..30.0` |

Usa `rawValue` como clave de traducción: así las dos apps comparten los mismos textos.

## Mediciones y ejercicios

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `.flexion(a: "shoulder", vertex: "elbow", b: "wrist")` | `Measure.Flexion("shoulder", "elbow", "wrist")` |
| `.fromVertical(from: "hip", to: "knee")` | `Measure.FromVertical("hip", "knee")` |
| `.tilt(a: "ear", b: "opposite.ear")` | `Measure.Tilt("ear", "opposite.ear")` |
| `"opposite.shoulder" as LandmarkRef` | `LandmarkRef.of("opposite.shoulder")` |
| `.reps(low: 30, high: 90)` | `ExerciseDefinition.Kind.Reps(low = 30.0, high = 90.0)` |
| `.hold(threshold: 15, seconds: 3)` | `ExerciseDefinition.Kind.Hold(threshold = 15.0, seconds = 3.0)` |
| `ExerciseLibrary.decode(from: data)` | `ExerciseLibrary.decode(text)` |
| `ExerciseLibrary.encode(list)` → `Data` | `ExerciseLibrary.encode(list)` → `String` |

El JSON es el mismo en las dos plataformas: un ejercicio descargado de tu servidor funciona igual en iOS y en Android. Un JSON inválido lanza `DecodingError` en Swift y `SerializationException` en Kotlin.

## Sesión, snapshot y eventos

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `session.start(with: camera)` | `session.start(camera, scope)` |
| `await session.run(with: provider)` | `session.run(provider)` (`suspend`) |
| `session.snapshot` (`@Observable`) | `session.snapshot.value`, o `collect` del `StateFlow` |
| `for await event in session.events()` | `session.events.collect { event -> … }` |
| `case .repCompleted(let rep)` | `is MotionEvent.RepCompleted -> event.rep` |
| `case .holdStarted` | `MotionEvent.HoldStarted` |
| `session.process(pose)` | `session.process(pose)` |

`session.events` es un `SharedFlow`: cada `collect` recibe los eventos desde que empieza a escuchar, no los anteriores. Empieza a escuchar antes de arrancar la sesión.

En Swift, `MotionSession` vive en el `MainActor`. En Kotlin se puede llamar desde cualquier hilo; lo normal es usar `lifecycleScope` o `viewModelScope`.

## Fuentes de poses

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `PoseProvider` con `AsyncStream<Pose>` | `PoseProvider` con `Flow<Pose>` |
| `VisionPoseProvider` (Apple Vision) | `CameraPoseProvider` (CameraX + MediaPipe) |
| `VideoPoseProvider(url:)` | `VideoPoseProvider(context, uri)` |
| `RecordedPoseProvider(poses)` | `RecordedPoseProvider(poses)` |
| 19 puntos de Vision | 33 puntos de BlazePose, convertidos a los mismos 19 |

## Pruebas

El núcleo de Android no depende de Android: las pruebas corren en la JVM con `./gradlew test`, como `swift test` en macOS. Las pruebas del SDK de Android reproducen una por una las de Swift.
