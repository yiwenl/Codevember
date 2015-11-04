// ViewDot.js

var GL = bongiovi.GL;
var gl;
var vec3 = bongiovi.glm.vec3;
var glslify = require("glslify");

function ViewDot() {
	bongiovi.View.call(this, bongiovi.ShaderLibs.get('generalVert'), bongiovi.ShaderLibs.get('simpleColorFrag'));
}

var p = ViewDot.prototype = new bongiovi.View();
p.constructor = ViewDot;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	this.mesh = bongiovi.MeshUtils.createSphere(1, 24);
};

p.render = function(p) {
	this.shader.bind();
	this.shader.uniform("position", "uniform3fv", vec3.clone(p.position) || [0, 0, 0]);
	this.shader.uniform("scale", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("color", "uniform3fv", vec3.clone(p.color));
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewDot;