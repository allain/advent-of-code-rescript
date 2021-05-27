@module("fs") external readFileSync: (string, string) => string = "readFileSync"

let numbers =
  readFileSync("input.txt", "utf-8")
  ->Js.String2.split("\n")
  ->Array.map(Float.fromString)
  ->Array.map(n => Option.getExn(n))

let queueLength = 25
let queue = Array.slice(numbers, ~offset=0, ~len=queueLength)
let numbers = Array.sliceToEnd(numbers, queueLength)

let pushValid: (array<float>, float) => option<array<float>> = (queue, n) => {
  if (
    Array.some(queue, a => {
      Array.some(queue, b => {
        // Js.log({"a": a, "b": b, "n": n, "a + b": a + b})
        a != b && a +. b == n
      })
    })
  ) {
    Js.Array.concat([n], queue->Array.sliceToEnd(1))->Some
  } else {
    None
  }
}

let result = Array.reduce(numbers, Some(queue), (queue, n) => {
  switch queue {
  | Some(queue) =>
    switch pushValid(queue, n) {
    | Some(newQueue) => Some(newQueue)
    | None => {
        Js.log(n)
        None
      }
    }
  | None => None
  }
})

let sumOf = ns => Array.reduce(ns, 0.0, (sum, n) => sum +. n)
let addOffset = (arr1: array<float>, arr2: array<float>, offset: int) =>
  Array.mapWithIndex(arr1, (i, n) => n +. Option.getWithDefault(arr2[i + offset], 0.0))

let foundIndex = ref(-1)
let foundLength = ref(-1)

let result = Array.makeBy(Array.length(numbers), i => i + 1)->Array.reduce(numbers, (
  summed,
  offset,
) => {
  let summed = addOffset(summed, numbers, offset)
  let indexOfSum = Array.getIndexBy(summed, n => n == 85848519.0)
  switch indexOfSum {
  | None => summed
  | Some(index) => {
      foundIndex.contents = index
      foundLength.contents = offset
      []
    }
  }
})

let sequence = Array.slice(numbers, ~offset=foundIndex.contents, ~len=foundLength.contents + 1)
let smallest = Array.reduce(sequence, Option.getExn(sequence[0]), (min, n) =>
  Js.Math.min_float(min, n)
)
let biggest = Array.reduce(sequence, Option.getExn(sequence[0]), (min, n) =>
  Js.Math.max_float(min, n)
)
Js.log(smallest +. biggest)
Js.log({"smallest": smallest, "biggest": biggest})
Js.log(sumOf(sequence))
Js.log(foundIndex.contents)
Js.log(foundLength.contents)
