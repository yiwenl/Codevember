// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewFloor from './ViewFloor';
import ViewCylinder from './ViewCylinder';
import ViewLight from './ViewLight';
import ViewGiant from './ViewGiant';
import Assets from './Assets';

const num = 4;
const RAD = Math.PI / 180;

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = 0.;
		this.orbitalControl.ry.value = -2.5;
		this.orbitalControl.radius.value = 10;
		this.orbitalControl.rx.limit(-.1, .8);

		GL.disable(GL.CULL_FACE);

		this.camera.setPerspective(65 * RAD, GL.aspectRatio, .1, 100);

		//	setup light position
		this.positionLight = vec3.fromValues(0, 5, 0);
		

		//	bias matrix
		this.biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		//	create shadow matrix * 4
		this._modelMatrices = [];
		const offset = vec3.fromValues(0, -2, 0);
		for(let i=0; i<num; i++) {
			a = Math.PI / 2 * i;
			const mtx = mat4.create();
			mat4.rotateY(mtx, mtx, a);
			mat4.translate(mtx, mtx, offset);

			this._modelMatrices.push(mtx);
		}

		let a = Math.PI / 4;
		let r = 6;
		this.lightTarget = [Math.cos(a) * r, 0, Math.sin(a) * r];
		this._cameraLight = new alfrid.CameraPerspective();
		this._cameraLight.setPerspective(Math.PI*0.5, 1, .1, 100);
		this._cameraLight.lookAt(this.positionLight, this.lightTarget, [0, 1, 0]);
		this._lightMatrix = mat4.create();
		mat4.multiply(this._lightMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._lightMatrix, this.biasMatrix, this._lightMatrix);



		this._hasShadowMap = false;

		//	model matrix;

		this.modelMatrix = mat4.create();
		mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0, -2, 0));
	}

	_initTextures() {
	}


	_initViews() {
		//	create light
		this._vLight = new ViewLight();

		//	create cylinder
		this._vCylinder = new ViewCylinder();

		//	create floor
		this._vFloor = new ViewFloor();

		//	create giant
		this._vGiant = new ViewGiant();
	}


	render() {
		GL.clear(0, 0, 0, 0);

		this._vGiant.render(this.positionLight);

		GL.rotate(this.modelMatrix);
		this._vLight.render(this.positionLight);

		// render cylinder
		
		const mtx = mat4.create();
		for(let i=0; i<num; i++) {
			const mtx = this._modelMatrices[i];
			const texture = Assets.get(`img0${i+1}`);
			GL.rotate(mtx);
			this._vCylinder.render(this._lightMatrix, texture);
			this._vFloor.render(this._lightMatrix, texture);
		}
		
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
		this.camera.setAspectRatio(GL.aspectRatio);

		console.log('GL Size :', GL.width, GL.height);
	}
}


export default SceneApp;