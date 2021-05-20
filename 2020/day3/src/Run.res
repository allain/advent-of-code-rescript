@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let lines: array<string> = readFileSync("input.txt", "utf-8")->Js.String2.split("\n")

type currentState = {
  x: int,
  y: int,
  hits: float,
}

let countHits = (lines, dx, dy) => {
  let lineLength = String.length(Array.getExn(lines, 0))

  let finalState = Js.Array2.reducei(
    lines,
    (state, line, index) => {
      if state.y != index {
        // literally jumps lines that the slope dictates we need to jump
        state
      } else {
        let nextX = mod(state.x + dx, lineLength)
        let nextY = state.y + dy
        {
          x: nextX,
          y: nextY,
          hits: switch String.get(line, state.x) {
          | '#' => state.hits +. 1.0
          | _ => state.hits
          },
        }
      }
    },
    {
      x: 0,
      y: 0,
      hits: 0.0,
    },
  )

  finalState.hits
}

Js.log(
  countHits(lines, 1, 1) *.
  countHits(lines, 3, 1) *.
  countHits(lines, 5, 1) *.
  countHits(lines, 7, 1) *.
  countHits(lines, 1, 2),
)
