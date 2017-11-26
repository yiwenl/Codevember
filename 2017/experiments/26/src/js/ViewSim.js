// ViewSim.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/sim.frag';


class ViewSim extends alfrid.View {
	
	constructor() {
		const _fs = fs.replace('{NUM}', params.numParticles);
		super(alfrid.ShaderLibs.bigTriangleVert, _fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('textureVel', 'uniform1i', 0);
		this.shader.uniform('texturePos', 'uniform1i', 1);
		this.shader.uniform('textureExtra', 'uniform1i', 2);
		this.shader.uniform("textureLife", "uniform1i", 3);

	}


	render(textureVel, texturePos, textureExtra, textureLife, posWhite, posBlack) {
		this.time += .01;
		this.shader.bind();
		this.shader.uniform('time', 'float', this.time);
		this.shader.uniform('maxRadius', 'float', params.maxRadius);
		textureVel.bind(0);
		texturePos.bind(1);
		textureExtra.bind(2);
		textureLife.bind(3);

		this.shader.uniform("uPosWhite", "vec3", posWhite);
		this.shader.uniform("uPosBlack", "vec3", posBlack);


		GL.draw(this.mesh);
	}


}

export default ViewSim;