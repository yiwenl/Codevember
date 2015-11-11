// ViewBg.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBg() {
	this.time = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify('../shaders/bg.frag'));
}

var p = ViewBg.prototype = new bongiovi.View();
p.constructor = ViewBg;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function() {
	this.time += .01;
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.time);
	GL.draw(this.mesh);
};

module.exports = ViewBg;