// SoundCloudLoader.js

function SoundCloudLoader(trackID) {
	this.trackID = trackID;
	this._init();
}

var p = SoundCloudLoader.prototype;
p.constructor = SoundCloudLoader;


p._init = function() {
	this.player = new Audio();
	var context = new AudioContext();
	this.ctx = context;
	var url = 'http://api.soundcloud.com/tracks/'+this.trackID+'/stream?client_id=6abd749b05c83c4a7cde544d694fb0fc';
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	var that = this;
	request.addEventListener('load', function() {

		context.decodeAudioData(
			request.response,
			function(buffer) {
				var source = context.createBufferSource();
				that.source = source;
			  	source.buffer = buffer;
			  	console.log(source)
				source.connect(context.destination);
				source.start(0,0);
			  	that._onLoaded();
			}
		);

		
	});
	request.send();
};


p._onLoaded = function() {
	this.analyser = this.ctx.createAnalyser();
	this.source.connect(this.analyser);
	this.analyser.fftSize = 256;
	this.analyser.smoothingTimeConstant = 0.3;
	var bufferLength = this.analyser.frequencyBinCount;
	this.frequencyData = new Uint8Array(bufferLength);
	bongiovi.Scheduler.addEF(this, this._loop);
};


p._loop = function() {
	this.analyser.getByteFrequencyData(this.frequencyData);
};


p.getSoundData = function() {
	return this.frequencyData;
};


module.exports = SoundCloudLoader;