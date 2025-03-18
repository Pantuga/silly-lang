const path = require('path');

module.exports = {
    entry: './compiled_js/main.js', // Entry point (your main compiled JS file)
    output: {
        filename: 'silly-lang.js', // Output file name
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    mode: 'production', // Use 'development' for debugging
    target: 'node', // Target Node.js environment
};