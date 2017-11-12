// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
// import ViewObjModel from './ViewObjModel';
import Assets from './Assets';
import ViewLight from './ViewLigtht';
import ViewFloor from './ViewFloor';

import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';

class SceneApp extends Scene {
	constructor() {
		super();

		this._count = 0;
		GL.enableAlphaBlending();
		// this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		// this.orbitalControl.rx.value = this.orbitalControl.ry.value = Math.PI;
		this.orbitalControl.radius.value = 5;
		this.resize();


		this._shadowMatrix0 = mat4.create();
		this._shadowMatrix1 = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		this.pointSource0 = vec3.fromValues(0, 0, 7);
		this.pointSource1 = vec3.fromValues(0, 0, -7);
		const s = 2;
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

		mat4.multiply(this._shadowMatrix0, this._cameraLight0.projection, this._cameraLight0.viewMatrix);
		mat4.multiply(this._shadowMatrix0, this._biasMatrix, this._shadowMatrix0);

		mat4.multiply(this._shadowMatrix1, this._cameraLight1.projection, this._cameraLight1.viewMatrix);
		mat4.multiply(this._shadowMatrix1, this._biasMatrix, this._shadowMatrix1);

		this.modelMatrix = mat4.create();
	}

	_initTextures() {
		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);

		this.fboModel0 = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.NEAREST, magFilter:GL.NEAREST, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
		this.fboModel1 = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.NEAREST, magFilter:GL.NEAREST, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();

		this._vLight = new ViewLight();
		// this._vFloor = new ViewFloor();

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


	updateFbo() {
		this.updateDepthTexture();

		const obj0 = {
			texture:this.texture0,
			depth:this.depthTexture0,
			view:this.viewInvert0,
			proj:this.projInvert0,
			shadow:this._shadowMatrix0
		}

		const obj1 = {
			texture:this.texture1,
			depth:this.depthTexture1,
			view:this.viewInvert1,
			proj:this.projInvert1,
			shadow:this._shadowMatrix1
		}

		this._fboTarget.bind();
		GL.clear(0, 0, 0, 0);
		this._vSim.render(
			this._fboCurrent.getTexture(1), 
			this._fboCurrent.getTexture(0), 
			this._fboCurrent.getTexture(2),
			this._fboCurrent.getTexture(3),
			obj0,
			obj1
		);
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

	}


	updateDepthTexture() {
		this.fboModel0.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight0);
		this._vLight.render();
		this.fboModel0.unbind();

		this.fboModel1.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight1);
		this._vLight.render();
		this.fboModel1.unbind();

		GL.setMatrices(this.camera);
	}


	render() {
		GL.clear(0, 0, 0, 0);


		this._bAxis.draw();
		this._bDots.draw();

		// this._vFloor.render();
		// GL.disable(GL.DEPTH_TEST);
		


		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		let p = this._count / params.skipCount;

		this._vRender.render(
			this._fboTarget.getTexture(0), 
			this._fboCurrent.getTexture(0), 
			p, 
			this._fboCurrent.getTexture(2),
			this._fboCurrent.getTexture(3)
		);

		this._bBall.draw(this.pointSource0, [.1, .1, .1], [1, 0, 0]);
		this._bBall.draw(this.pointSource1, [.1, .1, .1], [0, 1, 0]);

		// GL.enable(GL.DEPTH_TEST);
		this._vLight.render();


		const s = 200;

		GL.viewport(0, 0, s, s);
		this._bCopy.draw(this.fboModel0.getTexture());
		GL.viewport(s, 0, s, s);
		this._bCopy.draw(this.fboModel1.getTexture());

		GL.viewport(s*2, 0, s, s);
		this._bCopy.draw(this.fboModel0.getDepthTexture());
		GL.viewport(s*3, 0, s, s);
		this._bCopy.draw(this.fboModel1.getDepthTexture());
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		const scale = 1;
		GL.setSize(innerWidth * scale, innerHeight * scale);
		this.camera.setAspectRatio(GL.aspectRatio);
	}


	get texture0() {
		return this.fboModel0.getTexture();
	}

	get texture1() {
		return this.fboModel1.getTexture();
	}

	get depthTexture0() {
		return this.fboModel0.getDepthTexture();
	}

	get depthTexture1() {
		return this.fboModel1.getDepthTexture();
	}
}


export default SceneApp;