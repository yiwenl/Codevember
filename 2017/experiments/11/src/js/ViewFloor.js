// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const size = 15;
		this.mesh = alfrid.Geom.plane(size, size, 100, 'xz');
	}


	render(textureHeight, textureNormal) {
		this.shader.bind();
		this.shader.uniform("textureHeight", "uniform1i", 0);
		textureHeight.bind(0);
		this.shader.uniform("textureNormal", "uniform1i", 1);
		textureNormal.bind(1);
	

		GL.gl.cullFace(GL.gl.FRONT);
		this.shader.uniform("uColor", "vec3", [0, 0, 0]);
		this.shader.uniform("uLineWidth", "float", 0.1);
		GL.draw(this.mesh);

		GL.gl.cullFace(GL.gl.BACK);
		this.shader.uniform("uColor", "vec3", [1, 1, 1]);
		this.shader.uniform("uLineWidth", "float", 0.0);
		GL.draw(this.mesh);
	}


}

export default ViewFloor;