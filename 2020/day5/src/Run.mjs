// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Fs from "fs";
import * as Js_math from "rescript/lib/es6/js_math.js";
import * as Belt_Array from "rescript/lib/es6/belt_Array.js";
import * as Belt_SetInt from "rescript/lib/es6/belt_SetInt.js";
import * as Caml_exceptions from "rescript/lib/es6/caml_exceptions.js";

var InvalidLetter = /* @__PURE__ */Caml_exceptions.create("Run.InvalidLetter");

var NoEmptySeat = /* @__PURE__ */Caml_exceptions.create("Run.NoEmptySeat");

var lines = Fs.readFileSync("input.txt", "utf-8").split("\n");

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

var seats = Belt_Array.map(lines, parseSeat);

var maxId = Belt_Array.reduce(seats, 0, (function (max, param) {
        return Math.max(max, param.id);
      }));

console.log("Part A: " + String(maxId));

var minId = Belt_Array.reduce(seats, maxId, (function (max, param) {
        return Math.min(max, param.id);
      }));

var seatIdsSet = Belt_SetInt.fromArray(Belt_Array.map(seats, (function (param) {
            return param.id;
          })));

var possibleIds = Belt_Array.makeBy((maxId - minId | 0) + 1 | 0, (function (n) {
        return n + minId | 0;
      }));

var emptySeats = Belt_Array.keep(possibleIds, (function (id) {
        if (!Belt_SetInt.has(seatIdsSet, id) && Belt_SetInt.has(seatIdsSet, id - 1 | 0)) {
          return Belt_SetInt.has(seatIdsSet, id + 1 | 0);
        } else {
          return false;
        }
      }));

var id = Belt_Array.get(emptySeats, 0);

if (id !== undefined) {
  console.log("Part B: " + String(id));
} else {
  throw {
        RE_EXN_ID: NoEmptySeat,
        Error: new Error()
      };
}

export {
  InvalidLetter ,
  NoEmptySeat ,
  lines ,
  parseSeat ,
  seats ,
  maxId ,
  minId ,
  seatIdsSet ,
  possibleIds ,
  emptySeats ,
  
}
/* lines Not a pure module */
