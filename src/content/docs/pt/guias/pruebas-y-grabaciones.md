---
title: Testes e gravações
description: Teste sua integração sem câmera com RecordedPoseProvider e poses sintéticas.
---

O motor do KinesiaMotion não precisa de câmera nem de UI, então pode ser testado com `swift test` no macOS e no CI.

## `RecordedPoseProvider`

Reproduz uma lista de poses como se viessem da câmera.

```swift
let provider = RecordedPoseProvider(poses, realTime: false)
```

- `realTime: false` (padrão): entrega as poses o mais rápido possível. Ideal para testes.
- `realTime: true`: espera entre poses conforme os `timestamp`, assim uma demo parece ao vivo.

## A partir de um vídeo: `VideoPoseProvider`

Extrai as poses de um vídeo (`.mov` ou `.mp4`) com o mesmo detector de corpo do Apple Vision usado pela câmera ao vivo. O vídeo é processado no próprio dispositivo e não é enviado para lugar nenhum. Fica no módulo `KinesiaMotionVision` e funciona em iOS e macOS.

```swift
import KinesiaMotion
import KinesiaMotionVision

let video = VideoPoseProvider(url: videoURL)

// Igual à câmera:
await session.run(with: video)

// Ou todas as poses de uma vez, para salvar ou reutilizar:
let poses = try await video.readAll()
let replay = RecordedPoseProvider(poses)
```

- Serve para validar contra um goniômetro: grave a medição com o goniômetro ao lado e compare os graus depois.
- Lê vídeos do iPhone em qualquer orientação.
- `mirrored: true` quando o vídeo parece um espelho (uma selfie que manteve a imagem invertida), para os lados ficarem como os do paciente.
- `maximumFrameRate` (30 por padrão) pula quadros para ir mais rápido; `realTime: true` espera entre quadros como a câmera.
- `readAll()` lança um erro se o arquivo não puder ser lido; `poses()` simplesmente termina.

## Poses sintéticas

Para um teste bastam as articulações que o exercício mede. Este helper monta um braço direito com uma flexão de cotovelo exata:

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

## Um teste completo

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
Nos testes desative a suavização para que o pico seja exatamente o que você construiu. Com o valor padrão (0.5) o pico medido fica um pouco abaixo.
:::

Use `run(with:)` em vez de `start(with:)`: ele espera a gravação terminar, assim você pode verificar o resultado logo depois.

## Sem sessão: `RepEngine`

Se só interessa a contagem, `RepEngine` é um `struct` puro e síncrono:

```swift
var engine = RepEngine(definition: ExerciseLibrary.elbowFlexion, side: .right)
engine.smoothing = 1
for pose in oneRep(peak: 120) {
    let events = engine.process(pose)
    // ...
}
engine.count   // 1
```

## Gravar sessões reais

`Pose` não é `Codable` (por causa de `CGPoint` e de `Joint` como chave de dicionário), então para salvar uma gravação convém um tipo próprio:

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

Grave alguns segundos com `VisionPoseProvider`, salve como JSON junto aos seus testes e você terá casos reais (pouca luz, roupa larga, movimentos compensados) para ajustar limiares sem depender de um paciente.
