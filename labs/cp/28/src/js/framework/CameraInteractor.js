// CameraInteractor.js

function CameraInteractor(){};

var p = CameraInteractor.prototype;

p.init = function(camera, canvas, mouseDownCallback, mouseMoveCallback, mouseUpCallback, scope){

	this.camera = camera;
	this.canvas = canvas;

	this._onMouseDownCallback = mouseDownCallback;
	this._onMouseMoveCallback = mouseMoveCallback;
	this._onMouseUpCallback = mouseUpCallback;
	this._callbackScope = scope;

	this.dragging = false;
	this.x = 0;
	this.y = 0;
	this.lastX = 0;
	this.lastY = 0;
	this.button = 0;
	this.ctrl = false;
	this.key = 0;
	
	this.MOTION_FACTOR = 10.0;
	this.dloc = 0;
	this.dstep = 0;

	this.altKeyIsDown = false;

	

	this._onMouseDownBound = this._onMouseDown.bind(this);
	this._onMouseUpBound = this._onMouseUp.bind(this);
	this._onMouseMoveBound = this._onMouseMove.bind(this);

	this.activateMouseEvents();
	
	window.addEventListener('keydown', this._onKeyDown.bind(this) );
	window.addEventListener('keyup', this._onKeyUp.bind(this) );

};


p.activateMouseEvents = function(){

	console.log('activate mouse events');

	this.canvas.addEventListener('mousedown', this._onMouseDownBound);
	this.canvas.addEventListener('mouseup', this._onMouseUpBound);
	

};


p.disableMouseEvents = function(){

	console.log('disable mouse events');

	this.canvas.removeEventListener('mousedown', this._onMouseDownBound);
	this.canvas.removeEventListener('mouseup', this._onMouseUpBound);
	

};

p._onKeyDown = function(e){

	if (e.altKey)
		this.altKeyIsDown = true;

};

p._onKeyUp = function(e){

	this.altKeyIsDown = false;
};

p._onMouseUp = function(e){

	this.canvas.removeEventListener('mousemove', this._onMouseMoveBound);
	
	// this._onMouseUpCallback.call(this._callbackScope, e);

	this.dragging = false;


};

p._onMouseDown = function(e){

	// debugger;

	console.log('canvas mouse down');

	
	
	// this._onMouseDownCallback.call(this._callbackScope, e);

	this.dragging = true;
    this.x = e.clientX;
	this.y = e.clientY;
	this.button = e.button;
	var position = this.camera.getPosition();
	this.dstep = Math.max(position[0],position[1],position[2])/100;

	if (!this.altKeyIsDown)
		this.canvas.addEventListener('mousemove', this._onMouseMoveBound);

};

p._onMouseMove = function(e){

	console.log('mouse move');

	this.lastX = this.x;
	this.lastY = this.y;
	this.x = e.clientX;
    this.y = e.clientY;
	
	if (!this.dragging) return;
	this.ctrl = e.ctrlKey;
	this.alt = e.altKey;
	var dx = this.x - this.lastX;
	var dy = this.y - this.lastY;

	// if (window.NS.params.currentControlPoint)
	// 	this._onMouseMoveCallback.call(this._callbackScope, e, dx, dy);
	// else
		this.rotate(dx, dy);
	
	// if (this.button == 0) { 
	// 	if(this.alt){
	// 		this.dolly(dy);
	// 	}
	// 	else{ 
	// 		this.rotate(dx,dy);
	// 	}
	// }	
};


p.rotate = function(dx, dy){

	var camera = this.camera;
	var canvas = this.canvas;
	
	var delta_elevation = -20.0 / canvas.height;
	var delta_azimuth   = -20.0 / canvas.width;
				
	var nAzimuth = dx * delta_azimuth * this.MOTION_FACTOR;
	var nElevation = dy * delta_elevation * this.MOTION_FACTOR;
	
	camera.changeAzimuth(nAzimuth);
	camera.changeElevation(nElevation);	
};

module.exports = CameraInteractor;