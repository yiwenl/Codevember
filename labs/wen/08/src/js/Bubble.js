// Bubble.js

var glm = bongiovi.glm;
var random = function(min, max) { return min + Math.random() * (max - min);	}

function Bubble(pos, size) {
	this.pos      = glm.vec3.clone(pos);
	this.size     = size;
	this.speed    = random(.05, .1) * .1;
	this.axis     = glm.vec3.clone([random(-1, 1), random(-1, 1), random(-1, 1)]);
	this.theta    = Math.random() * Math.PI * 2.0;
	this.quat 	  = glm.quat.create();
	this.finalPos = glm.vec3.create();
}


var p = Bubble.prototype;


p.update = function() {
	this.theta += this.speed;	
	glm.quat.setAxisAngle(this.quat, this.axis, this.theta);
	glm.vec3.transformQuat(this.finalPos, this.pos, this.quat);

	return this.finalPos;
};


module.exports = Bubble;