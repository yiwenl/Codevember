// Dot.js

var quat = bongiovi.glm.quat;
var vec3 = bongiovi.glm.vec3;

var random = function(min, max) { return min + Math.random() * (max - min);	}

function Dot() {
	this.axis = vec3.fromValues(random(-1, 1), random(-1, 1), random(-1, 1));
	vec3.normalize(this.axis, this.axis);
	this.angle = 0;
	this.speed = random(.01, .02) * .2;
	this.pos = vec3.fromValues(random(-1, 1), random(-1, 1), random(-1, 1));
	vec3.normalize(this.pos, this.pos);
	vec3.scale(this.pos, this.pos, params.sphereSize);
	this.finalPos = vec3.create();
	this.quat = quat.create();
	this.radius = random(20, 30);
	this.update();
}


var p = Dot.prototype;

p.update = function() {
	this.angle += this.speed;
	quat.setAxisAngle(this.quat, this.axis, this.angle);
	vec3.transformQuat(this.finalPos, this.pos, this.quat);

	return this.finalPos;
};


module.exports = Dot;