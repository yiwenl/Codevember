// ViewNoise.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewNoise() {
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

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", window.globalTime);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewNoise;