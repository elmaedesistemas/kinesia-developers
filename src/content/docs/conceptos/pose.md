---
title: El contrato de Pose
description: Las reglas que debe cumplir cualquier fuente de poses.
---

Una `Pose` es un fotograma de puntos del cuerpo. Todo el motor confía en que las poses cumplen este contrato; si escribes tu propio `PoseProvider`, eres tú quien debe respetarlo.

```swift
public struct Pose: Sendable {
    public var points: [Joint: CGPoint]
    public var timestamp: TimeInterval
    public var imageSize: CGSize?
    public var confidence: [Joint: Double]
}
```

## Las cuatro reglas

1. **Píxeles de imagen, con `y` hacia abajo.** El origen está arriba a la izquierda, como en UIKit. No uses coordenadas normalizadas (0…1) ni el origen abajo de Vision.
2. **Lados anatómicos.** `.leftElbow` es el codo izquierdo *real* del paciente. Con la cámara frontal la imagen está espejada, así que el adaptador debe intercambiar izquierda y derecha antes de construir la pose.
3. **Solo puntos confiables.** Las articulaciones con baja confianza se omiten del diccionario. Una articulación ausente significa «no la veo», y el motor la trata así: no mide, no castiga y avisa que falta.
4. **`confidence` es opcional.** Si tu detector no da confianza, deja el diccionario vacío; las métricas de confianza saldrán `nil`.

:::tip[Poses vacías]
Envía la pose aunque no tenga ningún punto. Una pose vacía le dice a la sesión que el paciente salió del encuadre, y así puede emitir `.visibilityChanged`.
:::

## Las 19 articulaciones

`Joint` sigue los 19 puntos del detector 2D de cuerpo de Vision:

| Zona | Articulaciones |
| --- | --- |
| Cabeza | `nose`, `leftEye`, `rightEye`, `leftEar`, `rightEar` |
| Línea media | `neck`, `root` (centro de la cadera) |
| Brazos | `leftShoulder`, `rightShoulder`, `leftElbow`, `rightElbow`, `leftWrist`, `rightWrist` |
| Piernas | `leftHip`, `rightHip`, `leftKnee`, `rightKnee`, `leftAnkle`, `rightAnkle` |

En Android se escriben `Joint.LEFT_SHOULDER`, `Joint.NECK`, etc. MediaPipe detecta 33 puntos (BlazePose): el SDK los convierte a estos mismos 19, y calcula `neck` y `root` como el punto medio de los hombros y de las caderas. Ver [Cámara con MediaPipe](/android/camara-mediapipe/).

Para no escribir `side == .left ? .leftKnee : .rightKnee`, usa los atajos:

```swift
Joint.knee(.left)       // .leftKnee
Joint.shoulder(side)    // según el lado
BodySide.right.opposite // .left
```

:::note
No hay punto para los dedos del pie ni de la mano. Por eso la dorsiflexión de tobillo se mide como la inclinación de la tibia; ver el [catálogo](/referencia/ejercicios/#tobillo).
:::

## Leer una pose

```swift
if let elbow = pose[.rightElbow] {
    print(elbow)                                // CGPoint en píxeles
}
pose.confidence(of: [.rightShoulder, .rightElbow, .rightWrist])
// La confianza más baja entre las que se ven, o nil
```

`imageSize` permite dibujar los puntos encima de la vista de cámara escalándolos al tamaño de la vista.
