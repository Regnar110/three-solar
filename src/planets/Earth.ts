import * as THREE from 'three';
import earthTexture from '../textures/earth.jpg';

export class PlanetEarth {
	private earthObject: THREE.Object3D;
	private geometry: THREE.SphereGeometry;
	private material: THREE.MeshPhongMaterial;
	private mesh: THREE.Mesh;
	
	constructor(textureLoader: THREE.TextureLoader) {
		this.geometry = new THREE.SphereGeometry(3, 8, 8);
		this.material = new THREE.MeshPhongMaterial({ map: textureLoader.load(earthTexture) });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.earthObject = new THREE.Object3D();
		this.earthObject.add(this.mesh)
	}

	get object() {
		return this.earthObject;
	}
}