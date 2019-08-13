import * as Three from "three";
import * as ObjLoader from "three/examples/jsm/loaders/OBJLoader";

export class AsyncObjLoader {
  private _objLoader = new ObjLoader.OBJLoader();
  public get wrapped(): ObjLoader.OBJLoader {
    return this._objLoader;
  }

  public readonly load = (
    url: string,
    onProgress?: (e: ProgressEvent) => void,
  ): Promise<Three.Group> =>
    new Promise((resolve, reject) => {
      this._objLoader.load(url, v => resolve(v), onProgress, v => reject(v));
    });
}
