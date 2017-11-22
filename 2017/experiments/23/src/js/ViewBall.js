// ViewBall.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/ball.vert';
import fs from 'shaders/ball.frag';

class ViewBall extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = alfrid.Geom.sphere(1, 24);
	}


	render(mPos, mScale) {
		this.shader.bind();
		this.shader.uniform("uPos", "vec3", mPos);
		this.shader.uniform("uScale", "float", mScale * 0.5);
		this.shader.uniform("uLightPos", "vec3", params.lightPosition);
		GL.draw(this.mesh);
	}


}

export default ViewBall;