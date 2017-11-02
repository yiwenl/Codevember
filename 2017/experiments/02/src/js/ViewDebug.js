// ViewDebug.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/debug.vert';
import fs from 'shaders/debug.frag';

class ViewDebug extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 10;
		this.mesh = alfrid.Geom.plane(s, s, 50, 'xz');
	}


	render(textureHeight, textureNormal) {
		this.shader.bind();
		this.shader.uniform("textureHeight", "uniform1i", 0);
		textureHeight.bind(0);

		this.shader.uniform("textureNormal", "uniform1i", 1);
		textureNormal.bind(1);
		GL.draw(this.mesh);
	}


}

export default ViewDebug;