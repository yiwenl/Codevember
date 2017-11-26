// Capture3D.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/capture.vert';
import fs from 'shaders/capture.frag';

class Capture3D {
	constructor() {
		this._shadowMatrix0 = mat4.create();
		this._shadowMatrix1 = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);


		this._cameraDistance = 0;
		this.cameraDistance = 10;


		//	fbo
		const size = 512;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			wrapS:GL.CLAMP_TO_EDGE,
			wrapT:GL.CLAMP_TO_EDGE,
			type:GL.FLOAT
		};
		this._fboModel0 = new alfrid.FrameBuffer(size, size, o, true);
		this._fboModel1 = new alfrid.FrameBuffer(size, size, o, true);

		this._shader = new alfrid.GLShader(vs, fs);
	}


	_updateCameraMatrices() {
		this.pointSource0 = vec3.fromValues(0, 0, this._cameraDistance);
		this.pointSource1 = vec3.fromValues(0, 0, -this._cameraDistance);

		let s = 1.5;
		this._cameraLight0 = new alfrid.CameraOrtho();
		this._cameraLight0.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight0.lookAt(this.pointSource0, [0, 0, 0]);

		this._cameraLight1 = new alfrid.CameraOrtho();
		this._cameraLight1.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight1.lookAt(this.pointSource1, [0, 0, 0]);


		this.projInvert0 = mat4.create();
		mat4.invert(this.projInvert0, this._cameraLight0.projection);

		this.viewInvert0 = mat4.create();
		mat4.invert(this.viewInvert0, this._cameraLight0.matrix);

		this.projInvert1 = mat4.create();
		mat4.invert(this.projInvert1, this._cameraLight1.projection);

		this.viewInvert1 = mat4.create();
		mat4.invert(this.viewInvert1, this._cameraLight1.matrix);

		mat4.multiply(this._shadowMatrix0, this._cameraLight0.projection, this._cameraLight0.viewMatrix);
		mat4.multiply(this._shadowMatrix0, this._biasMatrix, this._shadowMatrix0);

		mat4.multiply(this._shadowMatrix1, this._cameraLight1.projection, this._cameraLight1.viewMatrix);
		mat4.multiply(this._shadowMatrix1, this._biasMatrix, this._shadowMatrix1);

	}


	capture(mesh, mModelMatrix) {
		GL.pushMatrix();

		this._fboModel0.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight0);
		GL.rotate(mModelMatrix);
		this._shader.bind();
		GL.draw(mesh);
		this._fboModel0.unbind();

		this._fboModel1.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight1);
		GL.rotate(mModelMatrix);
		this._shader.bind();
		GL.draw(mesh);
		this._fboModel1.unbind();

		GL.popMatrix();
	}

	setShader(mShader) {
		this._shader = mShader;
	}


	set cameraDistance(mValue) {
		this._cameraDistance = mValue;
		this._updateCameraMatrices();
	}

	get cameraDistance() {	return this._cameraDistance;	}

	get texture0() {	return this._fboModel0.getTexture();	}
	get texture1() {	return this._fboModel1.getTexture();	}

	get depth0() {	return this._fboModel0.getDepthTexture();	}
	get depth1() {	return this._fboModel1.getDepthTexture();	}

	get fboModel0() {	return this._fboModel0;	}
	get fboModel1() {	return this._fboModel1;	}

	get shadowMatrix0() {	return this._shadowMatrix0;	}
	get shadowMatrix1() {	return this._shadowMatrix1;	}
}


export default Capture3D;