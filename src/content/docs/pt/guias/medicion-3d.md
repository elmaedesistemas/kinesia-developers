---
title: Medição 3D
description: Ângulos com profundidade que se mantêm mesmo quando o paciente gira um pouco diante da câmera.
---

Em 2D, o ângulo vem da imagem: se o paciente não está exatamente de perfil (ou de frente), o segmento parece mais curto e o ângulo sai errado. Com a medição 3D, cada `Pose` traz também a posição das articulações em metros, e o ângulo é calculado no espaço.

## Ativar

Peça pontos 3D ao provedor com `world: true`. Usa o modelo 3D do Vision (`VNDetectHumanBodyPose3DRequest`, iOS 17), que custa mais por quadro que o 2D.

```swift
let camera = VisionPoseProvider(camera: .front, world: true)
session.start(with: camera)

// Também a partir de um vídeo:
let poses = try await VideoPoseProvider(url: url, world: true).readAll()
```

## Escolher 2D ou 3D

Quem usa o kit decide com `space` em `MotionSession`:

| `space` | Mede | Precisa |
| --- | --- | --- |
| `nil` (padrão) | Em 3D quando a pose traz, senão em 2D | Qualquer provedor |
| `.image` | Sempre em 2D, na imagem | Qualquer provedor |
| `.world` | Sempre em 3D | Um provedor com `world: true` |

```swift
let session = MotionSession(exercise: ExerciseLibrary.elbowFlexion, side: .right, space: .world)

// Pode mudar ao vivo; vale a partir do próximo quadro:
session.space = .image
```

Com `.world` e poses sem pontos 3D nada é medido, então use junto com `world: true`. `RepEngine` tem a mesma propriedade `space` se você o usa sem sessão.

## Como cada medida decide

`Measure.value(in:side:)` mede em 3D quando `pose.world` tem **todas** as articulações que a medida precisa; se faltar alguma, mede na imagem como sempre.

| Medida | Em 3D |
| --- | --- |
| `angle`, `flexion` | O ângulo real entre os dois segmentos, para onde quer que o paciente olhe |
| `fromVertical` | Contra a vertical real (eixo y para cima) |
| `tilt` | Contra o plano horizontal |

O modelo 3D do Vision não tem olhos, orelhas nem nariz: as medidas de pescoço continuam em 2D.

Para forçar um espaço, sem alternativa:

```swift
let naImagem = medida.value(in: pose, side: .right, space: .image)
let em3D = medida.value(in: pose, side: .right, space: .world)   // nil sem pontos 3D
```

`pose.imageOnly` remove os pontos 3D de uma pose.

## O contrato

`pose.world` está em metros, com o eixo y **para cima** (câmera na vertical). A origem depende da fonte: só as direções importam. Só há ponto 3D para as articulações que também estão em `points`, assim os dois espaços veem o mesmo corpo.

## Comparar com o goniômetro

A profundidade vem de uma única câmera, então é estimada. `kinesia-validate` mede cada vídeo em 2D e em 3D e grava `resultados.csv` e `resultados-3d.csv`, para decidir com dados qual usar em cada exercício:

```bash
swift run kinesia-validate mediciones.csv
```
