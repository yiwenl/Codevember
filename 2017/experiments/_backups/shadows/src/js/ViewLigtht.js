// ViewLigtht.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';


class ViewLigtht extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.simpleColorFrag);

		this.mtx = mat4.create();
		this.mtxModel = mat4.create();
		mat4.translate(this.mtxModel, this.mtxModel, vec3.fromValues(0, 1, 0));


		this.agnle = 0;
		this.time = 0;
	}


	_init() {
		this.mesh = Assets.get('cone');
	}


	_updateMatrix() {
		mat4.identity(this.mtxModel, this.mtxModel);
		mat4.translate(this.mtxModel, this.mtxModel, vec3.fromValues(0, 1.4, 0));
		this.angle = Math.sin(this.time) * 0.3
		mat4.rotateZ(this.mtxModel, this.mtxModel, this.angle);
	}


	render() {
		this.time += 0.01;
		this._updateMatrix();

		GL.gl.cullFace(GL.gl.FRONT);
		GL.rotate(this.mtxModel);
		this.shader.bind();
		this.shader.uniform("color", "vec3", [1, 1, 1]);
		this.shader.uniform("opacity", "float", .5);
		GL.draw(this.mesh);

		GL.gl.cullFace(GL.gl.BACK);
		GL.rotate(this.mtx);
	}


}

export default ViewLigtht;
