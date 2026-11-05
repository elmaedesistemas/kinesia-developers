---
title: O contrato de Pose
description: As regras que qualquer fonte de poses deve cumprir.
---

Uma `Pose` é um quadro de pontos do corpo. Todo o motor confia que as poses cumprem este contrato; se você escrever seu próprio `PoseProvider`, é você quem deve respeitá-lo.

```kotlin
public data class Pose(
    val points: Map<Joint, Point>,
    val timestamp: Double,                 // segundos
    val imageSize: Size? = null,
    val confidence: Map<Joint, Double> = emptyMap(),
)
```

## As quatro regras

1. **Pixels da imagem, com `y` para baixo.** A origem fica no canto superior esquerdo, como nas views do Android. O MediaPipe entrega coordenadas normalizadas (0…1): o adaptador deve convertê-las em pixels.
2. **Lados anatômicos.** `Joint.LEFT_ELBOW` é o cotovelo esquerdo *real* do paciente. Com a câmera frontal a imagem é espelhada, então o adaptador deve trocar esquerda e direita antes de montar a pose.
3. **Só pontos confiáveis.** Articulações com baixa confiança ficam fora do mapa. Uma articulação ausente significa «não a vejo», e o motor a trata assim: não mede, não penaliza e avisa que falta.
4. **`confidence` é opcional.** Se seu detector não fornece confiança, deixe o mapa vazio; as métricas de confiança sairão `null`.

:::tip[Poses vazias]
Envie a pose mesmo sem nenhum ponto. Uma pose vazia diz à sessão que o paciente saiu do enquadramento, e assim ela pode emitir `VisibilityChanged`.
:::

## As 19 articulações

`Joint` tem 19 pontos. O MediaPipe detecta 33 (BlazePose): `BlazePose.pose(...)` os converte e calcula `NECK` e `ROOT` como o ponto médio dos ombros e dos quadris.

| Região | Articulações |
| --- | --- |
| Cabeça | `NOSE`, `LEFT_EYE`, `RIGHT_EYE`, `LEFT_EAR`, `RIGHT_EAR` |
| Linha média | `NECK`, `ROOT` (centro do quadril) |
| Braços | `LEFT_SHOULDER`, `RIGHT_SHOULDER`, `LEFT_ELBOW`, `RIGHT_ELBOW`, `LEFT_WRIST`, `RIGHT_WRIST` |
| Pernas | `LEFT_HIP`, `RIGHT_HIP`, `LEFT_KNEE`, `RIGHT_KNEE`, `LEFT_ANKLE`, `RIGHT_ANKLE` |

Para não escrever `if (side == BodySide.LEFT) Joint.LEFT_KNEE else Joint.RIGHT_KNEE`, use os atalhos:

```kotlin
Joint.knee(BodySide.LEFT)   // Joint.LEFT_KNEE
Joint.shoulder(side)        // conforme o lado
BodySide.RIGHT.opposite     // BodySide.LEFT
```

:::note
Não há ponto para os dedos do pé nem da mão. Por isso a dorsiflexão do tornozelo é medida como a inclinação da tíbia; veja o [catálogo](/pt/android/referencia/ejercicios/#tornozelo).
:::

## Ler uma pose

```kotlin
pose[Joint.RIGHT_ELBOW]?.let { elbow ->
    println(elbow)                     // Point em pixels
}
pose.confidence(listOf(Joint.RIGHT_SHOULDER, Joint.RIGHT_ELBOW, Joint.RIGHT_WRIST))
// A confiança mais baixa entre as que estão visíveis, ou null
```

`imageSize` permite desenhar os pontos sobre a imagem da câmera, escalando-os ao tamanho da view.
