# Conditional Types
## Tyler Wolf Leonhardt

## What is a conditional type
* A conditional type selects between two possible types based on a condition.

```typescript
type HelloConditional = "Hello Conditional" extends string ? true : false;
const trueConditional: HelloConditional = true;
const falseConditional: HelloConditional = false; // <- Error
```

* The type above resolves to `true` because `"Hello Conditional"` is a `string`.

# Another Example
```typescript
interface IMyObject {
  value: string;
}

type MyMap<T> = { [k in keyof T]: IMyObject };
const myMap = <T extends MyMap<T>>(self: T) => self;
// This may can contain properties that extend IMyObject
myMap({ object1: { value: "Hello", other: "Goodbye" } });

type StrictMap<T> = {
  [k in keyof T]: IMyObject extends T[k] ? T[k] : never;
};
const strictMap = <T extends StrictMap<T>>(self: T) => self;
// This can only contain properties that are _exactly_ IMyObject
strictMap({ object1: { value: "Hello", otherValue: "Goodbye" } });
```

# 
