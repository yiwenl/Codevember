// ViewGiant.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/giant.vert';
import fs from 'shaders/giant.frag';

class ViewGiant extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('giant');

		this.mtx = mat4.create();
		this.mtxModel = mat4.create();
		const s = 0.1;
		mat4.translate(this.mtxModel, this.mtxModel, vec3.fromValues(0, -0.65, 0));
		mat4.scale(this.mtxModel, this.mtxModel, vec3.fromValues(s, s, s));
	}


	render(fbo0, fbo1, mShadowMatrix0, mShadowMatrix1, mProjInver0, mProjInver1, mViewInvert0, mViewInvert1) {
		GL.rotate(this.mtxModel);
		this.shader.bind();

		this.shader.uniform("depth0", "uniform1i", 0);
		fbo0.getDepthTexture().bind(0);
		this.shader.uniform("depth1", "uniform1i", 1);
		fbo1.getDepthTexture().bind(1);

		this.shader.uniform("texture0", "uniform1i", 2);
		fbo0.getTexture().bind(2);
		this.shader.uniform("texture1", "uniform1i", 3);
		fbo1.getTexture().bind(3);

		this.shader.uniform("uShadowMatrix0", "mat4", mShadowMatrix0);
		this.shader.uniform("uShadowMatrix1", "mat4", mShadowMatrix1);
		this.shader.uniform("uProjInvert0", "mat4", mProjInver0);
		this.shader.uniform("uProjInvert1", "mat4", mProjInver1);
		this.shader.uniform("uViewInvert0", "mat4", mViewInvert0);
		this.shader.uniform("uViewInvert1", "mat4", mViewInvert1);

		GL.gl.cullFace(GL.gl.FRONT);
		this.shader.uniform("uColor", "vec3", [1, 1, 1]);
		this.shader.uniform("uLineWidth", "float", .05);
		GL.draw(this.mesh);

		GL.gl.cullFace(GL.gl.BACK);
		this.shader.uniform("uColor", "vec3", [0, 0, 0]);
		this.shader.uniform("uLineWidth", "float", 0);
		GL.draw(this.mesh);

		GL.rotate(this.mtx);
	}


}

export default ViewGiant;