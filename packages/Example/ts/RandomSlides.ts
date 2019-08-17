/// 1

// type HelloConditional = "Hello World" extends string ? number : string;
// const numberAssign: HelloConditional = 0;
//const stringAssign: HelloConditional = "Text"; // <- Error

/// 2

//type StringToNumber<T> = T extends string ? number : T;
// type StringToNumber<T> = string extends T ? number : T;

// const stringAssign: StringToNumber<string> = 0;

// const specificStringAssign: StringToNumber<"Hello World"> = 0;

// const booleanAssign: StringToNumber<boolean> = true; // <- Not a string

/// 3

// interface IGasEngine {
//   fillUp: () => void;
// }
// interface IElectricEngine {
//   charge: () => void;
// }

// interface ICarParts<TEngine> {}

// type Car<TCarParts extends ICarParts<unknown>> = TCarParts extends ICarParts<
//   infer TEngine
// >
//   ? TEngine
//   : never;

// declare const myCar: Car<ICarParts<IElectricEngine>>;
// myCar.charge();
// declare const oldCar: Car<ICarParts<IGasEngine>>;
// oldCar.fillUp();

/// 4

// const cantAssign: never = 0 as any; // <- 'any' is not assignable to 'never'

// const neverMap: { v: never } = { v: 0 as any }; // <- same as above

// const neverUnion: "item" | never; // <- neverUnion = "item"

/// 5

// type Parameters<T extends (...args: any) => any> = T extends (
//   ...args: infer P
// ) => any
//   ? P
//   : never;
// const parameters: Parameters<(a: number, b: string) => string> = [0, ""];

// type ReturnType<T extends (...args: any) => any> = T extends (
//   ...args: any
// ) => infer R
//   ? R
//   : any;
// const returnType: ReturnType<(a: number) => string> = "Hello";
