// ViewObjModel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';

import vs from '../shaders/pbr.vert';
import fs from '../shaders/pbr.frag';

class ViewObjModel extends alfrid.View {
	
	constructor() {
		super();
	}


	_init() {
		this.mesh = Assets.get('modelHigh');
	}


	render() {
		this.shader.bind();

		GL.draw(this.mesh);
	}


}

export default ViewObjModel;