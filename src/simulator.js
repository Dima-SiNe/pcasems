import './simulator.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd6f0ff);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 60, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, -5);
controls.minDistance = 30;
controls.maxDistance = 150;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 0.5;
controls.panSpeed = 0.5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let latestMouseEvent = null;

const tooltip = document.getElementById('tooltip');
let hoveredObject = null;

const interactiveModels = []; // Для хранения объектов не собранных
const allModels = []; // Для хранения всех объектов
const mustBeInstalled = new Set(); // Для хранения названий объектов, которые должны быть установлены
const installedComponents = new Set(); // Установлен ли тот или иной компонент

scene.add(new THREE.AmbientLight(0xffffff, 0.25));

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight1.position.set(20, 40, 20);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight2.position.set(-30, -50, -30);
scene.add(directionalLight2);

const loader = new GLTFLoader();

function addInteractiveModel({ path, name }) {
  loader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      model.name = name;
      model.scale.set(1, 1, 1);

      const inGamePcPattern = /models\/In Game PC/i;

      if(inGamePcPattern.test(path)){
        mustBeInstalled.add(name);
        
        const casePattern = /models\/In Game PC\/Case/i;
        const wirePattern = /wire/i;
        
        // Если есть "Case" после "models/In Game PC/"
        if (casePattern.test(path)) {
          // Если есть "Case" после "models/In Game PC/" и есть "wire"
          if (wirePattern.test(path)) model.visible = false;
          // Если есть "Case" после "models/In Game PC/", но нет "wire"
          else installedComponents.add(name);
        }
        // Если нет "Case" после "models/In Game PC/"
        else model.visible = false;
      }

      scene.add(model);
      interactiveModels.push(model);
      allModels.push(model);
    },
    undefined,
    (err) => {
      console.error(`Ошибка загрузки ${name}:`, err);
    }
  );
}

function addAllModel({ path, name }) {
  loader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      model.name = name;
      model.scale.set(1, 1, 1);
      scene.add(model);
      allModels.push(model);
    },
    undefined,
    (err) => {
      console.error(`Ошибка загрузки ${name}:`, err);
    }
  );
}

addInteractiveModel({ path: 'models/Items/Cooler CPU component.glb', name: 'Кулер для процессора (не установлен)' });
addInteractiveModel({ path: 'models/Items/CPU component.glb', name: 'Процессор (не установлен)' });
addInteractiveModel({ path: 'models/Items/HDD component.glb', name: 'HDD накопитель (не установлен)' });
addInteractiveModel({ path: 'models/Items/Memory component.glb', name: 'Оперативная память (не установлена)' });
addInteractiveModel({ path: 'models/Items/Motherboard component.glb', name: 'Материнская плата (не установлена)' });
addInteractiveModel({ path: 'models/Items/Power supply component.glb', name: 'Блок питания (не установлен)' });
addInteractiveModel({ path: 'models/Items/Screwdriver.glb', name: 'Отвертка' });
addInteractiveModel({ path: 'models/Items/SSD component.glb', name: 'SSD M.2 накопитель (не установлен)' });
addInteractiveModel({ path: 'models/Items/Thermal paste.glb', name: 'Термопаста' });
addInteractiveModel({ path: 'models/Items/Videocard component.glb', name: 'Видеокарта (не установлена)' });

addAllModel({ path: 'models/Items/Table.glb', name: 'Стол' });

