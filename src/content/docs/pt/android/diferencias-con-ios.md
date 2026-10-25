---
title: Diferenças com o iOS
description: Como escrever em Kotlin o que os guias mostram em Swift.
---

Os dois SDKs têm a mesma API: os mesmos ângulos, a mesma contagem, o mesmo catálogo e o mesmo formato JSON de exercícios. Muda a forma de escrever, para que pareça natural em cada linguagem. Os guias têm os exemplos em Swift; esta tabela mostra como lê-los em Kotlin.

## Tipos e nomes

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `import KinesiaMotion` | `import one.kinesia.motion.*` |
| `import KinesiaMotionVision` | `import one.kinesia.motion.camera.*` |
| `.right`, `.leftShoulder` | `BodySide.RIGHT`, `Joint.LEFT_SHOULDER` |
| `.keepUpperArmStill`, `.turnSideways` | `FormFeedback.KEEP_UPPER_ARM_STILL`, `SetupIssue.TURN_SIDEWAYS` |
| `feedback.rawValue` | `feedback.rawValue` (o mesmo texto: `"keepUpperArmStill"`) |
| `CGPoint`, `CGSize` | `Point`, `Size` (em `Double`) |
| `TimeInterval` | `Double`, em segundos |
| `0...30` | `0.0..30.0` |

Use `rawValue` como chave de tradução: assim os dois apps compartilham os mesmos textos.

## Medições e exercícios

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

O JSON é o mesmo nas duas plataformas: um exercício baixado do seu servidor funciona igual no iOS e no Android. Um JSON inválido lança `DecodingError` em Swift e `SerializationException` em Kotlin.

## Sessão, snapshot e eventos

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `session.start(with: camera)` | `session.start(camera, scope)` |
| `await session.run(with: provider)` | `session.run(provider)` (`suspend`) |
| `session.snapshot` (`@Observable`) | `session.snapshot.value`, ou `collect` do `StateFlow` |
| `for await event in session.events()` | `session.events.collect { event -> … }` |
| `case .repCompleted(let rep)` | `is MotionEvent.RepCompleted -> event.rep` |
| `case .holdStarted` | `MotionEvent.HoldStarted` |
| `session.process(pose)` | `session.process(pose)` |

`session.events` é um `SharedFlow`: cada `collect` recebe os eventos desde que começa a escutar, não os anteriores. Comece a escutar antes de iniciar a sessão.

Em Swift, `MotionSession` vive no `MainActor`. Em Kotlin pode ser chamada de qualquer thread; o normal é usar `lifecycleScope` ou `viewModelScope`.

## Fontes de poses

| iOS (Swift) | Android (Kotlin) |
| --- | --- |
| `PoseProvider` com `AsyncStream<Pose>` | `PoseProvider` com `Flow<Pose>` |
| `VisionPoseProvider` (Apple Vision) | `CameraPoseProvider` (CameraX + MediaPipe) |
| `VideoPoseProvider(url:)` | `VideoPoseProvider(context, uri)` |
| `RecordedPoseProvider(poses)` | `RecordedPoseProvider(poses)` |
| 19 pontos do Vision | 33 pontos do BlazePose, convertidos para os mesmos 19 |

## Testes

O motor do Android não depende do Android: os testes rodam na JVM com `./gradlew test`, como `swift test` no macOS. Os testes do SDK de Android reproduzem um a um os de Swift.
