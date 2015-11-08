// Stroke.js
function Stroke() {
	this.radius = new bongiovi.EaseNumber(0);
	this.angleStart = new bongiovi.EaseNumber(-Math.PI/2, .05);
	this.angleEnd = new bongiovi.EaseNumber(-Math.PI/2, .05);
}

var p = Stroke.prototype;


p.setRadius = function(value) {
	this.radius.value = value;
};

p.getRadius = function() {
	return this.radius.value;
};


p.setAngle = function(s, e) {
	this.angleStart.value = s;
	this.angleEnd.value = e;
};

p.getAngles = function() {
	return [this.angleStart.value, this.angleEnd.value];
};


module.exports = Stroke;