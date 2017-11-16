// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import ViewSphere from './ViewSphere';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		// this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;
		this.orbitalControl.lock(true);


		this.cameraSphere = new alfrid.Camera();
		this.orbControlSphere = new alfrid.OrbitalControl(this.cameraSphere, window, .01);
		const easing = 0.1;
		this.orbControlSphere.rx.easing = easing;
		this.orbControlSphere.ry.easing = easing;
		this.orbControlSphere.lockZoom(true);

		this.modelMatrix = mat4.create();
		this.sphereMatrix = mat4.create();
		this.rotationMatrix = mat4.create();
		mat4.rotateZ(this.rotationMatrix, this.rotationMatrix, Math.PI/2);
	}

	_initTextures() {
		console.log('init textures');

		this._fboMap 		= new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._vModel = new ViewObjModel();
		this._vSphere = new ViewSphere();
	}

	_updateMap() {
		this._fboMap.bind();
		GL.clear(0, 0, 0, 0);

		mat4.copy(this.sphereMatrix, this.cameraSphere.matrix);
		mat4.multiply(this.sphereMatrix, this.sphereMatrix, this.rotationMatrix);
		GL.rotate(this.sphereMatrix);
		this._vSphere.render();

		GL.rotate(this.modelMatrix);
		this._fboMap.unbind();
	}

	render() {
		this.orbitalControl.ry.value += 0.01;
		this._updateMap();

		GL.clear(0, 0, 0, 0);

		GL.disable(GL.DEPTH_TEST);
		this._bCopy.draw(this._fboMap.getTexture());
		GL.enable(GL.DEPTH_TEST);

		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'), this._fboMap.getTexture());
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;