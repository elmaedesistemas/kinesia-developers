---
title: Medición 3D
description: Ángulos con profundidad que no cambian aunque el paciente gire un poco frente a la cámara.
---

En 2D, el ángulo sale de la imagen: si el paciente no está exactamente de perfil (o de frente), el segmento se ve más corto y el ángulo se lee mal. Con la medición 3D, cada `Pose` trae también la posición de las articulaciones en metros, y el ángulo se calcula en el espacio.

## Activarla

Pide puntos 3D al proveedor con `world: true`. Usa el modelo 3D de Vision (`VNDetectHumanBodyPose3DRequest`, iOS 17), que cuesta más por fotograma que el 2D.

```swift
let camera = VisionPoseProvider(camera: .front, world: true)
session.start(with: camera)

// También desde un video:
let poses = try await VideoPoseProvider(url: url, world: true).readAll()
```

## Elegir 2D o 3D

Quien usa el kit decide con `space` en `MotionSession`:

| `space` | Mide | Necesita |
| --- | --- | --- |
| `nil` (por defecto) | En 3D cuando la pose lo trae, si no en 2D | Cualquier proveedor |
| `.image` | Siempre en 2D, sobre la imagen | Cualquier proveedor |
| `.world` | Siempre en 3D | Un proveedor con `world: true` |

```swift
let session = MotionSession(exercise: ExerciseLibrary.elbowFlexion, side: .right, space: .world)

// Se puede cambiar en vivo; aplica desde el siguiente fotograma:
session.space = .image
```

Con `.world` y poses sin puntos 3D no se mide nada, así que úsalo junto con `world: true`. `RepEngine` tiene la misma propiedad `space` si lo usas sin sesión.

## Cómo decide cada medida

`Measure.value(in:side:)` mide en 3D cuando `pose.world` tiene **todas** las articulaciones que la medida necesita; si falta alguna, mide en la imagen como siempre.

| Medida | En 3D |
| --- | --- |
| `angle`, `flexion` | El ángulo real entre los dos segmentos, sin importar hacia dónde mire el paciente |
| `fromVertical` | Contra la vertical real (eje y hacia arriba) |
| `tilt` | Contra el plano horizontal |

El modelo 3D de Vision no tiene ojos, orejas ni nariz: las medidas de cuello siguen en 2D.

Para forzar un espacio, sin respaldo:

```swift
let enImagen = medida.value(in: pose, side: .right, space: .image)
let en3D = medida.value(in: pose, side: .right, space: .world)   // nil si no hay puntos 3D
```

`pose.imageOnly` quita los puntos 3D de una pose.

## El contrato

`pose.world` está en metros, con el eje y **hacia arriba** (la cámara en vertical). El origen depende de la fuente: solo importan las direcciones. Solo hay punto 3D para las articulaciones que también están en `points`, así los dos espacios ven el mismo cuerpo.

## Compararla con el goniómetro

La profundidad sale de una sola cámara, así que es estimada. `kinesia-validate` mide cada video en 2D y en 3D y escribe `resultados.csv` y `resultados-3d.csv`, para decidir con datos cuál usar en cada ejercicio:

```bash
swift run kinesia-validate mediciones.csv
```
