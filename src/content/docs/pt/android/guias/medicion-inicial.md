---
title: Medição inicial
description: Meça de onde o paciente parte com a mediana das primeiras repetições limpas.
---

A **medição inicial** (baseline) responde: quanta amplitude o paciente tem hoje? É a mediana dos picos das primeiras N repetições **limpas**. As rejeitadas não contam, assim o ponto de partida é medido com boa técnica.

## Começar

```kotlin
session.startBaseline(reps = 3)   // reinicia a contagem e começa
```

Para exercícios de sustentação conta sustentações limpas em vez de repetições.

## Acompanhar o progresso

```kotlin
val snapshot by session.snapshot.collectAsStateWithLifecycle()

snapshot.baseline?.let { baseline ->
    Text("${baseline.repsDone} de ${baseline.repsNeeded}")
    baseline.result?.let { result ->
        Text("Sua amplitude hoje: ${result.roundToInt()}°")
    }
}
```

Ou espere o evento:

```kotlin
session.events.collect { event ->
    if (event is MotionEvent.BaselineCompleted) {
        paciente.amplitudeInicial = event.value
        objetivo = maxOf(event.value + 10, exercicio.defaultTarget)  // sua lógica
    }
}
```

## Terminar antes ou cancelar

```kotlin
session.finishBaseline()   // termina com as limpas que houver (pelo menos uma)
session.cancelBaseline()   // sai sem resultado e reinicia
```

`finishBaseline()` não faz nada se ainda não houver nenhuma repetição limpa.

## Por que a mediana

Com três repetições de 98°, 102° e 131°, a média (110°) é puxada por um rebote. A mediana (102°) reflete o que o paciente faz de forma consistente.
