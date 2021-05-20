@module("fs") external readFileSync: (string, string) => string = "readFileSync"

exception InvalidLetter(string)
exception NoEmptySeat
let rawGroups: array<string> = readFileSync("input.txt", "utf-8")->Js.String2.split("\n\n")

// Counts the nubmer of unique answers given the group
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

// counts answers that all memebers of the group answered yes to
let countAllYes = group => {
  let forms = group->Js.String2.split("\n")
  let formCount = Array.length(forms)
  let answerCounts =
    forms->Array.reduce(Map.String.fromArray([]), (counts, form) =>
      Js.String2.split(form, "")->Array.reduce(counts, (counts, letter) =>
        Map.String.set(counts, letter, 1 + Map.String.getWithDefault(counts, letter, 0))
      )
    )

  Map.String.valuesToArray(answerCounts)->Array.keep(n => formCount === n)->Array.length
}

let sum = rawGroups->Array.map(countAllYes)->Array.reduce(0, (sum, n) => sum + n)

Js.log(`Part B: ${string_of_int(sum)}`)
