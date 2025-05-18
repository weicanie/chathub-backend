const madge = require('madge');
const path = require('path');
const fs = require('fs');

try {
	fs.unlinkSync(path.join(process.cwd(), '../dependency-graph.svg'), err => {
		if (err) {
			console.log(err);
		}
	});
} catch (error) {
	console.log('Error: ', error);
}

const writtenImagePath = path.join(process.cwd(), '../dependency-graph.svg');
madge('../src/main.ts', {
	excludeRegExp: ['.*\.(dto|d|controller|service|gateway)\.ts$', 'utils.ts', 'decorator.ts']
})
	.then(res => res.image(writtenImagePath))
	.then(writtenPath => {
		console.log('Image written to ' + writtenPath);
	});
