// TouchDetector.js
import { EventDispatcher } from 'alfrid';

class TouchDetector extends EventDispatcher {
	constructor(mMesh) {
		super();


		this._mesh = mMesh;
		this._faces = mMesh.faces;

		window.addEventListener('mousedown', (e)=>this._onDown(e));
		window.addEventListener('mouseup', (e)=>this._onUp(e));
	}


	_onDown(e) {
		this.dispatchCustomEvent('onDown');
	}


	_onUp(e) {
		this.dispatchCustomEvent('onUp');
	}

}

export default TouchDetector;