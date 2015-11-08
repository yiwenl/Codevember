// LogoAnimation.js

var Stroke = require("./Stroke");

var Chars = {};
Chars.C = 
[{
	angles:[-Math.PI-Math.PI/2, -Math.PI/2],
	radius:.2
},{
	angles:[-Math.PI/2, -Math.PI/2],
	radius:0
}];

Chars.O = 
[{
	angles:[-Math.PI-Math.PI/2, -Math.PI/2],
	radius:.2
},{
	angles:[-Math.PI-Math.PI/2,  Math.PI/2],
	radius:.2
}];

Chars.D = 
[{
	angles:[-Math.PI/2, -Math.PI/2],
	radius:0
},{
	angles:[-Math.PI/2,  Math.PI/2],
	radius:.2
}];

Chars.E = 
[{
	angles:[-Math.PI, 0],
	radius:.2
},{
	angles:[-Math.PI-Math.PI/2, -Math.PI],
	radius:.4
}];

Chars.V = 
[{
	angles:[-Math.PI-Math.PI/2, -Math.PI/2 - Math.PI/4],
	radius:.4
},{
	angles:[ -Math.PI/4, Math.PI/2],
	radius:.4
}];

Chars.M = 
[{
	angles:[-Math.PI-Math.PI/2+Math.PI/4, -Math.PI/2],
	radius:0.4
},{
	angles:[ -Math.PI/2, Math.PI/2-Math.PI/4],
	radius:0.4
}];

Chars.B = 
[{
	angles:[-Math.PI-Math.PI/2, -Math.PI/2],
	radius:0.4
},{
	angles:[ 0, Math.PI/2],
	radius:0.4
}];

Chars.R = 
[{
	angles:[-Math.PI-Math.PI/2, -Math.PI/2],
	radius:.2
},{
	angles:[-Math.PI/2, Math.PI/4],
	radius:.2
}];


var characters = ['C', 'O', 'D', 'E', 'V', 'E', 'M', 'B', 'E', 'R'];
// var characters = ['O', 'D'];

function LogoAnimation(canvas) {
	this._canvas = canvas;
	this._ctx = this._canvas.getContext('2d');

	this._init();
}

var p = LogoAnimation.prototype;

p._init = function() {
	this.stroke0 = new Stroke();
	this.stroke1 = new Stroke();
	this.index = 0;
	this.nextChar();

	bongiovi.Scheduler.addEF(this, this._loop);
};

p.nextChar = function() {
	this.setCharacter(Chars[characters[this.index]]);

	this.index++;
	if(this.index >= characters.length) {
		this.index = 0;
	}

	bongiovi.Scheduler.delay(this, this.nextChar, null, 2000);
};


p.setCharacter = function(C) {
	var c0 = C[0];
	var c1 = C[1];

	this.stroke0.setRadius(c0.radius);
	this.stroke0.setAngle(c0.angles[0], c0.angles[1]);
	this.stroke1.setRadius(c1.radius);
	this.stroke1.setAngle(c1.angles[0], c1.angles[1]);
};


p._loop = function() {
	var w = this._canvas.width;
	var h = this._canvas.height;	

	this._ctx.clearRect(0, 0, w, h);
	this._drawBackground();
	this._drawStrokes();
};


p._drawStrokes = function() {
	var w = this._canvas.width;
	var h = this._canvas.height;	
	var angles = this.stroke0.getAngles();
	var r = this.stroke0.getRadius();
	this._ctx.beginPath();
	this._ctx.strokeStyle = '#fff';
	this._ctx.lineWidth = w * r;
	this._ctx.arc(w/2, h/2, w*(.4-r/2), angles[0], angles[1]);
	this._ctx.stroke();	
	

	angles = this.stroke1.getAngles();
	r = this.stroke1.getRadius();
	this._ctx.beginPath();
	this._ctx.strokeStyle = '#fff';
	this._ctx.lineWidth = w * r;
	this._ctx.arc(w/2, h/2, w*(.4-r/2), angles[0], angles[1]);
	this._ctx.stroke();	
	
};


p._drawBackground = function() {
	var w = this._canvas.width;
	var h = this._canvas.height;	

	this._ctx.beginPath();
	this._ctx.fillStyle = '#333';
	this._ctx.arc(w/2, h/2,w*.4,0,2*Math.PI);
	this._ctx.fill();
	// this._ctx.stroke();
};

module.exports = LogoAnimation;