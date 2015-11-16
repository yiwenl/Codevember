// ViewPost.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPost() {
	bongiovi.View.call(this, null, glslify('../shaders/post.frag'));
}

var p = ViewPost.prototype = new bongiovi.View();
p.constructor = ViewPost;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, textureNormal, textureBg, textureOrgNormal) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNormal", "uniform1i", 1);
	textureNormal.bind(1);
	this.shader.uniform("textureBg", "uniform1i", 2);
	textureBg.bind(2);
	this.shader.uniform("textureOrgNormal", "uniform1i", 3);
	textureOrgNormal.bind(3);
	GL.draw(this.mesh);
};

module.exports = ViewPost;