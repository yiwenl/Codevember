// ViewLight.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/light.vert';
import Assets from './Assets';

class ViewLight extends alfrid.View {
	
	constructor() {
		super(vs, alfrid.ShaderLibs.copyFrag);
	}


	_init() {
		const s = 3;
		this.mesh = alfrid.Geom.plane(s, s, 1);
		this.texture = Assets.get('light');
	}


	render(pos = [0, 0, 0]) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("uPosition", "vec3", pos);
		GL.draw(this.mesh);
	}


}

export default ViewLight;