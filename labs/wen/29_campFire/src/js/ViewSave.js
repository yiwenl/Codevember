// ViewSave.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var random = function(min, max) { return min + Math.random() * (max - min);	};

function ViewSave() {
	bongiovi.View.call(this, glslify("../shaders/save.vert"), glslify("../shaders/save.frag"));
}

var p = ViewSave.prototype = new bongiovi.View();
p.constructor = ViewSave;


p._init = function() {
	gl = GL.gl;

	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;

	var numParticles = params.numParticles;
	var totalParticles = numParticles * numParticles;
	console.log('Total Particles : ', totalParticles);
	var ux, uy;
	var range = 200.0;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			//	r, y, theta
			var r = random(10, 200);
			var y = random(-range, range);
			var t = Math.random() * Math.PI * 2.0;

			positions.push([r, y, t]);

			ux = i/numParticles-1.0 - .5/numParticles;
			uy = j/numParticles-1.0 - .5/numParticles;
			coords.push([ux, uy]);
			indices.push(count);
			count ++;

			positions.push([Math.random(), Math.random(), Math.random()]);

			coords.push([ux+1.0, uy+1.0]);
			indices.push(count);
			count ++;

		}
	}


	// this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	this.shader.bind();
	GL.draw(this.mesh);
};

module.exports = ViewSave;