---
title: Instalación
description: Agrega KinesiaMotion a tu proyecto con Swift Package Manager.
---

KinesiaMotion se distribuye con **Swift Package Manager**.

## En Xcode

1. Abre **File → Add Package Dependencies…**
2. Pega la URL del repositorio:
   ```
   https://github.com/elmaedesistemas/kinesia-motion-ios.git
   ```
3. En **Dependency Rule** elige **Exact Version** y escribe la última versión (por ejemplo `0.3.0`).
4. Agrega a tu target de app los productos que necesites:
   - `KinesiaMotion`: siempre.
   - `KinesiaMotionVision`: si vas a usar la cámara del iPhone.

:::note[Versiones]
Fija una versión exacta y revisa las [notas de versión](/referencia/versiones/) antes de actualizar.
:::

## En `Package.swift`

```swift title="Package.swift"
dependencies: [
    .package(url: "https://github.com/elmaedesistemas/kinesia-motion-ios.git", exact: "0.3.0")
],
targets: [
    .target(
        name: "MiApp",
        dependencies: [
            .product(name: "KinesiaMotion", package: "kinesia-motion"),
            .product(name: "KinesiaMotionVision", package: "kinesia-motion")
        ]
    )
]
```

## Permiso de cámara

`VisionPoseProvider` usa la cámara, así que tu app necesita la descripción de uso en `Info.plist`:

```xml title="Info.plist"
<key>NSCameraUsageDescription</key>
<string>Usamos la cámara para medir tus movimientos durante los ejercicios. Las imágenes no salen del teléfono.</string>
```

Sin esta clave, iOS cierra la app la primera vez que se pide acceso a la cámara.

## Comprobar la instalación

```swift
import KinesiaMotion

print(ExerciseLibrary.all.map(\.id))
// ["elbow.flexion", "knee.flexion.standing", "shoulder.flexion", ...]
```

Si compila e imprime los ejercicios, estás listo para el [inicio rápido](/empezar/inicio-rapido/).
