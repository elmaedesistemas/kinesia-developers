---
title: Exercise catalog
description: The exercises in ExerciseLibrary, with their measure, thresholds and form rules.
---

`ExerciseLibrary` ships 8 ready-to-use exercises.

```swift
ExerciseLibrary.all                           // all of them
ExerciseLibrary.definition(id: "knee.flexion.standing")
ExerciseLibrary.definitions(for: .shoulder)   // by region
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

"reps 30 → 90" means `.reps(low: 30, high: 90)`: see [Reps and holds](/en/conceptos/repeticiones/).

## Elbow

### Elbow flexion · `elbowFlexion`

Standing, seen from the side. The upper arm stays by the body so the shoulder can't do the work.

- **Measures:** `.flexion(a: "shoulder", vertex: "elbow", b: "wrist")`
- **Rules:** `keepUpperArmStill`: upper arm from vertical within 0…30°.

## Knee

### Standing knee flexion · `kneeFlexionStanding`

Heel to glute, seen from the side. The thigh stays vertical and the trunk upright, so it isn't a squat or a lean.

- **Measures:** `.flexion(a: "hip", vertex: "knee", b: "ankle")`
- **Rules:** `keepThighStill` (thigh 0…25°), `keepTrunkUpright` (trunk 0…20°).

## Shoulder

### Shoulder flexion · `shoulderFlexion`

Arm forward and up, seen from the side. Elbow straight; the trunk doesn't lean back to fake height.

- **Measures:** `.fromVertical(from: "shoulder", to: "elbow")`
- **Rules:** `keepElbowStraight` (elbow flexion 0…25°), `keepTrunkUpright` (0…15°).

### Shoulder abduction · `shoulderAbduction`

Arm out to the side and up, seen from the front. Elbow straight, no shrugging and no leaning to the other side.

- **Measures:** `.fromVertical(from: "shoulder", to: "elbow")`
- **Rules:** `keepElbowStraight` (0…25°), `keepShouldersLevel` (tilt between shoulders 0…15°), `keepTrunkUpright` (0…15°).

## Hip

### Standing hip flexion · `hipFlexionStanding`

Marching with a bent knee, seen from the side. The trunk stays upright so leaning back doesn't add degrees.

- **Measures:** `.fromVertical(from: "hip", to: "knee")`
- **Rules:** `keepTrunkUpright` (0…15°).

### Standing hip abduction · `hipAbductionStanding`

Leg out to the side, seen from the front. Knee straight, hips level (no hiking the pelvis) and trunk upright.

- **Measures:** `.fromVertical(from: "hip", to: "ankle")`
- **Rules:** `keepKneeStraight` (0…20°), `keepHipsLevel` (0…10°), `keepTrunkUpright` (0…15°).

## Ankle

### Dorsiflexion lunge · `ankleDorsiflexionLunge`

Weight-bearing lunge, seen from the side, held at the end of the range.

- **Measures:** `.fromVertical(from: "knee", to: "ankle")`, the shin's tilt.
- **Kind:** hold, above 15° for 3 s.
- **Rules:** `keepTrunkUpright` (0…30°).

:::caution[The heel must stay on the floor]
2D pose has no toe point, so the shin's tilt is measured instead, which tracks dorsiflexion only while the heel stays down. Your app must ask the patient for that.
:::

## Neck

### Lateral flexion · `neckLateralFlexion`

Ear toward shoulder, seated or standing, seen from the front. Shoulders stay level so the ear comes down instead of the shoulder going up.

- **Measures:** `.tilt(a: "ear", b: "opposite.ear")`
- **Rules:** `keepShouldersLevel` (0…10°).

:::note
The tilt has no direction: the same value comes out to the left or right. Do one set per side.
:::
