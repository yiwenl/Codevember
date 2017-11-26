// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import ViewWolf from './ViewWolf';
import Capture3D from './Capture3D';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;


		this._shadowMatrix = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		const s = 2.5;
		this._cameraLight = new alfrid.CameraOrtho();
		this._cameraLight.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight.lookAt([0, 10, 0], [0, 0, 0], [0, 0, -1]);

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

		this._vWolf = new ViewWolf();

		this._capture = new Capture3D();
	}

	_renderShadowMap() {

		this._fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		this._vWolf.render();
		this._fboShadow.unbind();
	}


	render() {
		//	update capture
		this._capture.capture(this._vWolf.mesh, this._vWolf.mtxModel);

		//	update shadow map
		this._renderShadowMap();

		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);
		this._bAxis.draw();
		this._bDots.draw();

		this._vWolf.render();

		let s = 150;
		GL.viewport(0, 0, s, s);
		this._bCopy.draw(this._capture.depth0);
		GL.viewport(s, 0, s, s);
		this._bCopy.draw(this._capture.depth1);
		GL.viewport(s * 2, 0, s, s);
		this._bCopy.draw(this._fboShadow.getDepthTexture());

		for(let i=0; i<4; i++) {
			GL.viewport(s * i, s, s, s);
			this._bCopy.draw(this._capture.fboModel0.getTexture(i));
		}
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;