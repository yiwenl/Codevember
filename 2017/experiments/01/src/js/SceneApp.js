// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
// import ViewObjModel from './ViewObjModel';
import ViewCubes from './ViewCubes';
import ViewFloor from './ViewFloor';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 10;
		this.orbitalControl.rx.limit(-.2, Math.PI-.2);
		this.orbitalControl.radius.limit(8, 12);

		this.modelMatrix = mat4.create();
		mat4.rotateX(this.modelMatrix, this.modelMatrix, -Math.PI/3);
		mat4.rotateZ(this.modelMatrix, this.modelMatrix, -Math.PI/6);

		this.cameraLight = new alfrid.CameraOrtho();

		const s = 5;
		this.cameraLight.ortho(-s, s, s, -s, .1, 20);
		this.cameraLight.lookAt([.01, 1, 0], [0, 0, 0], [0, 1, 0]);

		this.biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		this.shadowMatrix = mat4.create();
		mat4.multiply(this.shadowMatrix, this.cameraLight.projection, this.cameraLight.viewMatrix);
		mat4.multiply(this.shadowMatrix, this.biasMatrix, this.shadowMatrix);


		this.mtxIdentity = mat4.create();
	}

	_initTextures() {
		console.log('init textures');
		this.fboDepth = new alfrid.FrameBuffer(1024, 1024, {type:GL.FLOAT, minFilter:GL.NEAREST, magFilter:GL.NEAREST});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vCubes = new ViewCubes();
		this._vFloor = new ViewFloor();
	}


	render() {
		GL.clear(0, 0, 0, 0);
		this._vCubes.update();


		this.fboDepth.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.cameraLight);

		GL.rotate(this.modelMatrix);
		this._vCubes.render();

		this.fboDepth.unbind();


		GL.setMatrices(this.camera);

		
		GL.rotate(this.modelMatrix);
		this._vCubes.render(this.shadowMatrix, this.fboDepth.getDepthTexture());

		GL.rotate(this.mtxIdentity);
		this._vFloor.render(this.shadowMatrix, this.fboDepth.getDepthTexture());
		
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;