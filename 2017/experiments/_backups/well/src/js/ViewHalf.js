// ViewHalf.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/half.vert';
import Assets from './Assets';

class ViewHalf extends alfrid.View {
	
	constructor() {
		super(vs, alfrid.ShaderLibs.simpleColorFrag);
	}


	_init() {
		this.mesh = Assets.get('halfCube');
	}


	render() {
		this.shader.bind();
		this.shader.uniform("color", "vec3", [1, 0, 0]);
		this.shader.uniform("opacity", "float", 1);
		this.shader.uniform("uScale", "float", params.cubeSize);

		this.shader.uniform("color", "vec3", [1, 0, 0]);
		this.shader.uniform("uRotation", "float", 0);
		GL.draw(this.mesh);

		this.shader.uniform("color", "vec3", [0, 1, 0]);
		this.shader.uniform("uRotation", "float", Math.PI);
		GL.draw(this.mesh);
	}


}

export default ViewHalf;