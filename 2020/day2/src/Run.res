@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let lines: array<string> = readFileSync("input.txt", "utf-8")->Js.String2.split("\n")

let parseRegex = %re("/^(\d+)-(\d+) ([a-z]): ([a-z]+)/")

exception InvalidLine(string)

let invalids = Js.Array2.reduce(
  lines,
  (count, line) => {
    let invalid = switch Js.Re.exec_(parseRegex, line) {
    | None => raise(InvalidLine(line))
    | Some(result) => {
        let captures = Js.Re.captures(result)->Array.map(v =>
          switch Js.Nullable.toOption(v) {
          | None => ""
          | Some(str) => str
          }
        )
        let min = int_of_string(Array.getExn(captures, 1))
        let max = int_of_string(Array.getExn(captures, 2))
        let letter = Array.getExn(captures, 3)
        let password = Array.getExn(captures, 4)
        let count = Js.Array2.length(
          Js.Array2.filter(Js.String2.split(password, ""), c => c == letter),
        )

        count < min || count > max
      }
    }

    invalid ? count : count + 1
  },
  0,
)

Js.log(invalids)
