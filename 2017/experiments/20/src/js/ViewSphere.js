// ViewSphere.js

import alfrid, { GL, Scheduler } from 'alfrid';
import vs from 'shaders/sphere.vert';
import fs from 'shaders/sphere.frag';

class ViewSphere extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 1;
		this.mesh = alfrid.Geom.sphere(s, 24);
	}


	render(mHit) {
		GL.disable(GL.CULL_FACE);
		this.shader.bind();
		this.shader.uniform("uTime", "float", Scheduler.deltaTime);
		this.shader.uniform("uHit", "vec3", mHit);
		GL.draw(this.mesh);
		GL.enable(GL.CULL_FACE);
	}


}

export default ViewSphere;