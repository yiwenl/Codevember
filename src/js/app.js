var Model = require("./Model");
var LogoAnimation = require("./LogoAnimation");
var bongiovi = require("./libs/bongiovi.min");

window.bongiovi = bongiovi;

function App() {
	if(document.body) this._init();
	else {
		window.addEventListener("load", this._init.bind(this));
	}
}

var p = App.prototype;

p._init = function() {
	this.model = Model;
	this.iframe = document.body.querySelector('iframe');
	this.buttonTemplate = document.body.querySelector('.ExpButton');
	this.container = document.body.querySelector('.MainContainer');
	this.btnBack = document.body.querySelector('.Button-Back');
	this.btnBack.addEventListener('click', this._onBack.bind(this));
	this._onExpBind = this._onExp.bind(this);

	function getString(value) {
		var s = value.toString();
		while(s.length < 2) {
			s = '0' + s;
		}

		return s;
	}

	for(var i=0; i<this.model.length; i++) {
		var exp = this.model[i];
		var btn = this.buttonTemplate.cloneNode(true);
		btn.querySelector('img').src = exp.cover;
		btn.classList.remove('is-Hidden');
		this.container.appendChild(btn);
		btn.querySelector('.number-index').innerHTML = '/ ' + getString(i+1);
		btn.data = exp;
		btn.addEventListener('click', this._onExpBind);
	}

	var canvas = document.body.querySelectorAll('canvas');
	for(var i=0; i<canvas.length; i++) {
		new LogoAnimation(canvas[i]);
	}

	//	CHECK OPEN PAGE :
	var loc = window.location.href;
	var reg = /#\d+/i;
	var tmp = reg.exec(loc);
	console.log(tmp, this.model.length);
	if(tmp) {
		var index = parseInt(tmp[0].replace('#', ''));
		
		if(index >0 && index <=this.model.length) {
			this.iframe.src = this.model[index-1].path;
			document.body.classList.remove('show-exp');
			document.body.classList.add('show-exp');
		}
	}
};

p._onExp = function(e) {
	this.iframe.src = e.target.data.path;
	
	document.body.classList.remove('show-exp');
	document.body.classList.add('show-exp');
};

p._onBack = function(e) {
	document.body.classList.remove('show-exp');
	bongiovi.Scheduler.delay(this, this.clearExp, null, 1000);
};

p.clearExp = function() {
	this.iframe.src = '';
};


new App();