// ViweBelt.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBelt() {
	// bongiovi.View.call(this, glslify('../shaders/belt.vert'), bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, glslify('../shaders/belt.vert'), glslify('../shaders/belt.frag'));
}

var p = ViewBelt.prototype = new bongiovi.View();
p.constructor = ViewBelt;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	var numX = 100;
	var numZ = 10;
	var count = 0;
	var size = 200;
	var sizeZ = size * .1;

	function getPosition(i, j) {
		var pos = [0, 0, 0];

		pos[0] = i/numX*size - size*.5;
		pos[2] = j/numZ*sizeZ - sizeZ*.5;

		return pos;
	}


	for(var j=0; j<numZ; j++) {
		for(var i=0; i<numX; i++) {
			positions.push(getPosition(i, j+1));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i, j));

			coords.push([i/numX, j/numZ]);
			coords.push([(i+1)/numX, j/numZ]);
			coords.push([(i+1)/numX, (j+1)/numZ]);
			coords.push([i/numX, (j+1)/numZ]);

			indices.push(count*4 + 0);
			indices.push(count*4 + 1);
			indices.push(count*4 + 2);
			indices.push(count*4 + 0);
			indices.push(count*4 + 2);
			indices.push(count*4 + 3);

			count ++;
		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(textureHeight, textureNormal, position, uvy) {
	this.shader.bind();
	this.shader.uniform("textureHeight", "uniform1i", 0);
	textureHeight.bind(0);
	this.shader.uniform("textureNormal", "uniform1i", 1);
	textureNormal.bind(1);

	this.shader.uniform("position", "uniform3fv", position);
	this.shader.uniform("height", "uniform1f", params.height);
	this.shader.uniform("uvy", "uniform1f", uvy || 0.5);
	GL.draw(this.mesh);
};

module.exports = ViewBelt;