// ViewGiant.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import fs from 'shaders/giant.frag';

class ViewGiant extends alfrid.View {
	
	constructor() {
		super(null, fs);
		this.mtxGiant = mat4.create();
		const s = 0.15;
		mat4.scale(this.mtxGiant, this.mtxGiant, vec3.fromValues(s, s, s));

		this.mtxModel = mat4.create();
	}


	_init() {
		this.mesh = Assets.get('giant');
		this.texture = Assets.get('aoGiant');
	}


	render() {
		GL.rotate(this.mtxGiant);
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		GL.draw(this.mesh);
		GL.rotate(this.mtxModel);
	}


}

export default ViewGiant;