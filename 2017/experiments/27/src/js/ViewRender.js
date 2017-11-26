// ViewRender.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/render.vert';
import fs from 'shaders/render.frag';
import fsTest from 'shaders/test.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.shaderShadow = new alfrid.GLShader(vs, fsTest);
		this.time = Math.random() * 0xFFF;
	}


	_init() {
		let positions    = [];
		let positionOffset = [];
		let extras 		 = [];
		let coords       = [];
		let indices      = []; 
		let count        = 0;
		let numParticles = params.numParticles;
		let ux, uy;
		let r = 0.01;

		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {
				ux = i / numParticles;
				uy = j / numParticles;
				positions.push([ux, uy, 0]);
				positionOffset.push([random(-1, 1) * r, random(-1, 1) * r, random(-1, 1) * r]);

				let axis = vec3.fromValues(random(-1, 1), random(-1, 1), random(-1, 1), random(1, 2));
				vec3.normalize(axis, axis);
				extras.push(axis);

				indices.push(count);
				count ++;

			}
		}

		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndex(indices);
		this.mesh.bufferData(positionOffset, 'aPosOffset');
		this.mesh.bufferData(extras, 'aExtra');


		const numRender = 2;
		console.log('Num particles :', numParticles * numParticles * numRender);

		this._rotations = [];
		for(let i=0; i<numRender; i++) {
			this._rotations.push([random(1, 3), Math.random(), Math.random(), random(-Math.PI, Math.PI)]);
		}
	}


	setupUniform(mShadowMatrix) {
		this.shader.bind();
		this.shader.uniform("texturePos", "uniform1i", 0);
		this.shader.uniform("textureExtra", "uniform1i", 1);
		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("textureDepth", "uniform1i", 3);

		this.shaderShadow.bind();
		this.shaderShadow.uniform("texturePos", "uniform1i", 0);
		this.shaderShadow.uniform("textureExtra", "uniform1i", 1);
	}



	render(texturePos, textureExtra, mShadowMatrix, mTextureDepth) {
		this.shader.bind();
		texturePos.bind(0);
		textureExtra.bind(1);
		mTextureDepth.bind(3);

		this.shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime);


		this._rotations.forEach( rotation => {
			this.shader.uniform("uRotation", "vec4", rotation);
			GL.draw(this.mesh);
		});
	}

	renderShadow(texturePos, textureExtra) {
		this.shaderShadow.bind();
		texturePos.bind(0);
		textureExtra.bind(1);
		this.shaderShadow.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		this.shaderShadow.uniform("uTime", "float", alfrid.Scheduler.deltaTime);

		this._rotations.forEach( rotation => {
			this.shaderShadow.uniform("uRotation", "vec4", rotation);
			GL.draw(this.mesh);
		});
	}


}

export default ViewRender;