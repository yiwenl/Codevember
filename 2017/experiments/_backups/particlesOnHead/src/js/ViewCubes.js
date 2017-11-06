// ViewCubes.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/cubes.vert';
import fs from 'shaders/cubes.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewCubes extends alfrid.View {
	
	constructor() {
		super(vs);
	}


	_init() {
		const s = .1;
		this.mesh = alfrid.Geom.cube(s, s, s);

		const positions = [];
		const num = 5000;
		const r = 1.5;
		for(let i=0; i<num; i++) {
			positions.push([random(-r, r), random(-r*2, r*2), random(-r, r)]);
			// positions.push([-.3, random(-r*2, r*2), random(-r, r)]);
		}

		this.mesh.bufferInstance(positions, 'aPosOffset');
	}


	render(texture0, mShadowMatrix0, texture1, mShadowMatrix1, mProjInver0, mProjInver1, mViewInvert0, mViewInvert1) {
		this.shader.bind();

		this.shader.uniform("texture0", "uniform1i", 0);
		texture0.bind(0);
		this.shader.uniform("texture1", "uniform1i", 1);
		texture1.bind(1);

		this.shader.uniform("uShadowMatrix0", "mat4", mShadowMatrix0);
		this.shader.uniform("uShadowMatrix1", "mat4", mShadowMatrix1);
		this.shader.uniform("uProjInvert0", "mat4", mProjInver0);
		this.shader.uniform("uProjInvert1", "mat4", mProjInver1);
		this.shader.uniform("uViewInvert0", "mat4", mViewInvert0);
		this.shader.uniform("uViewInvert1", "mat4", mViewInvert1);

		GL.draw(this.mesh);
	}


}

export default ViewCubes;