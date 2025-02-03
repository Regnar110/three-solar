import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import spacetexture from './textures/milkyway.jpg'
import sunTexture from './textures/sun.jpg'
import earthTexture from './textures/earth.jpg';

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
    const far = 600;
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set( 0, 0, 400 )
	// const helper = new THREE.CameraHelper( camera );
	// scene.add( helper );
    const worldOrbitRadius = 200;
    let angle = 0;

	const controls = new OrbitControls( camera, renderer.domElement );

	//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.05;

	controls.screenSpacePanning = false;
	controls.minDistance = 0;
	controls.maxDistance = 500;
	controls.minPolarAngle = 0;
	controls.maxPolarAngle = Math.PI / 2;


	const axesHelper = new THREE.AxesHelper(1000);
	scene.add(axesHelper)
    controls.update();

    const sunLightColor = '#fff';
    const sunLightIntensity = 10000;
    const sunLight = new THREE.PointLight(sunLightColor, sunLightIntensity);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    const sphereSize = 40;

    // SUN HELPER - INSIDE SUN
    const pointLightHelper = new THREE.PointLightHelper(sunLight, sphereSize);
    scene.add(pointLightHelper);

    const sunOrbit = new THREE.Object3D();
    const sunGeometry = new THREE.SphereGeometry(60, 124, 124);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(sunTexture) });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

    sunOrbit.add(sunMesh);

    const earthOrbit = new THREE.Object3D();
	earthOrbit.add(axesHelper)

    const earthGeometry = new THREE.SphereGeometry(6, 8, 8);
    const earthMaterial = new THREE.MeshPhongMaterial({ map: textureLoader.load(earthTexture) });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthOrbit.position.x = -200;
    earthOrbit.add(earthMesh);
    sunOrbit.add(earthOrbit);
    scene.add(sunOrbit);

	const earthRotationSetter = (time: number) => {
		const divider = 640
		earthOrbit.rotation.x = time / divider
		earthOrbit.rotation.y = time / divider

		/**
		 * @TODO
		 */
		// Słonce wprawia w obrót ziemię. Trzeba to wyizolować. Każda planeta ma się poruszać osobno w swoim tempie i po swojej orbicie
		sunOrbit.rotation.x = time / divider
		sunOrbit.rotation.y = time / divider
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
		earthRotationSetter(time);
		earthOrbit.rotation.z = time / 100
        camera.lookAt(earthOrbit.position);
        controls.update();
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(renderInLoop);
}

main();