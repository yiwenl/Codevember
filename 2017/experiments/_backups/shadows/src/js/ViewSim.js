// ViewSim.js

import alfrid from 'alfrid';
const GL = alfrid.GL;
const fsSim = require('../shaders/sim.frag');


class ViewSim extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fsSim);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('textureVel', 'uniform1i', 0);
		this.shader.uniform('texturePos', 'uniform1i', 1);
		this.shader.uniform('textureExtra', 'uniform1i', 2);
		this.shader.uniform('textureLife', 'uniform1i', 3);

	}


	render(textureVel, texturePos, textureExtra, textureLife, obj0, obj1) {
		this.time += .01;
		this.shader.bind();
		this.shader.uniform('time', 'float', this.time);
		this.shader.uniform('maxRadius', 'float', params.maxRadius);
		textureVel.bind(0);
		texturePos.bind(1);
		textureExtra.bind(2);
		textureLife.bind(3);


		this.shader.uniform("texture0", "uniform1i", 4);
		obj0.texture.bind(4);
		this.shader.uniform("texture1", "uniform1i", 5);
		obj1.texture.bind(5);

		this.shader.uniform("depth0", "uniform1i", 6);
		obj0.depth.bind(6);
		this.shader.uniform("dpeth1", "uniform1i", 7);
		obj1.depth.bind(7);




		this.shader.uniform("uShadowMatrix0", "mat4", obj0.shadow);
		this.shader.uniform("uProjInvert0", "mat4", obj0.proj);
		this.shader.uniform("uViewInvert0", "mat4", obj0.view);
		

		this.shader.uniform("uShadowMatrix1", "mat4", obj1.shadow);
		this.shader.uniform("uProjInvert1", "mat4", obj1.proj);
		this.shader.uniform("uViewInvert1", "mat4", obj1.view);


		GL.draw(this.mesh);
	}


}

export default ViewSim;