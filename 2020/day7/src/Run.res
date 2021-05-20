@module("fs") external readFileSync: (string, string) => string = "readFileSync"

exception InvalidLetter(string)
exception NoEmptySeat
let rawRules: array<string> = readFileSync("input.txt", "utf-8")->Js.String2.split("\n")

exception InvalidContent(string)

type parsedContent = {name: string, count: int}

let parseContent: string => parsedContent = content => {
  switch Js.Re.exec_(%re("/(\d+) (.*)/"), content) {
  | None => raise(InvalidContent(content))
  | Some(result) => {
      let captures =
        Js.Re.captures(result)->Array.map(x => x->Js.Nullable.toOption->Option.getWithDefault(""))

      let count = captures[1]->Option.getExn->Int.fromString->Option.getExn

      {
        name: Option.getExn(captures[2]),
        count: count,
      }
    }
  }
}

type parsedRule = {name: string, contents: array<parsedContent>}

let parseRule: string => parsedRule = rawRule => {
  let parts =
    Js.String2.splitByReAtMost(rawRule, %re("/ bags contain /"), ~limit=2)->Array.map(Option.getExn)
  let name = parts->Array.getExn(0)
  let contents =
    parts
    ->Array.getExn(1)
    ->Js.String2.splitByRe(%re("/ bags?[,.]( |$)/"))
    ->Array.map(Option.getExn)
    ->Array.keep(content => content != "no other" && !Js.Re.test_(%re("/^\s*$/"), content))
    ->Array.map(parseContent)

  {
    name: name,
    contents: contents,
  }
}

let rules = rawRules->Array.map(parseRule)

let parentsOf = bagName =>
  rules->Array.keep(r => Array.some(r.contents, c => c.name === bagName))->Array.map(r => r.name)

let rec allAncestorsOf = bagName => {
  let parents = parentsOf(bagName)
  parents
  ->Array.reduce(Set.String.fromArray(parents), (ancestors, parentName) => {
    allAncestorsOf(parentName)->Array.reduce(ancestors, (ancestors, p) =>
      Set.String.add(ancestors, p)
    )
  })
  ->Set.String.toArray
}

Js.log("Part A:")
Js.log(Array.length(allAncestorsOf("shiny gold")))

exception InvalidBag(string)
let rec sizeOf = bagName => {
  switch Js.Array2.find(rules, r => r.name == bagName) {
  | None => raise(InvalidBag(bagName))
  | Some(rule) => Array.reduce(rule.contents, 1, (size, c) => size + c.count * sizeOf(c.name))
  }
}
Js.log("Part B:")
Js.log(sizeOf("shiny gold") - 1)
