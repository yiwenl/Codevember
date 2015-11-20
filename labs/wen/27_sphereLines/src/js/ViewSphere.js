// ViewSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphere() {
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, glslify('../shaders/sphere.vert'), glslify('../shaders/sphere.frag'));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;

	this.mesh = bongiovi.MeshUtils.createSphere(params.sphereSize, 25);
};

p.render = function(texture) {
	this.shader.bind();
	if(texture) {
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);	
	}
	this.shader.uniform("color", "uniform3fv", [.1, .1, .1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;