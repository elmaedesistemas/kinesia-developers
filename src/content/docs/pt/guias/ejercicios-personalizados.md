---
title: Exercícios personalizados
description: Defina seus próprios exercícios em Swift ou JSON, sem tocar no motor.
---

Um exercício é um `ExerciseDefinition`: dados puros. Para adicionar um não é preciso escrever lógica, só descrevê-lo.

## As peças

### Pontos relativos ao lado: `LandmarkRef`

Um exercício é escrito uma vez e serve para os dois lados. Por isso ele não nomeia `rightElbow`, mas `"elbow"` (o cotovelo do lado exercitado) ou `"opposite.shoulder"` (o ombro do outro lado).

Pontos disponíveis: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

### O que medir: `Measure`

| Caso | Mede | Faixa |
| --- | --- | --- |
| `.angle(a:vertex:b:)` | Ângulo interno em `vertex` | 0…180 |
| `.flexion(a:vertex:b:)` | `180 − ângulo`: 0 = segmento reto, cresce ao dobrar | 0…180 |
| `.fromVertical(from:to:)` | Segmento `from→to` em relação à vertical para baixo | 0 para baixo, 90 horizontal, 180 para cima |
| `.tilt(a:b:)` | Linha entre dois pontos em relação à horizontal | 0 nivelada, 90 vertical |

### Que técnica exigir: `FormRule`

Uma medição e a faixa permitida enquanto dura a repetição. Se sair dela, é emitido o `FormFeedback` associado.

## Em Swift

Uma elevação lateral do braço com o cotovelo flexionado (o pico é medido no braço, as regras vigiam o tronco):

```swift
let bentArmRaise = ExerciseDefinition(
    id: "clinica.shoulder.bentArmRaise",
    region: .shoulder,
    view: .front,
    kind: .reps(low: 25, high: 70),
    primary: .fromVertical(from: "shoulder", to: "elbow"),
    rules: [
        FormRule(
            feedback: .keepTrunkUpright,
            measure: .fromVertical(from: "shoulder", to: "hip"),
            allowed: 0...15
        ),
        FormRule(
            feedback: .keepShouldersLevel,
            measure: .tilt(a: "shoulder", b: "opposite.shoulder"),
            allowed: 0...12
        )
    ],
    defaultTarget: 90
)

let session = MotionSession(exercise: bentArmRaise, side: .left)
```

:::caution[O `id` é para sempre]
O `id` é salvo junto com as sessões do paciente. Escolha um prefixo próprio (`"clinica.…"`) para não colidir com os do catálogo, e não o mude depois de publicado.
:::

## Em JSON

`ExerciseDefinition` é `Codable`. Você pode embutir um JSON no app ou baixá-lo do seu servidor:

```swift
let data = try Data(contentsOf: url)
let exercises = try ExerciseLibrary.decode(from: data)
```

E para gerar o JSON de um exercício existente:

```swift
let data = try ExerciseLibrary.encode([ExerciseLibrary.elbowFlexion])
```

Assim fica a flexão de cotovelo:

```json title="exercises.json"
[
  {
    "defaultTarget": 120,
    "id": "elbow.flexion",
    "kind": { "reps": { "high": 90, "low": 30 } },
    "primary": {
      "flexion": { "a": "shoulder", "b": "wrist", "vertex": "elbow" }
    },
    "region": "elbow",
    "rules": [
      {
        "allowed": [0, 30],
        "feedback": "keepUpperArmStill",
        "measure": { "fromVertical": { "from": "shoulder", "to": "elbow" } }
      }
    ],
    "view": "side"
  }
]
```

Uma sustentação usa `"kind": { "hold": { "threshold": 15, "seconds": 3 } }`.

:::note
Um nome de ponto desconhecido (`"elbw"`) faz a decodificação falhar com um erro claro, em vez de produzir um exercício que nunca mede nada.
:::

## Escolher bons limiares

- **`low`**: um pouco acima do repouso, para que a postura parada não abra tentativas. 20–30° costuma bastar.
- **`high`**: o mínimo que você considera uma repetição real. Abaixo disso, o movimento é ignorado sem ser rejeitado.
- **`defaultTarget`**: a meta que o app mostra se o profissional não configurar outra.
- **`view`**: escolha a vista em que o movimento acontece no plano da imagem. Uma flexão (para frente/trás) é vista de perfil; uma abdução (para o lado), de frente.
- **Regras**: comece permissivo e ajuste com gravações reais. Uma regra rígida demais rejeita repetições válidas e frustra o paciente.
