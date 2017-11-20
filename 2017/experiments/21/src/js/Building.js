// Building.js

var random = function(min, max) { return min + Math.random() * (max - min);	}

const positions = [];
const radius = 30;

class Building {
	constructor() {
		this.width = random(.5, 1);
		this.height = random(1.5, 5);
		this.depth = random(.5, 1);

		
		function getPos() {
			let r = Math.sqrt(Math.random() * radius);
			let a = Math.random() * Math.PI * 2.0;

			return [Math.cos(a) * r, 0.0, Math.sin(a) * r];
		}

		function dist(a, b) {
			let dx = a[0] - b[0];
			let dz = a[2] - b[2];
			return Math.sqrt(dx * dx + dz * dz);
		}

		function checkPos(v) {
			let tooClose = false;
			positions.forEach( p => {
				let d = dist(p, v);
				if(d < 1) {
					tooClose = true;
				}
			});

			return tooClose;
		}

		let pos;
		let numTries = 0;
		do {
			pos = getPos();
		} while(checkPos(pos) && numTries++ < 100);
		if(numTries > 90) {
			console.log('Too many tries');
		}

		positions.push(vec3.clone(pos));

		pos[1] = this.height/2;
		this.position = pos;
		this.scale = [this.width, this.height, this.depth];


		const numX = Math.random() > .5 ? 2 : 3;
		const numZ = Math.random() > .5 ? 2 : 3;
		const numY = Math.floor(this.height / .2);
		
		let w, h, d, x, y ,z;
		let mx, my, mz;

		this.front = {};
		this.back = {};
		this.left = {};
		this.right = {};
		w = (this.width - random(.2, .4))/numX;
		h = (this.height - random(.6, .8))/numY;
		d = (this.depth - random(.2, .4))/numZ;

		mx = (this.width - w * numX) / (numX + 1);
		my = (this.height - h * numY) / (numY + 1);
		mz = (this.depth - d * numZ) / (numZ + 1);

		this.front.size = { w, h }
		this.back.size = { w, h }
		this.right.size = { w:d, h }
		this.left.size = { w:d, h }

		this.front.positions = [];
		this.back.positions = [];
		this.right.positions = [];
		this.left.positions = [];

		for(let i=0; i<numX; i++) {
			for(let j=0; j<numY; j++) {
				x = mx + (w + mx) * i + w/2;
				y = my + (h + my) * j + h/2;
				z = this.depth/2 + 0.001;
				this.front.positions.push([x + this.x - this.width/2, y, z + this.z]);
				this.back.positions.push([x + this.x - this.width/2, y, -z + this.z]);
			}
		}

		for(let i=0; i<numZ; i++) {
			for(let j=0; j<numY; j++) {
				x = this.width/2 + 0.001
				y = my + (h + my) * j + h/2;
				z = mz + (d + mz) * i + d/2;
				this.right.positions.push([x + this.x, y, z + this.z - this.depth/2])
				this.left.positions.push([-x + this.x, y, z + this.z - this.depth/2])
			}
		}

	}


	get x() {
		return this.position[0];
	}

	get y() {
		return this.position[1];
	}

	get z() {
		return this.position[2];
	}
}


export default Building;