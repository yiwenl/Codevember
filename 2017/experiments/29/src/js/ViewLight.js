// ViewLight.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/light.vert';
import fs from 'shaders/light.frag';
import Assets from './Assets';

class ViewLight extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = .5;
		this.mesh = alfrid.Geom.plane(s, s, 1);
		this.texture = Assets.get('light');
	}

	setupInstance(mPositions) {
		this.mesh.bufferInstance(mPositions, 'aPosOffset')
	} 


	render() {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewLight;