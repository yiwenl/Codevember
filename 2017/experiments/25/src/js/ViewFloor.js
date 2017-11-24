// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 10;
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
		this.mtx = mat4.create();
		mat4.translate(this.mtx, this.mtx, vec3.fromValues(0, -5, 0));
	}


	render(mShadowMatrix, mDepthTexture) {
		this.shader.bind();
		GL.pushMatrix();
		GL.rotate(this.mtx);

		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("textureDepth", "uniform1i", 0);
		mDepthTexture.bind(0);

		GL.draw(this.mesh);
		GL.popMatrix();
	}


}

export default ViewFloor;