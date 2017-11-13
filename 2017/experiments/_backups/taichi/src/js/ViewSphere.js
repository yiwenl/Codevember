// ViewSphere.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/sphere.frag';

class ViewSphere extends alfrid.View {
	
	constructor() {
		super(null, fs);

		this.range = 0.001;
	}


	_init() {
		const s = 20;
		this.mesh = alfrid.Geom.sphere(s, 24 * 2, true);
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uRange", "float", this.range);
		GL.draw(this.mesh);
	}


}

export default ViewSphere;