// ViewFakeAO.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/ao.vert';
import fs from 'shaders/ao.frag';

class ViewFakeAO extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 0.035;
		this.mesh = alfrid.Geom.sphere(s, 12);
	}

	setInstance(mPosition) {
		this.mesh.bufferInstance(mPosition, 'aPosOffset');
	}


	render() {
		this.shader.bind();

		this.shader.uniform("uRadius", "float", params.radius);
		this.shader.uniform("uTime", "float", params.time);
		this.shader.uniform("uWaveSize", "float", params.waveSize);
		
		GL.draw(this.mesh);
	}


}

export default ViewFakeAO;