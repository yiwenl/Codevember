// ViewRender.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewRender() {
	this.time = Math.random() * 0xFF;
	bongiovi.View.call(this, glslify("../shaders/render.vert"), glslify("../shaders/render.frag"));
}

var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;


p._init = function() {
	gl = GL.gl;
	var positions    = [];
	var coords       = [];
	var extra		 = [];
	var indices      = []; 
	var count        = 0;
	var numParticles = params.numParticles;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			positions.push([0, 0, 0]);
			extra.push([Math.random(), Math.random(), random(1, 5)])

			ux = i/numParticles;
			uy = j/numParticles;
			coords.push([ux, uy]);
			indices.push(count);
			count ++;

		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(extra, "aExtra", 3);
};

p.render = function(texture, textureMap) {
	this.time += .01;
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureMap", "uniform1i", 1);
	textureMap.bind(1);
	GL.draw(this.mesh);
};

module.exports = ViewRender;