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


		this._fbos = [];
		for(let i=0; i<params.numSlices; i++) {
			const fbo = new alfrid.FrameBuffer(numParticles, numParticles, o, true);
			fbo.id = `FBO${i}`;
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

		this._fbos.forEach(fbo => {
			fbo.bind();
			GL.clear(0, 0, 0, 0);
			this._vSave.render();
			fbo.unbind();
		});


		GL.setMatrices(this.camera);
	}


	updateFbo() {
		const fboCurr = this._fbos[this._fbos.length - 1];


		// 	shift to get fbo
		const fbo = this._fbos.shift();

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
		this.updateFbo();

		GL.clear(0, 0, 0, 0);

		this._bAxis.draw();
		this._bDots.draw();

		const fbo = this._fbos[this._fbos.length-1];
		this._vRender.render(fbo.getTexture(0), fbo.getTexture(2));


		const s = window.innerWidth/this._fbos.length;
		
		this._fbos.forEach( (fbo, i) => {
			GL.viewport(s * i, 0, s, s);
			this._bCopy.draw(fbo.getTexture());
		});

		
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;