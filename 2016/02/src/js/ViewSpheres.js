// ViewSpheres.js


import alfrid, { GL } from 'alfrid';
import vs from '../shaders/sphere.vert';
import fs from '../shaders/sphere.frag';

class ViewSpheres extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		let strObj = getAsset('objSphere');
		const meshSphere = alfrid.ObjLoader.parse(strObj);
		const vertices = meshSphere.vertices;
		this.mesh = alfrid.Geom.sphere(.05, 24);
		const positionOffset = [];

		function isExist(p) {
			for(let i=0; i<positionOffset.length; i++) {
				const pp = positionOffset[i];

				if(pp[0] == p[0] && pp[1] == p[1] && pp[2] == p[2] ) {
					return true;
				}
			}


			return false;
		}


		for(let i=0; i<vertices.length; i++ ) {
			const p = vertices[i];
			if(!isExist(p)) {
				positionOffset.push(vec3.clone(p));
			}
		}
		this.mesh.bufferInstance(positionOffset, 'aPosOffset');

		// console.log(this.mesh.vertices);

	}


	render() {
		this.time += 0.01;
		this.shader.bind();
		this.shader.uniform("uTime", "float", this.time);
		GL.draw(this.mesh);
	}


}

export default ViewSpheres;