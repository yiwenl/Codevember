// ViewBox.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBox() {
	bongiovi.View.call(this, glslify("../shaders/box.vert"), glslify("../shaders/box.frag"));
}

var p = ViewBox.prototype = new bongiovi.View();
p.constructor = ViewBox;


p._init = function() {
	gl = GL.gl;
	var size = 100;
	this.mesh = bongiovi.MeshUtils.createCube(size, size, size, true);
};

p.render = function(texture, exportNormal) {
	exportNormal = exportNormal === undefined ? true : exportNormal
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("exportNormal", "uniform1f", exportNormal ? 1.0 : 0.0);
	this.shader.uniform("cameraPosition", "uniform3fv", GL.camera.position);
	this.shader.uniform("normalMatrix", "uniformMatrix3fv", GL.normalMatrix);
	GL.draw(this.mesh);
};

module.exports = ViewBox;