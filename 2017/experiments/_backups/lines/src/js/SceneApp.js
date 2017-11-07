// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';

class SceneApp extends Scene {
	constructor() {
		super();
		this._count = 0;

		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value;
		this.orbitalControl.radius.value = 5;
	}

	_initTextures() {
		const numParticles = window.params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);

		this._fbos = [];
		for(let i=0; i<params.numParticles; i++) {
			const fbo = new alfrid.FrameBuffer(numParticles, numParticles, o, true);
			this._fbos.push(fbo);
		}
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

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
		this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2));
		this._fboTarget.unbind();

		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;


		const fboCurrent = this._fbos[this._fbos.length - 1];


		// 	shift to get fbo
		const fboCurr = this._fbos.shift();

		//	bind fbo
		fbo.bind();
		GL.clear(0, 0, 0, 0);

		//	render simulation
		this._vSim.render(fboCurr.getTexture(1), fboCurr.getTexture(0), fboCurr.getTexture(2));

		//	unbind fbo
		fbo.unbind();

		//	push fbo back
		this._fbos.push(fbo);
	}


	render() {
		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		let p = this._count / params.skipCount;
		
		GL.clear(0, 0, 0, 0);

		this._bAxis.draw();
		this._bDots.draw();

		this._vRender.render(this._fboTarget.getTexture(0), this._fboCurrent.getTexture(0), p, this._fboCurrent.getTexture(2));
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;