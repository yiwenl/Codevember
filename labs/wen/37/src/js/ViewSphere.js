// ViewSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphere() {
	// bongiovi.View.call(this, bongiovi.ShaderLibs.get('generalWithNormalVert'), bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, glslify("../shaders/reflect.vert"), glslify("../shaders/reflect.frag"));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createSphere(25, 36*2, true);
};

p.render = function() {
	this.shader.bind();
	this.shader.uniform("camera", "uniform3fv", GL.camera.position);
	// this.shader.uniform("invertMVMatrix", "uniformMatrix3fv", GL.invertMVMatrix);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;