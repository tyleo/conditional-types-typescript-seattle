import { Err } from "Err";
import * as MtlLoader from "three/examples/jsm/loaders/MTLLoader";
import * as Three from "three";

import * as App from "App";

export const LoadObjErr = Err.new("LoadObjErr", {
  MtlLoadErr: (fileName: string) => ({ fileName }),
  ObjLoadErr: (fileName: string) => ({ fileName }),
});
export type LoadObjErr = Err<typeof LoadObjErr>;

export const LoadObj = async (
  fileWithoutExt: string,
): Promise<Three.Group | LoadObjErr> => {
  let mtlCreator: MtlLoader.MaterialCreator;
  try {
    const mtlLoader = new App.AsyncMtlLoader();
    mtlLoader.wrapped.setPath("asset/obj/");
    mtlCreator = await mtlLoader.load(`${fileWithoutExt}.mtl`);
    mtlCreator.preload();
  } catch {
    return LoadObjErr.MtlLoadErr(`asset/obj/${fileWithoutExt}.mtl`);
  }

  try {
    const objLoader = new App.AsyncObjLoader();
    objLoader.wrapped.setMaterials(mtlCreator);
    objLoader.wrapped.setPath("asset/obj/");
    return await objLoader.load(`${fileWithoutExt}.obj`);
  } catch {
    return LoadObjErr.ObjLoadErr(`asset/obj/${fileWithoutExt}.obj`);
  }
};
