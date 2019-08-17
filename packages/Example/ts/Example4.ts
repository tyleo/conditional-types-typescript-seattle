// const fabricate = <T>(): T => (undefined as any) as T;

// //
// export interface IPart<TType extends string> {
//   readonly ["@PartType"]: TType;
//   readonly file: string;
// }
// const template = <T, TType extends string>(
//   self: T,
//   partType: TType,
//   file: string,
// ) =>
//   ({
//     "@PartType": partType,
//     file,
//     ...self,
//   } as const);

// export interface IBody<TMountPoints = unknown> extends IPart<"IBody"> {
//   readonly mountPoints: MountPoints<TMountPoints>;
// }
// const body = <T extends Omit<IBody, "@PartType" | "file">>(
//   self: T,
//   file: string,
// ) => template(self, "IBody", file);

// export interface IGun extends IPart<"IGun"> {}
// const gun = <T extends Omit<IGun, "@PartType" | "file">>(
//   self: T,
//   file: string,
// ) => template(self, "IGun", file);

// export interface IThruster extends IPart<"IThruster"> {}
// const thruster = <T extends Omit<IThruster, "@PartType" | "file">>(
//   self: T,
//   file: string,
// ) => template(self, "IThruster", file);

// //

// type PartTemplates = [IGun, IThruster];
// type PartTemplate = PartTemplates[number];

// interface IMountPoint<TPartTemplate extends PartTemplate> {
//   readonly part: TPartTemplate;
//   readonly x: number;
//   readonly y: number;
//   readonly z: number;
// }
// const mountPoint = <TPartTemplate extends PartTemplate>(
//   part: TPartTemplate,
//   x: number,
//   y: number,
//   z: number,
// ) => ({
//   part,
//   x,
//   y,
//   z,
// });

// type MountPoints<T> = { [k in keyof T]: IMountPoint<PartTemplate> };

// type BasePartTemplateHelper<TPartTemplate extends PartTemplate> = {
//   [k in keyof PartTemplates]: TPartTemplate extends PartTemplates[k]
//     ? PartTemplates[k]
//     : never;
// };

// type BasePartTemplate<
//   TPartTemplate extends PartTemplate
// > = BasePartTemplateHelper<TPartTemplate>[keyof BasePartTemplateHelper<
//   TPartTemplate
// >];

// type PartTemplateFromMountPoint<TMountPoint> = TMountPoint extends IMountPoint<
//   infer TPartTemplate
// >
//   ? BasePartTemplate<TPartTemplate>
//   : never;

// interface IPartMounter<TBodyTemplate extends IBody<unknown>> {
//   mount<
//     TMountPoint extends keyof TMountPoints,
//     TPart extends PartTemplateFromMountPoint<TMountPoints[TMountPoint]>,
//     TMountPoints extends TBodyTemplate["mountPoints"] = TBodyTemplate["mountPoints"]
//   >(
//     mountPoint: TMountPoint,
//     part: TPart,
//   ): IPartMounter<
//     Omit<TBodyTemplate, "mountPoints"> & {
//       readonly mountPoints: Omit<TMountPoints, TMountPoint>;
//     } & {
//       readonly mountPoints: {
//         readonly [k in TMountPoint]: IMountPoint<TPart>;
//       };
//     }
//   >;
//   toShip(): TBodyTemplate;
// }

// ///

// const laser = gun(
//   {
//     shoot: () => "The player shot a laser!",
//   },
//   "laser",
// );

// const claw = gun(
//   {
//     grab: () => "The player tried to grab an item!",
//   },
//   "claw",
// );

// const powerThruster = thruster(
//   {
//     thrust: () => "The player used their thruster!",
//   },
//   "thruster",
// );

// // const _warpThruster = thrusterTemplate(
// //   {
// //     thrust: () => "The player used their thruster!",
// //     warp: () => "The player has warped!",
// //   },
// //   "powerThruster",
// // );

// const shipBody = body(
//   {
//     mountPoints: {
//       frontLeftGun: mountPoint(laser, 0, 0, 0),
//       frontRightGun: mountPoint(laser, 0, 0, 0),

//       rearLeftThruster: mountPoint(thruster, 0, 0, 0),
//       rearRightThruster: mountPoint(thruster, 0, 0, 0),
//     },
//   },
//   "ship_00",
// );

// ///

// const partMounter = <TBodyTemplate extends IBody>(
//   _self: TBodyTemplate,
// ): IPartMounter<TBodyTemplate> => fabricate();

// const z = partMounter(shipBody)
//   .mount("frontLeftGun", claw)
//   .mount("rearLeftThruster", claw)
//   .toShip();
