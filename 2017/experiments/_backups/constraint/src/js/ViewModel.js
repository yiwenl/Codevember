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


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewModel;