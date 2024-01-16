// ======================================================================
const elements = [true, null, undefined, 42];

elements.push("even", ["more"]);
// Argument of type '"even"' is not assignable to parameter of type 'number | boolean | null | undefined'.

// ======================================================================
const warriors = ["artemisia", "Boudica"];
warriors.push("Zenobia");
warriors.push(true);
// Argument of type 'boolean' is not assignable to parameter of type 'string'.

// ======================================================================
let arrayOfNumbers: number[];
arrayOfNumbers = [4, 8, 15, 16, 23, 42];

// ======================================================================
// 型は、stringの配列を返す関数
let createStrings: () => string[];

// 型は、それぞれがstingを返す関数の配列
let stringCreatirs: (() => string)[];

// ======================================================================
// 型は、numberの配列またはstring
let stringorArrayOfNumbers: string | number[];

// 型は、それぞれがstringまたはnumberである要素の配列
let arrayOfStringOfNumbers: (string | number)[];

// 型は(string | undefined)[]
const nameMayBe = ["Aqualtune", "Blenda", undefined];

// ======================================================================
// 型はany[]
let values = [];

// 型:string[]
values.push("");

// 型:(number | string)[]
values[0] = 0;

// ======================================================================
let arrayOfArrayOfNumbers: number[][];

arrayOfArrayOfNumbers = [
  [1, 2, 3],
  [2, 4, 6],
  [3, 6, 9],
];

// ======================================================================
const defenders = ["Clarenza", "Dina"];

// 型:string
const defender = defenders[0];

const soldiersOrDates = ["Deborah Sampson", new Date(1782, 6, 3)];

// 型:string | Date
const solidersOrDate = soldiersOrDates[0];

// ======================================================================
// デフォルトのコンパイラー設定では、何も型エラーがでない
function withElements(elements: string[]) {
  console.log(elements[9001].length); // 型エラーはなし
}

withElements(["It's", "over"]);

// ======================================================================
// 型:string[]
const soliders = ["Harriet Tubman", "Joan of Arc", "Khutulun"];

// 型:number[]
const soliderAges = [90, 19, 45];

// 型:(string | number)[]
const conjoined = [...soliders, ...soliderAges];

// ======================================================================
function logWarriors(greeting: string, ...names: string[]) {
  for (const name of names) {
    console.log(`${greeting}, ${name}`);
  }
}

const warriors = ["Cathay Williams", "Lozen", "Nzinga"];

const birthYears = [1844, 1848, 1583];

logWarriors("Born in", ...birthYears);
// Argument of type 'number' is not assignable to parameter of type 'string'.

// ======================================================================
let yearAndWarrior: [number, string];

yearAndWarrior = [530, "Tomyris"];

yearAndWarrior = [false, "Tomyris"];
// Type 'boolean' is not assignable to type 'number'.

yearAndWarrior = [530];
// Type '[number]' is not assignable to type '[number, string]'.
//   Source has 1 element(s) but target requires 2.

// year 型:number
// warrior 型:string
let [year, warrior] =
  Math.random() > 0.5 ? [340, "Archidama"] : [1828, "Rani of Jhansi"];

// ======================================================================
// 型:(boolean | number)[]
const pairLoose = [false, 123];

const pairTubleLoose: [boolean, number] = pairLoose;
// Type '(number | boolean)[]' is not assignable to type '[boolean, number]'.
//   Target requires 2 element(s) but source may have fewer.

const tupleThree: [boolean, number, string] = [false, 1583, "Nzinga"];

const tupleTwoExact: [boolean, number] = [tupleThree[0], tupleThree[1]];

const tupleTwoExtra: [boolean, number] = tupleThree;
// Type '[boolean, number, string]' is not assignable to type '[boolean, number]'.
//   Source has 3 element(s) but target allows only 2.

// ======================================================================
function logPair(name: string, value: number) {
  console.log(`${name} has ${value}`);
}

const pairArray = ["Amage", 1];

logPair(...pairArray);
// A spread argument must either have a tuple type or be passed to a rest parameter.

const pairTupleInCorrect: [number, string] = [1, "Amage"];
logPair(...pairTupleIncorrect);
// Argument of type 'number' is not assignable to parameter of type 'string'.

const pairTupleCorrect: [string, number] = ["Amage", 1];
logPair(...pairTupleCorrect); // Ok

// ======================================================================
function logTrio(name: string, value: [number, boolean]) {}

const trios: [string, [number, boolean]][] = [
  ["Amanitore", [1, true]],
  ["Alflead", [2, false]],
  ["Ann E. Dunwoody", [3, false]],
];

trios.forEach((trio) => logTrio(...trio)); // Ok

// string型であるlogTrioの最初のパラメーターに対して、[string, [number, boolean]]全体を渡そうとするため、エラーになる。
trios.forEach(logTrio);
// Argument of type '(name: string, value: [number, boolean]) => void' is not assignable to parameter of type '(value: [string, [number, boolean]], index: number, array: [string, [number, boolean]][]) => void'.
//   Types of parameters 'name' and 'value' are incompatible.
// Type '[string, [number, boolean]]' is not assignable to type 'string'.

// ======================================================================
// 戻り値の型:(string | number)[]
function firstCharAndSize(input: string) {
  return [input[0], input.length];
}

// firstChar 型:string | number;
// size 型:string | number
// const [firstChar, size] = firstCharAndSize("Gudit");

// ======================================================================
// 戻り値の型:[string, number]
function firstCharAndSizeExplicit(input: string): [string, number] {
  return [input[0], input.length];
}

// firstChar 型:string
// size　型:number
const [firstChar, size] = firstCharAndSizeExplicit("Cathy Williams");

// 型: (string | number)[]
const unionArray = [1157, "Tomoe"];

// 型: readonly [1157, "Tomoe"]
const readonlyTuple = [1157, "Tomoe"] as const;
// as const演算子によって、タプルとして扱うよう指示

const pairMutable: [number, string] = [1157, "Tomoe"];
pairMutable[0] = 1247; // Ok

const pairAlsoMutable: [number, string] = [1157, "Tomoe"] as const;
// 書籍だとエラーになるらしいが、ならない？

const pairConst = [1157, "Tomoe"] as const;
pairConst[0] = 1247;
// Cannot assign to '0' because it is a read-only property.

// ======================================================================
// 戻り値の型：readonly [string, number]
function firstCharAndSizeAsConst(input: string) {
  return [input[0], input.length] as const;
}

// firstChar 型：string
// size 型：number
const [firstChar, size] = firstCharAndSizeAsConst("Ching Shih");
