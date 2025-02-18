import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import spacetexture from './textures/milkyway.jpg'
import { PlanetEarth } from './planets/Earth';
import { StarSun } from './planets/Sun';
import { PickHelper } from './lib/PickHelper';

function main() {
    const canvasRootEl = <HTMLCanvasElement>document.getElementById('root');
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRootEl! });

    renderer.setSize(window.innerWidth, window.innerHeight);

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
    const pickHelper = new PickHelper();
    scene.add(pickHelper.highlightPointLight)
	const controls = new OrbitControls( camera, renderer.domElement );
    // damping - efekt poślizgu kamery
	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.05;

	controls.screenSpacePanning = false;

    //Minimalny dystans kamery od centrum sceny
	controls.minDistance = 0;

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
		const divider = 640
		Earth.object.rotation.x = time / divider
		Earth.object.rotation.y = time / divider

		Sun.object.rotation.x = time / divider
		Sun.object.rotation.y = time / divider
	}


    //PICKING
    const pickPosition = {x: 0, y: 0};

    function getCanvasRelativePosition(event) {
        const rect = canvasRootEl?.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) * canvasRootEl.width / rect.width,
            y: (event.clientY - rect.top) * canvasRootEl.height / rect.height
        }
    }

    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);

        pickPosition.x = (pos.x / canvasRootEl.width ) *  2 - 1;
        pickPosition.y = (pos.y / canvasRootEl.height) * -2 + 1;  // note we flip Y
    }

    function clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
      }

    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);


    //MOBILE PICK
    window.addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
    }, {passive: false});
       
    window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });
       
    window.addEventListener('touchend', clearPickPosition);

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
        
        pickHelper.pick(pickPosition, scene, camera, time);

        controls.update();
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(renderInLoop);
}

main();