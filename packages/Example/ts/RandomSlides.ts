type HelloConditional = "Hello Conditional" extends string ? true : false;
const trueConditional: HelloConditional = true;
//const falseConditional: HelloConditional = false; // <- Error

interface IMyObject {
  value: string;
}

type MyMap<T> = { [k in keyof T]: IMyObject };
const myMap = <T extends MyMap<T>>(self: T) => self;
myMap({ object1: { value: "Hello", other: "Goodbye" } });

type StrictMap<T> = {
  [k in keyof T]: IMyObject extends T[k] ? T[k] : never;
};
const strictMap = <T extends StrictMap<T>>(self: T) => self;
strictMap({ object1: { value: "Hello", otherValue: "Goodbye" } });
