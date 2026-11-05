---
title: Pruebas y grabaciones
description: Prueba tu integración sin cámara con RecordedPoseProvider y poses sintéticas.
---

El motor de KinesiaMotion (`kinesia-motion`) es Kotlin puro: no necesita cámara, Android ni emulador, así que se prueba en la JVM con `./gradlew test`, en tu máquina y en CI.

## `RecordedPoseProvider`

Reproduce una lista de poses como si vinieran de la cámara.

```kotlin
val provider = RecordedPoseProvider(poses, realTime = false)
```

- `realTime = false` (por defecto): entrega las poses lo más rápido posible. Ideal para pruebas.
- `realTime = true`: espera entre poses según sus `timestamp`, así una demo se ve en vivo.

## Desde un video: `VideoPoseProvider`

Saca las poses de un video con el mismo modelo de MediaPipe que usa la cámara en vivo. El video se procesa en el mismo dispositivo y no se sube a ningún lado. Está en el módulo `kinesia-motion-camera`.

```kotlin
import one.kinesia.motion.camera.VideoPoseProvider

val video = VideoPoseProvider(context, videoUri)

// Igual que la cámara:
session.run(video)

// O todas las poses de una vez, para guardarlas o reusarlas:
val poses = video.readAll()
val replay = RecordedPoseProvider(poses)
```

- Sirve para validar contra un goniómetro: graba la medición con el goniómetro al lado y compara los grados después, con calma.
- `mirrored = true` si el video se ve como en un espejo (una selfie que guardó la imagen volteada): así los lados quedan como los del paciente.
- `framesPerSecond` (24 por defecto) define cuántos cuadros se leen por segundo de video. Se leen tan rápido como permite el teléfono, no en tiempo real.

## Poses sintéticas

Para una prueba basta con las articulaciones que mide el ejercicio. Este helper construye un brazo derecho con una flexión de codo exacta:

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

## Una prueba completa

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
En pruebas desactiva el suavizado para que el pico sea exactamente el que construiste. Con el valor por defecto (0.5) el pico medido queda un poco por debajo.
:::

Usa `run(provider)` en lugar de `start(provider, scope)`: espera a que la grabación termine, así puedes revisar el resultado justo después. Agrega `kotlinx-coroutines-test` a tus dependencias de prueba para `runTest`.

## Sin sesión: `RepEngine`

Si solo te interesa el conteo, `RepEngine` es una clase síncrona, sin corrutinas:

```kotlin
val engine = RepEngine(ExerciseLibrary.elbowFlexion, BodySide.RIGHT)
engine.smoothing = 1.0
for (pose in oneRep(120.0)) {
    val events = engine.process(pose)
    // ...
}
engine.count   // 1
```

## Grabar sesiones reales

`Pose` no es `@Serializable`, así que para guardar una grabación conviene un tipo propio:

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

Graba unos segundos con `CameraPoseProvider`, guárdalos como JSON junto a tus pruebas y tendrás casos reales (mala luz, ropa holgada, movimientos compensados) para ajustar umbrales sin depender de un paciente.
