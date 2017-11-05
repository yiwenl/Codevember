// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
// import ViewObjModel from './ViewObjModel';
import ViewSphere from './ViewSphere';
import ViewBalls from './ViewBalls';
import ViewFakeAO from './ViewFakeAO';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 15;
		this.orbitalControl.radius.limit(12, 18);
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bSky = new alfrid.BatchSkybox();

		this._vSphere = new ViewSphere();
		this._vBalls = new ViewBalls();
		this._vAO = new ViewFakeAO();

		this._vAO.setInstance(this._vBalls.posOffset);
	}


	render() {
		params.time += 0.005;
		GL.clear(0, 0, 0, 0);

		this._bSky.draw(Assets.get('irr'));
		
		this._vSphere.render(Assets.get('studio_radiance'), Assets.get('irr'));
		this._vAO.render();
		this._vBalls.render(Assets.get('studio_radiance'), Assets.get('irr'));

		// this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;