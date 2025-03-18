const path = require('path');

module.exports = {
    entry: './src/main.js', // Entry point (your main compiled JS file)
    output: {
        filename: 'silly-lang.js', // Output file name
        path: path.resolve(__dirname, 'compiled_js'), // Output directory
    },
    mode: 'production', // Use 'development' for debugging
    target: 'node', // Target Node.js environment
};