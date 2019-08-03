const fabricate = <T>(): T => (undefined as any) as T;

///

export interface ITyped<TType extends string> {
  readonly ["@type"]: TType;
}

///

export interface IBody extends ITyped<"IBody"> {}

export interface IGun extends ITyped<"IGun"> {}

export interface IThruster extends ITyped<"IThruster"> {}

interface IFighter {
  body: IBody;
  gun: IGun;
}

interface IDoubleFighter {
  body: IBody;
  gun1: IGun;
  gun2: IGun;
}

interface IRacer {
  body: IBody;
  thruster: IThruster;
}

///

type SpaceShipGunFunctions<T> = {
  [k in keyof T]: T[k] extends IGun ? { shoot: () => void } : {};
};

type SpaceShipThrusterFunctions<T> = {
  [k in keyof T]: T[k] extends IThruster ? { thrust: () => void } : {};
};

type SpaceShipFunctions<T> =
  | SpaceShipGunFunctions<T>
  | SpaceShipThrusterFunctions<T>;

///

type HasGun<T> = IGun extends T[keyof T] ? true : false;
type HasPart<T, P, TTrue, TFalse> = P extends T[keyof T] ? TTrue : TFalse;

type ThrustFuncs<T> = HasPart<T, IThruster, { thrust: () => void }, {}>;
type GunFuncs<T> = HasPart<T, IGun, { shoot: () => void }, {}>;

type ShipFuncs<T> = ThrustFuncs<T> & GunFuncs<T>;

///

interface IError {
  readonly ["@type"]: "IError";
}

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | IError;

type Increment<T extends Digit> = T extends 0
  ? 1
  : T extends 1
  ? 2
  : T extends 2
  ? 3
  : T extends 3
  ? 4
  : T extends 4
  ? 5
  : T extends 5
  ? 6
  : T extends 6
  ? 7
  : T extends 7
  ? 8
  : T extends 8
  ? 9
  : T extends 9 // Overflow
  ? IError
  : IError;

type Largest<
  T extends { [k in keyof T]: Digit | IError }
> = 9 extends T[keyof T]
  ? 9
  : 8 extends T[keyof T]
  ? 8
  : 7 extends T[keyof T]
  ? 7
  : 6 extends T[keyof T]
  ? 6
  : 5 extends T[keyof T]
  ? 5
  : 4 extends T[keyof T]
  ? 4
  : 3 extends T[keyof T]
  ? 3
  : 2 extends T[keyof T]
  ? 2
  : 1 extends T[keyof T]
  ? 1
  : 0 extends T[keyof T]
  ? 0
  : IError extends T[keyof T]
  ? IError
  : IError;

type GreaterThanOrEqual<
  Lhs extends Digit,
  Rhs extends Digit
> = Lhs extends IError
  ? IError
  : Rhs extends IError
  ? IError
  : Lhs extends Largest<{
      lhs: Lhs;
      Rhs: Rhs;
    }>
  ? true
  : false;

type CountGuns<T, N extends Digit = 0> = Largest<
  {
    [k in keyof T]: T[k] extends IGun ? CountGuns<Omit<T, k>, Increment<N>> : N;
  }
>;

type CountParts<T, P, N extends Digit = 0> = Largest<
  {
    [k in keyof T]: T[k] extends P
      ? CountParts<Omit<T, k>, P, Increment<N>>
      : N;
  }
>;

// const thruster = fabricate<CountGuns<IThruster>>();
// const fighter = fabricate<CountGuns<IFighter>>();
// const fighter2 = fabricate<CountGuns<IDoubleFighter>>();
///

///

type ICanRace<T> = GreaterThanOrEqual<CountParts<T, IThruster>, 2>;
type ICanFight<T> = GreaterThanOrEqual<CountParts<T, IGun>, 2>;

type ISpaceGamePlugin<T> = {
  raceGamePlugin: ICanRace<T> extends true ? { thrust: () => void } : never;
  advancedRaceGamePlugin: ICanRace<T> extends true
    ? { thrust: () => void }
    : never;
  fightingGamePlugin: ICanFight<T> extends true ? { shoot: () => void } : never;
  advancedfightingGamePlugin: ICanRace<T> extends true
    ? { thrust: () => void }
    : never;
};

