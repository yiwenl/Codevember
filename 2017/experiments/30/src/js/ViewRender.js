// ViewRender.js

import alfrid from 'alfrid';
const vsRender = require('../shaders/render.vert');
const fsRender = require('../shaders/render.frag');
let GL = alfrid.GL;

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vsRender, fsRender);
		this.shaderShadow = new alfrid.GLShader(vsRender, alfrid.ShaderLibs.simpleColorFrag);

		this.shaderShadow.bind();
		this.shaderShadow.uniform({
			color:[1, 1, 1],
			opacity:1
		});
	}


	_init() {
		let positions    = [];
		let coords       = [];
		let indices      = []; 
		let count        = 0;
		let numParticles = params.numParticles;
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


	render(textureCurr, textureNext, p, textureExtra, textureDebug, shadowMatrix, textureDepth) {
		this.shader.bind();

		this.shader.uniform('textureCurr', 'uniform1i', 0);
		textureCurr.bind(0);

		this.shader.uniform('textureNext', 'uniform1i', 1);
		textureNext.bind(1);

		this.shader.uniform('textureExtra', 'uniform1i', 2);
		textureExtra.bind(2);

		this.shader.uniform("textureDebug", "uniform1i", 3);
		textureDebug.bind(3);

		this.shader.uniform("textureDepth", "uniform1i", 4);
		textureDepth.bind(4);

		this.shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		this.shader.uniform('percent', 'float', p);
		this.shader.uniform('time', 'float', alfrid.Scheduler.deltaTime);
		this.shader.uniform("uShadowMatrix", "mat4", shadowMatrix);
		GL.draw(this.mesh);
	}

	renderShadow(textureCurr, textureNext, p, textureExtra, textureDebug) {
		const shader = this.shaderShadow;
		shader.bind();

		shader.uniform('textureCurr', 'uniform1i', 0);
		textureCurr.bind(0);

		shader.uniform('textureNext', 'uniform1i', 1);
		textureNext.bind(1);

		shader.uniform('textureExtra', 'uniform1i', 2);
		textureExtra.bind(2);

		shader.uniform("textureDebug", "uniform1i", 3);
		textureDebug.bind(3);

		shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		shader.uniform('percent', 'float', p);
		shader.uniform('time', 'float', alfrid.Scheduler.deltaTime);
		GL.draw(this.mesh);
	}


}

export default ViewRender;