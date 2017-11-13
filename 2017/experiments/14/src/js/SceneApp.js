// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';
import ViewFloor from './ViewFloor';
import TouchDetector from './TouchDetector';

window.getAsset = function(id) {
	return assets.find( (a) => a.id === id).file;
}

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();

		this._count = 0;
		this.camera.setPerspective(Math.PI/2, GL.aspectRatio, .1, 100);
		this.orbitalControl.radius.value = 7.5;
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;

		this.orbitalControl.radius.limit(5, 12);
		this.orbitalControl.rx.limit(-0.1, Math.PI * 0.45);

		this.posHit = vec3.fromValues(0, 0, 0);

		const s = 4;
		this._cameraLight = new alfrid.CameraOrtho();
		this._cameraLight.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight.lookAt(params.lightPos, [0, 0, 0]);

		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		this._shadowMatrix = mat4.create();
		mat4.multiply(this._shadowMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._shadowMatrix, this._biasMatrix, this._shadowMatrix);
	}

	_initTextures() {
		console.log('init textures');

		//	FBOS
		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);

		this.fboShadow 		= new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
	}


	_initViews() {
		console.log('init views');
		
		//	helpers
		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();

		//	views
		this._vFloor = new ViewFloor();
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

		const s = params.maxRadius;
		this.mesh = alfrid.Geom.sphere(s, 12);
		this.mesh.generateFaces();

		this._detector = new TouchDetector(this.mesh);
		this._detector.addEventListener('onHit', (e)=>this._onHit(e.detail));
		this._detector.addEventListener('onUp', (e)=>{
			vec3.copy(this.posHit, [0, 0, 0]);
		});
	}

	_onHit(o) {
		vec3.copy(this.posHit, o.hit);

		// this.orbitalControl.lock(true);
	}


	updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2), this.posHit);
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

	}


	render() {
		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		let p = this._count / params.skipCount;


		this.fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		this._vRender.render(this._fboTarget.getTexture(0), this._fboTarget.getTexture(1), p, this._fboCurrent.getTexture(2));
		this.fboShadow.unbind();
		GL.setMatrices(this.camera);


		GL.clear(0, 0, 0, 0);
		this._vRender.render(this._fboTarget.getTexture(0), this._fboTarget.getTexture(1), p, this._fboCurrent.getTexture(2));
		this._vFloor.render(this._shadowMatrix, this.fboShadow.getDepthTexture());
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;