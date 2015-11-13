//ShaderProgram.js

function ShaderProgram(){};

var p = ShaderProgram.prototype;

var gl = null;

p.init = function(vertexShader, fragmentShader){

	gl = window.NS.GL.glContext;

	this.idVertex   = 'vertex';
	this.idFragment = 'fragment';
	// this.getShader(this.idVertex, true);
	// this.getShader(this.idFragment, false);
	this.createShaderProgram(vertexShader, true);
	this.createShaderProgram(fragmentShader, false);
	this.parameters = [];
	// this._isReady = truee;

	

};

p.onShadersLoaded = function(){

	this.prg = gl.createProgram();
	gl.attachShader(this.prg, this.vertexShader);
	gl.attachShader(this.prg, this.fragmentShader);
	gl.linkProgram(this.prg);
	this._isReady = true;	
};

p.getShader = function(id, isVertexShader) {
	var req = new XMLHttpRequest();
	req.hasCompleted = false;
	var self = this;
	req.onreadystatechange = function(e) {
		if(e.target.readyState == 4) self.createShaderProgram(e.target.responseText, isVertexShader)
	};
	req.open("GET", id, true);
	req.send(null);
}


p.createShaderProgram = function(str, isVertexShader) {
	var shader = isVertexShader ? gl.createShader(gl.VERTEX_SHADER) : gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }


    if(isVertexShader) this.vertexShader = shader;
    else this.fragmentShader = shader;

    if(this.vertexShader!=undefined && this.fragmentShader!=undefined) this.onShadersLoaded();
};


p.bind = function() {
	gl.useProgram(this.prg);

	if (!this.prg) debugger;

	if(this.prg.pMatrixUniform == undefined) this.prg.pMatrixUniform = gl.getUniformLocation(this.prg, "uPMatrix");
	if(this.prg.mvMatrixUniform == undefined) this.prg.mvMatrixUniform = gl.getUniformLocation(this.prg, "uMVMatrix");

	// Global.
	// GL.shader 			= this;
	// GL.shader 	= this;

	this.uniformTextures = [];
};


p.uniform = function(name, type, value) {
	if(type == "texture") type = "uniform1i";
	
	var hasUniform = false;
	var oUniform;
	for(var i=0; i<this.parameters.length; i++) {
		oUniform = this.parameters[i];
		if(oUniform.name == name) {
			oUniform.value = value;
			hasUniform = true;
			break;
		}
	}

	if(!hasUniform) {
		this.prg[name] = gl.getUniformLocation(this.prg, name);
		this.parameters.push( {name:name, type:type, value:value, uniformLoc:this.prg[name]} );
	} else {
		this.prg[name] = oUniform.uniformLoc;
	}


	if(type.indexOf("Matrix") == -1) {
		gl[type](this.prg[name], value);
	} else {
		gl[type](this.prg[name], false, value);
	}

	if(type == "uniform1i") {	//	TEXTURE
		this.uniformTextures[value] = this.prg[name];
		// if(name == "textureForce") console.log( "Texture Force : ",  this.uniformTextures[value], value );
	}
}



p.unbind = function() {
	
};

p.isReady = function() {	return this._isReady;	};

module.exports = ShaderProgram;