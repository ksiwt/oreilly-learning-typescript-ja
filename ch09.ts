// ======================================================================
// システム内で取りうるすべての値を表現できるトップ型（ユニバーサル型）

let anyValue: any;
anyValue = "Lucille Ball";
anyValue = 123;

console.log(anyValue);

function greetComedian(name: any) {
  // 型エラーはなし
  console.log(`Announcing ${name.toUpperCase()}!`);
}

greetComedian({ name: "Bea Arthur" });
// 実行時エラー: name.toUpperCaseは関数ではありません。

// ======================================================================
// unknown型
// すべてのオブジェクトを取ることができるが、anyと違ってunknown型の値プロパティにアクセスできない
// また、トップ型ではない型にはunkownを割り当てられない

// function greetComedian(name: unknown) {
//   console.log(`Announcing ${name.toUpperCase()}!`);
//   // 'name' is of type 'unknown'.
// }

// instanofやtypeopf、型アサーションでアクセスできる
function greetComedianSafety(name: unknown) {
  if (typeof name === "string") {
    console.log(`Announcing ${name.toUpperCase()}!`);
  } else {
    console.log("Well, I'm off.");
  }
}

greetComedianSafety("Betty White");
greetComedianSafety({});

// ======================================================================
// 型述語
// typeofなどは、関数外では型の絞り込みが失われるので型述語(パラメーター is 型)を使う
function isNumberOrString(value: unknown): value is number | string {
  return ["number", "string"].includes(typeof value);
}

function logValueIfExists(value: number | string | null | undefined) {
  if (isNumberOrString(value)) {
    value.toString();
  } else {
    console.log("Value does not exist", value);
  }
}

interface Comedian {
  funny: boolean;
}

interface StandupCommedian extends Comedian {
  routine: string;
}

function isStandupComedian(value: Comedian): value is StandupCommedian {
  return "routine" in value;
}

function workWithComedian(value: Comedian) {
  if (isStandupComedian(value)) {
    console.log(value.routine); // Ok
  }

  console.log(value.routine);
  // Property 'routine' does not exist on type 'Comedian'
}

// 型述語はfalseの場合でも型を絞り込むので注意
function isLongString(input: string | undefined): input is string {
  return !!(input && input.length >= 7);
}

function workWithText(text: string | undefined) {
  if (isLongString(text)) {
    console.log("Long text:", text.length);
  } else {
    // falseの場合
    console.log("Short text:" text?.length)
    // Property 'length' does not exist on type 'never'.
  }
}

// ======================================================================
// keyof
// 既存の型を受け取り、その型で許されるすべてのキーの合併型を返す演算子
interface Ratings {
    audience: number;
    critics: number;
}

function getRatingKeyof(ratings: Ratings, key: keyof Ratings): number {
    return ratings[key]; // Ok
}

const ratings: Ratings = {audience: 66, critics: 84};

getRatingKeyof(ratings, "audience") // Ok;

getRatingKeyof(ratings, "not valid")
// Argument of type '"not valid"' is not assignable to parameter of type 'keyof Ratings'


// ======================================================================
// typeof
// 与えられた値の型を返す（ランタイム演算子のtypeofとは異なる）

const original = {
    medium: "movie",
    titile: "Mean Girls"
}

let adaptation: typeof original;

if (Math.random() > 0.5) {
    adaptation = { ... original, medium: "play"}; // Ok
} else {
    adaptation = { ... original, medium: 2};
    // Type 'number' is not assignable to type 'string'.
}

// ======================================================================
// 型アサーション
const rawData = `["grace", "frankie"]`;

// 型:any
JSON.parse(rawData);

// 型:string[]
JSON.parse(rawData) as string[];

// 型:[string, string]
JSON.parse(rawData) as [string, string];

// 型:["grace", "frankie"]
JSON.parse(rawData) as ["grace", "frankie"]

// JavasCriptにコンパイルされると、型システムの構文は削除される

// ======================================================================
// 非nullアサーション
let maybeDate = Math.random() > 0.5 ? undefined : new Date();

maybeDate as Date;

// !（非nullアサーション）によって断言される型:Date
maybeDate!;

const seasonCounts = new Map([
    ["I Love Lucy", 6],
    ["The Golden Girls", 7]
]);

const maybeValue = seasonCounts.get("I Love Lucy");

console.log(maybeValue.toString());
// 'maybeValue' is possibly 'undefined'.

const knowValue = seasonCounts.get("I Love Lucy")!;

console.log(maybeValue?.toString());

// ======================================================================
interface Entertainer {
    acts: string[];
    name: string;
}

const declared: Entertainer = {
    name: "Moms Mabley",
};
// Error: Property 'acts' is missing in type

const asserted = {
    name: "Moms Mabley",
} as Entertainer; // Okですが...

// 次の2つの文はどちらも、次のエラーメッセージとともに実行時に失敗します
// Runtime TypeError: Cannot read properties of undefined (reading 'join')
// 実行時の型エラー：undefinedのプロパティを読み取れません（'join' の読み取り）

console.log(declared.acts.join(", "));
console.log(asserted.acts.join(", "));

// ======================================================================
let myValue = "Sealla!" as number;
// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.

let myValuDouble = "1337" as unknown as number; //Okだが、型に誤りがあるというサインなので悪手（避けるべき）

// ======================================================================
// 型：(number | string)[]
[0, ''];

// 型：readonly [0, '']
[0, ''] as const;

// ======================================================================
// 型：() => string
const getName = () => "Maria Bamford";

// 型：() => "Maria Bamford"
const getNameConst = () => "Maria Bamford" as const;

// ======================================================================
interface Joke {
    quote: string;
    style: "story" | "one-liner";
}

function tellJoke(joke: Joke) {
    if (joke.style === "one-liner") {
        console.log(joke.quote);
    } else {
        console.log(joke.quote.split("\n"));
    }
}

// 型：{ quote: string; style: "one-liner" }
// Joke型が要求される場所で使える、つまり値をより限定的な型に推論できるようにする
const narrowJoke = {
    quote: "If you stay alive for no other reason do it for spite.",
    style: "one-liner" as const,
};

tellJoke(narrowJoke); // Ok

// 型：{ quote: string; style: string }
const wideObject = {
    quote: "Time flies when you are anxious!",
    style: "one-liner",
};

tellJoke(wideObject);
// Error: Argument of type '{ quote: string; style: string; }'
// is not assignable to parameter of type 'Joke'.
//   Types of property 'style' are incompatible.
//     Type 'string' is not assignable to type '"story" | "one-liner"'.

// ======================================================================
// as constを使ってリテラル値を宣言すると、そのメンバープロパティはreadonlyとなる
function describePreference(preference: "maybe" | "no" | "yes") {
    switch (preference) {
        case "maybe":
            return "I suppose...";
        case "no":
            return "No thanks.";
        case "yes":
            return "Yes please!";
    }
}

// 型：{ movie: string, standup: string }
const preferencesMutable = {
    movie: "maybe",
    standup: "yes",
};

describePreference(preferencesMutable.movie);
// Error: Argument of type 'string' is not assignable
// to parameter of type '"maybe" | "no" | "yes"'.

preferencesMutable.movie = "no"; // Ok

// 型：readonly { readonly movie: "maybe", readonly standup: "yes" }
const preferencesReadonly = {
    movie: "maybe",
    standup: "yes",
} as const;

describePreference(preferencesReadonly.movie); // Ok

preferencesReadonly.movie = "no";
// Error: Cannot assign to 'movie' because it is a read-only property.