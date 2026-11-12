---
title: Catálogo de ejercicios
description: Los ejercicios que vienen en ExerciseLibrary, con su medición, umbrales y reglas de forma.
---

`ExerciseLibrary` trae 12 ejercicios listos para usar.

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
| Extensión de hombro | `shoulder.extension` | lado | reps 15 → 30 | 50° |
| Extensión de cadera de pie | `hip.extension.standing` | lado | reps 8 → 15 | 20° |
| Flexión de tronco | `trunk.flexion` | lado | reps 20 → 45 | 70° |
| Inclinación lateral de tronco | `trunk.lateralFlexion` | frente | reps 10 → 20 | 30° |

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

### Extensión de hombro · `shoulderExtension`

Brazo estirado hacia atrás, de perfil. Codo estirado; el tronco no se inclina hacia adelante para sumar grados.

- **Mide:** `Measure.FromVertical("shoulder", "elbow")`
- **Reglas:** `KEEP_ELBOW_STRAIGHT` (0…25°), `KEEP_TRUNK_UPRIGHT` (0…15°).

:::note
Las extensiones leen el mismo ángulo que la flexión correspondiente, que no tiene dirección. Tu app debe decirle al paciente hacia dónde moverse.
:::

## Cadera

### Flexión de cadera de pie · `hipFlexionStanding`

Marcha con rodilla doblada, de perfil. El tronco queda recto para que echarse atrás no sume grados.

- **Mide:** `Measure.FromVertical("hip", "knee")`
- **Reglas:** `KEEP_TRUNK_UPRIGHT` (0…15°).

### Abducción de cadera de pie · `hipAbductionStanding`

Pierna hacia el lado, de frente. Rodilla estirada, cadera nivelada (sin subir la pelvis) y tronco recto.

- **Mide:** `Measure.FromVertical("hip", "ankle")`
- **Reglas:** `KEEP_KNEE_STRAIGHT` (0…20°), `KEEP_HIPS_LEVEL` (0…10°), `KEEP_TRUNK_UPRIGHT` (0…15°).

### Extensión de cadera de pie · `hipExtensionStanding`

Pierna estirada hacia atrás, de perfil, apoyado en una silla. Rodilla estirada y tronco recto: inclinarse hacia adelante es como la espalda finge la extensión.

- **Mide:** `Measure.FromVertical("hip", "ankle")`
- **Reglas:** `KEEP_KNEE_STRAIGHT` (0…20°), `KEEP_TRUNK_UPRIGHT` (0…15°).

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

## Tronco

### Flexión de tronco · `trunkFlexion`

Inclinarse hacia el suelo, de pie y de perfil. Rodillas estiradas, para que doblarlas no compre profundidad. Región `back`.

- **Mide:** `Measure.FromVertical("shoulder", "hip")`, la inclinación del tronco.
- **Reglas:** `KEEP_KNEE_STRAIGHT` (0…20°).

:::caution[Suma lumbar y cadera]
La pose 2D no tiene puntos de la columna, así que se mide la inclinación del tronco (hombro sobre cadera), que suma la flexión lumbar y la de cadera, como un inclinómetro a la altura de los hombros.
:::

### Inclinación lateral de tronco · `trunkLateralFlexion`

La mano se desliza por el muslo, de pie y de frente. Cadera nivelada, para que la pelvis no se desplace. Región `back`.

- **Mide:** `Measure.FromVertical("neck", "root")`, la línea media (entre hombros y entre caderas) contra la vertical.
- **Reglas:** `KEEP_HIPS_LEVEL` (0…10°).

:::note
La inclinación no tiene dirección: haz una serie por lado.
:::
