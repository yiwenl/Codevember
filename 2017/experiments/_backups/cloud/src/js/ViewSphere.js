// ViewSphere.js


import alfrid, { GL } from 'alfrid';
import vs from 'shaders/sphere.vert';
import fs from 'shaders/sphere.frag';

class ViewSphere extends alfrid.View {
	
	constructor(mOffsets) {
		super(vs, fs);
		this._offsets = mOffsets;
		this._initMesh();
	}


	_initMesh() {
		console.table(this._offsets);

		this.startY = this._offsets[0][1];
		this.gap = this._offsets[1][1] - this._offsets[0][1];

		console.log(this.startY, this.gap);

		this.mesh = alfrid.Geom.sphere(3, 96);
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime);

		this.shader.uniform("startY", "float", this.startY);
		this.shader.uniform("gap", "float", this.gap);
		GL.draw(this.mesh);
	}


}

export default ViewSphere;