// ViewRibbon.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewRibbon() {
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, null, glslify("../shaders/ribbon.frag"));
}

var p = ViewRibbon.prototype = new bongiovi.View();
p.constructor = ViewRibbon;


p._init = function() {
	gl = GL.gl;
	
};


p._updateMesh = function(line) {
	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;
	var left = line.left;
	var right = line.right;

	for(var i=0; i<left.length; i++) {
		positions.push(left[i]);
		coords.push([i/left.length, 0]);
		indices.push(count);
		count++;

		positions.push(right[i]);
		coords.push([i/left.length, 0]);
		indices.push(count);
		count++;
	}

	if(!this.mesh) {
		this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLE_STRIP);	
	}
	this.mesh.bufferVertex(positions, gl.DYNAMIC_DRAW);
	this.mesh.bufferTexCoords(coords, gl.DYNAMIC_DRAW);
	this.mesh.bufferIndices(indices, gl.DYNAMIC_DRAW);
};

p.render = function(line) {
	this._updateMesh(line);
	this.shader.bind();
	this.shader.uniform("color", "uniform3fv", [1, 1, .96]);
	this.shader.uniform("opacity", "uniform1f", 1);
	// this.shader.uniform("texture", "uniform1i", 0);
	// texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewRibbon;