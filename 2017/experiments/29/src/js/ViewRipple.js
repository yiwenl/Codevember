// ViewRipple.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/ripple.vert';
import fs from 'shaders/ripple.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

let mesh;

class ViewRipple extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this._opacity = new alfrid.EaseNumber(0);
	}


	_init() {
		this.diskSize = 2;
	}


	launch(mPos) {
		if(!mesh) {
			mesh = alfrid.Geom.plane(this.diskSize, this.diskSize, 100, 'xz');
		}
		this.mesh = mesh;
		this.position = mPos;
		this.scale = random(1, 2);
		this._opacity.easing = random(0.02, 0.05);
		this._opacity.value = 1;

		this.extra = [random(1, 2), Math.random(), random(.5, 2)];


		setTimeout(()=> {
			this._opacity.value = 0;
		}, 3000);
	}


	close() {
		this._opacity.value = 0;
	}


	render() {
		if(!this.mesh) {
			return;
		}
		if(this.opacity.value <= 0.01) {
			return;
		}
		this.shader.bind();
		this.shader.uniform("uOpacity", "float", this.opacity);
		this.shader.uniform("uPosition", "vec3", this.position);
		this.shader.uniform("uScale", "float", this.scale);
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime);
		this.shader.uniform("uExtra", "vec3", this.extra);
		GL.draw(this.mesh);
	}


	get opacity() {
		return this._opacity.value;
	}


}

export default ViewRipple;