export interface ITypedError<TType extends number | string> {
  readonly errorType: TType;
}

export interface IErrorChecker<T extends string> {
  readonly check: (self: any) => self is ITypedError<T>;
}

interface IErrorInput {
  readonly [key: string]: (...args: any[]) => any;
}

type ErrorOutput<TType extends string, TErrorInput extends IErrorInput> = {
  readonly [key in keyof TErrorInput]: (
    ...args: Parameters<TErrorInput[key]>
  ) => ReturnType<TErrorInput[key]> & ITypedError<TType>;
} &
  IErrorChecker<TType>;

const ITypedError = {
  check: <TType extends number | string>(
    self: any,
    type: TType,
  ): self is ITypedError<TType> =>
    "errorType" in self && self.errorType === type,

  type: <TSelf extends object, TType extends number | string>(
    self: TSelf,
    type: TType,
  ): TSelf & ITypedError<TType> => ({
    ...self,
    errorType: type,
  }),
} as const;

export const Error = {
  new: <TType extends string, TErrorInput extends IErrorInput>(
    type: TType,
    errors: TErrorInput,
  ): ErrorOutput<TType, TErrorInput> => {
    const result: { [key: string]: (...args: any[]) => any } = {
      check: (self: any): self is ITypedError<TType> =>
        ITypedError.check(self, type),
    };

    Object.entries(errors).forEach(([key, value]) => {
      result[key] = (...args: any[]) => ITypedError.type(value(...args), type);
    });

    return result as ErrorOutput<TType, TErrorInput>;
  },
} as const;

export type Error<T extends ErrorOutput<string, {}>> = T extends ErrorOutput<
  infer TType,
  infer TErrorInput
>
  ? ReturnType<TErrorInput[keyof TErrorInput]> & ITypedError<TType>
  : never;

///

const errors = {
  NoFile: () => "File does not exist!",
  NotObj: () => "File is not an obj!",
};
