// ViewCylinder.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/cylinder.vert';
import fs from 'shaders/cylinder.frag';
import Assets from './Assets';

class ViewCylinder extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const num = 12;
		const numY = 4;
		const height = 10;
		const radius = 2;

		const positions = [];
		const normals = [];
		const uvs = [];
		const indices = [];
		let index = 0;
		const margin = .0;

		function getPos(i, j) {
			let angle = i/num * (Math.PI * 0.5 - margin * 2) + margin;
			let y = (j/numY) * height;
			let x = Math.cos(angle) * radius;
			let z = Math.sin(angle) * radius;

			let position = vec3.fromValues(x, y, z);
			let normal = vec3.fromValues(x, 0, z);
			vec3.normalize(normal, normal);
			return {position, normal}
		}

		for(let i=0; i<num; i++) {
			for(let j=0; j<numY; j++) {
				const o00 = getPos(i, j);
				const o10 = getPos(i+1, j);
				const o11 = getPos(i+1, j+1);
				const o01 = getPos(i, j+1);

				positions.push(o00.position);
				positions.push(o10.position);
				positions.push(o11.position);
				positions.push(o01.position);


				normals.push(o00.normal);
				normals.push(o10.normal);
				normals.push(o11.normal);
				normals.push(o01.normal);

				uvs.push([i/num, j/numY]);
				uvs.push([(i+1)/num, j/numY]);
				uvs.push([(i+1)/num, (j+1)/numY]);
				uvs.push([i/num, (j+1)/numY]);

				indices.push(index * 4 + 0);
				indices.push(index * 4 + 1);
				indices.push(index * 4 + 2);
				indices.push(index * 4 + 0);
				indices.push(index * 4 + 2);
				indices.push(index * 4 + 3);

				index ++;

			}
		}

		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferNormal(normals);
		this.mesh.bufferIndex(indices);

		this.textureDiffuse = Assets.get('wallDiffuse');
		this.textureNormal = Assets.get('wallNormal');
	}


	render(mShadowMatrix, texture) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);
		this.shader.uniform("textureDiffuse", "uniform1i", 1);
		this.textureDiffuse.bind(1);
		this.shader.uniform("textureNormal", "uniform1i", 2);
		this.textureNormal.bind(2);
		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		GL.draw(this.mesh);
	}


}

export default ViewCylinder;