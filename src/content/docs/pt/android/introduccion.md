---
title: Introdução ao KinesiaMotion para Android
description: O que é o SDK de Android, quais módulos ele tem e que problemas resolve.
prev: false
---

**KinesiaMotion para Android** mede o movimento de um paciente com a câmera do celular. É uma biblioteca em Kotlin: recebe os pontos do corpo quadro a quadro e devolve o que um app de reabilitação precisa: o ângulo atual, as repetições feitas, as que foram feitas com técnica ruim e se o paciente está bem posicionado diante da câmera.

## Dois módulos

| Módulo | O que contém | Depende de |
| --- | --- | --- |
| `kinesia-motion` | O motor: poses, medições, exercícios, contagem de repetições, sessão. Kotlin puro, sem Android, sem câmera e sem UI. | Coroutines, kotlinx.serialization |
| `kinesia-motion-camera` | `CameraPoseProvider` e `VideoPoseProvider`: poses da câmera ou de um vídeo, com MediaPipe Pose Landmarker. | `kinesia-motion`, CameraX, MediaPipe |

A separação é intencional: o motor é testado na JVM com poses gravadas, sem emulador, e a fonte de poses pode ser trocada (outro detector, um arquivo, um servidor) sem mexer em mais nada.

## O que faz

- **Mede em graus** com quatro tipos de medição: ângulo interno, flexão, ângulo em relação à vertical e inclinação.
- **Conta repetições** com limiares de histerese, e **mede sustentações** (manter uma posição por N segundos).
- **Verifica a técnica**: cada exercício tem regras de forma; avisa ao vivo e rejeita as repetições que as quebram.
- **Verifica o posicionamento**: detecta se o paciente deve se virar, se aproximar ou se afastar.
- **Mede a qualidade**: confiança do detector por repetição, velocidade máxima, tempos de subida e descida.
- **Medição inicial** (baseline): a mediana das primeiras N repetições limpas.

## O que não faz

- Não desenha interface. Entrega um `StateFlow<MotionSnapshot>` e um `SharedFlow<MotionEvent>`; a tela, a voz e a vibração são suas.
- Não salva dados. Você decide onde persistir as repetições (`session.reps`).
- Não traduz. As correções (`FormFeedback`, `SetupIssue`) são casos de um `enum`; seu app os converte em texto e voz no idioma do paciente.

:::caution[Uso clínico]
O KinesiaMotion mede em 2D a partir de uma única câmera. As medições servem para acompanhar a evolução de um mesmo paciente na mesma postura; não substituem uma goniometria clínica.
:::

## Requisitos

- `minSdk 24` (Android 7.0) ou superior.
- Java 17 para compilar.
- O motor roda em qualquer JVM; o módulo de câmera precisa do Android.

## Por onde continuar

1. [Instalação](/pt/android/instalacion/): adicione as dependências com Gradle.
2. [Início rápido](/pt/android/inicio-rapido/): uma tela de Jetpack Compose que conta repetições.
3. [Como funciona](/pt/android/conceptos/como-funciona/): do quadro à repetição medida.
