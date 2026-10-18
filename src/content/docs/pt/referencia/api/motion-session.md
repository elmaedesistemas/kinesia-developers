---
title: MotionSession
description: A porta de entrada do SDK.
sidebar:
  order: 1
---

```swift
@MainActor @Observable
public final class MotionSession
```

Conecta uma fonte de poses, publica o estado em `snapshot` e os momentos em `events()`. Roda no `MainActor`.

## Criar

```swift
init(exercise: ExerciseDefinition, side: BodySide, smoothing: Double = 0.5)
```

| Parâmetro | |
| --- | --- |
| `exercise` | Qual exercício medir. Veja o [catálogo](/pt/referencia/ejercicios/). |
| `side` | O lado anatômico exercitado. |
| `smoothing` | Fator da média móvel exponencial, 0…1. `1` = sem suavização. |

## Estado

| Propriedade | Tipo | |
| --- | --- | --- |
| `snapshot` | `MotionSnapshot` | Todo o estado para desenhar. Observável. |
| `exercise` | `ExerciseDefinition` | Exercício atual. |
| `side` | `BodySide` | Lado atual. |
| `reps` | `[Rep]` | Repetições limpas, com suas métricas. |
| `peaks` | `[Double]` | Picos das repetições limpas. |

## Executar

| Método | |
| --- | --- |
| `start(with: some PoseProvider)` | Começa a ler poses em segundo plano. Chamá-lo de novo substitui a fonte. |
| `stop()` | Para de ler. O fluxo do provider termina e a câmera desliga. |
| `run(with: some PoseProvider) async` | Lê até a fonte terminar ou a tarefa ser cancelada. Para testes ou quando você gerencia a `Task`. |
| `process(_ pose: Pose) -> [MotionEvent]` | Processa uma pose manualmente. Devolve e emite os eventos do quadro. `@discardableResult`. |

## Configurar

| Método | |
| --- | --- |
| `configure(exercise:side:)` | Troca de exercício ou lado e zera a contagem. |
| `reset()` | Apaga repetições e valores. A fonte continua rodando. |

| Propriedade | Padrão | |
| --- | --- | --- |
| `framesToConfirmVisibility` | `6` | Quadros seguidos para mudar a visibilidade (~0,25 s a 24 FPS). |
| `framesToConfirmSetup` | `12` | Quadros seguidos para mudar os problemas de posicionamento (~0,5 s). |
| `setupCheck` | `SetupCheck()` | Limiares de posicionamento. Veja [Qualidade da medição](/pt/guias/calidad-de-medicion/). |

## Medição inicial

| Método | |
| --- | --- |
| `startBaseline(reps: Int = 3)` | Zera e começa uma medição inicial de `reps` repetições limpas. |
| `finishBaseline()` | Termina antes com as limpas que houver (pelo menos uma). |
| `cancelBaseline()` | Sai sem resultado e zera. |

## Eventos

```swift
func events() -> AsyncStream<MotionEvent>
```

Um fluxo novo por chamada; termina quando o chamador para de iterar. Guarda até 64 eventos se o ouvinte atrasar. Veja [`MotionEvent`](/pt/referencia/api/tipos/#motionevent).

## `MotionSnapshot`

| Campo | Tipo |
| --- | --- |
| `value` | `Double?` |
| `best` | `Double` |
| `repCount` | `Int` |
| `rejectedCount` | `Int` |
| `lastRep` | `Rep?` |
| `holdProgress` | `Double?` |
| `confidence` | `Double?` |
| `setupIssues` | `Set<SetupIssue>` |
| `isVisible` | `Bool` |
| `missingJoints` | `[Joint]` |
| `isRunning` | `Bool` |
| `baseline` | `BaselineProgress?` |

`BaselineProgress` tem `repsDone`, `repsNeeded`, `result: Double?` e `isFinished`.
