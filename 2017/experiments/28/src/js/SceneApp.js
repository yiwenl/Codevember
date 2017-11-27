// SceneApp.js

import alfrid, { Scene, GL, TouchDetector } from 'alfrid';
import Assets from './Assets';
import ViewLight from './ViewLight';
import ViewFloor from './ViewFloor';
import ViewFXAA from './ViewFXAA';

import ViewSave from './ViewSave';
import ViewRenderShadow from './ViewRenderShadow';
import ViewSim from './ViewSim';

import ViewModel from './ViewModel';
import PassBloom from './PassBloom';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.1;
		this.orbitalControl.radius.value = 5;
		this.orbitalControl.radius.limit(5, 6);
		this.orbitalControl.rx.limit(-.1, Math.PI/3);

		this._count = 0;

		this.modelMatrix = mat4.create();
		mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0, -1, 0));

		this.mesh = alfrid.Geom.sphere(0.5, 12);
		this.shader = new alfrid.GLShader();
		this._detector = new TouchDetector(this.mesh, this.camera);

		mat4.translate(this._detector.mtxModel, this._detector.mtxModel, vec3.fromValues(0, 1, 0));

		this._hit = vec3.fromValues(999, 999, 999);
		this._detector.on('onHit', (e)=> {
			vec3.copy(this._hit, e.detail.hit);
			this._hit[1] += 1;
		});

		this._detector.on('onUp', ()=> {
			vec3.set(this._hit, 888,999,999);
		});
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


		const oRender = {
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR,
			type:GL.FLOAT
		};

		this._fboRender = new alfrid.FrameBuffer(GL.width, GL.height, oRender);
		this._fboFXAA = new alfrid.FrameBuffer(GL.width, GL.height, oRender);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bBall = new alfrid.BatchBall();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vFxaa = new ViewFXAA();
		this._passBloom = new PassBloom();

		this._vLight = new ViewLight();
		this._vModel = new ViewModel();
		this._vFloor = new ViewFloor();
		this._vFloor.setLights(this._vLight.targets);


		//	views
		this._vRenderShadow = new ViewRenderShadow();
		this._vSim 	  = new ViewSim();

		this._vSave = new ViewSave(this._vLight.lines);
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
			this._fboCurrent.getTexture(3),
			this._hit
			);
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


		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);

		this._fboRender.bind();
		GL.clear(0, 0, 0, 1);
		const t = .4;
		

		GL.enableAlphaBlending();
		GL.enable(GL.DEPTH_TEST);
		GL.rotate(this.modelMatrix);
		this._vModel.render();
		this._vFloor.render();

		let p = this._count / params.skipCount;

		this._vRenderShadow.render(
			this._fboTarget.getTexture(0), 
			this._fboCurrent.getTexture(0), 
			p, 
			this._fboTarget.getTexture(2)
		);
		
		
		GL.enableAdditiveBlending();
		GL.disable(GL.DEPTH_TEST);

		

		this._vLight.render();


		this._fboRender.unbind();	
		GL.viewport(0, 0, GL.width, GL.height);
		this._bCopy.draw(this._fboRender.getTexture());
		this._bCopy.draw(this._passBloom.getTexture());
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);

		const oRender = {
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR,
			type:GL.FLOAT
		};


		this._fboRender = new alfrid.FrameBuffer(GL.width, GL.height, oRender);
		this._fboFXAA = new alfrid.FrameBuffer(GL.width, GL.height, oRender);
	}
}


export default SceneApp;