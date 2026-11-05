---
title: MotionSession
description: La puerta de entrada del SDK.
sidebar:
  order: 1
---

```kotlin
public class MotionSession
```

Conecta una fuente de poses, publica el estado en `snapshot` y los momentos en `events`. Se puede llamar desde cualquier hilo.

## Crear

```kotlin
MotionSession(exercise: ExerciseDefinition, side: BodySide, smoothing: Double = 0.5)
```

| Parámetro | |
| --- | --- |
| `exercise` | Qué ejercicio medir. Ver el [catálogo](/android/referencia/ejercicios/). |
| `side` | El lado anatómico que se ejercita. |
| `smoothing` | Factor de la media móvil exponencial, 0…1. `1` = sin suavizado. |

## Estado

| Propiedad | Tipo | |
| --- | --- | --- |
| `snapshot` | `StateFlow<MotionSnapshot>` | Todo el estado para dibujar. |
| `exercise` | `ExerciseDefinition` | Ejercicio actual. |
| `side` | `BodySide` | Lado actual. |
| `reps` | `List<Rep>` | Repeticiones limpias, con sus métricas. |
| `peaks` | `List<Double>` | Picos de las repeticiones limpias. |

## Correr

| Método | |
| --- | --- |
| `start(provider: PoseProvider, scope: CoroutineScope)` | Empieza a leer poses en `scope`. Llamarlo otra vez reemplaza la fuente. |
| `stop()` | Deja de leer. El flujo del proveedor se cancela y la cámara se apaga. |
| `suspend run(provider: PoseProvider)` | Lee hasta que la fuente termina o se cancela la corrutina. Para pruebas o cuando tú manejas la corrutina. |
| `process(pose: Pose): List<MotionEvent>` | Procesa una pose a mano. Devuelve y emite los eventos del fotograma. |

## Configurar

| Método | |
| --- | --- |
| `configure(exercise, side)` | Cambia de ejercicio o lado y reinicia el conteo. |
| `reset()` | Borra repeticiones y valores. La fuente sigue corriendo. |

| Propiedad | Por defecto | |
| --- | --- | --- |
| `framesToConfirmVisibility` | `6` | Fotogramas seguidos para cambiar la visibilidad (~0,25 s a 24 FPS). |
| `framesToConfirmSetup` | `12` | Fotogramas seguidos para cambiar los problemas de ubicación (~0,5 s). |
| `setupCheck` | `SetupCheck()` | Umbrales de ubicación. Ver [Calidad de la medición](/android/guias/calidad-de-medicion/). |

## Medición inicial

| Método | |
| --- | --- |
| `startBaseline(reps: Int = 3)` | Reinicia y empieza una medición inicial de `reps` repeticiones limpias. |
| `finishBaseline()` | Termina antes con las limpias que haya (al menos una). |
| `cancelBaseline()` | Sale sin resultado y reinicia. |

## Eventos

```kotlin
val events: SharedFlow<MotionEvent>
```

Un solo flujo para todos los oyentes; cada `collect` recibe los eventos desde que empieza a escuchar. Guarda hasta 64 eventos si un oyente se atrasa. Ver [`MotionEvent`](/android/referencia/api/tipos/#motionevent).

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

`BaselineProgress` tiene `repsDone`, `repsNeeded`, `result: Double?` e `isFinished`.
