// ViewTunnel.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/tunnel.vert';
import fs from 'shaders/tunnel.frag';
import Assets from './Assets';

class ViewTunnel extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		const positions = [];
		const uvs = [];
		const indices = [];
		let count = 0;

		const num = 12;
		const r = 3;
		const length = 10;
		function getPos(i, j) {
			let a = -Math.PI * 2.0 * i/num;
			let z = (j/num - 0.5) * length;
			let x = Math.cos(a) * r;
			let y = Math.sin(a) * r;

			return [x, y, z];
		}

		for(let i=0; i<num; i++) {
			for(let j=0; j<num; j++) {
				positions.push(getPos(i, j));
				positions.push(getPos(i+1, j));
				positions.push(getPos(i+1, j+1));
				positions.push(getPos(i, j+1));

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

		this.texture = Assets.get('color1');
	}


	render() {
		this.time += 0.01;
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("uTime", "float", this.time);
		GL.draw(this.mesh);
	}


}

export default ViewTunnel;