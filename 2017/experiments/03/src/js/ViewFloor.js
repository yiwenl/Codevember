// ViewFloor.js
import alfrid, { GL } from 'alfrid';

import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 12;
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
	}


	render(mShadowMatrix, mShadowMap) {
		this.shader.bind();
		this.shader.uniform("uPosition", "vec3", [0, -2, 0]);

		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("textureDepth", "uniform1i", 0);
		mShadowMap.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewFloor;