---
title: Qualidade da medição
description: Posicionamento diante da câmera, confiança do detector e métricas por repetição.
---

Um ângulo é tão bom quanto a imagem de onde ele sai. O KinesiaMotion oferece três ferramentas para saber quando confiar em uma medição.

## 1. Posicionamento: `SetupIssue`

Em cada quadro, `SetupCheck` verifica a postura do paciente diante da câmera, e a sessão publica os problemas em `snapshot.setupIssues` (e em `SetupChanged` quando mudam, após ~0,5 s estáveis).

| Caso | O que acontece | O que dizer |
| --- | --- | --- |
| `TURN_SIDEWAYS` | Exercício de perfil, mas ele está de frente: o ângulo encurta | «Fique de lado» |
| `FACE_CAMERA` | Exercício de frente, mas ele está de lado | «Olhe para a câmera» |
| `MOVE_CLOSER` | As articulações medidas aparecem muito pequenas: tremem mais | «Chegue mais perto» |
| `STEP_BACK` | Uma articulação está na borda da imagem e vai sair ao se mover | «Afaste-se um pouco» |

O que não pode ser julgado (uma articulação fora de vista, sem `imageSize`) é omitido em vez de adivinhado.

```kotlin
val s by session.snapshot.collectAsStateWithLifecycle()

if (s.isVisible) {
    s.setupIssues.firstOrNull()?.let { issue -> Banner(texto(issue)) }
}
```

:::tip
Mostre primeiro a visibilidade («não vejo seu braço») e só depois o posicionamento. Pedir para virar quando nem o braço aparece confunde.
:::

### Ajustar os limiares

```kotlin
session.setupCheck = SetupCheck(
    maxSideRatio = 0.45,   // largura dos ombros ÷ tronco acima da qual «está de frente»
    minFrontRatio = 0.35,  // abaixo da qual «está de lado»
    minSpan = 0.15,        // tamanho mínimo das articulações ÷ lado curto da imagem
    edgeMargin = 0.03,     // margem mínima até as bordas
)

session.framesToConfirmSetup = 12       // antirrepique (~0,5 s a 24 FPS)
session.framesToConfirmVisibility = 6   // antirrepique (~0,25 s)
```

## 2. Confiança do detector

`snapshot.confidence` é a **menor** confiança entre as articulações da medição principal no último quadro, 0…1. Cada `Rep` guarda a **média** durante a repetição.

```kotlin
val confidence = session.snapshot.value.lastRep?.confidence
if (confidence != null && confidence < 0.5) {
    Text("Medição pouco confiável: melhore a luz ou o enquadramento")
}
```

É `null` quando a fonte de poses não fornece confiança.

## 3. Métricas por repetição

Além do pico, cada `Rep` traz dados para avaliar o controle do movimento:

```kotlin
for (rep in session.reps) {
    println("${rep.peak} ${rep.riseDuration} ${rep.returnDuration} ${rep.peakVelocity}")
}
session.reps.peakSpread   // desvio padrão dos picos: baixo = consistente
```

Uma descida muito mais rápida que a subida (`returnDuration` ≪ `riseDuration`) costuma indicar que o paciente «deixa cair» o segmento em vez de controlá-lo.
