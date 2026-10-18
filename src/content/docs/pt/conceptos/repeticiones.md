---
title: Repetições e sustentações
description: Como o motor decide que uma repetição começou, terminou e foi limpa.
---

Um exercício é contado de uma de duas formas, conforme o seu `kind`.

## Repetições: `.reps(low:high:)`

O paciente sai do repouso, vai longe e volta. São usados **dois limiares** (histerese) para que o tremor em torno de um único valor não conte repetições falsas:

1. Quando o valor passa de `low`, começa uma **tentativa**.
2. Durante a tentativa são registrados o pico, a velocidade, a confiança e as regras quebradas.
3. Quando o valor cai abaixo de `low`, a tentativa termina:
   - se o pico **nunca chegou a `high`**, ela é ignorada (foi um movimento pequeno);
   - se chegou, é **julgada**: limpa → `.repCompleted`, com falhas → `.repRejected`.

```text
 graus
  high ┤        ╭──╮               ╭─╮
       │       ╱    ╲             ╱   ╲
  low  ┤──────╱──────╲───╭─╮─────╱─────╲────
       │     ╱        ╲ ╱   ╲   ╱       ╲
     0 ┼────╯          ╰     ╰─╯         ╰──
            └─ conta ──┘ ignorada └ conta ┘
```

Exemplo: a flexão de cotovelo usa `.reps(low: 30, high: 90)`. Dobrar até 60° e voltar não conta; dobrar até 125° conta, com `peak = 125`.

## Sustentações: `.hold(threshold:seconds:)`

O paciente chega ao fim da amplitude e fica ali.

1. Ao passar de `threshold`, é emitido `.holdStarted` e o relógio começa.
2. Se o valor se mover mais que `holdTolerance` (5° por padrão) em relação ao ponto de início, o relógio **reinicia** dali. Assim, enquanto o paciente continua subindo, nada é contado.
3. Quando o valor se mantém estável por `seconds` segundos, a sustentação é julgada. Seu `peak` é a **mediana** dessa janela, não o máximo, para que um pico isolado não infle o resultado.
4. O paciente deve voltar abaixo de `threshold` antes da próxima.

Enquanto sustenta, `snapshot.holdProgress` vai de 0 a 1: use-o para um anel de progresso.

## Suavização

Antes de tudo, o valor principal é suavizado com uma média móvel exponencial:

```text
valor = anterior + smoothing × (bruto − anterior)
```

Com `smoothing = 0.5` (padrão) saltos de um quadro desaparecem sem atraso perceptível. `1` desativa a suavização. Configura-se em `MotionSession(exercise:side:smoothing:)`.

## Regras de forma

Cada `FormRule` é uma medição com uma faixa permitida. Em cada quadro da tentativa:

- se a regra **não pode ser medida** (suas articulações não estão visíveis), ela é ignorada: não se penaliza o que não se vê;
- se for **quebrada** por `framesToCue` quadros seguidos (6, ~0,25 s), é emitido `.formFault` **uma vez por repetição**: é a correção ao vivo;
- no fim, se uma regra esteve quebrada em mais de `faultTolerance` dos quadros (20 %), a repetição é rejeitada e a falha aparece em `rep.faults`.

Assim, um deslize breve não estraga a repetição, mas fazê-la errado a maior parte do tempo, sim.

## O que cada repetição guarda

| Propriedade | Significado |
| --- | --- |
| `peak` | Valor máximo (mediana da janela nas sustentações) |
| `duration` | De repouso a repouso; nas sustentações, o tempo sustentado |
| `riseDuration` | Do início ao pico |
| `returnDuration` | Do pico de volta ao repouso (0 nas sustentações) |
| `peakVelocity` | Velocidade máxima, em graus por segundo |
| `confidence` | Confiança média do detector, 0…1, ou `nil` |
| `faults` | Regras quebradas; vazio = limpa (`isClean`) |

Para ver a consistência de uma série: `session.reps.peakSpread` dá o desvio padrão dos picos.
