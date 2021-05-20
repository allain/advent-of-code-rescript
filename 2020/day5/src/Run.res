@module("fs") external readFileSync: (string, string) => string = "readFileSync"

exception InvalidLetter(string)
exception NoEmptySeat

let lines: array<string> = readFileSync("input.txt", "utf-8")->Js.String2.split("\n")

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

let seats = lines->Array.map(parseSeat)

let maxId = seats->Array.reduce(0, (max, {id}) => Js.Math.max_int(max, id))

Js.log(`Part A: ${string_of_int(maxId)}`)

let minId = seats->Array.reduce(maxId, (max, {id}) => Js.Math.min_int(max, id))

let seatIdsSet = Set.Int.fromArray(seats->Array.map(({id}) => id))

let possibleIds = Array.makeBy(maxId - minId + 1, n => n + minId)

let emptySeats =
  possibleIds->Array.keep(id =>
    !Set.Int.has(seatIdsSet, id) &&
    Set.Int.has(seatIdsSet, id - 1) &&
    Set.Int.has(seatIdsSet, id + 1)
  )
switch emptySeats[0] {
| None => raise(NoEmptySeat)
| Some(id) => Js.log(`Part B: ${string_of_int(id)}`)
}
