// SceneApp.js

import alfrid, {GL, Scene} from 'alfrid';
import ViewWolf from './ViewWolf';
// import ViewCubes from './ViewCubes';
import ViewFloor from './ViewFloor';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;
		this.orbitalControl.rx.limit(0.1, Math.PI - 0.1);
		this.orbitalControl.radius.limit(2, 10);
		this.orbitalControl.center[1] = .6;
		this.orbitalControl.center[2] = -.35;

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

		this._count = 0;
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

		//	FBOS
		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);

		this._fboOrgPos 	= new alfrid.FrameBuffer(numParticles, numParticles, o);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vWolf = new ViewWolf();
		// this._vCubes = new ViewCubes();
		this._vFloor = new ViewFloor();

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


		this._fboOrgPos.bind();
		GL.clear(0, 0, 0, 0);
		this._bCopy.draw(this._fboCurrent.getTexture(0));
		this._fboOrgPos.unbind();

		GL.setMatrices(this.camera);


	}

	updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(
			this._fboCurrent.getTexture(1), 
			this._fboCurrent.getTexture(0), 
			this._fboCurrent.getTexture(2),
			this._fboCurrent.getTexture(3),
			this.textureOrg,
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


	_updateDepthTexture() {
		// this._vCubes.update();


		this.fboModel0.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight0);
		this._vWolf.render();
		this.fboModel0.unbind();

		this.fboModel1.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight1);
		this._vWolf.render();
		this.fboModel1.unbind();


		this.fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		this._vWolf.render();
		this._renderParticles();
		// this._vCubes.render(
		// 	this.fboModel0,
		// 	this.fboModel1,
		// 	this._shadowMatrix0, 
		// 	this._shadowMatrix1, 
		// 	this.projInvert0, 
		// 	this.projInvert1, 
		// 	this.viewInvert0, 
		// 	this.viewInvert1
		// );
		this.fboShadow.unbind();

		GL.setMatrices(this.camera);
	}

	_renderParticles() {
		let p = this._count / params.skipCount;
		this._vRender.render(
			this._fboTarget.getTexture(0), 
			this._fboTarget.getTexture(2),
			this._fboTarget.getTexture(3)
			);
	}


	render() {
		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		this._updateDepthTexture();
		GL.clear(0, 0, 0, 0);

		GL.setMatrices(this.camera);

		
		this._renderParticles();
		this._vWolf.render();
		// this._vCubes.render(
		// 	this.fboModel0,
		// 	this.fboModel1,
		// 	this._shadowMatrix0, 
		// 	this._shadowMatrix1, 
		// 	this.projInvert0, 
		// 	this.projInvert1, 
		// 	this.viewInvert0, 
		// 	this.viewInvert1,
		// 	this._shadowMatrix, 
		// 	this.fboShadow.getDepthTexture()
		// );


		this._vFloor.render(this._shadowMatrix, this.fboShadow.getDepthTexture());
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
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

	get textureOrg() {
		return this._fboOrgPos.getTexture();
	}
}


export default SceneApp;