// ViewRing.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from '../shaders/pbr.vert';
import fs from '../shaders/pbr.frag';

class ViewRing extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('ring');
		this.textureNormal = Assets.get('brickNormal');
		this.textureSpecular = Assets.get('brickSpecular');
		this.textureDiffuse = Assets.get('brickDiffuse');

		this.textureIrr = Assets.get('irr');
		this.textureRad = Assets.get('tunnel_radiance');

		this.roughness = 1;
		this.specular = 0;
		this.metallic = 1;
		const g = 1;
		this.baseColor = [g, g, g];
	}


	render() {
		this.shader.bind();

		this.shader.uniform("textureDiffuse", "uniform1i", 0);
		this.textureDiffuse.bind(0);

		this.shader.uniform("textureSpecular", "uniform1i", 1);
		this.textureSpecular.bind(1);

		this.shader.uniform("textureNormal", "uniform1i", 2);
		this.textureNormal.bind(2);

		this.shader.uniform('uRadianceMap', 'uniform1i', 3);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 4);
		this.textureRad.bind(3);
		this.textureIrr.bind(4);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		GL.draw(this.mesh);
	}


}

export default ViewRing;