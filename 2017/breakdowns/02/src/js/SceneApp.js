// SceneApp.js

import alfrid, { Scene, GL, GLShader, Geom, CameraOrtho, FrameBuffer } from 'alfrid';
import Assets from './Assets';
import ViewLine from './ViewLine';
import vsModel from 'shaders/model.vert';
import fsModel from 'shaders/model.frag';
import vsCubes from 'shaders/cubes.vert';
import fsCubes from 'shaders/cubes.frag';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.radius.value = 5;

		//	setup the front / back camera to get the shadow matrices
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		this._shadowMatrix0 = mat4.create();
		this._shadowMatrix1 = mat4.create();

		const y = .5;
		this.pointSource0 = vec3.fromValues(0, y, 7);
		this.pointSource1 = vec3.fromValues(0, y, -7);
		this._target0 = vec3.fromValues(0, y, 4);
		this._target1 = vec3.fromValues(0, y, -4);
		let s = 1.5;
		this._cameraLight0 = new CameraOrtho();
		this._cameraLight0.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight0.lookAt(this.pointSource0, [0, y, 0]);

		this._cameraLight1 = new CameraOrtho();
		this._cameraLight1.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight1.lookAt(this.pointSource1, [0, y, 0]);

		mat4.multiply(this._shadowMatrix0, this._cameraLight0.projection, this._cameraLight0.viewMatrix);
		mat4.multiply(this._shadowMatrix0, this._biasMatrix, this._shadowMatrix0);

		mat4.multiply(this._shadowMatrix1, this._cameraLight1.projection, this._cameraLight1.viewMatrix);
		mat4.multiply(this._shadowMatrix1, this._biasMatrix, this._shadowMatrix1);

		//	get the invert view / projection matrix from the cameras
		this._projInvert0 = mat4.create();
		mat4.invert(this._projInvert0, this._cameraLight0.projection);

		this._viewInvert0 = mat4.create();
		mat4.invert(this._viewInvert0, this._cameraLight0.matrix);

		this._projInvert1 = mat4.create();
		mat4.invert(this._projInvert1, this._cameraLight1.projection);

		this._viewInvert1 = mat4.create();
		mat4.invert(this._viewInvert1, this._cameraLight1.matrix);

		//	get the depth textures
		this._getDepthMaps();	
	}

	_initTextures() {

		//	init shaders
		this.shaderModel = new GLShader(vsModel, fsModel);
		this.shaderCubes = new GLShader(vsCubes, fsCubes);
	}


	_initViews() {
		console.log('init views');

		//	for debugging
		this._bCopy = new alfrid.BatchCopy();
		this._bBall = new alfrid.BatchBall();
		this._vLine = new ViewLine();


		//	3d model
		this.meshModel = Assets.get('model');

		//	ao map
		this.textureAO = Assets.get('aomap');

		//	create cubes, using instancing
		this.cubeSize = 0.1;
		const s = 0.005;
		this.meshCube = Geom.cube(this.cubeSize-s, this.cubeSize-s, this.cubeSize-s);
		const w = 0.8;
		const h = 1.8;
		const d = 1.2;
		const positons = [];
		for(let x = -w; x<=w; x += this.cubeSize) {
			for(let y = -h; y<=h; y += this.cubeSize) {
				for(let z = -d; z<=d; z += this.cubeSize) {
					positons.push([x, y, z]);
				}
			}
		}

		this.meshCube.bufferInstance(positons, 'aPosOffset');
	}

	_getDepthMaps() {
	    //  setup render to texture
	    const size = 512;
	    this.fboModel0 = new FrameBuffer(size, size);
	    this.fboModel1 = new FrameBuffer(size, size);

	    //  bind the frame buffer 
	    this.fboModel0.bind();
	    GL.clear(0, 0, 0, 0);
	    //  setup to front camera
	    GL.setMatrices(this._cameraLight0);
	    //  drawing the model
	    this._draw3DModel();
	    //  unbind the frame buffer
	    this.fboModel0.unbind();

	    
	    //  bind the frame buffer 
	    this.fboModel1.bind();
	    GL.clear(0, 0, 0, 0);
	    //  setup to back camera
	    GL.setMatrices(this._cameraLight1);
	    //  drawing the model
	    this._draw3DModel();
	    //  unbind the frame buffer
	    this.fboModel1.unbind();
	}

	_draw3DModel() {
		this.shaderModel.bind();
		this.shaderModel.uniform("texture", "uniform1i", 0);
		this.textureAO.bind(0);
		GL.draw(this.meshModel);
	}


	render() {
		GL.clear(0, 0, 0, 0);

		//	draw cubes
		const shader = this.shaderCubes;
		shader.bind();

		shader.uniform("depth0", "uniform1i", 0);
		this.fboModel0.getDepthTexture().bind(0);
		shader.uniform("depth1", "uniform1i", 1);
		this.fboModel1.getDepthTexture().bind(1);
		shader.uniform("uShadowMatrix0", "mat4", this._shadowMatrix0);
		shader.uniform("uShadowMatrix1", "mat4", this._shadowMatrix1);
		shader.uniform("uProjInvert0", "mat4", this._projInvert0);
		shader.uniform("uProjInvert1", "mat4", this._projInvert1);
		shader.uniform("uViewInvert0", "mat4", this._viewInvert0);
		shader.uniform("uViewInvert1", "mat4", this._viewInvert1);
		shader.uniform("uCubeSize", "float", this.cubeSize * 2);

		GL.draw(this.meshCube);


		/*/ debug
		const size = [.1, .1, .1];
		this._bBall.draw(this.pointSource0, size, [1, .6, 0]);
		this._vLine.render(this.pointSource0, this._target0, [1, .6, .2]);
		this._bBall.draw(this.pointSource1, size, [0, .6, 1]);
		this._vLine.render(this.pointSource1, this._target1, [.2, .6, 1]);

		const s = 200;
		GL.viewport(0, 0, s, s);
		this._bCopy.draw(this.fboModel0.getTexture());

		GL.viewport(s, 0, s, s);
		this._bCopy.draw(this.fboModel1.getTexture());

		GL.viewport(s * 2, 0, s, s);
		this._bCopy.draw(this.fboModel0.getDepthTexture());

		GL.viewport(s * 3, 0, s, s);
		this._bCopy.draw(this.fboModel1.getDepthTexture());
		//*/
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;