---
title: Eventos e snapshot
description: Quando ler o estado e quando escutar eventos.
---

`MotionSession` fala com você de duas formas. Use cada uma para o que serve.

## Snapshot: para desenhar

`session.snapshot` é um `MotionSnapshot`: tudo o que uma tela precisa, em um único valor. Como `MotionSession` é `@Observable` e roda no `MainActor`, o SwiftUI se atualiza sozinho.

```swift
struct Hud: View {
    let session: MotionSession

    var body: some View {
        let s = session.snapshot
        VStack {
            Text(s.value.map { "\(Int($0))°" } ?? "—")
            Text("\(s.repCount) limpas · \(s.rejectedCount) rejeitadas")
            if let progress = s.holdProgress {
                ProgressView(value: progress)
            }
            if !s.isVisible {
                Text("Mostre: \(s.missingJoints.map(\.rawValue).joined(separator: ", "))")
            }
        }
    }
}
```

| Campo | Tipo | O que é |
| --- | --- | --- |
| `value` | `Double?` | Valor atual suavizado da medição principal |
| `best` | `Double` | O maior valor visto desde o último reinício |
| `repCount` / `rejectedCount` | `Int` | Repetições limpas / rejeitadas |
| `lastRep` | `Rep?` | A última repetição julgada (limpa ou não) |
| `holdProgress` | `Double?` | 0…1 durante a sustentação, `nil` caso contrário |
| `confidence` | `Double?` | Menor confiança entre as articulações medidas |
| `setupIssues` | `Set<SetupIssue>` | Problemas de posicionamento; vazio = ok |
| `isVisible` / `missingJoints` | `Bool` / `[Joint]` | Se as articulações estão visíveis e quais faltam |
| `isRunning` | `Bool` | Se a sessão está lendo poses |
| `baseline` | `BaselineProgress?` | Progresso da [medição inicial](/pt/guias/medicion-inicial/) |

## Eventos: para reagir

`session.events()` devolve um `AsyncStream<MotionEvent>` novo para cada chamador. Você pode ter vários ouvintes (voz, háptica, analytics) sem que se atrapalhem. O fluxo termina quando o ouvinte para de iterar.

```swift
for await event in session.events() {
    switch event {
    case .repCompleted(let rep):
        haptics.success()
        voice.say("\(Int(rep.peak)) graus")
    case .repRejected(let rep):
        voice.say(texto(para: rep.faults.first))
    case .formFault(let fault):
        voice.say(texto(para: fault))      // correção ao vivo
    case .holdStarted:
        voice.say("Segure")
    case .visibilityChanged(let v):
        voice.say(v.isVisible ? "Estou te vendo" : "Não te vejo inteiro")
    case .setupChanged(let issues):
        if let issue = issues.first { voice.say(texto(para: issue)) }
    case .baselineCompleted(let value):
        salvarMedicaoInicial(value)
    }
}
```

| Evento | Quando |
| --- | --- |
| `.repCompleted(Rep)` | Terminou uma repetição (ou sustentação) limpa |
| `.repRejected(Rep)` | Terminou uma com técnica ruim; `rep.faults` diz por quê |
| `.holdStarted` | Sustentações: o valor passou o limiar e o relógio começou |
| `.formFault(FormFeedback)` | Uma regra foi quebrada por ~0,25 s; uma vez por repetição e falha |
| `.visibilityChanged(Visibility)` | As articulações entraram ou saíram do enquadramento (com antirrepique) |
| `.setupChanged(Set<SetupIssue>)` | Mudaram os problemas de posicionamento (com antirrepique) |
| `.baselineCompleted(Double)` | Terminou a medição inicial |

## Textos de correção

O SDK não traz textos: `FormFeedback` e `SetupIssue` são `enum` com `rawValue` estável, pensados para que seu app os traduza.

```swift
func texto(para fault: FormFeedback?) -> String {
    switch fault {
    case .keepUpperArmStill:  "Mantenha o braço junto ao corpo"
    case .keepThighStill:     "Mantenha a coxa parada"
    case .keepElbowStraight:  "Estique o cotovelo"
    case .keepTrunkUpright:   "Mantenha o tronco reto"
    case .keepShouldersLevel: "Nivele os ombros"
    case .keepKneeStraight:   "Estique o joelho"
    case .keepHipsLevel:      "Nivele o quadril"
    case nil:                 "Cuide da técnica"
    }
}
```

## Processar manualmente

Se você já tem seu próprio laço de poses, pule `start(with:)` e chame `process(_:)`. Ele devolve os eventos daquele quadro (e também os emite aos ouvintes):

```swift
let events = session.process(pose)
```

`run(with:)` é a versão `async` de `start(with:)`: lê até a fonte terminar ou a tarefa ser cancelada. Útil quando você gerencia a `Task` ou em testes.
