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
	this.mesh = bongiovi.MeshUtils.createSphere(10, 36);
};

p.render = function(position, scale) {
	var s = scale === undefined ? 1 : scale;
	this.shader.bind();
	this.shader.uniform("position", "uniform3fv", position || [0, 0, 0]);
	this.shader.uniform("scale", "uniform3fv", [s, s, s]);
	this.shader.uniform("color", "uniform3fv", [1, 1, .96]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewBall;