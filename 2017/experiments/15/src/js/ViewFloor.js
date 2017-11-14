// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 35;
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
	}


	render(mShadowMatrix, mDepthTexture) {
		this.shader.bind();
		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("uMapSize", "vec2", [1024, 1024]);
		this.shader.uniform("textureDepth", "uniform1i", 0);
		mDepthTexture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewFloor;