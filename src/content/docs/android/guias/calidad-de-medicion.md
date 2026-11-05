---
title: Calidad de la medición
description: Ubicación frente a la cámara, confianza del detector y métricas por repetición.
---

Un ángulo es tan bueno como la imagen de donde sale. KinesiaMotion te da tres herramientas para saber cuándo confiar en una medición.

## 1. Ubicación: `SetupIssue`

En cada fotograma, `SetupCheck` revisa la postura del paciente frente a la cámara y la sesión publica los problemas en `snapshot.setupIssues` (y en `SetupChanged` cuando cambian, tras ~0,5 s estables).

| Caso | Qué pasa | Qué decirle |
| --- | --- | --- |
| `TURN_SIDEWAYS` | Ejercicio de perfil, pero está de frente: el ángulo se acorta | «Ponte de lado» |
| `FACE_CAMERA` | Ejercicio de frente, pero está de lado | «Mírame de frente» |
| `MOVE_CLOSER` | Las articulaciones medidas se ven muy pequeñas: tiemblan más | «Acércate» |
| `STEP_BACK` | Una articulación está al borde de la imagen y saldrá al moverse | «Aléjate un poco» |

Lo que no se puede juzgar (una articulación fuera de vista, sin `imageSize`) se omite en lugar de adivinarse.

```kotlin
val s by session.snapshot.collectAsStateWithLifecycle()

if (s.isVisible) {
    s.setupIssues.firstOrNull()?.let { issue -> Banner(texto(issue)) }
}
```

:::tip
Muestra primero la visibilidad («no veo tu brazo») y solo después la ubicación. Pedir que se gire cuando ni siquiera se ve el brazo confunde.
:::

### Ajustar los umbrales

```kotlin
session.setupCheck = SetupCheck(
    maxSideRatio = 0.45,   // ancho de hombros ÷ torso por encima del cual «está de frente»
    minFrontRatio = 0.35,  // por debajo del cual «está de lado»
    minSpan = 0.15,        // tamaño mínimo de las articulaciones ÷ lado corto de la imagen
    edgeMargin = 0.03,     // margen mínimo a los bordes
)

session.framesToConfirmSetup = 12       // antirrebote (~0,5 s a 24 FPS)
session.framesToConfirmVisibility = 6   // antirrebote (~0,25 s)
```

## 2. Confianza del detector

`snapshot.confidence` es la confianza **más baja** entre las articulaciones de la medición principal en el último fotograma, 0…1. Cada `Rep` guarda la **media** durante la repetición.

```kotlin
val confidence = session.snapshot.value.lastRep?.confidence
if (confidence != null && confidence < 0.5) {
    Text("Medición poco fiable: mejora la luz o el encuadre")
}
```

Es `null` cuando la fuente de poses no da confianza.

## 3. Métricas por repetición

Más allá del pico, cada `Rep` trae datos para evaluar el control del movimiento:

```kotlin
for (rep in session.reps) {
    println("${rep.peak} ${rep.riseDuration} ${rep.returnDuration} ${rep.peakVelocity}")
}
session.reps.peakSpread   // desviación estándar de los picos: bajo = consistente
```

Una bajada mucho más rápida que la subida (`returnDuration` ≪ `riseDuration`) suele indicar que el paciente «deja caer» el segmento en vez de controlarlo.
