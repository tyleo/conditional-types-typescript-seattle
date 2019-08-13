import * as MtlLoader from "three/examples/jsm/loaders/MTLLoader";

export class AsyncMtlLoader {
  private _mtlLoader = new MtlLoader.MTLLoader();
  public get wrapped(): MtlLoader.MTLLoader {
    return this._mtlLoader;
  }

  public readonly load = (
    url: string,
    onProgress?: (e: ProgressEvent) => void,
  ): Promise<MtlLoader.MaterialCreator> =>
    new Promise((resolve, reject) => {
      this._mtlLoader.load(url, v => resolve(v), onProgress, v => reject(v));
    });
}
