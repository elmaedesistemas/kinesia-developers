---
title: Introdução
description: O que é o KinesiaMotion, em quais plataformas está e que problemas ele resolve.
---

**KinesiaMotion** é o SDK que o app da Kinesia usa para medir o movimento de um paciente com a câmera do celular, no **iOS** e no **Android**. Ele recebe os pontos do corpo quadro a quadro e devolve o que um app de reabilitação precisa: o ângulo atual, as repetições feitas, as que foram feitas com técnica ruim e se o paciente está bem posicionado diante da câmera.

## Plataformas e módulos

Em cada plataforma, o SDK tem duas partes: um **motor** sem câmera nem interface, e um **módulo de câmera** que detecta o corpo e entrega poses. Os dois motores medem o mesmo: os mesmos ângulos, a mesma contagem, o mesmo catálogo e o mesmo JSON de exercícios.

| Plataforma | Motor | Câmera | Detector | Repositório |
| --- | --- | --- | --- | --- |
| iOS | `KinesiaMotion` (Swift) | `KinesiaMotionVision` | Apple Vision | [kinesia-motion-ios](https://github.com/elmaedesistemas/kinesia-motion-ios) |
| Android | `kinesia-motion` (Kotlin) | `kinesia-motion-camera` | MediaPipe Pose Landmarker | [kinesia-motion-android](https://github.com/elmaedesistemas/kinesia-motion-android) |
| Web | — | — | MediaPipe | Em breve |

A separação é intencional: o motor pode ser testado sem celular (no macOS ou na JVM) com poses gravadas, e a fonte de poses pode ser trocada (outro detector, um arquivo, um servidor) sem mexer em mais nada.

Os guias mostram os exemplos em Swift. Para Android, veja as [diferenças com o iOS](/pt/android/diferencias-con-ios/).

## O que faz

- **Mede em graus** com quatro tipos de medição: ângulo interno, flexão, ângulo em relação à vertical e inclinação.
- **Conta repetições** com limiares de histerese, e **mede sustentações** (manter uma posição por N segundos).
- **Verifica a técnica**: cada exercício tem regras de forma; avisa ao vivo e rejeita as repetições que as quebram.
- **Verifica o posicionamento**: detecta se o paciente deve se virar, se aproximar ou se afastar.
- **Mede a qualidade**: confiança do detector por repetição, velocidade máxima, tempos de subida e descida.
- **Medição inicial** (baseline): a mediana das primeiras N repetições limpas.

## O que não faz

- Não desenha interface. Entrega um `MotionSnapshot` que pode ser observado e um fluxo de eventos; a tela, a voz e a vibração são suas.
- Não guarda dados. Você decide onde persistir as repetições (`session.reps`).
- Não traduz. As correções (`FormFeedback`, `SetupIssue`) são casos de um `enum`; seu app as converte em texto e voz no idioma do paciente.

:::caution[Uso clínico]
O KinesiaMotion mede em 2D a partir de uma única câmera. As medições servem para acompanhar a evolução de um mesmo paciente na mesma postura; não substituem uma goniometria clínica.
:::

## Requisitos

**iOS**
- iOS 17 ou superior (macOS 14 para o motor e os testes).
- Swift 6 com concorrência estrita: todos os tipos públicos são `Sendable`.
- `KinesiaMotionVision` só funciona no iOS (precisa de câmera).

**Android**
- `minSdk 24` (Android 7.0) ou superior.
- O motor é Kotlin puro e roda em qualquer JVM; o módulo de câmera precisa do Android.
