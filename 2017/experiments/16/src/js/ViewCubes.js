// ViewCubes.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/cubes.vert';
import fs from 'shaders/cubes.frag';

class ViewCubes extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		const s = .1;
		this.size = s;
		this.mesh = alfrid.Geom.cube(s, s, s);

		const w = 0.8;
		const h = 1.8;
		const d = 1.2;
		const positons = [];
		for(let x = -w; x<=w; x += s) {
			for(let y = -h; y<=h; y += s) {
				for(let z = -d; z<=d; z += s) {
					positons.push([x, y, z]);
				}
			}
		}

		this.mesh.bufferInstance(positons, 'aPosOffset');

		this.roughness = 0.25;
		this.specular = 0.5;
		this.metallic = 1;
		this.baseColor = [1, 1, 1];
	}

	update() {
		this.time += 0.01;
	}


	render(fbo0, fbo1, mShadowMatrix0, mShadowMatrix1, mProjInver0, mProjInver1, mViewInvert0, mViewInvert1, mHit, textureRad, textureIrr) {
		this.shader.bind();

		this.shader.uniform("depth0", "uniform1i", 0);
		fbo0.getDepthTexture().bind(0);
		this.shader.uniform("depth1", "uniform1i", 1);
		fbo1.getDepthTexture().bind(1);

		this.shader.uniform("texture0", "uniform1i", 2);
		fbo0.getTexture().bind(2);
		this.shader.uniform("texture1", "uniform1i", 3);
		fbo1.getTexture().bind(3);

		this.shader.uniform('uRadianceMap', 'uniform1i', 4);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 5);
		textureRad.bind(4);
		textureIrr.bind(5);

		this.shader.uniform("uShadowMatrix0", "mat4", mShadowMatrix0);
		this.shader.uniform("uShadowMatrix1", "mat4", mShadowMatrix1);
		this.shader.uniform("uProjInvert0", "mat4", mProjInver0);
		this.shader.uniform("uProjInvert1", "mat4", mProjInver1);
		this.shader.uniform("uViewInvert0", "mat4", mViewInvert0);
		this.shader.uniform("uViewInvert1", "mat4", mViewInvert1);

		this.shader.uniform("uTime", "float", this.time);
		this.shader.uniform("uRange", "float", this.range);

		this.shader.uniform("uLight", "vec3", params.lightPosition);
		this.shader.uniform("uHit", "vec3", mHit);
		this.shader.uniform("uCubeSize", "float", this.size * 2);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);
		
		GL.draw(this.mesh);
	}


}

export default ViewCubes;