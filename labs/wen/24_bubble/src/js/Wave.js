// Wave.js
var random = function(min, max) { return min + Math.random() * (max - min);	}

function Wave() {
	this.center = [.5, .5];
	this.waveFront = .0;
	this.duration = random(1000, 2000);
	this.waveLength = random(.01, .02);
	this.waveHeight = random(2, 4) ;
	this.tween;
}


var p = Wave.prototype;

p.start = function(x, y) {
	this.center = [x, y];
	this.tween = new TWEEN.Tween(this).to({"waveFront":1, "waveHeight":0}, this.duration).easing(TWEEN.Easing.Cubic.Out).start();
	return this;
};


module.exports = Wave;