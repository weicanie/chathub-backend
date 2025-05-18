const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const swaggerRegex = /@Api.*?(?=@|async)/gms;

/**
 * Recursively finds and processes .controller.ts files.
 * @param {string} currentPath
 */
function processFiles(currentPath) {
	try {
		const stats = fs.statSync(currentPath);

		if (stats.isDirectory()) {
			// If it's a directory, read its contents and process each item
			const items = fs.readdirSync(currentPath);
			items.forEach(item => {
				processFiles(path.join(currentPath, item));
			});
		} else if (stats.isFile() && currentPath.endsWith('.controller.ts')) {
			// If it's a .controller.ts file, process it
			console.log(`Processing file: ${currentPath}`);
			try {
				let content = fs.readFileSync(currentPath, 'utf8');
				const originalContent = content; // Keep original for comparison
				content = content.replace(swaggerRegex, '');

				// Remove empty lines
				content = content.replace(/^\s*[\r\n]/gm, '');

				if (content !== originalContent) {
					fs.writeFileSync(currentPath, content, 'utf8');
					console.log(`  -> Updated: ${currentPath}`);
				} else {
					console.log(`  -> No changes needed for: ${currentPath}`);
				}
			} catch (fileError) {
				console.error(`Error processing file ${currentPath}:`, fileError);
			}
		}
	} catch (error) {
		console.error(`Error accessing path ${currentPath}:`, error);
	}
}

console.log(`Starting decorator removal in: ${srcDir}`);
processFiles(srcDir);
console.log('Decorator removal process finished.');
