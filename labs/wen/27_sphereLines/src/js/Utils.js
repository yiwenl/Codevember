// Utils.js

var glm = bongiovi.glm;
var vec3 = glm.vec3;
var mat4 = glm.mat4;
var quat = glm.quat;

var Utils = {};


Utils.getLinePoints = function(points, width) {
	width = width === undefined ? params.ribbonWidth : width;
	var left = [];
	var right = [];
	var curr, next, dir = vec3.create(), axis = vec3.create(), q = quat.create();

	for(var i=0; i<points.length-1; i++) {
		curr = points[i];
		next = points[i+1];
		vec3.subtract(dir, next, curr);
		vec3.normalize(axis, curr);
		vec3.normalize(dir, dir);

		var l = vec3.clone(dir);
		vec3.scale(l, l, width);
		quat.setAxisAngle(q, axis, -Math.PI/2);
		vec3.transformQuat(l, l, q);
		vec3.add(l, l, curr);
		left.push(l);

		var r = vec3.clone(dir);
		vec3.scale(r, r, width);
		quat.setAxisAngle(q, axis, Math.PI/2);
		vec3.transformQuat(r, r, q);
		vec3.add(r, r, curr);
		right.push(r);
	}


	return {left:left, right:right};
}


module.exports = Utils;