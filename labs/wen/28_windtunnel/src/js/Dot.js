// Dot.js

var glm        = bongiovi.glm;
var vec3       = glm.vec3;
var quat       = glm.quat;
var random = function(min, max) { return min + Math.random() * (max - min);	}

function Dot() {
	this._init();
}


var p = Dot.prototype;

p._init = function() {
	this.count    = Math.random() * 0xFF;
	this.radius   = random(50, 75) * 1.2;
	var r         = random(50, 100) * .5;
	this.point    = vec3.fromValues(r, 0, 0);
	this.orgPoint = vec3.clone(this.point);
	this.axis     = vec3.fromValues(random(-1, 1), random(-1, 1), random(-1, 1));
	vec3.normalize(this.axis, this.axis);
	var angle     = Math.random()* Math.PI * 2.0;
	this.angle    = angle;
	this.quat     = quat.create();
	quat.setAxisAngle(this.quat, this.axis, this.angle);
};

p.update = function() {
	this.count   += .002;
	this.angle   += .004;
	this.axis[0] += Math.sin(this.count) * .1;
	this.axis[1] -= Math.cos(this.count*2) * .1;
	this.axis[2] += -Math.sin(this.count) * .1;
	vec3.normalize(this.axis, this.axis);
	quat.setAxisAngle(this.quat, this.axis, this.angle);
	vec3.transformQuat(this.point, this.orgPoint, this.quat);
	return this.point;
};


module.exports = Dot;