addInteractiveModel({ path: 'models/In Game PC/Case audio wire.glb', name: 'Провода от аудио разъемов' });
addInteractiveModel({ path: 'models/In Game PC/Case audio.glb', name: 'Аудио разъемы' });
addInteractiveModel({ path: 'models/In Game PC/Case back fan wire.glb', name: 'Провод от заднего вентилятора' });
addInteractiveModel({ path: 'models/In Game PC/Case back fan.glb', name: 'Задний вентилятор' });
addInteractiveModel({ path: 'models/In Game PC/Case buttons wire.glb', name: 'Провод от кнопок и индикаторов' });
addInteractiveModel({ path: 'models/In Game PC/Case buttons.glb', name: 'Кнопки и индикаторы' });
addInteractiveModel({ path: 'models/In Game PC/Case front fan wire.glb', name: 'Провод от переднего вентилятора' });
addInteractiveModel({ path: 'models/In Game PC/Case front fan.glb', name: 'Передний вентилятор' });
addInteractiveModel({ path: 'models/In Game PC/Case HDD screw slot.glb', name: 'Место для крепления HDD' });
addInteractiveModel({ path: 'models/In Game PC/Case motherboard slot.glb', name: 'Место для крепления материнской платы' });
addInteractiveModel({ path: 'models/In Game PC/Case power supply slot.glb', name: 'Место для крепления блока питания' });
addInteractiveModel({ path: 'models/In Game PC/Case usb2 wire.glb', name: 'Провод от разъемов USB 2.0' });
addInteractiveModel({ path: 'models/In Game PC/Case usb2.glb', name: 'Разъемы USB 2.0' });
addInteractiveModel({ path: 'models/In Game PC/Case usb3 wire.glb', name: 'Провод от разъема USB 3.0' });
addInteractiveModel({ path: 'models/In Game PC/Case usb3.glb', name: 'Разъем USB 3.0' });
addInteractiveModel({ path: 'models/In Game PC/Case videocard screw slot.glb', name: 'Место для крепления видеокарты' });
addInteractiveModel({ path: 'models/In Game PC/Case.glb', name: 'Корпус' });
addInteractiveModel({ path: 'models/In Game PC/Cooler CPU screw.glb', name: 'Винты крепления кулера' });
addInteractiveModel({ path: 'models/In Game PC/Cooler CPU wire.glb', name: 'Провод от кулера' });
addInteractiveModel({ path: 'models/In Game PC/Cooler CPU.glb', name: 'Кулер для процессора' });
addInteractiveModel({ path: 'models/In Game PC/CPU thermal paste.glb', name: 'Нанесенная термопаста' });
addInteractiveModel({ path: 'models/In Game PC/CPU.glb', name: 'Процессор' });
addInteractiveModel({ path: 'models/In Game PC/HDD motherboard wire.glb', name: 'Провод от HDD' });
addInteractiveModel({ path: 'models/In Game PC/HDD screw.glb', name: 'Винт крепления HDD' });
addInteractiveModel({ path: 'models/In Game PC/HDD.glb', name: 'HDD накопитель' });
addInteractiveModel({ path: 'models/In Game PC/Memory.glb', name: 'Оперативная память' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard 24pin power slot.glb', name: '24-pin разъем' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard back fan slot.glb', name: 'Разъем для подключения вентилятора\n(Передний вентилятор не дотягивается)' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard case audio slot.glb', name: 'Разъем для подключения аудио' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard case buttons slot.glb', name: 'Разъем для подключения кнопок и индикаторов' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard case usb2 slot.glb', name: 'Разъем для подключения USB 2.0' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard case usb3 slot.glb', name: 'Разъем для подключения USB 3.0' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard Cooler CPU screw slot.glb', name: 'Место для крепления кулера' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard Cooler CPU wire slot.glb', name: 'Разъем для подключения кулера' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard CPU power slot.glb', name: 'Разъем для подключения питания процессора' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard CPU slot.glb', name: 'Разъем для подключения процессора' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard fan slot.glb', name: 'Разъем для подключения вентилятора\n(Задний и передний вентиляторы не дотягиваются)' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard front fan slot.glb', name: 'Разъем для подключения вентилятора\n(Задний вентилятор не дотягивается)' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard HDD slot.glb', name: 'Разъем для подключения HDD' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard memory slot.glb', name: 'Разъем для подключения оперативной памяти' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard screw.glb', name: 'Винты крепления материнской платы' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard SSD screw slot.glb', name: 'Место для крепления SSD' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard SSD slot.glb', name: 'Разъем для подключения SSD' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard videocard slot.glb', name: 'Разъем для подключения видеокарты' });
addInteractiveModel({ path: 'models/In Game PC/Motherboard.glb', name: 'Материнская плата' });
addInteractiveModel({ path: 'models/In Game PC/Power supply 24pin wire.glb', name: 'Провод питания для 24-pin разъема' });
addInteractiveModel({ path: 'models/In Game PC/Power supply CPU wires.glb', name: 'Провода питания процессора' });
addInteractiveModel({ path: 'models/In Game PC/Power supply HDD wire.glb', name: 'Провод питания HDD' });
addInteractiveModel({ path: 'models/In Game PC/Power supply screw.glb', name: 'Винты крепления блока питания' });
addInteractiveModel({ path: 'models/In Game PC/Power supply videocard wires.glb', name: 'Провод питания видеокарты' });
addInteractiveModel({ path: 'models/In Game PC/Power supply.glb', name: 'Блок питания' });
addInteractiveModel({ path: 'models/In Game PC/SSD screw.glb', name: 'Винт крепеления SSD' });
addInteractiveModel({ path: 'models/In Game PC/SSD.glb', name: 'SSD M.2 накопитель' });
addInteractiveModel({ path: 'models/In Game PC/Videocard power slot.glb', name: 'Разъем для подключения питания видеокарты' });
addInteractiveModel({ path: 'models/In Game PC/Videocard screw.glb', name: 'Винты крепления видеокарты' });
addInteractiveModel({ path: 'models/In Game PC/Videocard.glb', name: 'Видеокарта' });

function isOnUI(target) {
  // Проверяем, есть ли среди родителей элементы UI
  return target.closest('#menu') !== null ||
         target.closest('#successModal') !== null ||
         target.closest('#notifications-container') !== null ||
         target.closest('#error-counter') !== null;
}

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

window.addEventListener('mousemove', (event) => {
  if (isOnUI(event.target)) return;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  latestMouseEvent = event;
});

// Проверка видимости объекта и всех родителей
function isHierarchyVisible(obj) {
  for (let current = obj; current; current = current.parent) {
    if (!current.visible) return false;
  }
  return true;
}

// Получение видимых мешей из массива объектов
function getVisibleObjects(objects) {
  const visible = [];
  objects.forEach(obj =>
    obj.traverse(node => {
      if (node.isMesh && isHierarchyVisible(node)) visible.push(node);
    })
  );
  return visible;
}

// Функция для изменения подсветки объекта
function setEmissive(object, color = 0x000000, intensity = 0) {
  object.traverse(child => {
    if (child.isMesh && child.material?.emissive) {
      child.material.emissive.set(color);
      child.material.emissiveIntensity = intensity;
    }
  });
}

// Очистка подсветки и скрытие тултипа
function clearHover() {
  if (hoveredObject && hoveredObject !== selectedComponent) {
    setEmissive(hoveredObject);
  }
  hoveredObject = null;
  tooltip.style.display = 'none';
}

