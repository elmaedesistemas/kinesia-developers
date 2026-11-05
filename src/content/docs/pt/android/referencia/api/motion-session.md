---
title: MotionSession
description: A porta de entrada do SDK.
sidebar:
  order: 1
---

```kotlin
public class MotionSession
```

Conecta uma fonte de poses, publica o estado em `snapshot` e os momentos em `events`. Pode ser chamada de qualquer thread.

## Criar

```kotlin
MotionSession(exercise: ExerciseDefinition, side: BodySide, smoothing: Double = 0.5)
```

| Parâmetro | |
| --- | --- |
| `exercise` | Qual exercício medir. Veja o [catálogo](/pt/android/referencia/ejercicios/). |
| `side` | O lado anatômico exercitado. |
| `smoothing` | Fator da média móvel exponencial, 0…1. `1` = sem suavização. |

## Estado

| Propriedade | Tipo | |
| --- | --- | --- |
| `snapshot` | `StateFlow<MotionSnapshot>` | Todo o estado para desenhar. |
| `exercise` | `ExerciseDefinition` | Exercício atual. |
| `side` | `BodySide` | Lado atual. |
| `reps` | `List<Rep>` | Repetições limpas, com suas métricas. |
| `peaks` | `List<Double>` | Picos das repetições limpas. |

## Executar

| Método | |
| --- | --- |
| `start(provider: PoseProvider, scope: CoroutineScope)` | Começa a ler poses em `scope`. Chamá-lo de novo substitui a fonte. |
| `stop()` | Para de ler. O fluxo do provedor é cancelado e a câmera desliga. |
| `suspend run(provider: PoseProvider)` | Lê até a fonte terminar ou a corrotina ser cancelada. Para testes ou quando você gerencia a corrotina. |
| `process(pose: Pose): List<MotionEvent>` | Processa uma pose à mão. Devolve e emite os eventos do quadro. |

## Configurar

| Método | |
| --- | --- |
| `configure(exercise, side)` | Troca de exercício ou lado e zera a contagem. |
| `reset()` | Apaga repetições e valores. A fonte continua rodando. |

| Propriedade | Padrão | |
| --- | --- | --- |
| `framesToConfirmVisibility` | `6` | Quadros seguidos para mudar a visibilidade (~0,25 s a 24 FPS). |
| `framesToConfirmSetup` | `12` | Quadros seguidos para mudar os problemas de posicionamento (~0,5 s). |
| `setupCheck` | `SetupCheck()` | Limiares de posicionamento. Veja [Qualidade da medição](/pt/android/guias/calidad-de-medicion/). |

## Medição inicial

| Método | |
| --- | --- |
| `startBaseline(reps: Int = 3)` | Zera e começa uma medição inicial de `reps` repetições limpas. |
| `finishBaseline()` | Termina antes com as limpas que houver (pelo menos uma). |
| `cancelBaseline()` | Sai sem resultado e zera. |

## Eventos

```kotlin
val events: SharedFlow<MotionEvent>
```

Um único fluxo para todos os ouvintes; cada `collect` recebe os eventos desde que começa a escutar. Guarda até 64 eventos se um ouvinte se atrasar. Veja [`MotionEvent`](/pt/android/referencia/api/tipos/#motionevent).

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
| `isVisible` | `Boolean` |
| `missingJoints` | `List<Joint>` |
| `isRunning` | `Boolean` |
| `baseline` | `BaselineProgress?` |

`BaselineProgress` tem `repsDone`, `repsNeeded`, `result: Double?` e `isFinished`.
