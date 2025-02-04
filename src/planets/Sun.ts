import * as THREE from 'three';
import sunTexture from '../textures/sun.jpg';

export class StarSun {
	private sunObject: THREE.Object3D;
	private geometry: THREE.SphereGeometry;
	private material: THREE.MeshBasicMaterial;
	private mesh: THREE.Mesh;
	
	constructor(textureLoader: THREE.TextureLoader) {
		this.geometry = new THREE.SphereGeometry(20, 14, 14);
		this.material = new THREE.MeshBasicMaterial({ map: textureLoader.load(sunTexture) });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.sunObject = new THREE.Object3D();
		this.sunObject.add(this.mesh)
	}

	get object() {
		return this.sunObject;
	}
}