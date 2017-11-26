// Draggable.js

import { TouchDetector, EventDispatcher } from 'alfrid';

class Draggable extends EventDispatcher {
	constructor(mTarget, mSurfaceMesh, mCamera) {
		super();

		this._target = mTarget;
		this._detectorTarget = new TouchDetector(this._target.mesh, mCamera, true);

		this._detectorSurface = new TouchDetector(mSurfaceMesh, mCamera);
		this._detectorSurface.disconnect();
		this._detectorSurface.on('onHit', (e) => this._onMove(e.detail.hit));


		this._detectorTarget.on('onDown', (e)=> this._onDown(e));
		window.addEventListener('mouseup', ()=>this._onUp());

		this._offset = vec3.create();
	}


	_onDown(e) {
		const { hit } = e.detail;
		vec3.sub(this._offset, hit, this._target.position);
		this._offset[1] = 0;

		this._detectorSurface.connect();
		this.dispatchCustomEvent('onDown');
	}


	_onMove(hit) {
		vec3.sub(this._target.position, hit, this._offset);

		const { mtxModel } = this._detectorTarget;

		mat4.identity(mtxModel);
		mat4.translate(mtxModel, mtxModel, this._target.position);
	}


	_onUp() {
		this._detectorSurface.disconnect();
		this.dispatchCustomEvent('onUp');
	}

}


export default Draggable;