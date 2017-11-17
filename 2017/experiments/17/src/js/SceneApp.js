// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewWall from './ViewWall';
import ViewPieces from './ViewPieces';
import Assets from './Assets';
import TouchDetector from './TouchDetector';

const RAD = Math.PI / 180;

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.easing = this.orbitalControl.ry.easing = 0.05;
		this.orbitalControl.rx.value = 0.;
		setTimeout(()=>{
			this.orbitalControl.rx.value = 0.15;
			this.orbitalControl.ry.value = 0.75;	
		}, 700);
		
		this.orbitalControl.radius.value = 10;
		this.orbitalControl.radius.limit(6, 20);
		let a = .15;
		this.orbitalControl.ry.limit(-Math.PI/2+a, Math.PI/2-a);

		this.posHit = vec3.fromValues(999, 999, 999);

		let s = 2;
		const img = Assets.getSource('portrait');
		const ratio = img.width / img.height;
		this._cameraLight = new alfrid.CameraOrtho();
		this._cameraLight.ortho(-s, s, -s/ratio, s/ratio, 1, 50);
		this._cameraLight.lookAt(params.lightPosition, [0, 0, 0]);

		this._shadowMatrix = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		mat4.multiply(this._shadowMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._shadowMatrix, this._biasMatrix, this._shadowMatrix);

		this.shader = new alfrid.GLShader();
		// const s = 2;
		s = 20;
		this.mesh = alfrid.Geom.plane(s, s, 1);
		this._detector = new TouchDetector(this.mesh);

		this._detector.addEventListener('onHit', (o)=> {
			vec3.copy(this.posHit, o.detail.hit);
		});

		this._detector.addEventListener('onUp', ()=> {
			vec3.set(this.posHit, 999, 999, 999);
		});
	}


	_initTextures() {
		console.log('init textures');
		this.fboShadow = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
	}


	_initViews() {
		this._bCopy = new alfrid.BatchCopy();
		this._bBall = new alfrid.BatchBall();

		this._vWall = new ViewWall();
		this._vPieces = new ViewPieces();
	}


	updateShadowMap() {
		this.fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);

		this._vPieces.render(this._shadowMatrix, this.posHit);

		this.fboShadow.unbind();
	}


	render() {
		this._vPieces.update();
		this.updateShadowMap();

		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);

		this._vPieces.render(this._shadowMatrix, this.posHit);
		this._vWall.render(this._shadowMatrix, this.fboShadow.getDepthTexture());
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;