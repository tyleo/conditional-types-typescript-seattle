import * as Three from "three";

export const RenderCube = (scene: Three.Scene) => {
  const geometry = new Three.BoxGeometry(1, 1, 1);
  const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new Three.Mesh(geometry, material);
  cube.position.set(0, 0, -4);
  scene.add(cube);
};
