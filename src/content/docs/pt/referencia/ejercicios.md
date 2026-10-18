---
title: Catálogo de exercícios
description: Os exercícios do ExerciseLibrary, com sua medição, limiares e regras de forma.
---

`ExerciseLibrary` traz 8 exercícios prontos para usar.

```swift
ExerciseLibrary.all                           // todos
ExerciseLibrary.definition(id: "knee.flexion.standing")
ExerciseLibrary.definitions(for: .shoulder)   // por região
```

## Resumo

| Exercício | `id` | Vista | Tipo | Meta |
| --- | --- | --- | --- | --- |
| Flexão de cotovelo | `elbow.flexion` | lado | reps 30 → 90 | 120° |
| Flexão de joelho em pé | `knee.flexion.standing` | lado | reps 20 → 60 | 110° |
| Flexão de ombro | `shoulder.flexion` | lado | reps 30 → 90 | 160° |
| Abdução de ombro | `shoulder.abduction` | frente | reps 30 → 90 | 160° |
| Flexão de quadril em pé | `hip.flexion.standing` | lado | reps 20 → 50 | 90° |
| Abdução de quadril em pé | `hip.abduction.standing` | frente | reps 10 → 20 | 40° |
| Dorsiflexão de tornozelo em afundo | `ankle.dorsiflexion.lunge` | lado | sustentação > 15° · 3 s | 35° |
| Inclinação lateral do pescoço | `neck.lateralFlexion` | frente | reps 10 → 20 | 40° |

«reps 30 → 90» significa `.reps(low: 30, high: 90)`: veja [Repetições e sustentações](/pt/conceptos/repeticiones/).

## Cotovelo

### Flexão de cotovelo · `elbowFlexion`

Em pé, de perfil. O braço fica junto ao corpo para que o ombro não faça o trabalho.

- **Mede:** `.flexion(a: "shoulder", vertex: "elbow", b: "wrist")`
- **Regras:** `keepUpperArmStill`: braço em relação à vertical em 0…30°.

## Joelho

### Flexão de joelho em pé · `kneeFlexionStanding`

Calcanhar ao glúteo, de perfil. A coxa fica vertical e o tronco reto, para que não vire um agachamento nem uma inclinação.

- **Mede:** `.flexion(a: "hip", vertex: "knee", b: "ankle")`
- **Regras:** `keepThighStill` (coxa 0…25°), `keepTrunkUpright` (tronco 0…20°).

## Ombro

### Flexão de ombro · `shoulderFlexion`

Braço para frente e para cima, de perfil. Cotovelo esticado; o tronco não se inclina para trás para ganhar altura.

- **Mede:** `.fromVertical(from: "shoulder", to: "elbow")`
- **Regras:** `keepElbowStraight` (flexão de cotovelo 0…25°), `keepTrunkUpright` (0…15°).

### Abdução de ombro · `shoulderAbduction`

Braço para o lado e para cima, de frente. Cotovelo esticado, sem encolher o ombro nem inclinar para o outro lado.

- **Mede:** `.fromVertical(from: "shoulder", to: "elbow")`
- **Regras:** `keepElbowStraight` (0…25°), `keepShouldersLevel` (inclinação entre ombros 0…15°), `keepTrunkUpright` (0…15°).

## Quadril

### Flexão de quadril em pé · `hipFlexionStanding`

Marcha com joelho dobrado, de perfil. O tronco fica reto para que inclinar para trás não some graus.

- **Mede:** `.fromVertical(from: "hip", to: "knee")`
- **Regras:** `keepTrunkUpright` (0…15°).

### Abdução de quadril em pé · `hipAbductionStanding`

Perna para o lado, de frente. Joelho esticado, quadril nivelado (sem subir a pelve) e tronco reto.

- **Mede:** `.fromVertical(from: "hip", to: "ankle")`
- **Regras:** `keepKneeStraight` (0…20°), `keepHipsLevel` (0…10°), `keepTrunkUpright` (0…15°).

## Tornozelo

### Dorsiflexão em afundo · `ankleDorsiflexionLunge`

Afundo com apoio, de perfil, sustentando no fim da amplitude.

- **Mede:** `.fromVertical(from: "knee", to: "ankle")`, a inclinação da tíbia.
- **Tipo:** sustentação, acima de 15° por 3 s.
- **Regras:** `keepTrunkUpright` (0…30°).

:::caution[O calcanhar deve ficar no chão]
A pose 2D não tem ponto para os dedos do pé, então mede-se a inclinação da tíbia, que acompanha a dorsiflexão só enquanto o calcanhar está apoiado. Seu app deve pedir isso ao paciente.
:::

## Pescoço

### Inclinação lateral · `neckLateralFlexion`

Orelha em direção ao ombro, sentado ou em pé, de frente. Os ombros ficam nivelados para que a orelha desça e o ombro não suba.

- **Mede:** `.tilt(a: "ear", b: "opposite.ear")`
- **Regras:** `keepShouldersLevel` (0…10°).

:::note
A inclinação não tem direção: o mesmo valor sai para a esquerda ou para a direita. Faça uma série por lado.
:::
