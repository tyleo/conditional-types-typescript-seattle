import * as React from "react";

import * as Emotion from "emotion";
import * as Three from "three";

import * as App from "App";

// CSS

// HTML

const makeScene = () => {
  //const camera = App.CreatePerspectiveCamera();
  const camera = App.CreateOrthographicCamera();
  camera.position.z = 6;

  const scene = new Three.Scene();

  const light = new Three.PointLight(0xffffff, 3, 100);
  light.position.set(0, 0, 2.5);
  scene.add(light);

  const renderer = new Three.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const root = new Three.Group();
  scene.add(root);
  renderer.render(scene, camera);
  //root.add(App.CreateGrid(10, 10, 10));

  App.LoadObj("ship_00").then(loaded => {
    const size = new Three.Box3()
      .setFromObject(loaded)
      .getSize(new Three.Vector3());
    loaded.position.set(0 - size.x / 2, -2 - size.y / 2, size.z / 2);

    root.add(loaded);

    renderer.render(scene, camera);
  });

  const rotationAmount = (3.14 * 2) / 3 / 60;
  const rotateUp = () => {
    //root.rotateX(-rotationAmount);
    root.rotateOnWorldAxis(new Three.Vector3(1, 0, 0), -rotationAmount);
    renderer.render(scene, camera);
  };

  const rotateDown = () => {
    //root.rotateX(+rotationAmount);
    root.rotateOnWorldAxis(new Three.Vector3(1, 0, 0), rotationAmount);
    renderer.render(scene, camera);
  };

  const rotateLeft = () => {
    //root.rotateY(-rotationAmount);
    root.rotateOnWorldAxis(new Three.Vector3(0, 1, 0), -rotationAmount);
    renderer.render(scene, camera);
  };

  const rotateRight = () => {
    //root.rotateY(rotationAmount);
    root.rotateOnWorldAxis(new Three.Vector3(0, 1, 0), rotationAmount);
    renderer.render(scene, camera);
  };

  return {
    element: renderer.domElement,
    rotateUp,
    rotateDown,
    rotateLeft,
    rotateRight,
  };
};

const emo = {
  arrow: () => Emotion.css`{
    align-self: center;
    color: white;
    font-size: 50px;
    justify-self: center;

    &:hover {
      text-shadow: 0 0 20px white;
    }
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
export const Page = () => {
  const {
    element,
    rotateUp,
    rotateDown,
    rotateLeft,
    rotateRight,
  } = React.useMemo(makeScene, []);

  const [upMouseDown, upMouseUp] = useRotationFunction(rotateUp);
  const [downMouseDown, downMouseUp] = useRotationFunction(rotateDown);
  const [leftMouseDown, leftMouseUp] = useRotationFunction(rotateLeft);
  const [rightMouseDown, rightMouseUp] = useRotationFunction(rotateRight);

  return (
    <div style={{ minWidth: "100%", minHeight: "100%" }}>
      <div
        style={{ minWidth: "100%", minHeight: "100%", position: "absolute" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50px 50px 50px",
            gridTemplateRows: "50px 50px 50px",
            width: "min-content",
          }}
        >
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
      <CanvasHost>{element}</CanvasHost>;
    </div>
  );
};
