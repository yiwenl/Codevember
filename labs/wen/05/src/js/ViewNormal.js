// ViewNormal.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewNormal() {
	bongiovi.View.call(this, null, glslify('../shaders/normal.frag'));
}

var p = ViewNormal.prototype = new bongiovi.View();
p.constructor = ViewNormal;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewNormal;