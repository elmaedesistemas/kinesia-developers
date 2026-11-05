---
title: RepEngine e Rep
description: O motor de contagem, sem sessão nem concorrência.
sidebar:
  order: 5
---

## `RepEngine`

```kotlin
public class RepEngine
```

Converte poses em repetições (ou sustentações) verificando a técnica. Uma classe síncrona, sem câmera, sem UI e sem corrotinas. `MotionSession` a usa por dentro; use-a diretamente quando não precisar de visibilidade, posicionamento nem de um fluxo de eventos. Não é segura entre threads: alimente-a a partir de uma só.

```kotlin
RepEngine(definition: ExerciseDefinition, side: BodySide)
fun process(pose: Pose): List<MotionEvent>
fun reset()
```

### Ajustes

| Propriedade | Padrão | |
| --- | --- | --- |
| `smoothing` | `0.5` | Fator de suavização. `1` = nenhuma. |
| `faultTolerance` | `0.2` | Fração de quadros que pode quebrar uma regra antes de rejeitar. |
| `framesToCue` | `6` | Quadros ruins seguidos antes de `FormFault` (~0,25 s). |
| `holdTolerance` | `5.0` | Graus que uma sustentação pode variar antes de reiniciar o relógio. |

### Estado (somente leitura)

`value`, `best`, `reps`, `rejected`, `holdProgress`, `confidence`, `count`, `peaks`.

`process` só emite `RepCompleted`, `RepRejected`, `HoldStarted` e `FormFault`. Os eventos de visibilidade, posicionamento e medição inicial são adicionados por `MotionSession`.

## `Rep`

```kotlin
public data class Rep
```

| Propriedade | Tipo | |
| --- | --- | --- |
| `peak` | `Double` | Máximo; nas sustentações, a mediana da janela. |
| `duration` | `Double` | De repouso a repouso; nas sustentações, o tempo sustentado. |
| `riseDuration` | `Double` | Do início ao pico. |
| `returnDuration` | `Double` | Do pico ao repouso. 0 nas sustentações. |
| `peakVelocity` | `Double` | Graus por segundo. |
| `confidence` | `Double?` | Confiança média, 0…1. |
| `faults` | `Set<FormFeedback>` | Regras quebradas. |
| `isClean` | `Boolean` | `faults.isEmpty()`. |

```kotlin
val List<Rep>.peakSpread: Double?   // desvio padrão dos picos; null com menos de 2
```
