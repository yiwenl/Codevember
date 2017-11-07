// test.js

console.log('test');

const { exec } = require('child_process');

const cmd = 'open http://dev.goodboydigital.com/client/bbc/dream-team/sprint4/?fastplay=true';


const num = 10;

for(let i=0; i<num; i++) {
	exec(cmd, (err, stdout, stderr) => {
		if(err) {
			console.log('err', err);
		}
	});
}