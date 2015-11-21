// ViewSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphere() {
	this.time = Math.random() * 0xFF;
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, glslify('../shaders/sphere.vert'), glslify('../shaders/sphere.frag'));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;

	this.mesh = bongiovi.MeshUtils.createSphere(params.sphereSize, 50);
};

p.render = function(light) {
	this.time += .1;
	this.shader.bind();
	this.shader.uniform("lightPos", "uniform3fv", light);
	this.shader.uniform("color", "uniform3fv", [.1, .1, .1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	this.shader.uniform("time", "uniform1f", this.time);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;