import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import spacetexture from './textures/milkyway.jpg'
import sunTexture from './textures/sun.jpg'
import { PlanetEarth } from './planets/Earth';
import { StarSun } from './planets/Sun';

const RADIUS_CONTROLS = {
    SUN: 20,
    EARTH: 3
}

function main() {
    const canvasRootEl = document.getElementById('root');
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRootEl! });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Ładowanie tekstury jako tła sceny
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        spacetexture,
        (texture) => {
            console.log('Texture loaded');
            scene.background = texture;
        },
        undefined,
        (err) => {
            console.error('Błąd przy ładowaniu tekstury', err);
        }
    );

    const fov = 45;
    const near = 1;
    const far = 50000;
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set( 0, 0, 400 )

	const controls = new OrbitControls( camera, renderer.domElement );

	//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    // damping - efekt poślizgu kamery
	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.05;

	controls.screenSpacePanning = false;

    //Minimalny dystans kamery od centrum sceny
	controls.minDistance = 500;

    // maksymalny dystans kamery od centrum sceny
	controls.maxDistance = Infinity;

    // minilany kąt w osi Y do jakiego możemy obrócić kamerę
	controls.minPolarAngle = .3;
    // maksymalny kąt w osi Y do jakiego możemy obrócić kamerę
	controls.maxPolarAngle = Math.PI / 2;


	const axesHelper = new THREE.AxesHelper(1000);
	scene.add(axesHelper)
    controls.update();

    const sunLightColor = '#fff';
    const sunLightIntensity = 100000;
    const sunLight = new THREE.PointLight(sunLightColor, sunLightIntensity);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    const sphereSize = 40;

    // SUN HELPER - INSIDE SUN
    const pointLightHelper = new THREE.PointLightHelper(sunLight, sphereSize, 'yellow');
    scene.add(pointLightHelper);

    const Sun = new StarSun(textureLoader);

    // Tworzymy "orbitę" wokół obiektu (linia okręgu)
    const curve = new THREE.EllipseCurve(
        0, 0,            // Środek elipsy
        200, 300,            // Promienie elipsy
        0, 2 * Math.PI,   // Zakres kątowy
        true,            // Kierunek
        0                 // Kąt początkowy
    );
    
    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 'white' });
    
    const orbit = new THREE.Line(geometry, material);
    orbit.rotation.x = Math.PI / 2; // Obrót w płaszczyźnie XY
    scene.add(orbit);

    const Earth = new PlanetEarth(textureLoader);
    Earth.object.add(axesHelper);
    scene.add(Earth.object)

    scene.add(Sun.object);

	const earthRotationSetter = (time: number) => {
        // TODO Rozdzielenie rotacji ziemi od słońca
		const divider = 640
		Earth.object.rotation.x = time / divider
		Earth.object.rotation.y = time / divider

		Sun.object.rotation.x = time / divider
		Sun.object.rotation.y = time / divider
	}

    function renderInLoop(time: number) {
        time *= 0.05;
		/**
		 * @TODO
		 */
		// NIe obracajmy kamery
		// Do implementacji obracanie poszczególnych sfer w układzie.
        // camera.position.x = worldOrbitRadius * Math.cos(angle);
        // camera.position.z = worldOrbitRadius * Math.sin(angle);

        const earthOrbitPositionInTime = curve.getPoint(time / 10000 )
        Earth.object.position.set(earthOrbitPositionInTime.x, 0, earthOrbitPositionInTime.y);
		earthRotationSetter(time);
		Earth.object.rotation.z = time / 100
        
        controls.update();
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(renderInLoop);
}

main();