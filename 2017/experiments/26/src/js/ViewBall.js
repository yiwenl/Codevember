// ViewBall.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/ball.vert';
import fs from 'shaders/ball.frag';
import Draggable from './Draggable';

class ViewBall extends alfrid.View {
	
	constructor(mColor=[1, 1, 1], mSurface, mCamera) {
		super(vs, fs);
		this.color = mColor;
		this.position = vec3.create();


		this.draggable = new Draggable(this, mSurface, mCamera);
	}


	setPosition(mPosition) {
		vec3.copy(this.position, mPosition);
		const { mtxModel } = this.draggable._detectorTarget;
		mat4.identity(mtxModel, mtxModel);
		mat4.translate(mtxModel, mtxModel, this.position);
	}


	_init() {
		const s = .75;
		this.mesh = alfrid.Geom.sphere(s, 24);
	}


	render() {
		this.shader.bind();
		this.shader.uniform('uLightPos', 'vec3', params.lightPos);
		this.shader.uniform('uColor', 'vec3', this.color);
		this.shader.uniform('uPosition', 'vec3', this.position);
		GL.draw(this.mesh);
	}


}

export default ViewBall;