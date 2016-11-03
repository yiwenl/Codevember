// ViewTerrain.js

import alfrid, { GL } from 'alfrid';

import vs from '../shaders/terrain.vert';
import fs from '../shaders/terrain.frag';

class ViewTerrain extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const size = 30;
		const numSeg = 100;
		this.mesh = alfrid.Geom.plane(size, size, numSeg, 'xz');

		this._textureHeight = new alfrid.GLTexture(getAsset('heightMap'));
	}


	render(texture) {
		this.shader.bind();
		this.shader.uniform("textureHeight", "uniform1i", 0);
		texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewTerrain;