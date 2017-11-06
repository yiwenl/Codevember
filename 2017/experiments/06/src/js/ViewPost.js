// ViewPost.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/post.frag';
import Assets from './Assets';

class ViewPost extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();
		this.textureEnv = Assets.get('irr');
	}


	render(textureIn, textureOut, fboMap) {
		this.shader.bind();
		this.shader.uniform("textureIn", "uniform1i", 0);
		textureIn.bind(0);
		this.shader.uniform("textureOut", "uniform1i", 1);
		textureOut.bind(1);

		const textureMap = fboMap.getTexture(0);
		const textureNormal = fboMap.getTexture(1);
		const texturePosition = fboMap.getTexture(2);

		this.shader.uniform("textureMap", "uniform1i", 2);
		textureMap.bind(2);

		this.shader.uniform("textureNormal", "uniform1i", 3);
		textureNormal.bind(3);

		this.shader.uniform("texturePosition", "uniform1i", 4);
		texturePosition.bind(4);

		this.shader.uniform("textureEnv", "uniform1i", 5);
		this.textureEnv.bind(5);

		this.shader.uniform(params.hdr);

		GL.draw(this.mesh);
	}


}

export default ViewPost;