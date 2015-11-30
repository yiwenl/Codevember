// ViewFloor.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewFloor() {
	// bongiovi.View.call(this, bongiovi.ShaderLibs.get('generalVert'), bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, bongiovi.ShaderLibs.get('generalVert'), glslify("../shaders/floor.frag"));
}

var p = ViewFloor.prototype = new bongiovi.View();
p.constructor = ViewFloor;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var size = 1000;
	this.mesh = bongiovi.MeshUtils.createPlane(size, size, 1, false, 'xz');
};

p.render = function() {
	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	// texture.bind(0);

	this.shader.uniform("scale", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("position", "uniform3fv", [0, params.floorY, 0]);
	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewFloor;