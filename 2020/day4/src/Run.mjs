// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Fs from "fs";
import * as Belt_Array from "rescript/lib/es6/belt_Array.js";
import * as Belt_Option from "rescript/lib/es6/belt_Option.js";
import * as Caml_exceptions from "rescript/lib/es6/caml_exceptions.js";

var rawPassports = Fs.readFileSync("input.txt", "utf-8").split("\n\n");

var InvalidProp = /* @__PURE__ */Caml_exceptions.create("Run.InvalidProp");

var EmptyProp = /* @__PURE__ */Caml_exceptions.create("Run.EmptyProp");

function parsePassport(raw) {
  return Belt_Array.map(raw.split(/[\n ]+/), (function (prop) {
                if (prop !== undefined) {
                  var parts = prop.split(":");
                  return [
                          Belt_Option.getExn(Belt_Array.get(parts, 0)),
                          Belt_Option.getExn(Belt_Array.get(parts, 1))
                        ];
                }
                throw {
                      RE_EXN_ID: EmptyProp,
                      Error: new Error()
                    };
              }));
}

function isPassportValid(passport) {
  var requiredFields = [
    "byr",
    "iyr",
    "eyr",
    "hgt",
    "hcl",
    "ecl",
    "pid"
  ];
  var unknownFields = Belt_Array.keep(passport, (function (param) {
          return !requiredFields.includes(param[0]);
        }));
  var givenRequiredFieldCount = passport.length - unknownFields.length | 0;
  return givenRequiredFieldCount === requiredFields.length;
}

var validPassports = Belt_Array.keep(Belt_Array.map(rawPassports, parsePassport), isPassportValid);

console.log(validPassports.length);

export {
  rawPassports ,
  InvalidProp ,
  EmptyProp ,
  parsePassport ,
  isPassportValid ,
  validPassports ,
  
}
/* rawPassports Not a pure module */
