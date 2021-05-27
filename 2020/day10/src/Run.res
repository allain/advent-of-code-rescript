@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let numbers = readFileSync("input.txt", "utf-8")->Js.String2.split("\n")->Array.map(Int64.of_string)

let sortedNumbers = List.toArray(List.sort(List.fromArray(numbers), compare))

module IntComp = Id.MakeComparable({
  type t = int64
  let cmp = compare
})

// helpers to make working with Int64 less annoying
let subInt = (n1, n2) => Int64.sub(n1, Int64.of_int(n2))
let getSolutionRelative = (sol, n, rel) => Map.getWithDefault(sol, subInt(n, rel), Int64.zero)
let sol = Map.make(~id=module(IntComp))
let sol = Map.set(sol, Int64.zero, Int64.of_int(1))
let add3 = (n1, n2, n3) => Int64.add(Int64.add(n1, n2), n3)

let sol = sortedNumbers->Array.reduce(sol, (sol, line) => {
  let sol = Map.set(sol, line, Int64.of_int(1))
  Map.set(
    sol,
    line,
    add3(
      getSolutionRelative(sol, line, 1),
      getSolutionRelative(sol, line, 2),
      getSolutionRelative(sol, line, 3),
    ),
  )
})

let sums = Map.valuesToArray(sol)
let lastExn = arr => Array.getExn(arr, Array.length(arr) - 1)

Js.log("Part B:")
Js.log(Int64.to_string(Map.getExn(sol, lastExn(sortedNumbers))))
