import * as Three from "three";

export const CreatePerspectiveCamera = () =>
  new Three.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10,
  );
