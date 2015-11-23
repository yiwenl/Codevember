// ViewRibbon.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewRibbon() {
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, glslify("../shaders/ribbon.vert"), glslify("../shaders/ribbon.frag"));
}

var p = ViewRibbon.prototype = new bongiovi.View();
p.constructor = ViewRibbon;


p.createRibbon = function() {
	var num = params.ribbonLength;
	var ribbonSize = random(params.ribbonSize*.01, params.ribbonSize);
	var numParticle = params.numParticles;
	var ux = (this.index % numParticle) / numParticle;
	var uy = Math.floor(this.index/numParticle) / numParticle;
	var size = Math.random() * 5;

	for(var i=0; i<num; i++) {
		this.positions.push([i*size, -ribbonSize, 0]);
		this.positions.push([(i+1)*size, -ribbonSize, 0]);
		this.positions.push([(i+1)*size,  ribbonSize, 0]);
		this.positions.push([i*size,  ribbonSize, 0]);
	
		this.coords.push([i/num, 0]);
		this.coords.push([(i+1)/num, 0]);
		this.coords.push([(i+1)/num, 1]);
		this.coords.push([i/num, 1]);

		this.indices.push(this.count * 4 + 0);
		this.indices.push(this.count * 4 + 1);
		this.indices.push(this.count * 4 + 2);
		this.indices.push(this.count * 4 + 0);
		this.indices.push(this.count * 4 + 2);
		this.indices.push(this.count * 4 + 3);

		this.uv.push([ux, uy, i]);
		this.uv.push([ux, uy, i+1]);
		this.uv.push([ux, uy, i+1]);
		this.uv.push([ux, uy, i]);

		this.count++;
	}
	this.index ++;
};


p._init = function() {
	gl = GL.gl;
	this.positions = [];
	this.coords    = [];
	this.indices   = []; 
	this.uv 	   = [];
	this.count 	   = 0;
	this.index     = 0;

	var total = params.numParticles * params.numParticles;

	for(var i=0; i<total; i++) {
		this.createRibbon();	
	}
	
	console.log('TOTAL :', total, this.positions.length);
	this.mesh = new bongiovi.Mesh(this.positions.length, this.indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(this.positions);
	this.mesh.bufferTexCoords(this.coords);
	this.mesh.bufferIndices(this.indices);
	this.mesh.bufferData(this.uv, "aPositionUV", 3);
};

p.render = function(fbos) {
	this.shader.bind();

	for(var i=0; i<fbos.length; i++) {
		this.shader.uniform("texture"+i, "uniform1i", i);
		fbos[i].getTexture().bind(i);
	}
	this.shader.uniform("range", "uniform1f", params.range);
	GL.draw(this.mesh);
};

module.exports = ViewRibbon;