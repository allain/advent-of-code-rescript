@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let numbers = readFileSync("input.txt", "utf-8")->Js.String2.split("\n")->Array.map(int_of_string)

let numbersSet = Set.Int.fromArray(numbers)

let findTwoThatSumTo: int => option<(int, int)> = total => {
  let first = numbers->Js.Array2.find(n => {
    switch Set.Int.get(numbersSet, total - n) {
    | Some(_) => true
    | None => false
    }
  })
  switch first {
  | None => None
  | Some(n) => Some((n, total - n))
  }
}

let findThreeThatSumTo: int => option<(int, int, int)> = total => {
  numbers->Js.Array2.reduce((result, n1) => {
    switch result {
    | None =>
      switch findTwoThatSumTo(total - n1) {
      | None => None
      | Some(n2, n3) => Some(n1, n2, n3)
      }
    | Some(r) => Some(r)
    }
  }, None)
}

Js.log("For Part A:")
switch findTwoThatSumTo(2020) {
| None => Js.log("not found")
| Some(n1, n2) => {
    Js.log2(n1, n2)
    Js.log(n1 * n2)
  }
}

Js.log("For Part B:")
switch findThreeThatSumTo(2020) {
| None => Js.log("not found")
| Some(n1, n2, n3) => {
    Js.log3(n1, n2, n3)
    Js.log(n1 * n2 * n3)
  }
}
