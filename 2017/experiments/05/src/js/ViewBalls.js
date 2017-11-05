// ViewBalls.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/balls.vert';
import fs from 'shaders/sphere.frag';

import Assets from './Assets';

class ViewBalls extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const meshBall = Assets.get('isoSphere');
		const positions = [];
		const cache = [];

		meshBall.vertices.forEach(vertex => {
			let strVertex = vertex.toString();

			if(cache.indexOf(strVertex) === -1) {
				positions.push(vertex);
				cache.push(strVertex);
			}
			
		});

		const s = 0.075;
		this.mesh = alfrid.Geom.sphere(s, 12);
		this.mesh.bufferInstance(positions, 'aPosOffset');

		this.roughness = 1;
		this.specular = 1;
		this.metallic = 0.2;
		const g = .01;
		this.baseColor = [g, g, g * 2];

		gui.add(this, 'roughness', 0, 1);
		gui.add(this, 'specular', 0, 1);
		gui.add(this, 'metallic', 0, 1);


		this.posOffset = positions;
	}


	render(textureRad, textureIrr) {
		this.shader.bind();

		this.shader.uniform('uRadianceMap', 'uniform1i', 0);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 1);
		textureRad.bind(0);
		textureIrr.bind(1);

		this.shader.uniform("uRadius", "float", params.radius);
		this.shader.uniform("uTime", "float", params.time);
		this.shader.uniform("uWaveSize", "float", params.waveSize);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);
		GL.draw(this.mesh);
	}


}

export default ViewBalls;