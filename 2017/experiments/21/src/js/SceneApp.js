// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';

import ViewBuildings from './ViewBuildings';
const RAD = Math.PI / 180;

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		GL.disable(GL.CULL_FACE);
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.rx.limit(0.0, Math.PI / 2)
		this.orbitalControl.radius.value = 10;
		this.orbitalControl.radius.limit(7, 15);
		this.camera.setPerspective(RAD * 65, GL.aspectRatio, .1, 100);

		this.mtx = mat4.create();
		mat4.translate(this.mtx, this.mtx, vec3.fromValues(0, -2.5, 0));

	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vBuildings = new ViewBuildings();
	}

	debugBuildings() {

	}


	render() {
		GL.clear(0, 0, 0, 0);
		GL.rotate(this.mtx);

		this._vBuildings.debugBuilding();
		this._vBuildings.render();
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;