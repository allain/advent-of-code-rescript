@module("fs") external readFileSync: (string, string) => string = "readFileSync"

exception InvalidLetter(string)
exception NoEmptySeat

exception InvalidInstruction(string)
exception InvalidStatement(string)
exception InvalidStatementIndex(int)

type parsedStatement = {instruction: string, n: int}

let parseStatement: string => parsedStatement = raw => {
  switch Js.Re.exec_(%re("/(acc|jmp|nop) ([-+])([0-9]+)$/"), raw) {
  | None => raise(InvalidStatement(raw))
  | Some(result) => {
      let captures =
        Js.Re.captures(result)->Array.map(x => x->Js.Nullable.toOption->Option.getWithDefault(""))

      let n = captures[3]->Option.getExn->Int.fromString->Option.getExn
      let n = switch captures[2]->Option.getExn {
      | "+" => n
      | _ => -n
      }
      let instruction = captures[1]->Option.getExn

      {
        instruction: instruction,
        n: n,
      }
    }
  }
}

let statements =
  readFileSync("input.txt", "utf-8")->Js.String2.split("\n")->Array.map(parseStatement)

type state = {
  pos: int,
  acc: int,
  seen: Set.Int.t,
}

let rec tick = (state, statements) => {
  if Set.Int.has(state.seen, state.pos) {
    state
  } else {
    switch statements[state.pos] {
    | Some({instruction: "nop"}) =>
      tick(
        {
          pos: state.pos + 1,
          acc: state.acc,
          seen: Set.Int.add(state.seen, state.pos),
        },
        statements,
      )

    | Some({instruction: "acc", n}) =>
      tick(
        {
          pos: state.pos + 1,
          acc: state.acc + n,
          seen: Set.Int.add(state.seen, state.pos),
        },
        statements,
      )
    | Some({instruction: "jmp", n}) =>
      tick(
        {
          pos: state.pos + n,
          acc: state.acc,
          seen: Set.Int.add(state.seen, state.pos),
        },
        statements,
      )
    | Some({instruction}) => raise(InvalidInstruction(instruction))
    | None => state
    }
  }
}

Js.log("Part A:")
Js.log(tick({pos: 0, acc: 0, seen: Set.Int.empty}, statements).acc)

let index = statements->Js.Array2.findIndexi((statement, i) => {
  if statement.instruction != "jmp" {
    false
  } else {
    let set = statements[i] = {
      instruction: "nop",
      n: 0,
    }
    switch set {
    | true => {
        let state = tick({pos: 0, acc: 0, seen: Set.Int.empty}, statements)
        let terminated = state.pos >= Array.length(statements)
        let _ = statements[i] = statement
        terminated
      }
    | false => false
    }
  }
})

if statements[index] = {instruction: "nop", n: 0} {
  Js.log("Part B:")
  Js.log(tick({pos: 0, acc: 0, seen: Set.Int.empty}, statements).acc)
}
