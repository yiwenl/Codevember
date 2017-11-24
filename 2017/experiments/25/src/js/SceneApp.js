// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import ViewCubes from './ViewCubes';
import ViewModel from './ViewModel';
import ViewFloor from './ViewFloor';
import Assets from './Assets';
import TouchDetector from './TouchDetector';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.ry.value = -0.4;
		this.orbitalControl.rx.value = 0.6;
		this.orbitalControl.radius.limit(7, 13);
		// this.orbitalControl.lock(true);


		this._shadowMatrix = mat4.create();
		this._shadowMatrix0 = mat4.create();
		this._shadowMatrix1 = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		const r = 10;
		this.pointSource0 = vec3.fromValues(0, 0, r);
		this.pointSource1 = vec3.fromValues(0, 0, -r);
		let s = 5;
		this._cameraLight = new alfrid.CameraOrtho();
		this._cameraLight.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight.lookAt(params.light, [0, 0, 0]);

		s = 2;
		this._cameraLight0 = new alfrid.CameraOrtho();
		this._cameraLight0.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight0.lookAt(this.pointSource0, [0, 0, 0]);

		this._cameraLight1 = new alfrid.CameraOrtho();
		this._cameraLight1.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight1.lookAt(this.pointSource1, [0, 0, 0]);

		this.projInvert0 = mat4.create();
		mat4.invert(this.projInvert0, this._cameraLight0.projection);

		this.viewInvert0 = mat4.create();
		mat4.invert(this.viewInvert0, this._cameraLight0.matrix);

		this.projInvert1 = mat4.create();
		mat4.invert(this.projInvert1, this._cameraLight1.projection);

		this.viewInvert1 = mat4.create();
		mat4.invert(this.viewInvert1, this._cameraLight1.matrix);

		mat4.multiply(this._shadowMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._shadowMatrix, this._biasMatrix, this._shadowMatrix);

		mat4.multiply(this._shadowMatrix0, this._cameraLight0.projection, this._cameraLight0.viewMatrix);
		mat4.multiply(this._shadowMatrix0, this._biasMatrix, this._shadowMatrix0);

		mat4.multiply(this._shadowMatrix1, this._cameraLight1.projection, this._cameraLight1.viewMatrix);
		mat4.multiply(this._shadowMatrix1, this._biasMatrix, this._shadowMatrix1);

		this._hasDepthTexture = false;

		this.renderModel = false;
		gui.add(this, 'renderModel');



	}

	_initTextures() {
		console.log('init textures');

		this.fboModel0 = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.NEAREST, magFilter:GL.NEAREST, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
		this.fboModel1 = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.NEAREST, magFilter:GL.NEAREST, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});

		this.fboShadow = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bBall = new alfrid.BatchBall();

		this._vModelOrg = new ViewObjModel();
		this._vCubes = new ViewCubes();
		this._vModel = new ViewModel();

		this._vModel.setupInstance(this._vCubes.posOffset, this._vCubes.rotations, this._vCubes.extras);

		this._hit = vec3.fromValues(999, 999, 999);
		this._detector = new TouchDetector(this._vModelOrg.mesh);

		this._radius = new alfrid.EaseNumber(0);

		this._detector.on('onHit', (e) => {
			vec3.copy(this._hit, e.detail.hit);
			this._radius.value = 2.5;
		});

		this._detector.on('onUp', () => {
			this._radius.value = 0;
		});
	}


	updateDepthTexture() {
		this.fboModel0.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight0);
		this._vModelOrg.render();
		this.fboModel0.unbind();

		this.fboModel1.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight1);
		this._vModelOrg.render();
		this.fboModel1.unbind();

		GL.setMatrices(this.camera);
		this._hasDepthTexture = true;
	}

	updateShadowMap() {
		this.fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		this.renderScene();
		this.fboShadow.unbind();
	}


	renderScene() {
		this._vModel.render(this._hit, this._radius.value);
		this._vCubes.render(
			this.fboModel0,
			this.fboModel1,
			this._shadowMatrix0, 
			this._shadowMatrix1, 
			this.projInvert0, 
			this.projInvert1, 
			this.viewInvert0, 
			this.viewInvert1,
			this._hit, 
			this._radius.value
		);
	}

	render() {
		if(!this._hasDepthTexture) {
			this.updateDepthTexture();
		}


		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);
		this.renderScene();
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;