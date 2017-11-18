// ViewPost.js

import alfrid, { GL, Scheduler } from 'alfrid';
import fs from 'shaders/post.frag';
import Assets from './Assets';

class ViewPost extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();
		this.textureEnv = Assets.get('tunnel_radiance');
	}


	render(textureIn, textureOut, fboMap) {
		this.shader.bind();
		this.shader.uniform("textureIn", "uniform1i", 0);
		textureIn.bind(0);
		this.shader.uniform("textureOut", "uniform1i", 1);
		textureOut.bind(1);

		const camera = GL.camera;

		const textureMap = fboMap.getTexture(0);
		const texturePosition = fboMap.getTexture(1);
		const textureUV = fboMap.getTexture(2);
		const textureNormal = fboMap.getTexture(3);

		this.shader.uniform("textureMap", "uniform1i", 2);
		textureMap.bind(2);

		this.shader.uniform("textureNormal", "uniform1i", 3);
		textureNormal.bind(3);

		this.shader.uniform("texturePosition", "uniform1i", 4);
		texturePosition.bind(4);

		this.shader.uniform("textureEnv", "uniform1i", 5);
		this.textureEnv.bind(5);

		this.shader.uniform(params.hdr);

		this.shader.uniform("uCameraPos", "vec3", camera.position);
		this.shader.uniform("uTime", "float", Scheduler.deltaTime);

		GL.draw(this.mesh);
	}


}

export default ViewPost;