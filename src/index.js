import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // загрузчк для загрузки моделей
import init from './init';

import './style.css';

const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.set(0, 2, 5);

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: '#444444',
		metalness: 0,
		roughness: 0.5,
	}),
); // створюємо плоскість

floor.receiveShadow = true; // дозволяємо тіні
floor.rotation.x = -Math.PI * 0.5; // повертаємо плоскість для кращого відображення
scene.add(floor); //додаємо плоскість на сцену

// Сцену не буде видно, бо ми працюємо з тінями. Для того, щоб нашу сцену було видно, додаємо джерело світла:

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61); // додаємо напівсферичне джерело світла
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.54); // додаємо направлене джерело світла
dirLight.position.set(-0.8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight);

let mixer = null;

const loader = new GLTFLoader(); //приймає 4 параметри: шлях до файлу, колбек на успішне завантаження, колбек, якй викликається під час загрузки, і колбек на помилку
loader.load(
	'models/BrainStem/BrainStem.gltf',
	(gltf) => {
		// gltf.scene.scale.set(5, 5, 5); // збільшуємо розміри
		mixer = new THREE.AnimationMixer(gltf.scene);
		const action = mixer.clipAction(gltf.animations[0]); // передаємо анімацію - вона в нас всього одна на цій моделі
		action.play();
		scene.add(gltf.scene);
	},
	(progress) => {
		console.log('progress');
		console.log(progress);
	},
	(error) => {
		console.log('error');
		console.log(error);
	},
);
/*
loader.load(
	'models/Avocado/Avocado.gltf',
	(gltf) => {
		console.log('success');
		console.log(gltf);
		gltf.scene.scale.set(30, 30, 30); // збільшуємо розміри
		scene.add(gltf.scene);
	},
	(progress) => {
		console.log('progress');
		console.log(progress);
	},
	(error) => {
		console.log('error');
		console.log(error);
	},
);

loader.load(
	'models/FlightHelmet/FlightHelmet.gltf',
	(gltf) => {
		console.log('success');
		console.log(gltf);
		gltf.scene.scale.set(5, 5, 5); // збільшуємо розміри
		scene.add(gltf.scene);
	},
	(progress) => {
		console.log('progress');
		console.log(progress);
	},
	(error) => {
		console.log('error');
		console.log(error);
	},
);
*/

const clock = new THREE.Clock(); // додаємо годинник для вирахування дельти по тіках і обновлення нашої анімації на кожному тіці ()

const tick = () => {
	controls.update();
	renderer.render(scene, camera);
	const delta = clock.getDelta();
	if (mixer) {
		mixer.update(delta);
	}
	window.requestAnimationFrame(tick);
};
tick();

window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
