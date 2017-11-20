// ViewSaveExtra.js

import alfrid, { GL } from 'alfrid';

class ViewSaveExtra extends alfrid.View {
	
	constructor() {
		super();
	}


	_init() {
		this.mesh;
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewSaveExtra;