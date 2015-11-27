// ViewTotem.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewTotem() {
	this.ry = 0;
	this.time = 0;
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, glslify("../shaders/totem.vert"), glslify("../shaders/totem.frag"));
}

var p = ViewTotem.prototype = new bongiovi.View();
p.constructor = ViewTotem;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	var l = new bongiovi.ObjLoader();
	l.load('assets/totem.obj', this._onObjLoaded.bind(this), null, false);
};


p._onObjLoaded = function(mesh, o) {
	console.log('OBJ Loaded ', o);
	// this.mesh = mesh;
	var indices = o.indices;
	indices.reverse();
	this.mesh = new bongiovi.Mesh(o.positions.length, o.indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(o.positions);
	this.mesh.bufferTexCoords(o.coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(o.normals, "aNormal", 3);
};

p.render = function(texture) {
	if(!this.mesh) return;
	this.time += .03;
	this.ry += 0.5;
	// console.log(GL.normalMatrix);
	this.shader.bind();
	if(texture){
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);	
	}

	this.shader.uniform("scale", "uniform1f", 10);
	this.shader.uniform("ry", "uniform1f", this.ry);
	this.shader.uniform("time", "uniform1f", this.time);
	// this.shader.uniform("invertMVMatrix", "uniformMatrix3fv", GL.invertMVMatrix);
	// this.shader.uniform("nMtx", "uniformMatrix3fv", GL.normalMatrix);
	
	GL.draw(this.mesh);
};

module.exports = ViewTotem;
