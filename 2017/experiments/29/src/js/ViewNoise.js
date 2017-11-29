// ViewNoise.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/noise.vert';
import fs from 'shaders/noise.frag';

class ViewNoise extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 20;
		this.mesh = alfrid.Geom.plane(s/2, s, 1, 'xz');
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime * 0.1);
		GL.draw(this.mesh);
	}


}

export default ViewNoise;