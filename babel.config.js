const config = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                shippedProposals: true
            }
        ]
    ],
    plugins: [
        'date-fns'
    ]
};

module.exports = config;
