// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSimulation() {
	this._count = Math.random() * 0xFF;
	//
	var fs = glslify("../shaders/sim.frag");
	fs = fs.replace('{{numDots}}', Math.floor(params.numDots));
	bongiovi.View.call(this, null, fs);
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, dots) {

	var points = [];
	for(var i=0; i<dots.length; i++) {
		points.push(dots[i].point[0]);
		points.push(dots[i].point[1]);
		points.push(dots[i].point[2]);
		points.push(dots[i].radius);
		// if(i == 0) {
		// 	console.log(points);
		// }
	}

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("range", "uniform1f", params.range);
	this.shader.uniform("points", "uniform4fv", points);
	texture.bind(0);
	GL.draw(this.mesh);

	this._count += .01;
};

module.exports = ViewSimulation;