// ViewCubes.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/cubes.vert';
import fs from 'shaders/cubes.frag';
import Assets from './Assets';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewCubes extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xff;
	}


	_init() {
		const num = 50;
		const positions = [];
		const extras = [];
		const {cos, sin, sqrt, PI} = Math;

		function getPos() {
			let r = 1.5 * sqrt(Math.random());
			let z = 2 * Math.random() - 1;
			let t = 2 * PI * Math.random();
			let x = sqrt(1 - z*z) * cos(t);
			let y = sqrt(1 - z*z) * sin(t);

			const v = vec3.fromValues(x, y, z);
			vec3.normalize(v, v);
			vec3.scale(v, v, r);

			return v;

		}

		for(let i=0; i<num; i++) {
			positions.push(getPos());
			extras.push([Math.random(), Math.random(), Math.random()]);
		}


		this.mesh = Assets.get('cube');
		this.mesh.bufferInstance(positions, 'aPosOffset');
		this.mesh.bufferInstance(extras, 'aExtra');
	}


	render() {
		GL.disable(GL.CULL_FACE);
		this.time += 0.01;
		this.shader.bind();
		this.shader.uniform("uTime", "float", this.time);
		GL.draw(this.mesh);
		GL.enable(GL.CULL_FACE);
	}


}

export default ViewCubes;