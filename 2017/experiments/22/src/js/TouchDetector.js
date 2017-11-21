// TouchDetector.js
import { EventDispatcher, Ray, GL } from 'alfrid';

class TouchDetector extends EventDispatcher {
	constructor(mMesh) {
		super();

		this._mesh = mMesh;
		this._mesh.generateFaces();
		this.faceVertices = mMesh.faces.map((face)=>(face.vertices));

		this._ray = new Ray([0, 0, 0], [0, 0, -1]);
		this._hit = vec3.fromValues(-999, -999, -999);

		window.addEventListener('mousedown', (e)=>this._onDown(e));
		window.addEventListener('mouseup', (e)=>this._onUp(e));
	}


	_onDown(e) {
		this.dispatchCustomEvent('onDown');
		let camera = GL.camera;
		if(!camera) {
			return;
		}

		const mx = (e.clientX / GL.width) * 2.0 - 1.0;
		const my = - (e.clientY / GL.height) * 2.0 + 1.0;

		camera.generateRay([mx, my, 0], this._ray);

		let hit;
		let v0, v1, v2;
		let dist = 0;

		for(let i = 0; i < this.faceVertices.length; i++) {
			const vertices = this.faceVertices[i];
			v0 = [vertices[0][0], vertices[0][1], vertices[0][2]];
			v1 = [vertices[1][0], vertices[1][1], vertices[1][2]];
			v2 = [vertices[2][0], vertices[2][1], vertices[2][2]];

			let t = this._ray.intersectTriangle(v0, v1, v2);

			if(t) {
				if(hit) {
					const distToCam = vec3.dist(t, camera.position);
					if(distToCam < dist) {
						hit = vec3.clone(t);
						dist = distToCam;
					}
				} else {
					hit = vec3.clone(t);
					dist = vec3.dist(hit, camera.position);
				}	
			}
		}


		if(hit) {
			this._hit = vec3.clone(hit);
			this.dispatchCustomEvent('onHit', {hit});
		} else {
			this.dispatchCustomEvent('onUp');
		}
	}


	_onUp(e) {
		// this.dispatchCustomEvent('onUp');
	}

}

export default TouchDetector;