// ViewBox.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBox() {
	// bongiovi.View.call(this, bongiovi.ShaderLibs.get('generalWithNormalVert'), bongiovi.ShaderLibs.get('simpleColorLighting'));
	bongiovi.View.call(this, glslify('../shaders/cubemap.vert'), glslify('../shaders/cubemap.frag'));
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get('simpleColorFrag'));
}

var p = ViewBox.prototype = new bongiovi.View();
p.constructor = ViewBox;


p._init = function() {
	var size = 200;
	// this.mesh = bongiovi.MeshUtils.createCube(size, size, size, true);
	this.mesh = bongiovi.MeshUtils.createSkyBox(size, true);
};

p.render = function(texture) {
	this.shader.bind();

	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);

	this.shader.uniform("camera", "uniform3fv", GL.camera.position);

	GL.draw(this.mesh);
};

module.exports = ViewBox;