// ViewDot.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewDot() {
	bongiovi.View.call(this, glslify("../shaders/dot.vert"), glslify("../shaders/dot.frag"));
}

var p = ViewDot.prototype = new bongiovi.View();
p.constructor = ViewDot;


p._init = function() {
	gl = GL.gl;
	var size = 7.0;
	this.mesh = bongiovi.MeshUtils.createPlane(size, size, 1);
};

p.render = function(pos, texture) {
	this.shader.bind();
	this.shader.uniform("position", "uniform3fv", pos);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewDot;