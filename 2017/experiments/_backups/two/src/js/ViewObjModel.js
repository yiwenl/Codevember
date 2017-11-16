// ViewObjModel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';

import vs from '../shaders/pbr.vert';
import fs from '../shaders/pbr.frag';

class ViewObjModel extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('model');

		this.roughness = 1;
		this.specular = 0;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];

		gui.add(this, 'roughness', 0, 1);
		gui.add(this, 'specular', 0, 1);
		gui.add(this, 'metallic', 0, 1);
	}


	render(textureRad, textureIrr, textureAO, textureMap) {
		this.shader.bind();

		this.shader.uniform('uAoMap', 'uniform1i', 0);
		this.shader.uniform("textureMap", "uniform1i", 1);
		this.shader.uniform('uRadianceMap', 'uniform1i', 2);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 3);

		
		textureAO.bind(0);
		textureMap.bind(1);
		textureRad.bind(2);
		textureIrr.bind(3);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		GL.gl.cullFace(GL.gl.FRONT);
		this.shader.uniform("uColor", "vec3", [1, 1, .95]);
		this.shader.uniform("uLineWidth", "float", 0.01);
		this.shader.uniform("uOutline", "float", 1);
		GL.draw(this.mesh);

		GL.gl.cullFace(GL.gl.BACK);
		this.shader.uniform("uColor", "vec3", [0, 0, 0]);
		this.shader.uniform("uLineWidth", "float", 0.0);
		this.shader.uniform("uOutline", "float", 0);
		GL.draw(this.mesh);
	}


}

export default ViewObjModel;