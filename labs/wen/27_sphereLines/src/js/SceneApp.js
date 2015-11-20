// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewSphere = require("./ViewSphere");
var ViewDot = require("./ViewDot");
var glm = bongiovi.glm;
var vec3 = glm.vec3;
var quat = glm.quat;
var random = function(min, max) { return min + Math.random() * (max - min);	}

function SceneApp() {
	gl = GL.gl;
	

	this.count = .01;
	
	this.point = vec3.fromValues(params.sphereSize+5, 0, 0);
	this.orgPoint = vec3.clone(this.point);
	this.axis  = vec3.fromValues(random(-1, 1), random(-1, 1), random(-1, 1));
	
	vec3.normalize(this.axis, this.axis);
	console.log(this.axis);
	var angle  = Math.random() * .5 + .5;
	this.angle = angle;
	this.quat = quat.create();
	quat.setAxisAngle(this.quat, this.axis, this.angle);

	bongiovi.Scene.call(this);
	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vSphere = new ViewSphere();
	this._vDot = new ViewDot();
};

p.render = function() {
	this.count += .01;
	this.angle += .05;
	this.axis[0] += Math.sin(this.count) * .1;
	this.axis[1] -= Math.cos(this.count*2) * .1;
	this.axis[2] += -Math.sin(this.count) * .1;
	vec3.normalize(this.axis, this.axis);
	quat.setAxisAngle(this.quat, this.axis, this.angle);
	vec3.transformQuat(this.point, this.orgPoint, this.quat);


	this._vAxis.render();
	this._vDotPlane.render();

	this._vSphere.render();
	this._vDot.render(vec3.clone(this.point));
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;