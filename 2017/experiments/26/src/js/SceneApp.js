// SceneApp.js

import alfrid, { Scene, GL, TouchDetector } from 'alfrid';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';
import ViewBall from './ViewBall';

window.getAsset = function (id) {
	return assets.find((a) => a.id === id).file;
};

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();

		this._count = 0;
		this.camera.setPerspective(Math.PI/2, GL.aspectRatio, .1, 100);
		this.orbitalControl.radius.value = 14;
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.5;
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
	}


	_initViews() {
		console.log('init views');
		
		//	helpers
		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		const s = 20;
		this.meshFloor = alfrid.Geom.plane(s, s, 1, 'xz');
		this.shader = new alfrid.GLShader();

		const r = 3;
		this._ballWhite = new ViewBall([1, 1, 1], this.meshFloor, this.camera);
		this._ballWhite.setPosition([r, 0, r]);

		this._ballWhite.draggable.on('onDown', () => this._onBallDown());
		this._ballWhite.draggable.on('onUp', () => this._onBallUp());

		let g = .2;
		this._ballBlack = new ViewBall([g, g, g], this.meshFloor, this.camera);
		this._ballBlack.setPosition([-r, 0, -r]);

		this._ballBlack.draggable.on('onDown', () => this._onBallDown());
		this._ballBlack.draggable.on('onUp', () => this._onBallUp());


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


	_onBallDown() {
		this.orbitalControl.lock(true);
	}


	_onBallUp() {
		this.orbitalControl.lock(false);
	}


	updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(
			this._fboCurrent.getTexture(1), 
			this._fboCurrent.getTexture(0), 
			this._fboCurrent.getTexture(2),
			this._fboCurrent.getTexture(3),
			this._ballWhite.position,
			this._ballBlack.position
			);
		this._fboTarget.unbind();


		const tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;
	}


	render() {
		this.updateFbo();

		GL.clear(0, 0, 0, 0);

		this._vRender.render(
			this._fboTarget.getTexture(0), 
			this._fboTarget.getTexture(1),
			this._fboTarget.getTexture(2),
			this._fboTarget.getTexture(3)
		);

		// this.shader.bind();
		// GL.draw(this.meshFloor);

		this._ballWhite.render();
		this._ballBlack.render();

		// const size = Math.min(params.numParticles, GL.height/4);

		// for(let i=0; i<4; i++) {
		// 	GL.viewport(0, size * i, size, size);
		// 	this._bCopy.draw(this._fboCurrent.getTexture(i));
		// }

		const s = params.numParticles * 2.0;
		GL.viewport(0, 0, s, s);
		// this._bCopy.draw(this._fboTarget.getTexture(3));
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;