// ViewWings.js

import alfrid, { GL } from 'alfrid';
const vs = require('../shaders/pbr.vert');
const fs = require('../shaders/pbr.frag');

class ViewWings	extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		let strObj = getAsset('objWing');
		this.mesh = alfrid.ObjLoader.parse(strObj);

		this.vertices = this.mesh.vertices;


		//	set GOLD
		this.roughness = .95;
		this.specular = 0.85;
		this.metallic = 0.95;
		this.baseColor = [1.000, 0.766, 0.276];
		
		const f = gui.addFolder('Wings');		
		f.add(this, 'roughness', 0, 1);
		f.add(this, 'specular', 0, 1);
		f.add(this, 'metallic', 0, 1);
		f.open();
	}


	render(textureRad, textureIrr, textureAO, textureNoise) {
		this.shader.bind();

		this.shader.uniform('uAoMap', 'uniform1i', 0);
		this.shader.uniform("uNoiseMap", "uniform1i", 1);
		this.shader.uniform('uRadianceMap', 'uniform1i', 2);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 3);
		textureAO.bind(0);
		textureNoise.bind(1);
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

export default ViewWings;