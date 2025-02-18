import * as THREE from 'three';

export class PickHelper {
	raycaster: THREE.Raycaster;
	pickedObject: THREE.Object3D | null;
	pickedObjectSavedColor: number;
	highlightLight: THREE.PointLight;

	constructor() {
		this.raycaster = new THREE.Raycaster();
		this.pickedObject = null;
		this.pickedObjectSavedColor = 0;

		// Dodajemy punktowe światło do sceny (na start niewidoczne)
		this.highlightLight = new THREE.PointLight(0xffffff, 100, 100, 1); // Białe światło, intensywność 2, zasięg 10
		this.highlightLight.visible = false;
	}

	get highlightPointLight() {
		return this.highlightLight;
	}

	public pick(normalizedPosition: THREE.Vector2, scene: THREE.Scene, camera: THREE.Camera) {
		// Jeśli wcześniej był wybrany obiekt, ukryj światło
		if (this.pickedObject) {
			this.highlightLight.visible = false;
			this.pickedObject = null;
		}

		// Rzucamy promień przez kamerę
		this.raycaster.setFromCamera(normalizedPosition, camera);
		const intersectedObjects = this.raycaster.intersectObjects(scene.children);

		if (intersectedObjects.length) {
			// Wybieramy pierwszy obiekt typu Mesh (czyli model 3D)
			const firstIntersected3DObject = intersectedObjects.find(object => object.object.type === 'Mesh');

			if (firstIntersected3DObject) {

				// wybieramy kierunek w którym jest skierowana kamera. 
				// Chcemy aby sfera była oświetlona od strony kamery.
				const cameraDirection = new THREE.Vector3();
				camera.getWorldDirection(cameraDirection);

				this.pickedObject = firstIntersected3DObject.object;

				const objectWorldPosition = new THREE.Vector3();
				this.pickedObject.getWorldPosition(objectWorldPosition);

				// dodajemy zeskalowany wektos czyli v*s cameraDirection*(-50)
				objectWorldPosition.addScaledVector(cameraDirection, -50)
				
				// Przesuwamy światło na pozycję obiektu i włączamy je
				this.highlightLight.position.copy(objectWorldPosition);
	
				this.highlightLight.visible = true;
			}
		}
	}
}
