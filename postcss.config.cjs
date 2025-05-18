const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
    plugins: [
        require('postcss-preset-env')(),
        purgecss({
            content: [
                './app.vue',  // Vue
                './static/**/*.html',  // HTML files
                './nuxt.config.ts',  // Nuxt
                './pages/**/*.vue',  // Vue
                './components/**/*.vue',  // Vue
                './layouts/**/*.vue',  // Vue
                './index.html',  // HTML
                './src/**/*.jsx',  // React
                './src/**/*.tsx',  // React (with TypeScript)
                './src/**/*.js',  // React (with JS)
                './src/**/*.ts',  // Angular (TypeScript files)
                './src/**/*.html',  // Angular (HTML templates)
                './app/**/*.html',  // Angular
                './app/**/*.ts',  // Angular
            ],
            safelist: [
                'safelist-class', 'active', 'collapsed', 'show', 'in-view', 'removing', 'show-password',
                'hide-password', '@slideInFadeRight', '@slideInFadeLeft', '@slideInFadeUp',
                '@slideInFadeDown', '@fade', '@bounce', 'rotate'
            ],
            whitelistPatterns: [/lumcecss/],
            defaultExtractor: content => content.match(/[A-Za-z0-9-_:\/.]+/g) || [],
            keyframes: false,
            fontFace: true,
        }),
    ],
};
