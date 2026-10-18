---
title: Câmera ao vivo com Vision
description: Use o VisionPoseProvider para obter poses da câmera do iPhone.
---

`VisionPoseProvider` (módulo `KinesiaMotionVision`, só iOS) abre a câmera, roda o detector de corpo 2D do Vision em cada quadro e entrega poses que já cumprem o [contrato de Pose](/pt/conceptos/pose/).

```swift
import KinesiaMotionVision

let camera = VisionPoseProvider(
    camera: .front,          // .front ou .back
    minimumConfidence: 0.3   // pontos abaixo disso são descartados
)
```

## Permissão

```swift
if !VisionPoseProvider.isAuthorized {
    let granted = await VisionPoseProvider.requestAccess()
    guard granted else {
        // Mostre como ativar a câmera nos Ajustes
        return
    }
}
```

Lembre-se da chave `NSCameraUsageDescription` no `Info.plist` ([Instalação](/pt/empezar/instalacion/#permissão-de-câmera)).

## Ciclo de vida

A câmera **liga sozinha** quando alguém começa a iterar `poses()` e **desliga sozinha** quando para. Com `MotionSession` isso significa:

```swift
session.start(with: camera)  // liga
session.stop()               // desliga
```

Não é preciso chamar `startRunning()` nem `stopRunning()` em `captureSession`.

:::caution[Um fluxo por vez]
Cada `VisionPoseProvider` atende um único fluxo. Para medir os dois lados com a mesma câmera, crie duas `MotionSession` e reparta cada pose para ambas a partir de um único laço (veja abaixo), em vez de chamar `start(with:)` duas vezes com o mesmo provider.
:::

## Mostrar a imagem

`captureSession` é um `AVCaptureSession` comum: passe-o a um `AVCaptureVideoPreviewLayer`. O exemplo completo de `CameraPreview` para SwiftUI está no [início rápido](/pt/empezar/inicio-rapido/#o-exemplo-completo).

Com a câmera frontal a pré-visualização aparece espelhada (como um espelho), mas as poses trazem os lados **reais** do paciente. Se desenhar os pontos por cima, espelhe o `x` ao desenhar, não ao medir.

## O que faz por dentro

- Resolução VGA (640×480): suficiente para o detector e leve para a bateria.
- Descarta quadros atrasados: se seu código estiver lento, você sempre recebe a pose mais nova.
- Converte as coordenadas do Vision (normalizadas, origem embaixo) para pixels com `y` para baixo, numa imagem vertical.
- Com a câmera frontal troca esquerda e direita.
- Também envia poses vazias quando não detecta ninguém.

## Os dois lados com uma câmera

É assim que o app da Kinesia faz: uma câmera, uma sessão por lado.

```swift
let camera = VisionPoseProvider(camera: .front)
let left = MotionSession(exercise: exercise, side: .left)
let right = MotionSession(exercise: exercise, side: .right)

let task = Task { @MainActor in
    for await pose in camera.poses() {
        left.process(pose)
        right.process(pose)
    }
}
// Para terminar: task.cancel()  → a câmera desliga
```
