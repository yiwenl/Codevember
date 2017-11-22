// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewGrid from './ViewGrid';
import ViewHalf from './ViewHalf';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.03;
		this.orbitalControl.radius.value = 10;
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vGrid = new ViewGrid();
		this._vHalf = new ViewHalf();
	}


	render() {
		GL.clear(0, 0, 0, 0);


		this._bAxis.draw();
		this._bDots.draw();

		this._vGrid.render();

		this._vHalf.render();
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;