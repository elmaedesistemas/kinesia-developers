---
title: Pruebas y grabaciones
description: Prueba tu integración sin cámara con RecordedPoseProvider y poses sintéticas.
---

El motor de KinesiaMotion no necesita cámara ni UI, así que se puede probar con `swift test` en macOS y en CI.

## `RecordedPoseProvider`

Reproduce una lista de poses como si vinieran de la cámara.

```swift
let provider = RecordedPoseProvider(poses, realTime: false)
```

- `realTime: false` (por defecto): entrega las poses lo más rápido posible. Ideal para pruebas.
- `realTime: true`: espera entre poses según sus `timestamp`, así una demo se ve en vivo.

## Poses sintéticas

Para una prueba basta con las articulaciones que mide el ejercicio. Este helper construye un brazo derecho con una flexión de codo exacta:

```swift
import CoreGraphics
import KinesiaMotion

/// Right arm with an exact elbow flexion. y grows downward.
func elbowPose(flexion: Double, time: TimeInterval) -> Pose {
    let r = Double.pi / 180
    let shoulder = CGPoint(x: 0, y: 0)
    let elbow = CGPoint(x: 0, y: 100)
    let wrist = CGPoint(x: elbow.x + 100 * sin(flexion * r), y: elbow.y + 100 * cos(flexion * r))
    return Pose(points: [.rightShoulder: shoulder, .rightElbow: elbow, .rightWrist: wrist], timestamp: time)
}

/// 0 → peak → 0 in 10° steps at 24 FPS.
func oneRep(peak: Double, startingAt start: TimeInterval = 0) -> [Pose] {
    var up = Array(stride(from: 0.0, to: peak, by: 10))
    up.append(peak)
    let angles = up + up.reversed().dropFirst()
    return angles.enumerated().map { i, angle in
        elbowPose(flexion: angle, time: start + Double(i) / 24)
    }
}
```

## Una prueba completa

```swift
import Testing
import KinesiaMotion

@MainActor
@Test func countsTwoCleanReps() async {
    let session = MotionSession(exercise: ExerciseLibrary.elbowFlexion, side: .right, smoothing: 1)
    let poses = oneRep(peak: 120) + oneRep(peak: 110, startingAt: 2)

    await session.run(with: RecordedPoseProvider(poses))

    #expect(session.snapshot.repCount == 2)
    #expect(session.peaks == [120, 110])
}
```

:::tip[`smoothing: 1`]
En pruebas desactiva el suavizado para que el pico sea exactamente el que construiste. Con el valor por defecto (0.5) el pico medido queda un poco por debajo.
:::

Usa `run(with:)` en lugar de `start(with:)`: espera a que la grabación termine, así puedes revisar el resultado justo después.

## Sin sesión: `RepEngine`

Si solo te interesa el conteo, `RepEngine` es un `struct` puro y síncrono:

```swift
var engine = RepEngine(definition: ExerciseLibrary.elbowFlexion, side: .right)
engine.smoothing = 1
for pose in oneRep(peak: 120) {
    let events = engine.process(pose)
    // ...
}
engine.count   // 1
```

## Grabar sesiones reales

`Pose` no es `Codable` (por `CGPoint` y `Joint` como clave de diccionario), así que para guardar una grabación conviene un tipo propio:

```swift
struct RecordedFrame: Codable {
    var t: TimeInterval
    var points: [String: [Double]]   // "rightElbow": [x, y]
}

extension Pose {
    init(_ frame: RecordedFrame) {
        var points: [Joint: CGPoint] = [:]
        for (name, xy) in frame.points {
            if let joint = Joint(rawValue: name), xy.count == 2 {
                points[joint] = CGPoint(x: xy[0], y: xy[1])
            }
        }
        self.init(points: points, timestamp: frame.t)
    }
}
```

Graba unos segundos con `VisionPoseProvider`, guárdalos como JSON junto a tus pruebas y tendrás casos reales (mala luz, ropa holgada, movimientos compensados) para ajustar umbrales sin depender de un paciente.
