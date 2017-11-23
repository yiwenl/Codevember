// ViewRender.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/render.vert';
import fs from 'shaders/render.frag';
import Assets from './Assets';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFFF;

		this.shaderTest = new alfrid.GLShader();
	}


	_init() {
		let uvs    = [];
		let extras = [];
		let uvOffset = [];
		let uvScale = [];

		let count        = 0;
		let numParticles = params.numParticles;
		let ux, uy;

		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {
				ux = i / numParticles;
				uy = j / numParticles;
				uvs.push([ux, uy]);
				extras.push([Math.random(), Math.random(), Math.random()])

				let s = random(.3, .5);

				uvOffset.push([Math.random() * .5, Math.random() * .5]);
				uvScale.push([s, s]);
			}
		}

		this.mesh = Assets.get('plane');
		this.mesh.bufferInstance(uvs, 'aUV');
		this.mesh.bufferInstance(extras, 'aExtra');
		this.mesh.bufferInstance(uvOffset, 'aUVOffset');
		this.mesh.bufferInstance(uvScale, 'aUVScale');

		this.texture = Assets.get('newspaper');
		this.textureNormal = Assets.get('paper');
	}


	render(textureCurr, textureVel, textureExtra, textureExtra2) {
		this.time += 0.1;
		this.shader.bind();

		this.shader.uniform('textureCurr', 'uniform1i', 0);
		textureCurr.bind(0);

		this.shader.uniform('textureVel', 'uniform1i', 1);
		textureVel.bind(1);

		this.shader.uniform('textureExtra', 'uniform1i', 2);
		textureExtra.bind(2);

		this.shader.uniform('textureExtra2', 'uniform1i', 3);
		textureExtra2.bind(3);

		this.shader.uniform("texture", "uniform1i", 4);
		this.texture.bind(4);

		this.shader.uniform("textureNormal", "uniform1i", 5);
		this.textureNormal.bind(5);

		this.shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		this.shader.uniform('time', 'float', this.time);
		this.shader.uniform("uLightPos", "vec3", params.lightPosition);
		this.shader.uniform(params.particles);
		GL.draw(this.mesh);


		// this.shaderTest.bind();
		// GL.draw(this.mesh);
	}


}

export default ViewRender;