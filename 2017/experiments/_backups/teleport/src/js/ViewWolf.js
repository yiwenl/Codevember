// ViewWolf.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/wolf.vert';
import fs from 'shaders/wolf.frag';

class ViewWolf extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.fps = 30;
		this.frame = 0;

		this.mtxModel = mat4.create();
		const s = 2;
		mat4.scale(this.mtxModel, this.mtxModel, vec3.fromValues(s, s, s));
		mat4.translate(this.mtxModel, this.mtxModel, vec3.fromValues(-.2, 0.07, 0.0));
		mat4.rotateY(this.mtxModel, this.mtxModel, Math.PI / 2);
	}


	_init() {
		// this.mesh;
		this.update();

	}


	update() {
		if(!this.mesh) {
			this.frame = 0;
		} else {
			this.frame ++;	
		}
		
		if(this.frame >= 16) {
			this.frame = 0;
		}

		let index = (this.frame+1).toString();
		if(index.length == 1) {
			index = '0' + index;
		}

		this.mesh = Assets.get(`wolf${index}`);

		setTimeout(()=> this.update(), 1000/this.fps);
	}


	render() {
		GL.pushMatrix();
		GL.rotate(this.mtxModel);
		this.shader.bind();
		GL.draw(this.mesh);
		GL.popMatrix();
	}


}

export default ViewWolf;