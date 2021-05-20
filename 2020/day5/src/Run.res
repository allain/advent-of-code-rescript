@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let lines: array<string> = readFileSync("input.txt", "utf-8")->Js.String2.split("\n")

exception InvalidLetter(string)

type seat = {
  id: int,
  row: int,
  column: int,
}
let parseSeat: string => seat = code => {
  let id = Js.String2.split(code, "")->Array.reduce(0, (id, letter) =>
    switch letter {
    | "B" => id * 2 + 1
    | "F" => id * 2
    | "R" => id * 2 + 1
    | "L" => id * 2
    | _ => raise(InvalidLetter(letter))
    }
  )
  let row = Js.Math.floor_int(Int.toFloat(id) /. 8.0)
  let column = mod(id, 8)

  {
    id: id,
    row: row,
    column: column,
  }
}

Js.log(parseSeat("BFFFBBFRRR"))
Js.log(lines->Array.map(parseSeat)->Array.reduce(0, (max, {id}) => Js.Math.max_int(max, id)))
