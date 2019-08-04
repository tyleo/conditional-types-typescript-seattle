import * as Three from "three";

// Useful for debugging issues with materials.
export const ReplaceChildMaterials = (
  obj: Three.Object3D,
  material: Three.Material | Three.Material[] = new Three.MeshBasicMaterial({
    color: 0x999999,
  }),
) =>
  obj.traverse(child =>
    child instanceof Three.Mesh ? (child.material = material) : undefined,
  );
