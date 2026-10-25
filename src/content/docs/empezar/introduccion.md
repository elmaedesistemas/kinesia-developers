---
title: Introducción
description: Qué es KinesiaMotion, en qué plataformas está y qué problemas resuelve.
---

**KinesiaMotion** es el SDK que usa la app de Kinesia para medir el movimiento de un paciente con la cámara del teléfono, en **iOS** y **Android**. Recibe los puntos del cuerpo fotograma a fotograma y devuelve lo que una app de rehabilitación necesita: el ángulo actual, las repeticiones hechas, las que se hicieron con mala técnica y si el paciente está bien ubicado frente a la cámara.

## Plataformas y módulos

En cada plataforma, el SDK tiene dos partes: un **motor** sin cámara ni interfaz, y un **módulo de cámara** que detecta el cuerpo y entrega poses. Los dos motores miden lo mismo: los mismos ángulos, el mismo conteo, el mismo catálogo y el mismo JSON de ejercicios.

| Plataforma | Motor | Cámara | Detector | Repositorio |
| --- | --- | --- | --- | --- |
| iOS | `KinesiaMotion` (Swift) | `KinesiaMotionVision` | Apple Vision | [kinesia-motion-ios](https://github.com/elmaedesistemas/kinesia-motion-ios) |
| Android | `kinesia-motion` (Kotlin) | `kinesia-motion-camera` | MediaPipe Pose Landmarker | [kinesia-motion-android](https://github.com/elmaedesistemas/kinesia-motion-android) |
| Web | — | — | MediaPipe | Pronto |

La separación es intencional: el motor se puede probar sin teléfono (en macOS o en la JVM) con poses grabadas, y la fuente de poses se puede cambiar (otro detector, un archivo, un servidor) sin tocar nada más.

Las guías muestran los ejemplos en Swift. Para Android, revisa las [diferencias con iOS](/android/diferencias-con-ios/).

## Lo que hace

- **Mide en grados** con cuatro tipos de medición: ángulo interno, flexión, ángulo contra la vertical e inclinación.
- **Cuenta repeticiones** con umbrales de histéresis, y **mide sostenidos** (mantener una posición durante N segundos).
- **Revisa la técnica**: cada ejercicio tiene reglas de forma; avisa en vivo y rechaza las repeticiones que las rompen.
- **Revisa la ubicación**: detecta si el paciente debe girarse, acercarse o alejarse.
- **Mide la calidad**: confianza del detector por repetición, velocidad máxima, tiempos de subida y bajada.
- **Medición inicial** (baseline): la mediana de las primeras N repeticiones limpias.

## Lo que no hace

- No dibuja interfaz. Te da un `MotionSnapshot` que se puede observar y un flujo de eventos; la pantalla, la voz y la vibración son tuyas.
- No guarda datos. Tú decides dónde persistir las repeticiones (`session.reps`).
- No traduce. Las correcciones (`FormFeedback`, `SetupIssue`) son casos de un `enum`; tu app los convierte en texto y voz en el idioma del paciente.

:::caution[Uso clínico]
KinesiaMotion mide en 2D a partir de una sola cámara. Las mediciones sirven para seguir la evolución de un mismo paciente con la misma postura, no reemplazan una goniometría clínica.
:::

## Requisitos

**iOS**
- iOS 17 o superior (macOS 14 para el motor y las pruebas).
- Swift 6 con concurrencia estricta: todos los tipos públicos son `Sendable`.
- `KinesiaMotionVision` solo funciona en iOS (necesita cámara).

**Android**
- `minSdk 24` (Android 7.0) o superior.
- El motor es Kotlin puro y corre en cualquier JVM; el módulo de cámara necesita Android.
