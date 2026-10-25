---
title: O contrato de Pose
description: As regras que qualquer fonte de poses deve cumprir.
---

Uma `Pose` é um quadro de pontos do corpo. Todo o motor confia que as poses cumprem este contrato; se você escrever seu próprio `PoseProvider`, é você quem deve respeitá-lo.

```swift
public struct Pose: Sendable {
    public var points: [Joint: CGPoint]
    public var timestamp: TimeInterval
    public var imageSize: CGSize?
    public var confidence: [Joint: Double]
}
```

## As quatro regras

1. **Pixels da imagem, com `y` para baixo.** A origem fica no canto superior esquerdo, como no UIKit. Não use coordenadas normalizadas (0…1) nem a origem inferior do Vision.
2. **Lados anatômicos.** `.leftElbow` é o cotovelo esquerdo *real* do paciente. Com a câmera frontal a imagem é espelhada, então o adaptador deve trocar esquerda e direita antes de montar a pose.
3. **Só pontos confiáveis.** Articulações com baixa confiança ficam fora do dicionário. Uma articulação ausente significa «não a vejo», e o motor a trata assim: não mede, não penaliza e avisa que falta.
4. **`confidence` é opcional.** Se seu detector não fornece confiança, deixe o dicionário vazio; as métricas de confiança sairão `nil`.

:::tip[Poses vazias]
Envie a pose mesmo sem nenhum ponto. Uma pose vazia diz à sessão que o paciente saiu do enquadramento, e assim ela pode emitir `.visibilityChanged`.
:::

## As 19 articulações

`Joint` segue os 19 pontos do detector de corpo 2D do Vision:

| Região | Articulações |
| --- | --- |
| Cabeça | `nose`, `leftEye`, `rightEye`, `leftEar`, `rightEar` |
| Linha média | `neck`, `root` (centro do quadril) |
| Braços | `leftShoulder`, `rightShoulder`, `leftElbow`, `rightElbow`, `leftWrist`, `rightWrist` |
| Pernas | `leftHip`, `rightHip`, `leftKnee`, `rightKnee`, `leftAnkle`, `rightAnkle` |

No Android, escrevem-se `Joint.LEFT_SHOULDER`, `Joint.NECK` etc. O MediaPipe detecta 33 pontos (BlazePose): o SDK os converte para estes mesmos 19 e calcula `neck` e `root` como o ponto médio dos ombros e dos quadris. Veja [Câmera com MediaPipe](/pt/android/camara-mediapipe/).

Para não escrever `side == .left ? .leftKnee : .rightKnee`, use os atalhos:

```swift
Joint.knee(.left)       // .leftKnee
Joint.shoulder(side)    // conforme o lado
BodySide.right.opposite // .left
```

:::note
Não há ponto para os dedos do pé nem da mão. Por isso a dorsiflexão do tornozelo é medida como a inclinação da tíbia; veja o [catálogo](/pt/referencia/ejercicios/#tornozelo).
:::

## Ler uma pose

```swift
if let elbow = pose[.rightElbow] {
    print(elbow)                                // CGPoint em pixels
}
pose.confidence(of: [.rightShoulder, .rightElbow, .rightWrist])
// A menor confiança entre as visíveis, ou nil
```

`imageSize` permite desenhar os pontos sobre a imagem da câmera, escalando-os ao tamanho da view.
