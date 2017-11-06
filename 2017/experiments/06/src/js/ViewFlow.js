// ViewFlow.js

import alfrid, { GL } from 'alfrid';

import vs from 'shaders/flow.vert';
import fs from 'shaders/flow.frag';
import Assets from './Assets';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewFlow extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		this.range = 10;
		const range = 10;
		const num = 100;
		this.range = range;

		const positions = [];
		const extras = [];

		function getPos() {
			let r = Math.random() * 3;
			let a = Math.random() * Math.PI * 2.0;

			return [Math.cos(a) * r, Math.sin(a) * r, random(-range, range)]
		}


		this.mesh = alfrid.Geom.sphere(.1, 12);
		for(let i=0; i<num; i++) {
			positions.push(getPos());
			extras.push([Math.random(), Math.random(), Math.random()]);
		}

		this.mesh.bufferInstance(positions, 'aPosOffset');
		this.mesh.bufferInstance(extras, 'aExtra');

		this.texture = Assets.get('irr');
	}


	render() {
		this.time += 0.25;
		this.shader.bind();
		this.shader.uniform("uRange", "float", this.range);
		this.shader.uniform("uTime", "float", this.time);
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform(params.hdr);

		GL.draw(this.mesh);
	}


}

export default ViewFlow;