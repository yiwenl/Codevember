// ViewMirror.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/mirror.vert';
import fs from 'shaders/mirror.frag';
import Assets from './Assets';

class ViewMirror extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		// this.mesh = alfrid.Geom.plane(2, 2, 1);
		this.mesh = alfrid.Geom.cube(2, 2, .001);
		this.texture = Assets.get('flo');
	}


	render() {
		// console.log(GL.camera.position);
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("uCameraPos", "vec3", GL.camera.position);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure * 1.25);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma * 0.5);
		
		GL.draw(this.mesh);
	}


}

export default ViewMirror;