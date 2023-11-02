import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e1adf7');

// Groups
const textGroup = new THREE.Group();
const torusGroup = new THREE.Group();
scene.add(torusGroup);
const boxGroup = new THREE.Group();
scene.add(boxGroup);

gui.add(torusGroup, 'visible').name('Toggle Donuts');
gui.add(boxGroup, 'visible').name('Toggle Boxes');

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/normals/RV_1_Normal set02.png");

// Fonts
const fontLoader = new FontLoader();
fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
  const text1Geometry = new TextGeometry("Creative Developer", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  text1Geometry.computeBoundingBox();
  text1Geometry.center();

  const text2Geometry = new TextGeometry("Full Stack Engineer", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  text2Geometry.computeBoundingBox();
  text2Geometry.center();

  const text3Geometry = new TextGeometry("Inquisitive Human", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  text3Geometry.computeBoundingBox();
  text3Geometry.center();

  const material = new THREE.MeshNormalMaterial({
    map: texture,
  });

  const text1Mesh = new THREE.Mesh(text1Geometry, material);
  textGroup.add(text1Mesh);
  const text2Mesh = new THREE.Mesh(text2Geometry, material);
  text2Mesh.position.y = -0.8;
  textGroup.add(text2Mesh);
  const text3Mesh = new THREE.Mesh(text3Geometry, material);
  text3Mesh.position.y = -1.6;
  textGroup.add(text3Mesh);
  scene.add(textGroup);

  const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

  for (let i = 0; i < 150; i++) {
    const torusMesh = createMesh(torusGeometry, material);

    if (torusMesh.position.distanceTo(text2Mesh.position) > 4) {
      scene.add(torusMesh);
      torusGroup.add(torusMesh);
    }
    const boxMesh = createMesh(boxGeometry, material);

    if (boxMesh.position.distanceTo(text2Mesh.position) > 4) {
      scene.add(boxMesh);
      boxGroup.add(boxMesh);
    }
  }
});

function createMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 20;
  mesh.position.y = (Math.random() - 0.5) * 20;
  mesh.position.z = (Math.random() - 0.5) * 20;

  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;

  const min = 0.1;
  const max = 0.5;

  const scale = Math.random() * (max - min) + min;
  mesh.scale.set(scale, scale, scale);

  return mesh;
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 6;
scene.add(camera);

const ambientLight = new THREE.AmbientLight("white", 1);
scene.add(ambientLight);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const targetRotation = { x: Math.PI, y: Math.PI, z: Math.PI };

gsap.to(textGroup.rotation, {
  duration: 40,
  y: 1,
  repeat: -1,
});

gsap.to(torusGroup.rotation, {
  duration: 200,
  x: targetRotation.x,
  y: targetRotation.y,
  z: targetRotation.z,
  repeat: -1,
});

gsap.to(boxGroup.rotation, {
  duration: 200,
  x: -targetRotation.x,
  y: -targetRotation.y,
  z: -targetRotation.z,
  repeat: -1,
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
