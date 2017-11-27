// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		const _fs = fs.replace('{NUM_LIGHT}', params.numLight);
		super(vs, _fs);
	}


	_init() {
		const s = 5;
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
	}

	setLights(mLights) {
		let lights = [];
		mLights.forEach( light => {
			console.log('light :', light);
			let l = [light.pos[0], light.pos[1], light.pos[2], light.size];
			lights = lights.concat(l);
		});

		console.log(lights );
		this.shader.bind();
		this.shader.uniform('uLights', 'vec4', lights);
	}

	render() {
		this.shader.bind();

		GL.draw(this.mesh);
	}


}

export default ViewFloor;