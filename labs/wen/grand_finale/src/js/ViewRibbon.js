// ViewRibbon.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewRibbon() {
	this.time = Math.random() * 0xFF;
	var vs = glslify("../shaders/ribbon.vert");
	vs = vs.replace('{{numTex}}', Math.floor(params.ribbonLength));
	bongiovi.View.call(this, vs, glslify("../shaders/ribbon.frag"));
}

var p = ViewRibbon.prototype = new bongiovi.View();
p.constructor = ViewRibbon;


p.createRibbon = function() {
	var num = params.ribbonLength;
	var ribbonSize = random(params.ribbonSize*.25, params.ribbonSize);
	var numParticle = params.numParticles;
	var ux = (this.index % numParticle) / numParticle;
	var uy = Math.floor(this.index/numParticle) / numParticle;
	var size = 0;
	var rx = Math.random();
	var ry = Math.random();
	var rz = Math.random();

	function getColor() {
		if(Math.random() < .33) {
			return [221/255, 36/255, 37/255];
		} else if(Math.random() < .67) { 
			return [245/255, 176/255, 35/255];
		} else {
			return [0, 0, 0];
		}
	}

	var color = getColor();


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

		var preIndex = i > 0 ? i-1 : 0;

		this.uv.push([ux, uy, i, preIndex]);
		this.uv.push([ux, uy, i+1, preIndex]);
		this.uv.push([ux, uy, i+1, preIndex]);
		this.uv.push([ux, uy, i, preIndex]);

		this.extra.push([rx, ry, rz]);
		this.extra.push([rx, ry, rz]);
		this.extra.push([rx, ry, rz]);
		this.extra.push([rx, ry, rz]);

		this.colors.push(color);
		this.colors.push(color);
		this.colors.push(color);
		this.colors.push(color);

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
	this.colors	   = [];
	this.extra	   = [];
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
	this.mesh.bufferData(this.uv, "aPositionUV", 4);
	this.mesh.bufferData(this.extra, "aExtra", 3);
	this.mesh.bufferData(this.colors, "aColor", 3);
};

p.render = function(fbos, textureMap) {
	this.time += .01;
	this.shader.bind();
	var textures = [];

	for(var i=0; i<fbos.length; i++) {
		this.shader.uniform("texture"+i, "uniform1i", i);
		fbos[i].getTexture().bind(i);
	}
	this.shader.uniform("range", "uniform1f", params.range);
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("textureMap", "uniform1i", fbos.length);
	textureMap.bind(fbos.length);
	GL.draw(this.mesh);
};

module.exports = ViewRibbon;