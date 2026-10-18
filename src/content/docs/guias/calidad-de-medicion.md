---
title: Calidad de la medición
description: Ubicación frente a la cámara, confianza del detector y métricas por repetición.
---

Un ángulo es tan bueno como la imagen de donde sale. KinesiaMotion te da tres herramientas para saber cuándo confiar en una medición.

## 1. Ubicación: `SetupIssue`

En cada fotograma, `SetupCheck` revisa la postura del paciente frente a la cámara y la sesión publica los problemas en `snapshot.setupIssues` (y en `.setupChanged` cuando cambian, tras ~0,5 s estables).

| Caso | Qué pasa | Qué decirle |
| --- | --- | --- |
| `turnSideways` | Ejercicio de perfil, pero está de frente: el ángulo se acorta | «Ponte de lado» |
| `faceCamera` | Ejercicio de frente, pero está de lado | «Mírame de frente» |
| `moveCloser` | Las articulaciones medidas se ven muy pequeñas: tiemblan más | «Acércate» |
| `stepBack` | Una articulación está al borde de la imagen y saldrá al moverse | «Aléjate un poco» |

Lo que no se puede juzgar (una articulación fuera de vista, sin `imageSize`) se omite en lugar de adivinarse.

```swift
if session.snapshot.isVisible, let issue = session.snapshot.setupIssues.first {
    Banner(texto(para: issue))
}
```

:::tip
Muestra primero la visibilidad («no veo tu brazo») y solo después la ubicación. Pedir que se gire cuando ni siquiera se ve el brazo confunde.
:::

### Ajustar los umbrales

```swift
var check = SetupCheck()
check.maxSideRatio = 0.45   // ancho de hombros ÷ torso por encima del cual «está de frente»
check.minFrontRatio = 0.35  // por debajo del cual «está de lado»
check.minSpan = 0.15        // tamaño mínimo de las articulaciones ÷ lado corto de la imagen
check.edgeMargin = 0.03     // margen mínimo a los bordes
session.setupCheck = check

session.framesToConfirmSetup = 12       // antirrebote (~0,5 s a 24 FPS)
session.framesToConfirmVisibility = 6   // antirrebote (~0,25 s)
```

## 2. Confianza del detector

`snapshot.confidence` es la confianza **más baja** entre las articulaciones de la medición principal en el último fotograma, 0…1. Cada `Rep` guarda la **media** durante la repetición.

```swift
if let c = session.snapshot.lastRep?.confidence, c < 0.5 {
    Text("Medición poco fiable: mejora la luz o el encuadre")
}
```

Es `nil` cuando la fuente de poses no da confianza.

## 3. Métricas por repetición

Más allá del pico, cada `Rep` trae datos para evaluar el control del movimiento:

```swift
for rep in session.reps {
    print(rep.peak, rep.riseDuration, rep.returnDuration, rep.peakVelocity)
}
session.reps.peakSpread   // desviación estándar de los picos: bajo = consistente
```

Una bajada mucho más rápida que la subida (`returnDuration` ≪ `riseDuration`) suele indicar que el paciente «deja caer» el segmento en vez de controlarlo.
