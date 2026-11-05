---
title: Otros tipos
description: Pose, Joint, BodySide, MotionEvent, Visibility, SetupCheck y SetupIssue.
sidebar:
  order: 6
---

## `Pose`

```kotlin
public data class Pose(
    val points: Map<Joint, Point>,
    val timestamp: Double,
    val imageSize: Size? = null,
    val confidence: Map<Joint, Double> = emptyMap(),
) {
    operator fun get(joint: Joint): Point?
    fun confidence(of: List<Joint>): Double?
}

public data class Point(val x: Double, val y: Double)
public data class Size(val width: Double, val height: Double)
```

Ver [El contrato de Pose](/android/conceptos/pose/).

## `Joint`

```kotlin
public enum class Joint
```

`NOSE`, `LEFT_EYE`, `RIGHT_EYE`, `LEFT_EAR`, `RIGHT_EAR`, `NECK`, `LEFT_SHOULDER`, `RIGHT_SHOULDER`, `LEFT_ELBOW`, `RIGHT_ELBOW`, `LEFT_WRIST`, `RIGHT_WRIST`, `ROOT`, `LEFT_HIP`, `RIGHT_HIP`, `LEFT_KNEE`, `RIGHT_KNEE`, `LEFT_ANKLE`, `RIGHT_ANKLE`.

Atajos: `Joint.eye(side)`, `ear(side)`, `shoulder(side)`, `elbow(side)`, `wrist(side)`, `hip(side)`, `knee(side)`, `ankle(side)`.

## `BodySide`

```kotlin
@Serializable
public enum class BodySide {
    LEFT, RIGHT;
    val opposite: BodySide
}
```

Siempre el lado **anatómico** del paciente.

## `MotionEvent`

```kotlin
public sealed interface MotionEvent {
    data class RepCompleted(val rep: Rep)
    data class RepRejected(val rep: Rep)
    data object HoldStarted
    data class FormFault(val feedback: FormFeedback)
    data class VisibilityChanged(val visibility: Visibility)
    data class BaselineCompleted(val value: Double)
    data class SetupChanged(val issues: Set<SetupIssue>)
}
```

Ver [Eventos y snapshot](/android/guias/eventos-y-snapshot/).

## `Visibility`

```kotlin
public data class Visibility(
    val isVisible: Boolean,
    val missingJoints: List<Joint>,   // vacío si es visible
)
```

## `SetupIssue`

```kotlin
@Serializable
public enum class SetupIssue {
    TURN_SIDEWAYS, FACE_CAMERA, MOVE_CLOSER, STEP_BACK
}
```

## `SetupCheck`

```kotlin
public data class SetupCheck(
    val maxSideRatio: Double = 0.45,
    val minFrontRatio: Double = 0.35,
    val minSpan: Double = 0.15,
    val edgeMargin: Double = 0.03,
) {
    fun issues(pose: Pose, exercise: ExerciseDefinition, side: BodySide): Set<SetupIssue>
}
```

Ver [Calidad de la medición](/android/guias/calidad-de-medicion/).
