// ViewCubes.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/cubes.vert';
import fs from 'shaders/cubes.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewCubes extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		const numCubes = 10000;
		const s = .1;
		this.mesh = alfrid.Geom.cube(s, s, s);
		const range = 1.75;
		const d = 1;
		this.range = range;

		function getPos() {
			return [random(-range, range), random(0, 1.4), random(-.35, .35)];
		}

		const positions = [];
		const extras = [];

		for(let i=0; i<numCubes; i++) {
			positions.push(getPos());
			extras.push([Math.random(), Math.random(), Math.random()]);
		}

		this.mesh.bufferInstance(positions, 'aPosOffset');
		this.mesh.bufferInstance(extras, 'aExtra');
	}


	render(fbo0, fbo1, mShadowMatrix0, mShadowMatrix1, mProjInver0, mProjInver1, mViewInvert0, mViewInvert1) {
		this.time += 0.025;
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

		this.shader.uniform("uTime", "float", this.time);
		this.shader.uniform("uRange", "float", this.range);

		this.shader.uniform("uLight", "vec3", params.lightPosition);

		GL.draw(this.mesh);
	}


}

export default ViewCubes;