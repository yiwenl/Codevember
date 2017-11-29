// SceneApp.js

import alfrid, { Scene, GL, TouchDetector } from 'alfrid';
import ViewTest from './ViewTest';
import ViewLightBulb from './ViewLightBulb';
import ViewBulbGlass from './ViewBulbGlass';
import ViewFloor from './ViewFloor';
import ViewLight from './ViewLight';
import ViewNoise from './ViewNoise';
import ViewRipple from './ViewRipple';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		
		this._lastHit = vec3.create();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.73;
		this.orbitalControl.radius.value = 15;
		this.orbitalControl.radius.limit(8, 20);
		this.orbitalControl.rx.limit(0.05, Math.PI/2 - .1);
	}

	_initTextures() {
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vTest = new ViewTest();
		this._vBulbs = new ViewLightBulb();
		this._vLights = new ViewLight();
		this._vBulbsGlass = new ViewBulbGlass();
		this._vBulbs.setupInstance(this._vTest.positions);
		this._vLights.setupInstance(this._vTest.positions);
		this._vBulbsGlass.setupInstance(this._vTest.positions);
		this._vFloor = new ViewFloor();
		this._vNoise = new ViewNoise();

		const s = 16;
		const mesh = alfrid.Geom.plane(s/2, s, 1, 'xz');
		this.mesh = mesh;
		this._detector = new TouchDetector(mesh, this.camera);
		this._detector.on('onHit', (e)=>{
			this._addRipple(e.detail.hit);
		})

		this.shader = new alfrid.GLShader();

		const numRipples = 20;
		this._ripples = [];

		for(let i=0; i<numRipples; i++) {
			const r = new ViewRipple();
			this._ripples.push(r);
		}
	}


	_addRipple(hit) {
		
		const dist = vec3.dist(this._lastHit, hit);
		if(dist < 2.5) {
			return;
		}

		if(this._ripples[0].opacity > 0.01) {
			return;
		}

		console.log('add ripple :', hit);
		const ripple = this._ripples.shift();
		ripple.launch(hit);
		this._ripples.push(ripple);

		for(let i=0; i<5; i++) {
			this._ripples[i].close();	
		}

		vec3.copy(this._lastHit, hit);
	}


	render() {
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);
		

		GL.enableAdditiveBlending();
		GL.disable(GL.DEPTH_TEST);
		this._vTest.render();
		this._ripples.forEach( r => {
			r.render();
		});
		this._vNoise.render();


		GL.enableAlphaBlending();
		GL.enable(GL.DEPTH_TEST);
		this._vBulbs.render();
		this._vBulbsGlass.render();


		// GL.enableAdditiveBlending();
		GL.disable(GL.DEPTH_TEST);
		this._vLights.render();


	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;