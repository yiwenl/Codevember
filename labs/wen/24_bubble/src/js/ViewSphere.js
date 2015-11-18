// ViewSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var Wave = require("./Wave");
var MAX_WAVES = 10;
var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewSphere() {
	MAX_WAVES = params.maxWaves;
	this.waves = [];
	bongiovi.View.call(this, glslify("../shaders/sphere.vert"), glslify("../shaders/sphere.frag"));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = [];
	var numSeg = 60;
	var index = 0;

	for(var i=0; i<numSeg; i++) {
		for( var j=0; j<numSeg; j++) {
			positions.push([i, j+1, numSeg]);
			positions.push([i+1, j+1, numSeg]);
			positions.push([i+1, j, numSeg]);
			positions.push([i, j, numSeg]);

			coords.push([0, 0]);
			coords.push([0, 0]);
			coords.push([0, 0]);
			coords.push([0, 0]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);
			index ++;
		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};


p.addWave = function(volume) {
	var x, y;
	y = Math.random();
	var aspectRatio = GL.aspectRatio;
	x = random(-aspectRatio/2, 1+aspectRatio/2);

	var wave = new Wave().start(x, y);
	wave.waveLength.duration *= (.5 + volume * .5);
	this.waves.push(wave);

	if(this.waves.length > MAX_WAVES) this.waves.shift();
};


p.render = function(texture, exportNormal) {
	this.shader.bind();
	this.shader.uniform("size", "uniform1f", 100);
	this.shader.uniform("exportNormal", "uniform1f", exportNormal ? 1.0 : .0);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	// this.shader.uniform("normalMatrix", "uniformMatrix3fv", GL.normalMatrix);

	var waves = [];

	for(var i=0; i<MAX_WAVES; i++) {
		var wave = this.waves[i];
		if( wave == undefined) {
			waves.push(-5);
			waves.push(0);
		} else {
			waves.push(wave.waveFront);
			waves.push(wave.waveHeight);
		}
	}

	this.shader.uniform("waves", "uniform2fv", waves);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;