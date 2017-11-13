// ViewCubes.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/cubes.vert';

class ViewCubes extends alfrid.View {
	
	constructor() {
		super(vs);
	}


	_init() {
		const s = .1;
		this.mesh = alfrid.Geom.cube(s, s, s);

		const w = 0.8;
		const h = 1.8;
		const d = 1.2;
		const positons = [];
		for(let x = -w; x<=w; x += s) {
			for(let y = -h; y<=h; y += s) {
				for(let z = -d; z<=d; z += s) {
					positons.push([x, y, z]);
				}
			}
		}

		console.log('numCubes', positons.length);

		this.mesh.bufferInstance(positons, 'aPosOffset');
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewCubes;