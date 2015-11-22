//ViewBox_fbo.js

var View = require('./framework/View');
var Mesh = require('./framework/Mesh');

function ViewBoxFBO(){};

var p = ViewBoxFBO.prototype = new View();
var s = View.prototype;

var gl = null;

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	this.rowIndex = undefined;
	
	this.centerPos = [];

	this.location = [0,0,0];

	this._lastTimestamp = Date.now();
	this._duration = 6000;

	this.angle = 0;
	this.rotate = false;

	this.moveZ = 0.01;

};

p.initMesh = function(){

	var positions = [];
	var coords = [];
	var indices = [];
	var colors = [];

	var width = 1;
	var height = .5;
	var depth = 1;

	var baseColor = [32/255, 100/255, 122/255];

	var leftX = this.location[0];
	var rightX = leftX + width;

	var topZ = this.location[2];
	var bottomZ = this.location[2] + depth;
	
	//FRONTWALL
	positions.push([leftX, -height, topZ]);
	positions.push([leftX, height, topZ]);
	positions.push([rightX, height, topZ]);

	positions.push([rightX, -height, topZ]);
	positions.push([rightX, height, topZ]);
	positions.push([leftX, -height, topZ]);

	for (var i=0;i<6;i++){
		colors.push(baseColor);
	}

	indices.push(0, 1, 2, 3, 4, 5);

	//LEFT SIDEWALL
	positions.push([leftX, -height, topZ]);
	positions.push([leftX, height, topZ]);
	positions.push([leftX, height, bottomZ]);

	positions.push([leftX, -height, bottomZ]);
	positions.push([leftX, height, bottomZ]);
	positions.push([leftX, -height, topZ]);

	for (var i=0;i<6;i++){
		colors.push(baseColor);
	}

	indices.push(6, 7, 8, 9, 10, 11);

	//RIGHT SIDEWALL
	positions.push([rightX, -height, topZ]);
	positions.push([rightX, height, topZ]);
	positions.push([rightX, height, bottomZ]);

	positions.push([rightX, -height, bottomZ]);
	positions.push([rightX, height, bottomZ]);
	positions.push([rightX, -height, topZ]);

	for (var i=0;i<6;i++){
		colors.push(baseColor);
	}

	indices.push(12, 13, 14, 15, 16, 17);

	//BACKWALL
	positions.push([leftX, -height, bottomZ]);
	positions.push([leftX, height, bottomZ]);
	positions.push([rightX, height, bottomZ]);

	positions.push([rightX, -height, bottomZ]);
	positions.push([rightX, height, bottomZ]);
	positions.push([leftX, -height, bottomZ]);

	for (var i=0;i<6;i++){
		colors.push(baseColor);
	}

	indices.push(18, 19, 20, 21, 22, 23);


	

	var bottomRight = {};
	bottomRight.x = this.location[0] + width;
	bottomRight.y = this.location[1];
	bottomRight.z = this.location[2] + depth;

	var centerPos = {};
	centerPos.x = (this.location[0] + bottomRight.x) / 2;
	centerPos.y = (this.location[1] + bottomRight.y) / 2;
	centerPos.z = (this.location[2] + bottomRight.z) / 2;
	
	for (var i=0;i<24;i++){
		this.centerPos.push([centerPos.x, centerPos.y, centerPos.z]);
	}


	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	// this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(colors, "aVertexColor", 3);
	this.mesh.bufferData(this.centerPos, "aCenter", 3);

	// debugger;
};

p.setLocation = function(loc){

	this.location = loc;

	this.moveZ = 0;
	this.originZ = this.location[2];

	this.initMesh();

};



p.render = function(now) {

	this.transforms.calculateModelView();

	var mvMatrix = this.transforms.getMvMatrix();

	var nMatrix = mat4.create();

	mat4.scale(mvMatrix, mvMatrix, [1,1,-1]);

	mat4.copy(nMatrix, mvMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);

	var diff = now - this._lastTimestamp;
	if (diff >= this._duration){
		this._lastTimestamp = now;

		// diff = now - this._lastTimestamp;
		this.angle = 0;
		
	}

	var normalized = diff / this._duration;
	var zVal = (normalized - .2) * 15;

	// console.log(normalized);

	// var test = 0.1 * this.rowIndex;
	if (normalized > 0.2 && normalized < 0.45)
		this.angle += this.angleWeight * this.angleAxis * (normalized * 7);
	else if (normalized >= 0.5 && normalized <= 0.9)
		this.angle += this.angleWeight * this.reverseAngleAxis * (normalized * 5);
	// else
	// 	this.angle = 0;
	// zVal += this.rowIndex;

	// console.log(this.angle);

	// if (zVal > 10)
	// 	this._lastTimestamp = now;

    mat4.translate(mvMatrix, mvMatrix, [ 0, 0, zVal ]);
	this.shader.bind();



	
	// if ((this.location[2]) >= 2)
	// 	this.location[2] = -2;

	// console.log(this.location[2]);

	// console.log

	// if (this.rotate)
	// 	this.angle -= .2;
	this.shader.uniform("uNMatrix", "uniformMatrix4fv", nMatrix);
	this.shader.uniform("axisAngle", "uniform4fv", new Float32Array([0,1,0,this.angle]));
	this.shader.uniform("meshPos", "uniform3fv", new Float32Array(this.location));
	this.shader.uniform("time", "uniform1f", Date.now());
	
	this.draw(this.mesh);

	// this.transforms.pop();
};

module.exports = ViewBoxFBO;