// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
// import ViewObjModel from './ViewObjModel';
import ViewRoom from './ViewRoom';
import ViewCubes from './ViewCubes';
import ViewTunnel from './ViewTunnel';
import ViewPost from './ViewPost';
import ViewFlow from './ViewFlow';

import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;
	}

	_initTextures() {
		console.log('init textures');
		this._fbo = new alfrid.FrameBuffer(GL.width, GL.height, {type:GL.FLOAT, minFilter:GL.LINEAR, magFilter:GL.LINEAR}, true);
		this._fboInner = new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR}, true);
		this._fboOuter = new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR}, true);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vRoom = new ViewRoom();
		this._vCubes = new ViewCubes();
		this._vTunnel = new ViewTunnel();
		this._vPost = new ViewPost();
		this._vFlow = new ViewFlow();
	}


	render() {
		//	render maps
		this._fbo.bind();
		GL.clear(0, 0, 0, 0);
		this._vCubes.render();
		this._fbo.unbind();

		//	render outer world
		this._fboOuter.bind();
		GL.clear(0, 0, 0, 0);
		this._vRoom.render();
		this._fboOuter.unbind();


		//	render inner world
		this._fboInner.bind();
		GL.clear(0, 0, 0, 0);
		this._vTunnel.render();
		GL.disable(GL.DEPTH_TEST);
		this._vFlow.render();
		GL.enable(GL.DEPTH_TEST);
		this._fboInner.unbind();

		GL.clear(0, 0, 0, 0);

		
		this._vPost.render(this._fboInner.getTexture(), this._fboOuter.getTexture(), this._fbo);
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		console.log(GL.width, GL.height);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;