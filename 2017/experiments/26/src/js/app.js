import '../scss/global.scss';
import alfrid, { GL } from 'alfrid';
import SceneApp from './SceneApp';
import AssetsLoader from 'assets-loader';
import dat from 'dat-gui';
import Stats from 'stats.js';
import assets from './asset-list';
import Assets from './Assets';

window.params = {
	numParticles:90,
	skipCount:10,
	maxRadius: 8,
	lightPos:[1.0, .8, .5]
};

if(document.body) {
	_init();
} else {
	window.addEventListener('DOMContentLoaded', _init);	
}

console.log(' Num particles : ', params.numParticles * params.numParticles);

function _init() {

	//	LOADING ASSETS
	if(assets.length > 0) {
		document.body.classList.add('isLoading');

		const loader = new AssetsLoader({
			assets
		}).on('error', (error) => {
			console.error(error);
		}).on('progress', (p) => {
			// console.log('Progress : ', p);
			const loader = document.body.querySelector('.Loading-Bar');
			if(loader) loader.style.width = `${(p * 100).toFixed(2)}%`;
		})
			.on('complete', _onImageLoaded)
			.start();	
	} else {
		_init3D();
	}

}


function _onImageLoaded(o) {
	//	ASSETS
	console.log('Image Loaded : ', o);
	window.assets = o;
	const loader = document.body.querySelector('.Loading-Bar');
	loader.style.width = '100%';

	_init3D();

	setTimeout(()=> {
		document.body.classList.remove('isLoading');
	}, 250);
}


function _init3D() {
	
	//	CREATE CANVAS
	const canvas = document.createElement('canvas');
	canvas.className = 'Main-Canvas';
	document.body.appendChild(canvas);

	//	INIT 3D TOOL
	GL.init(canvas, { ignoreWebgl2:true });

	//	INIT ASSETS
	Assets.init();

	//	CREATE SCENE
	const scene = new SceneApp();

}