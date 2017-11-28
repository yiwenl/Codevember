// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewTest from './ViewTest';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		// GL.enableAlphaBlending();
		GL.disable(GL.DEPTH_TEST);
		GL.enableAdditiveBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.73;
		this.orbitalControl.radius.value = 15;
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vTest = new ViewTest();
	}


	render() {
		GL.clear(0, 0, 0, 0);


		
		this._vTest.render();
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;