// debugPolyfill.js

console.log('GUI:', window.gui);

if(!window.gui) {
	window.gui = {
		add:()=>{

		}
	};	
}

