---
title: Catálogo de exercícios
description: Os exercícios do ExerciseLibrary, com sua medição, limiares e regras de forma.
---

`ExerciseLibrary` traz 12 exercícios prontos para usar.

```kotlin
ExerciseLibrary.all                                   // todos
ExerciseLibrary.definition("knee.flexion.standing")
ExerciseLibrary.definitions(BodyRegion.SHOULDER)      // por região
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
| Extensão de ombro | `shoulder.extension` | lado | reps 15 → 30 | 50° |
| Extensão de quadril em pé | `hip.extension.standing` | lado | reps 8 → 15 | 20° |
| Flexão de tronco | `trunk.flexion` | lado | reps 20 → 45 | 70° |
| Inclinação lateral do tronco | `trunk.lateralFlexion` | frente | reps 10 → 20 | 30° |

«reps 30 → 90» significa `Kind.Reps(low = 30.0, high = 90.0)`: veja [Repetições e sustentações](/pt/android/conceptos/repeticiones/).

## Cotovelo

### Flexão de cotovelo · `elbowFlexion`

Em pé, de perfil. O braço fica junto ao corpo para que o ombro não faça o trabalho.

- **Mede:** `Measure.Flexion("shoulder", "elbow", "wrist")`
- **Regras:** `KEEP_UPPER_ARM_STILL`: braço em relação à vertical em 0…30°.

## Joelho

### Flexão de joelho em pé · `kneeFlexionStanding`

Calcanhar ao glúteo, de perfil. A coxa fica vertical e o tronco reto, para que não vire um agachamento nem uma inclinação.

- **Mede:** `Measure.Flexion("hip", "knee", "ankle")`
- **Regras:** `KEEP_THIGH_STILL` (coxa 0…25°), `KEEP_TRUNK_UPRIGHT` (tronco 0…20°).

## Ombro

### Flexão de ombro · `shoulderFlexion`

Braço para frente e para cima, de perfil. Cotovelo esticado; o tronco não se inclina para trás para ganhar altura.

- **Mede:** `Measure.FromVertical("shoulder", "elbow")`
- **Regras:** `KEEP_ELBOW_STRAIGHT` (flexão de cotovelo 0…25°), `KEEP_TRUNK_UPRIGHT` (0…15°).

### Abdução de ombro · `shoulderAbduction`

Braço para o lado e para cima, de frente. Cotovelo esticado, sem encolher o ombro nem inclinar para o outro lado.

- **Mede:** `Measure.FromVertical("shoulder", "elbow")`
- **Regras:** `KEEP_ELBOW_STRAIGHT` (0…25°), `KEEP_SHOULDERS_LEVEL` (inclinação entre ombros 0…15°), `KEEP_TRUNK_UPRIGHT` (0…15°).

### Extensão de ombro · `shoulderExtension`

Braço esticado para trás, de perfil. Cotovelo esticado; o tronco não se inclina para frente para somar graus.

- **Mede:** `Measure.FromVertical("shoulder", "elbow")`
- **Regras:** `KEEP_ELBOW_STRAIGHT` (0…25°), `KEEP_TRUNK_UPRIGHT` (0…15°).

:::note
As extensões leem o mesmo ângulo que a flexão correspondente, que não tem direção. Seu app deve dizer ao paciente para onde se mover.
:::

## Quadril

### Flexão de quadril em pé · `hipFlexionStanding`

Marcha com joelho dobrado, de perfil. O tronco fica reto para que inclinar para trás não some graus.

- **Mede:** `Measure.FromVertical("hip", "knee")`
- **Regras:** `KEEP_TRUNK_UPRIGHT` (0…15°).

### Abdução de quadril em pé · `hipAbductionStanding`

Perna para o lado, de frente. Joelho esticado, quadril nivelado (sem subir a pelve) e tronco reto.

- **Mede:** `Measure.FromVertical("hip", "ankle")`
- **Regras:** `KEEP_KNEE_STRAIGHT` (0…20°), `KEEP_HIPS_LEVEL` (0…10°), `KEEP_TRUNK_UPRIGHT` (0…15°).

### Extensão de quadril em pé · `hipExtensionStanding`

Perna esticada para trás, de perfil, apoiado numa cadeira. Joelho esticado e tronco reto: inclinar para frente é como a coluna finge a extensão.

- **Mede:** `Measure.FromVertical("hip", "ankle")`
- **Regras:** `KEEP_KNEE_STRAIGHT` (0…20°), `KEEP_TRUNK_UPRIGHT` (0…15°).

## Tornozelo

### Dorsiflexão em afundo · `ankleDorsiflexionLunge`

Afundo com apoio, de perfil, sustentando no fim da amplitude.

- **Mede:** `Measure.FromVertical("knee", "ankle")`, a inclinação da tíbia.
- **Tipo:** sustentação, acima de 15° por 3 s.
- **Regras:** `KEEP_TRUNK_UPRIGHT` (0…30°).

:::caution[O calcanhar deve ficar no chão]
A pose 2D não tem ponto para os dedos do pé, então mede-se a inclinação da tíbia, que acompanha a dorsiflexão só enquanto o calcanhar está apoiado. Seu app deve pedir isso ao paciente.
:::

## Pescoço

### Inclinação lateral · `neckLateralFlexion`

Orelha em direção ao ombro, sentado ou em pé, de frente. Os ombros ficam nivelados para que a orelha desça e o ombro não suba.

- **Mede:** `Measure.Tilt("ear", "opposite.ear")`
- **Regras:** `KEEP_SHOULDERS_LEVEL` (0…10°).

:::note
A inclinação não tem direção: o mesmo valor sai para a esquerda ou para a direita. Faça uma série por lado.
:::

## Tronco

### Flexão de tronco · `trunkFlexion`

Inclinar em direção ao chão, em pé e de perfil. Joelhos esticados, para que dobrá-los não ganhe profundidade. Região `back`.

- **Mede:** `Measure.FromVertical("shoulder", "hip")`, a inclinação do tronco.
- **Regras:** `KEEP_KNEE_STRAIGHT` (0…20°).

:::caution[Soma lombar e quadril]
A pose 2D não tem pontos da coluna, então mede-se a inclinação do tronco (ombro sobre quadril), que soma a flexão lombar e a de quadril, como um inclinômetro na altura dos ombros.
:::

### Inclinação lateral do tronco · `trunkLateralFlexion`

A mão desliza pela coxa, em pé e de frente. Quadril nivelado, para que a pelve não se desloque. Região `back`.

- **Mede:** `Measure.FromVertical("neck", "root")`, a linha média (entre os ombros e entre os quadris) contra a vertical.
- **Regras:** `KEEP_HIPS_LEVEL` (0…10°).

:::note
A inclinação não tem direção: faça uma série por lado.
:::
