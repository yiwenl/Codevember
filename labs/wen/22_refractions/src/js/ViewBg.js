// ViewBg.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBg() {
	this.time = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify("../shaders/bg.frag"));
}

var p = ViewBg.prototype = new bongiovi.View();
p.constructor = ViewBg;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function() {
	this.time += .01 + params.sum * .03;
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("sound0", "uniform1f", params.currSum);
	GL.draw(this.mesh);
};

module.exports = ViewBg;