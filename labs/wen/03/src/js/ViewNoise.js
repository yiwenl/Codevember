// ViewNoise.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewNoise() {
	this.time = 0;
	bongiovi.View.call(this, null, glslify("../shaders/post.frag"));
}

var p = ViewNoise.prototype = new bongiovi.View();
p.constructor = ViewNoise;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(textureNoise) {
	this.time += .01;
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("resolution", "uniform2fv", [GL.width, GL.height]);

	this.shader.uniform("textureNoise", "uniform1i", 0);
	textureNoise.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewNoise;