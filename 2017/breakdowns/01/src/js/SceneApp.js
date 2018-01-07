// SceneApp.js

import alfrid, { Scene, GL, CameraPerspective } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/cylinders.vert';
import fs from 'shaders/cylinders.frag';

const radius = 10;
const RAD = Math.PI / 180;
const FOV = 55;
const ratio = 533/800;

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();

		//	Adjust the camera control, disable the zooming
		this.orbitalControl.radius.value = radius;
		this.orbitalControl.radius.limit(radius, radius);
		this.camera.setPerspective(FOV * RAD, GL.aspectRatio, .1, 50);

		//	Setup a camera from the imagine light source
		this.cameraPortrait = new CameraPerspective();
		this.cameraPortrait.setPerspective(FOV * RAD, ratio, .1, 50);

		this.pointSource = vec3.fromValues(0, 0, -radius);
		this.cameraPortrait.lookAt(this.pointSource, [0, -1, 0], [0, 1, 0]);

		this.biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		//	Getting the shadow matrix from this camera
		this.shadowMatrix = mat4.create();
		mat4.multiply(this.shadowMatrix, this.cameraPortrait.projection, this.cameraPortrait.viewMatrix);
		mat4.multiply(this.shadowMatrix, this.biasMatrix, this.shadowMatrix);

	}

	_initTextures() {
		console.log('init textures');
		//	Getting the portrait texture
		this.texturePortrait = Assets.get('p01');
	}


	_initViews() {
		console.log('init views');

		//	Initialise the shader
		this.shader = new alfrid.GLShader(vs, fs);

		//	Load in the cyliner obj file
		this.mesh = Assets.get('cylinder');
		const numPillars = 80;
		const positions = [];
		const extras = [];
		const {sin, cos, random, PI} = Math;


		//	get random position within a circle
		function getPos() {
			let t = 2 * PI * random();
			let u = random() + random();
			let r = u>1 ? 2-u : u;
			r *= 4.0;
			return [r*cos(t), 0, r*sin(t)]
		}


		//	setup the instancing
		for(let i=0; i<numPillars; i++) {
			positions.push(getPos());
		}

		this.mesh.bufferInstance(positions, 'aPosOffset');
	}


	render() {
		GL.clear(0, 0, 0, 0);

		//	binding shader then setup the uniforms
		this.shader.bind();
		this.shader.uniform("uShadowMatrix", "mat4", this.shadowMatrix);
		this.shader.uniform("texturePortrait", "uniform1i", 1);
		this.texturePortrait.bind(1);
		this.shader.uniform("uRatio", "float", ratio);

		//	draw the mesh
		GL.draw(this.mesh);
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;