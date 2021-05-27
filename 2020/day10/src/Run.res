@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let numbers = readFileSync("input.txt", "utf-8")->Js.String2.split("\n")->Array.map(Int64.of_string)

let sortedNumbers = List.toArray(List.sort(List.fromArray(numbers), compare))

module IntComp = Id.MakeComparable({
  type t = int64
  let cmp = compare
})

// helpers to make working with Int64 less annoying
let subInt = (n1, n2) => Int64.sub(n1, Int64.of_int(n2))
let getSolutionAtIndex = (sol, n) => Map.getWithDefault(sol, n, Int64.zero)

let sol = Map.make(~id=module(IntComp))
let sol = Map.set(sol, Int64.zero, Int64.of_int(1))

let sol = sortedNumbers->Array.reduce(sol, (sol, line) => {
  let sol = Map.set(sol, line, Int64.of_int(1))
  Map.set(
    sol,
    line,
    // Add the last 3 items in the solution
    Int64.add(
      Int64.add(getSolutionAtIndex(sol, subInt(line, 1)), getSolutionAtIndex(sol, subInt(line, 2))),
      getSolutionAtIndex(sol, subInt(line, 3)),
    ),
  )
})

let sums = Map.valuesToArray(sol)
let lastExn = arr => Array.getExn(arr, Array.length(arr) - 1)

Js.log("Part B:")
Js.log(Int64.to_string(Map.getExn(sol, lastExn(sortedNumbers))))
