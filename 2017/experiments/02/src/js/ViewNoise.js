// ViewNoise.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/noise.frag';

class ViewNoise extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uSeed", "float", Math.random() * 0xFF);
		GL.draw(this.mesh);
	}


}

export default ViewNoise;