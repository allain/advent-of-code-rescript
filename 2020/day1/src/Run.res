@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let numbers = readFileSync("input.txt", "utf-8")->Js.String2.split("\n")->Array.map(int_of_string)

let numbersSet = Set.Int.fromArray(numbers)

let match = numbers->Js.Array2.find(n => {
  switch Set.Int.get(numbersSet, 2020 - n) {
  | Some(_) => true
  | None => false
  }
})

switch match {
| Some(n) => Js.Console.log3(n, 2020 - n, n * (2020 - n))
| None => Js.log("Not Found")
}
