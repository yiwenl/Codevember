// ViewSim.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/sim.frag';


class ViewSim extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('textureVel', 'uniform1i', 0);
		this.shader.uniform('texturePos', 'uniform1i', 1);
		this.shader.uniform('textureExtra', 'uniform1i', 2);
		this.shader.uniform("textureOrg", "uniform1i", 3);
		this.shader.uniform("texturePos0", "uniform1i", 5);
		this.shader.uniform("texturePos1", "uniform1i", 4);

		this._isFirstTime = true;
	}


	render(textureVel, texturePos, textureExtra, textureOrg, mShadowMatrix0, mShadowMatrix1, fboModel0, fboModel1) {
		this.time += .01;
		this.shader.bind();

		if(this._isFirstTime) {
			this.shader.uniform("uShadowMatrix0", "mat4", mShadowMatrix0);
			this.shader.uniform("uShadowMatrix1", "mat4", mShadowMatrix1);
			this._isFirstTime = false;
		}

		this.shader.uniform('time', 'float', this.time);
		
		textureVel.bind(0);
		texturePos.bind(1);
		textureExtra.bind(2);
		textureOrg.bind(3);
		fboModel0.getTexture(0).bind(5);
		fboModel1.getTexture(0).bind(4);

		GL.draw(this.mesh);
	}


}

export default ViewSim;