import * as React from "react";

import * as Emotion from "emotion";
import * as Three from "three";

import * as App from "App";

// CSS

// HTML

const makeScene = () => {
  const scene = new Three.Scene();

  const light = new Three.PointLight(0xffffff, 3, 100);
  light.position.set(0, 0, 2.5);
  scene.add(light);

  const root = new Three.Group();
  scene.add(root);
  //root.add(App.CreateGrid(10, 10, 10));

  let lastLoaded: Three.Group | undefined;
  const loadObj = (obj: string) => {
    App.LoadObj(obj).then(loaded => {
      if (App.LoadObjErr.check(loaded)) {
        // eslint-disable-next-line no-console
        alert(`Err from LoadObj: Err loading ${loaded.fileName}.`);
        return;
      }

      if (lastLoaded !== undefined) {
        root.remove(lastLoaded);
      }
      lastLoaded = loaded;

      const size = new Three.Box3()
        .setFromObject(loaded)
        .getSize(new Three.Vector3());
      loaded.position.set(0 - size.x / 2, -2 - size.y / 2, size.z / 2);

      root.add(loaded);
    });
  };
  loadObj("frog");

  const rotationAmount = (3.14 * 2) / 3 / 60;
  const rotateUp = () => {
    //root.rotateX(-rotationAmount);
    root.rotateOnWorldAxis(new Three.Vector3(1, 0, 0), -rotationAmount);
  };

  const rotateDown = () => {
    //root.rotateX(+rotationAmount);
    root.rotateOnWorldAxis(new Three.Vector3(1, 0, 0), rotationAmount);
  };

  const rotateLeft = () => {
    //root.rotateY(-rotationAmount);
    root.rotateOnWorldAxis(new Three.Vector3(0, 1, 0), -rotationAmount);
  };

  const rotateRight = () => {
    //root.rotateY(rotationAmount);
    root.rotateOnWorldAxis(new Three.Vector3(0, 1, 0), rotationAmount);
  };

  return {
    scene,
    rotateUp,
    rotateDown,
    rotateLeft,
    rotateRight,
    loadObj,
  };
};

const emo = {
  arrow: () => Emotion.css`
    ${emo.icon()};

    &:hover {
      text-shadow: 0 0 20px white;
    }
  `,

  button: (isSelected: boolean) => Emotion.css`
    background-color: ${isSelected ? "rgb(153, 92, 0)" : "rgb(50, 50, 50)"};
    border: none;
    border-radius: 7px;
    color: white;
    outline: none;
    padding: 8px;

    &:hover {
      background-color: ${isSelected ? "rgb(204, 122, 0)" : "rgb(77, 77, 77)"};
    }
  `,

  icon: () => Emotion.css`
    align-self: center;
    color: white;
    font-size: 50px;
    justify-self: center;
  `,
} as const;

const CanvasHost = (props: { readonly children: HTMLCanvasElement }) => {
  const id = "CanvasHost";
  React.useLayoutEffect(() => {
    const canvasHostDiv = document.getElementById(id);
    if (canvasHostDiv && canvasHostDiv.parentNode) {
      canvasHostDiv.parentNode.replaceChild(props.children, canvasHostDiv);
    }
  }, []);
  return <div id={id} />;
};

const useRotationFunction = (rotateFn: () => void) => {
  const [isRotating, setIsRotating] = React.useState(false);
  const mouseDown = React.useCallback(() => setIsRotating(true), []);
  const mouseUp = React.useCallback(() => setIsRotating(false), []);
  React.useEffect(() => {
    if (isRotating) {
      const interval = setInterval(rotateFn, 1000 / 60);
      return () => clearInterval(interval);
    }
  }, [rotateFn, isRotating]);
  return [mouseDown, mouseUp];
};

const useRender = (
  renderer: Three.Renderer,
  scene: Three.Scene,
  camera: Three.Camera,
  onRender?: () => void,
) => {
  const render = React.useCallback(() => renderer.render(scene, camera), [
    renderer,
    scene,
    camera,
  ]);
  React.useEffect(() => {
    let isActive = true;
    const callback = () => {
      if (!isActive) return;
      if (onRender) onRender();
      render();
      requestAnimationFrame(callback);
    };
    callback();
    return () => {
      isActive = false;
    };
  }, [render, onRender]);
};

