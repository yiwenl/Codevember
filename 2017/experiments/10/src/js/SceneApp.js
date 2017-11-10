// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import ViewCylinder from './ViewCylinder';

const RAD = Math.PI / 180;
class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.camera.setPerspective(60 * RAD, GL.aspectRatio, .5, 100);
		this.orbitalControl.radius.value = 1;
		this.orbitalControl.rx.limit(-.2, .2);
		this.orbitalControl.radius.limit(0.005, 2);
		// this.orbitalControl.radius.value = 10.005;
		// this.orbitalControl.rx.value = Math.PI - 0.001;

		this.rotation = 0;
		this.lastRotation = 0;
		this.speed = new alfrid.EaseNumber(0, 0.01);
		this.targetSpeed = 0;
		this.modelMatrix = mat4.create();
		this._textureIndex = 0;
		this._saturation = new alfrid.EaseNumber(0, 0.01);

		this._needUpdate = false;
		this.time = Math.random() * 0xFF;

		gui.add(this, 'spin');
		gui.add(this, 'stop');

		this._isSpinning = false;

		this._btn = document.body.querySelector('button');
		this._btn.addEventListener('click', ()=>this._onClick());

		window.addEventListener('keydown', (e)=> {
			if(e.keyCode === 32) {
				this._onClick();
			}
		});
	}


	_onClick() {
		if(this._isSpinning) {
			this.stop();
			this._btn.innerHTML = 'SPIN';
		} else {
			this.spin();
			this._btn.innerHTML = 'STOP';
		}

		this._isSpinning = !this._isSpinning;
	}


	_initTextures() {
		this._fbos = [];
		this._textures = [];
		const image = Assets.getSource('cover');

		for(let i=0; i<params.numSides; i++) {
			const t = new alfrid.GLTexture(image);
			this._textures.push(t);
		}

	}

	spin() {
		if(!this._video) { return;}
		this._video.play();
		const { numSides } = params;
		this._needUpdate = true;

		this.targetSpeed = Math.PI * 2.0 / numSides;
		this._saturation.value = 1;
	}


	stop() {
		this.targetSpeed = 0;
		this._needUpdate = false;
		this._saturation.value = 0;
	}


	_initViews() {
		this._vCylinder = new ViewCylinder();
	}


	_addNewFrame() {
		const angle = Math.PI * 2.0 / params.numSides;
		function getFloorRotation(a) {
			return Math.floor(a / angle) * angle;
		}

		const floorRotation = getFloorRotation(this.rotation);
		const deltaRotation = this.rotation - this.lastRotation;

		if(deltaRotation > angle) {
			this.lastRotation = floorRotation;
			// const t = this._textures[this._textureIndex];
			const t = this._textures[params.numSides - this._textureIndex - 1];
			t.updateTexture(this._video);

			this._textureIndex ++;
			if(this._textureIndex >= this._textures.length) {
				this._textureIndex = 0;
			}
		}
	}


	render() {
		this.time += 0.01;
		if(!this._video) {
			this._video = document.body.querySelector('video');
			return;
		}

		this.speed.value = this.targetSpeed + Math.sin(Math.cos(this.time)) * 0.001;
		this.rotation += this.speed.value;
		mat4.identity(this.modelMatrix, this.modelMatrix);
		mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation);

		//	update textures
		if(this._needUpdate) {
			this._addNewFrame();
		}

		
		GL.clear(0, 0, 0, 0);
		GL.rotate(this.modelMatrix);
		this._vCylinder.render(this._textures, this._saturation.value);
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;