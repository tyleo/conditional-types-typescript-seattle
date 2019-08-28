export interface IErr<
  TType extends number | symbol | string,
  TSubType extends number | symbol | string = string
> {
  readonly errType: TType;
  readonly errSubtype: TSubType;
}

export interface IErrChecker<T extends string> {
  readonly check: (self: any) => self is IErr<T>;
}

interface IErrInput {
  readonly [k: string]: (...args: any) => any;
}

type ErrOutput<TType extends string, TErrInput extends IErrInput> = {
  readonly [k in keyof TErrInput]: (
    ...args: Parameters<TErrInput[k]>
  ) => ReturnType<TErrInput[k]> & IErr<TType, k>;
} &
  IErrChecker<TType>;

const IErr = {
  check: <TType extends string>(self: any, type: TType): self is IErr<TType> =>
    "errType" in self && "errSubtype" in self && self.errType === type,

  type: <TSelf extends object, TType extends string, TSubType extends string>(
    self: TSelf,
    type: TType,
    errorSubType: TSubType,
  ): TSelf & IErr<TType, TSubType> => ({
    ...self,
    errType: type,
    errSubtype: errorSubType,
  }),
} as const;

export const Err = {
  new: <TType extends string, TErrInput extends IErrInput>(
    type: TType,
    errors: TErrInput,
  ): ErrOutput<TType, TErrInput> => {
    const result: { [k: string]: (...args: any[]) => any } = {
      check: (self: any): self is IErr<TType> => IErr.check(self, type),
    };

    Object.entries(errors).forEach(([key, value]) => {
      result[key] = (...args: any[]) => IErr.type(value(...args), type, key);
    });

    return result as ErrOutput<TType, TErrInput>;
  },
} as const;

type Values<T> = T[keyof T];

export type Err<T extends ErrOutput<string, {}>> = T extends ErrOutput<
  infer TType,
  infer TErrorInput
>
  ? Values<
      {
        [k in keyof TErrorInput]: ReturnType<TErrorInput[k]> & IErr<TType, k>;
      }
    >
  : never;
