// ViewGiant.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/giant.vert';
import fs from 'shaders/giant.frag';
import Assets from './Assets';

class ViewGiant extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('giant');
		this.texture = Assets.get('aoGiant');
	}


	render() {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		

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

export default ViewGiant;