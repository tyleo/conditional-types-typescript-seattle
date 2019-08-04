import * as Three from "three";
import * as MtlLoader from "three/examples/jsm/loaders/MTLLoader";
import * as ObjLoader from "three/examples/jsm/loaders/OBJLoader";

export const LoadObj = async (fileWithoutExt: string): Promise<Three.Group> => {
  return new Promise((resolve, reject) => {
    const mtlLoader = new MtlLoader.MTLLoader();
    mtlLoader.setPath("asset/obj/");
    mtlLoader.load(
      `${fileWithoutExt}.mtl`,
      material => {
        material.preload();
        const loader = new ObjLoader.OBJLoader();
        loader.setMaterials(material);
        loader.setPath("asset/obj/");
        loader.load(
          `${fileWithoutExt}.obj`,
          group => resolve(group),
          undefined,
          () => reject(),
        );
      },
      undefined,
      () => reject(),
    );
  });
};
