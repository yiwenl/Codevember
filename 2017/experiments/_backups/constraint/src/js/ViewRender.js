// ViewRender.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/render.vert';
import fs from 'shaders/render.frag';
import Assets from './Assets';

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFFF;
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


		this.textureRad = Assets.get('studio_radiance'); 
		this.textureIrr = Assets.get('irr');

		this.roughness = 1;
		this.specular = 0;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];
	}


	render(texturePos, textureVel, textureExtra, textureLife) {
		this.time += 0.1;
		this.shader.bind();

		this.shader.uniform("texturePos", "uniform1i", 0);
		texturePos.bind(0);

		this.shader.uniform("textureVel", "uniform1i", 1);
		textureVel.bind(1);

		this.shader.uniform("textureExtra", "uniform1i", 2);
		textureExtra.bind(2);

		this.shader.uniform("textureLife", "uniform1i", 3);
		textureLife.bind(3);

		this.shader.uniform('uRadianceMap', 'uniform1i', 4);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 5);

		this.textureRad.bind(4);
		this.textureIrr.bind(5);

		this.shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		this.shader.uniform('time', 'float', this.time);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);
		
		GL.draw(this.mesh);
	}


}

export default ViewRender;