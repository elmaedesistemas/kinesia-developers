---
title: Exercícios personalizados
description: Defina seus próprios exercícios em Kotlin ou JSON, sem tocar no motor.
---

Um exercício é um `ExerciseDefinition`: dados puros. Para adicionar um não é preciso escrever lógica, só descrevê-lo.

## As peças

### Pontos relativos ao lado: `LandmarkRef`

Um exercício é escrito uma vez e serve para os dois lados. Por isso ele não nomeia `RIGHT_ELBOW`, mas `"elbow"` (o cotovelo do lado exercitado) ou `"opposite.shoulder"` (o ombro do outro lado).

Pontos disponíveis: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

### O que medir: `Measure`

| Caso | Mede | Faixa |
| --- | --- | --- |
| `Measure.Angle(a, vertex, b)` | Ângulo interno em `vertex` | 0…180 |
| `Measure.Flexion(a, vertex, b)` | `180 − ângulo`: 0 = segmento reto, cresce ao dobrar | 0…180 |
| `Measure.FromVertical(from, to)` | Segmento `from→to` em relação à vertical para baixo | 0 para baixo, 90 horizontal, 180 para cima |
| `Measure.Tilt(a, b)` | Linha entre dois pontos em relação à horizontal | 0 nivelada, 90 vertical |

### Que técnica exigir: `FormRule`

Uma medição e a faixa permitida enquanto dura a repetição. Se sair dela, é emitido o `FormFeedback` associado.

## Em Kotlin

Uma elevação lateral do braço com o cotovelo flexionado (o pico é medido no braço, as regras vigiam o tronco):

```kotlin
val bentArmRaise = ExerciseDefinition(
    id = "clinica.shoulder.bentArmRaise",
    region = BodyRegion.SHOULDER,
    view = CameraView.FRONT,
    kind = ExerciseDefinition.Kind.Reps(low = 25.0, high = 70.0),
    primary = Measure.FromVertical("shoulder", "elbow"),
    rules = listOf(
        FormRule(
            feedback = FormFeedback.KEEP_TRUNK_UPRIGHT,
            measure = Measure.FromVertical("shoulder", "hip"),
            allowed = 0.0..15.0,
        ),
        FormRule(
            feedback = FormFeedback.KEEP_SHOULDERS_LEVEL,
            measure = Measure.Tilt("shoulder", "opposite.shoulder"),
            allowed = 0.0..12.0,
        ),
    ),
    defaultTarget = 90.0,
)

val session = MotionSession(bentArmRaise, BodySide.LEFT)
```

:::caution[O `id` é para sempre]
O `id` é salvo junto com as sessões do paciente. Escolha um prefixo próprio (`"clinica.…"`) para não colidir com os do catálogo, e não o mude depois de publicado.
:::

## Em JSON

`ExerciseDefinition` é `@Serializable`. Você pode embutir um JSON no app ou baixá-lo do seu servidor:

```kotlin
val text = context.assets.open("exercises.json").bufferedReader().use { it.readText() }
val exercises = ExerciseLibrary.decode(text)
```

E para gerar o JSON de um exercício existente:

```kotlin
val text = ExerciseLibrary.encode(listOf(ExerciseLibrary.elbowFlexion))
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
Um nome de ponto desconhecido (`"elbw"`) faz a decodificação falhar com uma `SerializationException` clara, em vez de produzir um exercício que nunca mede nada.
:::

## Escolher bons limiares

- **`low`**: um pouco acima do repouso, para que a postura parada não abra tentativas. 20–30° costuma bastar.
- **`high`**: o mínimo que você considera uma repetição real. Abaixo disso, o movimento é ignorado sem ser rejeitado.
- **`defaultTarget`**: a meta que o app mostra se o profissional não configurar outra.
- **`view`**: escolha a vista em que o movimento acontece no plano da imagem. Uma flexão (para frente/trás) é vista de perfil; uma abdução (para o lado), de frente.
- **Regras**: comece permissivo e ajuste com gravações reais. Uma regra rígida demais rejeita repetições válidas e frustra o paciente.
