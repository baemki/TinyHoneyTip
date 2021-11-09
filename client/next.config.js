const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        domains: [
            'cdn.discordapp.com',
            'thtimg.s3.ap-northeast-2.amazonaws.com',
            'openweathermap.org',
            'ggultip.com',
            'k.kakaocdn.net',
        ],
    },
    reactStrictMode: true,
    node: {
        fs: 'empty',
    },
    future: { webpack5: false },
    webpack: (config) => {
        config.plugins.push(new Dotenv({ silent: true }));

        return config;
    },
};
