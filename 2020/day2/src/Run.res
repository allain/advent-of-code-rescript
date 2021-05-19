@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let lines: array<string> = readFileSync("input.txt", "utf-8")->Js.String2.split("\n")

let parseRegex = %re("/^(\d+)-(\d+) ([a-z]): ([a-z]+)/")

exception InvalidLine(string)

type lineParse = (int, int, char, string)

let parseLine: string => lineParse = line => {
  let captures = switch Js.Re.exec_(parseRegex, line) {
  | None => raise(InvalidLine(line))
  | Some(result) =>
    Js.Re.captures(result)->Array.map(v =>
      switch Js.Nullable.toOption(v) {
      | None => "" // because the capture can be null, let's treat it as the empty string
      | Some(str) => str
      }
    )
  }

  (
    int_of_string(Array.getExn(captures, 1)),
    int_of_string(Array.getExn(captures, 2)),
    String.get(Array.getExn(captures, 3), 0),
    Array.getExn(captures, 4),
  )
}

let countValid: (array<string>, lineParse => bool) => int = (lines, policy) => {
  Js.Array2.reduce(
    lines,
    (count, line) => {
      policy(parseLine(line)) ? count + 1 : count
    },
    0,
  )
}

Js.log("Part A")
let validCount = countValid(lines, ((min, max, letter, password)) => {
  let count = Js.Array2.length(
    Js.Array2.filter(Js.String2.split(password, ""), c => String.get(c, 0) == letter),
  )

  count >= min && count <= max
})
Js.log(validCount)

Js.log("Part B")
let validCount = countValid(lines, ((n1, n2, letter, password)) => {
  let letter1 = String.get(password, n1 - 1)
  let letter2 = String.get(password, n2 - 1)

  letter2 != letter1 && (letter1 == letter || letter2 == letter)
})
Js.log(validCount)
