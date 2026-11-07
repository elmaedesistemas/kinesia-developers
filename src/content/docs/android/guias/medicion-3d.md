---
title: Medición 3D
description: Ángulos con profundidad que no cambian aunque el paciente gire un poco frente a la cámara.
---

En 2D, el ángulo sale de la imagen: si el paciente no está exactamente de perfil (o de frente), el segmento se ve más corto y el ángulo se lee mal. Con la medición 3D, cada `Pose` trae también la posición de las articulaciones en metros, y el ángulo se calcula en el espacio.

## Activarla

Pide puntos 3D al proveedor con `world = true`. MediaPipe ya calcula sus *world landmarks* en cada fotograma, así que casi no cuesta nada.

```kotlin
val camera = CameraPoseProvider(context, lifecycleOwner, world = true)
session.start(camera, scope)

// También desde un video:
val poses = VideoPoseProvider(context, uri, world = true).readAll()
```

## Elegir 2D o 3D

Quien usa el kit decide con `space` en `MotionSession`:

| `space` | Mide | Necesita |
| --- | --- | --- |
| `null` (por defecto) | En 3D cuando la pose lo trae, si no en 2D | Cualquier proveedor |
| `MeasureSpace.IMAGE` | Siempre en 2D, sobre la imagen | Cualquier proveedor |
| `MeasureSpace.WORLD` | Siempre en 3D | Un proveedor con `world = true` |

```kotlin
val session = MotionSession(ExerciseLibrary.elbowFlexion, BodySide.RIGHT, space = MeasureSpace.WORLD)

// Se puede cambiar en vivo; aplica desde el siguiente fotograma:
session.space = MeasureSpace.IMAGE
```

Con `MeasureSpace.WORLD` y poses sin puntos 3D no se mide nada, así que úsalo junto con `world = true`. `RepEngine` tiene la misma propiedad `space` si lo usas sin sesión.

## Cómo decide cada medida

`Measure.value(pose, side)` mide en 3D cuando `pose.world` tiene **todas** las articulaciones que la medida necesita; si falta alguna, mide en la imagen como siempre.

| Medida | En 3D |
| --- | --- |
| `Angle`, `Flexion` | El ángulo real entre los dos segmentos, sin importar hacia dónde mire el paciente |
| `FromVertical` | Contra la vertical real (eje y hacia arriba) |
| `Tilt` | Contra el plano horizontal |

Para forzar un espacio, sin respaldo:

```kotlin
val enImagen = medida.value(pose, BodySide.RIGHT, MeasureSpace.IMAGE)
val en3D = medida.value(pose, BodySide.RIGHT, MeasureSpace.WORLD)   // null si no hay puntos 3D
```

`pose.imageOnly` quita los puntos 3D de una pose.

## El contrato

`pose.world` es un `Map<Joint, Point3>` en metros, con el eje y **hacia arriba** (la cámara en vertical). El origen depende de la fuente: solo importan las direcciones. Solo hay punto 3D para las articulaciones que también están en `points`, así los dos espacios ven el mismo cuerpo.

Si conviertes landmarks tú mismo, pasa los de MediaPipe a `BlazePose.pose(..., worldLandmarks = ...)` tal como vienen (con y hacia abajo): el SDK los gira.

## Ten en cuenta

La profundidad sale de una sola cámara, así que es estimada. Compárala con un goniómetro en tus ejercicios antes de usarla para decisiones clínicas.
