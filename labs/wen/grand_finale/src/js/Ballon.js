// Ballon.js

var glm = bongiovi.glm;
var vec3 = glm.vec3;
var random = function(min, max) { return min + Math.random() * (max - min);	}

function Ballon() {
	this._init();
}


var p = Ballon.prototype;


p._init = function() {
	var r = 20;
	var xz = 2.5;
	this.speed = random(0.03, 0.08);
	this.position = vec3.create(random(-r, r), random(-r, r), random(-r, r));
	this.velocity = vec3.fromValues(random(-xz, xz), 0, random(-xz, xz));

	function getColor() {
		if(Math.random() < .33) {
			return [221/255, 36/255, 37/255];
		} else if(Math.random() < .67) { 
			return [245/255, 176/255, 35/255];
		} else {
			return [0, 0, 0];
		}
	}

	this.color = getColor();
};


p.update = function() {
	this.velocity[1] += this.speed;
	vec3.add(this.position, this.position, this.velocity);

	return this.position;
};


module.exports = Ballon;