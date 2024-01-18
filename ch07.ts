// ======================================================================
// 以下の2つの構文はほとんど同じ。
type Poet = {
  born: number;
  name: string;
};

interface Poet {
  born: number;
  name: string;
}

let valueLater: Poet;

// Ok
valueLater = {
  born: 1935,
  name: "Sara Teasdale",
};

valueLater = "Emily Dickinson";
// Type 'string' is not assignable to type 'Poet'

valueLater = {
    born: true,
    // Type 'boolean' is not assignable to type 'number'.
    name "Sappho",
}

// ======================================================================
interface Book {
    author: string;
    pages: number;
}

// Ok
const ok: Book = {
    author: "Rita Dove",
    pages: 80,
}

const missing: Book = {
    author: "Rita Dove"
}
// Property 'pages' is missing in type '{ author: string; }' but required in type 'Book'.

// ======================================================================
interface Page {
    readonly text: string;
}

function read(page: Page) {
    // Ok: textプロパティの読み取りはそれを変更しようとはしないので
    console.log(page.text)

    page.text += "!";
    // Cannot assign to 'text' because it is a read-only property.
}

const pageIsh = {
    text: "Hello, world!"
}

// Ok: pageIshはPage型ではなく、書き込み可能なtextプロパティを持つ
// オブジェクト型と推論されます
pageIsh.text += "!";

// Ok: pageIshの型はPage型の要件を満たすため、
// readはpageIshを受け入れます
read(pageIsh)

// 明示的な型アノテーションを使うと、textプロパティはreadonlyになる
// const pageIsh: Page = {
//     text: "Hello, world!"
// }

// pageIsh.text += "!";

// ======================================================================
interface HasBothFunctionTypes {
    property: () => string
    method(): string;
}

const hasBoth: HasBothFunctionTypes = {
    property: () => "",
    method() {
        return ""
    }
}

hasBoth.property(); // Ok
hasBoth.method(); // Ok

interface OptionalReadonlyFuntions {
    optionalProperty?: () => string;
    optionalMethod?(): string;
}

// ======================================================================
type FunctionAlias = (input: string) => number;

interface CaallSignature {
    (input: string): number;
}

// 型: (input: string) => number
const typedFunctionAlies: FunctionAlias = (input) => input.length; // Ok

// 型: (input: string) => number
const typedCallSignature: CaallSignature = (input) => input.length; // Ok


// ======================================================================
interface FunctionWithCount {
    count: number;
    (): void;
}

let hasCallCount: FunctionWithCount;

function keepsTrackOfCalls() {
    keepsTrackOfCalls.count += 1;
    console.log(`I've been called ${keepsTrackOfCalls.count} times!`)
}

keepsTrackOfCalls.count = 0;

hasCallCount = keepsTrackOfCalls; // Ok

function doesNotHaveCount() {
    console.log("No idea!");
}

hasCallCount = doesNotHaveCount;
// Property 'count' is missing in type '() => void' but required in type 'FunctionWithCount'.

// ======================================================================
interface WordCounts {
    // インデックスシグネチャの構文
    // キーのあとに型を指定し、それを角括弧で囲みます
    [i: string]: number;
}

const counts: WordCounts = {};

counts.apple = 0; // Ok
counts.banana = 1; // Ok

counts.cherry = false;
// Type 'boolean' is not assignable to type 'number'.

interface DatesByName {
    [i: string]: Date;
}

const publishDates: DatesByName = {
    Frankenstein: new Date("1 January 1818"),
}

publishDates.Franklinstein; // 型:Date
console.log(publishDates.Frankenstein.toString); // Ok

publishDates.Breloved; // 型:Date、しかし実行時の値はundefined!
console.log(publishDates.Beloved.toString()); // 型システムではOkだがRuntimeエラーになる

// ======================================================================
interface HistoricalNovels {
    Oroonoko: number;
    [i: string]: number;
}

// Ok
const novels: HistoricalNovels = {
    Outlander: 1991,
    Oroonoko: 1688,
}

