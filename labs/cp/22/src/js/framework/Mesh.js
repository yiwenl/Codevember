//Mesh.js

function Mesh(){};

var p = Mesh.prototype;

var gl = null;

p.init = function(vertexSize, indexSize, drawType){

	gl = window.NS.GL.glContext;

	this.vertexSize = vertexSize;
	this.indexSize = indexSize;
	this.drawType = drawType;
	this.extraAttributes = [];

	this.textureUsed = false;

	this._floatArrayVertex = undefined;
};

p.bufferVertex = function(aryVertices) {
	var vertices = [];

	for(var i=0; i<aryVertices.length; i++) {
		for(var j=0; j<aryVertices[i].length; j++) vertices.push(aryVertices[i][j]);
	}

	if(this.vBufferPos == undefined ) this.vBufferPos = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferPos);

	if(this._floatArrayVertex == undefined) this._floatArrayVertex = new Float32Array(vertices);
	else {
		if(aryVertices.length != this._floatArrayVertex.length) this._floatArrayVertex = new Float32Array(vertices);
		else {
			for(var i=0;i<aryVertices.length; i++) {
				this._floatArrayVertex[i] = aryVertices[i];
			}
		}
	}

	gl.bufferData(gl.ARRAY_BUFFER, this._floatArrayVertex, gl.STATIC_DRAW);
	this.vBufferPos.itemSize = 3;
};


p.bufferTexCoords = function(aryTexCoords) {
	var coords = [];

	this.textureUsed = true;

	for(var i=0; i<aryTexCoords.length; i++) {
		for(var j=0; j<aryTexCoords[i].length; j++) coords.push(aryTexCoords[i][j]);
	}

	this.vBufferUV = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferUV);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
	this.vBufferUV.itemSize = 2;
};


p.bufferData = function(data, name, itemSize) {
	var index = -1
	for(var i=0; i<this.extraAttributes.length; i++) {
		if(this.extraAttributes[i].name == name) {
			this.extraAttributes[i].data = data;
			index = i;
			break;
		}
	}

	var bufferData = [];
	for(var i=0; i<data.length; i++) {
		for(var j=0; j<data[i].length; j++) bufferData.push(data[i][j]);
	}

	if(index == -1) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		var floatArray = new Float32Array(bufferData);
		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
		this.extraAttributes.push({name:name, data:data, itemSize:itemSize, buffer:buffer, floatArray:floatArray});
	} else {
		var buffer = this.extraAttributes[index].buffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		var floatArray = this.extraAttributes[index].floatArray;
		for(var i=0;i<bufferData.length; i++) {
			floatArray[i] = bufferData[i];
		}
		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
	}
	
};


p.bufferIndices = function(aryIndices) {
	this.iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryIndices), gl.STATIC_DRAW);
	this.iBuffer.itemSize = 1;
	this.iBuffer.numItems = aryIndices.length;
};

// var vertexBufferObject = gl.createBuffer();
// 	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
	  


// if (object.perVertexColor){
// 	colorBufferObject = gl.createBuffer();
// 	gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);
// 	object.cbo = colorBufferObject;
// }

// var indexBufferObject = gl.createBuffer();
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW);

// object.vbo = vertexBufferObject;
// object.ibo = indexBufferObject;
// object.nbo = normalBufferObject;

// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
// gl.bindBuffer(gl.ARRAY_BUFFER,null);

// p.bufferVertex = function(aryVertices) {
// 	var vertices = [];

// 	// this.vBufferPos = gl.createBuffer();
// 	// gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferPos);
// 	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryVertices), gl.STATIC_DRAW);

// 	// for(var i=0; i<aryVertices.length; i++) {
// 	// 	for(var j=0; j<aryVertices[i].length; j++) vertices.push(aryVertices[i][j]);
// 	// }

// 	// if(this.vBufferPos == undefined ) this.vBufferPos = gl.createBuffer();
// 	// gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferPos);

// 	// if(this._floatArrayVertex == undefined) this._floatArrayVertex = new Float32Array(vertices);
// 	// else {
// 	// 	if(aryVertices.length != this._floatArrayVertex.length) this._floatArrayVertex = new Float32Array(vertices);
// 	// 	else {
// 	// 		for(var i=0;i<aryVertices.length; i++) {
// 	// 			this._floatArrayVertex[i] = aryVertices[i];
// 	// 		}
// 	// 	}
// 	// }

// 	// gl.bufferData(gl.ARRAY_BUFFER, this._floatArrayVertex, gl.STATIC_DRAW);
// 	this.vBufferPos.itemSize = 3;
// };


// p.bufferTexCoords = function(aryTexCoords) {
// 	var coords = [];

// 	// for(var i=0; i<aryTexCoords.length; i++) {
// 	// 	for(var j=0; j<aryTexCoords[i].length; j++) coords.push(aryTexCoords[i][j]);
// 	// }

// 	this.vBufferUV = gl.createBuffer();
// 	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferUV);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryTexCoords), gl.STATIC_DRAW);
// 	this.vBufferUV.itemSize = 2;
// };


// p.bufferData = function(data, name, itemSize) {
// 	var index = -1
// 	for(var i=0; i<this.extraAttributes.length; i++) {
// 		if(this.extraAttributes[i].name == name) {
// 			this.extraAttributes[i].data = data;
// 			index = i;
// 			break;
// 		}
// 	}

// 	var bufferData = [];
// 	for(var i=0; i<data.length; i++) {
// 		for(var j=0; j<data[i].length; j++) bufferData.push(data[i][j]);
// 	}

// 	if(index == -1) {
// 		var buffer = gl.createBuffer();
// 		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 		var floatArray = new Float32Array(bufferData);
// 		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
// 		this.extraAttributes.push({name:name, data:data, itemSize:itemSize, buffer:buffer, floatArray:floatArray});
// 	} else {
// 		var buffer = this.extraAttributes[index].buffer;
// 		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 		var floatArray = this.extraAttributes[index].floatArray;
// 		for(var i=0;i<bufferData.length; i++) {
// 			floatArray[i] = bufferData[i];
// 		}
// 		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
// 	}
	
// };


// p.bufferIndices = function(aryIndices) {
// 	this.iBuffer = gl.createBuffer();
// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
// 	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryIndices), gl.STATIC_DRAW);
// 	this.iBuffer.itemSize = 1;
// 	this.iBuffer.numItems = aryIndices.length;

// };


// // var vertexBufferObject = gl.createBuffer();
// // 	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
// // 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
	  
	

// // 	var indexBufferObject = gl.createBuffer();
// // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
// // 	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW);


module.exports = Mesh;