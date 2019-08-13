import * as MtlLoader from "three/examples/jsm/loaders/MTLLoader";
import * as Three from "three";

import * as App from "App";

export const LoadObjError = App.Error.new("LoadObjError", {
  MtlLoadError: (fileName: string) => ({ fileName }),

  ObjLoadError: (fileName: string) => ({ fileName }),
});
export type LoadObjError = App.Error<typeof LoadObjError>;

export const LoadObj = async (
  fileWithoutExt: string,
): Promise<Three.Group | LoadObjError> => {
  let mtlCreator: MtlLoader.MaterialCreator;
  try {
    const mtlLoader = new App.AsyncMtlLoader();
    mtlLoader.wrapped.setPath("asset/obj/");
    mtlCreator = await mtlLoader.load(`${fileWithoutExt}.mtl`);
    mtlCreator.preload();
  } catch {
    return LoadObjError.MtlLoadError(`asset/obj/${fileWithoutExt}.mtl`);
  }

  try {
    const objLoader = new App.AsyncObjLoader();
    objLoader.wrapped.setMaterials(mtlCreator);
    objLoader.wrapped.setPath("asset/obj/");
    return await objLoader.load(`${fileWithoutExt}.obj`);
  } catch {
    return LoadObjError.ObjLoadError(`asset/obj/${fileWithoutExt}.obj`);
  }
};
