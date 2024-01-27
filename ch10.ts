// ======================================================================
function identity<T>(input: T) {
  return input;
}

const stringy = identity("me"); // 型: "me"
const numeric = identity(123); // 型: 123

// ======================================================================
function logWrapper<Input>(callback: (input: Input) => void) {
  return (input: Input) => {
    console.log("Input:", input);
    callback(input);
  };
}

// logWrapper((input) => {
//   console.log(input.length);
//   //   'input' is of type 'unknown'
// });

// 型: (input: string) => void
logWrapper<string>((input) => {
  console.log(input.length);
});

// logWrapper<string>((input: boolean) => {});
// rgument of type '(input: boolean) => void' is not assignable to parameter of type '(input: string) => void'.
//   Types of parameters 'input' and 'input' are incompatible.
// Type 'string' is not assignable to type 'boolean'.

// ======================================================================
function makeTuple<First, Second>(first: First, second: Second) {
  return [first, second] as const;
}

let tuple = makeTuple(true, "abc");

function makePair<Key, Value>(key: Key, value: Value) {
  return { key, value };
}

// string, number
makePair("abc", 123);

// strgng, number
makePair<string, number>("abc", 123);
// "abc", 123
makePair<"abc", 123>("abc", 123);

// Expected 2 type arguments, but got 1.
// makePair<string>("abc", 123);

// ======================================================================
// ジェネリックインターフェース
interface Box<T> {
  inside: T;
}

let stringyBox: Box<string> = {
  inside: "abc",
};

let numberBox: Box<number> = {
  inside: 123,
};

// let incorrectBox: Box<number> = {
//   inside: false,
//   Type 'boolean' is not assignable to type 'number'.
// };

// ======================================================================
interface LinkedNode<Value> {
  next?: LinkedNode<Value>;
  value: Value;
}

function getLast<Value>(node: LinkedNode<Value>): Value {
  return node.next ? getLast(node.next) : node.value;
}

let lastDate = getLast({
  value: new Date("09-13-1993"),
});

let lastFruit = getLast({
  next: {
    value: "banana",
  },
  value: "apple",
});

// let lastMismatch = getLast({
//   next: {
//     value: 123,
//   },
//   value: false,
// //   Type 'boolean' is not assignable to type 'number'.
// });

interface CreateLike<T> {
  contents: T;
}

// let missingGeneric: CreateLike = {
// Generic type 'CreateLike<T>' requires 1 type argument(s).
//   contents: "??",
// };

// ======================================================================
// ジェネリッククラス
class Secret<Key, Value> {
  key: Key;
  value: Value;

  constructor(key: Key, value: Value) {
    this.key = key;
    this.value = value;
  }

  getValue(key: Key): Value | undefined {
    return this.key === key ? this.value : undefined;
  }
}

const storage = new Secret(1234, "luggage"); // Secret<number, string>

storage.getValue(1987);
// ======================================================================

class CurriedCallback<Input> {
  #callback: (input: Input) => void;

  constructor(callback: (input: Input) => void) {
    this.#callback = (input: Input) => {
      console.log("Input:", input);
      callback(input);
    };
  }
}

new CurriedCallback((input: string) => {
  console.log(input.length);
});

// new CurriedCallback((input) => {
//   console.log(input.length);
//   // 'input' is of type 'unknown'.
// });

// ======================================================================
class MyQuote<T> {
  lines: T;

  constructor(lines: T) {
    this.lines = lines;
  }
}

class SpokenMyQuote extends MyQuote<string[]> {
  speak() {
    console.log(this.lines.join("\n"));
  }
}

new MyQuote("The only real failure is the failure to try.").lines;
new MyQuote([4, 8, 15, 16, 23, 42]).lines;

new SpokenMyQuote(["Greed is so destructive", "It destroys everythin"]).lines;

// new SpokenMyQuote([4, 8, 15, 16, 23, 42]);
// Type 'number' is not assignable to type 'string'.

class AttributedQuote<Value> extends MyQuote<Value> {
  speaker: string;

  constructor(value: Value, speaker: string) {
    super(value);
    this.speaker = speaker;
  }
}

new AttributedQuote(
  "The road to success is always under construction.",
  "Lily Tomlin"
);
// ======================================================================
interface ActingCredit<Role> {
  role: Role;
}

class MoviePart implements ActingCredit<string> {
  role: string;
  speaking: boolean;

  constructor(role: string, speaking: boolean) {
    this.role = role;
    this.speaking = speaking;
  }
}

const part = new MoviePart("Miranda Priestly", true);

part.role;

