// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import ViewCubes from './ViewCubes';
import Assets from './Assets';

const RAD = Math.PI / 180;

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;


		//	create camera
		this._shadowMatrix0 = mat4.create();
		this._shadowMatrix1 = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		this.pointSource0 = vec3.fromValues(0, 0, 5);
		this.pointSource1 = vec3.fromValues(0, 0, -5);
		const fov = 45 * RAD;
		const s = 5;
		// this._cameraLight0 = new alfrid.CameraPerspective();
		// this._cameraLight0.setPerspective(fov, 1, 1, 50);
		// this._cameraLight0.lookAt(this.pointSource0, [0, 0, 0]);

		this._cameraLight0 = new alfrid.CameraOrtho();
		this._cameraLight0.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight0.lookAt(this.pointSource0, [0, 0, 0]);

		// this._cameraLight1 = new alfrid.CameraPerspective();
		// this._cameraLight1.setPerspective(fov, 1, 1, 50);
		// this._cameraLight1.lookAt(this.pointSource1, [0, 0, 0]);

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

		mat4.multiply(this._shadowMatrix0, this._cameraLight0.projection, this._cameraLight0.viewMatrix);
		mat4.multiply(this._shadowMatrix0, this._biasMatrix, this._shadowMatrix0);

		mat4.multiply(this._shadowMatrix1, this._cameraLight1.projection, this._cameraLight1.viewMatrix);
		mat4.multiply(this._shadowMatrix1, this._biasMatrix, this._shadowMatrix1);

		this._hasDepthMap = false;
	}

	_initTextures() {
		console.log('init textures');

		this.fboModel0 = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.NEAREST, magFilter:GL.NEAREST, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
		this.fboModel1 = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.NEAREST, magFilter:GL.NEAREST, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bSky = new alfrid.BatchSkybox();

		this._vModel = new ViewObjModel();
		this._vCubes = new ViewCubes();
	}


	_createShadowMap() {
		if(this._hasDepthMap) {
			return;
		}


		this.fboModel0.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight0);
		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
		this.fboModel0.unbind();

		this.fboModel1.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight1);
		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
		this.fboModel1.unbind();

		this._hasDepthMap = true;
	}


	render() {
		this._createShadowMap();

		GL.clear(0, 0, 0, 0);

		// this._bSky.draw(Assets.get('studio_radiance'));
		this._bSky.draw(Assets.get('irr'));

		this._bAxis.draw();
		this._bDots.draw();

		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
		this._vCubes.render(this.depthTexture0, this._shadowMatrix0, this.depthTexture1, this._shadowMatrix1, this.projInvert0, this.projInvert1, this.viewInvert0, this.viewInvert1);
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}

	get depthTexture0() { return this.fboModel0.getDepthTexture(); }
	get depthTexture1() { return this.fboModel1.getDepthTexture(); }
}


export default SceneApp;