export const Page = () => {
  const renderer = React.useMemo(() => {
    const renderer = new Three.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
  }, []);

  const [isPerspectiveCamera, setIsPerspectiveCamera] = React.useState(false);
  const setPerspective = React.useCallback(
    () => setIsPerspectiveCamera(true),
    [],
  );
  const setOrthographic = React.useCallback(
    () => setIsPerspectiveCamera(false),
    [],
  );

  const [perspectiveCamera, orthographicCamera] = React.useMemo(() => {
    const perspectiveCamera = App.CreatePerspectiveCamera();
    perspectiveCamera.position.z = 6;
    const orthographicCamera = App.CreateOrthographicCamera();
    orthographicCamera.position.z = 6;
    return [perspectiveCamera, orthographicCamera];
  }, []);

  const onRender = React.useCallback(() => {
    const ratio = window.innerWidth / window.innerHeight;
    orthographicCamera.left = -5 * ratio;
    orthographicCamera.right = 5 * ratio;
    orthographicCamera.top = 5;
    orthographicCamera.bottom = -5;
    orthographicCamera.updateProjectionMatrix();
  }, [orthographicCamera]);

  const {
    scene,
    rotateUp,
    rotateDown,
    rotateLeft,
    rotateRight,
    loadObj,
  } = React.useMemo(makeScene, []);

  const selectModel = React.useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => loadObj(e.currentTarget.value),
    [loadObj],
  );

  useRender(
    renderer,
    scene,
    isPerspectiveCamera ? perspectiveCamera : orthographicCamera,
    onRender,
  );

  const [upMouseDown, upMouseUp] = useRotationFunction(rotateUp);
  const [downMouseDown, downMouseUp] = useRotationFunction(rotateDown);
  const [leftMouseDown, leftMouseUp] = useRotationFunction(rotateLeft);
  const [rightMouseDown, rightMouseUp] = useRotationFunction(rotateRight);

  return (
    <div style={{ minWidth: "100%", minHeight: "100%" }}>
      <div
        style={{ minWidth: "100%", minHeight: "100%", position: "absolute" }}
      >
        <select style={{ margin: 5 }} onChange={selectModel}>
          <option value="frog">frog</option>
          <option value="ship_00">ship_00</option>
        </select>
        <div>
          <button
            className={emo.button(isPerspectiveCamera)}
            onClick={setPerspective}
            style={{ marginRight: 5 }}
          >
            Perspective
          </button>
          <button
            className={emo.button(!isPerspectiveCamera)}
            onClick={setOrthographic}
          >
            Orthographic
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50px 50px 50px",
            gridTemplateRows: "50px 50px 50px",
            width: "min-content",
          }}
        >
          <i
            className={`fas fa-globe ${emo.icon()}`}
            style={{
              gridColumnStart: 2,
              gridRowStart: 2,
            }}
          />
          <i
            className={`fas fa-caret-up ${emo.arrow()}`}
            style={{
              gridColumnStart: 2,
              gridRowStart: 1,
            }}
            onMouseDown={upMouseDown}
            onMouseUp={upMouseUp}
            onMouseLeave={upMouseUp}
          />
          <i
            className={`fas fa-caret-right ${emo.arrow()}`}
            style={{
              gridColumnStart: 3,
              gridRowStart: 2,
            }}
            onMouseDown={rightMouseDown}
            onMouseUp={rightMouseUp}
            onMouseLeave={rightMouseUp}
          />
          <i
            className={`fas fa-caret-down ${emo.arrow()}`}
            style={{
              gridColumnStart: 2,
              gridRowStart: 3,
            }}
            onMouseDown={downMouseDown}
            onMouseUp={downMouseUp}
            onMouseLeave={downMouseUp}
          />
          <i
            className={`fas fa-caret-left ${emo.arrow()}`}
            style={{
              gridColumnStart: 1,
              gridRowStart: 2,
            }}
            onMouseDown={leftMouseDown}
            onMouseUp={leftMouseUp}
            onMouseLeave={leftMouseUp}
          />
        </div>
      </div>
      <CanvasHost>{renderer.domElement}</CanvasHost>;
    </div>
  );
};
