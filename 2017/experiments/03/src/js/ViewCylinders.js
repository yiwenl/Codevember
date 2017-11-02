// ViewCylinders.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/cylinder.vert';
import fs from 'shaders/cylinder.frag';
import Assets from './Assets';

const num = 80;
const ratio = 533/800;

class ViewCylinders extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.shaderColor = new alfrid.GLShader(vs, alfrid.ShaderLibs.simpleColorFrag);
	}


	_init() {
		this.mesh = Assets.get('cylinder');

		const positions = [];
		const extras = [];
		const {sin, cos, random, PI} = Math;

		function getPos() {
			let t = 2 * PI * random();
			let u = random() + random();
			let r = u>1 ? 2-u : u;
			r *= 4.0;
			return [r*cos(t), 0, r*sin(t)]
		}

		for(let i=0; i<num; i++) {
			positions.push(getPos());
			extras.push([Math.random(), Math.random(), Math.random()]);
		}

		this.mesh.bufferInstance(positions, 'aPosOffset');
		this.mesh.bufferInstance(extras, 'aExtra');

		this.texturePortrait = Assets.get('p01');

	}


	render(mShadowMatrix) {
		if(!mShadowMatrix) {
			this.shaderColor.bind();
			this.shaderColor.uniform('color', 'vec3', [1, 1, 1]);
			this.shaderColor.uniform("opacity", "float", 1);
			GL.draw(this.mesh);
			return;
		}
		this.shader.bind();
		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("texturePortrait", "uniform1i", 1);
		this.texturePortrait.bind(1);
		this.shader.uniform("uRatio", "float", ratio);
		GL.draw(this.mesh);
	}


}

export default ViewCylinders;