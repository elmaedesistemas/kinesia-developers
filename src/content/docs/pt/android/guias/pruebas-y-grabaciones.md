---
title: Testes e gravações
description: Teste sua integração sem câmera com RecordedPoseProvider e poses sintéticas.
---

O motor do KinesiaMotion (`kinesia-motion`) é Kotlin puro: não precisa de câmera, Android nem emulador, então é testado na JVM com `./gradlew test`, na sua máquina e em CI.

## `RecordedPoseProvider`

Reproduz uma lista de poses como se viessem da câmera.

```kotlin
val provider = RecordedPoseProvider(poses, realTime = false)
```

- `realTime = false` (padrão): entrega as poses o mais rápido possível. Ideal para testes.
- `realTime = true`: espera entre poses conforme os `timestamp`, assim uma demo parece ao vivo.

## A partir de um vídeo: `VideoPoseProvider`

Extrai as poses de um vídeo com o mesmo modelo do MediaPipe que a câmera ao vivo usa. O vídeo é processado no próprio dispositivo e não é enviado a lugar nenhum. Está no módulo `kinesia-motion-camera`.

```kotlin
import one.kinesia.motion.camera.VideoPoseProvider

val video = VideoPoseProvider(context, videoUri)

// Igual à câmera:
session.run(video)

// Ou todas as poses de uma vez, para salvá-las ou reutilizá-las:
val poses = video.readAll()
val replay = RecordedPoseProvider(poses)
```

- Serve para validar contra um goniômetro: grave a medição com o goniômetro ao lado e compare os graus depois, com calma.
- `mirrored = true` se o vídeo parece um espelho (uma selfie que salvou a imagem invertida): assim os lados ficam como os do paciente.
- `framesPerSecond` (24 por padrão) define quantos quadros são lidos por segundo de vídeo. São lidos tão rápido quanto o celular permite, não em tempo real.

## Poses sintéticas

Para um teste bastam as articulações que o exercício mede. Este helper monta um braço direito com uma flexão de cotovelo exata:

```kotlin
import one.kinesia.motion.*
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/** Right arm with an exact elbow flexion. y grows downward. */
fun elbowPose(flexion: Double, time: Double): Pose {
    val r = PI / 180
    val shoulder = Point(0.0, 0.0)
    val elbow = Point(0.0, 100.0)
    val wrist = Point(elbow.x + 100 * sin(flexion * r), elbow.y + 100 * cos(flexion * r))
    return Pose(
        mapOf(Joint.RIGHT_SHOULDER to shoulder, Joint.RIGHT_ELBOW to elbow, Joint.RIGHT_WRIST to wrist),
        time,
    )
}

/** 0 → peak → 0 in 10° steps at 24 FPS. */
fun oneRep(peak: Double, startingAt: Double = 0.0): List<Pose> {
    val up = generateSequence(0.0) { it + 10 }.takeWhile { it < peak }.toList() + peak
    val angles = up + up.reversed().drop(1)
    return angles.mapIndexed { i, angle -> elbowPose(angle, startingAt + i / 24.0) }
}
```

## Um teste completo

```kotlin
import kotlinx.coroutines.test.runTest
import one.kinesia.motion.*
import kotlin.test.Test
import kotlin.test.assertEquals

class ElbowTest {
    @Test fun countsTwoCleanReps() = runTest {
        val session = MotionSession(ExerciseLibrary.elbowFlexion, BodySide.RIGHT, smoothing = 1.0)
        val poses = oneRep(120.0) + oneRep(110.0, startingAt = 2.0)

        session.run(RecordedPoseProvider(poses))

        assertEquals(2, session.snapshot.value.repCount)
        assertEquals(listOf(120.0, 110.0), session.peaks)
    }
}
```

:::tip[`smoothing = 1.0`]
Nos testes desative a suavização para que o pico seja exatamente o que você construiu. Com o valor padrão (0.5) o pico medido fica um pouco abaixo.
:::

Use `run(provider)` em vez de `start(provider, scope)`: espera a gravação terminar, assim você pode verificar o resultado logo depois. Adicione `kotlinx-coroutines-test` às dependências de teste para `runTest`.

## Sem sessão: `RepEngine`

Se você só se interessa pela contagem, `RepEngine` é uma classe síncrona, sem corrotinas:

```kotlin
val engine = RepEngine(ExerciseLibrary.elbowFlexion, BodySide.RIGHT)
engine.smoothing = 1.0
for (pose in oneRep(120.0)) {
    val events = engine.process(pose)
    // ...
}
engine.count   // 1
```

## Gravar sessões reais

`Pose` não é `@Serializable`, então para salvar uma gravação convém um tipo próprio:

```kotlin
@Serializable
data class RecordedFrame(
    val t: Double,
    val points: Map<String, List<Double>>,   // "RIGHT_ELBOW": [x, y]
)

fun RecordedFrame.toPose(): Pose = Pose(
    points = points
        .filterValues { it.size == 2 }
        .mapKeys { Joint.valueOf(it.key) }
        .mapValues { Point(it.value[0], it.value[1]) },
    timestamp = t,
)
```

Grave alguns segundos com `CameraPoseProvider`, salve-os como JSON junto aos seus testes e você terá casos reais (pouca luz, roupa folgada, movimentos compensados) para ajustar limiares sem depender de um paciente.
