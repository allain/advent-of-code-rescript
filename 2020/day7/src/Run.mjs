// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Fs from "fs";
import * as Belt_Int from "rescript/lib/es6/belt_Int.js";
import * as Belt_Array from "rescript/lib/es6/belt_Array.js";
import * as Belt_Option from "rescript/lib/es6/belt_Option.js";
import * as Caml_option from "rescript/lib/es6/caml_option.js";
import * as Belt_SetString from "rescript/lib/es6/belt_SetString.js";
import * as Caml_exceptions from "rescript/lib/es6/caml_exceptions.js";

var InvalidLetter = /* @__PURE__ */Caml_exceptions.create("Run.InvalidLetter");

var NoEmptySeat = /* @__PURE__ */Caml_exceptions.create("Run.NoEmptySeat");

var rawRules = Fs.readFileSync("input.txt", "utf-8").split("\n");

var InvalidContent = /* @__PURE__ */Caml_exceptions.create("Run.InvalidContent");

function parseContent(content) {
  var result = /(\d+) (.*)/.exec(content);
  if (result !== null) {
    var captures = Belt_Array.map(result, (function (x) {
            return Belt_Option.getWithDefault((x == null) ? undefined : Caml_option.some(x), "");
          }));
    var count = Belt_Option.getExn(Belt_Int.fromString(Belt_Option.getExn(Belt_Array.get(captures, 1))));
    return {
            name: Belt_Option.getExn(Belt_Array.get(captures, 2)),
            count: count
          };
  }
  throw {
        RE_EXN_ID: InvalidContent,
        _1: content,
        Error: new Error()
      };
}

function parseRule(rawRule) {
  var parts = Belt_Array.map(rawRule.split(/ bags contain /, 2), Belt_Option.getExn);
  var name = Belt_Array.getExn(parts, 0);
  var contents = Belt_Array.map(Belt_Array.keep(Belt_Array.map(Belt_Array.getExn(parts, 1).split(/ bags?[,.]( |$)/), Belt_Option.getExn), (function (content) {
              if (content !== "no other") {
                return !/^\s*$/.test(content);
              } else {
                return false;
              }
            })), parseContent);
  return {
          name: name,
          contents: contents
        };
}

var rules = Belt_Array.map(rawRules, parseRule);

function parentsOf(bagName) {
  return Belt_Array.map(Belt_Array.keep(rules, (function (r) {
                    return Belt_Array.some(r.contents, (function (c) {
                                  return c.name === bagName;
                                }));
                  })), (function (r) {
                return r.name;
              }));
}

function allAncestorsOf(bagName) {
  var parents = parentsOf(bagName);
  return Belt_SetString.toArray(Belt_Array.reduce(parents, Belt_SetString.fromArray(parents), (function (ancestors, parentName) {
                    return Belt_Array.reduce(allAncestorsOf(parentName), ancestors, Belt_SetString.add);
                  })));
}

console.log("Part A:");

console.log(allAncestorsOf("shiny gold").length);

var InvalidBag = /* @__PURE__ */Caml_exceptions.create("Run.InvalidBag");

function sizeOf(bagName) {
  var rule = rules.find(function (r) {
        return r.name === bagName;
      });
  if (rule !== undefined) {
    return Belt_Array.reduce(rule.contents, 1, (function (size, c) {
                  return size + Math.imul(c.count, sizeOf(c.name)) | 0;
                }));
  }
  throw {
        RE_EXN_ID: InvalidBag,
        _1: bagName,
        Error: new Error()
      };
}

console.log("Part B:");

console.log(sizeOf("shiny gold") - 1 | 0);

export {
  InvalidLetter ,
  NoEmptySeat ,
  rawRules ,
  InvalidContent ,
  parseContent ,
  parseRule ,
  rules ,
  parentsOf ,
  allAncestorsOf ,
  InvalidBag ,
  sizeOf ,
  
}
/* rawRules Not a pure module */
