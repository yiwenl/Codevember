// ViweBelt.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBelt() {
	bongiovi.View.call(this);
}

var p = ViewBelt.prototype = new bongiovi.View();
p.constructor = ViewBelt;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewBelt;