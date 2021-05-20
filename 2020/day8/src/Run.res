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

let rec tick = state => {
  if Set.Int.has(state.seen, state.pos) {
    state
  } else {
    switch statements[state.pos] {
    | Some({instruction: "nop"}) =>
      tick({
        pos: state.pos + 1,
        acc: state.acc,
        seen: Set.Int.add(state.seen, state.pos),
      })
    | Some({instruction: "acc", n}) =>
      tick({
        pos: state.pos + 1,
        acc: state.acc + n,
        seen: Set.Int.add(state.seen, state.pos),
      })
    | Some({instruction: "jmp", n}) =>
      tick({
        pos: state.pos + n,
        acc: state.acc,
        seen: Set.Int.add(state.seen, state.pos),
      })
    | Some({instruction}) => raise(InvalidInstruction(instruction))
    | None => raise(InvalidStatementIndex(state.pos))
    }
  }
}
Js.log(tick({pos: 0, acc: 0, seen: Set.Int.empty}))
