---
title: Eventos y snapshot
description: Cuándo leer el estado y cuándo escuchar eventos.
---

`MotionSession` te habla de dos formas. Usa cada una para lo suyo.

## Snapshot: para dibujar

`session.snapshot` es un `StateFlow<MotionSnapshot>`: todo lo que una pantalla necesita, en un solo valor. En Jetpack Compose, conviértelo en estado con `collectAsStateWithLifecycle()`; para leerlo una vez, usa `session.snapshot.value`.

```kotlin
@Composable
fun Hud(session: MotionSession) {
    val s by session.snapshot.collectAsStateWithLifecycle()

    Column {
        Text(s.value?.let { "${it.roundToInt()}°" } ?: "—")
        Text("${s.repCount} limpias · ${s.rejectedCount} rechazadas")
        s.holdProgress?.let { progress ->
            LinearProgressIndicator(progress = { progress.toFloat() })
        }
        if (!s.isVisible) {
            Text("Muestra: ${s.missingJoints.joinToString { it.name }}")
        }
    }
}
```

| Campo | Tipo | Qué es |
| --- | --- | --- |
| `value` | `Double?` | Valor actual suavizado de la medición principal |
| `best` | `Double` | El valor más alto visto desde el último reinicio |
| `repCount` / `rejectedCount` | `Int` | Repeticiones limpias / rechazadas |
| `lastRep` | `Rep?` | La última repetición juzgada (limpia o no) |
| `holdProgress` | `Double?` | 0…1 mientras se sostiene, `null` si no |
| `confidence` | `Double?` | Confianza más baja entre las articulaciones medidas |
| `setupIssues` | `Set<SetupIssue>` | Problemas de ubicación; vacío = bien |
| `isVisible` / `missingJoints` | `Boolean` / `List<Joint>` | Si se ven las articulaciones y cuáles faltan |
| `isRunning` | `Boolean` | Si la sesión está leyendo poses |
| `baseline` | `BaselineProgress?` | Progreso de la [medición inicial](/android/guias/medicion-inicial/) |

## Eventos: para reaccionar

`session.events` es un `SharedFlow<MotionEvent>`. Puedes tener varios oyentes (voz, háptica, analítica) sin que se pisen. Cada `collect` recibe los eventos desde que empieza a escuchar, no los anteriores: empieza a escuchar antes de arrancar la sesión. Guarda hasta 64 eventos si un oyente se atrasa.

```kotlin
session.events.collect { event ->
    when (event) {
        is MotionEvent.RepCompleted -> {
            haptics.success()
            voice.say("${event.rep.peak.roundToInt()} grados")
        }
        is MotionEvent.RepRejected -> voice.say(texto(event.rep.faults.firstOrNull()))
        is MotionEvent.FormFault -> voice.say(texto(event.feedback))   // corrección en vivo
        MotionEvent.HoldStarted -> voice.say("Mantén")
        is MotionEvent.VisibilityChanged ->
            voice.say(if (event.visibility.isVisible) "Te veo" else "No te veo completo")
        is MotionEvent.SetupChanged -> event.issues.firstOrNull()?.let { voice.say(texto(it)) }
        is MotionEvent.BaselineCompleted -> guardarMedicionInicial(event.value)
    }
}
```

| Evento | Cuándo |
| --- | --- |
| `RepCompleted(rep)` | Terminó una repetición (o sostenido) limpia |
| `RepRejected(rep)` | Terminó una con mala técnica; `rep.faults` dice por qué |
| `HoldStarted` | Sostenidos: el valor pasó el umbral y arrancó el reloj |
| `FormFault(feedback)` | Una regla se rompió durante ~0,25 s; una vez por repetición y falla |
| `VisibilityChanged(visibility)` | Las articulaciones entraron o salieron del encuadre (con antirrebote) |
| `SetupChanged(issues)` | Cambiaron los problemas de ubicación (con antirrebote) |
| `BaselineCompleted(value)` | Terminó la medición inicial |

## Textos de corrección

El SDK no trae textos: `FormFeedback` y `SetupIssue` son `enum class` con un `rawValue` estable (`"keepUpperArmStill"`), pensados para que tu app los traduzca.

```kotlin
fun texto(fault: FormFeedback?): String = when (fault) {
    FormFeedback.KEEP_UPPER_ARM_STILL -> "Mantén el brazo pegado al cuerpo"
    FormFeedback.KEEP_THIGH_STILL -> "Mantén el muslo quieto"
    FormFeedback.KEEP_ELBOW_STRAIGHT -> "Estira el codo"
    FormFeedback.KEEP_TRUNK_UPRIGHT -> "Mantén el tronco recto"
    FormFeedback.KEEP_SHOULDERS_LEVEL -> "Nivela los hombros"
    FormFeedback.KEEP_KNEE_STRAIGHT -> "Estira la rodilla"
    FormFeedback.KEEP_HIPS_LEVEL -> "Nivela la cadera"
    null -> "Cuida la técnica"
}
```

## Procesar a mano

Si ya tienes tu propio bucle de poses, salta `start(provider, scope)` y llama `process(pose)`. Devuelve los eventos de ese fotograma (y también los emite a los oyentes):

```kotlin
val events = session.process(pose)
```

`run(provider)` es la versión `suspend` de `start(provider, scope)`: lee hasta que la fuente termina o se cancela la corrutina, útil cuando tú manejas la corrutina o en pruebas.
