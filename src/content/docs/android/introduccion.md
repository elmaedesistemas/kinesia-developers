---
title: Introducción a KinesiaMotion para Android
description: Qué es el SDK de Android, qué módulos tiene y qué problemas resuelve.
prev: false
---

**KinesiaMotion para Android** mide el movimiento de un paciente con la cámara del teléfono. Es una librería en Kotlin: recibe los puntos del cuerpo fotograma a fotograma y devuelve lo que una app de rehabilitación necesita: el ángulo actual, las repeticiones hechas, las que se hicieron con mala técnica y si el paciente está bien ubicado frente a la cámara.

## Dos módulos

| Módulo | Qué contiene | Depende de |
| --- | --- | --- |
| `kinesia-motion` | El motor: poses, mediciones, ejercicios, conteo de repeticiones, sesión. Kotlin puro, sin Android, sin cámara y sin UI. | Coroutines, kotlinx.serialization |
| `kinesia-motion-camera` | `CameraPoseProvider` y `VideoPoseProvider`: poses desde la cámara o un video, con MediaPipe Pose Landmarker. | `kinesia-motion`, CameraX, MediaPipe |

La separación es intencional: el motor se prueba en la JVM con poses grabadas, sin emulador, y la fuente de poses se puede cambiar (otro detector, un archivo, un servidor) sin tocar nada más.

## Lo que hace

- **Mide en grados** con cuatro tipos de medición: ángulo interno, flexión, ángulo contra la vertical e inclinación.
- **Cuenta repeticiones** con umbrales de histéresis, y **mide sostenidos** (mantener una posición durante N segundos).
- **Revisa la técnica**: cada ejercicio tiene reglas de forma; avisa en vivo y rechaza las repeticiones que las rompen.
- **Revisa la ubicación**: detecta si el paciente debe girarse, acercarse o alejarse.
- **Mide la calidad**: confianza del detector por repetición, velocidad máxima, tiempos de subida y bajada.
- **Medición inicial** (baseline): la mediana de las primeras N repeticiones limpias.

## Lo que no hace

- No dibuja interfaz. Te da un `StateFlow<MotionSnapshot>` y un `SharedFlow<MotionEvent>`; la pantalla, la voz y la vibración son tuyas.
- No guarda datos. Tú decides dónde persistir las repeticiones (`session.reps`).
- No traduce. Las correcciones (`FormFeedback`, `SetupIssue`) son casos de un `enum`; tu app los convierte en texto y voz en el idioma del paciente.

:::caution[Uso clínico]
KinesiaMotion mide en 2D a partir de una sola cámara. Las mediciones sirven para seguir la evolución de un mismo paciente con la misma postura, no reemplazan una goniometría clínica.
:::

## Requisitos

- `minSdk 24` (Android 7.0) o superior.
- Java 17 para compilar.
- El motor corre en cualquier JVM; el módulo de cámara necesita Android.

## Por dónde seguir

1. [Instalación](/android/instalacion/): agrega las dependencias con Gradle.
2. [Inicio rápido](/android/inicio-rapido/): una pantalla de Jetpack Compose que cuenta repeticiones.
3. [Cómo funciona](/android/conceptos/como-funciona/): del fotograma a la repetición medida.
