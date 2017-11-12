// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/floor.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(null, fs);
	}


	_init() {
		const s = 5;
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewFloor;