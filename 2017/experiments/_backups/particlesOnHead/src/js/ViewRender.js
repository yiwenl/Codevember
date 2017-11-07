// ViewRender.js

import alfrid from 'alfrid';
const vsRender = require('../shaders/render.vert');
const fsRender = require('../shaders/render.frag');
let GL = alfrid.GL;

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vsRender, fsRender);
		this.time = Math.random() * 0xFFF;
	}


	_init() {
		let positions    = [];
		let numParticles = params.numParticles;
		let ux, uy;

		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {
				ux = i / numParticles;
				uy = j / numParticles;
				positions.push([ux, uy, Math.random()]);
			}
		}

		// this.mesh = new alfrid.Mesh(GL.POINTS);
		// this.mesh.bufferVertex(positions);
		// this.mesh.bufferIndex(indices);

		const s = 0.05;
		this.mesh = alfrid.Geom.cube(s, s, s);
		this.mesh.bufferInstance(positions, 'aPosOffset');

		this.roughness = 1;
		this.specular = 0.5;
		this.metallic = 1;

		gui.add(this, 'roughness', 0, 1);
		gui.add(this, 'specular', 0, 1);
		gui.add(this, 'metallic', 0, 1);
	}


	render(textureCurr, textureNext, p, textureExtra, textureNormal, textureRad, textureIrr) {
		this.time += 0.1;
		this.shader.bind();

		this.shader.uniform('textureCurr', 'uniform1i', 0);
		textureCurr.bind(0);

		this.shader.uniform('textureNext', 'uniform1i', 1);
		textureNext.bind(1);

		this.shader.uniform('textureExtra', 'uniform1i', 2);
		textureExtra.bind(2);

		this.shader.uniform("textureNormal", "uniform1i", 3);
		textureNormal.bind(3);

		this.shader.uniform('uRadianceMap', 'uniform1i', 4);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 5);
		textureRad.bind(4);
		textureIrr.bind(5);

		this.shader.uniform('percent', 'float', p);
		this.shader.uniform('time', 'float', this.time);

		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);


		GL.draw(this.mesh);
	}


}

export default ViewRender;