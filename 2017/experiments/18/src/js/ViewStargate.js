// ViewStargate.js

import alfrid, { GL, Scheduler } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/stargate.vert';
import fs from 'shaders/stargate.frag';

class ViewStargate extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = 0xFF * Math.random()
	}


	_init() {
		this.mesh = Assets.get('tunnel');
		this.texture = Assets.get('color1');
	}


	render() {
		GL.gl.cullFace(GL.gl.FRONT);
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("uTime", "float", Scheduler.deltaTime);
		GL.draw(this.mesh);
		GL.gl.cullFace(GL.gl.BACK);
	}


}

export default ViewStargate;