import '../scss/global.scss';
import debugPolyfill from './debugPolyfill';
import alfrid, { GL } from 'alfrid';
import SceneApp from './SceneApp';
import AssetsLoader from 'assets-loader';

import assets from './asset-list';
import Assets from './Assets';

if(document.body) {
	_init();
} else {
	window.addEventListener('DOMContentLoaded', _init);
}

var random = function(min, max) { return min + Math.random() * (max - min);	}

window.params = {
	gamma:2.2,
	exposure:5,
	cubeSize:random(.75, .9),
	boundary:{
		x:1,
		y:2,
		z:1.5
	},
	offset:1,
	light:[3.7904903888702393, 2.6533432006835938, 1.8952451944351196]
};

function _init() {

	//	LOADING ASSETS
	if(assets.length > 0) {
		document.body.classList.add('isLoading');

		const loader = new AssetsLoader({
			assets:assets
		})
		.on('error', (error)=>{
			console.log('Error :', error);
		})
		.on('progress', (p) => {
			// console.log('Progress : ', p);
			const loader = document.body.querySelector('.Loading-Bar');
			if(loader) loader.style.width = `${(p * 100)}%`;
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
	console.log('Loader :', loader);
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
	GL.init(canvas, {ignoreWebgl2:true});

	//	INIT ASSETS
	Assets.init();

	//	CREATE SCENE
	const scene = new SceneApp();

	gui.add(params, 'offset', 0, 1);
}