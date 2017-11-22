// ViewGrid.js

import alfrid, { GL } from 'alfrid';

class ViewGrid extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.simpleColorFrag);
	}


	_init() {
		const s = params.cubeSize;

		console.log(s);

		const positions = [];
		const indices = [];
		let count = 0;

		positions.push([-s, s, s]);
		positions.push([ s, s, s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;

		positions.push([-s, -s, s]);
		positions.push([ s, -s, s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;

		positions.push([-s, s, -s]);
		positions.push([ s, s, -s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;

		positions.push([-s, -s, -s]);
		positions.push([ s, -s, -s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;


		positions.push([ s, -s,  s]);
		positions.push([ s,  s,  s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;

		positions.push([-s, -s,  s]);
		positions.push([-s,  s,  s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;

		positions.push([ s, -s, -s]);
		positions.push([ s,  s, -s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;

		positions.push([-s, -s, -s]);
		positions.push([-s,  s, -s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;


		positions.push([ s,  s,  s]);
		positions.push([ s,  s, -s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;

		positions.push([-s,  s,  s]);
		positions.push([-s,  s, -s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;

		positions.push([ s, -s,  s]);
		positions.push([ s, -s, -s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;

		positions.push([-s, -s,  s]);
		positions.push([-s, -s, -s]);
		indices.push(count);
		indices.push(count+1);
		count += 2;


		this.mesh = new alfrid.Mesh(GL.LINES);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndex(indices);

		console.log(indices, positions);
	}


	render() {
		this.shader.bind();
		this.shader.uniform("color", "vec3", [1, 1, 1]);
		this.shader.uniform("opacity", "float", 1);
		GL.draw(this.mesh);
	}


}

export default ViewGrid;