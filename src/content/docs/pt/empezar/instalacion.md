---
title: Instalação
description: Adicione o KinesiaMotion ao seu projeto com o Swift Package Manager.
---

O KinesiaMotion é distribuído com o **Swift Package Manager**.

## No Xcode

1. Abra **File → Add Package Dependencies…**
2. Cole a URL do repositório:
   ```
   https://github.com/elmaedesistemas/kinesia-motion.git
   ```
3. Em **Dependency Rule** escolha **Exact Version** e digite a versão mais recente (por exemplo `0.1.0-alpha.9`).
4. Adicione ao target do app os produtos de que precisar:
   - `KinesiaMotion`: sempre.
   - `KinesiaMotionVision`: se for usar a câmera do iPhone.

:::note[Versões alpha]
Enquanto o SDK estiver em `0.1.0-alpha`, a API pode mudar entre versões. Fixe uma versão exata e leia as [notas de versão](/pt/referencia/versiones/) antes de atualizar.
:::

## No `Package.swift`

```swift title="Package.swift"
dependencies: [
    .package(url: "https://github.com/elmaedesistemas/kinesia-motion.git", exact: "0.1.0-alpha.9")
],
targets: [
    .target(
        name: "MeuApp",
        dependencies: [
            .product(name: "KinesiaMotion", package: "kinesia-motion"),
            .product(name: "KinesiaMotionVision", package: "kinesia-motion")
        ]
    )
]
```

## Permissão de câmera

`VisionPoseProvider` usa a câmera, então seu app precisa da descrição de uso no `Info.plist`:

```xml title="Info.plist"
<key>NSCameraUsageDescription</key>
<string>Usamos a câmera para medir seus movimentos durante os exercícios. As imagens não saem do celular.</string>
```

Sem essa chave, o iOS encerra o app na primeira vez que ele pede acesso à câmera.

## Verificar a instalação

```swift
import KinesiaMotion

print(ExerciseLibrary.all.map(\.id))
// ["elbow.flexion", "knee.flexion.standing", "shoulder.flexion", ...]
```

Se compilar e imprimir os exercícios, você está pronto para o [início rápido](/pt/empezar/inicio-rapido/).
