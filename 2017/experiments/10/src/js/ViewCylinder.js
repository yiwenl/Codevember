// ViewCylinder.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/cylinder.vert';
import fs from 'shaders/cylinder.frag';

const ratio = 640 / 480;

class ViewCylinder extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const size = 2;
		this.radius = 2.4;
		this.mesh = alfrid.Geom.plane(size, size/ratio, 1);

		const posOffset = [];
		for(let i=0; i<params.numSides; i++) {
			let a = i/params.numSides * Math.PI * 2.0;
			posOffset.push([a, i]);
		}

		this.mesh.bufferInstance(posOffset, 'aPosOffset');
	}


	render(textures, mSaturation) {
		this.shader.bind();
		this.shader.uniform("uRadius", "float", this.radius);
		this.shader.uniform("uSaturation", "float", mSaturation);

		textures.forEach( (t, i) => {
			this.shader.uniform(`texture${i}`, "uniform1i", i);
			t.bind(i);
		});

		GL.draw(this.mesh);
	}


}

export default ViewCylinder;