// ViewRender.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewRender() {
	bongiovi.View.call(this, glslify("../shaders/render.vert"), glslify("../shaders/render.frag"));
}

var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;


p._init = function() {
	gl = GL.gl;
	var positions    = [];
	var coords       = [];
	var indices      = []; 
	var count        = 0;
	var numParticles = params.numParticles;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			positions.push([0, 0, 0]);

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
};

p.render = function(texture, textureLight, textureSurface) {

	this.shader.bind();
	this.shader.uniform("time", "uniform1f", window.globalTime);
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("textureLight", "uniform1i", 1);
	this.shader.uniform("textureSurface", "uniform1i", 2);
	this.shader.uniform("noiseOffset", "uniform1f", params.noiseOffset);
	this.shader.uniform("noiseStrength", "uniform1f", params.noiseStrength.value);
	this.shader.uniform("release", "uniform1f", window.releaseOffset);
	this.shader.uniform("bubbleSize", "uniform1f", params.bubbleSize);
	this.shader.uniform("normalMatrix", "uniformMatrix3fv", GL.normalMatrix);
	texture.bind(0);
	textureLight.bind(1);
	textureSurface.bind(2);
	GL.draw(this.mesh);
};

module.exports = ViewRender;