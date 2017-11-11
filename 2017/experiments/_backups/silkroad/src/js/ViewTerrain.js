// ViewTerrain.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/terrain.vert';
import fs from 'shaders/terrain.frag';

class ViewTerrain extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 5;
		const num = 100;
		this.mesh = alfrid.Geom.plane(s, s, num, 'xz');
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

export default ViewTerrain;