const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
    plugins: [
        purgecss({
            content: [
                './index.html',
                './src/**/*.{html,ts,tsx,js,jsx}'
            ],
            safelist: ['safelist-class'], // Optional: classes to always keep
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        }),
    ],
};
