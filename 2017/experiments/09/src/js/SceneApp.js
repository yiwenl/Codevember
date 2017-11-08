// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import ViewMirror from './ViewMirror';
import ViewFrame from './ViewFrame';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.rx.value = -0.05;
		this.orbitalControl.radius.value = 7;
		this.orbitalControl.radius.limit(5, 10);
		this.camera.setPerspective(Math.PI * .25, GL.aspectRatio, .1, 100);


		const s = .35;
		const r = 1.;
		const a = -.8;

		this.modelMatrixMirror1 = mat4.create();
		mat4.translate(this.modelMatrixMirror1, this.modelMatrixMirror1, vec3.fromValues(0, 1.5, 0));
		

		this.modelMatrix1 = mat4.create();
		this.modelMatrix2 = mat4.create();

		mat4.translate(this.modelMatrix1, this.modelMatrix1, vec3.fromValues(.4, -1.5, -r));
		mat4.rotateY(this.modelMatrix1, this.modelMatrix1, a);
		mat4.scale(this.modelMatrix1, this.modelMatrix1, vec3.fromValues(s, s, s));
		
		mat4.translate(this.modelMatrix2, this.modelMatrix2, vec3.fromValues(.4, -1.5, r));
		mat4.rotateY(this.modelMatrix2, this.modelMatrix2, -a);
		mat4.scale(this.modelMatrix2, this.modelMatrix2, vec3.fromValues(s, s, -s));
		

	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		// this._bSky = new alfrid.BatchSkybox();

		this._vModel = new ViewObjModel();
		this._vMirror = new ViewMirror();
		this._vFrame = new ViewFrame();
	}


	render() {
		GL.clear(0, 0, 0, 0);


		GL.disable(GL.DEPTH_TEST);

		
		GL.rotate(this.modelMatrixMirror1);
		GL.gl.cullFace(GL.gl.BACK);
		this._vMirror.render();
		
		// GL.rotate(this.modelMatrixMirror2);
		// GL.gl.cullFace(GL.gl.FRONT);
		// this._vMirror.render();


		GL.enable(GL.DEPTH_TEST);

		this._vFrame.render(Assets.get('studio_radiance'), Assets.get('irr'));

		GL.gl.cullFace(GL.gl.BACK);
		GL.rotate(this.modelMatrix1);
		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'));

		GL.gl.cullFace(GL.gl.FRONT);
		GL.rotate(this.modelMatrix2);
		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'));
		
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;