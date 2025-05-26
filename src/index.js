import './index.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd6f0ff); // светло-голубой фон

// Камера
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);

// Центр вращения камеры
const center = new THREE.Vector3(0, 0, -10);
let angle = 0; // Начальный угол
let direction = 1; // Направление вращения (1 или -1)
const radius = 70; // Радиус от центра до камеры
const height = 70; // Высота камеры

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Освещение ===
// Мягкое равномерное освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

// Яркий направленный дневной свет
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(20, 40, 20);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight2.position.set(-30, -50, -30);
scene.add(directionalLight2);

// === Загрузка стола и размещение комплектующих ===
// Загрузчик моделей
const loader = new GLTFLoader();

loader.load('models/Items/Table.glb', (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  scene.add(gltf.scene);
}, undefined, (err) => {
  console.error('Ошибка загрузки Table:', err);
});

loader.load('models/Items/Screwdriver.glb', (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  scene.add(gltf.scene);
}, undefined, (err) => {
  console.error('Ошибка загрузки Screwdriver:', err);
});

loader.load('models/Items/Thermal paste.glb', (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  scene.add(gltf.scene);
}, undefined, (err) => {
  console.error('Ошибка загрузки Thermal paste:', err);
});

loader.load('models/Start PC/Start PC.glb', (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  scene.add(gltf.scene);
}, undefined, (err) => {
  console.error('Ошибка загрузки Start PC:', err);
});

// === Адаптация окна ===
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// === Анимация ===
function animate() {
  angle += 0.0005 * direction;

    if (angle > Math.PI / 8 || angle < -Math.PI / 8) {
      direction *= -1;
    }

    camera.position.x = center.x + radius * Math.sin(angle);
    camera.position.z = center.z + radius * Math.cos(angle);
    camera.position.y = height;
    camera.lookAt(center);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Начать
window.startGame = function () {
  window.location.href = import.meta.env.BASE_URL + 'simulator.html';
};

// Правила
window.showRules = function () {
  document.getElementById('rulesModal').classList.add('show');
};

window.closeRules = function () {
  document.getElementById('rulesModal').classList.remove('show');
};

// Закрытие по клику вне модального окна
window.onclick = function (event) {
  const modal = document.getElementById('rulesModal');
  if (event.target === modal) {
    modal.classList.remove('show');
  }
};