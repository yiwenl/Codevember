// ViewPyramids.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPyramids() {
	bongiovi.View.call(this, glslify("../shaders/cubes.vert"), glslify("../shaders/balls.frag"));
}

var p = ViewPyramids.prototype = new bongiovi.View();
p.constructor = ViewPyramids;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 


	// function add


	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture, exportNormal) {
	exportNormal = exportNormal === undefined ? false : exportNormal;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("exportNormal", "uniform1f", exportNormal ? 1 : 0);
	texture.bind(0);

	for(var i=0; i<this._dots.length; i++) {
		var d = this._dots[i];
		this.shader.uniform("position", "uniform3fv", d.finalPos);
		this.shader.uniform("axis", "uniform3fv", d.axis);
		this.shader.uniform("angle", "uniform1f", d.angle);
		this.shader.uniform("scale", "uniform1f", d.radius);
		this.shader.uniform("normalMatrix", "uniformMatrix3fv", GL.normalMatrix)
		GL.draw(this.mesh);
	}
	
};

module.exports = ViewPyramids;