// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Fs from "fs";
import * as Js_math from "rescript/lib/es6/js_math.js";
import * as Belt_Array from "rescript/lib/es6/belt_Array.js";
import * as Caml_exceptions from "rescript/lib/es6/caml_exceptions.js";

var lines = Fs.readFileSync("input.txt", "utf-8").split("\n");

var InvalidLetter = /* @__PURE__ */Caml_exceptions.create("Run.InvalidLetter");

function parseSeat(code) {
  var id = Belt_Array.reduce(code.split(""), 0, (function (id, letter) {
          switch (letter) {
            case "F" :
            case "L" :
                return (id << 1);
            case "B" :
            case "R" :
                return (id << 1) + 1 | 0;
            default:
              throw {
                    RE_EXN_ID: InvalidLetter,
                    _1: letter,
                    Error: new Error()
                  };
          }
        }));
  var row = Js_math.floor_int(id / 8.0);
  var column = id % 8;
  return {
          id: id,
          row: row,
          column: column
        };
}

console.log(parseSeat("BFFFBBFRRR"));

console.log(Belt_Array.reduce(Belt_Array.map(lines, parseSeat), 0, (function (max, param) {
            return Math.max(max, param.id);
          })));

export {
  lines ,
  InvalidLetter ,
  parseSeat ,
  
}
/* lines Not a pure module */