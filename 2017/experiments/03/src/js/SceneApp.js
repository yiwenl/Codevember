// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import ViewCylinders from './ViewCylinders';
import ViewFloor from './ViewFloor';

const RAD = Math.PI / 180;
const FOV = 55;
const radius = 10;
const ratio = 533/800;

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = radius;
		this.camera.setPerspective(FOV * RAD, GL.aspectRatio, .1, 50);
		this.orbitalControl.radius.limit(radius, radius);


		this.cameraPortrait = new alfrid.CameraPerspective();
		this.cameraPortrait.setPerspective(FOV * RAD, ratio, .1, 50);
		// const s = 5;
		// this.cameraPortrait = new alfrid.CameraOrtho();
		// this.cameraPortrait.ortho(-s, s, -s, s, .1, 50);

		this.pointSource = vec3.fromValues(0, 0, -radius);
		this.cameraPortrait.lookAt(this.pointSource, [0, -1, 0], [0, 1, 0]);

		this.biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);


		this.portraitMatrix = mat4.create();
		mat4.multiply(this.portraitMatrix, this.cameraPortrait.projection, this.cameraPortrait.viewMatrix);
		mat4.multiply(this.portraitMatrix, this.biasMatrix, this.portraitMatrix);


		this._hasShadowMap = false;

	}

	_initTextures() {
		console.log('init textures');

		this.fboDepth = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.NEAREST, magFilter:GL.NEAREST});
	}


	_initViews() {
		console.log('init views');

		this._vCylinder = new ViewCylinders();
		this._vFloor = new ViewFloor();
	}


	render() {
		GL.clear(0, 0, 0, 0);

		this._vCylinder.render(this.portraitMatrix);
		// this._vFloor.render(this.portraitMatrix, this.fboDepth.getDepthTexture());


		const s = 300;
		GL.viewport(0, 0, s, s);
		// this._bCopy.draw(this.fboDepth.getDepthTexture());
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		let scale = devicePixelRatio;
		if(!GL.isMobile) {
			scale = 1;
		}
		GL.setSize(innerWidth * scale, innerHeight * scale);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;