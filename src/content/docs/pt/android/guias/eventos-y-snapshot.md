---
title: Eventos e snapshot
description: Quando ler o estado e quando escutar eventos.
---

`MotionSession` fala com você de duas formas. Use cada uma para o que serve.

## Snapshot: para desenhar

`session.snapshot` é um `StateFlow<MotionSnapshot>`: tudo o que uma tela precisa, em um único valor. No Jetpack Compose, converta-o em estado com `collectAsStateWithLifecycle()`; para lê-lo uma vez, use `session.snapshot.value`.

```kotlin
@Composable
fun Hud(session: MotionSession) {
    val s by session.snapshot.collectAsStateWithLifecycle()

    Column {
        Text(s.value?.let { "${it.roundToInt()}°" } ?: "—")
        Text("${s.repCount} limpas · ${s.rejectedCount} rejeitadas")
        s.holdProgress?.let { progress ->
            LinearProgressIndicator(progress = { progress.toFloat() })
        }
        if (!s.isVisible) {
            Text("Mostre: ${s.missingJoints.joinToString { it.name }}")
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
| `holdProgress` | `Double?` | 0…1 durante a sustentação, `null` caso contrário |
| `confidence` | `Double?` | Menor confiança entre as articulações medidas |
| `setupIssues` | `Set<SetupIssue>` | Problemas de posicionamento; vazio = ok |
| `isVisible` / `missingJoints` | `Boolean` / `List<Joint>` | Se as articulações estão visíveis e quais faltam |
| `isRunning` | `Boolean` | Se a sessão está lendo poses |
| `baseline` | `BaselineProgress?` | Progresso da [medição inicial](/pt/android/guias/medicion-inicial/) |

## Eventos: para reagir

`session.events` é um `SharedFlow<MotionEvent>`. Você pode ter vários ouvintes (voz, háptica, analítica) sem que um atrapalhe o outro. Cada `collect` recebe os eventos desde que começa a escutar, não os anteriores: comece a escutar antes de iniciar a sessão. Guarda até 64 eventos se um ouvinte se atrasar.

```kotlin
session.events.collect { event ->
    when (event) {
        is MotionEvent.RepCompleted -> {
            haptics.success()
            voice.say("${event.rep.peak.roundToInt()} graus")
        }
        is MotionEvent.RepRejected -> voice.say(texto(event.rep.faults.firstOrNull()))
        is MotionEvent.FormFault -> voice.say(texto(event.feedback))   // correção ao vivo
        MotionEvent.HoldStarted -> voice.say("Mantenha")
        is MotionEvent.VisibilityChanged ->
            voice.say(if (event.visibility.isVisible) "Estou vendo você" else "Não vejo você por inteiro")
        is MotionEvent.SetupChanged -> event.issues.firstOrNull()?.let { voice.say(texto(it)) }
        is MotionEvent.BaselineCompleted -> salvarMedicaoInicial(event.value)
    }
}
```

| Evento | Quando |
| --- | --- |
| `RepCompleted(rep)` | Terminou uma repetição (ou sustentação) limpa |
| `RepRejected(rep)` | Terminou uma com técnica ruim; `rep.faults` diz por quê |
| `HoldStarted` | Sustentações: o valor passou o limiar e o relógio começou |
| `FormFault(feedback)` | Uma regra foi quebrada por ~0,25 s; uma vez por repetição e falha |
| `VisibilityChanged(visibility)` | As articulações entraram ou saíram do enquadramento (com antirrepique) |
| `SetupChanged(issues)` | Mudaram os problemas de posicionamento (com antirrepique) |
| `BaselineCompleted(value)` | Terminou a medição inicial |

## Textos de correção

O SDK não traz textos: `FormFeedback` e `SetupIssue` são `enum class` com um `rawValue` estável (`"keepUpperArmStill"`), pensados para o seu app traduzir.

```kotlin
fun texto(fault: FormFeedback?): String = when (fault) {
    FormFeedback.KEEP_UPPER_ARM_STILL -> "Mantenha o braço junto ao corpo"
    FormFeedback.KEEP_THIGH_STILL -> "Mantenha a coxa parada"
    FormFeedback.KEEP_ELBOW_STRAIGHT -> "Estique o cotovelo"
    FormFeedback.KEEP_TRUNK_UPRIGHT -> "Mantenha o tronco reto"
    FormFeedback.KEEP_SHOULDERS_LEVEL -> "Nivele os ombros"
    FormFeedback.KEEP_KNEE_STRAIGHT -> "Estique o joelho"
    FormFeedback.KEEP_HIPS_LEVEL -> "Nivele o quadril"
    null -> "Cuide da técnica"
}
```

## Processar manualmente

Se você já tem seu próprio laço de poses, pule `start(provider, scope)` e chame `process(pose)`. Ele devolve os eventos daquele quadro (e também os emite aos ouvintes):

```kotlin
val events = session.process(pose)
```

`run(provider)` é a versão `suspend` de `start(provider, scope)`: lê até a fonte terminar ou a corrotina ser cancelada, útil quando você gerencia a corrotina ou em testes.
