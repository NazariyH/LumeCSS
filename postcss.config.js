const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
    plugins: [
        purgecss({
            content: [
                './index.html'
            ],
            safelist: [
                'safelist-class',  // Add any classes you want to keep
                'active',
                'collapsed',
                'show',
                'in-view',
                'removing',
                '@slideInFadeRight',
                '@slideInFadeLeft',
                '@slideInFadeUp',
                '@slideInFadeDown',
                '@fade',
                '@bounce',
            ],
            defaultExtractor: content => content.match(/[A-Za-z0-9-_:\/.]+/g) || [],

            // Remove the keyframes option to allow purging keyframes
            keyframes: false,  // Now unused keyframes will be purged
            fontFace: true,    // Keep font-face rules
        }),
    ],
};
