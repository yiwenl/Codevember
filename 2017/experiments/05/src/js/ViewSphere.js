// ViewSphere.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/sphere.vert';
import fs from 'shaders/sphere.frag';

class ViewSphere extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const positions = [];
		const uvs = [];
		const indices = [];
		let count = 0;
		const num = 24;
		this.num = num

		for(let i=0; i<num; i++) {
			for(let j=0; j<num; j++) {
				positions.push([i, j, 0]);
				positions.push([i+1, j, 0]);
				positions.push([i+1, j+1, 0]);
				positions.push([i, j+1, 0]);

				uvs.push([i/num, j/num]);
				uvs.push([(i+1)/num, j/num]);
				uvs.push([(i+1)/num, (j+1)/num]);
				uvs.push([i/num, (j+1)/num]);

				indices.push(count * 4 + 0);
				indices.push(count * 4 + 1);
				indices.push(count * 4 + 2);
				indices.push(count * 4 + 0);
				indices.push(count * 4 + 2);
				indices.push(count * 4 + 3);

				count ++;

			}
		}


		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferIndex(indices);

		this.roughness = 1;
		this.specular = 0.5;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];

	}


	render(textureRad, textureIrr) {
		this.shader.bind();
		this.shader.uniform('uRadianceMap', 'uniform1i', 0);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 1);
		textureRad.bind(0);
		textureIrr.bind(1);

		this.shader.uniform("uRadius", "float", params.radius);
		this.shader.uniform("uWaveSize", "float", params.waveSize);
		this.shader.uniform("uNum", "float", this.num);
		this.shader.uniform("uTime", "float", params.time);


		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		GL.draw(this.mesh);
	}


}

export default ViewSphere;