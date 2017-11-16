// ViewSim.js

import alfrid from 'alfrid';
const GL = alfrid.GL;
const fsSim = require('../shaders/sim.frag');


class ViewSim extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fsSim);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('textureVel', 'uniform1i', 4);
		this.shader.uniform('texturePos', 'uniform1i', 5);
		this.shader.uniform('textureExtra', 'uniform1i', 6);
		this.shader.uniform("textureLife", "uniform1i", 7);
		this.shader.uniform("textureMap", "uniform1i", 8);

	}


	render(textureVel, texturePos, textureExtra, textureLife, textureMap, fbo0, fbo1, mShadowMatrix0, mShadowMatrix1, mProjInver0, mProjInver1, mViewInvert0, mViewInvert1) {
		this.time += .01;
		this.shader.bind();
		this.shader.uniform('time', 'float', this.time);
		this.shader.uniform('maxRadius', 'float', params.maxRadius);
		textureVel.bind(4);
		texturePos.bind(5);
		textureExtra.bind(6);
		textureLife.bind(7);
		textureMap.bind(8);


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

		GL.draw(this.mesh);
	}


}

export default ViewSim;