//View.js

var ShaderProgram = require('./ShaderProgram');

function View(){};

var p = View.prototype;

var gl = null;

p.init = function(strVert, strFrag){

	gl = window.NS.GL.glContext;

	if(strVert == undefined) return;
	this.shader = new ShaderProgram();
	this.shader.init(strVert, strFrag);

	this.transforms = null;

	this._enabledVertexAttrib = [];
};

p.draw = function(mesh){

	// this.transforms.calculateModelView();

	gl.uniformMatrix4fv(this.shader.prg.pMatrixUniform, false, this.transforms.getProjectionMatrix());
	gl.uniformMatrix4fv(this.shader.prg.mvMatrixUniform, false, this.transforms.getMvMatrix());
	

	// 	VERTEX POSITIONS
	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vBufferPos);
	var vertexPositionAttribute = getAttribLoc(gl, this.shader.prg, "aVertexPosition");
	gl.vertexAttribPointer(vertexPositionAttribute, mesh.vBufferPos.itemSize, gl.FLOAT, gl.FALSE, 0, 0);
	if(this._enabledVertexAttrib.indexOf(vertexPositionAttribute) == -1) {
		gl.enableVertexAttribArray(vertexPositionAttribute);
		this._enabledVertexAttrib.push(vertexPositionAttribute);
	}

	

	if (mesh.textureUsed){
		//		TEXTURE COORDS
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vBufferUV);
		var textureCoordAttribute = getAttribLoc(gl, this.shader.prg, "aTextureCoord");
		gl.vertexAttribPointer(textureCoordAttribute, mesh.vBufferUV.itemSize, gl.FLOAT, gl.FALSE, 0, 0);
		// gl.enableVertexAttribArray(textureCoordAttribute);
		if(this._enabledVertexAttrib.indexOf(textureCoordAttribute) == -1) {
			gl.enableVertexAttribArray(textureCoordAttribute);
			this._enabledVertexAttrib.push(textureCoordAttribute);
		}
	}
	

	//	INDICES
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.iBuffer);

	//	EXTRA ATTRIBUTES
	for(var i=0; i<mesh.extraAttributes.length; i++) {
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.extraAttributes[i].buffer);
		var attrPosition = getAttribLoc(gl, this.shader.prg, mesh.extraAttributes[i].name);
		gl.vertexAttribPointer(attrPosition, mesh.extraAttributes[i].itemSize, gl.FLOAT, gl.FALSE, 0, 0);
		gl.enableVertexAttribArray(attrPosition);		

		if(this._enabledVertexAttrib.indexOf(attrPosition) == -1) {
			gl.enableVertexAttribArray(attrPosition);
			this._enabledVertexAttrib.push(attrPosition);
		}
	}

	//	DRAWING
	// gl.drawElements(mesh.drawType, mesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
	if(mesh.drawType == gl.POINTS ) {
		gl.drawArrays(mesh.drawType, 0, mesh.vertexSize);	
	} else{
		gl.drawElements(mesh.drawType, mesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	} 


	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	

	function getAttribLoc(gl, shaderProgram, name) {
		if(shaderProgram.cacheAttribLoc  == undefined) shaderProgram.cacheAttribLoc = {};
		if(shaderProgram.cacheAttribLoc[name] == undefined) {
			shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name);
		}

		return shaderProgram.cacheAttribLoc[name];
	}
};

module.exports = View;