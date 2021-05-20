@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let rawPassports: array<string> = readFileSync("input.txt", "utf-8")->Js.String2.split("\n\n")

exception InvalidProp(string)
exception EmptyProp
exception InvalidHeight(string)

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
let between = (year, min, max) => year >= min && year <= max
let isColor = str => Js.Re.test_(%re("/^#[0-9a-f]{6}$/"), str)
let isPasspordId = str => Js.Re.test_(%re("/^[0-9]{9}$/"), str)

let hasAllRequired = passport => {
  let requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"] //, "cid"]
  let unknownFields = passport->Array.keep(((prop, _)) => !Js.Array2.includes(requiredFields, prop))
  let givenRequiredFieldCount = Array.length(passport) - Array.length(unknownFields)
  givenRequiredFieldCount == Array.length(requiredFields)
}

let fieldsValid = passport => {
  Array.every(passport, pair =>
    switch pair {
    | ("byr", value) => int_of_string(value)->between(1920, 2002)
    | ("iyr", value) => int_of_string(value)->between(2010, 2020)
    | ("eyr", value) => int_of_string(value)->between(2020, 2030)
    | ("hgt", value) =>
      switch Js.Re.exec_(%re("/(\d+)(cm|in)$/"), value) {
      | None => false
      | Some(result) => {
          let captures =
            Js.Re.captures(result)->Array.map(Js.Nullable.toOption)->Array.map(Option.getExn)

          switch captures[2] {
          | Some("cm") =>
            switch captures[1] {
            | None => raise(InvalidHeight(value))
            | Some(cmHeight) => between(int_of_string(cmHeight), 150, 193)
            }
          | Some("in") =>
            switch captures[1] {
            | None => raise(InvalidHeight(value))
            | Some(inHeight) => between(int_of_string(inHeight), 59, 76)
            }

          | _ => raise(InvalidHeight(value))
          }
        }
      }
    | ("hcl", value) => isColor(value)
    | ("ecl", value) =>
      Array.some(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"], clr => clr == value)
    | ("pid", pid) => isPasspordId(pid)
    | _ => true
    }
  )
}

let isPassportValid = passport => {
  hasAllRequired(passport) && fieldsValid(passport)
}

let validPassports = rawPassports->Array.map(parsePassport)->Array.keep(isPassportValid)

Js.log(Array.length(validPassports))
