// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Fs from "fs";
import * as Int64 from "rescript/lib/es6/int64.js";
import * as Belt_Id from "rescript/lib/es6/belt_Id.js";
import * as Belt_Map from "rescript/lib/es6/belt_Map.js";
import * as Caml_obj from "rescript/lib/es6/caml_obj.js";
import * as Belt_List from "rescript/lib/es6/belt_List.js";
import * as Belt_Array from "rescript/lib/es6/belt_Array.js";
import * as Caml_int64 from "rescript/lib/es6/caml_int64.js";
import * as Caml_format from "rescript/lib/es6/caml_format.js";

var numbers = Belt_Array.map(Fs.readFileSync("input.txt", "utf-8").split("\n"), Caml_format.caml_int64_of_string);

var sortedNumbers = Belt_List.toArray(Belt_List.sort(Belt_List.fromArray(numbers), Caml_int64.compare));

var cmp = Caml_obj.caml_compare;

var IntComp = Belt_Id.MakeComparable({
      cmp: cmp
    });

function subInt(n1, n2) {
  return Caml_int64.sub(n1, Caml_int64.of_int32(n2));
}

function getSolutionRelative(sol, n, rel) {
  return Belt_Map.getWithDefault(sol, Caml_int64.sub(n, Caml_int64.of_int32(rel)), Int64.zero);
}

var sol = Belt_Map.make(IntComp);

var sol$1 = Belt_Map.set(sol, Int64.zero, Caml_int64.one);

function add3(n1, n2, n3) {
  return Caml_int64.add(Caml_int64.add(n1, n2), n3);
}

var sol$2 = Belt_Array.reduce(sortedNumbers, sol$1, (function (sol, line) {
        var sol$1 = Belt_Map.set(sol, line, Caml_int64.one);
        return Belt_Map.set(sol$1, line, add3(getSolutionRelative(sol$1, line, 1), getSolutionRelative(sol$1, line, 2), getSolutionRelative(sol$1, line, 3)));
      }));

var sums = Belt_Map.valuesToArray(sol$2);

function lastExn(arr) {
  return Belt_Array.getExn(arr, arr.length - 1 | 0);
}

console.log("Part B:");

console.log(Int64.to_string(Belt_Map.getExn(sol$2, lastExn(sortedNumbers))));

export {
  numbers ,
  sortedNumbers ,
  IntComp ,
  subInt ,
  getSolutionRelative ,
  add3 ,
  sol$2 as sol,
  sums ,
  lastExn ,
  
}
/* numbers Not a pure module */
