---
title: RepEngine e Rep
description: O motor de contagem, sem sessão nem concorrência.
sidebar:
  order: 5
---

## `RepEngine`

```swift
public struct RepEngine: Sendable
```

Converte poses em repetições (ou sustentações) verificando a técnica. Um tipo de valor puro e síncrono: sem câmera, sem UI. `MotionSession` o usa por dentro; use-o diretamente quando não precisar de visibilidade, posicionamento nem eventos assíncronos.

```swift
init(definition: ExerciseDefinition, side: BodySide)
mutating func process(_ pose: Pose) -> [MotionEvent]
mutating func reset()
```

### Ajustes

| Propriedade | Padrão | |
| --- | --- | --- |
| `smoothing` | `0.5` | Fator de suavização. `1` = nenhuma. |
| `faultTolerance` | `0.2` | Fração de quadros que pode quebrar uma regra antes de rejeitar. |
| `framesToCue` | `6` | Quadros ruins seguidos antes de `.formFault` (~0,25 s). |
| `holdTolerance` | `5.0` | Graus que uma sustentação pode variar antes de reiniciar o relógio. |

### Estado (somente leitura)

`value`, `best`, `reps`, `rejected`, `holdProgress`, `confidence`, `count`, `peaks`.

`process` só emite `.repCompleted`, `.repRejected`, `.holdStarted` e `.formFault`. Os eventos de visibilidade, posicionamento e medição inicial são adicionados pela `MotionSession`.

## `Rep`

```swift
public struct Rep: Sendable, Equatable
```

| Propriedade | Tipo | |
| --- | --- | --- |
| `peak` | `Double` | Máximo; nas sustentações, a mediana da janela. |
| `duration` | `TimeInterval` | De repouso a repouso; nas sustentações, o tempo sustentado. |
| `riseDuration` | `TimeInterval` | Do início ao pico. |
| `returnDuration` | `TimeInterval` | Do pico ao repouso. 0 nas sustentações. |
| `peakVelocity` | `Double` | Graus por segundo. |
| `confidence` | `Double?` | Confiança média, 0…1. |
| `faults` | `Set<FormFeedback>` | Regras quebradas. |
| `isClean` | `Bool` | `faults.isEmpty`. |

```swift
extension Array where Element == Rep {
    var peakSpread: Double?   // desvio padrão dos picos; nil com menos de 2
}
```
