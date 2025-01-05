import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

const canvas = document.querySelector("#container3D");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  10,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 13;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true, // remove default black background color of scene to show HTML content
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Object
 */
let bee;
let mixer;

const loader = new GLTFLoader();
loader.load("./static/models/demon_bee_full_texture.glb", (gltf) => {
  bee = gltf.scene;
  scene.add(bee);
  modelMove();

  mixer = new THREE.AnimationMixer(bee);
  const flyAction = mixer.clipAction(gltf.animations[0]);
  flyAction.play();
});

/**
 * Light - Create both ambient light and direction light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
scene.add(directionalLight);

const reRender3D = () => {
  // Update animation
  if (mixer) {
    mixer.update(0.02);
  }
  //Update frame
  renderer.render(scene, camera);

  requestAnimationFrame(reRender3D);
};

reRender3D();

/**
 * Store the position information of bee on each section
 */
const arrPositionModel = [
  {
    id: "banner",
    position: { x: 0, y: -1, z: 0 },
    rotation: { x: 0, y: 1.5, z: 0 },
  },
  {
    id: "intro",
    position: { x: 1, y: -1, z: -15 },
    rotation: { x: 0.5, y: -0.5, z: 0 },
  },
  {
    id: "description",
    position: { x: -1, y: 0, z: -5 },
    rotation: { x: 0, y: 1, z: 0 },
  },
  {
    id: "contact",
    position: { x: 0.8, y: -1, z: -8 },
    rotation: { x: 0.3, y: -0.5, z: 0 },
  },
];

const modelMove = () => {
  const sections = document.querySelectorAll(".section");

  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= sizes.height / 3) {
      currentSection = section.id;
    }
  });
  console.log(currentSection);

  let position_active = arrPositionModel.findIndex(
    (val) => val.id == currentSection
  );

  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];
    gsap.to(bee.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: "power1.out",
    });
    gsap.to(bee.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 3,
      ease: "power1.out",
    });
  }
};

window.addEventListener("scroll", () => {
  if (bee) {
    modelMove();
  }
});

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
