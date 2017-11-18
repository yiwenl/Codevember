// ViewTunnel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/tunnel.vert';
import fs from 'shaders/tunnel.frag';

class ViewTunnel extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('tunnel');
	}


	render() {
		GL.disable(GL.CULL_FACE);
		this.shader.bind();
		GL.draw(this.mesh);
		GL.enable(GL.CULL_FACE);
	}


}

export default ViewTunnel;