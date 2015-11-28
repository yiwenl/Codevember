(function(){

	var Light = function(){};

	if (!window.NS.GL.Framework)
		window.NS.GL.Framework = {};

	window.NS.GL.Framework.Light = Light;

	var p = Light.prototype;

	p.init = function(){

		this.position = [0.0,0.0,0.0];
		this.ambient = [0.0,0.0,0.0,0.0];
		this.diffuse = [0.0,0.0,0.0,0.0];
		this.specular = [0.0,0.0,0.0,0.0];
	};

	p.setAmbient = function(ambient){

		this.ambient = ambient.slice(0);
	};

	p.setSpecular = function(specular){

		this.specular = specular.slice(0);

	};

	p.setPosition = function(pos){

		this.position = pos.slice(0);
	};

	p.setDiffuse = function(diffuse){

		this.diffuse = diffuse.slice(0);

	};
	
})();