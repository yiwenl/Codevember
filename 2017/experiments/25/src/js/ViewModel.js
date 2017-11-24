// ViewModel.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/model.vert';
import fs from 'shaders/model.frag';
import Assets from './Assets';

class ViewModel extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('model');
		this.textureNormal = Assets.get('normal');
		this.textureAO = Assets.get('aomap');

		this.roughness = 1;
		this.specular = 1;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];

		this.textureRad = Assets.get('studio_radiance');
		this.textureIrr = Assets.get('irr');
	}

	setupInstance(positions, rotations, extras) {
		this.mesh.bufferInstance(positions, 'aPosOffset');
		this.mesh.bufferInstance(rotations, 'aRotation');
		this.mesh.bufferInstance(extras, 'aExtra');
	}


	render(mHit, mRadius) {
		const s = params.cubeSize;
		const uniforms = {
			uPosition:[s, 0, 0],
			uSize:[s/2, s/2, s/2]
		}

		this.shader.bind();
		this.shader.uniform(uniforms);

		this.shader.uniform("textureNormal", "uniform1i", 0);
		this.textureNormal.bind(0);

		this.shader.uniform("textureAO", "uniform1i", 1);
		this.textureAO.bind(1);

		this.shader.uniform('uRadianceMap', 'uniform1i', 2);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 3);
		this.textureRad.bind(2);
		this.textureIrr.bind(3);

		this.shader.uniform("uOffset", "float", params.offset);
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime);

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

export default ViewModel;