// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewDay from './ViewDay';
import ViewNight from './ViewNight';
import Assets from './Assets';
import TouchDetector from './TouchDetector';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.rx.limit(-0.2, Math.PI/2 - 0.1);
		this.orbitalControl.radius.value = 15;
		this.orbitalControl.radius.limit(10, 25);

		this._hit = vec3.fromValues(999, 999, 999);
		this._hasChanged = false;
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();

		this._vDay = new ViewDay();
		this._vNight = new ViewNight();
		let easing = 0.1;

		this._detector = new TouchDetector(this._vDay.mesh);
		this._detector.on('onHit', (e)=> {
			vec3.copy(this._hit, e.detail.hit);

			if(!this._hasChanged) {
				easing = 0.003;
				this._vDay.open();
				this._vDay.waveFront.easing = easing;
				this._vNight.open();
				this._vNight.waveFront.easing = easing;
			} else {
				easing = 0.01;
				this._vDay.close();
				this._vDay.waveFront.easing = easing;
				this._vNight.close();
				this._vNight.waveFront.easing = easing;
			}
			

			this._hasChanged = !this._hasChanged;
		});
	}


	render() {
		GL.clear(0, 0, 0, 0);

		this._vDay.render(this._hit);
		this._vNight.render(this._hit);

	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;