// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import ViewSphere from './ViewSphere';
import ViewPlates from './ViewPlates';
import Capture3D from './Capture3D';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = 1;
		this.orbitalControl.radius.value = 10;

		this._cameraLight = new alfrid.CameraOrtho();
		const s = 5;
		this._cameraLight.ortho(-s, s, -s, s, 1, 50);
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
	}

	_initTextures() {
		console.log('init textures');

		this._fboShadow = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR, wrapS:GL.CLAMP_TO_EDGE, wrapT:GL.CLAMP_TO_EDGE});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		
		this._vPlates = new ViewPlates();
		this._vSphere = new ViewSphere(this._vPlates.posOffsets);

		this._capture = new Capture3D()
	}


	_updateDepthMap() {
		this._capture.capture(this._vSphere);

		this._fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		this._vPlates.renderShadow(this._capture.texture0, this._capture.texture1, this._capture.shadowMatrix0, this._capture.shadowMatrix1);

		this._fboShadow.unbind();
	}


	render() {
		this._updateDepthMap();

		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);

		this._vPlates.render(
			this._capture.texture0, 
			this._capture.texture1, 
			this._capture.shadowMatrix0, 
			this._capture.shadowMatrix1,
			this._shadowMatrix,
			this._fboShadow.getDepthTexture()
			);

		// const s = 200;
		// GL.viewport(0, 0, s, s);
		// this._bCopy.draw(this._capture.texture0);
		// GL.viewport(s, 0, s, s);
		// this._bCopy.draw(this._capture.texture1);

		// GL.viewport(s*2, 0, s, s);
		// this._bCopy.draw(this._fboShadow.getDepthTexture());
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;