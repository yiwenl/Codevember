// ViewCubes.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/cube.vert';
import fs from 'shaders/cube.frag';

const num = 2000;
var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewCubes extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.shaderColor = new alfrid.GLShader(vs, alfrid.ShaderLibs.simpleColorFrag);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		const s = .1;
		this.mesh = alfrid.Geom.cube(s, s, s);

		const positions = [];
		const extras = [];

		const getPos = () => {
			let r = random(.5, 1);
			let a = Math.random() * Math.PI * 2.0;

			const x = Math.cos(a) * r;
			const y = Math.sin(a) * r;
			const z = random(.2, -.2);

			return [x, y, z];
		}

		for(let i=0; i<num; i++) {
			positions.push(getPos());
			extras.push([Math.random(), Math.random(), Math.random()]);
		}

		this.mesh.bufferInstance(positions, 'aPosOffset');
		this.mesh.bufferInstance(extras, 'aExtra');
	}

	update() {
		this.time += 0.01;
	}

	render(mShadowMatrix, mShadowMap) {
		if(!mShadowMatrix) {
			this.shaderColor.bind();
			this.shaderColor.uniform("uTime", "float", this.time);
			this.shaderColor.uniform("color", "vec3", [1, 1, 1]);
			this.shaderColor.uniform("opacity", "float", 1);

			GL.draw(this.mesh);

			return;
		}
		this.shader.bind();
		this.shader.uniform(window.params.light);
		this.shader.uniform("uTime", "float", this.time);

		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("textureDepth", "uniform1i", 0);
		mShadowMap.bind(0);

		GL.draw(this.mesh);
	}


}

export default ViewCubes;