// class IncorrectExtension implements ActingCredit<string> {
//   role: boolean;
//   //   Property 'role' in type 'IncorrectExtension' is not assignable to the same property in base type 'ActingCredit<string>'.
//   //   Type 'boolean' is not assignable to type 'string'.
// }

// ======================================================================
class CreatePairFactory<Key> {
  key: Key;

  constructor(key: Key) {
    this.key = key;
  }

  createPair<Value>(value: Value) {
    return { key: this.key, value };
  }
}

const factory = new CreatePairFactory("role");

const numeberPair = factory.createPair(10);

const stringPair = factory.createPair("Sophie");
// ======================================================================

class BothLogger<OnInstance> {
  instanceLog(value: OnInstance) {
    console.log(value);
    return value;
  }

  static staticLog<OnStatic>(value: OnStatic) {
    // let fromInstance: OnsInstance;
    // Cannot find name 'OnsInstance'.

    console.log(value);
    return value;
  }
}

const logger = new BothLogger<number[]>();
logger.instanceLog([1, 2, 3]);

BothLogger.staticLog([false, true]);

BothLogger.staticLog<string>("You can't chnge the music of your soul.");

// ======================================================================
type Nullish<T> = T | null | undefined;

type CreatesValue<Input, Output> = (input: Input) => Output;

let creator: CreatesValue<string, number>;

creator = (text) => text.length;

// creator = (text) => text.toUpperCase;
// Type '() => string' is not assignable to type 'number'.

// ======================================================================

type Result<Data> = FailureResult | SuccessfulResult<Data>;

interface FailureResult {
  error: Error;
  succeeded: false;
}

interface SuccessfulResult<Data> {
  data: Data;
  succeeded: true;
}

function handleResult(result: Result<string>) {
  if (result.succeeded) {
    console.log(`We dit it! ${result.data}`);
  } else {
    console.error(`Awww... ${result.error}`);
  }
  //   result.data;
  //   Property 'data' does not exist on type 'Result<string>'.
  //   Property 'data' does not exist on type 'FailureResult'
}

// ======================================================================
// ジェネリック修飾子
interface Qt<T = string> {
  value: T;
}

let explicit: Qt<number> = { value: 123 };

let implicit: Qt = { value: "Be youreself" };

// let mismatch: Qt = { value: 123 };
// Type 'number' is not assignable to type 'string'.

// ======================================================================
interface KeyValuPair<Key, Value = Key> {
  key: Key;
  value: Value;
}

let allExplicit: KeyValuPair<string, number> = {
  key: "rating",
  value: 10,
};

let oneDefaulting: KeyValuPair<string> = {
  key: "rating",
  value: "ten",
};

// let firstMissing: KeyValuPair = {
//   //   Generic type 'KeyValuPair<Key, Value>' requires between 1 and 2 type arguments.
//   key: "rating",
//   value: 10,
// };

function inTheEnd<First, Second, Third = number, Fourth = string>() {}

// function inTheMiddle<First, Scond = boolean, Third = number, Fourth>() {}
// Required type parameters may not follow optional type parameters.
// デフォルト型を持つジェネリック型のほうが後に宣言されないと型エラーとなる。

// ======================================================================
// 制約付きジェネリック型
interface WithLength {
  length: number;
}

// length.numerを持つ任意の型を受け取れる
function logWithLength<T extends WithLength>(input: T) {
  console.log(`Length: ${input.length}`);
  return input;
}

logWithLength("No one can figure out your worth but you.");
logWithLength([false, true]);
logWithLength({ length: 123 });

// logWithLength(new Date());
//Argument of type 'Date' is not assignable to parameter of type 'WithLength'.
//   Property 'length' is missing in type 'Date' but required in type 'WithLength'.

// ======================================================================
function get<T, Key extends keyof T>(container: T, key: Key) {
  return container[key];
}

const roles = {
  favorite: "Fargo",
  others: ["Almost Famous", "burn After Reading", "Nomandland"],
};

const favorite = get(roles, "favorite");

const others = get(roles, "others");

// const missing = get(roles, "extras");
// Argument of type '"extras"' is not assignable to parameter of type '"favorite" | "others"'.

// ======================================================================
const resolveUnknown = new Promise((resolve) => {
  setTimeout(() => resolve("Done!"), 1000);
});

const resolveString = new Promise<string>((resolve) => {
  setTimeout(() => resolve("Done!"), 1000);
});

const textEventually = new Promise<string>((resolve) => {
  setTimeout(() => resolve("Done"), 1000);
});

const lengthEventually = textEventually.then((text) => text.length);
// ======================================================================

async function lengthAfterSecond(text: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return text.length;
}

async function lengghImemdiately(text: string) {
  return text.length;
}

// ======================================================================
