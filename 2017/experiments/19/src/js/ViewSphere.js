// ViewSphere.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/sphere.vert';
import fs from 'shaders/sphere.frag';

class ViewSphere extends alfrid.View {
	
	constructor() {
		super(vs, fs);

	}


	_init() {
		this.mesh = Assets.get('sphere');
	}


	render(mInitScale = 1) {
		if(!params.flocking) {	return;	}

		const {
			lowThreshold,
			highThreshold,
			minRadius
		} = params.flocking;

		this.shader.bind();
		this.shader.uniform("color", "vec3", [1, 0, 0]);
		this.shader.uniform("uScale", "float", 1 * mInitScale * minRadius);
		this.shader.uniform("uOffset", "float", 0);
		GL.draw(this.mesh);

		this.shader.uniform("color", "vec3", [0, 1, 0]);
		this.shader.uniform("uScale", "float", lowThreshold * mInitScale * minRadius);
		this.shader.uniform("uOffset", "float", 0.04);
		GL.draw(this.mesh);

		this.shader.uniform("color", "vec3", [1, 1, 0]);
		this.shader.uniform("uScale", "float", highThreshold * mInitScale * minRadius);
		this.shader.uniform("uOffset", "float", 0.02);
		GL.draw(this.mesh);

	}


}

export default ViewSphere;