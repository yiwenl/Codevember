// ViewSphere.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/sphere.frag';

class ViewSphere extends alfrid.View {
	
	constructor() {
		super(null, fs);
	}


	_init() {
		const s = 20;
		this.mesh = alfrid.Geom.sphere(s, 24, true);
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewSphere;