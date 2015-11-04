// Particle.js

var vec3 = bongiovi.glm.vec3;
var gravity = vec3.clone([0, -.15, 0]);
var random = function(min, max) { return min + Math.random() * (max - min);	}

function Particle() {
	this.position = vec3.create();
	this.velocity = vec3.create();
	this.color = vec3.create();
	this._init();
}

var p = Particle.prototype;


p._init = function() {
	
};


p.update = function() {
	vec3.add(this.velocity, this.velocity, gravity);
	vec3.add(this.position, this.position, this.velocity);

	this._checkHitSphere();
	this._checkHitFloor();
};


p._checkHitSphere = function() {
	if(vec3.length(this.position) < params.sphereSize) {

		var f = vec3.clone(this.position);
		vec3.normalize(f, f);
		vec3.scale(this.position, f, params.sphereSize);
		var bf = vec3.length(this.velocity) * 1.5;
		vec3.scale(f, f, bf * this.bounceRate);
		vec3.add(this.velocity, this.velocity, f);
	}
};


p._checkHitFloor = function() {
	if(this.position[1] < -200.0) {
		this.reset();
	}
};

p.reset = function() {
	var r = 40;
	this.bounceRate = random(.5, 1.0);
	this.position[0] = random(-r, r);
	this.position[2] = random(-r, r);
	this.position[1] = random(400, 600);
	this.velocity[0] = this.velocity[1] = this.velocity[2] = 0;

	var min = .9;

	this.color[0] = random(min, 1.0);
	this.color[1] = random(min, 1.0);
	this.color[2] = random(min, 1.0);
	this.color = [1, 1, .975];
};

module.exports = Particle;