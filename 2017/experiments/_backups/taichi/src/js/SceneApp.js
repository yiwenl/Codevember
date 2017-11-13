// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';
import ViewSphere from './ViewSphere';

window.getAsset = function(id) {
	return assets.find( (a) => a.id === id).file;
}

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();

		this._count = 0;
		this.camera.setPerspective(Math.PI/2, GL.aspectRatio, .1, 100);
		this.orbitalControl.radius.value = 10;
		this.orbitalControl.lock(true);
		// this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;

		this.cameraSphere = new alfrid.Camera();
		this.orbControlSphere = new alfrid.OrbitalControl(this.cameraSphere, window, .01);
		const easing = 0.1;
		this.orbControlSphere.rx.easing = easing;
		this.orbControlSphere.ry.easing = easing;
		this.orbControlSphere.lockZoom(true);

		this.modelMatrix = mat4.create();
		this.sphereMatrix = mat4.create();
		this.rotationMatrix = mat4.create();
		mat4.rotateZ(this.rotationMatrix, this.rotationMatrix, Math.PI/2);
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

		this._fboMap 		= new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
	}


	_initViews() {
		console.log('init views');
		
		//	helpers
		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();


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


		this._vSphere = new ViewSphere();
	}


	updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		GL.setMatrices(this.camera);
		this._vSim.render(
			this._fboCurrent.getTexture(1), 
			this._fboCurrent.getTexture(0), 
			this._fboCurrent.getTexture(2),
			this._fboMap.getTexture()
			);
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

	}


	render() {
		this._fboMap.bind();
		GL.clear(0, 0, 0, 0);

		mat4.copy(this.sphereMatrix, this.cameraSphere.matrix);
		mat4.multiply(this.sphereMatrix, this.sphereMatrix, this.rotationMatrix);
		GL.rotate(this.sphereMatrix);
		this._vSphere.render();

		GL.rotate(this.modelMatrix);
		this._fboMap.unbind();

		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		let p = this._count / params.skipCount;

		GL.clear(0, 0, 0, 0);


		GL.disable(GL.DEPTH_TEST);
		this._bCopy.draw(this._fboMap.getTexture());
		GL.enable(GL.DEPTH_TEST);


		GL.rotate(this.modelMatrix);
		this._vRender.render(this._fboTarget.getTexture(0), this._fboCurrent.getTexture(0), p, this._fboCurrent.getTexture(2), this._fboCurrent.getTexture(3));



		

		

		// const size = Math.min(params.numParticles, GL.height/4);
		// GL.viewport(0, 0, size, size);
		// this._bCopy.draw(this._fboMap.getTexture());
		// GL.viewport(0, size, size, size);
		// this._bCopy.draw(this._fboCurrent.getTexture(3));

	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this._fboMap 		= new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;