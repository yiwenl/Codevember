// ViewRender.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/render.vert';
import fs from 'shaders/render.frag';

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFFF;
	}


	_init() {
		const positions    = [];
		const coords       = [];
		const indices      = []; 
		let count        = 0;
		const numParticles = params.numParticles;
		let ux, uy;

		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {
				ux = i / numParticles;
				uy = j / numParticles;
				positions.push([ux, uy, 0]);
				indices.push(count);
				count ++;

			}
		}

		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndex(indices);
	}


	render(texturePos, textureVel, textureExtra, textureLife) {
		this.time += 0.1;
		this.shader.bind();

		this.shader.uniform("texturePos", "uniform1i", 0);
		texturePos.bind(0);

		this.shader.uniform("textureVel", "uniform1i", 1);
		textureVel.bind(1);

		this.shader.uniform('textureExtra', 'uniform1i', 2);
		textureExtra.bind(2);

		this.shader.uniform("textureLife", "uniform1i", 3);
		textureLife.bind(3);

		this.shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		this.shader.uniform('time', 'float', this.time);
		GL.draw(this.mesh);
	}


}

export default ViewRender;