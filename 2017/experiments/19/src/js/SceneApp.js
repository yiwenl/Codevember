// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';
import ViewFloor from './ViewFloor';
import ViewSphere from './ViewSphere';
import ViewBall from './ViewBall';
import TouchDetector from './TouchDetector';

window.getAsset = function(id) {
	return assets.find( (a) => a.id === id).file;
}

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();

		this._count = 0;
		this._percent = 0;
		this.camera.setPerspective(Math.PI/2, GL.aspectRatio, .1, 100);
		this.orbitalControl.radius.value = 15;
		this.orbitalControl.radius.limit(10, 20);
		this.orbitalControl.rx.limit(-.2, Math.PI/2 - .1);
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.73;


		const s = 15;
		this._cameraLight = new alfrid.CameraOrtho();
		this._cameraLight.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight.lookAt(params.lightPosition, [0, 0, 0]);

		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		this._shadowMatrix = mat4.create();
		mat4.multiply(this._shadowMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._shadowMatrix, this._biasMatrix, this._shadowMatrix);


		this.posHit = vec3.fromValues(999, 999, 999);

		this.shader = new alfrid.GLShader();
		const size = 35;
		this.mesh = alfrid.Geom.plane(size, size, 1, 'xz');
		this._touchSize = new alfrid.EaseNumber(0);
		this._detector = new TouchDetector(this.mesh);

		this._hitSpeed = new alfrid.EaseNumber(0);
		this._detector.on('onHit', (e) => {
			this._touchSize.value = 1.5;
			if(this.posHit[0] < size) {
				const speed = vec3.distance(e.detail.hit, this.posHit);		
				this._hitSpeed.setTo(speed);
				this._hitSpeed.value = 0;
			}
			
			vec3.copy(this.posHit, e.detail.hit);
		});

		this._detector.on('onUp', (e) => {
			this._touchSize.value = 0;
		});
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

		this._fboShadow 	= new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
	}


	_initViews() {
		console.log('init views');
		
		//	helpers
		this._bCopy = new alfrid.BatchCopy();

		this._vFloor = new ViewFloor();
		this._vSphere = new ViewSphere();
		this._vBall = new ViewBall();


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
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(
			this._fboCurrent.getTexture(1), 
			this._fboCurrent.getTexture(0), 
			this._fboCurrent.getTexture(2),
			this.posHit,
			this._touchSize.value,
			this._hitSpeed.value
			);
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

	}

	_updateShadowMap() {
		this._fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		this._vBall.render(this.posHit, this._touchSize.value);
		this._vRender.render(this._fboTarget.getTexture(0), this._fboCurrent.getTexture(0), this._percent, this._fboCurrent.getTexture(2));
		this._fboShadow.unbind();
		GL.setMatrices(this.camera);
	}


	render() {
		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		this._percent = this._count / params.skipCount;

		this._updateShadowMap();

		GL.clear(0, 0, 0, 0);

		this._vRender.render(this._fboTarget.getTexture(0), this._fboCurrent.getTexture(0), this._percent, this._fboCurrent.getTexture(2));
		this._vFloor.render(this._shadowMatrix, this._fboShadow.getDepthTexture());

		this._vBall.render(this.posHit, this._touchSize.value);

		// let s = 300;
		// GL.viewport(0, 0, s, s);
		// this._bCopy.draw(this._fboShadow.getDepthTexture());

		// GL.viewport(s, 0, s, s);
		// this._bCopy.draw(this._fboShadow.getTexture());
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;