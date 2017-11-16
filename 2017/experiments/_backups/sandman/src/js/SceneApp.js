// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewSphere from './ViewSphere';
import ViewGiant from './ViewGiant';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';

import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = .5;
		this.orbitalControl.ry.value = .5;
		this.orbitalControl.radius.value = 5;
		// this.orbitalControl.lock(true);

		//	model matrix
		this.mtxModel = mat4.create();
		this._hasDepthCaptured = false;

		//	sphere controll
		this.cameraSphere = new alfrid.Camera();
		this.orbControlSphere = new alfrid.OrbitalControl(this.cameraSphere, window, .01);
		const easing = 0.1;
		this.orbControlSphere.rx.easing = easing;
		this.orbControlSphere.ry.easing = easing;
		this.orbControlSphere.lockZoom(true);

		//	sphere matrix
		this.sphereMatrix = mat4.create();
		this.rotationMatrix = mat4.create();
		// mat4.rotateZ(this.rotationMatrix, this.rotationMatrix, Math.PI/2);

		//	shadow mtx		
		this._shadowMatrix = mat4.create();
		this._shadowMatrix0 = mat4.create();
		this._shadowMatrix1 = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		const y = .5;
		this.pointSource0 = vec3.fromValues(0, y, 7);
		this.pointSource1 = vec3.fromValues(0, y, -7);
		let s = 1.5;
		this._cameraLight0 = new alfrid.CameraOrtho();
		this._cameraLight0.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight0.lookAt(this.pointSource0, [0, y, 0]);

		this._cameraLight1 = new alfrid.CameraOrtho();
		this._cameraLight1.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight1.lookAt(this.pointSource1, [0, y, 0]);

		s = 2.5;
		this._cameraLight = new alfrid.CameraOrtho();
		this._cameraLight.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight.lookAt(params.lightPosition, [0, 0, 0]);

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

		mat4.multiply(this._shadowMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._shadowMatrix, this._biasMatrix, this._shadowMatrix);
	}

	_initTextures() {
		console.log('init textures');
		const size = 512;

		this.fboModel0 = new alfrid.FrameBuffer(size, size, {minFilter:GL.NEAREST, magFilter:GL.NEAREST, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
		this.fboModel1 = new alfrid.FrameBuffer(size, size, {minFilter:GL.NEAREST, magFilter:GL.NEAREST, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});

		this.fboShadow = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});

		this._fboMap = new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});

		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vSphere = new ViewSphere();
		this._vGiant = new ViewGiant();

		//	views
		this._vRender = new ViewRender();
		this._vSim 	  = new ViewSim();

		this._vSave = new ViewSave();
		GL.setMatrices(this.cameraOrtho);


		this._fboCurrent.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboCurrent.unbind();

		this._fboTarget.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboTarget.unbind();

		GL.setMatrices(this.camera);
	}

	_updateSphereMap() {
		this._fboMap.bind();
		GL.clear(0, 0, 0, 0);

		mat4.copy(this.sphereMatrix, this.cameraSphere.matrix);
		mat4.multiply(this.sphereMatrix, this.sphereMatrix, this.rotationMatrix);
		GL.rotate(this.sphereMatrix);
		this._vSphere.render();

		this._fboMap.unbind();
	}

	_updateDepthTexture() {
		if(this._hasDepthCaptured) {	return;	}
		this.fboModel0.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight0);
		this._vGiant.render();
		this.fboModel0.unbind();

		this.fboModel1.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight1);
		this._vGiant.render();
		this.fboModel1.unbind();

		GL.setMatrices(this.camera);
		this._hasDepthCaptured = true;
	}

	_updateShadowMap() {
		this.fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		this._vGiant.render();
		this._vRender.render(this._fboTarget);
		this.fboShadow.unbind();
	}

	_updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(
			this._fboCurrent.getTexture(1), 
			this._fboCurrent.getTexture(0), 
			this._fboCurrent.getTexture(2), 
			this._fboCurrent.getTexture(3), 
			this.textureMap,
			this.fboModel0,
			this.fboModel1,
			this._shadowMatrix0, 
			this._shadowMatrix1, 
			this.projInvert0, 
			this.projInvert1, 
			this.viewInvert0, 
			this.viewInvert1
		);
		this._fboTarget.unbind();

		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;
	}

	render() {
		this._updateDepthTexture();
		this._updateSphereMap();
		this._updateFbo();

		GL.clear(0, 0, 0, 0);
		GL.rotate(this.mtxModel);

		GL.disable(GL.DEPTH_TEST);
		this._bCopy.draw(this._fboMap.getTexture());
		GL.enable(GL.DEPTH_TEST);

		this._bAxis.draw();
		this._bDots.draw();

		this._vGiant.render();
		this._vRender.render(this._fboTarget);


		let s = 200;
		GL.viewport(0, 0, s, s);
		this._bCopy.draw(this.fboModel0.getDepthTexture());
		GL.viewport(s, 0, s, s);
		this._bCopy.draw(this.fboModel1.getDepthTexture());
		GL.viewport(s*2, 0, s, s);
		this._bCopy.draw(this.fboShadow.getDepthTexture());
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}

	get textureMap() {
		return this._fboMap.getTexture();
	}
}


export default SceneApp;