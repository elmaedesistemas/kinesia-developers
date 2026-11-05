---
title: Catálogo de ejercicios
description: Los ejercicios que vienen en ExerciseLibrary, con su medición, umbrales y reglas de forma.
---

`ExerciseLibrary` trae 8 ejercicios listos para usar.

```kotlin
ExerciseLibrary.all                                   // todos
ExerciseLibrary.definition("knee.flexion.standing")
ExerciseLibrary.definitions(BodyRegion.SHOULDER)      // por región
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

«reps 30 → 90» significa `Kind.Reps(low = 30.0, high = 90.0)`: ver [Repeticiones y sostenidos](/android/conceptos/repeticiones/).

## Codo

### Flexión de codo · `elbowFlexion`

De pie, de perfil. El brazo queda pegado al cuerpo para que el hombro no haga el trabajo.

- **Mide:** `Measure.Flexion("shoulder", "elbow", "wrist")`
- **Reglas:** `KEEP_UPPER_ARM_STILL`: brazo contra la vertical en 0…30°.

## Rodilla

### Flexión de rodilla de pie · `kneeFlexionStanding`

Talón al glúteo, de perfil. El muslo queda vertical y el tronco recto, para que no sea una sentadilla ni una inclinación.

- **Mide:** `Measure.Flexion("hip", "knee", "ankle")`
- **Reglas:** `KEEP_THIGH_STILL` (muslo 0…25°), `KEEP_TRUNK_UPRIGHT` (tronco 0…20°).

## Hombro

### Flexión de hombro · `shoulderFlexion`

Brazo hacia adelante y arriba, de perfil. Codo estirado; el tronco no se echa atrás para ganar altura.

- **Mide:** `Measure.FromVertical("shoulder", "elbow")`
- **Reglas:** `KEEP_ELBOW_STRAIGHT` (flexión de codo 0…25°), `KEEP_TRUNK_UPRIGHT` (0…15°).

### Abducción de hombro · `shoulderAbduction`

Brazo hacia el lado y arriba, de frente. Codo estirado, sin encoger el hombro ni inclinarse al otro lado.

- **Mide:** `Measure.FromVertical("shoulder", "elbow")`
- **Reglas:** `KEEP_ELBOW_STRAIGHT` (0…25°), `KEEP_SHOULDERS_LEVEL` (inclinación entre hombros 0…15°), `KEEP_TRUNK_UPRIGHT` (0…15°).

## Cadera

### Flexión de cadera de pie · `hipFlexionStanding`

Marcha con rodilla doblada, de perfil. El tronco queda recto para que echarse atrás no sume grados.

- **Mide:** `Measure.FromVertical("hip", "knee")`
- **Reglas:** `KEEP_TRUNK_UPRIGHT` (0…15°).

### Abducción de cadera de pie · `hipAbductionStanding`

Pierna hacia el lado, de frente. Rodilla estirada, cadera nivelada (sin subir la pelvis) y tronco recto.

- **Mide:** `Measure.FromVertical("hip", "ankle")`
- **Reglas:** `KEEP_KNEE_STRAIGHT` (0…20°), `KEEP_HIPS_LEVEL` (0…10°), `KEEP_TRUNK_UPRIGHT` (0…15°).

## Tobillo

### Dorsiflexión en zancada · `ankleDorsiflexionLunge`

Zancada con apoyo, de perfil, sosteniendo al final del rango.

- **Mide:** `Measure.FromVertical("knee", "ankle")`, la inclinación de la tibia.
- **Tipo:** sostenido, más de 15° durante 3 s.
- **Reglas:** `KEEP_TRUNK_UPRIGHT` (0…30°).

:::caution[El talón debe quedar en el suelo]
La pose 2D no tiene punto para los dedos del pie, así que se mide la inclinación de la tibia, que sigue a la dorsiflexión solo mientras el talón está apoyado. Tu app debe pedírselo al paciente.
:::

## Cuello

### Inclinación lateral · `neckLateralFlexion`

Oreja hacia el hombro, sentado o de pie, de frente. Los hombros quedan nivelados para que baje la oreja y no suba el hombro.

- **Mide:** `Measure.Tilt("ear", "opposite.ear")`
- **Reglas:** `KEEP_SHOULDERS_LEVEL` (0…10°).

:::note
La inclinación no tiene dirección: el mismo valor sale hacia la izquierda o la derecha. Haz una serie por lado.
:::
