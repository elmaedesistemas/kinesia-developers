---
title: El contrato de Pose
description: Las reglas que debe cumplir cualquier fuente de poses.
---

Una `Pose` es un fotograma de puntos del cuerpo. Todo el motor confía en que las poses cumplen este contrato; si escribes tu propio `PoseProvider`, eres tú quien debe respetarlo.

```kotlin
public data class Pose(
    val points: Map<Joint, Point>,
    val timestamp: Double,                 // segundos
    val imageSize: Size? = null,
    val confidence: Map<Joint, Double> = emptyMap(),
)
```

## Las cuatro reglas

1. **Píxeles de imagen, con `y` hacia abajo.** El origen está arriba a la izquierda, como en las vistas de Android. MediaPipe entrega coordenadas normalizadas (0…1): el adaptador debe convertirlas a píxeles.
2. **Lados anatómicos.** `Joint.LEFT_ELBOW` es el codo izquierdo *real* del paciente. Con la cámara frontal la imagen está espejada, así que el adaptador debe intercambiar izquierda y derecha antes de construir la pose.
3. **Solo puntos confiables.** Las articulaciones con baja confianza se omiten del mapa. Una articulación ausente significa «no la veo», y el motor la trata así: no mide, no castiga y avisa que falta.
4. **`confidence` es opcional.** Si tu detector no da confianza, deja el mapa vacío; las métricas de confianza saldrán `null`.

:::tip[Poses vacías]
Envía la pose aunque no tenga ningún punto. Una pose vacía le dice a la sesión que el paciente salió del encuadre, y así puede emitir `VisibilityChanged`.
:::

## Las 19 articulaciones

`Joint` tiene 19 puntos. MediaPipe detecta 33 (BlazePose): `BlazePose.pose(...)` los convierte, y calcula `NECK` y `ROOT` como el punto medio de los hombros y de las caderas.

| Zona | Articulaciones |
| --- | --- |
| Cabeza | `NOSE`, `LEFT_EYE`, `RIGHT_EYE`, `LEFT_EAR`, `RIGHT_EAR` |
| Línea media | `NECK`, `ROOT` (centro de la cadera) |
| Brazos | `LEFT_SHOULDER`, `RIGHT_SHOULDER`, `LEFT_ELBOW`, `RIGHT_ELBOW`, `LEFT_WRIST`, `RIGHT_WRIST` |
| Piernas | `LEFT_HIP`, `RIGHT_HIP`, `LEFT_KNEE`, `RIGHT_KNEE`, `LEFT_ANKLE`, `RIGHT_ANKLE` |

Para no escribir `if (side == BodySide.LEFT) Joint.LEFT_KNEE else Joint.RIGHT_KNEE`, usa los atajos:

```kotlin
Joint.knee(BodySide.LEFT)   // Joint.LEFT_KNEE
Joint.shoulder(side)        // según el lado
BodySide.RIGHT.opposite     // BodySide.LEFT
```

:::note
No hay punto para los dedos del pie ni de la mano. Por eso la dorsiflexión de tobillo se mide como la inclinación de la tibia; ver el [catálogo](/android/referencia/ejercicios/#tobillo).
:::

## Leer una pose

```kotlin
pose[Joint.RIGHT_ELBOW]?.let { elbow ->
    println(elbow)                     // Point en píxeles
}
pose.confidence(listOf(Joint.RIGHT_SHOULDER, Joint.RIGHT_ELBOW, Joint.RIGHT_WRIST))
// La confianza más baja entre las que se ven, o null
```

`imageSize` permite dibujar los puntos encima de la vista de cámara escalándolos al tamaño de la vista.
