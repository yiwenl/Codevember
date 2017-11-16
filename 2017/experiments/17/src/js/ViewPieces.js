// ViewPieces.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/pieces.vert';
import fs from 'shaders/pieces.frag';
import Assets from './Assets';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewPieces extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const s = 0.5;
		this.mesh = alfrid.Geom.plane(s, s, 1);

		this.texture = Assets.get('portrait');
		const img = Assets.getSource('portrait');
		const ratio = img.width / img.height;

		const num = 500;
		const posOffsets = [];
		const extras = [];
		const range = 1.7;
		const z = 1.5;

		for(let i=0; i<num; i++) {
			posOffsets.push([random(-range, range), random(-range, range)/ratio, random(-z, z) + 0.5])
			extras.push([Math.random(), Math.random(), Math.random()]);
		}

		this.mesh.bufferInstance(posOffsets, 'aPosOffset')
		this.mesh.bufferInstance(extras, 'aExtra')

		this.threshold = .45;
		// gui.add(this, 'threshold', 0, 1);
	}


	render(mShadowMatrix, mHit) {
		this.shader.bind();
		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("uThreshold", "float", this.threshold);
		this.shader.uniform("uHit", "vec3", mHit);
		this.shader.uniform("uLightPos", "vec3", params.lightPosition);
		GL.draw(this.mesh);
	}


}

export default ViewPieces;