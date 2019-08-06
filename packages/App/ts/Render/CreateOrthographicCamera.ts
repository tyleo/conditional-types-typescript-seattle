import * as Three from "three";

export const CreateOrthographicCamera = () =>
  new Three.OrthographicCamera(-5, 5, 5, -5, 0.01, 10);
