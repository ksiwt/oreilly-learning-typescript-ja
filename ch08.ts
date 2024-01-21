// ======================================================================

class Greeter {
  greet(name: string) {
    console.log(`${name}, do your stuff!`);
  }
}

new Greeter().greet("Miss Frizzle"); // Ok

new Greeter().greet();
// Expected 1 arguments, but got 0.

class Greeted {
  constructor(message: string) {
    console.log(`As I always say: ${message}!`);
  }
}

new Greeted("take chances, make mistakes, get messy");

new Greeted();
// Expected 1 arguments, but got 0.

// ======================================================================

class FieldTrip {
  destination: string;

  constructor(destination: string) {
    this.destination = destination;
    console.log(`We're going to ${this.destination}`);

    this.noexistent = destination;
    // Property 'noexistent' does not exist on type 'FieldTrip'.
  }
}

const trip = new FieldTrip("plaertarium");

trip.destination;

trip.nonexistent;
// Property 'nonexistent' does not exist on type 'FieldTrip'

// ======================================================================
class withMethod {
  myMethod() {}
}

new withMethod().myMethod === new withMethod().myMethod; // true

class withProperty {
  myProperty: () => {};
}

new WithMethod().myProperty === new WithMethod().myProperty; // false

class WithPropertyParameters {
  takesParameters = (input: boolean) => (input ? "Yes" : "No");
}

const instance = new WithPropertyParameters();

instance.takesParameters(true); // Ok

instance.takesParameters(123);

// ======================================================================
class WithValue {
  immediate = 0; // Ok
  later: number; // OK (コンストラクター内で設定されているため)
  mayBeUndefined: number | undefined; // Ok（undefinedでも許されるので）
  unused: number;
  // Property 'unused' has no initializer and is not definitely assigned in the constructor.

  constructor() {
    this.later = 1;
  }
}

// ======================================================================
class ActivitiesQueue {
  pending!: string[]; // Ok

  initialize(pending: string[]) {
    this.pending = pending;
  }

  next() {
    return this.pending.pop();
  }
}

const activities = new ActivitiesQueue();

activities.initialize(["eat", "sleep", "learn"]);
activities.next();

// ======================================================================
class MissingInitializer {
  property?: string;
}

new MissingInitializer().property?.length; // Ok

new MissingInitializer().property.length;
// Object is possibly 'undefined'.

// ======================================================================
class Quote {
  readonly text: string;

  constructor(text: string) {
    this.text = text;
  }

  emphasize() {
    this.text += "!";
    // Cannot assign to 'text' because it is a read-only property
  }
}

class RandomQuote {
  readonly explicit: string = "Home is the nicest word there is.";
  // readonlyの場合、型を明示しないとプリミティブ型ではなくより限定的なリテラル型（特定の値だけを代入可能にする型）として推論される。
  readonly implicit = "Home is nicest word there is.";

  constructor() {
    if (Math.random() > 0.5) {
      this.explicit = "We start learning the minute we're born"; // Ok

      this.implicit = "We start learning the minute we're born";
    }
    // Type '"We start learning the minute we're born"' is not assignable to type '"Home is nicest word there is."'
  }
}

const activites = new ActivitiesQueue();

activites.initialize(["eat", "sleep", "learn"]);
activites.next();

// ======================================================================
class Teacher {
  sayHello() {
    console.log("Take chances, make mistakesm get messy!");
  }
}

let teacher: Teacher;

teacher = new Teacher(); // Ok

teacher = "Wahoo!";
// Type 'string' is not assignable to type 'Teacher'.

// ======================================================================
class SchoolBus {
  getAbilities() {
    return ["magic", "shapeshifting"];
  }
}
function withSchoolBus(bus: SchoolBus) {
  console.log(bus.getAbilities);
}

withSchoolBus(new SchoolBus()); // Ok

// SchoolBusクラスのインスタンスだけでなく、() => string[]型のgetAbilitiesプロパティを
// 持つあらゆるオブジェクトがwithSchoolBus関数の引数の要件を満たす。
withSchoolBus({
  getAbilities: () => ["transmogrification"], // Ok
});

withSchoolBus({
  getAbilities: () => 123,
  // Type 'number' is not assignable to type 'string[]'.
});

