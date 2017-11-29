// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';
import Wave from './Wave';
const numHits = 48;
const s = 6;

class ViewFloor extends alfrid.View {
	
	constructor() {
		const _fs = fs.replace('{NUM_WAVES}', numHits);
		super(vs, _fs);


		this._waves = [];
		for(let i=0; i<numHits; i++) {
			const wave = new Wave();
			this._waves.push(wave);
		}


		this._preHit = vec3.create();
	}


	_init() {
		
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
	}

	addTouch(mHit) {
		const dist = vec3.dist(this._preHit, mHit)
		if(dist < .5) {
			return;
		}

		const wave = this._waves.shift();
		wave.launch(mHit);
		this._waves.push(wave);

		vec3.copy(this._preHit, mHit);
	}

	render() {
		this._waveCenter = [];
		this._waveData = [];
		this._waves.forEach(wave => {
			this._waveCenter.push(wave.center[0], wave.center[1], wave.center[2]);
			this._waveData.push(wave.waveFront.value, wave.waveLength, wave.waveHeight);
		});


		this.shader.bind();
		this.shader.uniform("uWaveCenters", "vec3", this._waveCenter);
		this.shader.uniform("uWaveDatas", "vec3", this._waveData);


		const numx = 2;
		const numz = 4;
		const sx = -numx/2 * s + s/2;
		const sz = -numz/2 * s + s/2;
		for(let i=0; i<numx; i++) {
			for(let j=0; j<numz; j++) {
				let x = s * i + sx;
				let z = s * j + sz;

				this.shader.uniform("uPosOffset", "vec3", [x, 0, z]);
				GL.draw(this.mesh);
			}
		}		

		// this.shader.uniform("uPosOffset", "vec3", [0, 0, -12]);
		// GL.draw(this.mesh);

		

		// this.shader.uniform("uPosOffset", "vec3", [0, 0, 12]);
		// GL.draw(this.mesh);
	}


}

export default ViewFloor;