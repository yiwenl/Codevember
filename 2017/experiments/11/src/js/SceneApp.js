// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import ViewLines from './ViewLines';
import ViewNoise from './ViewNoise';
import ViewFloor from './ViewFloor';
// import ViewGiant from './ViewGiant';

const RAD = Math.PI/180;
var random = function(min, max) { return min + Math.random() * (max - min);	}

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.camera.setPerspective(65 * RAD, GL.aspectRatio, .1, 100);
		this.orbitalControl.ry.value = 0.7;
		this.orbitalControl.rx.value = .05;
		this.orbitalControl.rx.limit(.05, .5);
		this.orbitalControl.radius.limit(1, 5.5);
		this.orbitalControl.radius.value = 1.5;
		this.orbitalControl.center[1] = 0.25;

		const vFloor = vec3.fromValues(0, 1.5, 0);
		const vGlobal = vec3.fromValues(0, -.5, 0);

		this._storms = [];
		const numStorms = 5;
		const r = 2.5;
		const tilt = .125;
		for(let i=0; i<numStorms; i++) {
			const mtx = mat4.create();
			const seed = Math.random() * 0xFF;
			let a = Math.PI * 2.0 / numStorms * i + random(-.2, .2);
			let r = random(4, 2);
			const pos = vec3.fromValues(Math.cos(a) * r, 0.0, Math.sin(a) * r);


			mat4.translate(mtx, mtx, vGlobal);
			mat4.translate(mtx, mtx, pos);
			mat4.translate(mtx, mtx, vFloor);
			mat4.rotateX(mtx, mtx, random(-tilt, tilt));


			this._storms.push({
				model:mtx,
				seed
			});
		}

		this.modelMatrix = mat4.create();
		mat4.translate(this.modelMatrix, this.modelMatrix, vGlobal);

		const s = 0.025;
		this.modelGiantMatrix = mat4.create();
		
		mat4.translate(this.modelGiantMatrix, this.modelGiantMatrix, vGlobal);
		mat4.scale(this.modelGiantMatrix, this.modelGiantMatrix, vec3.fromValues(s, s, s));
		mat4.rotateY(this.modelGiantMatrix, this.modelGiantMatrix, Math.PI * 0.5);
	}

	_initTextures() {
		console.log('init textures');

		const size = 1024;
		this._fboNoise = new alfrid.FrameBuffer(size, size, {
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR
		}, true);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();

		this._vLines = new ViewLines();
		this._vFloor = new ViewFloor();
		this._vNoise = new ViewNoise();
		// this._vGiant = new ViewGiant();


		this._fboNoise.bind();
		GL.clear(0, 0, 0, 0);
		this._vNoise.render();
		this._fboNoise.unbind();
	}


	render() {
		GL.clear(0, 0, 0, 0);
		this._vLines.update();

		GL.rotate(this.modelMatrix);
		this._vFloor.render(this._fboNoise.getTexture(0), this._fboNoise.getTexture(1));

		this._storms.forEach( storm => {
			GL.rotate(storm.model);
			this._vLines.render(storm.seed);
		});


		// const s = 200;
		// GL.viewport(0, 0, s, s);
		// this._bCopy.draw(this._fboNoise.getTexture(0));
		// GL.viewport(s, 0, s, s);
		// this._bCopy.draw(this._fboNoise.getTexture(1));
		// GL.viewport(s * 2, 0, s, s);
		// this._bCopy.draw(this._fboNoise.getTexture(2));
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;