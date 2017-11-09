// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;

		this.rotation = 0;
		this.speed = new alfrid.EaseNumber(0, 0.01);
		this.modelMatrix = mat4.create();
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bSky = new alfrid.BatchSkybox();
	}


	render() {
		this.rotation += this.speed;
		mat4.identity(this.modelMatrix, this.modelMatrix);
		mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation);

		
		GL.clear(0, 0, 0, 0);

		this._bAxis.draw();
		this._bDots.draw();
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;