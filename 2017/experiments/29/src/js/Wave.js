// Wave.js

import alfrid from 'alfrid';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class Wave {
	constructor() {
		this.center = vec3.create(999, 999, 999);
		this.waveLength = random(1, 2);
		this.waveHeight = random(.5, 1);
		this.waveFront = new alfrid.TweenNumber(-this.waveLength, 'linear');
	}

	launch(mCenter) {
		vec3.copy(this.center, mCenter);
		this.waveLength = random(1, 2) * 0.1;
		this.waveHeight = 1;
		this.waveFront = new alfrid.TweenNumber(-this.waveLength, 'linear', random(0.01, 0.02) * 0.1);

		this.waveFront.value = 30;
	}

}

export default Wave;