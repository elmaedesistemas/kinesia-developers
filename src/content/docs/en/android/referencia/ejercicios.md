---
title: Exercise catalog
description: The exercises in ExerciseLibrary, with their measure, thresholds and form rules.
---

`ExerciseLibrary` ships 12 ready-to-use exercises.

```kotlin
ExerciseLibrary.all                                   // all of them
ExerciseLibrary.definition("knee.flexion.standing")
ExerciseLibrary.definitions(BodyRegion.SHOULDER)      // by region
```

## Summary

| Exercise | `id` | View | Kind | Target |
| --- | --- | --- | --- | --- |
| Elbow flexion | `elbow.flexion` | side | reps 30 → 90 | 120° |
| Standing knee flexion | `knee.flexion.standing` | side | reps 20 → 60 | 110° |
| Shoulder flexion | `shoulder.flexion` | side | reps 30 → 90 | 160° |
| Shoulder abduction | `shoulder.abduction` | front | reps 30 → 90 | 160° |
| Standing hip flexion | `hip.flexion.standing` | side | reps 20 → 50 | 90° |
| Standing hip abduction | `hip.abduction.standing` | front | reps 10 → 20 | 40° |
| Ankle dorsiflexion lunge | `ankle.dorsiflexion.lunge` | side | hold > 15° · 3 s | 35° |
| Neck lateral flexion | `neck.lateralFlexion` | front | reps 10 → 20 | 40° |
| Shoulder extension | `shoulder.extension` | side | reps 15 → 30 | 50° |
| Standing hip extension | `hip.extension.standing` | side | reps 8 → 15 | 20° |
| Trunk flexion | `trunk.flexion` | side | reps 20 → 45 | 70° |
| Trunk lateral flexion | `trunk.lateralFlexion` | front | reps 10 → 20 | 30° |

"reps 30 → 90" means `Kind.Reps(low = 30.0, high = 90.0)`: see [Reps and holds](/en/android/conceptos/repeticiones/).

## Elbow

### Elbow flexion · `elbowFlexion`

Standing, seen from the side. The upper arm stays by the body so the shoulder can't do the work.

- **Measures:** `Measure.Flexion("shoulder", "elbow", "wrist")`
- **Rules:** `KEEP_UPPER_ARM_STILL`: upper arm from vertical within 0…30°.

## Knee

### Standing knee flexion · `kneeFlexionStanding`

Heel to glute, seen from the side. The thigh stays vertical and the trunk upright, so it isn't a squat or a lean.

- **Measures:** `Measure.Flexion("hip", "knee", "ankle")`
- **Rules:** `KEEP_THIGH_STILL` (thigh 0…25°), `KEEP_TRUNK_UPRIGHT` (trunk 0…20°).

## Shoulder

### Shoulder flexion · `shoulderFlexion`

Arm forward and up, seen from the side. Elbow straight; the trunk doesn't lean back to fake height.

- **Measures:** `Measure.FromVertical("shoulder", "elbow")`
- **Rules:** `KEEP_ELBOW_STRAIGHT` (elbow flexion 0…25°), `KEEP_TRUNK_UPRIGHT` (0…15°).

### Shoulder abduction · `shoulderAbduction`

Arm out to the side and up, seen from the front. Elbow straight, no shrugging and no leaning to the other side.

- **Measures:** `Measure.FromVertical("shoulder", "elbow")`
- **Rules:** `KEEP_ELBOW_STRAIGHT` (0…25°), `KEEP_SHOULDERS_LEVEL` (tilt between shoulders 0…15°), `KEEP_TRUNK_UPRIGHT` (0…15°).

### Shoulder extension · `shoulderExtension`

Straight arm back, seen from the side. Elbow straight; the trunk doesn't lean forward to add degrees.

- **Measures:** `Measure.FromVertical("shoulder", "elbow")`
- **Rules:** `KEEP_ELBOW_STRAIGHT` (0…25°), `KEEP_TRUNK_UPRIGHT` (0…15°).

:::note
Extensions read the same angle as the matching flexion, which has no direction. Your app must tell the patient which way to move.
:::

## Hip

### Standing hip flexion · `hipFlexionStanding`

Marching with a bent knee, seen from the side. The trunk stays upright so leaning back doesn't add degrees.

- **Measures:** `Measure.FromVertical("hip", "knee")`
- **Rules:** `KEEP_TRUNK_UPRIGHT` (0…15°).

### Standing hip abduction · `hipAbductionStanding`

Leg out to the side, seen from the front. Knee straight, hips level (no hiking the pelvis) and trunk upright.

- **Measures:** `Measure.FromVertical("hip", "ankle")`
- **Rules:** `KEEP_KNEE_STRAIGHT` (0…20°), `KEEP_HIPS_LEVEL` (0…10°), `KEEP_TRUNK_UPRIGHT` (0…15°).

### Standing hip extension · `hipExtensionStanding`

Straight leg back, seen from the side, holding a chair. Knee straight and trunk upright: leaning forward is how the back fakes hip extension.

- **Measures:** `Measure.FromVertical("hip", "ankle")`
- **Rules:** `KEEP_KNEE_STRAIGHT` (0…20°), `KEEP_TRUNK_UPRIGHT` (0…15°).

## Ankle

### Dorsiflexion lunge · `ankleDorsiflexionLunge`

Weight-bearing lunge, seen from the side, held at the end of the range.

- **Measures:** `Measure.FromVertical("knee", "ankle")`, the shin's tilt.
- **Kind:** hold, above 15° for 3 s.
- **Rules:** `KEEP_TRUNK_UPRIGHT` (0…30°).

:::caution[The heel must stay on the floor]
2D pose has no toe point, so the shin's tilt is measured instead, which tracks dorsiflexion only while the heel stays down. Your app must ask the patient for that.
:::

## Neck

### Lateral flexion · `neckLateralFlexion`

Ear toward shoulder, seated or standing, seen from the front. Shoulders stay level so the ear comes down instead of the shoulder going up.

- **Measures:** `Measure.Tilt("ear", "opposite.ear")`
- **Rules:** `KEEP_SHOULDERS_LEVEL` (0…10°).

:::note
The tilt has no direction: the same value comes out to the left or right. Do one set per side.
:::

## Trunk

### Trunk flexion · `trunkFlexion`

Bend toward the floor, standing, seen from the side. Knees straight, so bending them doesn't buy depth. Region `back`.

- **Measures:** `Measure.FromVertical("shoulder", "hip")`, the trunk's lean.
- **Rules:** `KEEP_KNEE_STRAIGHT` (0…20°).

:::caution[Lumbar plus hip]
2D pose has no spine points, so the trunk's lean is measured (shoulder over hip), which adds lumbar and hip flexion, like an inclinometer at the shoulders.
:::

### Trunk lateral flexion · `trunkLateralFlexion`

The hand slides down the thigh, standing, seen from the front. Hips level, so the pelvis doesn't shift. Region `back`.

- **Measures:** `Measure.FromVertical("neck", "root")`, the midline (between the shoulders to between the hips) against vertical.
- **Rules:** `KEEP_HIPS_LEVEL` (0…10°).

:::note
The tilt has no direction: do one set per side.
:::
