// ViewModel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';

class ViewModel extends alfrid.View {
	
	constructor() {
		super();
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