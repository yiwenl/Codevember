// ViewLine.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/line.vert';

class ViewLine extends alfrid.View {
	
	constructor() {
		super(vs, alfrid.ShaderLibs.simpleColorFrag);
	}


	_init() {
		const positions = [
			[0, 1, 0],
			[1, 1, 0]
		]
		this.mesh = new alfrid.Mesh(GL.LINES);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndex([0, 1]);
	}


	render(p0, p1, color=[1, 0, 0], opacity=1) {
		this.shader.bind();
		this.shader.uniform("color", "vec3", color);
		this.shader.uniform("opacity", "float", opacity);
		this.shader.uniform("uPoint0", "vec3", p0);
		this.shader.uniform("uPoint1", "vec3", p1);
		GL.draw(this.mesh);
	}


}

export default ViewLine;