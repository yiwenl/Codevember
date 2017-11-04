// ViewGiant.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/giant.vert';
import fs from 'shaders/giant.frag';
import Assets from './Assets';

class ViewGiant extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.modelMatrix = mat4.create();
		const s = .1;
		mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0, -2, -5));
		mat4.scale(this.modelMatrix, this.modelMatrix, vec3.fromValues(s, s, s))
	}


	_init() {
		this.mesh = Assets.get('giant');
		console.log(this.mesh);
		this.texture = Assets.get('aoGiant');
	}


	render(mLightPos) {
		GL.rotate(this.modelMatrix);
		this.shader.bind();
		this.shader.uniform("uLightPos", "vec3", mLightPos);
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewGiant;