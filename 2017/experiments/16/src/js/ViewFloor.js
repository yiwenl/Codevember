// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.mtx = mat4.create();
		this.mtxModel = mat4.create();
		mat4.translate(this.mtxModel, this.mtxModel, vec3.fromValues(0, -2.5, 0.0));
	}


	_init() {
		const s = 7;
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
	}


	render(mShadowMatrix, mDepthTexture) {
		GL.rotate(this.mtxModel);
		this.shader.bind();
		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("uMapSize", "vec2", [1024, 1024]);
		this.shader.uniform("textureDepth", "uniform1i", 0);
		mDepthTexture.bind(0);
		GL.draw(this.mesh);
		GL.rotate(this.mtx);
	}


}

export default ViewFloor;