// Dot.js

var quat = bongiovi.glm.quat;
var vec3 = bongiovi.glm.vec3;

var random = function(min, max) { return min + Math.random() * (max - min);	}

function Dot() {
	this.time     = Math.random() * 0xFF;
	this.axis     = vec3.fromValues(random(-1, 1), random(-.1, .1), random(-1, 1));
	vec3.normalize(this.axis, this.axis);
	this.angle    = Math.random() * Math.PI * 2.0;
	this.speed    = random(.01, .02) * .75;
	this.pos      = vec3.fromValues(random(-1, 1), random(-.25, .25), random(-1, 1));
	this.radius   = random(params.sphereSize-30, params.sphereSize-40);
	vec3.scale(this.pos, this.pos, this.radius);
	this.finalPos = vec3.create();
	this.quat     = quat.create();
	// this.radius   = random(.2, 1.1);
	this.update();
}


var p = Dot.prototype;

p.update = function() {
	this.angle += this.speed;
	this.time += .01;
	quat.setAxisAngle(this.quat, this.axis, this.angle);
	vec3.transformQuat(this.finalPos, this.pos, this.quat);
	vec3.normalize(this.finalPos, this.finalPos);
	var r = this.radius + Math.sin(this.time) * 30.0;
	vec3.scale(this.finalPos, this.finalPos, r);

	return this.finalPos;
};


module.exports = Dot;