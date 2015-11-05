// ViewPlane.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPlane() {
	bongiovi.View.call(this, glslify('../shaders/plane.vert'), glslify('../shaders/plane.frag'));
}

var p = ViewPlane.prototype = new bongiovi.View();
p.constructor = ViewPlane;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var normals = [];
	var indices = [0, 1, 2, 0, 2, 3]; 
	var y = 50;

	var w = params.beltLength/2;
	var h = params.beltWidth * params.numBelts/2;

	positions.push([ w, y, -h]);
	positions.push([-w, y, -h]);
	positions.push([-w, y,  h]);
	positions.push([ w, y,  h]);

	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(normals, "aNormal", 3);
};

p.render = function(pos) {
	this.shader.bind();
	this.shader.uniform("position", "uniform3fv", pos || [0, 0, 0]);
	GL.draw(this.mesh);
};

module.exports = ViewPlane;


