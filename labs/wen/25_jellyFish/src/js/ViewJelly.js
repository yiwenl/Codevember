// ViewJelly.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewJelly() {
	this.time = Math.random() * 0xFF;
	var fs = glslify("../shaders/jelly.frag");
	fs = fs.replace('{{numPoints}}', Math.floor(params.numDots));
	bongiovi.View.call(this, glslify("../shaders/jelly.vert"), fs);
}

var p = ViewJelly.prototype = new bongiovi.View();
p.constructor = ViewJelly;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords    = [];
	var indices   = []; 
	var count 	  = 0;

	var numSeg = 100;
	for(var j=0; j<numSeg; j++)  {
		for(var i=0; i<numSeg; i++) {
			positions.push([i, j+1, numSeg]);
			positions.push([i+1, j+1, numSeg]);
			positions.push([i+1, j, numSeg]);
			positions.push([i, j, numSeg]);

			coords.push([i/numSeg, j/numSeg]);
			coords.push([(i+1)/numSeg, j/numSeg]);
			coords.push([(i+1)/numSeg, (j+1)/numSeg]);
			coords.push([i/numSeg, (j+1)/numSeg]);

			indices.push(count*4 + 0);
			indices.push(count*4 + 1);
			indices.push(count*4 + 2);
			indices.push(count*4 + 0);
			indices.push(count*4 + 2);
			indices.push(count*4 + 3);

			count ++;
		}
	}

	// console.log(positions.length, indices.length);
	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(dots, texture) {
	this.time += .01;
	this.shader.bind();

	var points = [];
	for(var i=0; i<dots.length; i++) {
		var d = dots[i];
		points.push(d.finalPos[0]);
		points.push(d.finalPos[1]);
		points.push(d.finalPos[2]);
	}

	this.shader.uniform("radius", "uniform1f", params.sphereSize);
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("points", "uniform3fv", points);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewJelly;