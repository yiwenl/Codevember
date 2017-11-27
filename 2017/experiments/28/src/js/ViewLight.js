// ViewLight.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/light.vert';
import fs from 'shaders/light.frag';
var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewLight extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this._seed = Math.random() * 0xFF;
		this._initMesh();
	}


	_initMesh() {
		this.mesh = new alfrid.Mesh(GL.LINES);

		const positions = [];
		const uvs = [];
		const extras = [];
		const indices = [];
		const numLines = 600;
		let count = 0;

		this.lines = [];

		const addLight = (p0, p1, s0, s1) => {
			let r0 = random(.5, 1);
			let r1 = random(.5, 1);

			for(let i=0; i<numLines; i++) {
				let a = getPos(p0, s0);
				let b = getPos(p1, s1);

				this.lines.push({a, b});
				positions.push(a);
				positions.push(b);

				let t = Math.random();

				uvs.push([t, Math.random()]);
				uvs.push([t, Math.random()]);

				extras.push([r0, r1]);
				extras.push([r0, r1]);

				indices.push(count);
				indices.push(count+1);
				count += 2;
			}
		}

		const getPos = (p, s) => {
			let x = p[0] + random(-s, s);
			let z = p[2] + random(-s, s);
			let y = p[1];
			return [x, y, z];
		}


		const getSource = () => {
			let r = 0.5;
			let x = random(-r, r);
			let y = random(3, 4);
			let z = random(-r, r);
			let s = random(.1, .2);

			return {
				pos:[x, y, z],
				size:s
			}
		}


		const getTarget = () => {
			let r = 1.0;
			let x = random(-r, r);
			let y = 0;
			let z = random(-r, r);
			let s = random(.3, .5);

			return {
				pos:[x, y, z],
				size:s
			}
		}


		const { numLight } = params;
		this.targets = [];
		for(let i=0; i<numLight; i++) {
			let source = getSource();
			let target= getTarget();

			this.targets.push(target);

			addLight(source.pos, target.pos, source.size, target.size);
		}

		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferIndex(indices);
		this.mesh.bufferData(extras, 'aExtra');
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime + this._seed);
		GL.draw(this.mesh);
	}


}

export default ViewLight;