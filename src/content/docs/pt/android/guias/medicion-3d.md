---
title: Medição 3D
description: Ângulos com profundidade que se mantêm mesmo quando o paciente gira um pouco diante da câmera.
---

Em 2D, o ângulo vem da imagem: se o paciente não está exatamente de perfil (ou de frente), o segmento parece mais curto e o ângulo sai errado. Com a medição 3D, cada `Pose` traz também a posição das articulações em metros, e o ângulo é calculado no espaço.

## Ativar

Peça pontos 3D ao provedor com `world = true`. O MediaPipe já calcula seus *world landmarks* em cada quadro, então quase não custa nada.

```kotlin
val camera = CameraPoseProvider(context, lifecycleOwner, world = true)
session.start(camera, scope)

// Também a partir de um vídeo:
val poses = VideoPoseProvider(context, uri, world = true).readAll()
```

## Escolher 2D ou 3D

Quem usa o kit decide com `space` em `MotionSession`:

| `space` | Mede | Precisa |
| --- | --- | --- |
| `null` (padrão) | Em 3D quando a pose traz, senão em 2D | Qualquer provedor |
| `MeasureSpace.IMAGE` | Sempre em 2D, na imagem | Qualquer provedor |
| `MeasureSpace.WORLD` | Sempre em 3D | Um provedor com `world = true` |

```kotlin
val session = MotionSession(ExerciseLibrary.elbowFlexion, BodySide.RIGHT, space = MeasureSpace.WORLD)

// Pode mudar ao vivo; vale a partir do próximo quadro:
session.space = MeasureSpace.IMAGE
```

Com `MeasureSpace.WORLD` e poses sem pontos 3D nada é medido, então use junto com `world = true`. `RepEngine` tem a mesma propriedade `space` se você o usa sem sessão.

## Como cada medida decide

`Measure.value(pose, side)` mede em 3D quando `pose.world` tem **todas** as articulações que a medida precisa; se faltar alguma, mede na imagem como sempre.

| Medida | Em 3D |
| --- | --- |
| `Angle`, `Flexion` | O ângulo real entre os dois segmentos, para onde quer que o paciente olhe |
| `FromVertical` | Contra a vertical real (eixo y para cima) |
| `Tilt` | Contra o plano horizontal |

Para forçar um espaço, sem alternativa:

```kotlin
val naImagem = medida.value(pose, BodySide.RIGHT, MeasureSpace.IMAGE)
val em3D = medida.value(pose, BodySide.RIGHT, MeasureSpace.WORLD)   // null sem pontos 3D
```

`pose.imageOnly` remove os pontos 3D de uma pose.

## O contrato

`pose.world` é um `Map<Joint, Point3>` em metros, com o eixo y **para cima** (câmera na vertical). A origem depende da fonte: só as direções importam. Só há ponto 3D para as articulações que também estão em `points`, assim os dois espaços veem o mesmo corpo.

Se você converte landmarks por conta própria, passe os do MediaPipe para `BlazePose.pose(..., worldLandmarks = ...)` como vêm (y para baixo): o SDK os gira.

## Tenha em mente

A profundidade vem de uma única câmera, então é estimada. Compare com um goniômetro nos seus exercícios antes de usá-la para decisões clínicas.