// ======================================================================
interface Learner {
  name: string;
  study(hours: number): void;
}

class Student implements Learner {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  study(hours: number) {
    for (let i = 0; i < hours; i += 1) {
      console.log("...studying...");
    }
  }
}

class Slacker implements Learner {
  // Class 'Slacker' incorrectly implements interface 'Learner'.
  // Property 'study' is missing in type 'Slacker' but required in type 'Learner'.
  name = "Rocky";
}

class Student implements Learner {
  name;
  // Member 'name' implicitly has an 'any' type.
  study(hours) {}
  // hours' is declared but its value is never read.
}

// ======================================================================
interface Graded {
  grades: number[];
}

interface Reporter {
  report: () => string;
}

class ReportCard implements Graded, Reporter {
  grades: number[];

  constructor(grades: number[]) {
    this.grades = grades;
  }

  report() {
    return this.grades.join(", ");
  }
}

class Empty implements Graded, Reporter {}
// Class 'Empty' incorrectly implements interface 'Graded'.
// Property 'grades' is missing in type 'Empty' but required in type 'Graded'.

// ======================================================================
// 同じプロパティに異なる型を宣言しているインタフェースはimplementsできない。
interface AgeIsANumber {
  age: number;
}

interface AgesIsNotANumber {
  age: () => string;
}

class AsNumber implements AgeIsANumber, AgesIsNotANumber {
  age = 0;
  // Property 'age' in type 'AsNumber' is not assignable to the same property in base type 'AgesIsNotANumber'.
  // Type 'number' is not assignable to type '() => string'.
}

class NotAsNumber implements AgeIsANumber, AgeIsANumber {
  age() {
    return "";
  }
  // Property 'age' in type 'NotAsNumber' is not assignable to the same property in base type 'AgeIsANumber'.
  // Type '() => string' is not assignable to type 'number'.
}

// ======================================================================
class MyTeacher {
  teach() {
    console.log("The surest test of discipline is its absens.");
  }
}

class StudentTeacher extends MyTeacher {
  learn() {
    console.log("I cannot afford the luury of a closed mind.");
  }
}

const myteacher = new StudentTeacher();
myteacher.teach(); // ベースクラスで定義済み。
myteacher.learn(); // サブクラスで定義済み。

teacher.other();
// Property 'other' does not exist on type 'Teacher'.

// ======================================================================
class Lesson {
  subject: string;

  constructor(subject: string) {
    this.subject = subject;
  }
}

class OnlineLesson extends Lesson {
  url: string;

  constructor(subject: string, url: string) {
    super(subject);
    this.url = url;
  }
}

let lesson: Lesson;
lesson = new Lesson("coding");
lesson = new OnlineLesson("coding", "oreilly.com");

let online: OnlineLesson;
online = new OnlineLesson("coding", "oreilly.com");

online = new Lesson("coding");
// Property 'url' is missing in type 'Lesson' but required in type 'OnlineLesson'

class PastGrades {
  greads: number[] = [];
}

class LabeledPastGrades extends PastGrades {
  label?: string;
}

let subClass: LabeledPastGrades

subClass = new LabeledPastGrades(); // Ok
subClass new PastGrades(); //Ok


// ======================================================================
class GradeAnnouncer {
  message: string;

  constructor(grade: number) {
    this.message = grade <= 65 ? "Maybe next time..." : "You pass!";
  }
}

class PassingAnnouncer extends GradeAnnouncer {
  constructor() {
    super(100);
  }
}

class FailingAnnouncer extends GradeAnnouncer {
  constructor() {}
  // Constructors for derived classes must contain a 'super' call.
}

class GradesTaily {
  grades: number[] = [];

  addGrdes(...grades: number[]) {
    this.grades.push(...grades);
    return this.grades.length
  }
}

class ContinuedGradesTally extends GradesTaily {
  constructor(previousGrades: number[]) {
    this.grades = [...previousGrades];
    // super' must be called before accessing 'this' in the constructor of a derived class.

    super()

    console.log("Atarting with length", this.grades.length); // Ok
  }
}

// ======================================================================
class GradeCounter {
  countGrades(grades: string[], letter: string) {
    return grades.filter(grade => grade === letter).length
  }
}