function animate() {
  controls.update();
  raycaster.setFromCamera(mouse, camera);

  // Только видимые объекты участвуют
  const visibleMeshes = getVisibleObjects(allModels);
  const intersects = raycaster.intersectObjects(visibleMeshes, true);

  if (intersects.length > 0) {
    let firstHit = intersects[0].object;

    while (firstHit.parent && !interactiveModels.includes(firstHit)) {
      firstHit = firstHit.parent;
    }

    // Только если объект видим
    if (interactiveModels.includes(firstHit) && firstHit.visible) {
      if (hoveredObject !== firstHit) {
        if (hoveredObject && hoveredObject !== selectedComponent) setEmissive(hoveredObject);

        hoveredObject = firstHit;

        if (hoveredObject !== selectedComponent) setEmissive(hoveredObject, 0x9aceeb, 0.2);
      }

      if (latestMouseEvent) {
        const tooltipPadding = 10;

        // Устанавливаем текст, чтобы измерить
        tooltip.innerText = hoveredObject.name || 'Без названия';
        tooltip.style.display = 'block';

        // Теперь измеряем реальные размеры
        const tooltipRect = tooltip.getBoundingClientRect();
        const pageWidth = window.innerWidth;
        const pageHeight = window.innerHeight;

        let left = latestMouseEvent.clientX + tooltipPadding;
        let top = latestMouseEvent.clientY + tooltipPadding;

        if (left + tooltipRect.width > pageWidth) {
          left = latestMouseEvent.clientX - tooltipRect.width - tooltipPadding;
        }

        if (top + tooltipRect.height > pageHeight) {
          top = latestMouseEvent.clientY - tooltipRect.height - tooltipPadding;
        }

        // Устанавливаем финальные координаты
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      }
    } else {
      clearHover();
    }
  } else {
    clearHover();
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

let errors = 0;

function incrementErrors() {
  const counter = document.getElementById('error-counter');
  counter.textContent = `Ошибки: ${++errors}`;
}

let selectedComponent = null; // Хранит выбранный интерактивный компонент

const assemblyRules = [ //Набор правил подключения
  {
    selectedName: 'Кулер для процессора (не установлен)',
    targetName: 'Место для крепления кулера',
    show: ['Кулер для процессора'],
    requires: ['Нанесенная термопаста'],
    selectedVisible: false
  },
  {
    selectedName: 'Процессор (не установлен)',
    targetName: 'Разъем для подключения процессора',
    show: ['Процессор'],
    requires: ['Винты крепления материнской платы'],
    selectedVisible: false
  },
  {
    selectedName: 'HDD накопитель (не установлен)',
    targetName: 'Место для крепления HDD',
    show: ['HDD накопитель'],
    requires: [],
    selectedVisible: false
  },
  {
    selectedName: 'Оперативная память (не установлена)',
    targetName: 'Разъем для подключения оперативной памяти',
    show: ['Оперативная память'],
    requires: ['Винты крепления материнской платы'],
    selectedVisible: false
  },
  {
    selectedName: 'Материнская плата (не установлена)',
    targetName: 'Место для крепления материнской платы',
    show: ['Материнская плата','Разъем для подключения видеокарты','Разъем для подключения SSD',
      'Место для крепления SSD','Разъем для подключения оперативной памяти','Разъем для подключения HDD',
      'Разъем для подключения вентилятора\n(Задний вентилятор не дотягивается)','Разъем для подключения вентилятора\n(Задний и передний вентиляторы не дотягиваются)',
      'Разъем для подключения процессора','Разъем для подключения питания процессора','Разъем для подключения кулера',
      'Место для крепления кулера','Разъем для подключения USB 3.0','Разъем для подключения USB 2.0',
      'Разъем для подключения кнопок и индикаторов','Разъем для подключения аудио','Разъем для подключения вентилятора\n(Передний вентилятор не дотягивается)','24-pin разъем'],
    requires: [],
    selectedVisible: false
  },
  {
    selectedName: 'Блок питания (не установлен)',
    targetName: 'Место для крепления блока питания',
    show: ['Блок питания'],
    requires: [],
    selectedVisible: false
  },
  {
    selectedName: 'SSD M.2 накопитель (не установлен)',
    targetName: 'Разъем для подключения SSD',
    show: ['SSD M.2 накопитель'],
    requires: ['Винты крепления материнской платы'],
    selectedVisible: false
  },
  {
    selectedName: 'Видеокарта (не установлена)',
    targetName: 'Разъем для подключения видеокарты',
    show: ['Видеокарта','Разъем для подключения питания видеокарты'],
    requires: ['Винты крепления материнской платы'],
    selectedVisible: false
  },
  {
    selectedName: 'Отвертка',
    targetName: 'Место для крепления кулера',
    show: ['Винты крепления кулера'],
    requires: ['Кулер для процессора'],
    selectedVisible: true
  },
  {
    selectedName: 'Отвертка',
    targetName: 'Место для крепления HDD',
    show: ['Винт крепления HDD'],
    requires: ['HDD накопитель'],
    selectedVisible: true
  },
  {
    selectedName: 'Отвертка',
    targetName: 'Место для крепления материнской платы',
    show: ['Винты крепления материнской платы'],
    requires: ['Материнская плата'],
    selectedVisible: true
  },
  {
    selectedName: 'Отвертка',
    targetName: 'Место для крепления блока питания',
    show: ['Винты крепления блока питания'],
    requires: ['Блок питания'],
    selectedVisible: true
  },
  {
    selectedName: 'Отвертка',
    targetName: 'Место для крепления SSD',
    show: ['Винт крепеления SSD'],
    requires: ['SSD M.2 накопитель'],
    selectedVisible: true
  },
  {
    selectedName: 'Отвертка',
    targetName: 'Место для крепления видеокарты',
    show: ['Винты крепления видеокарты'],
    requires: ['Видеокарта'],
    selectedVisible: true
  },
  {
    selectedName: 'Термопаста',
    targetName: 'Процессор',
    show: ['Нанесенная термопаста'],
    requires: [],
    selectedVisible: false
  },
  //тут подключение проводов
  {
    selectedName: 'Аудио разъемы',
    targetName: 'Разъем для подключения аудио',
    show: ['Провода от аудио разъемов'],
    requires: ['Винты крепления материнской платы'],
    selectedVisible: true
  },
  {
    selectedName: 'Задний вентилятор',
    targetName: 'Разъем для подключения вентилятора\n(Передний вентилятор не дотягивается)',
    show: ['Провод от заднего вентилятора'],
    requires: ['Винты крепления материнской платы'],
    selectedVisible: true
  },
  {
    selectedName: 'Кнопки и индикаторы',
    targetName: 'Разъем для подключения кнопок и индикаторов',
    show: ['Провод от кнопок и индикаторов'],
    requires: ['Винты крепления материнской платы'],
    selectedVisible: true
  },
  {
    selectedName: 'Передний вентилятор',
    targetName: 'Разъем для подключения вентилятора\n(Задний вентилятор не дотягивается)',
    show: ['Провод от переднего вентилятора'],
    requires: ['Винты крепления материнской платы'],
    selectedVisible: true
  },
  {
    selectedName: 'Разъемы USB 2.0',
    targetName: 'Разъем для подключения USB 2.0',
    show: ['Провод от разъемов USB 2.0'],
    requires: ['Винты крепления материнской платы'],
    selectedVisible: true
  },
  {
    selectedName: 'Разъем USB 3.0',
    targetName: 'Разъем для подключения USB 3.0',
    show: ['Провод от разъема USB 3.0'],
    requires: ['Винты крепления материнской платы'],
    selectedVisible: true
  },
  {
    selectedName: 'Кулер для процессора',
    targetName: 'Разъем для подключения кулера',
    show: ['Провод от кулера'],
    requires: ['Винты крепления кулера'],
    selectedVisible: true
  },
  {
    selectedName: 'HDD накопитель',
    targetName: 'Разъем для подключения HDD',
    show: ['Провод от HDD'],
    requires: ['Винт крепления HDD','Винты крепления материнской платы'],
    selectedVisible: true
  },
  {
    selectedName: 'Блок питания',
    targetName: '24-pin разъем',
    show: ['Провод питания для 24-pin разъема'],
    requires: ['Винты крепления блока питания','Винты крепления материнской платы'],
    selectedVisible: true
  },
  {
    selectedName: 'Блок питания',
    targetName: 'Разъем для подключения питания процессора',
    show: ['Провода питания процессора'],
    requires: ['Винты крепления блока питания','Винты крепления материнской платы'],
    selectedVisible: true
  },
  {
    selectedName: 'Блок питания',
    targetName: 'HDD накопитель',
    show: ['Провод питания HDD'],
    requires: ['Винты крепления блока питания','Винт крепления HDD'],
    selectedVisible: true
  },
  {
    selectedName: 'Блок питания',
    targetName: 'Разъем для подключения питания видеокарты',
    show: ['Провод питания видеокарты'],
    requires: ['Винты крепления блока питания','Винты крепления видеокарты'],
    selectedVisible: true
  },
];

function showNotification(message, type) {
  const container = document.getElementById('notifications-container');

  const notification = document.createElement('div');
  notification.classList.add('notification', type);
  notification.textContent = message;

  container.appendChild(notification);

  // Удалить через 4 секунды
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

let isDragging = false;

window.addEventListener('mousedown', (event) => {
  if (isOnUI(event.target)) return;
  if (event.button !== 0) return; // Только ЛКМ

  isDragging = false;

  const onMouseMove = () => {
    window.removeEventListener('mousemove', onMouseMove);

    isDragging = true;
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    // Выполняем логику клика только если не было движения мыши
    if (!isDragging) {
      raycaster.setFromCamera(mouse, camera);

      const visibleMeshes = getVisibleObjects(allModels);
      const intersects = raycaster.intersectObjects(visibleMeshes, true);

      if (intersects.length === 0) {
        if (selectedComponent){
          setEmissive(selectedComponent);
          selectedComponent = null;
        }
        return;
      }

      let clickedObject = intersects[0].object;

      // Найти родительскую модель
      while (clickedObject.parent && !interactiveModels.includes(clickedObject)) {
        clickedObject = clickedObject.parent;
      }

      // 1. Нажали на одну и ту же модельку
      if (selectedComponent && selectedComponent == clickedObject) {
        setEmissive(selectedComponent);
        selectedComponent = null;
        return;
      }

      // 2. Нажали на модельку interactiveModels
      if (interactiveModels.includes(clickedObject)) {
        // До этого выбрана моделька
        if (selectedComponent) {
          const rule = assemblyRules.find(r =>
            r.selectedName.toLowerCase() === selectedComponent.name.toLowerCase() &&
            r.targetName.toLowerCase() === clickedObject.name.toLowerCase()
          );

          if (rule) {
            if (rule.show.every(showName => installedComponents.has(showName))) {
              setEmissive(selectedComponent);
              selectedComponent = null;
              return;
            }

            const unmetDeps = rule.requires.filter(dep => !installedComponents.has(dep));
            if (unmetDeps.length > 0) {
              setEmissive(selectedComponent);
              selectedComponent = null;
              showNotification('Ошибка: Вы еще не все предворительные действия сделали.', 'error');
              incrementErrors();
              return;
            }

            rule.show.forEach(showName => {
              installedComponents.add(showName);
              const toShow = interactiveModels.find(m => m.name.toLowerCase() === showName.toLowerCase());
              if (toShow) toShow.visible = true;
            });

            if (!rule.selectedVisible) selectedComponent.visible = false;

            // Убираем подсветку после установки
            setEmissive(selectedComponent);
            selectedComponent = null;
            showNotification('Успех: Вы сделали все правильно.', 'success');
            return;
          } else {
            setEmissive(selectedComponent);
            selectedComponent = null;
            showNotification('Ошибка: Вы сделали неправильное действие.', 'error');
            incrementErrors();
            return;
          }
        }
        // До этого не выбрана моделька
        else {
          selectedComponent = clickedObject;
          setEmissive(selectedComponent, 0x00e695, 0.3);
        };
      }
      // 3. Выбран не интерактивный объект
      if (selectedComponent && !interactiveModels.includes(clickedObject)) {
        setEmissive(selectedComponent);
        selectedComponent = null;
        return;
      }
    }
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
});

window.goMain = function () {
  // Перейти на главную страницу сайта
  window.location.href = '/';
}

window.doRestart = function () {
  // Перезагрузка страницы
  location.reload();
}

function showSuccessModal(errorsCount) {
  const modal = document.getElementById("successModal");
  const modalBody = modal.querySelector(".modal-body p");

  let message = ``;
  
  if (errorsCount === 0 ) {
    message += `Безупречно! Ты не допустил ни единой ошибки!<br><br>`;
  }
  else if (errorsCount <= 3) {
    message += `Отличная работа! Ты почти не ошибался!<br><br>`;
  } else if (errorsCount <= 5) {
    message += `Хороший результат, но все еще есть над чем поработать.<br><br>`;
  } else if (errorsCount <= 10) {
    message += `ПК собран, но постарайся быть внимательнее в следующий раз.<br><br>`;
  } else {
    message += `Собрать компьютер удалось, но допущено много ошибок.<br><br>`;
  }

  message += `Количество допущенных ошибок в процессе: ${errorsCount}`;

  modalBody.innerHTML = message;
  modal.style.display = "block";
}

window.closeSuccess = function () {
  // Переход на главную
  window.location.href = '/';
}

window.checkReadiness = function () {
  // Находим те обязательные элементы, которых ещё нет в собранных
  const missing = Array.from(mustBeInstalled).filter(
    name => !installedComponents.has(name)
  );

  if (missing.length === 0) {
    // Все обязательные элементы установлены
    showSuccessModal(errors);
  } else {
    // Есть неустановленные элементы — показываем их список
    incrementErrors();
    showNotification('Компьютер еще не полностью собран!', 'error');
  }
}