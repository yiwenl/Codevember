// ViewDay.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import addCenter from './addCenter';
import vs from 'shaders/house.vert';
import fs from 'shaders/house.frag';

class ViewDay extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.waveFront = new alfrid.EaseNumber(-1, 0.01);
		this.waveLength = 1;
	}


	_init() {
		this.mesh = Assets.get('houseDay');
		this.texture = Assets.get('colorDay');
		addCenter(this.mesh);
	}

	open() {
		this.waveFront.value = 18;
	}

	close() {
		this.waveFront.value = -1.5;
	}


	render(mHit) {
		const wave = [this.waveFront.value, this.waveLength];
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime);
		this.shader.uniform("uHit", "vec3", mHit);
		this.shader.uniform("uWave", "vec2", wave);
		this.shader.uniform("uInvert", "float", 0.0);
		GL.draw(this.mesh);
	}


}

export default ViewDay;