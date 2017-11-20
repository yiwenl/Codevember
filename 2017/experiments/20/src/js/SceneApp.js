// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
// import ViewObjModel from './ViewObjModel';
import ViewSphere from './ViewSphere';
import ViewRoom from './ViewRoom';
import TouchDetector from './TouchDetector';
import Assets from './Assets';

const RAD = Math.PI / 180;

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;
		this.orbitalControl.lockZoom();

		this.camera.setPerspective(75 * RAD, GL.aspectRatio, .1, 100);

		this.posHit = vec3.fromValues(999, 999, 999);

		this._cameraCube = new alfrid.CameraCube();
	}

	_initTextures() {
		console.log('init textures');

		const size = 256 * 1;
		this._fboShadow = new alfrid.CubeFrameBuffer(size, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();

		this._vSphere = new ViewSphere();
		this._vRoom = new ViewRoom();

		this._detector = new TouchDetector(this._vSphere.mesh);
		this._detector.on('onHit', (e)=> {
			vec3.copy(this.posHit, e.detail.hit);
		});

		this._detector.on('onUp', ()=> {
			vec3.set(this.posHit, 999, 999, 999);
		});

	}

	_updateShadowMap() {
		GL.setMatrices(this._cameraCube);
		for(let i=0; i<6; i++) {
			this._fboShadow.bind(i);
			GL.clear(0, 0, 0, 0);
			this._cameraCube.face(i);
			this._vSphere.render(this.posHit);	
			this._fboShadow.unbind();
		}
	}


	render() {
		this._updateShadowMap();

		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);
		this._bAxis.draw();
		this._bDots.draw();

		this._vSphere.render(this.posHit);

		this._vRoom.render(this._fboShadow.getTexture());

		const s = 0.1;
		this._bBall.draw(this.posHit, [s, s, s], [.9, 0, 0]);
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;