import * as THREE from "three";
import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";

const container = document.getElementById("ascii-container");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const effect = new AsciiEffect(renderer, " .:-=+*#%@", { invert: true });
effect.setSize(window.innerWidth, window.innerHeight);
effect.domElement.style.color = "#fff";
effect.domElement.style.backgroundColor = "#0d6efd";
effect.domElement.style.width = "100%";
effect.domElement.style.height = "100%";
effect.domElement.style.display = "block";
effect.domElement.style.maxWidth = "100%";
effect.domElement.style.maxHeight = "100%";
effect.domElement.style.overflow = "hidden";
container.style.overflow = "hidden";
container.style.display = "flex";
container.style.alignItems = "center";
container.style.justifyContent = "center";
container.appendChild(effect.domElement);

const waveGeometry = new THREE.PlaneGeometry(20, 10, 240, 140);
const waveMaterial = new THREE.MeshPhongMaterial({ color: 0x0d6efd, shininess: 80, side: THREE.DoubleSide, flatShading: true });
const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
scene.add(waveMesh);

const basePositions = waveGeometry.attributes.position.array.slice();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
directionalLight.position.set(2, 4, 5);
scene.add(directionalLight);

const clock = new THREE.Clock();

function render() {
    requestAnimationFrame(render);
    const elapsed = clock.getElapsedTime();
    const positions = waveGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const ix = i * 3;
        const x = basePositions[ix];
        const y = basePositions[ix + 1];
        const wave = Math.sin(x * 0.9 + elapsed * 1.4) + Math.cos(y * 1.6 + elapsed * 1.1);
        positions.array[ix + 2] = wave * 0.18;
    }
    positions.needsUpdate = true;
    waveGeometry.computeVertexNormals();
    effect.render(scene, camera);
}

render();

window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    effect.setSize(width, height);
});