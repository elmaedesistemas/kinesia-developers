---
title: Qualidade da medição
description: Posicionamento diante da câmera, confiança do detector e métricas por repetição.
---

Um ângulo é tão bom quanto a imagem de onde ele sai. O KinesiaMotion oferece três ferramentas para saber quando confiar em uma medição.

## 1. Posicionamento: `SetupIssue`

Em cada quadro, `SetupCheck` verifica a postura do paciente diante da câmera, e a sessão publica os problemas em `snapshot.setupIssues` (e em `.setupChanged` quando mudam, após ~0,5 s estáveis).

| Caso | O que acontece | O que dizer |
| --- | --- | --- |
| `turnSideways` | Exercício de perfil, mas ele está de frente: o ângulo encurta | «Fique de lado» |
| `faceCamera` | Exercício de frente, mas ele está de lado | «Olhe para a câmera» |
| `moveCloser` | As articulações medidas aparecem muito pequenas: tremem mais | «Chegue mais perto» |
| `stepBack` | Uma articulação está na borda da imagem e vai sair ao se mover | «Afaste-se um pouco» |

O que não pode ser julgado (uma articulação fora de vista, sem `imageSize`) é omitido em vez de adivinhado.

```swift
if session.snapshot.isVisible, let issue = session.snapshot.setupIssues.first {
    Banner(texto(para: issue))
}
```

:::tip
Mostre primeiro a visibilidade («não vejo seu braço») e só depois o posicionamento. Pedir para virar quando nem o braço aparece confunde.
:::

### Ajustar os limiares

```swift
var check = SetupCheck()
check.maxSideRatio = 0.45   // largura dos ombros ÷ tronco acima da qual «está de frente»
check.minFrontRatio = 0.35  // abaixo da qual «está de lado»
check.minSpan = 0.15        // tamanho mínimo das articulações ÷ lado menor da imagem
check.edgeMargin = 0.03     // margem mínima até as bordas
session.setupCheck = check

session.framesToConfirmSetup = 12       // antirrepique (~0,5 s a 24 FPS)
session.framesToConfirmVisibility = 6   // antirrepique (~0,25 s)
```

## 2. Confiança do detector

`snapshot.confidence` é a **menor** confiança entre as articulações da medição principal no último quadro, 0…1. Cada `Rep` guarda a **média** durante a repetição.

```swift
if let c = session.snapshot.lastRep?.confidence, c < 0.5 {
    Text("Medição pouco confiável: melhore a luz ou o enquadramento")
}
```

É `nil` quando a fonte de poses não fornece confiança.

## 3. Métricas por repetição

Além do pico, cada `Rep` traz dados para avaliar o controle do movimento:

```swift
for rep in session.reps {
    print(rep.peak, rep.riseDuration, rep.returnDuration, rep.peakVelocity)
}
session.reps.peakSpread   // desvio padrão dos picos: baixo = consistente
```

Uma descida muito mais rápida que a subida (`returnDuration` ≪ `riseDuration`) costuma indicar que o paciente «deixa cair» o segmento em vez de controlá-lo.
