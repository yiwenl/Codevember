// ViewNoise.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewNoise() {
	this.time = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify('../shaders/noise.frag'));
}

var p = ViewNoise.prototype = new bongiovi.View();
p.constructor = ViewNoise;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function() {
	this.time += .01;
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.time);
	GL.draw(this.mesh);
};

module.exports = ViewNoise;