const missingOronnoko: HistoricalNovels = {
    Outlander: 1991,
}
// Property 'Oroonoko' is missing in type '{ Outlander: number; }' but required in type 'HistoricalNovels'. 

// ======================================================================
interface ChapterStarts {
    preface: 0;
    [i: string]: number;
}

const correctPreface: ChapterStarts = {
    preface: 0,
    night: 1,
    shopping: 5
}

const wrongPreface: ChapterStarts = {
    preface: 1,
    // Type '1' is not assignable to type '0'.
}

// ======================================================================
interface MoreNarrowNumbers {
    [i: number]: string;
    [i: string]: string | undefined
}

// Ok
const mixesNumbersAndStrings: MoreNarrowNumbers = {
    0: '',
    key1: '',
    key2: undefined
}

interface MoreNarrowStrings {
    [i: number]: string | undefined;
    // 'number' index type 'string | undefined' is not assignable to 'string' index type 'string'.
    [i: string]: string;
}

// ======================================================================
// ネストされたインターフェース
interface Novel {
    author: {
        name: string;
    };
    setting: Setting
}

interface Setting {
    place: string;
    year: number;
}

let myNovel: Novel;

// Ok
myNovel = {
    author: {
        name: "Jane Austen",
    },
    setting: {
        place: "Englande",
        year: 1812,
    }
}

myNovel = {
    author: {
        name: "Jane Austen",
    },
    setting: {
        place: "Englande",
    }
    // Property 'year' is missing in type '{ place: string; }' but required in type 'Setting'.
}

// ======================================================================
// インターフェースの拡張
interface MyWriting {
    title: string;
}

interface Novella extends MyWriting {
    pages: number;
}

// Ok
let myNovella: Novella = {
    pages: 195,
    title: "Ethan Frome",
}

let missingPages: Novella = {
    title: "The Awakening",
    // Property 'pages' is missing in type '{ title: string; }' but required in type 'Novella'.
}

let extraPropertye: Novella = {
    pages: 300,
    strategy: "baseline",
    // Object literal may only specify known properties, and 'strategy' does not exist in type 'Novella'.
    style: "Naturalism"
    // styleも存在しないプロパティなので割当不可
}

// ======================================================================
interface WithNullableName {
    name: string | null;
}

interface WithNonNullableName extends WithNullableName {
    name: string;
}

interface WithNumericName extends WithNonNullableName {
    name: number | string;

    // Interface 'WithNumericName' incorrectly extends interface 'WithNonNullableName'.
    //   Types of property 'name' are incompatible.
    //   Type 'string | number' is not assignable to type 'string'.
    // Type 'number' is not assignable to type 'string'.
}

// ======================================================================
// 複数インターフェースの拡張
interface GivesNumber {
    giveNumber(): number;
}

interface GivesString {
    giveString(): string;
}

interface GivesBothAndEither extends GivesNumber, GivesString {
    giveEither(): number | string;
}

function useGivesBoth(instance: GivesBothAndEither) {
    instance.giveEither(); // 型: number | string
    instance.giveNumber(); // 型: number
    instance.giveString(); // 型: string
}

// ======================================================================
// インターフェースのマージ

interface Merged {
    fromFirst: string;
}

interface Merged {
    fromSecond: string
}

// コードを理解するのが難しくなるので、できれば使うことを避ける

interface Window {
    myEnvironmentValiable: string;
}

window.myEnvironmentValiable; // 型string


// ======================================================================

interface MergedProperties {
    same: (input: boolean) => string;
    different: (input: string) => string;
}

interface MergedProperties {
    same: (input: boolean) => string;
    different: (input: number) => string;
    // Subsequent property declarations must have the same type.  Property 'different' must be of type '(input: string) => string', but here has type '(input: number) => string'.
    // すでに宣言されている場合、異なる型は定義できない
}

interface MergedMethods {
    different(input: string): string;
}

interface MergedMethods {
    different(input: number): string; // Ok
    // 名前が同じでシグネチャが異なるメソッドは定義できる
}