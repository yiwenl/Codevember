// ViewBall.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBall() {
	bongiovi.View.call(this, bongiovi.ShaderLibs.get('generalVert'), bongiovi.ShaderLibs.get('simpleColorFrag'));
}

var p = ViewBall.prototype = new bongiovi.View();
p.constructor = ViewBall;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createSphere(1, 26);
};

p.render = function(pos, size) {
	var scale = size === undefined ? 1 : size;
	this.shader.bind();
	this.shader.uniform("position", "uniform3fv", pos || [0, 0, 0]);
	this.shader.uniform("scale", "uniform3fv", [scale, scale, scale]);
	this.shader.uniform("opacity", "uniform1f", 1);
	this.shader.uniform("color", "uniform3fv", [1, 1, .96]);
	GL.draw(this.mesh);
};

module.exports = ViewBall;