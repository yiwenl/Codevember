// ViewTop.js

var GL = bongiovi.GL;
var gl;
var vec2 = bongiovi.glm.vec2;
var glslify = require("glslify");

function ViewTop() {
	bongiovi.View.call(this, null, bongiovi.ShaderLibs.get('simpleColorFrag'));
}

var p = ViewTop.prototype = new bongiovi.View();
p.constructor = ViewTop;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;
	var num = 80;
	var size = 30;

	function exponentialIn(t) {
	  return t == 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
	}

	function exponentialOut(t) {
	  return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
	}

	function smoothstep (min, max, value) {
		var x = Math.max(0, Math.min(1, (value-min)/(max-min)));	
		return x*x*(3 - 2*x);
	}


	function getPosition(i, j) {
		var pos = [0, 0, 0];
		var rx  = j/num * Math.PI - Math.PI/2;
		var ry  = i/num * Math.PI * 2.0;
		pos[1]  = Math.sin(rx) * size;
		var r   = Math.cos(rx) * size;
		pos[0]  = Math.cos(ry) * r;
		pos[2]  = Math.sin(ry) * r;
		var v = vec2.fromValues(pos[0], pos[2]);
		vec2.normalize(v, v);

		var center = -size/3;
		var ss;
		var range;
		if(pos[1] > center) {
			range = size + size/3;
			ss = 1.0 - (pos[1] - center) / range;
			ss = Math.pow(ss, 4.0);
		} else {
			range = size + center;
			ss = 1.0 - (center - pos[1]) / range;
			ss = Math.pow(ss, 2.0);
		}

		ss = ss * .9 + .1;
		ss = smoothstep(0.0, 1.0, ss);
		
		// ss = smoothstep(0.0, .9, ss) * .95 + .05;

		vec2.scale(v, v, ss * size);



		pos[0] = v[0];
		pos[2] = v[1];

 		return pos;
	}

	for(var j=0; j<num; j++) {
		for(var i=0; i<num; i++) {
			positions.push(getPosition(i, j+1));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i, j));

			coords.push([0, 0]);
			coords.push([0, 0]);
			coords.push([0, 0]);
			coords.push([0, 0]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;
		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	// texture.bind(0);
	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewTop;