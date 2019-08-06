import * as Three from "three";

export const CreateCube = (
  position: { readonly x: number; readonly y: number; readonly z: number },
  radius: number = 0.1,
  color: number = 0x999999,
): Three.Mesh => {
  const geometry = new Three.BoxGeometry(radius, radius, radius);
  const material = new Three.MeshBasicMaterial({ color });
  const mesh = new Three.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);
  return mesh;
};
