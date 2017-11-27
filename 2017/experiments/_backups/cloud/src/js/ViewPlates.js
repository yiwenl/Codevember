// ViewPlates.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/plates.vert';
import fs from 'shaders/plates.frag';
import fsShadow from 'shaders/platesSimple.frag';

class ViewPlates extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.shaderShadow = new alfrid.GLShader(vs, fsShadow);
	}


	_init() {
		const s = 10;
		const t = .05;
		this.mesh = alfrid.Geom.cube(s, t, s);

		this.posOffsets = [];
		const num = 10;
		const gap = 0.5;
		let sy = -gap * num / 2 + gap /2;

		for(let i=0; i<num; i++) {
			let y = sy + i * gap;
			this.posOffsets.push([0, y, 0]);
		}

		this.mesh.bufferInstance(this.posOffsets, 'aPosOffset');
	}

	renderShadow(textureTop, textureBottom, mShadowMatrix0, mShadowMatrix1) {
		const shader = this.shaderShadow
		shader.bind();

		shader.uniform("uShadowMatrix0", "mat4", mShadowMatrix0);
		shader.uniform("uShadowMatrix1", "mat4", mShadowMatrix1);

		shader.uniform("textureTop", "uniform1i", 0);
		textureTop.bind(0);

		shader.uniform("textureBottom", "uniform1i", 1);
		textureBottom.bind(1);

		shader.uniform("uLightPos", "vec3", params.lightPos);

		GL.disable(GL.CULL_FACE);
		GL.draw(this.mesh);
	}


	render(textureTop, textureBottom, mShadowMatrix0, mShadowMatrix1, mShadowMatrix, mTextureShadow) {
		this.shader.bind();


		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("uShadowMatrix0", "mat4", mShadowMatrix0);
		this.shader.uniform("uShadowMatrix1", "mat4", mShadowMatrix1);

		this.shader.uniform("textureTop", "uniform1i", 0);
		textureTop.bind(0);

		this.shader.uniform("textureBottom", "uniform1i", 1);
		textureBottom.bind(1);

		this.shader.uniform("textureShadow", "uniform1i", 2);
		mTextureShadow.bind(2);

		this.shader.uniform("uLightPos", "vec3", params.lightPos);

		GL.disable(GL.CULL_FACE);
		GL.draw(this.mesh);
	}


}

export default ViewPlates;