const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
    plugins: [
        require('postcss-preset-env')(),
        purgecss({
            content: [
                './app.vue',
                './static/**/*.html',
                './nuxt.config.ts',
                './pages/**/*.vue',
                './components/**/*.vue',
                './layouts/**/*.vue',

                './index.html' 
            ],
            safelist: [
                'safelist-class', 'active', 'collapsed', 'show', 'in-view', 'removing', 'show-password',
                'hide-password', '@slideInFadeRight', '@slideInFadeLeft', '@slideInFadeUp',
                '@slideInFadeDown', '@fade', '@bounce', 'theme-light', 'theme-dark'
            ],
            whitelistPatterns: [/lumcecss/],
            defaultExtractor: content => content.match(/[A-Za-z0-9-_:\/.]+/g) || [],
            keyframes: false,
            fontFace: true,
        }),
    ],
};
