// ViewObjModel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';

import vs from '../shaders/pbr.vert';
import fs from '../shaders/pbr.frag';

class ViewObjModel extends alfrid.View {
	
	constructor(mName, willFade=false) {

		super(vs, fs);
		this._name = mName
		this._willFade = willFade;
		this._initMesh();
	}


	_initMesh() {
		this.mesh = Assets.get(this._name);
		this.textureAO = Assets.get(`ao_${this._name}`);

		this.roughness = 1;
		this.specular = 0.5;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];

		this.shader.bind();

		this.shader.uniform('uAoMap', 'uniform1i', 0);
		this.shader.uniform("textureMap", "uniform1i", 1);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 2);
		this.shader.uniform('uRadianceMap', 'uniform1i', 3);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);
		this.shader.uniform("uWillFade", "float", this._willFade ? 1.0 : 0.0);
	}


	render(textureRad, textureIrr, textureMap) {
		this.shader.bind();

		this.textureAO.bind(0);
		textureMap.bind(1);
		textureIrr.bind(2);
		textureRad.bind(3);
		GL.draw(this.mesh);
	}


}

export default ViewObjModel;