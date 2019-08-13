const fabricate = <T>(): T => (undefined as any) as T;

//

export interface IPart<TType extends string, TInit> {
  readonly ["@PartType"]: TType;
  readonly initialize: () => TInit;
}

const template = <TType extends string, TInit>(
  partType: TType,
  initialize: () => TInit,
): IPart<TType, TInit> =>
  ({
    "@PartType": partType,
    initialize,
  } as const);

export interface IBody extends IPart<"IBody", unknown> {}
const body = <TInit>(init: () => TInit) => template("IBody", init);

export interface IGun extends IPart<"IGun", unknown> {}
const gun = <T>(self: T, file: string) => template(self, "IGun", file);

export interface IThruster extends IPart<"IThruster", undefined> {}
const thruster = <T>(self: T, file: string) =>
  template(self, "IThruster", file);

//

const ship = body(
  {
    frontLeftGun: gun({}, "laser"),
    frontRightGun: gun({}, "laser"),
    rearLeftThruster: thruster({}, "thruster"),
    rearRightThruster: thruster({}, "thruster"),
  },
  "ship_00",
);

type Ship<T> = {
  [k in keyof T]: T[k] extends IGun
    ? { shoot: () => void }
    : T[k] extends IThruster
    ? { thrust: () => void }
    : never;
};

const z = fabricate<Ship<typeof ship>>();

type GunFuncs<T> = HasPart<T, IGun, { shoot: () => void }, {}>;

const cunFuncs = (0 as any) as GunFuncs<typeof ship>;

//

type PartTemplates = [IGun, IThruster];
type PartTemplate = PartTemplates[number];

interface IMountPoint<TPartTemplate extends PartTemplate> {
  readonly part: TPartTemplate;
  readonly x: number;
  readonly y: number;
  readonly z: number;
}
const mountPoint = <TPartTemplate extends PartTemplate>(
  part: TPartTemplate,
  x: number,
  y: number,
  z: number,
) => ({
  part,
  x,
  y,
  z,
});

type MountPoints<T> = { [k in keyof T]: IMountPoint<PartTemplate> };

type BasePartTemplateHelper<TPartTemplate extends PartTemplate> = {
  [k in keyof PartTemplates]: TPartTemplate extends PartTemplates[k]
    ? PartTemplates[k]
    : never;
};

type BasePartTemplate<
  TPartTemplate extends PartTemplate
> = BasePartTemplateHelper<TPartTemplate>[keyof BasePartTemplateHelper<
  TPartTemplate
>];

type PartTemplateFromMountPoint<TMountPoint> = TMountPoint extends IMountPoint<
  infer TPartTemplate
>
  ? BasePartTemplate<TPartTemplate>
  : never;

interface IPartMounter<TBodyTemplate extends IBody<unknown>> {
  mount<
    TMountPoint extends keyof TMountPoints,
    TPart extends PartTemplateFromMountPoint<TMountPoints[TMountPoint]>,
    TMountPoints extends TBodyTemplate["mountPoints"] = TBodyTemplate["mountPoints"]
  >(
    mountPoint: TMountPoint,
    part: TPart,
  ): IPartMounter<
    Omit<TBodyTemplate, "mountPoints"> & {
      readonly mountPoints: Omit<TMountPoints, TMountPoint>;
    } & {
      readonly mountPoints: {
        readonly [k in TMountPoint]: IMountPoint<TPart>;
      };
    }
  >;
  toShip(): TBodyTemplate;
}

///

const laser = gun(
  {
    shoot: () => "The player shot a laser!",
  },
  "laser",
);

const claw = gun(
  {
    grab: () => "The player tried to grab an item!",
  },
  "claw",
);

const powerThruster = thruster(
  {
    thrust: () => "The player used their thruster!",
  },
  "thruster",
);

// const _warpThruster = thrusterTemplate(
//   {
//     thrust: () => "The player used their thruster!",
//     warp: () => "The player has warped!",
//   },
//   "powerThruster",
// );

const shipBody = body(
  {
    mountPoints: {
      frontLeftGun: mountPoint(laser, 0, 0, 0),
      frontRightGun: mountPoint(laser, 0, 0, 0),

      rearLeftThruster: mountPoint(thruster, 0, 0, 0),
      rearRightThruster: mountPoint(thruster, 0, 0, 0),
    },
  },
  "ship_00",
);

///

const partMounter = <TBodyTemplate extends IBody>(
  _self: TBodyTemplate,
): IPartMounter<TBodyTemplate> => fabricate();

// const z = partMounter(shipBody)
//   .mount("frontLeftGun", claw)
//   .mount("rearLeftThruster", claw)
//   .toShip();
