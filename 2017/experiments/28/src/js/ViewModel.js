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
		this.texture = Assets.get('ao');
	}


	render() {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewModel;