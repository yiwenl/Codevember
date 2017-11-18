// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import ViewRing from './ViewRing';
import ViewTunnel from './ViewTunnel';
import ViewPost from './ViewPost';
import ViewStargate from './ViewStargate';

import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();

		this._count = 0;
		const RAD = Math.PI / 180;
		this.camera.setPerspective(75 * RAD, GL.aspectRatio, .1, 100);
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.1;
		this.orbitalControl.radius.value = 4;
		this.orbitalControl.radius.limit(3.5, 8);

		const s = 0.5;
		this.mtxTunnel = mat4.create();
		mat4.scale(this.mtxTunnel, this.mtxTunnel, vec3.fromValues(s, s, s));
	}

	_initTextures() {
		console.log('init textures');
		this._fbo = new alfrid.FrameBuffer(GL.width, GL.height, {type:GL.FLOAT, minFilter:GL.LINEAR, magFilter:GL.LINEAR}, true);
		this._fboInner = new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR}, true);
		this._fboOuter = new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR}, true);
		this._fboMiddle = new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR}, true);
		
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
		this._bSky = new alfrid.BatchSkybox();

		this._vRing = new ViewRing();
		this._vTunnel = new ViewTunnel();
		this._vPost = new ViewPost();
		this._vGate = new ViewStargate();



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

	_renderMap() {
		this._fbo.bind();

		GL.clear(0, 0, 0, 1);
		GL.pushMatrix();
		GL.rotate(this.mtxTunnel);
		this._vTunnel.render();
		GL.popMatrix();

		this._fbo.unbind();
	}


	_renderRing() {
		GL.pushMatrix();
		GL.rotate(this.mtxTunnel);
		this._vRing.render();
		GL.popMatrix();
	}

	updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2));
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

	}


	render() {
		this._renderMap();

		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}
		let p = this._count / params.skipCount;

		//	render outer world
		this._fboOuter.bind();
		GL.clear(0, 0, 0, 0);
		this._bSky.draw(Assets.get('tunnel_org'));
		this._fboOuter.unbind();


		//	render inner world
		this._fboInner.bind();
		GL.clear(0, 0, 0, 0);
		this._bSky.draw(Assets.get('tunnel_org'));

		GL.pushMatrix();
		GL.rotate(this.mtxTunnel);
		this._vRing.render();
		this._vGate.render();
		GL.popMatrix();
		this._fboInner.unbind();


		GL.clear(0, 0, 0, 0);
		GL.disable(GL.DEPTH_TEST);
		this._vPost.render(this._fboInner.getTexture(), this._fboOuter.getTexture(), this._fbo);
		GL.enable(GL.DEPTH_TEST);

		this._renderRing();
		this._vRender.render(this._fboTarget.getTexture(0), this._fboCurrent.getTexture(0), p, this._fboCurrent.getTexture(2), this._fbo.getTexture(0));
		
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;