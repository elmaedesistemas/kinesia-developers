---
title: Medição inicial
description: Meça de onde o paciente parte com a mediana das primeiras repetições limpas.
---

A **medição inicial** (baseline) responde: quanta amplitude o paciente tem hoje? É a mediana dos picos das primeiras N repetições **limpas**. As rejeitadas não contam, assim o ponto de partida é medido com boa técnica.

## Começar

```swift
session.startBaseline(reps: 3)   // zera o contador e começa
```

Para exercícios de sustentação conta sustentações limpas em vez de repetições.

## Acompanhar o progresso

```swift
if let baseline = session.snapshot.baseline {
    Text("\(baseline.repsDone) de \(baseline.repsNeeded)")
    if let result = baseline.result {
        Text("Sua amplitude hoje: \(Int(result))°")
    }
}
```

Ou espere o evento:

```swift
for await event in session.events() {
    if case .baselineCompleted(let value) = event {
        paciente.amplitudeInicial = value
        meta = max(value + 10, exercicio.defaultTarget)  // sua lógica
    }
}
```

## Terminar antes ou cancelar

```swift
session.finishBaseline()   // termina com as limpas que houver (pelo menos uma)
session.cancelBaseline()   // sai sem resultado e zera
```

`finishBaseline()` não faz nada se ainda não houver nenhuma repetição limpa.

## Por que a mediana

Com três repetições de 98°, 102° e 131°, a média (110°) é puxada por um rebote. A mediana (102°) reflete o que o paciente faz de forma consistente.
