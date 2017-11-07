// ViewLines.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/lines.vert';
import fs from 'shaders/lines.frag';

class ViewLines extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const num = params.numSlices;

		const positions = [];
		const uvs = [];
		const normals = [];
		const indices = [];
		let count = 0;
		const size = .1;
		const length = 4;

		const segSize = length / num;

		for(let i=0; i<num; i++) {
			let z = -length/2 + i * segSize;

			//	top
			positions.push([-size, size, z+segSize]);
			positions.push([ size, size, z+segSize]);
			positions.push([ size, size, z]);
			positions.push([-size, size, z]);

			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);

			uvs.push([i/num, i+1]);
			uvs.push([i/num, i+1]);
			uvs.push([i/num, i]);
			uvs.push([i/num, i]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;

			// bottom
			positions.push([-size, -size, z]);
			positions.push([ size, -size, z]);
			positions.push([ size, -size, z+segSize]);
			positions.push([-size, -size, z+segSize]);

			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);

			uvs.push([i/num, i]);
			uvs.push([i/num, i]);
			uvs.push([i/num, i+1]);
			uvs.push([i/num, i+1]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;

			// left
			positions.push([size, -size, z]);
			positions.push([size,  size, z]);
			positions.push([size,  size, z+segSize]);
			positions.push([size, -size, z+segSize]);

			normals.push([1, 0, 0]);
			normals.push([1, 0, 0]);
			normals.push([1, 0, 0]);
			normals.push([1, 0, 0]);

			uvs.push([i/num, i]);
			uvs.push([i/num, i]);
			uvs.push([i/num, i+1]);
			uvs.push([i/num, i+1]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;

			// right
			positions.push([-size, -size, z+segSize]);
			positions.push([-size,  size, z+segSize]);
			positions.push([-size,  size, z]);
			positions.push([-size, -size, z]);

			normals.push([-1, 0, 0]);
			normals.push([-1, 0, 0]);
			normals.push([-1, 0, 0]);
			normals.push([-1, 0, 0]);

			uvs.push([i/num, i+1]);
			uvs.push([i/num, i+1]);
			uvs.push([i/num, i]);
			uvs.push([i/num, i]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;
		}

		const uvOffset = [];
		const {numParticles} = params;
		let ux, uy;
		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {
				ux = i / numParticles;
				uy = j / numParticles;
				uvOffset.push([ux, uy, Math.random()]);
			}
		}

		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferNormal(normals);
		this.mesh.bufferIndex(indices);

		this.mesh.bufferInstance(uvOffset, 'aUVOffset');
	}


	render(textures) {
		this.shader.bind();
		this.shader.uniform("num", "float", params.numSlices);
		this.shader.uniform("uRange", "float", params.range);
		

		textures.forEach((t, i) => {
			this.shader.uniform(`texture${i}`, 'uniform1i', i);
			t.bind(i);
		});


		GL.gl.cullFace(GL.gl.FRONT);
		this.shader.uniform("uLineWidth", "float", 0.03);
		this.shader.uniform("uColor", "vec3", [0, 0, 0]);
		GL.draw(this.mesh);

		GL.gl.cullFace(GL.gl.BACK);
		this.shader.uniform("uLineWidth", "float", 0.0);
		this.shader.uniform("uColor", "vec3", [1, 1, 1]);
		GL.draw(this.mesh);
	}


}

export default ViewLines;