---
title: ExerciseDefinition
description: A descrição de um exercício, suas regras de forma e o catálogo.
sidebar:
  order: 3
---

```swift
public struct ExerciseDefinition: Identifiable, Sendable, Hashable, Codable
```

Tudo o que o motor precisa saber sobre um exercício. Dados puros: entra e sai em JSON.

```swift
init(
    id: String,
    region: BodyRegion,
    view: CameraView,
    kind: Kind,
    primary: Measure,
    rules: [FormRule] = [],
    defaultTarget: Double
)
```

| Propriedade | Tipo | |
| --- | --- | --- |
| `id` | `String` | Estável, p. ex. `"elbow.flexion"`. É salvo com as sessões: nunca o renomeie. |
| `region` | `BodyRegion` | `neck`, `shoulder`, `elbow`, `wrist`, `back`, `hip`, `knee`, `ankle`. |
| `view` | `CameraView` | `.side` ou `.front`. |
| `kind` | `Kind` | Como é contado (abaixo). |
| `primary` | [`Measure`](/pt/referencia/api/measure/) | O valor principal: o que é exibido no gráfico e comparado com a meta. |
| `rules` | `[FormRule]` | Regras de técnica. |
| `defaultTarget` | `Double` | Meta em graus se ninguém configurar outra. |

```swift
func joints(for side: BodySide) -> [Joint]
```

Todas as articulações que o exercício lê, primeiro as da medição principal.

## `Kind`

| Caso | |
| --- | --- |
| `.reps(low: Double, high: Double)` | Conta quando o valor passa de `high` e volta abaixo de `low`. |
| `.hold(threshold: Double, seconds: Double)` | Conta quando o valor fica acima de `threshold` e estável por `seconds`. |

Veja [Repetições e sustentações](/pt/conceptos/repeticiones/).

## `FormRule`

```swift
public struct FormRule: Sendable, Hashable, Codable {
    init(feedback: FormFeedback, measure: Measure, allowed: ClosedRange<Double>)
}
```

Uma condição que deve se manter enquanto dura a repetição. Se as articulações de `measure` não estão visíveis, a regra não é avaliada.

## `FormFeedback`

`keepUpperArmStill`, `keepThighStill`, `keepElbowStraight`, `keepTrunkUpright`, `keepShouldersLevel`, `keepKneeStraight`, `keepHipsLevel`.

`String`, `CaseIterable`, `Codable`: o `rawValue` é estável para traduzir e salvar.

## `ExerciseLibrary`

| Membro | |
| --- | --- |
| `static let all: [ExerciseDefinition]` | Os 8 do [catálogo](/pt/referencia/ejercicios/). |
| `static let elbowFlexion`, `kneeFlexionStanding`, … | Cada exercício pelo nome. |
| `static func definition(id:) -> ExerciseDefinition?` | Busca por `id`. |
| `static func definitions(for: BodyRegion) -> [ExerciseDefinition]` | Filtra por região. |
| `static func decode(from: Data) throws -> [ExerciseDefinition]` | Lê um array JSON. |
| `static func encode(_: [ExerciseDefinition]) throws -> Data` | Escreve JSON com chaves ordenadas. |
