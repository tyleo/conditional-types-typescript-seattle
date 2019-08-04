import * as React from "react";

import * as Three from "three";

import * as App from "App";

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

  const light = new Three.PointLight(0xffffff, 1, 100);
  light.position.set(0, 0, 0);
  scene.add(light);

  const renderer = new Three.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  App.LoadObj("chr_fox").then(group => {
    group.position.set(-1, -2, -1);
    scene.add(group);
    renderer.render(scene, camera);
  });

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
