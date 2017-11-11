// ViewLines.js


import alfrid, { GL } from 'alfrid';
import vs from 'shaders/lines.vert';
import fs from 'shaders/lines.frag';
const random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewLines extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		const positions = [];
		const uvs = [];
		const normals = [];
		const indices = [];
		let count = 0;

		const num = 12;
		const radius = 1;
		const width = .025;
		this.num = num;

		for(let i=0; i<num; i++) {
			// top
			positions.push([i, width, width]);
			positions.push([i, width, -width]);
			positions.push([i+1, width, -width]);
			positions.push([i+1, width, width]);
			

			uvs.push([i/num, i]);
			uvs.push([i/num, i]);
			uvs.push([(i+1)/num, i]);
			uvs.push([(i+1)/num, i]);

			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;

			// bottom
			positions.push([i+1, -width, width]);
			positions.push([i+1, -width, -width]);
			positions.push([i, -width, -width]);
			positions.push([i, -width, width]);

			uvs.push([(i+1)/num, i]);
			uvs.push([(i+1)/num, i]);
			uvs.push([i/num, i]);
			uvs.push([i/num, i]);

			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;

			//	outer
			positions.push([i+1,  width, width]);
			positions.push([i+1, -width, width]);
			positions.push([i, -width, width]);
			positions.push([i,  width, width]);

			uvs.push([(i+1)/num, i]);
			uvs.push([(i+1)/num, i]);
			uvs.push([i/num, i]);
			uvs.push([i/num, i]);

			normals.push([1, 0, 1]);
			normals.push([1, 0, 1]);
			normals.push([1, 0, 1]);
			normals.push([1, 0, 1]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;


			//	inner
			positions.push([i+1, -width, -width]);
			positions.push([i+1,  width, -width]);
			positions.push([i,  width, -width]);
			positions.push([i, -width, -width]);

			uvs.push([(i+1)/num, i]);
			uvs.push([(i+1)/num, i]);
			uvs.push([i/num, i]);
			uvs.push([i/num, i]);

			normals.push([1, 0, -1]);
			normals.push([1, 0, -1]);
			normals.push([1, 0, -1]);
			normals.push([1, 0, -1]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;
		}

		const numInstances = 300;
		const posOffset = [];
		const extras = [];

		function getPos() {
			let d = .1;
			let y = 1.5;
			return [random(-d, d), random(-y, y), random(-d, d)];
		}
		for(let i=0; i<numInstances; i++) {
			posOffset.push(getPos());
			extras.push([Math.random(), Math.random(), Math.random()]);
		}

		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferNormal(normals);
		this.mesh.bufferIndex(indices);

		this.mesh.bufferInstance(posOffset, 'aPosOffset');
		this.mesh.bufferInstance(extras, 'aExtra');
	}

	update() {
		this.time += 0.1;
	}

	render(seed = 0) {
		this.shader.bind();
		this.shader.uniform("num", "float", this.num);
		this.shader.uniform("uTime", "float", this.time + seed);

		GL.gl.cullFace(GL.gl.FRONT);
		this.shader.uniform("uColor", "vec3", [0, 0, 0]);
		this.shader.uniform("uLineWidth", "float", 0.01);
		GL.draw(this.mesh);

		GL.gl.cullFace(GL.gl.BACK);
		this.shader.uniform("uColor", "vec3", [1, 1, 1]);
		this.shader.uniform("uLineWidth", "float", 0.0);
		GL.draw(this.mesh);
	}


}

export default ViewLines;