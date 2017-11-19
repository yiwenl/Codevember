// Wondering.js

class Wondering {
	constructor(mTarget) {
		this._target = mTarget;
		this._vel = 
		this._isLocked = false;
	}


	lock(mValue) {
		this._isLocked = mValue;
	}


	update() {
		if(this._isLocked) {
			return;
		}
	}
}


export default Wondering;