---
title: Otros tipos
description: Pose, Joint, BodySide, MotionEvent, Visibility, SetupCheck y SetupIssue.
sidebar:
  order: 6
---

## `Pose`

```swift
public struct Pose: Sendable {
    var points: [Joint: CGPoint]
    var timestamp: TimeInterval
    var imageSize: CGSize?
    var confidence: [Joint: Double]

    init(points:timestamp:imageSize: = nil, confidence: = [:])
    subscript(joint: Joint) -> CGPoint?
    func confidence(of joints: [Joint]) -> Double?
}
```

Ver [El contrato de Pose](/conceptos/pose/).

## `Joint`

```swift
public enum Joint: String, CaseIterable, Sendable
```

`nose`, `leftEye`, `rightEye`, `leftEar`, `rightEar`, `neck`, `leftShoulder`, `rightShoulder`, `leftElbow`, `rightElbow`, `leftWrist`, `rightWrist`, `root`, `leftHip`, `rightHip`, `leftKnee`, `rightKnee`, `leftAnkle`, `rightAnkle`.

Atajos: `Joint.ear(_:)`, `.shoulder(_:)`, `.elbow(_:)`, `.wrist(_:)`, `.hip(_:)`, `.knee(_:)`, `.ankle(_:)`.

## `BodySide`

```swift
public enum BodySide: String, CaseIterable, Sendable, Codable {
    case left, right
    var opposite: BodySide
}
```

Siempre el lado **anatómico** del paciente.

## `MotionEvent`

```swift
public enum MotionEvent: Sendable, Equatable {
    case repCompleted(Rep)
    case repRejected(Rep)
    case holdStarted
    case formFault(FormFeedback)
    case visibilityChanged(Visibility)
    case baselineCompleted(Double)
    case setupChanged(Set<SetupIssue>)
}
```

Ver [Eventos y snapshot](/guias/eventos-y-snapshot/).

## `Visibility`

```swift
public struct Visibility: Sendable, Equatable {
    let isVisible: Bool
    let missingJoints: [Joint]   // vacío si es visible
}
```

## `SetupIssue`

```swift
public enum SetupIssue: String, Sendable, CaseIterable, Codable {
    case turnSideways, faceCamera, moveCloser, stepBack
}
```

## `SetupCheck`

```swift
public struct SetupCheck: Sendable {
    var maxSideRatio = 0.45
    var minFrontRatio = 0.35
    var minSpan = 0.15
    var edgeMargin = 0.03

    init()
    func issues(in pose: Pose, exercise: ExerciseDefinition, side: BodySide) -> Set<SetupIssue>
}
```

Ver [Calidad de la medición](/guias/calidad-de-medicion/).
