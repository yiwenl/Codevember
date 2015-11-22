//Camera.js

function Camera(){};

var p = Camera.prototype;

Camera.ORBITING_TYPE = 'cameraOrbitingType';
Camera.TRACKING_TYPE = 'cameraTrackingType';

p.init = function(opt){

	if (opt)
		this.opt = opt;

	this._matrix 	 = mat4.create();
	this._cameraType = Camera.ORBITING_TYPE;
	this._up         = vec3.create();
	this._right      = vec3.create();
	this._normal     = vec3.create();
	this._position   = vec3.create();
	this._focus      = vec3.create();
	this._azimuth    = 0.0;
	this._elevation  = 0.0;
	this._steps      = 0;
	
	this._home		 = vec3.create();

	this.renderer = null;

	if (this.opt == 'front')
		this.setIdentity();


};

p.setIdentity = function(){

	mat4.identity(this._matrix);
};

p.goHome = function(h){

	if (h != null){
		this._home = h;
	}
	
	this.setPosition(this._home);
	this.setAzimuth(0);
	this.setElevation(0);
	this._steps = 0;
};

p.getPosition = function(){

	return this._position;	
};

p.setPosition = function(p){

	vec3.set(this._position, p[0], p[1], p[2]);
	this.update();


};

p.setFocus = function(f){


	vec3.set(this._focus, f[0], f[1], f[2]);
	this.update();


};

p.setAzimuth = function(az){

	this.changeAzimuth(az - this._azimuth);


};

p.changeAzimuth = function(az){

	this._azimuth += az;

	if (this._azimuth > 360 || this._azimuth < -360){
		this._azimuth = this._azimuth % 360;
	}

	// console.log('azimuth: ',this._azimuth);

	this.update();
};

p.setElevation = function(el){

	this.changeElevation(el - this._elevation);

};

p.changeElevation = function(el){

	this._elevation += el;

	if (this._elevation > 360 || this._elevation < -360){
		this._elevation = this._elevation % 360;
	}

	// console.log('elevation: ',this._elevation);

	if (this.opt == 'main')
		this._elevation = -9.671424870466321;

	this.update();
};


p.calculateOrientation = function(){

	var m = this._matrix;

	mat4.multiplyVec4(m, [1, 0, 0, 0], this._right);
	mat4.multiplyVec4(m, [0, 1, 0, 0], this._up);
	mat4.multiplyVec4(m, [0, 0, 1, 0], this._normal);



};

p.update = function(){

	mat4.identity(this._matrix);

	// debugger;

	this.calculateOrientation();

	// mat4.translate(translationMatrix, matrix, vec3.fromValues(0,0,0));

	if (this._cameraType == Camera.TRACKING_TYPE){

		// mat4.translate(this._matrix, this._position);
		mat4.translate(this._matrix, this._matrix, this._position);
		mat4.rotateY(this._matrix, this._matrix, this._azimuth * Math.PI/180);
		mat4.rotateX(this._matrix, this._matrix, this._elevation * Math.PI/180);


	}else{
		// var trxLook = mat4.create();
		mat4.rotateY(this._matrix, this._matrix, this._azimuth * Math.PI/180);
		mat4.rotateX(this._matrix, this._matrix, this._elevation * Math.PI/180);
		mat4.translate(this._matrix, this._matrix, this._position);
		//mat4.lookAt(this.position, this.focus, this.up, trxLook);
		//mat4.invert(trxLook);
		//mat4.multiply(this.matrix,trxLook);

	}

	this.calculateOrientation();

	if (this._cameraType == Camera.TRACKING_TYPE){
		mat4.multiplyVec4(this._matrix, [0, 0, 0, 1], this._position);
	}

	if (this.renderer)
		this.renderer();

};

p.getViewTransform = function(){

	if (this.opt == 'front')
		return this._matrix;
	
	var m = mat4.create();
	mat4.invert(m, this._matrix);


	return m;

};

module.exports = Camera;