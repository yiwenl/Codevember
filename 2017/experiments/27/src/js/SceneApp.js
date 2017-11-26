// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import ViewWolf from './ViewWolf';
import Capture3D from './Capture3D';

import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';
import ViewFloor from './ViewFloor';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 3.5;
		this.orbitalControl.rx.limit(0, Math.PI/2 - .1);
		this.orbitalControl.radius.limit(3, 5);


		this._shadowMatrix = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		this.count = 0;
		const s = 3.5;
		this._cameraLight = new alfrid.CameraOrtho();
		this._cameraLight.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight.lookAt([0, 10, 0], [0, 0, 0], [0, 0, -1]);
		// this._cameraLight.lookAt([0, 10, 4], [0, 0, 0]);

		mat4.multiply(this._shadowMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._shadowMatrix, this._biasMatrix, this._shadowMatrix);

		this._vRender.setupUniform(this._shadowMatrix);
	}

	_initTextures() {
		console.log('init textures');
		
		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);

		this._fboShadow = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vWolf = new ViewWolf();
		this._vFloor = new ViewFloor();
		this._capture = new Capture3D();

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

	_renderShadowMap() {

		this._fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		// this._vWolf.render();
		this._vRender.renderShadow(this._fboTarget.getTexture(0), this._fboTarget.getTexture(2));
		this._fboShadow.unbind();
	}

	_updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(
			this._fboCurrent.getTexture(1), 
			this._fboCurrent.getTexture(0), 
			this._fboCurrent.getTexture(2),
			this._fboCurrent.getTexture(3),
			this._capture.shadowMatrix0,
			this._capture.shadowMatrix1,
			this._capture.fboModel0,
			this._capture.fboModel1
		);
		this._fboTarget.unbind();

		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;
	}

	render() {
		
		//	update capture
		this._capture.capture(this._vWolf.mesh, this._vWolf.mtxModel);	

		//	update particles
		this._updateFbo();

		//	update shadow map
		this._renderShadowMap();	
		

		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);

		this._vFloor.render(this._shadowMatrix, this._fboShadow.getDepthTexture());
		this._vRender.render(this._fboTarget.getTexture(0), this._fboTarget.getTexture(2), this._shadowMatrix, this._fboShadow.getDepthTexture());
		

		this.count ++;
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;