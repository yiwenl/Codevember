// ViewRoom.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/room.vert';
import fs from 'shaders/room.frag';

class ViewRoom extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 6;
		this.mesh = alfrid.Geom.cube(s, s, s);
	}


	render(texture) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.shader.uniform("uCameraPos", "vec3", GL.camera.position);
		texture.bind(0);

		GL.draw(this.mesh);
	}


}

export default ViewRoom;