---
title: Introdução
description: O que é o KinesiaMotion e que problemas ele resolve.
---

**KinesiaMotion** é o SDK que o app da Kinesia usa para medir o movimento de um paciente com a câmera do iPhone. Ele recebe os pontos do corpo quadro a quadro e devolve o que um app de reabilitação precisa: o ângulo atual, as repetições feitas, as que foram feitas com técnica ruim e se o paciente está bem posicionado diante da câmera.

## Dois módulos

| Módulo | O que contém | Depende de |
| --- | --- | --- |
| `KinesiaMotion` | O motor: poses, medições, exercícios, contagem de repetições, sessão. Swift puro, sem câmera nem UI. | Foundation, CoreGraphics, Observation |
| `KinesiaMotionVision` | `VisionPoseProvider`: poses ao vivo da câmera com o detector de corpo do Vision. | `KinesiaMotion`, AVFoundation, Vision |

A separação é intencional: o motor pode ser testado no macOS com poses gravadas, e a fonte de poses pode ser trocada (outro detector, um arquivo, um servidor) sem mexer em mais nada.

## O que faz

- **Mede em graus** com quatro tipos de medição: ângulo interno, flexão, ângulo em relação à vertical e inclinação.
- **Conta repetições** com limiares de histerese, e **mede sustentações** (manter uma posição por N segundos).
- **Verifica a técnica**: cada exercício tem regras de forma; avisa ao vivo e rejeita as repetições que as quebram.
- **Verifica o posicionamento**: detecta se o paciente deve se virar, se aproximar ou se afastar.
- **Mede a qualidade**: confiança do detector por repetição, velocidade máxima, tempos de subida e descida.
- **Medição inicial** (baseline): a mediana das primeiras N repetições limpas.

## O que não faz

- Não desenha interface. Entrega um `MotionSnapshot` observável e um fluxo de eventos; a tela, a voz e a vibração são suas.
- Não guarda dados. Você decide onde persistir as repetições (`session.reps`).
- Não traduz. As correções (`FormFeedback`, `SetupIssue`) são casos de um `enum`; seu app as converte em texto e voz no idioma do paciente.

:::caution[Uso clínico]
O KinesiaMotion mede em 2D a partir de uma única câmera. As medições servem para acompanhar a evolução de um mesmo paciente na mesma postura; não substituem uma goniometria clínica.
:::

## Requisitos

- iOS 17 ou superior (macOS 14 para o motor e os testes).
- Swift 6 com concorrência estrita: todos os tipos públicos são `Sendable`.
- `KinesiaMotionVision` só funciona no iOS (precisa de câmera).
