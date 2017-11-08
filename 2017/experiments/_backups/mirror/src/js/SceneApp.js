// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;
		this.camera.setPerspective(Math.PI /3, GL.aspectRatio, .1, 100);

		this.modelMatrix = mat4.create();
		const s = .35;

		mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0, -1.5, 0));
		mat4.scale(this.modelMatrix, this.modelMatrix, vec3.fromValues(s, s, s));


		console.log(this.modelMatrix);
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		// this._bSky = new alfrid.BatchSkybox();

		this._vModel = new ViewObjModel();
	}


	render() {
		GL.clear(0, 0, 0, 0);
		GL.rotate(this.modelMatrix);

		// this._bSky.draw(Assets.get('studio_radiance'));
		// this._bSky.draw(Assets.get('irr'));

		this._bAxis.draw();
		this._bDots.draw();

		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'));
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;