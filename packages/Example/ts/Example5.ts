// type ExtractType<T extends any[], TPos extends number> = T extends any[]
//   ? T[TPos]
//   : never;

// ///

// interface IMyObject {
//   value: string;
// }

// type MyMap<T> = { [k in keyof T]: IMyObject };
// const myMap = <T extends MyMap<T>>(self: T) => self;
// myMap({ object1: { value: "Hello", other: "Goodbye" } });

// type StrictMap<T> = {
//   [k in keyof T]: IMyObject extends T[k] ? T[k] : never;
// };
// const strictMap = <T extends StrictMap<T>>(self: T) => self;
// strictMap({ object1: { value: "Hello", otherValue: "Goodbye" } });

// //

// type Example = Exclude<"Hello" | "World", "World">;
// type World = Extract<"Hello" | "World", "World">;

// //

// ///

// export interface ITypedError<
//   TType extends string,
//   TSubType extends number | symbol | string = string
// > {
//   readonly errorType: TType;
//   readonly errorSubType: TSubType;
// }

// export interface IErrorChecker<T extends string> {
//   readonly check: (self: any) => self is ITypedError<T>;
// }

// interface IErrorInput {
//   readonly [key: string]: (...args: any[]) => any;
// }

// type ErrorOutput<TType extends string, TErrorInput extends IErrorInput> = {
//   readonly [key in keyof TErrorInput]: key extends string
//     ? (
//         ...args: Parameters<TErrorInput[key]>
//       ) => ReturnType<TErrorInput[key]> & ITypedError<TType, key>
//     : never;
// } &
//   IErrorChecker<TType>;

// const ITypedError = {
//   check: <TType extends string>(
//     self: any,
//     type: TType,
//   ): self is ITypedError<TType> =>
//     "errorType" in self && "errorSubType" in self && self.errorType === type,

//   type: <TSelf extends object, TType extends string, TSubType extends string>(
//     self: TSelf,
//     type: TType,
//     errorSubType: TSubType,
//   ): TSelf & ITypedError<TType, TSubType> => ({
//     ...self,
//     errorType: type,
//     errorSubType: errorSubType,
//   }),
// } as const;

// export const Error = {
//   new: <TType extends string, TErrorInput extends IErrorInput>(
//     type: TType,
//     errors: TErrorInput,
//   ): ErrorOutput<TType, TErrorInput> => {
//     const result: { [key: string]: (...args: any[]) => any } = {
//       check: (self: any): self is ITypedError<TType> =>
//         ITypedError.check(self, type),
//     };

//     Object.entries(errors).forEach(([key, value]) => {
//       result[key] = (...args: any[]) =>
//         ITypedError.type(value(...args), type, key);
//     });

//     return result as ErrorOutput<TType, TErrorInput>;
//   },
// } as const;

// type Values<T> = T[keyof T];

// export type Error<T extends ErrorOutput<string, {}>> = T extends ErrorOutput<
//   infer TType,
//   infer TErrorInput
// >
//   ? Values<
//       {
//         [k in keyof TErrorInput]: ReturnType<TErrorInput[k]> &
//           ITypedError<TType, k>;
//       }
//     >
//   : never;

// ///

// export const LoadError = Error.new("LoadError", {
//   FileLoadError: (fileName: string) => ({ fileName }),

//   NotEnoughMemoryError: (objectSize: number) => ({ objectSize }),
// });
// export type LoadError = Error<typeof LoadError>;
