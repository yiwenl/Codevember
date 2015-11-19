// ViewRender.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

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
	var indices      = []; 
	var extra 		 = [];
	var uv 			 = [];
	var count        = 0;
	var numParticles = params.numParticles;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			positions.push([0, 0, 0]);
			extra.push([Math.random(), Math.random(), Math.random()]);
			uv.push([Math.random(), Math.random()]);

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
	this.mesh.bufferData(uv, "aUV", 2);
};

p.render = function(texture, textureParticle, textureColor) {
	this.time += .1;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("textureParticle", "uniform1i", 1);
	this.shader.uniform("textureColor", "uniform1i", 2);
	this.shader.uniform("time", "uniform1f", this.time);
	texture.bind(0);
	textureParticle.bind(1);
	textureColor.bind(2);
	GL.draw(this.mesh);
};

module.exports = ViewRender;