const spaceGamePlugin = <T>(ship: T): ISpaceGamePlugin<T> => {
  return fabricate();
};

spaceGamePlugin(fabricate<IDoubleFighter>());

///

interface IComponent {}
interface IComponentDef {
  readonly type: string;
}
interface IComponentDesc {
  readonly typeIndex: number;
}

interface IEntity {
  readonly components: {
    readonly [type: number]:
      | { readonly [id: number]: boolean | undefined }
      | undefined;
  };
}

interface ISystem<TComponents extends any[]> {
  preGameUpdate?(): void;
  preSystemUpdate?(): void;
  systemUpdate?(...components: TComponents): void;
  postSystemUpdate?(): void;
  postGameUpdate?(): void;
}

interface IGame {
  readonly components: IComponent[][];
  readonly componentDesc: IComponentDesc;

  update(): void;
}

//

type Part = IGun | IThruster;

// Narrowing conditional type
type BasePart<TPart extends Part> = TPart extends IGun
  ? IGun
  : TPart extends IThruster
  ? IThruster
  : never;

type PartTypeFromMountPoint<TMountPoint> = TMountPoint extends IMountPoint<
  infer TPartType
>
  ? BasePart<TPartType>
  : never;

interface IMountPoint<TPart extends Part> {
  readonly part: TPart;
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

type MountPoints<T> = { [k in keyof T]: IMountPoint<Part> };

export interface ISpaceShip<TMountPoints = any> extends ITyped<"ISpaceShip"> {
  readonly mountPoints: MountPoints<TMountPoints>;
}

export interface ISavageGun extends IGun {
  readonly ["@guntype"]: "ISavageGun";
}

export interface IWeakGun extends IGun {
  readonly ["@guntype"]: "IWeakGun";
}

interface ITestShip extends ISpaceShip {
  readonly mountPoints: {
    readonly frontLeftGun: IMountPoint<ISavageGun>;
    readonly frontRightGun: IMountPoint<IGun>;
    readonly rearThruster: IMountPoint<IThruster>;
  };
}

const mountPart = <
  TShip extends ISpaceShip,
  TMountPoint extends keyof TMountPoints,
  TPart extends PartTypeFromMountPoint<TMountPoints[TMountPoint]>,
  TMountPoints extends TShip["mountPoints"] = TShip["mountPoints"]
>(
  self: TShip,
  mountPoint: TMountPoint,
  part: TPart,
): Omit<TShip, "mountPoints"> & {
  readonly mountPoints: Omit<TMountPoints, TMountPoint>;
} & {
  readonly mountPoints: {
    readonly [k in TMountPoint]: IMountPoint<TPart>;
  };
} => fabricate();

interface IPartMounter<TShip extends ISpaceShip> {
  mount<
    TMountPoint extends keyof TMountPoints,
    TPart extends PartTypeFromMountPoint<TMountPoints[TMountPoint]>,
    TMountPoints extends TShip["mountPoints"] = TShip["mountPoints"]
  >(
    mountPoint: TMountPoint,
    part: TPart,
  ): IPartMounter<
    Omit<TShip, "mountPoints"> & {
      readonly mountPoints: Omit<TMountPoints, TMountPoint>;
    } & {
      readonly mountPoints: {
        readonly [k in TMountPoint]: IMountPoint<TPart>;
      };
    }
  >;
  toShip(): TShip;
}

const partMounter = <TShip extends ISpaceShip>(
  self: TShip,
): IPartMounter<TShip> => fabricate();

const ship = fabricate<ITestShip>();
const savageGun = fabricate<ISavageGun>();
const weakGun = fabricate<IWeakGun>();
const thruster = fabricate<IThruster>();

partMounter(ship)
  .mount("frontLeftGun", weakGun)
  .mount("frontRightGun", savageGun)
  .mount("rearThruster", thruster)
  .toShip();
