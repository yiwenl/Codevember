import '../scss/global.scss';
import alfrid, { GL } from 'alfrid';
import AssetsLoader from 'assets-loader';
import dat from 'dat-gui';
import Stats from 'stats.js';

import vs from '../shaders/raymarching.vert';
import fs from '../shaders/raymarching.frag';

const getAsset = function(id) {	
	return window.assets.find( (a) => a.id === id).file;	
}

window.params = {
	roughness:1,
	specular:0.5,
	metallic:0.0,
	gamma:2.2,
	exposure:5,
	fov:Math.PI/2
};

const assets = [
	{ id:'noise', url:'assets/img/noise.png'},
	{ id:'radiance', url:'assets/img/studio_radiance.dds', type: 'binary' },
	{ id:'irr_posx', url:'assets/img/irr_posx.hdr', type:'binary' },
	{ id:'irr_posx', url:'assets/img/irr_posx.hdr', type:'binary' },
	{ id:'irr_posy', url:'assets/img/irr_posy.hdr', type:'binary' },
	{ id:'irr_posz', url:'assets/img/irr_posz.hdr', type:'binary' },
	{ id:'irr_negx', url:'assets/img/irr_negx.hdr', type:'binary' },
	{ id:'irr_negy', url:'assets/img/irr_negy.hdr', type:'binary' },
	{ id:'irr_negz', url:'assets/img/irr_negz.hdr', type:'binary' },
];

let shader, mesh, globalTime = Math.random() * 10000, stats, orbControl;
let textureIrr, textureRad, textureNoise;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('DOMContentLoaded', _init);


function _init() {

	//	LOADING ASSETS
	if(assets.length > 0) {
		document.body.classList.add('isLoading');

		const loader = new AssetsLoader({assets:assets})
		.on('error', (error)=>{console.log('Error :', error);})
		.on('progress', (p) => {document.body.querySelector('.Loading-Bar').style.width = `${(p * 100)}%`;})
		.on('complete', _onImageLoaded)
		.start();

	} else {
		_init3D();
	}

	window.addEventListener('mousemove', (e) => {
		mouseX = (e.clientX/window.innerWidth - 0.5) * 2.0;
		mouseY = (e.clientY/window.innerHeight - 0.5) * 2.0;
	});
	window.addEventListener('resize', resize);
}


function _onImageLoaded(o) {
	//	ASSETS
	console.log('Image Loaded : ', o);
	window.assets = o;
	const loader = document.body.querySelector('.Loading-Bar');
	loader.style.width = '100%';

	_init3D();
	resize();

	setTimeout(()=> {
		document.body.classList.remove('isLoading');
	}, 250);
}


function _init3D() {
	//	CREATE CANVAS
	const canvas = document.createElement('canvas');
	canvas.className = 'Main-Canvas';
	canvas.width = canvas.height = 500;
	document.body.appendChild(canvas);

	//	INIT 3D TOOL
	GL.init(canvas);

	//	INIT DAT-GUI
	window.gui = new dat.GUI({ width:300 });
	// gui.add(params, 'fov', 0.01, 2.0);

	gui.add(params, 'roughness', 0, 1);
	gui.add(params, 'specular', 0, 1);
	gui.add(params, 'metallic', 0, 1);

	gui.add(params, 'gamma', 1, 5);
	gui.add(params, 'exposure', 1, 15);


	//	INIT TEXTURES
	let irr_posx = alfrid.HDRLoader.parse(getAsset('irr_posx'));
	let irr_negx = alfrid.HDRLoader.parse(getAsset('irr_negx'));
	let irr_posy = alfrid.HDRLoader.parse(getAsset('irr_posy'));
	let irr_negy = alfrid.HDRLoader.parse(getAsset('irr_negy'));
	let irr_posz = alfrid.HDRLoader.parse(getAsset('irr_posz'));
	let irr_negz = alfrid.HDRLoader.parse(getAsset('irr_negz'));

	textureIrr = new alfrid.GLCubeTexture([irr_posx, irr_negx, irr_posy, irr_negy, irr_posz, irr_negz]);
	textureRad = alfrid.GLCubeTexture.parseDDS(getAsset('radiance'));
	textureNoise = new alfrid.GLTexture(getAsset('noise'));


	//	INIT MESH
	mesh = alfrid.Geom.bigTriangle();

	//	INIT shader
	shader = new alfrid.GLShader(vs, fs);

	//	LOOP RENDERING
	alfrid.Scheduler.addEF(() => loop());

	//	ORBITAL CONTROL
	orbControl = new alfrid.OrbitalControl(null, window, 8);
	orbControl.radius.limit(7, 20);
	orbControl.radius.value = 15.0;
	orbControl.rx.value = Math.PI/2 - 0.01;

	//	STATS
	stats = new Stats();
	// document.body.appendChild(stats.domElement);
}


function loop() {
	GL.clear(0, 0, 0, 0);
	globalTime += 0.01;
	// orbControl.ry.value += 0.05;

	shader.bind();
	shader.uniform("uTextureNoise", "uniform1i", 0);
	textureNoise.bind(0);
	shader.uniform('uRadianceMap', 'uniform1i', 1);
	shader.uniform('uIrradianceMap', 'uniform1i', 2);
	textureRad.bind(1);
	textureIrr.bind(2);

	const grey = 0.015;
	shader.uniform('uBaseColor', 'uniform3fv', [grey, grey, grey]);
	shader.uniform('uRoughness', 'uniform1f', params.roughness);
	shader.uniform('uMetallic', 'uniform1f', params.metallic);
	shader.uniform('uSpecular', 'uniform1f', params.specular);

	shader.uniform('uExposure', 'uniform1f', params.exposure);
	shader.uniform('uGamma', 'uniform1f', params.gamma);

	shader.uniform("uAngles", "vec2", [orbControl.rx.value, orbControl.ry.value - Math.PI/2]);
	shader.uniform("uRadius", "float", orbControl.radius.value);

	shader.uniform("uGlobalTime", "float", globalTime);
	shader.uniform("uMouse", "vec2", [mouseX, mouseY]);
	shader.uniform("uAspectRatio", "float", GL.aspectRatio);
	shader.uniform("uFOV", "float", params.fov);
	GL.draw(mesh);

	stats.update();
}


function resize() {
	const width = Math.min(window.innerWidth, window.innerHeight, 600);
	const height = Math.min(window.innerWidth, window.innerHeight, 600);
	GL.setSize(width, height);
	GL.canvas.style.width = `${width}px`;
	GL.canvas.style.height = `${height}px`;
	GL.canvas.style.left = `${(window.innerWidth - width)/2}px`;
	GL.canvas.style.top = `${(window.innerHeight - height)/2}px`;
}