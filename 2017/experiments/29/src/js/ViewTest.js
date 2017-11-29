// ViewTest.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/test.vert';
import fs from 'shaders/test.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewTest extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 2;
		this.diskSize = s;
		this.mesh = alfrid.Geom.plane(s, s, 100, 'xz');

		let r = 8;

		const getPos = () => {
			return [random(-r/2, r/2), random(2, 4), random(-r, r)];
		}


		const positions = [];
		const extras = [];
		const numLamps = 20;

		for(let i=0; i<numLamps; i++) {
			positions.push(getPos());
			extras.push([random(1, 2), Math.random(), random(.5, 2)])
		}

		this.mesh.bufferInstance(positions, 'aPosOffset');
		this.mesh.bufferInstance(extras, 'aExtra');

		this.positions = positions;

	}


	render() {
		this.shader.bind();
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime);
		this.shader.uniform("uSize", "float", this.diskSize);
		GL.draw(this.mesh);
	}


}

export default ViewTest;