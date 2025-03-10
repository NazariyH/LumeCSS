const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/ts/index.ts', // Entry file (TypeScript)
    output: {
        filename: 'lume.js',  // Output JS file
        path: path.resolve(__dirname, 'dist'),
        library: 'LumeCSS',   // Export the library
        libraryTarget: 'umd',
        globalObject: 'this', // For compatibility with both browser and Node.js environments
    },
    resolve: {
        extensions: ['.ts', '.js', '.scss'], // File types to resolve
    },
    module: {
        rules: [
            // TypeScript loader
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            // SCSS loader
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, // Extract CSS to file
                    'css-loader', // Interprets CSS
                    'sass-loader', // Converts SCSS to CSS
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'lume.css', // Output CSS file
        }),
    ],
    mode: 'production',  // Set to 'development' for dev builds
};
