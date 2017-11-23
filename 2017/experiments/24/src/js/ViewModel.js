// ViewModel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import fs from 'shaders/model.frag';

class ViewModel extends alfrid.View {
	
	constructor() {
		super(null, fs);
	}


	_init() {
		this.mesh = Assets.get('model');
	}


	render(mExtrude=0.0) {
		this.shader.bind();
		this.shader.uniform("uExtrude", "float", mExtrude);
		GL.draw(this.mesh);
	}


}

export default ViewModel;