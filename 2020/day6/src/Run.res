@module("fs") external readFileSync: (string, string) => string = "readFileSync"

exception InvalidLetter(string)
exception NoEmptySeat
let rawGroups: array<string> = readFileSync("input.txt", "utf-8")->Js.String2.split("\n\n")

let countAnswers = group => {
  let answerSet =
    group
    ->Js.String2.split("")
    ->Array.reduce(Set.String.fromArray([]), (answerSet, l) =>
      switch l {
      | "\n" => answerSet
      | letter => Set.String.add(answerSet, letter)
      }
    )
  Set.String.size(answerSet)
}

let sum = rawGroups->Array.map(countAnswers)->Array.reduce(0, (sum, n) => sum + n)
Js.log(`Part A: ${string_of_int(sum)}`)
