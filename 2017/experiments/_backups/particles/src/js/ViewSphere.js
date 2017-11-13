// ViewSphere.js

import alfrid, { GL } from 'alfrid';

class ViewSphere extends alfrid.View {
	
	constructor() {
		super();
	}


	_init() {
		const s = params.maxRadius;
		this.mesh = alfrid.Geom.sphere(s, 24);
		this.mesh.generateFaces();
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewSphere;