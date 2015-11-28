//BaseCamera.js

function BaseCamera(){};

var p = BaseCamera.prototype;

function degToRadian(degrees) {
  return degrees * Math.PI / 180;
};

p.init = function(type){

	this.type = type;

	if (this.type == 'ortho'){
		this.projMatrix = mat4.create();
		this.viewMatrix = mat4.create();

		return;
	}

	// Raw Position Values
	this.left = vec3.fromValues(1.0, 0.0, 0.0); // Camera Left vector
	this.up = vec3.fromValues(0.0, 1.0, 0.0); // Camera Up vector
	this.dir = vec3.fromValues(0.0, 0.0, 1.0); // The direction its looking at
	this.pos = vec3.fromValues(0.0, 0.0, 0.0); // Camera eye position
	this.projectionTransform = null;
	this.projMatrix;
	this.viewMatrix;

	this.fieldOfView = 55;
	this.nearClippingPlane = 0.1;
	this.farClippingPlane = 1000.0;
};

p.apply = function(aspectRatio){

	var matView=mat4.create();
	var lookAtPosition=vec3.create();
	vec3.add(lookAtPosition, this.pos, this.dir);
	mat4.lookAt(matView, this.pos, lookAtPosition, this.up);
	mat4.translate(matView, matView, vec3.fromValues(-this.pos[0], -this.pos[1], -this.pos[2]));
	this.viewMatrix = matView;

	// console.log(this.dir, this.up);

	// Create a projection matrix and store it inside a globally accessible place.
	this.projMatrix=mat4.create();
	mat4.perspective(this.projMatrix, degToRadian(this.fieldOfView), aspectRatio, this.nearClippingPlane, this.farClippingPlane)

};

p.getFarClippingPlane = function(){
	return this.farClippingPlane;
};

p.getFieldOfView = function(){

	return this.fieldOfView;
};

p.getLeft = function(){

	return vec3.clone(this.left);
};

p.getNearClippingPlane = function(){

	return this.nearClippingPlane;
};

p.getPosition = function(){

	return vec3.clone(this.pos);
};

p.getProjectionMatrix = function(){

	return mat4.clone(this.projMatrix);
};

p.getViewMatrix = function(){

	return mat4.clone(this.viewMatrix);
};

p.getUp = function(){

	return vec3.clone(this.up);
};

p.setFarClippingPlane = function(){

	if (fcp > 0)
	{
		this.farClippingPlane = fcp;
	}
};

p.setFieldOfView = function(fov){

	if (fov > 0 && fov < 180)
	{
		this.fieldOfView = fov;
	}
};

p.setNearClippingPlane = function(ncp){

	if (ncp > 0)
	{
		this.nearClippingPlane = ncp;
	}
};

p.update = function(timeStep, lineVel, angularVel){

	if (vec3.squaredLength(linVel)==0 && vec3.squaredLength(angularVel)==0) return false;

	if (vec3.squaredLength(linVel) > 0.0)
	{
		// Add a velocity to the position
		vec3.scale(velVec,velVec, timeStep);

		vec3.add(this.pos, velVec, this.pos);
	}

	if (vec3.squaredLength(angularVel) > 0.0)
	{
		// Apply some rotations to the orientation from the angular velocity
		this.pitch(angularVel[0] * timeStep);
		this.yaw(angularVel[1] * timeStep);
		this.roll(angularVel[2] * timeStep);
	}

	return true;
};

module.exports = BaseCamera;