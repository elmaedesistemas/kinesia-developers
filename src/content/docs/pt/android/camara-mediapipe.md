---
title: Câmera com MediaPipe
description: Use CameraPoseProvider e VideoPoseProvider para obter poses no Android.
---

No Android, as poses vêm do **MediaPipe Pose Landmarker**, o mesmo modelo que o SDK web vai usar. `CameraPoseProvider` o roda sobre a câmera com CameraX, e `VideoPoseProvider` sobre um arquivo de vídeo. Os dois entregam poses que cumprem o [contrato de Pose](/pt/conceptos/pose/), então o motor mede igual ao iOS.

```kotlin
import one.kinesia.motion.camera.CameraPoseProvider

val camera = CameraPoseProvider(
    context = context,
    lifecycleOwner = lifecycleOwner,
    camera = CameraPoseProvider.Camera.FRONT,          // FRONT ou BACK
    minimumConfidence = 0.3,                           // pontos abaixo são descartados
    previewSurface = previewView.surfaceProvider,      // opcional: a imagem ao vivo
)
```

## Ciclo de vida

A câmera **liga sozinha** quando alguém começa a coletar `poses()` e **desliga sozinha** quando para. Com `MotionSession`:

```kotlin
session.start(camera, lifecycleScope)  // liga
session.stop()                         // desliga
```

Além disso, a câmera está ligada ao `lifecycleOwner`: o CameraX a pausa quando a tela deixa de estar visível.

:::caution[Um fluxo por vez]
Cada `CameraPoseProvider` atende um único fluxo. Para medir os dois lados com a mesma câmera, distribua cada pose para duas sessões a partir de um único `collect` (veja abaixo).
:::

## Mostrar a imagem

Passe `previewView.surfaceProvider` (de `androidx.camera.view.PreviewView`) em `previewSurface`. Com a câmera frontal, a pré-visualização aparece espelhada e os pontos da pose estão nesse mesmo quadro espelhado: você pode desenhá-los por cima sem inverter o `x`. Os **lados**, porém, são os reais do paciente.

`PreviewView` corta a imagem para preencher a tela (`FILL_CENTER`). Para desenhar os pontos por cima, escale-os com `pose.imageSize` do mesmo jeito que a pré-visualização.

## O que faz por dentro

- Analisa os quadros com CameraX (`ImageAnalysis`, 640×480 por padrão) e descarta os atrasados: se seu código for lento, você sempre recebe a pose mais nova.
- Endireita cada quadro conforme a orientação do sensor e, com a câmera frontal, o espelha como a pré-visualização.
- Roda o MediaPipe em modo vídeo (um só corpo) numa thread própria.
- Converte os 33 pontos do BlazePose para os 19 `Joint` do SDK com `BlazePose.pose(...)`. O pescoço (`NECK`) e a raiz (`ROOT`) não existem no BlazePose: são o ponto médio dos ombros e dos quadris.
- Usa a `visibility` do MediaPipe como confiança de cada ponto.
- Envia também poses vazias quando não detecta ninguém.

## Os dois lados com uma câmera

```kotlin
val camera = CameraPoseProvider(context, lifecycleOwner)
val left = MotionSession(exercise, BodySide.LEFT)
val right = MotionSession(exercise, BodySide.RIGHT)

val job = lifecycleScope.launch {
    camera.poses().collect { pose ->
        left.process(pose)
        right.process(pose)
    }
}
// Para terminar: job.cancel()  → a câmera desliga
```

## A partir de um vídeo

`VideoPoseProvider` lê um vídeo com o mesmo modelo, por exemplo para comparar com um goniômetro ou revisar uma sessão gravada:

```kotlin
import one.kinesia.motion.camera.VideoPoseProvider

val poses = VideoPoseProvider(context, uri, framesPerSecond = 24.0).readAll()

val session = MotionSession(ExerciseLibrary.elbowFlexion, BodySide.RIGHT)
poses.forEach { session.process(it) }
println(session.peaks)
```

Os quadros são lidos tão rápido quanto o celular permite, não em tempo real, e o `timestamp` de cada pose é sua posição no vídeo, em segundos.

## Outro detector

Se você já tem outro detector de pose, não precisa do módulo de câmera: monte as `Pose` você mesmo e passe para `session.process(pose)`. Se o seu detector entrega os 33 pontos do BlazePose (por exemplo, o MediaPipe em outra configuração), `BlazePose.pose(...)` faz a conversão por você.
