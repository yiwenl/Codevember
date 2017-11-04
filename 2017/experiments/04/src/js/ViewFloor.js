// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';
import Assets from './Assets';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.size = 20;
		this.mesh = alfrid.Geom.plane(this.size, this.size, 1, 'xz');

		this.textureDiffuse = Assets.get('groundDiffuse');
		this.textureNormal = Assets.get('groundNormal');
	}


	render(mShadowMatrix, texture) {
		this.shader.bind();
		this.shader.uniform("uPosition", "vec3", [0, 0, 0]);
		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("texture", "uniform1i", 0);
		this.shader.uniform("uSize", "float", this.size/2);
		texture.bind(0);
		this.shader.uniform("textureDiffuse", "uniform1i", 1);
		this.textureDiffuse.bind(1);
		this.shader.uniform("textureNormal", "uniform1i", 2);
		this.textureNormal.bind(2);
		GL.draw(this.mesh);
	}


}

export default ViewFloor;