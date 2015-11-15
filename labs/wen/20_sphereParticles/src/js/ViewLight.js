// ViewLight.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewLight() {
	bongiovi.View.call(this, glslify("../shaders/lightSphere.vert"), glslify("../shaders/lightSphere.frag"));
}

var p = ViewLight.prototype = new bongiovi.View();
p.constructor = ViewLight;


p._init = function() {
	gl = GL.gl;

	this.mesh = bongiovi.MeshUtils.createSphere(params.sphereSize+5, 50);
};

p.render = function() {
	this.shader.bind();
	this.shader.uniform("camera", "uniform3fv", GL.camera.position);
	GL.draw(this.mesh);
};

module.exports = ViewLight;