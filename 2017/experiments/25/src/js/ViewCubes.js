// ViewCubes.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/cubes.vert';
import fs from 'shaders/cubes.frag';
import Assets from './Assets';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewCubes extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = params.cubeSize;
		this.mesh = alfrid.Geom.cube(s, s, s);
		

		const positions = [];
		const rotations = [];
		const extras = [];
		const {boundary} = params;

		function getAxis() {
			let axis = vec3.fromValues(random(-1, 1), random(-1, 1), random(-1, 1));
			vec3.normalize(axis, axis);
			return axis;
		}


		function getRotation() {
			const axis = getAxis();
			const a = random(-Math.PI, Math.PI);
			// const a = 1.0;

			return [axis[0], axis[1], axis[2], a];
		}


		for(let i = -boundary.x; i<boundary.x; i+= s) {
			for(let j = -boundary.y; j<boundary.y; j+= s) {
				for(let k = -boundary.z; k<boundary.z; k+= s) {
					positions.push([i, j, k]);
					rotations.push(getRotation());
					extras.push([Math.random(), Math.random(), Math.random()]);
				}
			}
		}

		this.mesh.bufferInstance(positions, 'aPosOffset');
		this.mesh.bufferInstance(rotations, 'aRotation');
		this.mesh.bufferInstance(extras, 'aExtra');
		this.posOffset = positions;
		this.rotations = rotations;
		this.extras = extras;

		this.roughness = 1;
		this.specular = 1;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];

		this.textureRad = Assets.get('studio_radiance');
		this.textureIrr = Assets.get('irr');
	}


	render(fbo0, fbo1, mShadowMatrix0, mShadowMatrix1, mProjInver0, mProjInver1, mViewInvert0, mViewInvert1, mHit, mRadius) {
		const s = params.cubeSize - 0.1;
		const uniforms = {
			uPosition:[s, 0, 0],
			uSize:[s/2, s/2, s/2]
		}

		this.shader.bind();
		this.shader.uniform(uniforms);

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

		this.shader.uniform("uOffset", "float", params.offset);
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime);


		this.shader.uniform('uRadianceMap', 'uniform1i', 4);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 5);
		this.textureRad.bind(4);
		this.textureIrr.bind(5);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);
		this.shader.uniform("uHit", "vec3", mHit);
		this.shader.uniform("uRadius", "float", mRadius);

		GL.draw(this.mesh);


		
	}


}

export default ViewCubes;