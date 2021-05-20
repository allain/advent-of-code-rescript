@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let rawPassports: array<string> = readFileSync("input.txt", "utf-8")->Js.String2.split("\n\n")

exception InvalidProp(string)
exception EmptyProp

let parsePassport = raw => {
  raw
  ->Js.String2.splitByRe(%re("/[\\n ]+/"))
  ->Array.map(prop =>
    switch prop {
    | Some(prop) => {
        let parts = Js.String2.split(prop, ":")
        (Option.getExn(parts[0]), Option.getExn(parts[1]))
      }
    | None => raise(EmptyProp)
    }
  )
}

let isPassportValid = passport => {
  let requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"] //, "cid"]
  let unknownFields = passport->Array.keep(((prop, _)) => !Js.Array2.includes(requiredFields, prop))
  let givenRequiredFieldCount = Array.length(passport) - Array.length(unknownFields)
  givenRequiredFieldCount == Array.length(requiredFields)
}

let validPassports = rawPassports->Array.map(parsePassport)->Array.keep(isPassportValid)

Js.log(Array.length(validPassports))
