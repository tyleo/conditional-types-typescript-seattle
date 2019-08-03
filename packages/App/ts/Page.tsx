import * as React from "react";

import * as Three from "three";

// CSS

// HTML

const perspectiveRenderer = () => {
  const camera = new Three.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10,
  );
  camera.position.z = 1;

  const scene = new Three.Scene();

  const geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
  const material = new Three.MeshNormalMaterial();

  const mesh = new Three.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new Three.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  return renderer.domElement;
};

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

export const Page = () => {
  const renderer = React.useMemo(perspectiveRenderer, []);
  return <CanvasHost>{renderer}</CanvasHost>;
};
