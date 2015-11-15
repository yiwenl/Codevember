// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSimulation() {
	this._count = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify("../shaders/sim.frag"));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, dots) {
	if(!this.shader.isReady() ) return;

	var d = [];
	for(var i=0; i<dots.length; i++) {
		d.push(dots[i].finalPos[0]);
		d.push(dots[i].finalPos[1]);
		d.push(dots[i].finalPos[2]);
		d.push(dots[i].radius);
	}


	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("sphereSize", "uniform1f", params.sphereSize);
	this.shader.uniform("sound0", "uniform1f", params.sum);
	this.shader.uniform("dots", "uniform4fv", d);

	texture.bind(0);
	GL.draw(this.mesh);

	this._count += .005;
};

module.exports = ViewSimulation;