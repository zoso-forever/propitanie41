module.exports = {
    '*.js': [
        'npm run lint:js',
        'git add'
    ],
    '*.scss': [
        'stylelint --fix',
        'git add'
    ]
};
