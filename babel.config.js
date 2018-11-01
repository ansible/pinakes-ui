module.exports = function (api) {
    const presets = [
        '@babel/env',
        '@babel/react',
        '@babel/flow'
    ];
    const plugins = [ '@babel/plugin-transform-runtime',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        'lodash'
    ];

    api.cache(true);
    return {
        presets,
        plugins
    };
};
