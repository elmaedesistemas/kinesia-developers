---
title: Catálogo de ejercicios
description: Los ejercicios que vienen en ExerciseLibrary, con su medición, umbrales y reglas de forma.
---

`ExerciseLibrary` trae 8 ejercicios listos para usar.

```swift
ExerciseLibrary.all                           // todos
ExerciseLibrary.definition(id: "knee.flexion.standing")
ExerciseLibrary.definitions(for: .shoulder)   // por región
```

## Resumen

| Ejercicio | `id` | Vista | Tipo | Objetivo |
| --- | --- | --- | --- | --- |
| Flexión de codo | `elbow.flexion` | lado | reps 30 → 90 | 120° |
| Flexión de rodilla de pie | `knee.flexion.standing` | lado | reps 20 → 60 | 110° |
| Flexión de hombro | `shoulder.flexion` | lado | reps 30 → 90 | 160° |
| Abducción de hombro | `shoulder.abduction` | frente | reps 30 → 90 | 160° |
| Flexión de cadera de pie | `hip.flexion.standing` | lado | reps 20 → 50 | 90° |
| Abducción de cadera de pie | `hip.abduction.standing` | frente | reps 10 → 20 | 40° |
| Dorsiflexión de tobillo en zancada | `ankle.dorsiflexion.lunge` | lado | sostenido > 15° · 3 s | 35° |
| Inclinación lateral de cuello | `neck.lateralFlexion` | frente | reps 10 → 20 | 40° |

«reps 30 → 90» significa `.reps(low: 30, high: 90)`: ver [Repeticiones y sostenidos](/conceptos/repeticiones/).

## Codo

### Flexión de codo · `elbowFlexion`

De pie, de perfil. El brazo queda pegado al cuerpo para que el hombro no haga el trabajo.

- **Mide:** `.flexion(a: "shoulder", vertex: "elbow", b: "wrist")`
- **Reglas:** `keepUpperArmStill`: brazo contra la vertical en 0…30°.

## Rodilla

### Flexión de rodilla de pie · `kneeFlexionStanding`

Talón al glúteo, de perfil. El muslo queda vertical y el tronco recto, para que no sea una sentadilla ni una inclinación.

- **Mide:** `.flexion(a: "hip", vertex: "knee", b: "ankle")`
- **Reglas:** `keepThighStill` (muslo 0…25°), `keepTrunkUpright` (tronco 0…20°).

## Hombro

### Flexión de hombro · `shoulderFlexion`

Brazo hacia adelante y arriba, de perfil. Codo estirado; el tronco no se echa atrás para ganar altura.

- **Mide:** `.fromVertical(from: "shoulder", to: "elbow")`
- **Reglas:** `keepElbowStraight` (flexión de codo 0…25°), `keepTrunkUpright` (0…15°).

### Abducción de hombro · `shoulderAbduction`

Brazo hacia el lado y arriba, de frente. Codo estirado, sin encoger el hombro ni inclinarse al otro lado.

- **Mide:** `.fromVertical(from: "shoulder", to: "elbow")`
- **Reglas:** `keepElbowStraight` (0…25°), `keepShouldersLevel` (inclinación entre hombros 0…15°), `keepTrunkUpright` (0…15°).

## Cadera

### Flexión de cadera de pie · `hipFlexionStanding`

Marcha con rodilla doblada, de perfil. El tronco queda recto para que echarse atrás no sume grados.

- **Mide:** `.fromVertical(from: "hip", to: "knee")`
- **Reglas:** `keepTrunkUpright` (0…15°).

### Abducción de cadera de pie · `hipAbductionStanding`

Pierna hacia el lado, de frente. Rodilla estirada, cadera nivelada (sin subir la pelvis) y tronco recto.

- **Mide:** `.fromVertical(from: "hip", to: "ankle")`
- **Reglas:** `keepKneeStraight` (0…20°), `keepHipsLevel` (0…10°), `keepTrunkUpright` (0…15°).

## Tobillo

### Dorsiflexión en zancada · `ankleDorsiflexionLunge`

Zancada con apoyo, de perfil, sosteniendo al final del rango.

- **Mide:** `.fromVertical(from: "knee", to: "ankle")`, la inclinación de la tibia.
- **Tipo:** sostenido, más de 15° durante 3 s.
- **Reglas:** `keepTrunkUpright` (0…30°).

:::caution[El talón debe quedar en el suelo]
La pose 2D no tiene punto para los dedos del pie, así que se mide la inclinación de la tibia, que sigue a la dorsiflexión solo mientras el talón está apoyado. Tu app debe pedírselo al paciente.
:::

## Cuello

### Inclinación lateral · `neckLateralFlexion`

Oreja hacia el hombro, sentado o de pie, de frente. Los hombros quedan nivelados para que baje la oreja y no suba el hombro.

- **Mide:** `.tilt(a: "ear", b: "opposite.ear")`
- **Reglas:** `keepShouldersLevel` (0…10°).

:::note
La inclinación no tiene dirección: el mismo valor sale hacia la izquierda o la derecha. Haz una serie por lado.
:::
