// ViewDot.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewDot() {
	bongiovi.View.call(this, bongiovi.ShaderLibs.get('generalVert'), bongiovi.ShaderLibs.get('simpleColorFrag'));
}

var p = ViewDot.prototype = new bongiovi.View();
p.constructor = ViewDot;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createSphere(2, 20);
};

p.render = function(pos) {
	this.shader.bind();
	this.shader.uniform("position", "uniform3fv", pos || [0, 0, 0]);
	this.shader.uniform("scale", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("color", "uniform3fv", [1, 1, .96]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewDot;