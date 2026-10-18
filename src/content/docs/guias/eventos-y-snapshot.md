---
title: Eventos y snapshot
description: Cuándo leer el estado y cuándo escuchar eventos.
---

`MotionSession` te habla de dos formas. Usa cada una para lo suyo.

## Snapshot: para dibujar

`session.snapshot` es un `MotionSnapshot`: todo lo que una pantalla necesita, en un solo valor. Como `MotionSession` es `@Observable` y corre en el `MainActor`, SwiftUI se actualiza solo.

```swift
struct Hud: View {
    let session: MotionSession

    var body: some View {
        let s = session.snapshot
        VStack {
            Text(s.value.map { "\(Int($0))°" } ?? "—")
            Text("\(s.repCount) limpias · \(s.rejectedCount) rechazadas")
            if let progress = s.holdProgress {
                ProgressView(value: progress)
            }
            if !s.isVisible {
                Text("Muestra: \(s.missingJoints.map(\.rawValue).joined(separator: ", "))")
            }
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
| `holdProgress` | `Double?` | 0…1 mientras se sostiene, `nil` si no |
| `confidence` | `Double?` | Confianza más baja entre las articulaciones medidas |
| `setupIssues` | `Set<SetupIssue>` | Problemas de ubicación; vacío = bien |
| `isVisible` / `missingJoints` | `Bool` / `[Joint]` | Si se ven las articulaciones y cuáles faltan |
| `isRunning` | `Bool` | Si la sesión está leyendo poses |
| `baseline` | `BaselineProgress?` | Progreso de la [medición inicial](/guias/medicion-inicial/) |

## Eventos: para reaccionar

`session.events()` devuelve un `AsyncStream<MotionEvent>` nuevo para cada llamador. Puedes tener varios oyentes (voz, háptica, analítica) sin que se pisen. El flujo termina cuando el oyente deja de iterar.

```swift
for await event in session.events() {
    switch event {
    case .repCompleted(let rep):
        haptics.success()
        voice.say("\(Int(rep.peak)) grados")
    case .repRejected(let rep):
        voice.say(texto(para: rep.faults.first))
    case .formFault(let fault):
        voice.say(texto(para: fault))      // corrección en vivo
    case .holdStarted:
        voice.say("Mantén")
    case .visibilityChanged(let v):
        voice.say(v.isVisible ? "Te veo" : "No te veo completo")
    case .setupChanged(let issues):
        if let issue = issues.first { voice.say(texto(para: issue)) }
    case .baselineCompleted(let value):
        guardarMedicionInicial(value)
    }
}
```

| Evento | Cuándo |
| --- | --- |
| `.repCompleted(Rep)` | Terminó una repetición (o sostenido) limpia |
| `.repRejected(Rep)` | Terminó una con mala técnica; `rep.faults` dice por qué |
| `.holdStarted` | Sostenidos: el valor pasó el umbral y arrancó el reloj |
| `.formFault(FormFeedback)` | Una regla se rompió durante ~0,25 s; una vez por repetición y falla |
| `.visibilityChanged(Visibility)` | Las articulaciones entraron o salieron del encuadre (con antirrebote) |
| `.setupChanged(Set<SetupIssue>)` | Cambiaron los problemas de ubicación (con antirrebote) |
| `.baselineCompleted(Double)` | Terminó la medición inicial |

## Textos de corrección

El SDK no trae textos: `FormFeedback` y `SetupIssue` son `enum` con `rawValue` estable, pensados para que tu app los traduzca.

```swift
func texto(para fault: FormFeedback?) -> String {
    switch fault {
    case .keepUpperArmStill:  "Mantén el brazo pegado al cuerpo"
    case .keepThighStill:     "Mantén el muslo quieto"
    case .keepElbowStraight:  "Estira el codo"
    case .keepTrunkUpright:   "Mantén el tronco recto"
    case .keepShouldersLevel: "Nivela los hombros"
    case .keepKneeStraight:   "Estira la rodilla"
    case .keepHipsLevel:      "Nivela la cadera"
    case nil:                 "Cuida la técnica"
    }
}
```

## Procesar a mano

Si ya tienes tu propio bucle de poses, salta `start(with:)` y llama `process(_:)`. Devuelve los eventos de ese fotograma (y también los emite a los oyentes):

```swift
let events = session.process(pose)
```

`run(with:)` es la versión `async` de `start(with:)`: lee hasta que la fuente termina o se cancela la tarea, útil cuando tú manejas la `Task` o en pruebas.
