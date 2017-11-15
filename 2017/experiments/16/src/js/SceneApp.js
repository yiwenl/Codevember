// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import ViewCubes from './ViewCubes';
import Assets from './Assets';
import ViewFloor from './ViewFloor';
import TouchDetector from './TouchDetector';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 7.5;
		this.posHit = vec3.fromValues(0, 0, 0);


		this._shadowMatrix = mat4.create();
		this._shadowMatrix0 = mat4.create();
		this._shadowMatrix1 = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		const y = .5;
		this.pointSource0 = vec3.fromValues(0, y, 7);
		this.pointSource1 = vec3.fromValues(0, y, -7);
		let s = 1.5;
		this._cameraLight0 = new alfrid.CameraOrtho();
		this._cameraLight0.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight0.lookAt(this.pointSource0, [0, y, 0]);

		this._cameraLight1 = new alfrid.CameraOrtho();
		this._cameraLight1.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight1.lookAt(this.pointSource1, [0, y, 0]);

		s = 2.5;
		this._cameraLight = new alfrid.CameraOrtho();
		this._cameraLight.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight.lookAt(params.lightPosition, [0, 0, 0]);

		this.projInvert0 = mat4.create();
		mat4.invert(this.projInvert0, this._cameraLight0.projection);

		this.viewInvert0 = mat4.create();
		mat4.invert(this.viewInvert0, this._cameraLight0.matrix);

		this.projInvert1 = mat4.create();
		mat4.invert(this.projInvert1, this._cameraLight1.projection);

		this.viewInvert1 = mat4.create();
		mat4.invert(this.viewInvert1, this._cameraLight1.matrix);

		mat4.multiply(this._shadowMatrix0, this._cameraLight0.projection, this._cameraLight0.viewMatrix);
		mat4.multiply(this._shadowMatrix0, this._biasMatrix, this._shadowMatrix0);

		mat4.multiply(this._shadowMatrix1, this._cameraLight1.projection, this._cameraLight1.viewMatrix);
		mat4.multiply(this._shadowMatrix1, this._biasMatrix, this._shadowMatrix1);

		mat4.multiply(this._shadowMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._shadowMatrix, this._biasMatrix, this._shadowMatrix);
	}

	_initTextures() {
		console.log('init textures');

		const size = 512;

		this.fboModel0 = new alfrid.FrameBuffer(size, size, {minFilter:GL.NEAREST, magFilter:GL.NEAREST, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
		this.fboModel1 = new alfrid.FrameBuffer(size, size, {minFilter:GL.NEAREST, magFilter:GL.NEAREST, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});

		this.fboShadow = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bBall = new alfrid.BatchBall();

		this._vModel = new ViewObjModel();
		this._vCubes = new ViewCubes();
		this._vFloor = new ViewFloor();


		// this._vModel.mesh[0].generateFaces();
		// this._detector = new TouchDetector(this._vModel.mesh[0]);
		// this._detector.addEventListener('onHit', (e)=>this._onHit(e.detail));
		// this._detector.addEventListener('onUp', (e)=>{
		// 	vec3.copy(this.posHit, [0, 0, 0]);
		// });


		this._vModel.mesh.forEach( m => {
			m.generateFaces();
			const detector = new TouchDetector(m);
			detector.addEventListener('onHit', (e)=>this._onHit(e.detail));
			// detector.addEventListener('onUp', (e)=>{
			// 	vec3.copy(this.posHit, [0, 0, 0]);
			// });
		});
	}

	_onHit(o) {
		// console.log('on hit :', o);
		vec3.copy(this.posHit, o.hit);
	}


	_updateDepthTexture() {
		this._vCubes.update();


		this.fboModel0.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight0);
		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
		this.fboModel0.unbind();

		this.fboModel1.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight1);
		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
		this.fboModel1.unbind();


		this.fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
		this._vCubes.render(
			this.fboModel0,
			this.fboModel1,
			this._shadowMatrix0, 
			this._shadowMatrix1, 
			this.projInvert0, 
			this.projInvert1, 
			this.viewInvert0, 
			this.viewInvert1,
			this.posHit,
			Assets.get('studio_radiance'), Assets.get('irr')
		);
		this.fboShadow.unbind();

		GL.setMatrices(this.camera);
	}


	render() {
		this._updateDepthTexture();

		GL.clear(0, 0, 0, 0);

		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
		this._vCubes.render(
			this.fboModel0,
			this.fboModel1,
			this._shadowMatrix0, 
			this._shadowMatrix1, 
			this.projInvert0, 
			this.projInvert1, 
			this.viewInvert0, 
			this.viewInvert1,
			this.posHit,
			Assets.get('studio_radiance'), Assets.get('irr')
		);

		this._vFloor.render(this._shadowMatrix, this.fboShadow.getDepthTexture());

		// const s = 0.2;
		// this._bBall.draw(this.posHit, [s, s, s], [1, 0, 0]);
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;