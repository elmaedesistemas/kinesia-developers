---
title: MotionSession
description: La puerta de entrada del SDK.
sidebar:
  order: 1
---

```swift
@MainActor @Observable
public final class MotionSession
```

Conecta una fuente de poses, publica el estado en `snapshot` y los momentos en `events()`. Corre en el `MainActor`.

## Crear

```swift
init(exercise: ExerciseDefinition, side: BodySide, smoothing: Double = 0.5)
```

| Parámetro | |
| --- | --- |
| `exercise` | Qué ejercicio medir. Ver el [catálogo](/referencia/ejercicios/). |
| `side` | El lado anatómico que se ejercita. |
| `smoothing` | Factor de la media móvil exponencial, 0…1. `1` = sin suavizado. |

## Estado

| Propiedad | Tipo | |
| --- | --- | --- |
| `snapshot` | `MotionSnapshot` | Todo el estado para dibujar. Observable. |
| `exercise` | `ExerciseDefinition` | Ejercicio actual. |
| `side` | `BodySide` | Lado actual. |
| `reps` | `[Rep]` | Repeticiones limpias, con sus métricas. |
| `peaks` | `[Double]` | Picos de las repeticiones limpias. |

## Correr

| Método | |
| --- | --- |
| `start(with: some PoseProvider)` | Empieza a leer poses en segundo plano. Llamarlo otra vez reemplaza la fuente. |
| `stop()` | Deja de leer. El flujo del proveedor termina y la cámara se apaga. |
| `run(with: some PoseProvider) async` | Lee hasta que la fuente termina o se cancela la tarea. Para pruebas o cuando tú manejas la `Task`. |
| `process(_ pose: Pose) -> [MotionEvent]` | Procesa una pose a mano. Devuelve y emite los eventos del fotograma. `@discardableResult`. |

## Configurar

| Método | |
| --- | --- |
| `configure(exercise:side:)` | Cambia de ejercicio o lado y reinicia el conteo. |
| `reset()` | Borra repeticiones y valores. La fuente sigue corriendo. |

| Propiedad | Por defecto | |
| --- | --- | --- |
| `framesToConfirmVisibility` | `6` | Fotogramas seguidos para cambiar la visibilidad (~0,25 s a 24 FPS). |
| `framesToConfirmSetup` | `12` | Fotogramas seguidos para cambiar los problemas de ubicación (~0,5 s). |
| `setupCheck` | `SetupCheck()` | Umbrales de ubicación. Ver [Calidad de la medición](/guias/calidad-de-medicion/). |

## Medición inicial

| Método | |
| --- | --- |
| `startBaseline(reps: Int = 3)` | Reinicia y empieza una medición inicial de `reps` repeticiones limpias. |
| `finishBaseline()` | Termina antes con las limpias que haya (al menos una). |
| `cancelBaseline()` | Sale sin resultado y reinicia. |

## Eventos

```swift
func events() -> AsyncStream<MotionEvent>
```

Un flujo nuevo por llamada; termina cuando el llamador deja de iterar. Guarda hasta 64 eventos si el oyente se atrasa. Ver [`MotionEvent`](/referencia/api/tipos/#motionevent).

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

`BaselineProgress` tiene `repsDone`, `repsNeeded`, `result: Double?` e `isFinished`.
