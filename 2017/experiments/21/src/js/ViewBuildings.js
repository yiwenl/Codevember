// ViewBuildings.js

import alfrid, { GL } from 'alfrid';
import Building from './Building';

import vs from 'shaders/buildings.vert';
import fs from 'shaders/buildings.frag';

import vsDebug from 'shaders/debug.vert';

class ViewBuildings extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.shaderDebug = new alfrid.GLShader(vsDebug, alfrid.ShaderLibs.simpleColorFrag);
		this.shaderDebug.bind();
		this.shaderDebug.uniform({
			color:[0, 0, 0],
			opacity:1
		});
		this.meshCube = alfrid.Geom.cube(1, 1, 1);
	}


	_init() {
		const s = 1;
		this.mesh = alfrid.Geom.plane(s, s, 1);

		const numBuildings = 60;
		this.buildings = [];
		for(let i=0; i<numBuildings; i++) {
			const b = new Building();
			this.buildings.push(b);
		}

		let _positions = [];
		let _scale = [];
		let _extra = [];
		let size, positions;

		this.buildings.forEach( b => {
			size = b.front.size;
			positions = b.front.positions;

			_positions = _positions.concat(positions);
			for(let i=0; i<positions.length; i++) {
				_scale.push([size.w, size.h, 0]);
				_extra.push([Math.random(), Math.random(), Math.random()]);
			}

			size = b.back.size;
			positions = b.back.positions;

			_positions = _positions.concat(positions);
			for(let i=0; i<positions.length; i++) {
				_scale.push([size.w, size.h, Math.PI]);
				_extra.push([Math.random(), Math.random(), Math.random()]);
			}

			size = b.right.size;
			positions = b.right.positions;

			_positions = _positions.concat(positions);
			for(let i=0; i<positions.length; i++) {
				_scale.push([size.w, size.h, Math.PI/2]);
				_extra.push([Math.random(), Math.random(), Math.random()]);
			}

			size = b.left.size;
			positions = b.left.positions;

			_positions = _positions.concat(positions);
			for(let i=0; i<positions.length; i++) {
				_scale.push([size.w, size.h, -Math.PI/2]);
				_extra.push([Math.random(), Math.random(), Math.random()]);
			}
		});

		this.mesh.bufferInstance(_positions, 'aPosOffset');
		this.mesh.bufferInstance(_scale, 'aScale');
		this.mesh.bufferInstance(_extra, 'aExtra');
	}

	debugBuilding() {
		this.shaderDebug.bind();
		this.buildings.forEach( b => {
			this.shaderDebug.uniform("uPosition", "vec3", b.position);
			this.shaderDebug.uniform("uScale", "vec3", b.scale);
			GL.draw(this.meshCube)
		});
	}


	render() {
		this.shader.bind();

		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime);
		GL.draw(this.mesh);
	}


}

export default ViewBuildings;