class FailureCounter extends GradeCounter {
  countGrades(grades: string[]) {
    return super.countGrades(grades, "F");
  }
}

class AnyFailureChecker extends GradeCounter {
  countGrades(grades: string[]) {
    // roperty 'countGrades' in type 'AnyFailureCheckr' is not assignable to the same property in base type 'GradeCounter'.
    // Type '(grades: string[]) => boolean' is not assignable to type '(grades: string[], letter: string) => number'.
    // Type 'boolean' is not assignable to type 'number'.
    return super.countGrades(grades, "F") !== 0;
  }
}

const counter: GradeCounter = new AnyFailureChecker();
// Type 'AnyFailureChecker' is not assignable to type 'GradeCounter'.
//   The types returned by 'countGrades(...)' are incompatible between these types.
//     Type 'boolean' is not assignable to type 'number'.

const count = counter.countGrades(["A", "B", "F"], "D");

// ======================================================================
class Assignment {
  grade?: number;
}

class GradeAssignment extends Assignment {
  grade: number;

  constructor(grade: number) {
    super();
    this.grade = grade
  }
}

class NumericGrade {
  value = 0;
}

class VagueGrade extends NumericGrade {
  value = Math.random() > 0.5 ? 1 : "...";
  // Property 'value' in type 'VagueGrade' is not assignable to the same property in base type 'NumericGrade'.
  //   Type 'string | number' is not assignable to type 'number'.
  //     Type 'string' is not assignable to type 'number'.
}

const instance: NumericGrade = new VagueGrade();
// Type 'VagueGrade' is not assignable to type 'NumericGrade'.
//   Types of property 'value' are incompatible.
//     Type 'string | number' is not assignable to type 'number'.
//       Type 'string' is not assignable to type 'number'.

instance.value;

// ======================================================================
// 抽象クラス
// ベースクラスはメソッドを宣言するが、本体は持たず、サブクラス側で本体の実装を強制することができる。
abstract class School {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract getStudentTypes(): string[]
}

class Preschool extends School {
  getStudentTypes() {
    return ["preschooler"]
  }
}

class Absence extends School {}
// Non-abstract class 'Absence' does not implement all abstract members of 'School'

let school: School;

school = new Preschool("Sunnyside Daycare");

// 抽象クラスをそのままインスタンス化することはできない。
school = new School("somewhere else");
// Cannot create an instance of an abstract class.

// ======================================================================
class Base {
  isPublicImplicit = 0;
  public isPublicExplicit = 1;
  protected isProtected = 2;
  // プライベートメンバー（そのクラスのインスタンスだけがアクセスできる）
  private isPrivate = 3;
  // プライベートメンバー（そのクラスのインスタンスだけがアクセスできる）
  #truePrivate = 4;
}

class Subclass extends Base {
  examples() {
    this.isPublicImplicit;
    this.isPublicExplicit
    this.isProtected;

    this.isPrivate;
    // Property 'isPrivate' is private and only accessible within class 'Base'.

    this.#truePrivae;
    // Property '#truePrivae' does not exist on type 'Subclass'.
  }
}

new Subclass().isPublicImplicit;
new Subclass().isPublicExplicit;

new Subclass().isProtected;
// Property 'isProtected' is protected and only accessible within class 'Base' and its subclasses.

new Subclass().isPrivate;
// Property 'isPrivate' is private and only accessible within class 'Base'.

class TwoKeywords {
  private readonly name: string;

  constructor() {
    this.name = "Anne Sullvan";
  }

  log() {
    console.log(this.name);
  }
}

const two = new TwoKeywords();

two.name = "Savitribl Phule"
// Property 'name' is private and only accessible within class 'TwoKeywords'.

// ======================================================================
// 静的フィールド修飾子
class Question {
    protected static readonly answer = "bash";
    protected static readonly prompt =
        "What's an ogre's favorite programming language?";

    guess(getAnswer: (prompt: string) => string) {
        const answer = getAnswer(Question.prompt);

        // Ok
        if (answer === Question.answer) {
            console.log("You got it!");
        } else {
            console.log("Try again...")
        }
    }
}

Question.answer;
// Error: Property 'answer' is protected and only
// accessible within class 'Question' and its subclasses.

// ======================================================================
class SomeClass {
    static #truePrivateStatic
}