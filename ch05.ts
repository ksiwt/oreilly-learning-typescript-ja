// ======================================================================
function sing(song: string) {
  console.log(`Singing: ${song}!`);
}

// ======================================================================
function singTwo(first: string, second: string) {
  console.log(`${first} / ${second}`);
}

singTwo("Ball and Chain");
// Expected 2 arguments, but got 1.

// ======================================================================
function announceSong(song: string, singer?: string) {
  console.log(`Song: ${song}`);

  if (singer) {
    console.log(`Singer: ${sing}`);
  }
}

announceSong("Greensleeves"); // Ok
announceSong("Greensleeves", undefined); // Ok
announceSong("Chandelier", "Sia"); //Ok

function announceSongBy(song: string, singer: string | undefined) {
  console.log(`Song: ${song}`);

  if (singer) {
    console.log(`Singer: ${sing}`);
  }
}

announceSongBy("Greensleeves");
// Expected 2 arguments, but got 1.

announceSong("Greensleeves", undefined); // Ok
announceSong("Chandelier", "Sia"); // Ok

// ======================================================================

function rateSong(song: string, rating = 0) {
  console.log(`${song} gets ${rating}/5 stars!`);
}

rateSong("Photograph"); // Ok
rateSong("Set Fire to the Rain", 5); // Ok
rateSong("Set Fire to the Rain", undefined); // Ok

rateSong("At Last!", "100");
// Argument of type 'string' is not assignable to parameter of type 'number'.

// ======================================================================
function singAllTheSongs(singer: string, ...songs: string[]) {
  for (const song of songs) {
    console.log(`%{song}, by ${singer}`);
  }
}

singAllTheSongs("Alicia Keys"); // Ok
singAllTheSongs("Lady Gaga", "Bad Romance", "Just Dance", "Poker Face"); // Ok

singAllTheSongs("Ella Fitzgerald", 2000);
// Argument of type 'number' is not assignable to parameter of type 'string'.

// ======================================================================
// 型:(songs: string[]) => number
function singSongs(songs: string[]) {
  for (const song of songs) {
    console.log(`${song}`);
  }

  return songs.length;
}

// 型: (songs: string[], index: number) => string | undefined
function getSongAt(songs: string[], index: number) {
  return index < songs.length ? songs[index] : undefined;
}

function singSongsRecursive(songs: string[], count = 0): number {
  return songs.length ? singSongsRecursive(songs.slice(1), count + 1) : count;
}

function getSongRecordingDate(song: string): Date | undefined {
  switch (song) {
    case "Strange Fruit":
      return new Date("April 20, 1939"); // Ok

    case "Greensleeves":
      return "unknown";
    // Type 'string' is not assignable to type 'Date'.

    default:
      return undefined; // Ok
  }
}

// ======================================================================
// ======================================================================
let nothingInGivesString: () => string;

// ======================================================================
let inputAndOutput: (songs: string[], count?: number) => number;

// ======================================================================
const songs = ["Juice", "Shake It Off", "What's Up"];

function runOnSongs(getSongAt: (index: number) => string) {
  for (let i = 0; i < songs.length; i += 1) {
    console.log(getSongAt(i));
  }
}

function getSongAt(index: number) {
  return `${songs[index]}`;
}

runOnSongs(getSongAt); // Ok

function logSong(song: string) {
  return `${song}`;
}

runOnSongs(logSong);
// Argument of type '(song: string) => string' is not
// assignable to parameter of type '(index: number) => string'.
//   Types of parameters 'song' and 'index' are incompatible.
//     Type 'number' is not assignable to type 'string'.

// ======================================================================
// 型は、string | undefinedという合併型を返す関数
let returnsStringOrUndefined: () => string | undefined;

// 型は、stringを返す関数またはundefined
let maybeReturnsString: (() => string) | undefined;

// ======================================================================
let singer: (song: string) => string;

singer = function (song) {
  // songの型：string
  return `Singing: ${song.toUpperCase()}!`; // Ok
};

// ======================================================================
const songs = ["Call Me", "Jolene", "The Chain"];

// song: string
// index: number
songs.forEach((song, index) => {
  console.log(`${song} is at index ${index}`);
});

// ======================================================================
type StringToNumber = (input: string) => number;

let stringToNumber: StringToNumber;

stringToNumber = (input) => input.length; // Ok

stringToNumber = (input) => input.toUpperCase();
//                          ~~~~~~~~~~~~~~~~~~~
// Type 'string' is not assignable to type 'number'.

// ======================================================================
type NumberToString = (input: number) => string;

function usesNumberToString(numberToString: NumberToString) {
  console.log(`The string is: ${numberToString(1234)}`);
}

usesNumberToString((input) => `${input}! Hooray!`); // Ok

usesNumberToString((input) => input * 2);
// Type 'number' is not assignable to type 'string'.

// ======================================================================
function logSong(song: string | undefined): void {
  if (!song) {
    return; // Ok
  }

  console.log(`${song}`);

  return true;
  // Error: Type 'boolean' is not assignable to type 'void'.
}

// ======================================================================
let songLogger: (song: string) => void;

songLogger = (song) => {
  console.log(`${song}`);
};

songLogger("Heart of Glass"); // Ok

// ======================================================================
function returnsVoid() {
  return;
}

let lazyValue: string | undefined;

lazyValue = returnsVoid();
// Type 'void' is not assignable to type 'string | undefined'.

// ======================================================================
const records: string[] = [];

function saveRecords(newRecords: string[]) {
  newRecords.forEach((record) => records.push(record));
}

saveRecords(["21", "Come On Over", "The Bodyguard"]);

// ======================================================================
function fail(message: string): never {
  throw new Error(`Invariant failure: ${message}.`);
}

function workWithUnsafeParam(param: unknown) {
  if (typeof param !== "string") {
    fail(`param should be a string, not ${typeof param}`);
  }

  // ここでは、paramがstring型であることがわかっています
  param.toUpperCase(); // Ok
}

// ======================================================================
function createDate(timestamp: number): Date;
function createDate(month: number, day: number, year: number): Date;
function createDate(monthOrTimestamp: number, day?: number, year?: number) {
  return day === undefined || year === undefined
    ? new Date(monthOrTimestamp)
    : new Date(year, monthOrTimestamp, day);
}

createDate(554356800); // Ok
createDate(7, 27, 1987); // Ok

createDate(4, 1);
// No overload expects 2 arguments, but overloads
// do exist that expect either 1 or 3 arguments.

// ======================================================================
function format(data: string): string; // Ok
function format(data: string, needle: string, haystack: string): string; // Ok

function format(getData: () => string): string;
// This overload signature is not compatible with its implementation signature.

function format(data: string, needle?: string, haystack?: string) {
  return needle && haystack ? data.replace(needle, haystack) : data;
}
