// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import Assets from './Assets';
import ViewNoise from './ViewNoise';
import ViewTerrain from './ViewTerrain';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;
	}

	_initTextures() {
		console.log('init textures');

		const size = 2048;
		this._fboNoise = new alfrid.FrameBuffer(size, size, {minFilter:GL.LINEAR, magFilter:GL.LINEAR, type:GL.FLOAT}, true);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bSky = new alfrid.BatchSkybox();

		this._vNoise = new ViewNoise();
		this._vTerrain = new ViewTerrain();

		this._fboNoise.bind();
		GL.clear(0, 0, 0, 0);
		this._vNoise.render();
		this._vNoise.render();
		this._fboNoise.unbind();
	}


	render() {
		GL.clear(0, 0, 0, 0);

		this._bAxis.draw();
		this._bDots.draw();

		this._vTerrain.render(this._fboNoise.getTexture(0), this._fboNoise.getTexture(1));

		let s = 200;
		GL.viewport(0, 0, s, s);
		this._bCopy.draw(this._fboNoise.getTexture(0));
		GL.viewport(s, 0, s, s);
		this._bCopy.draw(this._fboNoise.getTexture(1));
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		let scale = devicePixelRatio;
		if(!GL.isMobile) {
			scale = 1;
		}
		GL.setSize(innerWidth * scale, innerHeight * scale);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;