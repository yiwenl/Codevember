// ViewObjModel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';

import vs from '../shaders/pbr.vert';
import fs from '../shaders/pbr.frag';

import fsTest from 'shaders/test.frag';

class ViewObjModel extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('venus');

		this.roughness = 1;
		this.specular = 0.5;
		this.metallic = 0;
		const grey = .75;
		this.baseColor = [grey, grey, grey*.9];

		this.textureNormal = Assets.get('normal');
		this.textureAo = Assets.get('ao');

	}


	render1() {
		


		this.shader.bind();

		this.shader.uniform("textureNormal", "uniform1i", 0);
		textureNormal.bind(0);

		this.shader.uniform("textureAo", "uniform1i", 1);
		textureAo.bind(1);

		GL.draw(this.mesh);
	}

	render(textureRad, textureIrr) {
		this.shader.bind();

		this.shader.uniform('uNormalMap', 'uniform1i', 0);
		this.shader.uniform('uAoMap', 'uniform1i', 1);
		this.shader.uniform('uRadianceMap', 'uniform1i', 2);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 3);
		this.textureNormal.bind(0);
		this.textureAo.bind(1);
		textureRad.bind(2);
		textureIrr.bind(3);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		GL.draw(this.mesh);
	}


}

export default ViewObjModel;