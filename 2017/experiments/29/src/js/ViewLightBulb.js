// ViewLightBulb.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/bulb.vert';
import fs from 'shaders/bulb.frag';

class ViewLightBulb extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('lightBulb');
		this.texture = Assets.get('aoBulb');
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

export default ViewLightBulb;