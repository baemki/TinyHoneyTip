const Dotenv = require('dotenv-webpack');

module.exports = {
    images: {
        domains: ['cdn.discordapp.com', 'thtimg.s3.ap-northeast-2.amazonaws.com', 'openweathermap.org', 'ggultip.com'],
    },
    reactStrictMode: true,
    node: {
        fs: 'empty',
    },
    future: { webpack5: false },
    webpack: (config) => {
        // 기존의 웹팩 플러그인에 새로운 Dotenv플러그인을 연결시켜준다.
        // silent는 옵션은 .env파일을 찾지 못했을 때 에러를 일으키지 않도록 설정해주는 옵션이다.
        config.plugins.push(new Dotenv({ silent: true }));

        return config;
    },
    // future: { webpack5: false },
};
