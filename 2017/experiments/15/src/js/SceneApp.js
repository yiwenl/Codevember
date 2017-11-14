// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import ViewSphere from './ViewSphere';
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
		this.orbitalControl.radius.value = 5;
		this.orbitalControl.lock(true);

		//	model matrix
		let s = .2;
		this.mtxModel = mat4.create();
		mat4.translate(this.mtxModel, this.mtxModel, vec3.fromValues(0, -.7, 0));
		mat4.scale(this.mtxModel, this.mtxModel, vec3.fromValues(s, s, s));

		//	shader for shadow mapping
		this._shaderShadow = new alfrid.GLShader(null, alfrid.ShaderLibs.simpleColorFrag);
		this._shaderShadow.bind();
		this._shaderShadow.uniform("color", "vec3", [1, 1, 1]);
		this._shaderShadow.uniform("opacity", "float", 1);

		//	sphere controll
		this.cameraSphere = new alfrid.Camera();
		this.orbControlSphere = new alfrid.OrbitalControl(this.cameraSphere, window, .01);
		const easing = 0.1;
		this.orbControlSphere.rx.easing = easing;
		this.orbControlSphere.ry.easing = easing;
		this.orbControlSphere.lockZoom(true);

		//	sphere matrix
		this.sphereMatrix = mat4.create();
		this.rotationMatrix = mat4.create();
		mat4.rotateZ(this.rotationMatrix, this.rotationMatrix, Math.PI/2);

		//	shadow map
		s = 10;
		this._cameraLight = new alfrid.CameraOrtho();
		this._cameraLight.ortho(-s, s, -s, s, .5, 1000);
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

		window.addEventListener('mousemove', (e)=>this._onMove(e));
	}

	_initTextures() {
		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);

		this._fboMap 		= new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
		this.fboShadow 		= new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._vSphere = new ViewSphere();
		this._vFloor = new ViewFloor();
		this._vVenus = new ViewObjModel('venus', false);
		this._vWing = new ViewObjModel('wing', true);

		this._vRender = new ViewRender();
		this._vSim 	  = new ViewSim();

		this._vSave = new ViewSave(this._vWing.mesh.vertices);
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
		this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2), this._fboCurrent.getTexture(3), this.textureMap);
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

	}

	_onMove(e) {
		let rx = (e.clientY / GL.height - .5);
		let ry = (e.clientX / GL.width - .5);

		this.orbitalControl.rx.value = rx;
		this.orbitalControl.ry.value = ry * 2.;
	}


	_generateShadowMap() {
		this.fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);

		GL.rotate(this.mtxModel);
		this._shaderShadow.bind();
		GL.draw(this._vVenus.mesh);
		GL.draw(this._vWing.mesh);
		this._vRender.render(this._fboTarget.getTexture(0), this._fboTarget.getTexture(1), this._fboTarget.getTexture(2), this._fboTarget.getTexture(3), this.textureMap);

		this.fboShadow.unbind();
		GL.setMatrices(this.camera);
	}


	render() {
		this.updateFbo();
		this._generateShadowMap();

		this._fboMap.bind();
		GL.clear(0, 0, 0, 0);

		mat4.copy(this.sphereMatrix, this.cameraSphere.matrix);
		mat4.multiply(this.sphereMatrix, this.sphereMatrix, this.rotationMatrix);
		GL.rotate(this.sphereMatrix);
		this._vSphere.render();

		this._fboMap.unbind();

		GL.clear(0, 0, 0, 0);

		GL.disable(GL.DEPTH_TEST);
		this._bCopy.draw(this._fboMap.getTexture());
		GL.enable(GL.DEPTH_TEST);

		GL.rotate(this.mtxModel);
		this._vVenus.render(Assets.get('studio_radiance'), Assets.get('irr'), this._fboMap.getTexture());
		this._vWing.render(Assets.get('studio_radiance'), Assets.get('irr'), this._fboMap.getTexture());
		this._vFloor.render(this._shadowMatrix, this.fboShadow.getDepthTexture());
		this._vRender.render(this._fboTarget.getTexture(0), this._fboTarget.getTexture(1), this._fboTarget.getTexture(2), this._fboTarget.getTexture(3), this.textureMap);


		const s = 250;
		GL.viewport(0, 0, s, s);
		// this._bCopy.draw(this.fboShadow.getDepthTexture());
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}

	get textureMap() {
		return this._fboMap.getTexture();
	}
}


export default SceneApp;