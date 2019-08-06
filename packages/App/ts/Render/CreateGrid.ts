import * as Three from "three";

import * as App from "App";

export const CreateGrid = (width: number, height: number, depth: number) => {
  const group = new Three.Group();
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
      for (let k = 0; k > -depth; --k) {
        group.add(App.CreateCube({ x: i, y: j, z: k }));
      }
    }
  }
  return group;
};
