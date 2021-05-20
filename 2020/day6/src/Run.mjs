// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Fs from "fs";
import * as Belt_Array from "rescript/lib/es6/belt_Array.js";
import * as Belt_MapString from "rescript/lib/es6/belt_MapString.js";
import * as Belt_SetString from "rescript/lib/es6/belt_SetString.js";
import * as Caml_exceptions from "rescript/lib/es6/caml_exceptions.js";

var InvalidLetter = /* @__PURE__ */Caml_exceptions.create("Run.InvalidLetter");

var NoEmptySeat = /* @__PURE__ */Caml_exceptions.create("Run.NoEmptySeat");

var rawGroups = Fs.readFileSync("input.txt", "utf-8").split("\n\n");

function countAnswers(group) {
  return Belt_SetString.size(Belt_Array.reduce(group.split(""), Belt_SetString.fromArray([]), (function (answerSet, l) {
                    if (l === "\n") {
                      return answerSet;
                    } else {
                      return Belt_SetString.add(answerSet, l);
                    }
                  })));
}

var sum = Belt_Array.reduce(Belt_Array.map(rawGroups, countAnswers), 0, (function (sum, n) {
        return sum + n | 0;
      }));

console.log("Part A: " + String(sum));

function countAllYes(group) {
  var forms = group.split("\n");
  var formCount = forms.length;
  var answerCounts = Belt_Array.reduce(forms, Belt_MapString.fromArray([]), (function (counts, form) {
          return Belt_Array.reduce(form.split(""), counts, (function (counts, letter) {
                        return Belt_MapString.set(counts, letter, 1 + Belt_MapString.getWithDefault(counts, letter, 0) | 0);
                      }));
        }));
  return Belt_Array.keep(Belt_MapString.valuesToArray(answerCounts), (function (n) {
                return formCount === n;
              })).length;
}

var sum$1 = Belt_Array.reduce(Belt_Array.map(rawGroups, countAllYes), 0, (function (sum, n) {
        return sum + n | 0;
      }));

console.log("Part B: " + String(sum$1));

export {
  InvalidLetter ,
  NoEmptySeat ,
  rawGroups ,
  countAnswers ,
  countAllYes ,
  sum$1 as sum,
  
}
/* rawGroups Not a pure module */
