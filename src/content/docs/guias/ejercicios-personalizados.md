---
title: Ejercicios personalizados
description: Define tus propios ejercicios en Swift o en JSON, sin tocar el motor.
---

Un ejercicio es un `ExerciseDefinition`: datos puros. Para agregar uno no hay que escribir lógica, solo describirlo.

## Las piezas

### Puntos relativos al lado: `LandmarkRef`

Un ejercicio se escribe una vez y sirve para los dos lados. Por eso no nombra `rightElbow`, sino `"elbow"` (el codo del lado que se ejercita) u `"opposite.shoulder"` (el hombro del otro lado).

Puntos disponibles: `nose`, `neck`, `root`, `eye`, `ear`, `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.

### Qué medir: `Measure`

| Caso | Mide | Rango |
| --- | --- | --- |
| `.angle(a:vertex:b:)` | Ángulo interno en `vertex` | 0…180 |
| `.flexion(a:vertex:b:)` | `180 − ángulo`: 0 = segmento recto, crece al doblar | 0…180 |
| `.fromVertical(from:to:)` | Segmento `from→to` contra la vertical hacia abajo | 0 abajo, 90 horizontal, 180 arriba |
| `.tilt(a:b:)` | Línea entre dos puntos contra la horizontal | 0 nivelado, 90 vertical |

### Qué técnica exigir: `FormRule`

Una medición y el rango permitido mientras dura la repetición. Si se sale, se emite el `FormFeedback` asociado.

## En Swift

Una elevación lateral de brazo con el codo flexionado (el pico se mide en el brazo, la regla vigila el tronco):

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

:::caution[El `id` es para siempre]
El `id` se guarda junto con las sesiones del paciente. Elige un prefijo propio (`"clinica.…"`) para no chocar con los del catálogo, y no lo cambies una vez publicado.
:::

## En JSON

`ExerciseDefinition` es `Codable`. Puedes empaquetar un JSON en la app o descargarlo de tu servidor:

```swift
let data = try Data(contentsOf: url)
let exercises = try ExerciseLibrary.decode(from: data)
```

Y para generar el JSON de un ejercicio existente:

```swift
let data = try ExerciseLibrary.encode([ExerciseLibrary.elbowFlexion])
```

Así se ve la flexión de codo:

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

Un sostenido usa `"kind": { "hold": { "threshold": 15, "seconds": 3 } }`.

:::note
Un nombre de punto desconocido (`"elbw"`) hace fallar la decodificación con un error claro, en lugar de producir un ejercicio que nunca mide nada.
:::

## Elegir buenos umbrales

- **`low`**: algo por encima del reposo, para que la postura quieta no abra intentos. 20–30° suele bastar.
- **`high`**: el mínimo que consideras una repetición real. Por debajo, el movimiento se ignora sin rechazarse.
- **`defaultTarget`**: el objetivo que muestra la app si el profesional no configura otro.
- **`view`**: elige la vista donde el movimiento ocurre en el plano de la imagen. Una flexión (adelante/atrás) se ve de perfil; una abducción (hacia el lado), de frente.
- **Reglas**: empieza permisivo y ajusta con grabaciones reales. Una regla muy estricta rechaza repeticiones válidas y frustra al paciente.
