import * as THREE from 'three';
import sunTexture from '../textures/sun.jpg';
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';

export class StarSun {
	private sunObject: THREE.Object3D;
	private geometry: THREE.SphereGeometry;
	private material: THREE.MeshBasicMaterial;
	private mesh: THREE.Mesh;
	private fontLoader: FontLoader = new FontLoader();
	private textGeometry: TextGeometry
	
	constructor(textureLoader: THREE.TextureLoader) {
		this.geometry = new THREE.SphereGeometry(20, 14, 14);
		this.material = new THREE.MeshBasicMaterial({ map: textureLoader.load(sunTexture) });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.sunObject = new THREE.Object3D();
		this.sunObject.add(this.mesh);
		this.fontLoader.load('/fonts/Roboto,Space_Mono/Space_Mono/SpaceMono_Regular.json', (font) => {
			console.log(font)
			 this.textGeometry = new TextGeometry('Sun', {
				font: font,
				size: 24,
				depth: 5,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 10,
				bevelSize: 8,
				bevelOffset: 0,
				bevelSegments: 5
			})
		}, undefined, (e) => console.log(e))

	}

	get object() {
		return this.sunObject;
	}
}